// frontend code 
import { session } from 'wix-storage';
import { sendToGoogleSheet } from 'backend/googleSheet.jsw';
import wixLocation from 'wix-location';
import * as run from 'backend/flow.jsw';

$w.onReady(function () {

    // ----------------- initialState -----------------
    $w('#startButton').onClick(() => {
        $w('#multiStateBox').changeState('initialState2');
    });

    // ----------------- initialState2 -----------------
    $w('#state2NextButton').onClick(() => {
        const postalOrCity = $w('#postalOrCityInput').value.trim();
        if (!postalOrCity) {
            $w('#postalOrCityInput').focus();
            return;
        }
        session.setItem('postalOrCity', postalOrCity);
        $w('#multiStateBox').changeState('initialState3');
    });

    $w('#state2PreviousButton').onClick(() => {
        $w('#multiStateBox').changeState('initialState');
    });

    // ----------------- initialState3 -----------------
    const state3OptionButtons = ['#3memberButton', '#4-6memberButton', '#7-12memberButton', '#state3NotYetButton'];
    state3OptionButtons.forEach(buttonId => {
        $w(buttonId).onClick((event) => {
            session.setItem('membersOption', event.target.label);
            $w('#multiStateBox').changeState('initialState4');
        });
    });

    $w('#state3NextButton').onClick(() => {
        $w('#multiStateBox').changeState('initialState4');
    });

    $w('#state3PreviousButton').onClick(() => {
        $w('#multiStateBox').changeState('initialState2');
    });

    // ----------------- initialState4 -----------------
    $w('#state4NextButton').onClick(() => {
        const startDate = $w('#startDatePicker').value;
        const endDate = $w('#endDatePicker').value;
        if (!startDate || !endDate) {
            if (!startDate) $w('#startDatePicker').focus();
            else $w('#endDatePicker').focus();
            return;
        }
        session.setItem('startDate', startDate.toISOString());
        session.setItem('endDate', endDate.toISOString());
        $w('#multiStateBox').changeState('initialState5');
    });

    $w('#state4PreviousButton').onClick(() => {
        $w('#multiStateBox').changeState('initialState3');
    });

    $w('#state4NotYetButton').onClick(() => {
        const startDate = $w('#startDatePicker').value;
        const endDate = $w('#endDatePicker').value;

        session.setItem('startDate', startDate ? startDate.toISOString() : 'Noch nicht sicher');
        session.setItem('endDate', endDate ? endDate.toISOString() : 'Noch nicht sicher');

        $w('#multiStateBox').changeState('initialState5');
    });

    // ----------------- initialState5 -----------------
    $w('#multiStateBox').onChange(() => {
        const currentStateId = $w('#multiStateBox').currentState.id;
        if (currentStateId === 'initialState5') {
            setTimeout(() => {
                $w('#multiStateBox').changeState('initialState6');
            }, 3000);
        }
    });

    function showError(fieldName) {
        // UI element-এ message set করা
        $w('#errorText').text = `${fieldName} is required`;
        $w('#errorText').show();

        // 2 সেকেন্ড পরে hide
        setTimeout(() => {
            $w('#errorText').hide();
        }, 2000); // 2000ms = 2 seconds
    }

    // ----------------- initialState6 -----------------
    $w('#submitButton').onClick(async () => {
        const companyName = $w('#companyNameInput').value.trim();
        const contactPerson = $w('#contactPersonInput').value.trim();
        const telephone = $w('#telephoneNumberInput').value.trim();
        const email = $w('#emailInput').value.trim();

        // Validation logic
        if (!telephone && !email) {
            showError('Bitte geben Sie mindestens eine Telefonnummer oder eine E-Mail Adresse an');
            return; // Stop further processing
        }

        // if (!companyName || !contactPerson || !telephone || !email) {
        //     if (!companyName) showError('Company Name');
        //     else if (!contactPerson) showError('Contact Person');
        //     else if (!telephone) showError('Telephone Number');
        //     else showError('Email');
        //     return;
        // }

        // Disable submit button and change label
        $w('#submitButton').disable();
        $w('#submitButton').label = "Einen Moment warten...";

        // Convert dates to human-readable format
        let startDate = session.getItem('startDate');
        let endDate = session.getItem('endDate');

        if (startDate && startDate !== "Noch nicht sicher") startDate = new Date(startDate).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
        if (endDate && endDate !== "Noch nicht sicher") endDate = new Date(endDate).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });

        const formData = {
            postalOrCity: session.getItem('postalOrCity'),
            membersOption: session.getItem('membersOption'),
            startDate: startDate || "Noch nicht sicher",
            endDate: endDate || "Noch nicht sicher",
            companyName,
            contactPerson,
            telephone,
            email
        };

        // console.log(formData);

        try {

            const emailResult = await run.triggerOrderEmails(formData);
            console.log("success email : ", emailResult)

            const data = await sendToGoogleSheet(formData);

            if (data.result === "success") {
                $w('#companyNameInput').value = "";
                $w('#contactPersonInput').value = "";
                $w('#telephoneNumberInput').value = "";
                $w('#emailInput').value = "";

                console.log("Data saved to Google Sheet successfully!");
                wixLocation.to("/danke");
            } else {
                throw new Error(data.message || "Unknown error");
            }
        } catch (err) {
            console.error("Error saving data:", err);
            // Enable submit button again
            $w('#submitButton').enable();
            $w('#submitButton').label = "Jetzt Angebot erhalten";
            // Optionally show error message
        }
    });
});