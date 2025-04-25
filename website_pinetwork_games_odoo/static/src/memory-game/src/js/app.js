(function() {

    var menu = {
        container: document.querySelector('#menu'),
        buttons: document.querySelectorAll('#menu button')
    };
    var time = {
        container: document.querySelector('#time'),
        current: document.querySelector('#time-current'),
        best: document.querySelector('#time-best')
    };
    var gameContainer = document.querySelector('#game-container');
    var endGameButtons = {
        container: document.querySelector('#end-buttons'),
        menu: document.querySelector('#end-menu'),
        tryAgain: document.querySelector('#end-try')
    };
    var modal = {
        background: document.querySelector('#modal-background'),
        container: document.querySelector('#modal-container'),
        text: document.querySelector('#modal-text'),
        button: document.querySelector('#modal-button')
    };

    var levels = {
        easy: {
            numFields: 9,
            numLights: 4,
            showingTime: 1300
        },
        normal: {
            numFields: 16,
            numLights: 6,
            showingTime: 1800
        },
        hard: {
            numFields: 25,
            numLights: 10,
            showingTime: 2300
        }
    }

    // helpers
    function hide(element) {
        element.style.display = 'none';
    }

    function show(element) {
        element.style.display = 'block';
    }

    function convertTime(t) {
        // converts milliseconds in format 'x.yy' seconds.milliseconds(front 2 digits)
        var sec = parseInt(t / 1000);
        var millisec = parseInt((t % 1000) / 10);
        if (millisec < 10)
            millisec = '0' + millisec;

        return sec + '.' + millisec;
    }

    // timer
    var level, timer, localStorageTime, timerInterval;

    function createTimer() {
        timer = 0;
        time.current.innerHTML = convertTime(timer);

        timerInterval = setInterval(function() {
            timer += 10;
            time.current.innerHTML = convertTime(timer);
        }, 10);
    }

    function adjustTimer() {
        timer = 0;
        // read from local storage the best result
        localStorageTime = localStorage.getItem('MemoryGame' + level);

        time.current.innerHTML = '/';
        if (localStorageTime === null)
            time.best.innerHTML = '/';
        else {
            localStorageTime = parseInt(localStorageTime);
            time.best.innerHTML = convertTime(localStorageTime);
        }
    }

    // stop interval and show modal
    function stopTimerAndShowModal(win) {
        clearInterval(timerInterval);

        if (win) {
            modal.text.innerHTML = 'Congratulations, you win!!!';

            if (localStorageTime === null || localStorageTime > timer) {
                modal.text.innerHTML = 'Congratulations, new record!!!';
                time.best.innerHTML = time.current.innerHTML;
                // save in local storage
                localStorage.setItem('MemoryGame' + level, timer);
            }
        } else
            modal.text.innerHTML = 'You lose.';

        setTimeout(function () {
            show(modal.background);
            show(endGameButtons.container);;
        }, win ? 500 : 1000);
    }

    // menu buttons listeners
    menu.buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            hide(menu.container);
            show(gameContainer);
            show(time.container);

            level = button.getAttribute('id');
            adjustTimer();
            Game.start(levels[level], level, gameContainer, createTimer, stopTimerAndShowModal);
        })
    });

    // end buttons listeners
    endGameButtons.menu.addEventListener('click', function () {
        hide(time.container);
        hide(gameContainer);
        hide(endGameButtons.container);
        show(menu.container);
    });
    endGameButtons.tryAgain.addEventListener('click', function () {
        hide(endGameButtons.container);

        adjustTimer();
        Game.restart();
    });

    // modal listeners
    modal.background.addEventListener('click', function () {
        hide(modal.background);
    });
    modal.container.addEventListener('click', function (event) {
        event.stopPropagation();
    });
    modal.button.addEventListener('click', function () {
        hide(modal.background);
    });

}());