$w.onReady(function () {
    // যখন Net Hire বাটনে ক্লিক হবে
    $w('#netHireButton').onClick(() => {
        $w('#multiStateBox1').changeState("netHireBox");
    });

    // যখন One-to-One Coaching বাটনে ক্লিক হবে
    $w('#oneToOneCoachingButton').onClick(() => {
        $w('#multiStateBox1').changeState("coachingBox");
    });
});