import wixData from "wix-data";
import wixLocation from "wix-location";
import { session } from "wix-storage";

let questions = [];
let currentIndex = 0;
let answers = [];
let totalQuestions = 0;

$w.onReady(async function () {
    $w("#errorText").hide();
    $w("#userError").hide();
    $w("#prevBtn").disable();

    // Load questions dynamically from collection
    const result = await wixData
        .query("@khairuloffice259/quizzy/QuizQustionCollection")
        .ascending("order")
        .find();

    questions = result.items;
    totalQuestions = questions.length;
    answers = new Array(totalQuestions).fill(null);

    if (totalQuestions === 0) {
        $w("#questionText").text = "No questions found.";
        $w("#options").disable();
        $w("#nextBtn").disable();
        return;
    }

    showQuestion();

    // Button handlers
    $w("#nextBtn").onClick(() => nextBtn_click());
    $w("#prevBtn").onClick(() => prevBtn_click());
    $w("#submitUserBtn").onClick(() => submitUserInfo());
    $w("#startAssessmentBtn").onClick(() => startAssessmentBtn_click());
});

function showQuestion() {
    const q = questions[currentIndex];
    $w("#qNumberText").text = `Question ${currentIndex + 1} of ${totalQuestions}`;
    $w("#questionText").text = q.questionText || "";

    // Dynamically generate options
    const optionList = [];
    if (q.optionA) optionList.push({ label: q.optionA, value: "A" });
    if (q.optionB) optionList.push({ label: q.optionB, value: "B" });
    if (q.optionC) optionList.push({ label: q.optionC, value: "C" });
    if (q.optionD) optionList.push({ label: q.optionD, value: "D" });

    $w("#options").options = optionList;

    const saved = answers[currentIndex];
    $w("#options").value = saved ? saved : "";

    const progress = ((currentIndex + 1) / totalQuestions) * 100;
    $w("#progressBar").value = progress;
    $w("#progresstext").text = `${Math.round(progress)}% Complete`;

    currentIndex === 0 ? $w("#prevBtn").disable() : $w("#prevBtn").enable();
    $w("#nextBtn").label = currentIndex === totalQuestions - 1 ? "Finish" : "Next";
}

function nextBtn_click() {
    const selected = $w("#options").value;
    if (!selected) {
        $w("#errorText").text = "Please select an option.";
        $w("#errorText").show();
        return;
    }
    $w("#errorText").hide();

    answers[currentIndex] = selected;

    if (currentIndex < totalQuestions - 1) {
        currentIndex++;
        showQuestion();
    } else {
        // Quiz finished → go to user info state
        session.setItem("quizAnswers", JSON.stringify(answers));
        session.setItem("quizQuestions", JSON.stringify(questions));
        $w("#quizMultiStateBox").changeState("userInfoState");
    }
}

function prevBtn_click() {
    if (currentIndex > 0) {
        currentIndex--;
        showQuestion();
    }
}

async function submitUserInfo() {
    const name = $w("#nameInput").value;
    const email = $w("#emailInput").value;
    $w("#userError").hide();

    if (!name || !email) {
        $w("#userError").text = "Please enter name and email.";
        $w("#userError").show();
        return;
    }

    $w("#submitUserBtn").disable();
    $w("#submitUserBtn").label = "Submitting...";

    try {
        const answers = JSON.parse(session.getItem("quizAnswers"));
        const questions = JSON.parse(session.getItem("quizQuestions"));
        let correctCount = 0;

        for (let i = 0; i < questions.length; i++) {
            if (answers[i] && answers[i] === questions[i].correctAnswer) {
                correctCount++;
            }
        }

        const percentage = Math.round((correctCount / questions.length) * 100);

        await wixData.insert("@khairuloffice259/quizzy/QuizResultCollection", {
            name,
            email,
            answers: JSON.stringify(answers),
            score: correctCount,
            totalQuestions: questions.length,
            percentage,
            createdDate: new Date()
        });

        // Save name/email for result display
        session.setItem("quizName", name);
        session.setItem("quizEmail", email);
        session.setItem("quizScore", correctCount.toString());
        session.setItem("quizPercent", percentage.toString());
        session.setItem("quizTotal", questions.length.toString());

        // Redirect to result page
        wixLocation.to("/result");
    } catch (err) {
        console.error("Error saving result:", err);
        $w("#userError").text = "Something went wrong. Please try again.";
        $w("#userError").show();
    } finally {
        $w("#submitUserBtn").enable();
        $w("#submitUserBtn").label = "Submit";
    }
}

export function startAssessmentBtn_click() {
    $w("#quizMultiStateBox").changeState("questionsState");
}