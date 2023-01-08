# Responsive Snake  [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

A Responsive HTML5 Snake Game with a particle explosion on food impact!


## Requirements

  You must have `Zepto` or `jQuery` attached to the Window Global


## Usage

  Install through Bower

  `bower install responsive-snake`

  Customization:

    You may define a width (width="400px") / height (height="400px") on the canvas tag itself
    OR use the data attribute `data-full-screen="true"` for full-screen

  Game Options

    - snakePixels (int) default : 14
        - Snake piece width in pixels
    - snakeSize (int) default : 3
        - How many snake pieces to start with
    - headColor (string) default : transparent
        - Custom Head Color (#ff0000 || rgb(0,0,0))
    - foodColor (string) default : random color
        - Custom Food Color (#ff0000 || rgb(0,0,0))
    - bot (int) default : true
        - Do you want the bot to play when you start the game?
    - timeout (int) default : 1000
        - How long to wait in between game loses
    - explosion (bool) default : true
        - Do you want to particle explosion when food is consumed

  Supported Keys / Touches

    - (swipeUp, swipeDown, swipeLeft, swipeRight) Mobile Touch Events  - Directional
    - (UP/Down/Left/Right) Keyboard Arrow Keys - Directional
    - (O) - Game On/Off
    - (R) - Game Restart
    - (B) - Enable Bot
    - (+) - Increase Snake Frames Per Second
    - (-) - Decrease Snake Frames Per Second
    - (Space Bar) - Pause/Resume Toggle


## Sample Markup

```
<script src="path/to/snake.build.min.js"></script>

<canvas id="snake-canvas" autofocus="autofocus" data-full-screen="true"></canvas>

<div id="scoreboard">
    <div id="score">
        Score :
        <span>0</span>
    </div>

    <div id="hi-score">
        Hi Score :
        <span>0</span>
    </div>

    <div id="bot-hi-score">
        Bot Hi Score :
        <span>0</span>
    </div>
</div>

<script>
    //Start Snake Game
    $(document).ready(function() {
        ResponsiveSnake.start({
            snakePixels    : 14,
            snakeSize      : 4,
            bot            : true,
            explosion      : true
        });
    });
</script>
```

## To View The Example

  visit http://iamchrismiller.github.io/responsive-snake/example/

  OR clone the repo and open the example

  `git clone https://github.com/iamchrismiller/responsive-snake.git`

  `npm install && grunt dev`

  `open http://127.0.0.1:8000/example/`


## Contributing

 In lieu of a formal style-guide, take care to maintain the existing coding style. Lint and test your code using grunt (dev).


## License

 Licensed under the MIT license.


## Release History

 * 2014-06-20   v0.1.5   Added console strip on build
 * 2014-06-20   v0.1.4   Added custom snake head color
 * 2014-06-20   v0.1.3   Added key events for (+/-) Frames Per Second
 * 2014-06-17   v0.1.2   Fixed bot enabled flag
 * 2014-06-17   v0.1.1   Added "play" options, exports for AMD/CommonJS
 * 2014-06-17   v0.1.0   Initial Release

## Author

 Chris Miller

---
