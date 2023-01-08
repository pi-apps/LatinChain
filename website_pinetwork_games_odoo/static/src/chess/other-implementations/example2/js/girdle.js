// jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, onevar:true, strict:true, undef:true, unused:strict, curly:true, browser:true, evil:true, node:true

/* global Cookies */

var G = (function ()
{
    "use strict";
    
    var G = {
        remove: function remove(arr, i, order_irrelevant)
        {
            var len = arr.length;
            
            /// Handle negative numbers.
            if (i < 0) {
                i = len + i;
            }
            
            /// If the last element is to be removed, then all we need to do is pop it off.
            ///NOTE: This is always the fastest method and it is orderly too.
            if (i === len - 1) {
                arr.pop();
            /// If the second to last element is to be removed, we can just pop off the last one and replace the second to last one with it.
            ///NOTE: This is always the fastest method and it is orderly too.
            /// Or can use we the faster (but unorderly) method?
            } else if (i === len - 2 || order_irrelevant) {
                if (i >= 0 && i < len) {
                    /// This works by popping off the last array element and using that to replace the element to be removed.
                    arr[i] = arr.pop();
                }
            } else {
                /// The first element can be quickly shifted off.
                ///NOTE: This is faster than splice() but slower than pop().
                if (i === 0) {
                    arr.shift();
                /// Ignore numbers that are still negative.
                ///NOTE: By default, if a number is below the total array count (e.g., G.remove([0,1], -3)), splice() will remove the first element.
                ///      This behavior is undesirable because it is unexpected.
                } else if (i > 0) {
                    /// Use the orderly, but slower, splice method.
                    arr.splice(i, 1);
                }
            }
        },
        
        convert_currency: function convert_currency(money, currency, rates)
        {
            rates = rates || G.exchange_rates;
            
            ///NOTE: USD is the default.
            if (currency && currency.abr !== "USD" && rates && rates[currency.abr]) {
                /// Add the 2% exchange fee.
                money = (money * 1.02) * rates[currency.abr];
            }
            
            return money;
        },
        
        /**
         * cents    (integer)            The amount of money in cents
         * free     (string)  (optional) The response if 0 (e.g., "FREE!")
         * currenct (object)  (optional) An object describing the currency (e.g., {abr: "USD", sym_before: "$", sym_after: ""})
         */
        format_money: function format_money(cents, free, currency, rates)
        {
            var money = cents / 100;
            
            rates = rates || G.exchange_rates;
            
            if (currency && rates && rates[currency.abr]) {
                money = G.convert_currency(money, currency, rates);
            } else {
                /// Clear currency so that that we make sure to default back to USD ($).
                currency = null;
            }
            
            if (isNaN(money)) {
                money = 0;
            }
            
            if (money % 1 !== 0) {
                money = money.toFixed(2);
            }
            
            if (money === 0 && typeof free !== "undefined") {
                return free;
            }
            
            if (currency) {
                return currency.sym_before + money + currency.sym_after;
            } else {
                return "$" + money;
            }
        },
        
        rand: function rand(min, max)
        {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        
        is_object: function is_object(mixed)
        {
            return mixed instanceof Object && !(mixed instanceof Array);
        },
        
        /**
         * Safely parse JSON.
         */
        parse_json: function parse_json(str)
        {
            try {
                return JSON.parse(str);
            } catch (e) {}
        },
        loop: function loop(arr, done, oneach, always_async)
        {
            var len,
                fakesetImmediate_count = 0,
                delay_func = typeof setImmediate === "function" ? setImmediate : function fakesetImmediate(func)
                {
                    fakesetImmediate_count += 1;
                    if (always_async || fakesetImmediate_count >= 200) {
                        fakesetImmediate_count = 0;
                        setTimeout(func, 0);
                    } else {
                        func();
                    }
                };
            
            /// Optionally take an object like {oneach: function (el, next, i) {}, done: function (err) {}}
            if (done && typeof done === "object") {
                oneach = done.oneach;
                always_async = done.always_async;
                ///NOTE: This must be last.
                done = done.done;
            }
            
            if (!Array.isArray(arr)) {
                if (done) {
                    done(new Error("Not an array."));
                }
                return;
            }
            
            len = arr.length;
            
            delay_func(function ()
            {
                (function loop(i)
                {
                    if (i >= len) {
                        if (done) {
                            return done();
                        }
                        return;
                    }
                    
                    oneach(arr[i], function next()
                    {
                        delay_func(function ()
                        {
                            loop(i + 1);
                        });
                    }, i);
                }(0));
            });
        },
        escape_html: function escape_html(str)
        {
            return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
        },
        supplant: function supplant(obj, template)
        {
            /// Match all matching curly brackets, and send them to the function.
            return template.replace(/{([^{}]+)}/g, function onreplace(whole, inside)
            {
                var data = obj[inside];
                return typeof data !== "undefined" ? data : whole;
            });
        }

    };
    ///TODO: Depriciate and remove.
    G.get_random_int = G.rand;
    ///TODO: Depriciate and remove.
    G.array_remove = G.remove;
    ///TODO: Depriciate and remove.
    G.async_loop = G.loop;
    
    /// Is this (probably) a browser?
    if (typeof window === "object") {
        /// Is there a DOM?
        if (typeof window.document === "object") {
            G.cde = function create_dom_el(type, properties, events, children)
            {
                var el = (!type || type === "documentFragment") ? document.createDocumentFragment() : document.createElement(type),
                    prop_sub = {
                        c: "className",
                        t: "textContent",
                    };
                
                /// Make properties and events optional.
                if (Array.isArray(properties) && !events && !children) {
                    children = properties;
                    properties = undefined;
                    events = undefined;
                } else if (Array.isArray(events) && !children) {
                    children = events;
                    events = undefined;
                }
                
                if (G.is_object(properties)) {
                    Object.keys(properties).forEach(function (prop)
                    {
                        var prop_name = prop_sub[prop] || prop;
                        try {
                            if (prop === "nofollow" || prop === "noreferrer" || prop === "colspan" || prop === "list" || prop === "for" || prop.indexOf(":") > -1) {
                                el.setAttribute(prop_name, properties[prop]);
                            } else {
                                el[prop_name] = properties[prop];
                            }
                        } catch (e) {
                            console.log(prop);
                            console.log(e);
                        }
                    });
                }
                
                if (G.is_object(events)) {
                    Object.keys(events).forEach(function (prop)
                    {
                        /// A psuedo event
                        if (prop === "all_on_changes") {
                            el.addEventListener("change", events[prop]);
                            el.addEventListener("keypress", events[prop]);
                            el.addEventListener("keyup", events[prop]);
                        } else {
                            el.addEventListener(prop, events[prop]);
                        }
                    });
                }
                
                if (Array.isArray(children)) {
                    children.forEach(function (child)
                    {
                        if (typeof child === "object") {
                            el.appendChild(child);
                        } else {
                            el.appendChild(document.createTextNode(child));
                        }
                    });
                }
                
                return el;
            };
            
            /// Detect and label mobile devices.
            G.mobile = (function is_it_mobile()
            {
                var mobile = false,
                    regex = /android|ipad|iphone|mobi|tablet|linux\sarmv7l/i; /// Android often has "Linux armv7l" as it's platform.
                
                if (window.navigator) {
                    mobile = regex.test(navigator.userAgent) || regex.test(navigator.platform);
                }
                
                /// Add a flag to the HTML class for CSS detection.
                if (mobile && document.documentElement) {
                    document.documentElement.classList.add("mobile");
                }
                
                return mobile;
            }());
            
            
            /// Identify the browser.
            G.browser = window.opera ? "o" : /// Test for Opera first since it also is now webkit/blink.
                window.chrome || window.navigator.userAgent.indexOf("WebKit/") >= 0 ? "webkit" :
                window.navigator.userAgent.indexOf("Firefox/") >= 0 ? "moz" :
                /MSIE|Trident/.test(navigator.userAgent) ? "ms" : "";
            
            /// Mark for CSS.
            if (G.browser && document.documentElement) {
                document.documentElement.classList.add(G.browser);
            }
            
            /// **************************
            /// * End of window.document *
            /// **************************
        }
        
        try {
            G.has_localStorage = typeof localStorage.getItem === "function";
        } catch (e) {}
        
        G.normalize_mouse_buttons = function normalize_mouse_buttons(e)
        {
            if (e) {
                if (typeof e.which !== "undefined") {
                    return e.which;
                }
                if (typeof e.button !== "undefined") {
                    if (e.button === 0) {
                        return 1;
                    } else if (e.button === 1) {
                        return 4;
                    } else {
                        return e.button;
                    }
                }
            }
        };
        
        if (window.XMLHttpRequest) {
            /**
             * Options
             *   method  (GET)
             *   message
             *   timeout (30000)
             *   retry   (false)
             *   retry_interval (2000)
             *   csrf (defaults to the _csrf cookie on non-GET requests)
             *   headers (an object or array of objects)
             *      [{name: "value"}]
             */
            G.ajax = (function eac()
            {
                function parse_if_json(ajax)
                {
                    var res,
                        type;
                    
                    if (ajax.readyState === 4) {
                        ///NOTE: If the request returned a blob, accesing the responseText property throws an error.
                        if (ajax.responseType === "blob") {
                            res = ajax.response;
                        } else {
                            /// Chrome throws an error if this is called before it's ready.
                            type = ajax.getResponseHeader("Content-Type");
                            ///NOTE: The header may include a charset.
                            if (type && type.indexOf("application/json") > -1) {
                                res = G.parse_json(ajax.responseText);
                            } else {
                                res = ajax.responseText;
                            }
                        }
                    }
                    
                    return res;
                }
                
                return function ajax_func(path, options, cb)
                {
                    var aborted,
                        ajax = new window.XMLHttpRequest(),
                        retrying,
                        retry_timer,
                        query_timer,
                        tried_new_csrf_token;
                    
                    /// Make options optional.
                    if (typeof cb === "undefined" && typeof options === "function") {
                        cb = options;
                        options = {};
                    }
                    
                    ajax.is_busy = function is_busy()
                    {
                        return retrying || Boolean(ajax.readyState % 4);
                    };
                    
                    ajax.orig_abort = ajax.abort;
                    
                    ajax.abort = function better_abort()
                    {
                        if (retrying) {
                            clearTimeout(retry_timer);
                            retrying = false;
                        }
                        
                        if (ajax.is_busy()) {
                            /// Stop it from retrying from a timeout.
                            clearTimeout(query_timer);
                            aborted = true;
                            ajax.orig_abort();
                        }
                        
                        /// Make sure a callback is called.
                        if (ajax.onerror) {
                            ajax.onerror();
                        }
                    };
                    
                    function query()
                    {
                        var method = typeof options.method === "string" ? options.method.toUpperCase() : "GET",
                            message = typeof options.message === "object" ? G.make_params(options.message) : options.message,
                            timeout = options.timeout || 30000, /// Default to 30 seconds.
                            headers = options.headers || [],
                            csrf_token,
                            post_message,
                            csrf_cookie = options.csrf_cookie || "_csrf";
                        
                        aborted = false;
                        
                        function onload()
                        {
                            var err;
                            ///NOTE: Really any 200 level request is good, but I don't think anyone ever uses other codes.
                            if (ajax.status !== 200) {
                                /// Was their (probably) a CRSF token failure and we are handleing CSRF?
                                if (ajax.status === 403 && !options.csrf && !tried_new_csrf_token) {
                                    /// Make sure we don't try this more than once because that won't help.
                                    tried_new_csrf_token = true;
                                    /// First, clear the current bad cookie.
                                    Cookies.expire(csrf_cookie);
                                    /// Next, try to get another cookie and retry the request.
                                    ///TODO: Make an API or something for this.
                                    G.ajax("/get_csrf", {}, query);
                                    /// Stop processing anything else and wait to see if getting a new CSRF token cookie fixes things.
                                    return;
                                }
                                
                                err = {status: ajax.status, aborted: aborted};
                            }
                            
                            if (err && options.retry && !aborted) {
                                retry_timer = setTimeout(query, options.retry_interval || 2000);
                                return;
                            }
                            
                            if (cb) {
                                /// query() is sent back to let the caller retry if desired.
                                /// ajax is also sent back because it can offer extra data, like ajax.status.
                                cb(err, parse_if_json(ajax), query, ajax);
                                /// Make sure it's not called twice. For example, if both onerror and onload are called.
                                cb = null;
                            }
                        }
                        
                        if (method.toUpperCase() === "GET") {
                            /// GET requests need the message appended to the path.
                            ajax.open(method, path + (message ? "?" + message : ""));
                        } else {
                            /// POST requests send the message later on (with .send()).
                            ajax.open(method, path);
                            post_message = message;
                        }
                        
                        if (options.responseType) {
                            ajax.responseType = options.responseType;
                        }
                        
                        /// Prepare headers.
                        if (!Array.isArray(headers)) {
                            headers = [headers];
                        }
                        
                        /// Set default header.
                        headers.push({name: "Content-Type", value: "application/x-www-form-urlencoded"});
                        
                        /// Set CSRF token.
                        if (!options.csrf && method !== "GET") {
                            csrf_token = Cookies.get(csrf_cookie);
                        } else {
                            csrf_token = options.csrf;
                        }
                        if (csrf_token) {
                            headers.push({name: "x-csrf-token", value: csrf_token});
                        }
                        
                        headers.forEach(function oneach(header)
                        {
                            ajax.setRequestHeader(header.name, header.value);
                        });
                        
                        
                        ajax.onerror = onload;
                        ajax.onload  = onload;
                        
                        ajax.send(post_message);
                        
                        if (timeout) {
                            query_timer = setTimeout(function timeout()
                            {
                                ajax.abort();
                            }, timeout);
                        }
                    }
                    
                    options = options || {};
                    
                    query();
                    
                    return ajax;
                };
            }());
            
            ///TODO: Depriciate and remove.
            G.easy_ajax = G.ajax;
            
            /**
             * Load some Javascript and optionally send it some variables from the closure.
             *
             * @example include("/path/to/script.js", {needed_var: var_from_the_closure}, function () {}, 20000, false);
             * @param   path     (string)              The location of the JavaScript to load.
             * @param   context  (object)   (optional) The variable to send to the included JavaScript.
             * @param   cb       (function) (optional) A function to call after the code has been loaded.
             * @param   timeout  (number)   (optional) How long to wait before giving up on the script to load (in milliseconds).
             *                                         A falsey value (such as 0 or FALSE) disables timing out.         (Default is 10,000 milliseconds.)
             * @param   retry    (boolean)  (optional) Whether or not to retry loading the script if a timeout occurs.  (Default is TRUE.)
             * @return  NULL.  Executes code.
             * @todo    If the code has already been loaded, simply run the script without re-downloading anything.
             * @todo    Determine if it would be better to use a callback function rather than passing context.
             */
            G.include = (function ()
            {
                /// Store the "this" variable to let the other functions access it.
                var that = this;
                
                /**
                 * Eval code in a neutral scope.
                 *
                 * @param  code (string) The string to eval.
                 * @return The result of the eval'ed code.
                 * @note   Called when the Ajax request returns successfully.
                 * @note   This function is used to prevent included code from having access to the variables inside of the function's scope.
                 */
                this.evaler = function (code)
                {
                    ///NOTE: Since the eval'ed code has access to the variables in this closure, we need to clear out the code variable both as a security caution and
                    ///      to prevent memory leaks.  The following code does just that: (code = ""). However, this also messes up Firebug's debugger.
                    return eval(code + (code = ""));
                };
                
                /// Prevent any eval'ed code from being able to modify the evaler() function.
                Object.freeze(this);
                
                function include_one(path, cb, context, timeout, retry)
                {
                    var clean_path = path.replace(/(\?[^?]+)?(\#[^#]+)?$/, "").toLowerCase(),
                        fallback;
                    
                    function done()
                    {
                        clearTimeout(fallback);
                        if (cb) {
                            cb();
                            /// Make sure it can't be called twice.
                            cb = null;
                        }
                    }
                    
                    /// Not all browsers support onload (like Android).
                    fallback = setTimeout(done, 3000);
                    
                    if (clean_path.slice(-4) === ".css") {
                        ///TODO: Check other link tags to see if this has already been added.
                        document.getElementsByTagName("head")[0].appendChild(G.cde("link", {
                                href: path,
                                rel: "stylesheet"
                            }, {load: done}
                        ));
                    } else { /// JS
                        G.ajax(path, function (err, res)
                        {
                            /// Evaluate the code in a safe environment.
                            /// Before evaluation, add the sourceURL so that debuggers can debug properly be matching the code to the correct file.
                            /// See https://blog.getfirebug.com/2009/08/11/give-your-eval-a-name-with-sourceurl/.
                            var code = that.evaler(res + "//# sourceURL=" + path);
                            
                            if (err) {
                                console.log(err);
                            }
                            
                            /// If the eval'ed code is a function, send it the context.
                            if (typeof code === "function") {
                                code(context);
                            }
                            
                            if (cb) {
                                cb();
                            }
                        }, timeout, retry);
                    }
                }
                
                return function include(path, cb, context, timeout, retry)
                {
                    var len;
                    
                    if (!Array.isArray(path)) {
                        path = [path];
                    }
                    
                    len = path.length;
                    
                    (function loop(i)
                    {
                        if (i === len) {
                            if (cb) {
                                cb();
                            }
                            return;
                        }
                        
                        include_one(path[i], function next()
                        {
                            loop(i + 1);
                        }, context, timeout, retry);
                    }(0));
                };
            ///NOTE: Since this anonymous function would have an undefined "this" variable, we need to use the call() function to specify an empty "this" object.
            ///      The "this" object is used to "secure" the code from the eval'ed code using Object.freeze().
            }).call({});
        }
        
        G.get_params = function get_params()
        {
            var sep1 = location.search.split(/\&|\?/g),
                sep2,
                params = {},
                i,
                len;
            
            len = sep1.length;
            
            if (len > 1) {
                ///NOTE: Skip the first empty element (it's empty because URL's start with a slash).
                for (i = 1; i < len; i += 1) {
                    sep2 = sep1[i].split(/=/);
                    sep2[0] = decodeURIComponent(sep2[0]);
                    if (sep2[1]) {
                        sep2[1] = decodeURIComponent(sep2[1]);
                    }
                    if (typeof params[sep2[0]] === "undefined") {
                        params[sep2[0]] = sep2[1];
                    } else {
                        if (typeof params[sep2[0]] !== "object") {
                            params[sep2[0]] = [params[sep2[0]]];
                        }
                        params[sep2[0]].push(sep2[1]);
                    }
                }
            }
            
            return params;
        };
        
        G.get_data_from_form = function get_data_from_form(form)
        {
            var data = {arr: [], obj: {}},
                i,
                len,
                value;
            
            if (form && form.elements && form.elements.length) {
                ///NOTE: HTMLCollections are not real arrays, so there is no forEach().
                len = form.elements.length;
                
                for (i = 0; i < len; i += 1) {
                    /// Only elements with a name should be retreaved.
                    ///NOTE: This does store an element with a space (" ") as a name. Is that good?
                    if (form.elements[i].name) {
                        if (form.elements[i].type === "checkbox") {
                            value = form.elements[i].checked ? true : false;
                        } else {
                            value = form.elements[i].value;
                        }
                        /// If the element already exists, turn it into an array.
                        if (typeof data.obj[form.elements[i].name] === "undefined") {
                            data.obj[form.elements[i].name] = value;
                        } else {
                            if (!Array.isArray(data.obj[form.elements[i].name])) {
                                data.obj[form.elements[i].name] = [data.obj[form.elements[i].name]];
                            }
                            data.obj[form.elements[i].name].push(value);
                        }
                        data.arr[i] = form.elements[i];
                    }
                }
            }
            
            return data;
        };
        
        G.make_params = function (params)
        {
            var str = "";
            if (params) {
                Object.keys(params).forEach(function oneach(key, i)
                {
                    if (i > 0) {
                        str += "&";
                    }
                    str += encodeURIComponent(key);
                    if (typeof params[key] !== "undefined") {
                         str += "=" + encodeURIComponent(params[key]);
                    }
                });
            }
            return str;
        };
        
        ///NOTE: Even though this doesn't need to be client-side only, Node already has an event system.
        G.events = (function ()
        {
            var func_list = {};
            
            return {
                /**
                 * Add one or more events to the event cue.
                 *
                 * @example G.event.attach("contentAddedAbove", function (e) {});
                 * @example G.event.attach("contentAddedAbove", function (e) {}, true);
                 * @example G.event.attach(["contentAddedAbove", "contentRemovedAbove"], function (e) {});
                 * @example G.event.attach(["contentAddedAbove", "contentRemovedAbove"], function (e) {}, true);
                 * @example G.event.attach(["contentAddedAbove", "contentRemovedAbove"], function (e) {}, [true, false]);
                 * @param   name (string || array)             The name of the event or an array of names of events.
                 * @param   func (function)                    The function to call when the event it triggered.
                 * @param   once (boolean || array) (optional) Whether or not to detach this function after being executed once. If "name" is an array, then "once" can also be an array of booleans.
                 * @return  NULL
                 * @note    If func(e) calls e.stopPropagation(), it will stop further event propagation.
                 * @todo    Determine the value of adding a run_once property that removes function after the first run.
                 */
                attach: function attach(name, func, once)
                {
                    var arr_len,
                        i;
                    
                    /// Should the function be attached to multiple events?
                    if (name instanceof Array) {
                        arr_len = name.length;
                        for (i = 0; i < arr_len; i += 1) {
                            /// If "once" is an array, then use the elements of the array.
                            /// If "once" is not an array, then just send the "once" variable each time.
                            this.attach(name[i], func, once instanceof Array ? once[i] : once);
                        }
                    } else {
                        if (typeof func === "function") {
                            /// Has a function been previously attached to this event? If not, create a function to handle them.
                            if (!func_list[name]) {
                                func_list[name] = [];
                            }
                            /// Since we may remove events while calling them, it's easiest to store the array in reverse.
                            func_list[name].unshift({
                                func: func,
                                once: once
                            });
                        }
                    }
                },
                /**
                 * Remove an event from the event cue.
                 *
                 * @example G.event.detach("contentAddedAbove", function (e) {});
                 * @example G.event.detach(["contentAddedAbove", "contentRemovedAbove"], function (e) {}, [true, false]);
                 * @example G.event.detach(["contentAddedAbove", "contentRemovedAbove"], function (e) {}, true);
                 * @param   name (string || array)             The name of the event or an array of names of events.
                 * @param   func (function)                    The function that was attached to the specified event.
                 * @param   once (boolean || array) (optional) Whether or not to detach this function after being executed once. If "name" is an array, then "once" can also be an array of booleans.
                 */
                detach: function detach(name, func, once)
                {
                    var i;
                    
                    /// Are there multiple events to remove?
                    if (name instanceof Array) {
                        for (i = name.length - 1; i >= 0; i -= 1) {
                            /// If "once" is an array, then use the elements of the array.
                            /// If "once" is not an array, then just send the "once" variable each time.
                            this.detach(name[i], func, once instanceof Array ? once[i] : once);
                        }
                    } else if (func_list[name]) {
                        for (i = func_list[name].length - 1; i >= 0; i -= 1) {
                            ///NOTE: Both func and once must match.
                            if (func_list[name][i].func === func && func_list[name][i].once === once) {
                                G.remove(func_list[name], i);
                                /// Since only one event should be removed at a time, we can end now.
                                return;
                            }
                        }
                    }
                },
                /**
                 * Trigger the functions attached to an event.
                 *
                 * @param  name (string) The name of the event to trigger.
                 * @param  e    (object) The event object sent to the called functions.
                 * @return NULL
                 */
                trigger: function trigger(name, e)
                {
                    var i,
                        stop_propagation;
                    
                    /// Does this event have any functions attached to it?
                    if (func_list[name]) {
                        if (!G.is_object(e)) {
                            /// If the event object was not specificed, it needs to be created in order to attach stopPropagation() to it.
                            e = {};
                        }
                        
                        /// If an attached function runs this function, it will stop calling other functions.
                        e.stopPropagation = function ()
                        {
                            stop_propagation = true;
                        };
                        
                        /// Execute the functions in reverse order so that we can remove them without throwing the order off.
                        for (i = func_list[name].length - 1; i >= 0; i -= 1) {
                            ///NOTE: It would be a good idea to use a try/catch to prevent errors in events from preventing the code that called the
                            ///      event from firing.  However, there would need to be some sort of error handling. Sending a message back to the
                            ///      server would be a good feature.
                            /// Check to make sure the function actually exists.
                            if (func_list[name][i]) {
                                func_list[name][i].func(e);
                            }
                            
                            /// Is this function only supposed to be executed once?
                            if (!func_list[name][i] || func_list[name][i].once) {
                                G.remove(func_list[name], i);
                            }
                            
                            /// Was e.stopPropagation() called?
                            if (stop_propagation) {
                                break;
                            }
                        }
                    }
                }
            };
        }());
        

        /**
         * Cookies.js - 1.1.0
         * https:///github.com/ScottHamper/Cookies
         *
         * This is free and unencumbered software released into the public domain.
         *
         * Streamed lined by Greenfield Education.
         */
        (function (undefined)
        {
            if (typeof window.document !== "object") {
                throw new Error("Cookies.js requires a `window` with a `document` object");
            }
            
            var Cookies = function (key, value, options)
            {
                return arguments.length === 1 ?
                    Cookies.get(key) : Cookies.set(key, value, options);
            };
            
            /// Allows for setter injection in unit tests
            Cookies._document = window.document;
            
            /// Used to ensure cookie keys do not collide with
            /// built-in `Object` properties
            Cookies._cacheKeyPrefix = "cookey.";
            
            Cookies.defaults = {
                secure: location.protocol === "https:",
                expires: 60 * 60 * 24 * 30 * 9, /// 9 months in milliseconds
                path: "/"
            };
            
            Cookies.get = function (key)
            {
                if (Cookies._cachedDocumentCookie !== Cookies._document.cookie) {
                    Cookies._renewCache();
                }
                
                return Cookies._cache[Cookies._cacheKeyPrefix + key];
            };
            
            ///NOTE: options.expires is in seconds.
            Cookies.set = function (key, value, options)
            {
                options = Cookies._getExtendedOptions(options);
                options.expires = Cookies._getExpiresDate(value === undefined ? -1 : options.expires);
                
                Cookies._document.cookie = Cookies._generateCookieString(key, value, options);
                
                return Cookies;
            };
            
            Cookies.expire = function (key, options)
            {
                return Cookies.set(key, undefined, options);
            };
            
            Cookies._getExtendedOptions = function (options)
            {
                return {
                    path: options && options.path || Cookies.defaults.path,
                    domain: options && options.domain || Cookies.defaults.domain,
                    expires: options && options.expires || Cookies.defaults.expires,
                    secure: options && options.secure !== undefined ?  options.secure : Cookies.defaults.secure
                };
            };
            
            Cookies._isValidDate = function (date)
            {
                return Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date.getTime());
            };
            
            Cookies._getExpiresDate = function (expires, now)
            {
                now = now || new Date();
                switch (typeof expires) {
                    case "number": expires = new Date(now.getTime() + expires * 1000); break;
                    case "string": expires = new Date(expires); break;
                }
                
                if (expires && !Cookies._isValidDate(expires)) {
                    throw new Error("`expires` parameter cannot be converted to a valid Date instance");
                }
                
                return expires;
            };
            
            Cookies._generateCookieString = function (key, value, options)
            {
                key = key.replace(/[^#$&+\^`|]/g, encodeURIComponent);
                key = key.replace(/\(/g, "%28").replace(/\)/g, "%29");
                value = (value + "").replace(/[^!#$&-+\--:<-\[\]-~]/g, encodeURIComponent);
                options = options || {};
                
                var cookieString = key + "=" + value;
                cookieString += options.path ? ";path=" + options.path : "";
                cookieString += options.domain ? ";domain=" + options.domain : "";
                cookieString += options.expires ? ";expires=" + options.expires.toUTCString() : "";
                cookieString += options.secure ? ";secure" : "";
                
                return cookieString;
            };
            
            Cookies._getCacheFromString = function (documentCookie)
            {
                var cookieCache = {};
                var cookiesArray = documentCookie ? documentCookie.split("; ") : [];
                
                for (var i = 0; i < cookiesArray.length; i += 1) {
                    var cookieKvp = Cookies._getKeyValuePairFromCookieString(cookiesArray[i]);
                    
                    if (cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] === undefined) {
                        cookieCache[Cookies._cacheKeyPrefix + cookieKvp.key] = cookieKvp.value;
                    }
                }
                
                return cookieCache;
            };
            
            Cookies._getKeyValuePairFromCookieString = function (cookieString)
            {
                /// "=" is a valid character in a cookie value according to RFC6265, so cannot `split("=")`
                var separatorIndex = cookieString.indexOf("=");
                
                /// IE omits the "=" when the cookie value is an empty string
                separatorIndex = separatorIndex < 0 ? cookieString.length : separatorIndex;
                
                return {
                    key: decodeURIComponent(cookieString.substr(0, separatorIndex)),
                    value: decodeURIComponent(cookieString.substr(separatorIndex + 1))
                };
            };
            
            Cookies._renewCache = function ()
            {
                Cookies._cache = Cookies._getCacheFromString(Cookies._document.cookie);
                Cookies._cachedDocumentCookie = Cookies._document.cookie;
            };
            
            Cookies._areEnabled = function ()
            {
                var testKey = "cookies.js";
                var areEnabled = Cookies.set(testKey, 1).get(testKey) === "1";
                Cookies.expire(testKey);
                return areEnabled;
            };
            
            /// Removed enabled check. If you want to know, run Cookies._areEnabled().
        
            window.Cookies = Cookies;
        })();
        
        /// *****************
        /// * End of window *
        /// *****************
    }
    
    return G;
}());

if (typeof module !== "undefined") {
    module.exports = G;
}
