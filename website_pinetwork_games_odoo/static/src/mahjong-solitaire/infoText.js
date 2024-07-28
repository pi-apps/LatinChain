let infoTextOpen = false;

$("#infoButton").click(() => {
    if (infoTextOpen) {
        infoTextOpen = false;
        $("#infoText").fadeOut("linear");
        $("#statusText, #hintButton, #restartButton").fadeIn("linear");
        $("#game").animate({ opacity: 1 }, "linear");
    } else {
        infoTextOpen = true;
        $("#infoText").fadeIn("linear");
        $("#statusText, #hintButton, #restartButton").fadeOut("linear");
        $("#game").animate({ opacity: 0.01 }, "linear");
    }
});
