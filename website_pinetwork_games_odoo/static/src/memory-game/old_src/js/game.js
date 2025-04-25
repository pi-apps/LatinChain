(function () {
    var game = $("#game");
    var menu = $("#menu");

    var fields = [];
    var start = false;
    var pressed = 0;
    var level = undefined;
    var gameOptions = {
        numLights: undefined,
        numFields: undefined,
        showingTime: undefined
    };

    var StartGame = function () {
        for (var i = 0; i < gameOptions.numFields; i++) {
            var newFi = $("<div class='field'></div>");
            var newEl = $("<div></div>").addClass("field-" + level).append(newFi);

            game.append(newEl);
            fields.push(newFi);
        }

        var i = 0;
        while (i < gameOptions.numLights) {
            var rand = Math.round(Math.random() * 100) % gameOptions.numFields;

            if (!fields[rand].hasClass("light")) {
                fields[rand].addClass("light");
                i++;
            }
        }

        menu.hide();
        game.show();

        for (var i = 0; i < gameOptions.numFields; i++) {
            if (fields[i].hasClass("light")) {
                fields[i].animate({
                    backgroundColor: "#ffce75"
                }, 1000, function () {
                    $(this).animate({
                        backgroundColor: "#5bc0de"
                    }, gameOptions.showingTime)
                });
            }
        }

        setTimeout(function () {
            start = true;
            $(".field").css("cursor", "pointer");
        }, 1000 + gameOptions.showingTime);
    };

    var RestartGame = function () {
        start = false;
        pressed = 0;
        game.hide();
        menu.show();
        game.empty();
        fields = [];
    };

    var StopAllFields = function () {
        for (var i = 0; i < gameOptions.numFields; i++) {
            fields[i].addClass("stop");
        }
    };

    $("button").click(function () {
        level = $(this).attr("id");

        switch (level) {
            case "easy":
                gameOptions.numFields = 9;
                gameOptions.numLights = 4;
                gameOptions.showingTime = 2500;
                break;
            case "normal":
                gameOptions.numFields = 16;
                gameOptions.numLights = 6;
                gameOptions.showingTime = 3000;
                break;
            case "hard":
            gameOptions.numFields = 25;
                gameOptions.numLights = 10;
                gameOptions.showingTime = 3500;
                break;
        }

        StartGame();
    });

    game.on("click", ".field", function () {
        if (start && !$(this).hasClass("stop")) {
            if ($(this).hasClass("light")) {
                $(this).addClass("stop");
                pressed++;

                if (pressed == gameOptions.numLights) {
                    StopAllFields();
                }

                $(this).animate({
                    backgroundColor: "#ffce75"
                }, 300, function () {
                    if (pressed == gameOptions.numLights) {
                        alert("You win!!");
                        RestartGame();
                    }
                });

            } else {
                StopAllFields();

                $(this).animate({
                    backgroundColor: "#ff5c81"
                }, 700, function () {
                    alert("You lose!!");
                    RestartGame();
                });
            }
        }
    });

    game.on("mouseenter", ".field", function () {
        if (start && !$(this).hasClass("stop"))
            $(this).css("background-color", "#56ccde");
    });

    game.on("mouseleave", ".field", function () {
        if (start && !$(this).hasClass("stop"))
            $(this).css("background-color", "#5bc0de");
    });
})();