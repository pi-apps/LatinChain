## Countimer
Simple **jQuery** plugin to start a basic count up timer on any HTML element.

## Dependencies
* moment.js >= 2.18.1
* jQuery >= 2.1.4

> Make sure you've loaded all dependencies before use the plugin.

## Install
### Using bower or npm
```
bower install --save countimer
npm install --save countimer
```

### Manual
1. Install [jQuery](https://code.jquery.com/) or include `<script type="text/javascript" src="https://code.jquery.com/jquery-3.2.1.min.js"></script>`
2. Install [moment.js](https://momentjs.com/) or include `<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>`
3. Download the library and include it into your HTML code `<script type="text/javascript" src="dist/ez.countimer.min.js"></script>`

## Usage
Add the following block and attach the countimer to desire element:  
```
<script type="text/javascript">
    $( document ).ready(function() {
        $('.timer').countimer();
    });
</script>
```
```
<span class="timer"></span> <br/>
<input class="timer" type="text" value="" name="timer" />
```
The timer will start with the default options.
```
00:00:00
```
You can attach it either on any element who has the **value** attribute or those that work with **text** like a `span`, `div`, `p` and others.

### Options
- displayMode: One of the following display options:
    * In seconds : 0 
    * In minutes: 1
    * In hours: 2
    * Full timer: `3` (**default**)
* enableEvents: For enabling/disabling the timer events (**default** `false`)
* displayMillis: Set to true to display the milliseconds next to the seconds in the full view (**default** `false`) 
* destroyDOMElement: When the plugin is destroyed, it decides whether to remove the HTML element from the DOM or not (**default** `false`)
* autoStart: Auto start the timer when rendered (**default** `true`)
* useHours: Show/Hide the hours (**default** `true`)
* minuteIndicator: A simple string located next to the minutes (**default** `''`)
* secondIndicator: A simple string located next to the seconds (**default** `''`)
* separator: Separator between each time block (**default** `':'`)
* leadingZeros: Number of leading zeros **only*** when the display mode is different to full mode with hours (**default** `2`)
* initHours: Init number of hours (**default** `0`)
* initMinutes: Init number of minutes (**default** `0`)
* initSeconds: Init number of seconds (**default** `0`)

### Display modes
Render the timer as:
* Hours
```
$('.timer').countimer({
    displayMode: 2,
    initHours: 4,
    leadingZeros: 3
});
```
```
004
```
* Minutes
```
$('.timer').countimer({
    displayMode: 1,
    initMinutes: 64,
    leadingZeros: 3,
    minuteIndicator: "'"
});
```
```
064'
```
* Seconds
```
$('.timer').countimer({
    displayMode: 0,
    initSeconds: 3600,
    secondIndicator: '"'
});
```
```
3600"
```
* Full
```
// With hours (default)
$('.timer').countimer({
    initHours: 1,
    initMinutes: 20,
    secondIndicator: '"'
});
```
```
01:20:00"
```
```
// Without hours
$('.timer').countimer({
    useHours: false,
    initHours: 1,
    initMinutes: 20,
    secondIndicator: '"'
});
```
```
// The timer add the init hours into minutes value
80:00"
```

### Init values
You can start the timer with the desired hours, minutes and seconds.  
The countimer will start with the provided data.
```
$('.timer').countimer({
    initHours: 4,
    initMinutes: 50,
    initSeconds: 10
});
```
```
04:50:10 
```
It's possible combine different times on the countimer, it always will print the correct value depending of the selected display mode.
```
// Default display mode
$('.timer').countimer({
    initHours: 2,
    initMinutes: 120,
    initSeconds: 60
});
```
```
04:01:00
```
```
// Timer on minutes
$('.timer').countimer({
    leadingZeros: 4,
    displayMode: 1,
    initHours: 2,
    initMinutes: 120,
    initSeconds: 60,
});
```
```
0241
```

## Methods
The following methods are available to control the countimer instance:
### Start
It starts the countimer using the provided `init` values.  
```
$('.timer').countimer('start');
```
>If the option `autoStart` is true, the timer will start automatically after displayed.
### Resume
Resumes the countimer at the last time when it was stopped.
```
$('.timer').countimer('resume');
```
### Stop
Stops the countimer.
```
$('.timer').countimer('stop');
```
### Stopped
Returns a boolean indicating if the countimer has been stopped or not.
```
$('.timer').countimer('stopped');
```
### Get current time
Returns the current time at the moment when the method was called.
```
$('.timer').countimer('current');
```
When you get the current time, the returned object will contain the formatted and unformatted displayed value, as well the original representation of time.
```
// If the timer was rendered with the default display mode and it has as value: 02:45:08
{
    displayedMode: {
        formatted: '02:45:08',
        unformatted: {
            hours: 2,
            minutes: 45,
            seconds: 8
        }
    },
    original: {
        hours: 2,
        minutes: 45,
        seconds: 8
    }
}
```
```
// If the timer was rendered with the default display mode, the option "useHours" is false and it has as value: 120:04
{
    displayedMode: {
        formatted: '120:04',
        unformatted: {
            minutes: 120,
            seconds: 4
        }
    },
    original: {
        hours: 2,
        minutes: 0,
        seconds: 4
    }
}
```
### Destroy
Destroys the current plugin instance and all the attachment events on it
```
$('.timer').countimer('destroy');
```

> The methods `start`, `resume` and `stop` are chainables, it means you can do something like that: `$('.timer').countimer('stop').current();`

## Events
By default the countimer events are disabled in order not to call them every second, minute or hour.  
If you really want to use them, then set the option `enableEvents` to true.
* Every hour
```
$('.timer').countimer({
    enableEvents: true
}).on('hour', function(evt, time){
    console.log(time);
});
```
* Every minute
```
$('.timer').countimer({
    enableEvents: true
}).on('minute', function(evt, time){
    console.log(time);
});
```
* Every second
```
$('.timer').countimer({
    enableEvents: true
}).on('second', function(evt, time){
    console.log(time);
});
```

Plugin available under MIT license (See LICENSE file)  

Copyright © 2017 envynoiz
