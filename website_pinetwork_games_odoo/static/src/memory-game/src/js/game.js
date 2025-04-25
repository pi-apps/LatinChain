(function () {

    var fields, pressed, gameOptions, level, gameContainer, createTimer, stopTimerAndShowModal;

    function addClass(element, className) {
        element.classList.add(className);
    }

    function removeClass(element, className) {
        element.classList.remove(className);
    }

    function containsClass(element, className) {
        return element.classList.contains(className);
    }

    function stopGame(win) {
        fields.forEach(function (field) {
            removeClass(field, 'allowed');
        });

        stopTimerAndShowModal(win);
    }

    function fieldClickEventListener() {
        // in this case 'this' object is the clicked field element
        if (!containsClass(this, 'allowed'))
            return;

        removeClass(this, 'allowed');

        if (containsClass(this, 'light')) {
            removeClass(this, 'light');
            addClass(this, 'correct-transition');

            pressed++;
            if (pressed == gameOptions.numLights)
                stopGame(true); // win
        } else {
            // lose
            addClass(this, 'wrong-transition');

            setTimeout(function () {
                fields.forEach(function (field) {
                    if (containsClass(field, 'light'))
                        addClass(field, 'miss-transition');
                });
            }, 500);

            stopGame(false);
        }
    }

    function initGame() {
        gameContainer.innerHTML = '';

        fields = [];
        pressed = 0;

        for (var i = 0; i < gameOptions.numFields; i++) {
            // create new field
            var newField = document.createElement('div');
            newField.addEventListener('click', fieldClickEventListener);
            addClass(newField, 'field');
            addClass(newField, 'start');

            // append the new field to the dom
            var newElement = document.createElement('div');
            addClass(newElement, 'field-' + level);
            newElement.appendChild(newField);

            gameContainer.appendChild(newElement);
            fields.push(newField);
        }

        setTimeout(function () {
            // random select fields
            var leftLights = gameOptions.numLights;
            var leftFields = gameOptions.numFields - 1;

            fields.forEach(function (field) {
                if (Math.random() < leftLights / leftFields) {
                    addClass(field, 'light');
                    addClass(field, 'shine');

                    leftLights--;
                }

                leftFields--;
            });
        }, 50); // these 50 ms are to be sure that all fields are loaded in the dom (so the anmation could be done)

        setTimeout(function () {
            // fade choosen fields
            fields.forEach(function (field) {
                removeClass(field, 'shine');
            });
        }, gameOptions.showingTime * 1.3);

        setTimeout(function () {
            // make clickable all fields
            fields.forEach(function (field) {
                removeClass(field, 'start');
                addClass(field, 'allowed');
            });

            createTimer();
        }, gameOptions.showingTime * 2.3);
    }

    function startGame(_gameOptions, _level, _gameContainer, _createTimer, _stopTimerAndShowModal) {
        gameOptions = _gameOptions;
        level = _level;
        gameContainer = _gameContainer;
        createTimer = _createTimer;
        stopTimerAndShowModal = _stopTimerAndShowModal;

        initGame();
    }

    window.Game = {
        start: startGame,
        restart: initGame
    };

}());