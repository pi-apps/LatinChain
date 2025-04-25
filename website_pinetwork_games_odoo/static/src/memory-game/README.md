# Memory Game

A simple responsive and mobile-friendly browser game made using plain JS and CSS.

**[Try it here](https://mtrajk.github.io/memory-game/)**

![alt text](https://raw.githubusercontent.com/MTrajK/memory-game/master/images/game_screenshot.png "Memory game screenshot")

## Goals

### Old

1. Experimenting with GitHub pages.
2. Experimenting with [jQuery](https://jquery.com/). ([You can see the first solution here](https://github.com/MTrajK/memory-game/tree/master/old_src))

### New

But after several years I opened this project again and I noticed that I'm using less than 10 jQuery methods. And for those methods, I'm using 2 libraries ([jQuery](https://jquery.com/) and [jQuery UI](https://jqueryui.com/)) in total **328 KB** (which is nonsense for this kind of app)...\
Because of that, I changed those jQuery methods with vanilla JS and CSS.
* I replaced the famous jQuery dollar sign `$('selector')` with `document.querySelector('selector')`.
* Instead of jQuery `element.animate()` I'm using CSS animations `transition: all 1.3s ease-in-out;`, and after that whenever the background-color is changed there is an animation.
* For manipulating with CSS classes `element.addClass('class')` `element.removeClass('class')` `element.hasClass('class')` I'm using `element.classList.add('class')` `element.classList.remove('class')` `element.classList.contains('class')`.
* For creating elements `$('<div></div>')` I'm using `document.createElement('div')`.
* I replaced `element.show()` and `element.hide()` with `element.style.display = 'block'` and `element.style.display = 'none'`.
* And also I replaced event listeners `element.on('event', function)` with `element.addEventListener('event', function)`.

## License

This project is licensed under the MIT - see the [LICENSE](LICENSE) file for details