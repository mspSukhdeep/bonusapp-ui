_gPopStoreUrl = null;

// make this false after sale period
// 25th early morning
var disablePromoPopup = false;

(function() {
    checkAndChangeHash = function() {
        if (/@/g.test(window.location.hash)) {
            window.location.hash = ''; // changes hash to empty string
        }
    };
    window.onhashchange = function() {
        checkAndChangeHash();
    };
    checkAndChangeHash();
})();

var CHROME_EXT_WEB_URL = "https://chrome.google.com/webstore/detail/mysmartprice-lite/ofkelhbkifmecehjfolhkekgplfijkkf?hl=en-US",
    CHROME_EXT_INSTALL_URL = "https://chrome.google.com/webstore/detail/ofkelhbkifmecehjfolhkekgplfijkkf",
    CHROME_INSTATAB_WEB_URL = "https://chrome.google.com/webstore/detail/price-comparison-deals-ca/eeiecmacokdbloibfhablfifompcdoje",
    CHROME_INSTATAB_INSTALL_URL = "https://chrome.google.com/webstore/detail/eeiecmacokdbloibfhablfifompcdoje",
    lastScrollTop = 0,
    // scrolled = false, // OLD:: for old processHeader code
    // To Do: We have to remove all $(document).ready({ });
    $doc = $(document),
    $win = $(window),
    popupQueue = [],
    autoPopupTimeout = 10000,
    pageLeaveTimeout = 4000,
    ua = navigator.userAgent.toLowerCase(),
    isEdge = function() {
        return ua.indexOf("edge") !== -1;
    },
    isChrome = function() {
        return ua.indexOf("chrome") !== -1 && ua.indexOf("edge") === -1 && ua.indexOf("opr") === -1; // Edge UA contains "Chrome"
    },
    isFirefox = function() {
        return ua.indexOf("firefox") !== -1;
    },
    qS = queryString(window.location.search),
    selectedOfferText = "",
    selectedOfferStore = "",
    selectedOfferImage = "",
    selectedOfferId = "",
    selectedOfferURL = "",
    newWindow;

var popupDataObj = {};

var MSP = {
    "dataPoints": {
        headerHeight: $(".hdr-size").height()
    },
    "utils": {
        "parse": {
            /**
             * MSP.utils.numberFrom.price(price)
             * => converts price values to numbers.
             * @param {string} price -> string with digits formatted with commas
             * @return {number} price -> string with digits formatted with commas
             */
            "numberFrom": {
                "price": function(price) {
                    return parseInt(price.replace(/\D/g, ""), 10);
                }
            },
            /**
             * MSP.utils.urlFrom.bgImage(price)
             * => get url from background-image property values.
             * @param {string} price -> css background-image propery.
             * @return {string} price -> background image source url.
             */
            "urlFrom": {
                "bgImage": function(bgProp) {
                    bgProp.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
                }
            }
        },
        "validate": (function() {
            var _regex = {
                "text": /^[a-z\d\-_\s]+$/i,
                "number": /^\d+$/,
                "ifsc": /^[A-Za-z]{4}\d{7}$/,
                "mobile": /^\d{10}$/,
                "pincode": /^\d{6}$/,
                "email": /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "required": /\S/
            };

            function _testPattern(type, value) {
                var result = _regex[type].test(value);

                return result;
            }

            return {
                "rating": function(value, options) {
                    return !!parseInt(value, 10);
                },
                "text": function(value, options) {
                    var isWithinLimits = (function() {
                        var result = true,
                            minLength = options && options.min && parseInt(options.min, 10),
                            maxLength = options && options.max && parseInt(options.max, 10);

                        if (minLength && value.length < options.min) {
                            result = false;
                        }
                        if (maxLength && value.length > minLength) {
                            result = false;
                        }
                        return result;
                    }());
                    return _testPattern("text", $.trim(value)) && value && isWithinLimits;
                },
                "ifsc": function(value, options) {
                    return _testPattern("ifsc", value)
                },
                "number": function(value, options) {
                    return _testPattern("number", value);
                },
                "mobile": function(value, options) {
                    return _testPattern("mobile", value);
                },
                "pincode": function(value, options) {
                    return _testPattern("pincode", value);
                },
                "email": function(value, options) {
                    return _testPattern("email", value);
                },
                "required": function(value, options) {
                    var isWithinLimits = (function() {
                        var result = true,
                            minLength = options && options.min && parseInt(options.min, 10),
                            maxLength = options && options.max && parseInt(options.max, 10);

                        if (minLength && value.length < options.min) {
                            result = false;
                        }
                        if (maxLength && value.length > minLength) {
                            result = false;
                        }
                        return result;
                    }());
                    return _testPattern("required", $.trim(value)) && value && isWithinLimits;
                },
                /** MSP.utils.validate.form(formData)
                 *
                 * @param {array} formData -> [{ -> array of objects having info of each form field.
                 *   @param {string} "type" : "email", -> input validation type
                 *   @param {$node} "inputField" : $('.form-inpt'), -> jquery node of input field
                 *   @param {$node} "errorNode" : $(".js-vldtn-err"), -> jquery node of validation error message.
                 *   @param {string} "errorMsg" -> error message to be shown on failed validation
                 *   @param {object} "options" -> type specific extra checks
                 * }, .....]
                 *
                 * @return {object: promise} -> provides .done() and .fail() methods on the function call.
                 */
                "form": function(formData) {
                    var dfd = $.Deferred(),
                        isValid = true,
                        check = this,
                        $firstErrorField;

                    $.each(formData, function(i, field) {
                        var result = check[field.type](field.inputField.val(), field.options),
                            dataIsShown = field.errorNode.data("isShown") || 0;

                        if (result === false) {
                            if (field.errorNode instanceof jQuery) {
                                if (true) {
                                    field.errorNode.text(field.errorMsg || field.errorNode.text() || "Please check and correct the red-marked field(s).")
                                        .data("isShown", ++dataIsShown).slideDown();
                                }
                                if (!$firstErrorField && field.inputField) {
                                    $firstErrorField = field.inputField;
                                    $firstErrorField.focus();
                                    $firstErrorField.off("blur");
                                }
                                field.inputField.addClass("hghlght-err-fld");
                            }
                            isValid = false;
                        } else {
                            if (dataIsShown >= 1) {
                                field.errorNode.data("isShown", --dataIsShown).slideUp();
                            }
                            field.inputField.removeClass("hghlght-err-fld");
                        }
                    });

                    if (isValid) {
                        dfd.resolve();
                    } else {
                        dfd.reject();
                    }

                    return dfd.promise();
                }
            };
        }()),
        /**
         * $.memoize(task[, options])
         * => returns a new function which caches return values for given args.
         * => generally used to cache REST API ajax calls.
         *
         * @param {function} task -> Task to be memoized with a promise return value. (pass function's promise).
         * @param {object} options: {
         *   @param {number} cacheLimit -> max no. of results that can be stored in cache.
         * }
         *
         * @return {function} memoizedTask
         */
        "memoize": function _memoize(task, options) {
            var memoizeCache = _memoize._cache_ || {},
                cacheLimit = options && options.cacheLimit,
                resultTask;

            memoizeCache[task.toString()] = { "queries": [], "results": [] };
            resultTask = function _memoizedTask() {
                var cache = memoizeCache[task.toString()],
                    dfd = $.Deferred(),
                    query = JSON.stringify(arguments),
                    result;

                if (cache.queries.indexOf(query) !== -1) {
                    result = cache.results[cache.queries.indexOf(query)];
                    dfd.resolve(result);
                } else {
                    task.apply(this, arguments).done(function(result) {
                        cache.queries.push(query);
                        cache.results.push(result);
                        if (cacheLimit) {
                            if (cache.queries.length > cacheLimit) {
                                cache.queries.shift();
                                cache.results.shift();
                            }
                        }
                        dfd.resolve(result);
                    });
                }
                return dfd.promise();
            };

            return resultTask;
        },
        /**
         * $.throttle(task, timeout[, context])
         * => restricts execution of continuosly asks tasks to interval spaced executions.
         * => generally used to to make continuosly fired event handler callbacks performant.
         *
         * @param {function} task -> task to be throttled.
         * @param {number:milliseconds} timeout: -> interval between two task executions.
         * @param {object} context -> task will be exected as a method of this object.
         *
         * @return {function} debouncedTask
         */
        "throttle": function _throttle(task, timeout, context) {
            var timer, args, needInvoke;
            return function() {
                args = arguments;
                needInvoke = true;
                context = context || this;
                if (!timer) {
                    (function() {
                        if (needInvoke) {
                            task.apply(context, args);
                            needInvoke = false;
                            timer = setTimeout(arguments.callee, timeout);
                        } else {
                            timer = null;
                        }
                    }());
                }
            };
        },
        /**
         * $.debounce(task, timeout[, invokeAsap[, context]])
         * => returns a new function which memoizes return values for given args.
         * => used to to make continuosly fired event handler callbacks run once.
         *
         * @param {function} task -> task to be debounced.
         * @param {number: seconds} timeout: -> interval between two task executions.
         * @param {boolean} invokeAsap -> task to be executed after first call of the event or not.
         * @param {object} context -> task will be exected as a method of this object.
         *
         * @return {function} debouncedTask
         */
        "debounce": function _debounce(task, timeout, invokeAsap, context) {
            var timer;

            if (arguments.length == 3 && typeof invokeAsap != 'boolean') {
                context = invokeAsap;
                invokeAsap = false;
            }

            return function() {
                var args = arguments;
                context = context || this;
                invokeAsap && !timer && task.apply(context, args);
                clearTimeout(timer);
                timer = setTimeout(function() {
                    !invokeAsap && task.apply(context, args);
                    timer = null;
                }, timeout);
            };
        },
        /**
         * $.selectText()
         * => selects the text of the jquery node on which the method is invoked.
         * => used to to make coupon codes easily selectable by user onclick.
         * @param {$node} $node ->
         */
        "selectText": (function() {
            var _range, _selection;
            var _is = function(o, type) {
                return typeof o === type;
            };

            if (_is(document.getSelection, 'function')) {
                _selection = document.getSelection();

                if (_is(_selection.setBaseAndExtent, 'function')) {

                    // Chrome, Safari
                    return function _selectText($triggerNode) {
                        var selection = _selection;
                        var targetNode = $triggerNode.find(".js-slct-trgt").length ? $triggerNode.find(".js-slct-trgt").get(0) : $triggerNode.get(0);

                        selection.setBaseAndExtent(targetNode, 0, targetNode, $(targetNode).contents().size());

                        // Chainable
                        return this;
                    };
                } else if (_is(document.createRange, 'function')) {
                    _range = document.createRange();

                    if (_is(_range.selectNodeContents, 'function') &&
                        _is(_selection.removeAllRanges, 'function') &&
                        _is(_selection.addRange, 'function')) {

                        // Mozilla
                        return function _selectText($triggerNode) {
                            var range = _range;
                            var selection = _selection;
                            var targetNode = $triggerNode.find(".js-slct-trgt").length ? $triggerNode.find(".js-slct-trgt").get(0) : $triggerNode.get(0);

                            range.selectNodeContents(targetNode);
                            selection.removeAllRanges();
                            selection.addRange(range);

                            // Chainable
                            return this;
                        };
                    }
                }
            } else if (_is(document.body.createTextRange, 'object')) {

                _range = document.body.createTextRange();

                if (_is(_range.moveToElementText, 'object') && _is(_range.select, 'object')) {

                    // IE11- most likely
                    return function _selectText($triggerNode) {
                        var range = document.body.createTextRange();
                        var targetNode = $triggerNode.find(".js-slct-trgt").length ? $triggerNode.find(".js-slct-trgt").get(0) : $triggerNode.get(0);

                        range.moveToElementText(targetNode);
                        range.select();

                        // Chainable
                        return this;
                    };
                }
            }
        }()),
        "lazyLoad": (function() {
            var _queue = [];

            return {
                /** MSP.utils.lazyLoad.run()
                 * => runs each task pushed to the lazyload queue when their corresponding scroll condition is statisfied.
                 * => used to load on demand images, widgets which slow down page load times.
                 */
                "run": function() {
                    for (i = 0; i < _queue.length; i++) {
                        (function() {
                            if (_queue[i].node.length > 0) {
                                var callback = _queue[i].callback,
                                    position = _queue[i].position;
                                triggerPoint = (position || (_queue[i].node.offset() && _queue[i].node.offset().top)) - $(window).height();

                                if ($win.scrollTop() > triggerPoint) {
                                    callback.definition.apply(callback.context, callback.arguments);
                                    _queue.splice(i, 1);
                                    i--;
                                }
                            }
                        }());
                    }
                },
                /**
                 * MSP.utils.lazyLoad.assign => accepts a task to be executed on reaching scroll position of given node.
                 *
                 * @param {object} task -> {
                 *   @param {$node} "node" : $node, // jquery node
                 *   @param {function} "callback" : {
                 *     "definition" : callbackFunction, // defintion of the task to be run
                 *     "context" : this,
                 *     "arguments" : [args,...] // arguments of the task if any.
                 *   }
                 * }
                 *
                 * @return {object} lazyload -> to enable chaining -> .run() for immediate invocation.
                 */
                "assign": function(task) {
                    _queue.push(task);
                    return this;
                }
            };
        }()),
        "browser": {
            "name": (function() {
                var result = null,
                    ua = navigator.userAgent.toLowerCase();
                if (ua.indexOf("msie") !== -1 && ua.indexOf("trident") !== -1 && ua.indexOf("edge") !== -1) {
                    result = "MSIE";
                } else if (ua.indexOf("firefox") !== -1) {
                    result = "firefox";
                } else if (ua.indexOf("chrome") !== -1 && ua.indexOf("opr") === -1) {
                    result = "chrome";
                }
                return result;
            }()),
            "version": (function() {
                var userAgent = navigator.userAgent.toLowerCase();
                return (/msie/.test(userAgent) ? (parseFloat((userAgent.match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1])) : null);
            }())
        },
        /**
         * MSP.utils.cycleShift => cycle through set of values
         *
         * @param {Array} valueSet -> Set of values
         * @param {Primitive} currentValue -> currentItem in the valueSet to get the nextItem.
         *
         * @return {Primitive} -> to enable chaining -> nextItem in the valueSet.
         */
        "cycleShift": function(valueSet, currentValue) {
            var currentIndex;

            if ($.isArray(valueSet)) {
                currentIndex = valueSet.indexOf(currentValue);
                if (currentIndex !== -1) {
                    return valueSet[(currentIndex + 1) % valueSet.length];
                }
            }
        }
    }
};

/**
 * jQuery mCycle v0.1
 * Carousel Plugin Script Begins Here
 */
;
(function($, window, document, undefined) {

    "use strict";

    // Defaults are below
    var defaults = {
        mCycleItem: 'img', // the item which will be slided
        animTime: 300, // time taken in animation in milliseconds
        waitTime: 3000, // time for a slide to wait in milliseconds
        isAutoPlay: false, //  isAutoPlay can be false for manual control
        direction: 'left', // direction can be 'left' of 'right'
        slideBullets: true, //show the slide bullets
        height: 'auto' //height of the mCycleCont (slide show container)
    };

    // The actual plugin constructor
    function mCycle(element, options) {
        this.element = element;

        // extending defaults with user options
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = "mCycle";
        this._autoPlayQueued = false;
        this._animating = false;
        this.forcedNextSlide = -1;
        this.init(true);

    }

    // Get the next slide for the animation in the given direction
    function getNextSlide($currentSlide, direction) {
        var $nextSlide;
        switch (direction) {
            case "left":
                $nextSlide = $currentSlide.next('.mCycleItemWrapper');
                break;
            case "right":
                $nextSlide = $currentSlide.prev('.mCycleItemWrapper');
                break;
        }

        if ($nextSlide.length) return $nextSlide;

        switch (direction) {
            case "left":
                $nextSlide = $currentSlide.parent().find('.mCycleItemWrapper').first();
                break;
            case "right":
                $nextSlide = $currentSlide.parent().find('.mCycleItemWrapper').last();
                break;
        }

        return $nextSlide;
    }


    mCycle.prototype = {

        init: function(firstTime) {
            if (!firstTime) return;

            var $elem = $(this.element),
                mCycleItemCount = $elem.find(this.options.mCycleItem).length,
                elemHeight = 0;

            $elem.addClass('mCycleCont').find(this.options.mCycleItem).each(function(index) {
                var $mCycleItem = $(this);
                $mCycleItem.addClass('show mCycleItemWrapper').attr("data-count", index + 1);

                elemHeight = Math.max($mCycleItem.height(), elemHeight);


            });

            $elem.show();

            if (parseInt($elem.height(), 10) === 0 && this.options.height === 'auto') {
                $elem.height(elemHeight);
            } else if (this.options.height !== 'auto') {
                $elem.height(this.options.height);
            }


            $elem.find('.mCycleItemWrapper').eq(0).addClass('mCycleItemCurrent');
            $elem.find('.mCycleItemWrapper').eq(1).addClass('mPartialSlide');

            if (this.options.slideBullets) {
                $elem.append('<div class="mCycleSlideBullets"></div>');
                var mCycleSlideBulletCount = mCycleItemCount;
                while (mCycleSlideBulletCount--) {
                    $elem.find('.mCycleSlideBullets').append('<div class="mCycleSlideBullet"></div>');
                }
                $elem.find('.mCycleSlideBullet').eq(0).addClass('active');
            }

            if (this.options.isAutoPlay && mCycleItemCount > 1) { // start sliding if it is autoplay
                var that = this;

                that._autoPlayQueued = true;

                setTimeout((function() {
                    that._autoPlayQueued = false;
                    if (that.options.isAutoPlay) that.slide();
                }), that.options.waitTime);

            }
        },

        play: function() {
            if (this.options.isAutoPlay) return;
            this.options.isAutoPlay = true;
            this.slide();
        },

        pause: function() {
            this.options.isAutoPlay = false;
        },

        reverse: function() {
            this.options.direction = (this.options.direction === 'left') ? 'right' : 'left';
        },
        slideLeft: function() {
            this.slide('left');
        },
        slideRight: function() {
            this.slide('right');
        },
        slideTo: function(index) {
            var $slides = $(this.element),
                currentIndex = $slides.index($(this.element).hasClass("mCycleItemCurrent")),
                direction = (index > currentIndex) ? 'left' : 'right',
                isAutoPlay = this.options.isAutoPlay,
                that = this;
            this.pause();
            this.forcedNextSlide = index;
            $slides.eq(index).addClass("mCycleItemNext");
            setTimeout(function() {
                that.slide(direction);
                that.forcedNextSlide = -1;
                setTimeout(function() {
                    if (isAutoPlay) {
                        that.play();
                    }
                }, that.options.animTime + that.options.waitTime + 10);
            }, that.options.animTime + 10);
        },
        slide: function(direction) {

            if (this.options.isAutoPlay && this._autoPlayQueued || this._animating) return; // to stop multiple instance of slide when on autoplay

            direction = direction || this.options.direction;

            var $currentSlide = $(this.element).find('.mCycleItemCurrent'),
                $slides = $(this.element).find(".mCycleItemWrapper"),
                isForcedSlide = (this.forcedNextSlide === -1),
                $nextSlide = isForcedSlide ? getNextSlide($currentSlide, direction) : $slides.eq(this.forcedNextSlide),
                $partialSlide = getNextSlide($nextSlide, direction),
                prevSlideLeftOffset,
                nextSlideClass;
            switch (direction) {
                case 'left':
                    nextSlideClass = 'mCycleItemNext';
                    prevSlideLeftOffset = '-100%';
                    break;
                case 'right':
                    nextSlideClass = 'mCycleItemPrev';
                    prevSlideLeftOffset = '100%';
                    break;
            }

            if ($nextSlide.hasClass('mCycleItemCurrent')) return; // if current slide is same as next slide


            $nextSlide.addClass(nextSlideClass);

            // $partialSlide.addClass("mPartialSlide");

            var that = this;

            this._animating = true;

            var reflow = $("body").offset().top;

            // making current slide the prev slide
            $currentSlide.css({
                '-webkit-transition': 'transform' + (that.options.animTime) / 1000 + 's ease-in-out',
                'transition': 'transform ' + (that.options.animTime) / 1000 + 's ease-in-out',
                '-webkit-transform': 'translateX(' + prevSlideLeftOffset + ')',
                '-ms-transform': 'translateX(' + prevSlideLeftOffset + ')',
                'transform': 'translateX(' + prevSlideLeftOffset + ')'
            });

            // making next slide the current slide
            $nextSlide.css({
                '-webkit-transition': 'transform ' + (that.options.animTime) / 1000 + 's ease-in-out',
                'transition': 'transform ' + (that.options.animTime) / 1000 + 's ease-in-out',
                '-webkit-transform': 'translateX(0)',
                '-ms-transform': 'translateX(0)',
                'transform': 'translateX(0)'
            }).removeClass("mPartialSlide");

            $partialSlide.css({
                '-webkit-transition': 'transform ' + (that.options.animTime) / 1000 + 's ease-in-out',
                'transition': 'transform ' + (that.options.animTime) / 1000 + 's ease-in-out',
                '-webkit-transform': 'translateX(100%)',
                '-ms-transform': 'translateX(100%)',
                'transform': 'translateX(100%)'
            })

            //IE Fix
            if (MSP.utils.browser.name === "MSIE" && MSP.utils.browser.version < 9) {
                $currentSlide.css({
                    'left': prevSlideLeftOffset
                });
                $nextSlide.css({
                    'left': '0'
                });
            }

            setTimeout(function() {
                var $elem = $(that.element);

                $currentSlide.removeClass('mCycleItemCurrent').removeAttr('style');
                $nextSlide.toggleClass(nextSlideClass + ' mCycleItemCurrent').removeAttr('style');

                //IE Fix
                if (MSP.utils.browser.name === "MSIE" && MSP.utils.browser.version < 9) {
                    $currentSlide.removeClass('mCycleItemCurrentIE').removeAttr('style');
                    $nextSlide.toggleClass(nextSlideClass + ' mCycleItemCurrentIE').removeAttr('style');
                }

                if (that.options.slideBullets) {
                    var count = $elem.find('.mCycleItemCurrent').data('count');

                    $elem.find('.mCycleSlideBullet.active').removeClass('active');
                    $elem.find('.mCycleSlideBullet').eq(count - 1).addClass('active');
                }

                that._animating = false;
                if (that.options.isAutoPlay) {
                    that._autoPlayQueued = true; // auto call for slide is queued if on autoplay
                    setTimeout((function() {
                        if (that.options.isAutoPlay && that._autoPlayQueued) {
                            that._autoPlayQueued = false;
                            that.slide();
                        } else {
                            that.options.isAutoPlay = false;
                            that._autoPlayQueued = false;
                        }
                    }), that.options.waitTime);
                }

            }, that.options.animTime + 10); //adding 10ms to make sure animation is complete
        }
    };

    $.fn["mCycle"] = function(options) {
        var params = Array.prototype.splice.call(arguments, 1, 1);
        return this.each(function() {
            if (!$.data(this, "mCycle")) {
                // preventing against multiple instantiations
                $.data(this, "mCycle", new mCycle(this, options));
            } else {
                var mCycleObj = $.data(this, "mCycle");
                // checking if option is a valid function name
                if (typeof options === "string" && mCycleObj[options]) {
                    mCycleObj[options].apply(mCycleObj, params);
                } else if (typeof options === "object") {
                    // if the option is object extending it with initalized object
                    mCycleObj.options = $.extend({}, mCycleObj.options, options);
                }
            }
        });
    };

})(jQuery, window, document);

var extra_info = '';
(function appendPushNotifIframe() {
    if (true) {
        return;
    }

    if ("http:" === document.location.protocol) {

        var izFrame = document.createElement("IFRAME");
        izFrame.setAttribute("src", "https://www.mysmartprice.com/promotions/popups/push_notif_iframe.php");
        izFrame.style.display = "none";

        document.body.appendChild(izFrame);

        window.onmessage = function(a) {
            if (a.data == 'subscribed') {
                openPopup("https://www.mysmartprice.com/promotions/popups/push_notif_http_popup.php");
            }
        };
    } else if ("https:" === document.location.protocol) {
        $("head").append('<link rel="manifest" href="/manifest.json">');

        if ((window.localStorage && localStorage.push_notif_permission_granted) || (Notification.permission === 'granted' && !getCookie("sync_sub"))) { //re-syncing and re-subscribing if the permission is granted already

            if (window.localStorage && localStorage.push_notif_permission_granted) {
                extra_info = 'resub';
            } else {
                extra_info = 're-sync';
                setCookie("sync_sub", "1", 7);
            }
            initialiseStateMain();

        } else if (window.location.pathname.indexOf("/deals/") === -1 && window.location.pathname.indexOf("-msf") === -1) {
            if (Notification.permission !== "granted" && Notification.permission !== "denied") { //https non deals and msf page, but action hasn't been taken yet

                if (window.location.pathname.indexOf("/promotions/plugin/welcome") === 0 || window.location.pathname.indexOf("/promotions/plugin/bye") === 0) { //EXCEPTION: if welcome or bye page, ask for permission irrespective of cookie
                    initialiseStateMain();
                } else if (!getCookie("msp_notif_popup_shown")) { //if we haven't asked in last 4hours, ask again
                    setCookie("msp_notif_popup_shown", 1, 0.125);
                    initialiseStateMain();
                }
            }
        }
    }
}());

function get_subscription_id() {
    navigator.serviceWorker.ready.then(function(a) {
        a.pushManager.subscribe({
                userVisibleOnly: !0
            }).then(function(a) {
                sendSubscriptionToServerMain(a, "subscribed", window.location.pathname, false);
            })
            .catch(function(e) {
                if (Notification.permission === 'denied') {
                    sendSubscriptionToServerMain(null, "denied", window.location.pathname, false);
                }
                return;
            });
    });
}

function initialiseStateMain() {
    navigator.serviceWorker.register('https://www.mysmartprice.com/sw.js').then(function() {
        if (isPushSupportedMain()) {
            get_subscription_id();
        }
    });
}

function isPushSupportedMain() {
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
        return false;
    }
    if (Notification.permission === 'denied') {
        return false;
    }

    if (!('PushManager' in window)) {
        return false;
    }
    return true;
}

function sendSubscriptionToServerMain(sub, subStatus, capturePoint, isClose) {
    if (sub) {
        var subid = sub.endpoint.split("/").slice(-1)[0];
        if (subid == 'send') {
            subid = sub.subscriptionId;
        }
    } else {
        var subid = 0;
    }

    var email = getCookie("msp_login_email");
    var uid = getCookie("msp_uid");
    var vid = getCookie("msp_vid");

    if (sub) {
        var json = sub.toJSON();
        var endpoint = sub.endpoint;
        var p256dh = json.keys.p256dh;
        var auth = json.keys.auth;
    }

    $.ajax({
        type: 'POST',
        url: "/util/log_chrome_notif_subs.php",
        data: {
            "subid": subid,
            "email": email,
            "uid": uid,
            "vid": vid,
            "status": subStatus,
            "source": 'desktop',
            "p256dh": p256dh,
            "auth": auth,
            "endpoint": endpoint,
            "browser": get_browser_main(),
            "extra_info": extra_info,
            "capture": capturePoint
        }
    });

    if (window.localStorage && localStorage.push_notif_permission_granted) {
        localStorage.removeItem("push_notif_permission_granted");
    }

    if (isClose) {
        window.close();
    }
}

function get_browser_main() {
    var ua = navigator.userAgent,
        tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

function lazyLoadImages() {
    // Lazy-load images
    $("img[data-lazy-src]").each(function() {
        var $lazyImage = $(this);
        MSP.utils.lazyLoad.assign({
            "node": $lazyImage,
            "callback": {
                "definition": function($image) {
                    $image.attr("src", $image.data("lazy-src")).removeAttr("data-lazy-src");
                },
                "context": this,
                "arguments": [$lazyImage]
            }
        });
    });
    MSP.utils.lazyLoad.run();
}

function lazyLoadBgImages() {
    // Lazy-load background images
    $(".js-lazy-bg").each(function() {
        var $lazyImage = $(this);
        MSP.utils.lazyLoad.assign({
            "node": $lazyImage,
            "callback": {
                "definition": function($image) {
                    $image.removeClass("js-lazy-bg");
                },
                "context": this,
                "arguments": [$lazyImage]
            }
        });
    });
    MSP.utils.lazyLoad.run();
}

function attachFilterScroll() {
    // execute lazyload on filter scroll
    $(".fltr-val-wrpr .content").scroll(MSP.utils.throttle(function(e) {
        MSP.utils.lazyLoad.run();
    }, 100));
}

/* Carousel Plugin Script Ends Here */

(function signupDestUrlAppending() {
    var $this = $('.usr-inputbox__optns-link--dlmtr');
    if ($this.length && qS.destUrl) {
        var rdrctUrl = qS.destUrl;
        rdrctUrl = qS.utm_source ? rdrctUrl + "&utm_source=" + qS.utm_source : rdrctUrl;
        var crntUrl = $this.attr("href");
        $this.attr("href", crntUrl + "?destUrl=" + encodeURIComponent(rdrctUrl));
        return;
    } else {
        return;
    }
})();

$doc.ready(function () {
	!getCookie("cookie_sync") && checkMSPLogin();

    if (window.qS && qS.utm_source) {
        setCookie("utm_source", qS.utm_source, 1);
    }

    (function showHeroSection() {
        if (window.location.pathname === "/" && !getCookie("msp_login")) {
            setTimeout(function () {
                $(".hdr").addClass("hdr--hero");
                $(".hero").slideDown("slow");
                $(".hdr-logo, .hdr__user, .crsl-wdgt").slideUp("slow");
            }, 1000);
            $(".hero__inr").on("animationend", function () {
                $(this).addClass("hero__inr--anim-end");
            });
        }
    }());

    $(document).ajaxComplete(function(event, xhr, settings) {
        // call lazy load images function
        // for all the images, received via ajax, to be lazy loaded
        lazyLoadImages();
        lazyLoadBgImages();
    });

    $(".list-best__vdo").on("click", function(e) {
        //Params to work with NC
        var videoUrl = $(this).data("video-id");
        //Params for Comp redesigned popup
        var offset_media_key = $(this).data("media_key");
        var offset_media_position = $(this).data("media_position");
        var mspid = $(this).closest(".list-best__item").data("mspid");
        var query = [
            'mspid=' + mspid,
            'offset_media_key=' + offset_media_key,
            'offset_position=' + offset_media_position,
            /*Params to work with old popup in NC*/
            'primaryThumb=' + $(".list-best__img").data("image"),
            'maxThumbs=' + 0,
            'thumbId=' + $(".list-best__img").data("thumb-id"),
            'videoUrl=' + videoUrl
        ].join("&");
        var images_popup = $(".list-best__vdo").data("href");
        openPopup("http://www.mysmartprice.com/mobile/" + images_popup + "?" + query);
    });

    $(".js-shr-dl").on("click", function() {
        var tltp = $(".prdct-dtl__tlbr-shr-tltp");
        tltp.toggleClass("hide");
    });
    $(".js-shr-fb").on("click", function(e) {
        var url = encodeURIComponent(window.location.href);
        window.open("http://www.facebook.com/sharer/sharer.php?u=" + url + "&client_id=253242341485828", "_blank", "width=550,height=300");
    });
    $(".js-shr-twttr").on("click", function(e) {
        var url = encodeURIComponent(window.location.href),
            text = encodeURIComponent($(this).data("text"));
        window.open("https://twitter.com/share?url=" + url + "&via=mysmartprice&text=" + text, "_blank", "width=556,height=443");
    });
    $(".js-shr-eml").on("click", function(e) {
        var subject = encodeURIComponent($(this).data("subject")),
            body = encodeURIComponent($(this).data("body"));
        window.open("https://mail.google.com/mail/?view=cm&fs=1&su=" + subject + "&body=" + body, "_blank", "width=650,height=500");
    });
    $(".js-shr-lnk").on("click", function(e) {
        var tempInput = document.createElement("input");
        tempInput.style = "position: absolute; left: -1000px; top: -1000px";
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);

        $(".shr-tltp__lnk-cpd").animate({
            opacity: 1,
            top: "-12px",
        }, 150, function() {
            // Animation complete.
        });

        setTimeout(function() {
            $(".shr-tltp__lnk-cpd").animate({
                opacity: 0,
                top: "-40px",
            }, 150, function() {
                $(".shr-tltp__lnk-cpd").css({ top: "16px" });
            });
        }, 1200);
    });

    // Extension Rating Parameter (From mailer) handler:
    (function() {
        var rating;
        if (qS.extensionrating) {
            rating = qS.extensionrating.toString();
            window.ga && ga('send', 'event', 'Extension', 'extension-nps-click', rating, { nonInteraction: true });
            openPopup('/promotions/popups/extension_rating_popup.html');
        }
    })();

    (function prefillEmailInputs() {
        var $emailInputs = $("input[name='email']"),
            userEmail = getCookie("msp_login_email");
        if ($emailInputs.length && userEmail) {
            $emailInputs.val(userEmail);
        }
    }());

    // Exit intent popup selection (search for plugin_id and not instatab):
    (function() {
        if (location.href.indexOf("/deals/promotions") === -1 && !getCookie('plugin_id')) {
            openPageLeaveGTSPopup();
        }
    })();

    // Show loyalty education page-leave auto-popup
    function openPageLeaveGTSPopup() {
        if (window.location.pathname.indexOf("/refurbished/") !== 0 && $(".prdct-dtl, .fltr-wrpr1").length) {
            var invalidSources = ["pa-transact", "ps-transact", "browsing_pa_emailer", "browsing_ps_emailer"];
            if (window.qS && invalidSources.indexOf(qS.utm_source) === -1) {
                setTimeout(function() {
                    $("body").on("mouseleave", function(e) {
                        if (e.pageY < 5 && !getCookie("msp_login") && !$(".pop-up__ovrly, .popup-overlay").length) {
                            openPopup("/loyalty/popup/gts.php?type=pageleave", "PromoB");
                        }
                    });
                }, 5000);
            }
        }
    }

    lazyLoadImages();
    lazyLoadBgImages();
    attachFilterScroll();

    // form background lighten on focus
    $doc.on('focus', '.prc-tbl__lctn-inpt, .js-srch-lght, .eml-card__inpt-wrpr', function() {
        var $this = $(this);
        if ($this.hasClass('prc-tbl__lctn-inpt')) {
            $(this).closest('.prc-tbl__lctn-frm').addClass('lght-bkgnd-form');
        } else if ($this.hasClass('js-srch-lght')) {
            $(this).closest('.srch-wdgt').addClass('lght-bkgnd-form');
        } else if ($this.hasClass('eml-card__inpt-wrpr')) {
            $(this).closest('.eml-card__inpt-wrpr').addClass('lght-bkgnd-form');
        }
    });
    $doc.on('blur', '.prc-tbl__lctn-inpt, .js-srch-lght, .eml-card__inpt-wrpr', function() {
        var $this = $(this);
        if ($this.hasClass('prc-tbl__lctn-inpt')) {
            $(this).closest('.prc-tbl__lctn-frm').removeClass('lght-bkgnd-form');
        } else if ($this.hasClass('js-srch-lght')) {
            $(this).closest('.srch-wdgt').removeClass('lght-bkgnd-form');
        } else if ($this.hasClass('eml-card__inpt-wrpr')) {
            $(this).closest('.eml-card__inpt-wrpr').removeClass('lght-bkgnd-form');
        }
    });

    //Event Hadler for Logout
    $doc.on("click", ".js-user-lgt", function() {
        logoutme();
    });
    // Login UI update on page load. Will be shifted to msp.js when login is unified with Fashion.
    // true indicates this is called on ready
    update_ui();

    // RUI:: added new carousel classes inside code
    $(".js-crsl-wdgt, .widget-carousel").each(function() {
        var slideTimeout,
            $this = $(this);

        if ($this.data("autoplay"))
            $this.mCycle({
                mCycleItem: ".crsl__item",
                isAutoPlay: true
            });
        else
            $this.mCycle({
                mCycleItem: ".crsl__item"
            });
        // Tracking impressions of carousels

        var url = $this.data("impression-url");
        if (url) {
            if (url.indexOf("[timestamp]") >= 0) {
                url = url.replace("[timestamp]", $.now);
            }
            $.ajax({
                "url": url
            });
        }

        //Check with Arun once
        //$.ajax({ url: 'https://d.adx.io/views?xb=35BWU1550&xd=7&xnw=xsync&xtg=Affiliate&xtm_source=MSP_HVS_Feb&xtm_campaign=HVS_Feb&xtm_content=smallBanner&rnd=' + jQuery.now() + '' });

        $this.on("mousever", ".crsl-wdgt__prvs-btn, .prev-button", function() {
            $this.mCycle("pause").mCycle("slideRight");
            resetSlideTimeout();
        });
        $this.on("click", ".crsl-wdgt__prvs-btn, .prev-button", function() {
            $this.mCycle("pause").mCycle("slideRight");
            resetSlideTimeout();
        });
        $this.on("click", ".crsl-wdgt__next-btn, .next-button", function() {
            $this.mCycle("pause").mCycle("slideLeft");
            resetSlideTimeout();
        });
        $this.on("click", ".mCycleSlideBullet", function() {
            $this.mCycle("slideTo", $(this).index());
        });

        function resetSlideTimeout() {
            clearTimeout(slideTimeout);
            slideTimeout = setTimeout(function() {
                $this.mCycle("play");
            }, 10000);
        }


    });

    /* RUI:: new component for horizonal scrollable sections - start */
    $(".js-sldr").each(function(e) {
        elementSlider.init(this);
    });

    // Select text inside node on clicking it.
    $doc.on("click", ".js-slct-trgr", function() {
        MSP.utils.selectText($(this));
    });

    $doc.on("click", ".js-sldr__prvs", function() {
        elementSlider.slide(this, "left");
    });

    $doc.on("click", ".js-sldr__next", function() {
        elementSlider.slide(this, "right");
    });
    /* RUI:: new component for horizonal scrollable sections - end */

    /*    if(!(getCookie('user_country'))){
            $.ajax({
                url: "/util/get_user_country.php",
                async: false
                }).done(function (data) {
                });
        }
        if(getCookie('user_country') && getCookie('user_country').match(/united.*state/)){
                showFrosttyBanner();
        }
    */
});

// LOGIN FUNCTIONS START HERE

var loginCallbackQueue = [];

function loginCallback(fn, context, params) {
    if (getCookie("msp_login") == "1") {
        fn.apply(context, params);
    } else {
        loginCallbackQueue.push(function() {
            fn.apply(context, params);
        });
        $(".js-lgn").eq(0).click();
    }
}

function isUserPasswordExist(userEmail) {

    var dfd = $.Deferred();
    $.ajax({
        "url": "https://www.mysmartprice.com/users/login_common.php", //"/users/usermanage.php",
        "type": "POST",

        dataType: "JSON",
        "data": {
            "email": encodeURIComponent(userEmail),
            "process": "query_password",
            "login_type": "isUserPasswordExist"
        }
    }).done(function(response) {
        dfd.resolve(response);
    });

    return dfd.promise();
}


var extnsnWlcmPage = {};

if ($(".demo-login").length) {
    extnsnWlcmPage = {
        changeMessage: function() {
            var pluginInstallSource = getCookie("pluginInstallSource"),
                installationMessage = "";

            if (getCookie("msp_login")) {
                installationMessage = "Get Cashback on Every Purchase via MySmartPrice <a class='demo__knw-more' href='http://www.mysmartprice.com/loyalty/?ref=welcome#tabOpen=how_it_works'>Know More</a>";
                $(".demo-login .demo-signup__form").hide();
                if (pluginInstallSource && (pluginInstallSource === "deal-comparables" || pluginInstallSource === "pluginCashback")) {
                    installationMessage = "Complete Purchase via MySmartPrice and Get Cashback";
                }
            } else {
                installationMessage = "Signup and Get Rs.25<span class='demo-login__hdr-offr'>Cashback</span>";
                $(".demo-login .demo-signup__form").show();
                if (pluginInstallSource && (pluginInstallSource === "deal-comparables" || pluginInstallSource === "pluginCashback")) {
                    installationMessage = "Signup to Get Cashback";
                }
            }

            $(".demo-login .demo-login__hdr-cntnt").html(installationMessage);
        },
        signupFormValidator: function() {
            var $email = $('#demo-signup__email'),
                $password = $('#demo-signup__password'),
                $errorNode = $(".demo-login div.error");
            MSP.utils.validate.form([{
                "type": "email",
                "inputField": $email,
                "errorNode": $errorNode,
                "errorMsg": "Please enter a valid email"
            }, {
                "type": "required",
                "inputField": $password,
                "errorNode": $errorNode,
                "options": { "min": 6 },
                "errorMsg": "Password must be atleast 6 characters long"
            }]).done(function() {
                captureEmail($email.val());
                var loylaty_utm_source = qS.utm_source ? qS.utm_source : utmsource;
                if ($(".js-chrm-wlcm").length || $(".wlcm-hdr").length) {
                    loylaty_utm_source = "chrome welcome";
                }

                $.ajax({
                    type: "POST",
                    url: "https://www.mysmartprice.com/users/login_common.php", //"/users/usermanage.php"
                    dataType: "JSON",

                    async: false,
                    data: {
                        process: 'signup',
                        email: encodeURIComponent($email.val()),
                        password: $password.val(),
                        subscribed_status: 'subscribed',
                        source: 'desktop',
                        login_type: 'signup',
                        number: "",
                        utm_source: loylaty_utm_source
                    }
                }).done(function(msg) {
                    if (msg == "error" || msg.auth.result.msg == 'error') {
                        $errorNode.html("There is some error in signup. Please try after sometime");
                        if (getCookie('u99rs1deal')) {
                            alert('Unable to login. Please check credentials'); // Alert to bring back focus to current tab (Not GTS tab)
                        }
                    } else {
                        if (msg.auth.result.msg == 'true') {
                            setCookie("chrome_extension_welcome", "1", 1);
                            loginme(msg);
                            closePopup();
                        } else {
                            $errorNode.html(msg.auth.result.msg + ". <a class='js-popup-trgt demo-login__link' data-href='/users/login.html'>Click here to login</a>");
                            $errorNode.show();
                        }
                    }
                    return false;
                });
            });
            return false;
        },
        eventHandlers: function() {
            $(".demo-signup__email").change(function() {
                $(".demo-signup__email").blur(function() {
                    $this = $(this);
                    if (MSP.utils.validate.email($this.val())) {
                        $this.removeClass("hghlght-err-fld");
                        !$(".demo-signup__form .hghlght-err-fld").length && $(".demo-signup__form div.error").text("");
                    } else {
                        $this.addClass("hghlght-err-fld");
                        $(".demo-signup__form div.error").text("Please enter a valid email");
                    }
                });
            });
            $('.demo-signup__password').on('change', function() {
                $('.demo-signup__password').on('blur', function() {
                    $this = $(this);
                    if (MSP.utils.validate.required($this.val())) {
                        $this.removeClass("hghlght-err-fld");
                        !$(".demo-signup__form .hghlght-err-fld").length && $(".demo-signup__form div.error").text("");
                    } else {
                        $this.addClass("hghlght-err-fld");
                        $(".demo-signup__form div.error").text("Please enter a password");
                    }
                });
            });
            $('.demo-signup__submit').click(function(e) {
                e.preventDefault();
                extnsnWlcmPage.signupFormValidator();
            });
        },
        init: function() {
            this.eventHandlers();
        }
    }
}

function windowLogin(pageType, queryParams){
    var pageURL = "https://www.mysmartprice.com/users/";

    if (pageType == "signup") {
        pageURL = "https://www.mysmartprice.com/users/signup.php";
    } else if (pageType == "login") {
        pageURL = "https://www.mysmartprice.com/users/login.php";
    }
    newWindow = window.open(pageURL + queryParams);
    window.addEventListener("message", receiveMessage, false);
}


$doc.on("click", ".js-lgn", function() {
    var windowParams = "?ref=bonusapp&destUrl=" + encodeURIComponent(window.location.href);
    if ((window.screenTop || window.screenY)  || navigator.platform.toUpperCase().indexOf('MAC')==-1) {
        windowParams += "&close=1";
    }
    windowLogin($(this).data("page"), windowParams);
});

function receiveMessage(event)
{
    if(event.origin=="https://www.mysmartprice.com" && event.data=="update_ui"){
        postLogin();
    }
}

function postLogin() {
	update_ui();
    newWindow.close();
}

function update_ui() {

    var defaultLoginName = "My Account",
        partial_login = getCookie("partial_login"),
        msp_login = getCookie("msp_login"),
        new_user = getCookie("new_user"),
        msp_user_image = getCookie("msp_user_image"),
        msp_login_name = getCookie("msp_login_name") || "",
        msp_login_email = getCookie("msp_login_email") || "",
        userLinks = [
            '<div class="user-link">',
            '<div class="drpdwn-wdgt__item user-link__rwrds js-open-link" data-open-link="/me">',
            '<span class="user-link__icon-rwrds"></span> My Cashback</div>',
            '</div>'
        ].join(""),
        partialLoginUserLinks = [
            '<div class="user-link js-prtl-lgn">',
            '<div class="drpdwn-wdgt__item user-link__rwrds js-open-link" data-need-login="true" data-open-link="/me">',
            '<span class="user-link__icon-rwrds"></span> My Cashback</div>',
            '</div>'
        ].join("");

    $(".js-trck-sign-up").show();
    $(".cshbck-str__top").show();
    $(".cshbck-str__top-sign").removeClass("hide");
    if (partial_login || msp_login) {
        $(".cshbck-str__top-sign").addClass("hide");
        if (!parseInt(getCookie("msp_loyalty_points"))) {
            $.ajax({
                url: '/users/get_msp_coins.php',
                async: false,
                type: "POST",
                data: encodeURIComponent(msp_login_email)
            }).done(function(result) {
                result = JSON.parse(result);
                if (result) {
                    if (result["coins"]) {
                        // setting cookie for a day only
                        // we need to check if the user is flagged or not daily
                        setCookie("msp_loyalty_points", result["coins"], 1);
                    }
                    // check if the user is flagged
                    // set cookie if the user is flagged
                    if (result["may_4th"]) {
                        setCookie("may_4th", "712", 30);
                    }
                }
            });
        }
        $(".js-trck-sign-up").hide();
        $(".cshbck-str__top").hide();
    }

    //Loyalty Experiment
    var coinText = "",
        coinSubText = "",
        loyaltyPoints = $.trim(getCookie("msp_loyalty_points")).replace(/\D/g, "") || 0;
    // Logged in and hideLoyaltyOnBoarded
    if ((msp_login == "1" || partial_login)) {
        coinText = '&#8377;<span class="js-lylty-pnts">' + loyaltyPoints + '</span>';
        coinSubText = 'in your account';
    } else { // All other cases do not show amount
        coinText = 'Upto 12%<br>Cashback';
        coinSubText = 'on every purchase';
    }

    var hdrCoinsLoggedIn = [
            '<div class="hdr__user" style="display: block">',
            '<div class="hdr__call-out  hdr__call-out--lgd-in js-lylty-hdr js-open-link" data-need-login="true" data-open-link="/me/">',
            '<div class="hdr__call-out-ttl">' + coinText + '</div>',
            '<div class="hdr__call-out-sbttl">' + coinSubText + '</div>',
            '</div>',
            '</div>'
        ].join(''),
        hdrCoinsLoggedOut = [
            '<div class="hdr__user" style="display: block">',
            '<div class="hdr__user-lgn btn btn--s btn--no-bg js-lgn" data-page="login">Login</div>',
            '<div class="hdr__user-sign-up btn btn--s btn--grn js-lgn" data-page="signup">Sign Up</div>',
            '</div>'
        ].join('');

    if (msp_login == "1") {
        while (loginCallbackQueue.length) {
            (loginCallbackQueue.shift())();
        }

        // [Start] Sidebar signup widget update
        setCookie("partial_login", "", -1);
        $(".sdbr-login").length && sdbrWlcmPage.showCnfrmtn();
        $(".demo-login").length && extnsnWlcmPage.changeMessage();

        // [Start] changing contextual text and url of "many more exciting gifts" on how-it-works page
        if ($(".pnts-intro")[0]) {
            $(".js-grid__text--sign-up").removeClass("js-lgn js-popup-trgt").attr("href", "/me/#tabOpen=redemption").removeAttr("data-href").text("View all >>");
        }
        // [End] changing contextual text and url of "many more exciting gifts" on how-it-works page

        // [End] Sidebar signup widget update

        $(".hdr__user").length && $(".hdr__user").replaceWith(hdrCoinsLoggedIn);
        $(".drpdwn-wdgt").length && $(".drpdwn-wdgt").addClass('loggedIn').removeClass('loggedOut');

        // If partial user is already login
        if ($(".user-dtls").length) {
            if ($(".user-dtls").html().indexOf("user-link") < 0) {
                $(".user-nm-wrpr").after(userLinks);
            }
        }

        $(".user-nm").length && $(".user-nm").text("Hi" + (msp_login_name ? ", " + msp_login_name : "") + "!");
        $(".user-email").length && $(".user-email").text(msp_login_email);
        $(".user-img").length && $(".user-img").addClass("user-img--loggedin");
        if (msp_user_image) {
            $(".user-img").length && $(".user-img").css("background-image", 'url(' + msp_user_image + ')');
        }
        $(".js-ftr-eml-wrpr").hide();

        (function hideHeroSection() {
            var $hero = $(".hero");
            if ($hero.is(":visible")) {
                $(".hdr-logo, .hdr__user, .crsl-wdgt").slideDown("slow", function () {
                    $(".hdr__call-out").not('.hdr__call-out--lgd-in').hide();
                });
                $hero.slideUp("slow");
                $(".hdr").removeClass("hdr--hero");
            }
        }());

    } else if (partial_login) {
        if (new_user == "true") {
            isUserPasswordExist(msp_login_email).done(function(response) {
                if (response.auth.result.msg == "password_set") {
                    setCookie("new_user", "", -1);
                }
            });
        }

        $(".hdr__user").length && $(".hdr__user").replaceWith(hdrCoinsLoggedIn);
        $(".drpdwn-wdgt").length && $(".drpdwn-wdgt").addClass('loggedIn').removeClass('loggedOut');
        $('.js-prtl-lgn')[0] ? $('.js-prtl-lgn').remove() : '';
        $(".user-nm-wrpr").length && $(".user-nm-wrpr").after(partialLoginUserLinks).attr("data-need-login", "true");
        $(".user-nm").length && $(".user-nm").text("Hi" + (msp_login_name ? ", " + msp_login_name : "") + "!").attr("data-need-login", "true");
        $(".user-email").length && $(".user-email").text(msp_login_email).attr("data-need-login", "true");
        $(".js-ftr-eml-wrpr").show();
    } else {
        // [Start] Sidebar signup widget hide or show
        $(".sdbr-login").length && sdbrWlcmPage.hideCnfrmtn();
        $(".demo-login").length && extnsnWlcmPage.changeMessage();
        // [End] Sidebar signup widget hide or show

        $(".hdr__user").length && $(".hdr__user").replaceWith(hdrCoinsLoggedOut);
        $(".drpdwn-wdgt").length && $(".drpdwn-wdgt").removeClass('loggedIn');
        $(".user-link").length && $(".user-link").remove();
        $(".user-img").length && $(".user-img").css("background-image", '').removeClass("user-img--loggedin");
        $(".js-ftr-eml-wrpr").show();
    }

    setTimeout(function() {
        $('.hdr__call-out').not('.hdr__call-out--lgd-in').addClass('slide-left');
    }, 2000);
}



$doc.on('mouseenter', '.drpdwn-wdgt', function() {
    if (!$(this).hasClass('loggedIn')) {
        $(".drpdwn-wdgt").addClass('loggedOut');
    }
});



function loginme(msg) {
    var responseInfo,
        wiz_uid = get_uid(),
        wiz_msg = '"' + msg + '"';

    var loyalty_cookie = getCookie('msp_loyalty');
    setCookie("msp_login", "1", 365);

    if (!loyalty_cookie) {
        setCookie("msp_loyalty", "1", 365);
    }
    var msp_login = getCookie("msp_login");

    if (!(msg.auth.login_type == 'facebook' || msg.auth.login_type == 'gplus' || msg.auth.login_type == 'resetpass')) {
        setCookie("msp_login_uid", msg.auth.result.user_id, 365);
        setCookie("msp_login_name", msg.auth.result.user_name, 365);
    }
    setCookie("msp_login_email", msg.auth.result.email_id, 365);
    setCookie("msp_loyalty_points", msg.loyalty.result.msp_coins, 1);
    setCookie("hideLoyaltyOnBoarded", msg.loyalty.result.onboarded, 365);
    setCookie("msp_token", msg.loyalty.result.msp_token, 365);

    update_ui();

    // Referral Logging.
    if ($(".body-wrpr").data("page-type") === 'refer') {
        window.ga && ga('send', 'event', 'Refer', 'ReferralLoginAction');
        setCookie('referralLoginReload', 1); // Cookie to prevent GA logging on reload.
        window.location.reload(); // Reload the page so that refID for referral page is created for email.
    }

    if (dataLayer[0].pagetype === "loyalty") {
        if (msg.loyalty.result.nonmsp_bonus_credited) { // If user haven't any account and eligible for nonmsp bonus
            setCookieMins("nonmsp_bonus_credited", msg.loyalty.result.nonmsp_bonus_credited, 20);
        }
        location.reload();
    } else if ((msg.auth.login_type === "signup" || msg.auth.login_type === "signup_loyalty" || msg.auth.login_type === "resetpass" || msg.auth.login_type === "facebook" || msg.auth.login_type === "gplus") && !loyalty_cookie) {
        if (msg.loyalty.nonmsp_bonus_credited) { // If user haven't any account and eligible for nonmsp bonus
            setCookieMins("nonmsp_bonus_credited", msg.loyalty.result.nonmsp_bonus_credited, 20);
        }
        if (getCookie("cb_instant")) {
            window.location.href = '/me';
        } else if (getCookie("u99rs1deal")) {
            window.location.href = '/me';
            deleteCookie('u99rs1deal');
        } else {
            if (!getCookie("chrome_extension_welcome") && !qS.destUrl)
                window.location.href = "/loyalty/#tabOpen=how_it_works";
        }
    }

    // Temporary - for signup&email capture flow on extension install:
    if (msg.auth.login_type === "login" && getCookie("cb_instant")) {
        window.location.href = '/me';
    }
}


var FBloggedIn = false;

function loginme_by_fb(msg, img, name) {
    FBloggedIn = true;
    setCookie("msp_login_name", name, 365);
    setCookie("msp_user_image", img, 365);
    loginme(msg);
}

function logoutme() {
    setCookie("msp_login", "", -1);
    setCookie("partial_login", "", -1);
    setCookie("new_user", "", -1);
    setCookie("msp_login_name", "", -1);
    setCookie("msp_user_image", "", -1);
    setCookie("msp_loyalty_points", "", -1);
    setCookie("msp_tier", "", -1);
    setCookie("hideSupportPopup_loyalty", "", -1);
    setCookie("hideLoyaltyOnBoarded", "", -1);

    FBloggedIn = false;

    $.ajax({
        "url": "https://www.mysmartprice.com/users/login_check.php?type=logout",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false
    }).done(function(response) {
        console.log("Logged Out from MSP");
    });

    if (dataLayer[0].pagetype === "loyalty") {
        window.location.href = "/";
    } else if ($(".pnts-intro")[0]) {
        location.reload();
    }
    update_ui();
    $.ajax({
        "url": "https://www.mysmartprice.com/users/login_check.php?type=logout",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        },
        async: false
    }).done(function(response) {
        console.log("Logged Out from MSP");
    });
}

$doc.on("click", ".js-lylty-signup, .js-trck-sign-up", function() {
    if ($(this).hasClass("js-trck-sign-up-cb")) {
        window.ga && ga("send", "event", "Loyalty", "click", "PDP-signup", "cashback");
    }
    setCookieMins("signup-utm", $(this).data("utmsource") || "", 2);
});

// LOGIN FUNCTIONS END HERE


/* RUI:: new component for horizonal scrollable sections - start */
elementSlider = {
    "init": function(slider) {
        var slideItem = $(slider).data("slideitem"),
            slideItemWrapper = $(slider).data("slideitemwrapper");

        if (!slideItem || !slideItemWrapper) return;
        if ($(slider).find("." + slideItemWrapper).hasClass("js-sldr-item-wrpr1")) return;

        var $elements = $(slider).find("." + slideItem),
            countCurrItems = Math.floor($(slider).find("." + slideItemWrapper).eq(0).width() / $elements.eq(0).outerWidth(true)),
            elementWidth = $($(slider).find("." + slideItem).get(0)).outerWidth(true),
            wrapperWidth = elementWidth * $elements.length;

        if ($elements.length > countCurrItems) {
            $(slider).find("." + slideItemWrapper).addClass("js-sldr-item-wrpr1").wrapInner("<div class='js-sldr-item-wrpr'></div>");
            $(slider).find("." + slideItem).eq(0).addClass("js-sldr-crnt");
            $(slider).find(".js-sldr__prvs").addClass("js-sldr__dsbl-btn").show();
            $(slider).find(".js-sldr__next").show();
        }

        $('.js-sldr-item-wrpr').css('width', wrapperWidth + 'px');
    },

    "slide": function(element, direction) {
        var $slider = $(element).closest(".js-sldr"),
            slideItemWrapper = $slider.data("slideitemwrapper"),
            $elementWrapper = $slider.find(".js-sldr-item-wrpr"),
            slideItem = $slider.data("slideitem"),
            $elements = $elementWrapper.find("." + slideItem),
            $currentElement = $elements.filter(".js-sldr-crnt"),
            $startElement = null,

            countCurrItems = Math.floor($('.' + slideItemWrapper).width() / $elements.eq(0).outerWidth(true)),
            countRightItems = $elements.length - $elements.index($currentElement) - countCurrItems,
            countLeftItems = $elements.index($currentElement),
            elementPos;

        if ($(element).hasClass("js-sldr__dsbl-btn") || $(element).hasClass("js-sldr__dsbl-btn"))
            return;

        $(element).siblings(".js-sldr__prvs").removeClass("js-sldr__dsbl-btn");
        $(element).siblings(".js-sldr__next").removeClass("js-sldr__dsbl-btn");

        if (direction === 'right') {
            if (countRightItems > countCurrItems) {
                $startElement = $elements.eq($elements.index($currentElement) + countCurrItems);
            } else {
                $startElement = $elements.eq($elements.length - countCurrItems);
                $(element).addClass("js-sldr__dsbl-btn");
            }
        } else if (direction === 'left') {
            if (countLeftItems > countCurrItems) {
                $startElement = $elements.eq($elements.index($currentElement) - countCurrItems);
            } else {
                $startElement = $elements.eq(0);
                $(element).addClass("js-sldr__dsbl-btn");
            }
        }

        $currentElement.removeClass("js-sldr-crnt");
        $startElement.addClass("js-sldr-crnt");

        //IE dones not support transitions.
        elementPos = -$startElement.position().left;
        if (MSP.utils.browser.name === "MSIE" && MSP.utils.browser.version < 9) {
            $elementWrapper.css({
                "left": elementPos
            });
        } else {
            $elementWrapper.css({
                'transform': 'translateX(' + elementPos + 'px)',
                '-webkit-transform': 'translateX(' + elementPos + 'px)',
                '-ms-transform': 'translateX(' + elementPos + 'px)'
            });
        }


        return false;
    }
}
/* RUI:: new component for horizonal scrollable sections - end */

// Takes the argument, or query string or hash of the current URL
// and returns an object with those key-value pairs as its properties
function queryString(searchOrHash) {
    var query,
        query_string = {},
        vars;

    if (searchOrHash) {
        query = searchOrHash;
    } else if (window.location.search) {
        query = window.location.search;
    } else if (window.location.hash) {
        query = window.location.hash;
    } else {
        return {};
    }

    vars = query.substring(1).split("&");

    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined")
            query_string[pair[0]] = decodeURIComponent(pair[1]);
        else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
        } else
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }

    return query_string;
}

/* RUI:: function to create hash from url params - start */
function generateHash(params) {
    var hash = "#",
        index = 0;
    $.each(params, function(key) {
        var value, prefix;
        if (params[key]) {
            prefix = index ? "&" : "";
            value = key === "property" && $.isArray(params[key]) ? params[key].join("|") : params[key];
            hash += prefix + key + "=" + value;
        }
        index++;
    });
    return hash;
}
/* RUI:: function to create hash from url params - end */

// autopopup processing start here::
setTimeout(function() {
    openAutoPopup(); // open auto popup after autoPopupTimeout
}, autoPopupTimeout);

setTimeout(function() {
    pageLeavePopupBind(); // bind page leave auto popup after pageLeaveTimeout
}, pageLeaveTimeout);
// autopopup processing end here



if ($(".body-wrpr").length !== 0) {
    /* RUI:: scroll to the element on page with data-id = current/onload url hash value - start */

    (function() {
        // onload if hash has a scrollTo param then scroll to section without animation.
        var hashObj = queryString(decodeURI(window.location.hash));
        if (hashObj) {
            setTimeout(function() {
                if (hashObj.scrollTo) { scrollToLink(hashObj, true); }
                if (hashObj.clickElt) { clickElement(hashObj); }
            }, 300);
        }

        // on hashchange: act upon the scrollTo and clickElt hash params
        $win.on('hashchange', function() {
            hashObj = queryString(decodeURI(window.location.hash));
            if (hashObj.scrollTo) { scrollToLink(hashObj, false); }
        });

        // scroll hash handler
        var scrollToLink = function(hashObj, onLoad) {
            var finalScrollPos = Math.ceil($('[data-id="' + hashObj.scrollTo + '"]').offset().top - $(".sctn--page-nvgtn").height() - 10);

            if (onLoad) {
                $("body").scrollTop(finalScrollPos);
                return;
            }

            if (hashObj && hashObj.scrollTo && $('[data-id="' + hashObj.scrollTo + '"]').length) {
                var $roots = $("html, body");

                $roots.on("scroll.inpageLink mousedown.inpageLink wheel.inpageLink DOMMouseScroll.inpageLink mousewheel.inpageLink keyup.inpageLink touchmove.inpageLink", function() {
                    $roots.stop();
                });

                $roots.animate({ "scrollTop": finalScrollPos }, "slow", function() {
                    $roots.off("scroll.inpageLink mousedown.inpageLink wheel.inpageLink DOMMouseScroll.inpageLink mousewheel.inpageLink keyup.inpageLink touchmove.inpageLink");
                });
            }
        };

        // click hash handler
        var clickElement = function(hashObj) {
            if (hashObj && hashObj.clickElt) {
                $(hashObj.clickElt).trigger('click');
            }
        };

        var $pageNav = $(".sctn--page-nvgtn");
        if ($pageNav.length) {
            var stickyPoint = Math.ceil($pageNav.offset().top);
            $win.scroll(MSP.utils.throttle(function() {
                if (Math.ceil($win.scrollTop()) > stickyPoint) {
                    $pageNav.addClass("sctn--stcky-nvgtn");
                } else {
                    $pageNav.removeClass("sctn--stcky-nvgtn");
                }
            }, 100));
        }

        // scroll event handler
        $doc.on("click", ".js-inpg-link", function() {
            var $this = $(this);
            if ($this.data("action") === "disabled") return false;

            // a/b testing for video reviews
            // sending 1/5 of users to video reviews
            // and remaining 4/5 of users to user reviews
            if ($this.data("href") === "user-reviews") {
                var msp_uid = getCookie("msp_uid");
                if (msp_uid % 5 === 0) {
                    $this.data("href", "video-reviews");
                    window.ga && ga("send", "event", "PDPReviewLink", "click", "video-reviews");
                    // attach ga event
                } else {
                    window.ga && ga("send", "event", "PDPReviewLink", "click", "text-reviews");
                    // attach ga event
                }
            }

            if (!hashObj) hashObj = {};
            hashObj.scrollTo = $this.data("href");

            if (generateHash(hashObj) != window.location.hash) {
                window.location.hash = generateHash(hashObj);
            }
            scrollToLink(hashObj);
            return false;
        });
    }());
    /* RUI:: scroll to the element on page with data-id = current/onload url hash value - end */
} else {
    /* OLD::inpageLinking - start */
    //handeling hash in window
    ;
    (function() {
        var inpageLinking = function(id) {
            if (id !== "" && id !== "#") {
                try {
                    if ($(id).length) {
                        $('html, body').animate({
                            "scrollTop": ($(id).offset().top - 90) + "px"
                        });
                    }
                } catch (err) {
                    //
                }
            }
        }

        $win.on('hashchange', function() {
            inpageLinking(window.location.hash);
            return false;
        });

        $doc.on('click', 'a[href^="#"]', function(event) {
            event.preventDefault();
            inpageLinking($(this).attr('href'));
        });

        $win.on('load', function() {
            inpageLinking(window.location.hash);
        });
    }());
    //hash change handeling end
    /* OLD::inpageLinking - end */
}

/* RUI:: header dropdowns functionality - start */
;
(function headerDropdownsHandlers() {
    var menuShowTimeout;
    $doc.on('click', 'body, .js-ctgry-btn, .js-drpdwn-menu-wrpr', function(e) {
        var data, time, now, diffTime, loadingTimeout;

        e.stopPropagation();

        if (!$('.drpdwn-menu-wrpr--show').length && $(this).hasClass("js-ctgry-btn")) {
            $('.js-drpdwn-menu-wrpr').addClass('drpdwn-menu-wrpr--show');
            $('.js-drpdwn-menu-ovrly').addClass('drpdwn-menu-ovrly--show');
            if ($win.height() < $(".drpdwn-menu").height() + $('.js-drpdwn-menu-wrpr').offset().top) {
                $(".js-drpdwn-menu-wrpr").addClass("drpdwn-menu-wrpr--s");
            }
            if ($('.drpdwn-menu').data('processed') == 'done' && location.hash !== '#forcepopup') {
                menuShowTimeout = setTimeout(function() {
                    $('.drpdwn-menu').addClass('drpdwn-menu--show');
                }, 340);
                return; //if already procesed
            }

            if (localStorage && location.hash !== '#forcepopup') {
                //check if data is not one week old
                time = parseInt(localStorage.browsePopupDataTime, 10);
                now = new Date().getTime();
                diffTime = (now - time) / (1000 * 60 * 60 * 24);

                if (diffTime < 30 && localStorage.browsePopupDataVer == $('.js-drpdwn-menu-wrpr').data('ver')) {
                    //getting data from localStorage
                    data = localStorage.browsePopupData;
                }
            }

            if (!data || data == 'undefined' || data === undefined) {
                loadingTimeout = setTimeout(function() {
                    $('.js-drpdwn-menu-wrpr').find('.drpdwn-menu-wrpr__ldng').show();
                }, 600);
                data = getBrowsePopupData();
                localStorage.browsePopupData = data;
                localStorage.browsePopupDataTime = new Date().getTime();
                localStorage.browsePopupDataVer = $('.js-drpdwn-menu-wrpr').data('ver');
                // if data is not avaialble in localStorage do ajax and save in localStorage for later use
            }
            if (data && data != 'undefined' && data !== undefined) {
                $('.drpdwn-menu').html(data).data('processed', 'done');
                menuShowTimeout = setTimeout((function() {
                    $('.js-drpdwn-menu-wrpr').find('.drpdwn-menu-wrpr__ldng').hide();
                    clearTimeout(loadingTimeout);
                    $('.drpdwn-menu').addClass('drpdwn-menu--show');
                }), 340);
                // on data available hide loading and show data
            }
        } else if (!$(this).hasClass('js-drpdwn-menu-wrpr')) {
            clearTimeout(menuShowTimeout);
            $('.js-drpdwn-menu-wrpr').removeClass('drpdwn-menu-wrpr--show');
            $('.drpdwn-menu').removeClass('drpdwn-menu--show');
            $('.js-drpdwn-menu-ovrly').removeClass('drpdwn-menu-ovrly--show');
            $('.js-drpdwn-menu-wrpr').find('.drpdwn-menu-wrpr__ldng').hide();
        }
    });
}());

/* RUI:: header dropdowns functionality - end */


/*
 * OLD:: callouts are old site feature
 * new feature is tooltip
 * starts here
 */

// Callout tooltip functions start here
function showCallout($target, animate) {
    var data = $target.data("callout");
    if (!data)
        return;
    $(".callout").remove();
    $("body").append("<div class='callout top-left'" + (animate ? " style='display: none;'" : "") + ">" + data + "</div>");
    var deltaTop = 7,
        deltaLeft = $target.hasClass("store_help") ? 4 : 0,
        $callout = $(".callout"),
        topValue = $target.offset().top - $callout.outerHeight() - deltaTop;
    $callout.css({
        "top": topValue,
        "left": $target.offset().left - deltaLeft
    });
    if (topValue - $(window).scrollTop() - $(".header").outerHeight() <= 0)
        $callout.toggleClass("top-left bottom-left").css("top", $target.offset().top + $target.outerHeight() + deltaTop);
    if (animate)
        $callout.slideDown("fast");
}

function hideCallout(animate) {
    if (animate) {
        $(".callout").slideUp("fast", function() {
            $(this).remove();
        });
    } else
        $(".callout").remove();
}

$doc.on("mouseenter", ".callout-target:not(.callout-onclick)", function() {
    showCallout($(this), false);
}).on("mouseleave", ".callout-target:not(.callout-onclick)", function() {
    hideCallout(false);
});

$doc.on("click", ".callout-target.callout-onclick", function() {
    if (!$(".callout").length) {
        showCallout($(this), true);
        return false;
    }
}).on("click", function() {
    hideCallout(true);
});
// Callout tooltip functions end here
/* OLD:: callouts are old site feature - ends here */


/* RUI:: Tooltips - start */
// tooltip callouts processing start here
$doc.on('mouseenter', '.js-tltp', function() {
    $('.tltp').remove();
    var $this = $(this),
        data = $this.data('tooltip'),
        tooltipDirection = $this.data('tooltip-direction') || "tltp--top-left";
    if (data === "" || data === undefined) return;
    $('body').append('<div class="tltp ' + tooltipDirection + '">' + data + '</div>');
    $tooltip = $('.tltp');

    if ($(this).data('tooltip').length > 50 || true) {
        $tooltip.css({ 'font-size': '11px', 'line-height': '1.5' });
    }

    if (tooltipDirection === "tltp--top-rght") {
        $tooltip.css('left', $this.offset().left - $tooltip.outerWidth() + $(this).outerWidth() + 4);
        $tooltip.css('top', $this.offset().top - $tooltip.outerHeight() - 10);
        if ($tooltip.offset().top - $win.scrollTop() < 0) {
            $tooltip.removeClass(tooltipDirection).addClass('tltp--btm-rght');
            $tooltip.css('top', $this.outerHeight() + $this.offset().top + 10);
        }
    } else if (tooltipDirection === "tltp--top-left") {
        $tooltip.css('left', $this.offset().left - 4);
        $tooltip.css('top', $this.offset().top - $tooltip.outerHeight() - 10);
        if ($tooltip.offset().top - $win.scrollTop() < 0) {
            $tooltip.removeClass(tooltipDirection).addClass('tltp--btm-left');
            $tooltip.css('top', $this.outerHeight() + $this.offset().top + 10);
        }
    } else if (tooltipDirection === "tltp--btm-rght") {
        $tooltip.css('left', $this.offset().left - $tooltip.outerWidth() + $(this).outerWidth() + 4);
        $tooltip.css('top', $this.offset().top + $this.outerHeight() + 10);
        if ($win.scrollTop() + $win.height() - $tooltip.offset().top < 0) {
            $tooltip.removeClass(tooltipDirection).addClass('tltp--btm-rght');
            $tooltip.css('top', $this.offset().top - $tooltip.outerHeight() - 10);
        }
    } else if (tooltipDirection === "tltp--btm-left") {
        $tooltip.css('left', $this.offset().left - 4);
        $tooltip.css('top', $this.offset().top + $this.outerHeight() + 10);
        if ($win.scrollTop() + $win.height() - $tooltip.offset().top < 0) {
            $tooltip.removeClass(tooltipDirection).addClass('tltp--btm-left');
            $tooltip.css('top', $this.offset().top - $tooltip.outerHeight() - 10);
        }
    } else if (tooltipDirection === "tltp--left") {
        $tooltip.css('left', $this.offset().left - $tooltip.width() - 30);
        $tooltip.css('top', $this.offset().top + $this.outerHeight() / 2 - 10);
    }

});

$doc.on('mouseleave', '.js-tltp', function() {
    $('.tltp').remove();
});
/* RUI:: Tooltips - end */

/* RUI:: Message Boxes - start */

$doc.on("click", ".js-msg-box-trgt", function(e) {
    if ($(e.target).hasClass("js-msg-box__cls")) return false;

    $(".msg-box").removeClass("msg-box--show");
    $(this).find(".msg-box").addClass("msg-box--show");
});

$doc.on("click", ".js-msg-box__cls", function() {
    $(this).closest(".msg-box").removeClass("msg-box--show");
    return false;
});

/* RUI:: Message Boxes - start */


/* RUI:: open non anchor links - start */
$doc.on("click", ".js-open-link", function() {
    var $this = $(this),
        url = $this.data("open-link"),
        inNewTab = $this.data("new-tab"),
        needLogin = $this.data("need-login");

    if (!url) return false;

    function openLink() {
        if (inNewTab === true) {
            window.open(url);
        } else {
            window.location.href = url;
        }
    }

    if (needLogin == true) {
        if (getCookie("new_user")) {
            openPopup('/users/cp.html');
            return true;
        }
        loginCallback(openLink, window, []);
    } else {
        openLink();
    }

    return false;
});

/* RUI:: open non anchor links - start */
$doc.on("click", ".js-open-hash", function() {
    window.location.hash = $(this).data("open-hash") || "";
    return false;
});
/* RUI:: open non anchor links - end */

// popups processing start here
// RUI:: added new classes for popup targets
// OLD:: old classes of popup elements are there.

/*
 * refactor after new site's single page(PDP) goes live
 */

$doc.on('click', '.popup-target, .js-popup-trgt', function() {

    if ($(this).parent(".exprt-rvw__glry-thmbnl").length != 0)
        return false;

    var $this = $(this),
        popupUrl = $this.attr('href'),
        storeUrl,
        popupType = $this.data('promo');

    popupDataObj = {
        type: $this.data('popup-type')
    }

    if ($this.hasClass("js-wdgt-gts")) {
        window.ga && ga("send", "event", "Loyalty", "click", "lylty-deals-wdgt-cta", "1");
        var storeLink = $(this).data("url");
        window.open(storeLink, '_blank');

        if (getCookie("msp_login")) {
            return true;
        }
        setCookieMins("signup-utm", $(this).data("utmsource") || "", 2);
    }

    if ($this.is(".prdct-dtl__tlbr-prc-alrt")) {
        if (handleStorePriceAlert($this)) {
            return false;
        }
    }

    if ($this.hasClass("js-prc-tbl__gts-btn")) {
        var cookieName = $this.data("cookiename");
        storeUrl = $this.data('url');

        if (getCookie(cookieName)) {
            window.open(storeUrl);
            return true;
        }

        if ((getCookie('msp_login') || getCookie('partial_login')) && ($this.hasClass("js-check-email-cookie") || ($this.hasClass("check-email-cookie")))) {
            window.open(storeUrl);
            return true;
        }

        if (cookieName) {
            var cookieTimeMins = parseInt($this.data("cookietimemins"), 10),
                cookieTimeDays = parseInt($this.data("cookietimedays"), 10);
            if (!isNaN(cookieTimeMins)) {
                addCookieMins(cookieName, "true", cookieTimeMins);
            } else if (!isNaN(cookieTimeDays)) {
                addCookie(cookieName, "true", cookieTimeDays);
            }
        }

        setCookie('autoPopup', '1', 1);
    }

    if (!popupUrl || popupUrl == "#" || $this.hasClass("storebutton")) {
        popupUrl = $this.data('href');
    }
    _gPopStoreUrl = storeUrl;

    if (popupUrl && popupUrl !== "#") {
        openPopup(popupUrl, popupType);
    }

    return false;
});

// Old:: site 'handleStorePriceAlert'

function handleStorePriceAlert($target) {
    if (sessionStorage && sessionStorage.storePriceAlertEmail) {
        var $pageTitle = $("#mspSingleTitle"),
            $priceLine = $target.closest(".store_pricetable");
        var capture_point, storename;

        capturepoint = $pageTitle.data("capturepoint");
        storename = $priceLine.find(".store_img img").attr("alt");
        if (capturepoint == 'outofstock' || capturepoint == 'upcoming') {
            storename = 'all';
        }

        $.ajax({
            url: "/price_alert/capture_email.php",
            data: {
                "email": sessionStorage.storePriceAlertEmail,
                "mspid": $pageTitle.data("mspid"),
                "bestprice": $pageTitle.data("bestprice"),
                "storeprice": $priceLine.data("pricerank"),
                "storename": storename,
                "popupname": "pricealert",
                "capture_point": capturepoint
            },
            cache: false
        });

        window._vis_opt_queue = window._vis_opt_queue || [];
        window._vis_opt_queue.push(function() { _vis_opt_goal_conversion(200); });

        $target.removeClass("popup-target callout-target").addClass("alert_set btn-disabled").text("Alert Set");
        return true;
    } else {
        $target.addClass("popup_opened");
        popupQueue.push(function() {
            $target.removeClass("popup_opened");
        });
    }
}

// End of old:: site 'handleStorePriceAlert'
//
// New Site :: RUI implementation of handleStorePriceAlert
// Commented out RUI code till PDP pages go live
// function handleStorePriceAlert($target) {
//     if (sessionStorage && sessionStorage.storePriceAlertEmail) {
//         var $pageTitle = $(".prdct-dtl__ttl"),
//             $priceLine = $target.closest(".prc-tbl-row");

//         $.ajax({
//           url: "/price_alert/capture_email.php",
//           data: {
//             "email": sessionStorage.storePriceAlertEmail,
//             "mspid": $pageTitle.data("mspid"),
//             "bestprice": $pageTitle.data("bestprice"),
//             "storeprice": $priceLine.data("pricerank"),
//             "storename": $priceLine.find(".prc-tbl__str-logo").attr("alt"),
//             "popupname": "pricealert"
//           },
//           cache: false
//         });

//         window._vis_opt_queue = window._vis_opt_queue || [];
//         window._vis_opt_queue.push(function () { _vis_opt_goal_conversion(200); });

//         return true;
//     }
// }
// End of RUI :: handleStorePriceAlert Function

// Chrome plugin cashback offer
$doc.on('click', ".chrmcshbck-popup-target, .js-chrmcshbck-popup-trgt", function() {
    var $this = $(this),
        cookieName = $this.data("cookiename"),
        popupUrl = $this.data("href"),
        popupType = $this.data("promo");

    setCookie('autoPopup', '1', 1);

    if (getCookie(cookieName) === "true") {
        window.open($this.data("url"));
        return false;
    }

    if (cookieName) {
        var cookieTimeMins = parseInt($this.data("cookietimemins"), 10),
            cookieTimeDays = parseInt($this.data("cookietimedays"), 10);

        if (!isNaN(cookieTimeMins)) {
            addCookieMins(cookieName, "true", cookieTimeMins);
        } else if (!isNaN(cookieTimeDays)) {
            addCookie(cookieName, "true", cookieTimeDays);
        }
    }


    _gPopStoreUrl = $this.data('url');
    openPopup(popupUrl, popupType);

    return false;
});

// This function is to be refactored when single page goes live
$doc.on('click', ".loyalty-popup-target, .js-lylty-popup-trgt", function() {
    var $this = $(this),
        isLoggedIn = getCookie("msp_login"),
        loyaltyOnBoarded = getCookie("hideLoyaltyOnBoarded");
    cookieName = $this.data("cookiename"),
        popupUrl = $this.data("href"),
        isMandatory = false;

    setCookieMins('autoPopup', '1', 30);

    // Make loyalty GTS popup mandatory in appliances to 50% users (even uids) if logged out
    if (window.dataLayer && dataLayer[0].category === "appliance" && getCookie("msp_uid") % 2 === 0) {
        isMandatory = true;
    } else if (getCookie(cookieName) === "true") {
        window.open($this.data("url"));
        return true;
    }

    if (cookieName) {
        var cookieTimeMins = parseInt($this.data("cookietimemins"), 10),
            cookieTimeDays = parseInt($this.data("cookietimedays"), 10);

        if (!isNaN(cookieTimeMins)) {
            addCookieMins(cookieName, "true", cookieTimeMins);
        } else if (!isNaN(cookieTimeDays)) {
            addCookie(cookieName, "true", cookieTimeDays);
        }
    }

    if (isMandatory && (isLoggedIn || getCookie("partial_login"))) {
        window.open($this.data("url"));
        return true;
    } else if (isLoggedIn) {
        if (!loyaltyOnBoarded) {
            _gPopStoreUrl = $this.data("url");
            openPopup(popupUrl, "PromoB");
        } else {
            window.open($this.data("url"));
            return true;
        }
    } else {
        _gPopStoreUrl = $this.data("url");
        openPopup(popupUrl, "PromoB");
    }

    return false;
});

$doc.on('click', '.popup-closebutton', function() {
    closePopup();
});

$doc.on('click', '.popup-overlay', function() {
    $link = $(".popup-closebutton > a");
    if ($link[0] && $(this).hasClass("noclose")) {
        if ($link[0]) {
            window.open($link.attr('href'), '_blank');
        }
        closePopup();
    } else if (!$(this).hasClass("noclose")) {
        closePopup();
    }
});

$doc.on('click', '.pop-up__cls-btn, .popup-optn__link.usr-inputbox__input--lnk', function() {
    closePopup_RUI();
});

$doc.on('click', '.pop-up__ovrly', function() {
    $link = $(".pop-up__cls-btn > a");
    if ($link[0] && $(this).hasClass("noclose")) {
        if ($link[0]) {
            window.open($link.attr('href'), '_blank');
        }
        closePopup_RUI();
    } else if (!$(this).hasClass("noclose")) {
        closePopup_RUI();
    }
});

// popups processing end here

/*
 * OLD:: used only in single page filters dropdown
 * RUI:: new functionality is written in RUI code
 * starts here
 */
// Dropdown UI component (used on single page)
$doc.on("click", function() {
    $(".dropdown .dropdown-content").addClass("hide");
}).on("click", ".dropdown .btn-dropdown", function() {
    $(".dropdown .dropdown-content").toggleClass("hide");
    return false;
});
/* OLD:: used only in single page filters dropdown - end */
// Pre-fill email address from login cookie
$(document).on("focus", "input.prefill-email", function() {
    var $this = $(this);
    if (!$this.val() && getCookie("msp_login") == "1")
        $this.val(getCookie("msp_login_email"));
});
// Use it till new single page goes live



// autocomplete processing start here
bindAutoComplete(); // initializing the autoComplete
$doc.on("focus", ".srch-wdgt__fld", function() {
    $(this).autocomplete("search");
});
// autocomplete processing end here

/* OLD:: binding keys to close header browse popup. - start */
// binding keys start here
// $doc.keyup(function (e) {
//     if (e.keyCode == 27) { //esc button
//         if ($('.browse-popup-cont.show')
//             .length !== 0) {
//             $('.browse-menu-btn')
//                 .click(); //if browse menu is displayed close it
//         }
//         if ($('.popup-overlay')
//             .length !== 0) {
//             $('.popup-overlay')
//                 .click(); //if popup is displayed close it

//         }
//     }
// });

// $doc.keydown(function (e) {
//     if (e.altKey) { // checking for alt key
//         var key = String.fromCharCode(e.keyCode)
//             .toLowerCase();
//         switch (key) {
//             case 'c':
//                 $('.browse-menu-btn')
//                     .click();
//                 break;
//             case 's':
//                 $('.search-field')
//                     .focus();
//                 break;
//         }
//     }
// });
// binding keys end here
/* OLD:: binding keys to close header browse popup. - end */

/* RUI:: added classes of new UI to the existing handlers - start */
// binding keys start here
$doc.keyup(function(e) {
    if (e.keyCode == 27) { //esc button
        if ($('.browse-popup-cont.show, .drpdwn-menu-ovrly--show').length !== 0) {
            $('.browse-menu-btn .js-ctgry-btn').click(); //if browse menu is displayed close it
        }
        if ($('.popup-overlay').length !== 0) {
            $('.popup-overlay').click(); //if popup is displayed close it
        }

        if ($(".pop-up__cls-btn")[0]) {
            $link = $(".pop-up__cls-btn > a");
            if ($link[0]) {
                window.open($link.attr('href'), '_blank');
            }
            $link.trigger(closePopup_RUI());
        }
    }
});

$doc.keydown(function(e) {
    if (e.altKey) { // checking for alt key
        var key = String.fromCharCode(e.keyCode).toLowerCase();
        switch (key) {
            case 'c':
                {
                    $('.browse-menu-btn, .js-ctgry-btn').click();
                    break;
                }
            case 's':
                {
                    $('.srch-wdgt__fld').focus();
                    break;
                }
        }
    }
});
// binding keys end here
/* RUI:: added classes of new UI to the existing handlers - start */

//function are below

// ajax functions start here
function getAjaxDataSync(ajaxURL) {
    var ajaxData;
    $.ajax({
        url: ajaxURL,
        async: false,
        xhrFields: {
            withCredentials: true
        }
    }).done(function(data) {
        ajaxData = data;
    });
    return ajaxData;
}
// ajax functions end here

// cookie functions start here
function addCookieMins(c_name, value, expMins) {

    var expDate;
    var domain_name = ".bonusapp.in";

    if (expMins) {
        expDate = new Date();
        expDate.setTime(expDate.getTime() + (expMins * 60 * 1000));
        expDate = expDate.toUTCString();
    }
    var c_value = escape(value) + ((!expDate) ? "" : "; expires=" + expDate) + ";domain=" + domain_name + " ; path=/";

    document.cookie = c_name + '=' + c_value + ';';

    if (expMins < 0) {
        c_value = escape(value) + "; expires=" + expDate + "; path=/";
        document.cookie = c_name + '=' + c_value + ';';
    }

    if (c_name == 'msp_login_email') {
        if (window.dataLayer) {
            dataLayer.push({ 'event': 'email_success' });
        }
        log_data("pageView");
    }
}

function addCookie(c_name, value, expDays) {
    addCookieMins(c_name, value, expDays * 24 * 60);
}

function setCookie(c_name, value, recentexdays) {
    addCookie(c_name, value, recentexdays);
}

function setCookieMins(c_name, value, expMins) {
    addCookieMins(c_name, value, expMins);
}

function removeCookie(c_name) {
    addCookie(c_name, '', -1);
}

function deleteCookie(c_name) {
    removeCookie(c_name);
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    var ret_val;
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            ret_val = unescape(y);
        }
    }
    return ret_val;
}
// cookie functions end here


//Function to check login on MySmartPrice
function checkMSPLogin() {
    var currentURL = encodeURIComponent(window.location.href),
        loginURL = "https://www.mysmartprice.com/users/login.php?ref=bonusapp&destUrl=" + currentURL;

    $.ajax({
        "url": "https://www.mysmartprice.com/users/login_check.php",
        dataType:'json',
        xhrFields: {
            withCredentials: true
        },
        async: false
    }).done(function(response) {
        if (response && response.msp_login) {
        		setCookie("cookie_sync", true, 365);
            setCookie("msp_login", response.msp_login, 365);
            setCookie("msp_token", response.msp_token, 365);
            setCookie("msp_login_email", response.msp_login_email, 365);
            setCookie("msp_loyalty_points", response.msp_loyalty_points?response.msp_loyalty_points:0,1);
            response.msp_login_name?setCookie("msp_login_name", response.msp_login_name, 1/48):deleteCookie("msp_login_name");
            response.msp_user_image?setCookie("msp_user_image", response.msp_user_image, 1/48):deleteCookie("msp_user_image");
            update_ui();
        }
    });
}

// Location functions start here

function getUserLocation() {
    var userLocation = {},
        cookie = getCookie("offline_user_location");
    if (cookie) {
        var elements = cookie.split(",,");
        $.each(elements, function(index, element) {
            var keyValuePair = element.split("="),
                key = keyValuePair[0],
                value = keyValuePair[1];
            userLocation[key] = value;
        });
    }
    return userLocation;
}

// Location functions end here

// popup functions start here
function getPopupData(popupUrl) {
    return getAjaxDataSync(popupUrl);
}

// should be isPromoPopupSeen
function isPromoPopupShown(popupType) {

    if (typeof(disablePromoPopup) !== "undefined" && disablePromoPopup) {
        return true;
    }


    // promoB has higher priority than promoA
    if ((getCookie('promo_a_shown') && popupType === "PromoA") || (getCookie('promo_b_shown') && popupType === "PromoB")) {
        return true;
    }

    if (popupType == "PromoA") {
        setCookie('promo_a_shown', 1, 1); // For a day
    } else if (popupType == "PromoB") {
        setCookie('promo_a_shown', 1, 1); // For a day
        setCookie('promo_b_shown', 1, 1); // For a day
    }
    return false;
}

var popupCallbackQueue = [];

function popupCallback(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
}

function openPopup(popupUrl, popupType) {

    storeUrl = _gPopStoreUrl ? _gPopStoreUrl : null;
    _gPopStoreUrl = null;

    if ((popupType && (popupType === "PromoA" || popupType === "PromoB")) && isPromoPopupShown(popupType)) {
        if (storeUrl) window.open(storeUrl, "_blank");
        popupCallbackQueue = [];
        return;
    }

    if (!getCookie('test_no_popup')) {
        var popupData = getPopupData(popupUrl),
            isForRUI = popupData.indexOf("pop-up__cntnr") > 0;

        while (popupCallbackQueue.length > 0) {
            (popupCallbackQueue.shift())();
        }

        if (isForRUI) {
            $('.pop-up__ovrly, .pop-up__cntnr').remove();

            if (storeUrl) {
                $('body').append([
                    '<div class="pop-up__ovrly js-pop-up__ovrly not-opq noclose"></div>',
                    '<div class="pop-up__cntnr not-opq"></div>'
                ].join(""));
            } else {
                $('body').append([
                    '<div class="pop-up__ovrly js-pop-up__ovrly not-opq"></div>',
                    '<div class="pop-up__cntnr not-opq"></div>'
                ].join(""));
            }

            var $popup = $(popupData),
                $containers = $popup.filter(".pop-up__cntnr").add($popup.find(".pop-up__cntnr"));
            $containers.each(function() {
                $(this).addClass("not-opq");
            });
            $(".pop-up__cntnr").replaceWith($popup);

            if (storeUrl) {
                $(".pop-up__cntnr .pop-up__cls-btn").replaceWith('<div class="pop-up__cls-btn js-pop-up__cls-btn"><a href="' + storeUrl + '" target="_blank">&#10005;</a></div>');
                $(".pop-up__cntnr a.usr-inputbox__input--lnk").attr({ href: storeUrl, target: "_blank" });
            }

            setTimeout((function() {
                $(".pop-up__ovrly, .pop-up__cntnr").removeClass("not-opq");
            }), 200);
        } else {
            $(".popup-overlay, .popup-container, .popup-closebutton").remove();

            if (storeUrl) {
                $('body').append([
                    '<div class="popup-overlay not-vsbl noclose"></div>',
                    '<div class="popup-container not-vsbl">',
                    '<div class="popup-closebutton not-vsbl">',
                    '<a href="' + storeUrl + '" target="_blank">&#10005;</a>',
                    '</div>',
                    '</div>'
                ].join(""));
            } else {
                $('body').append([
                    '<div class="popup-overlay not-vsbl"></div>',
                    '<div class="popup-container not-vsbl">',
                    '<div class="popup-closebutton not-vsbl">&#10005;</div>',
                    '</div>'
                ].join(""));
            }

            setTimeout((function() {
                $(".popup-overlay, .popup-container").removeClass("not-vsbl");
            }), 300);
            setTimeout((function() {
                $('.popup-closebutton').removeClass('not-vsbl');
            }), 900);

            $('.popup-container').append(popupData).css('width', $('.popup-inner-content').outerWidth());

            if (storeUrl) {
                $(".popup-container .popup-skip a, .popup-container a.popup-submit").attr("href", storeUrl);
            }
        }
    }
}

function closePopup() {
    $('.popup-overlay').addClass('not-vsbl');
    $('.popup-container').addClass('not-vsbl');
    $('.popup-closebutton').addClass('not-vsbl');
    setTimeout(function() {
        $('.popup-overlay').remove();
        $('.popup-container').remove();
        $('.popup-closebutton').remove();
    }, 400);
    while (popupQueue.length > 0) {
        (popupQueue.shift())();
    }
}

function closePopup_RUI() {
    $('.pop-up__ovrly').addClass('not-opq');
    $('.pop-up__cntnr').addClass('not-opq');
    setTimeout(function() {
        $('.pop-up__ovrly').remove();
        $('.pop-up__cntnr').remove();
    }, 300);
    while (popupQueue.length > 0) {
        (popupQueue.shift())();
    }
}

function popupQueueFn(fn, context, params) {
    return function() {
        fn.apply(context, params);
    };
}

// OLD::autopopup functions start here
function openAutoPopup(pageLeave) {
    if (!$(".popup-overlay").length) {
        var $popupData = $("[data-autopopup]");
        if ($popupData.length) {
            var popupUrl = $popupData.data("autopopup");
            if (popupUrl) {
                if ($popupData.data("autopopup-login") && (getCookie("msp_login_email") || getCookie("msp_login")))
                    return;

                //To be moved to attribute based categorization
                openPopup(popupUrl + (pageLeave ? ((popupUrl.indexOf("?") > -1 ? "&" : "?") + "pl=1") : ""), "PromoA");
            }
        }
    }
}
// End of old autoPopup

function openAutoPopupURL(url) {
    if (getCookie('msp_login_email') || getCookie('msp_login')) return;

    //To be moved to attribute based categorization
    openPopup(url, "PromoA");
    var msp_uid = getCookie("msp_uid");
    var msp_vid = getCookie("msp_vid");
    var overall_visits = getCookie("num_pages");
    var session_visits = getCookie("visit_num_pages");
    var gts_count = getCookie("gts_count");
    var transaction_count = getCookie("transaction_count");
    var popup_id = $(".auto-popup-data").data("popup_id");
    var experiment_id = $(".auto-popup-data").data("experimentid");
    var emailValue = encodeURIComponent($(".popup-email").val());
    $.post("/users/popup_capture_user_details.php", {
        "experiment_id": experiment_id,
        "msp_uid": msp_uid,
        "msp_vid": msp_vid,
        "overall_visits": overall_visits,
        "session_visits": session_visits,
        "gts_count": gts_count,
        "transaction_count": transaction_count,
        "popup_id": popup_id,
        "emailValue": emailValue
    }, function(data, status) {});

}

function getAutopopupURL($dataElement) {

    if (getCookie("msp_login") == 1) {
        return;
    }

    if ($dataElement.length <= 0) {
        return;
    }
    $popupData = $dataElement.data("popuprule");


    if ($popupData["first-visit"] === true) {
        if (getCookie("msp_uid") == getCookie("msp_vid")) {
            $dataElement.data("popup_id", $popupData["first-visit-id"]);
            openAutoPopupURL($popupData["first-visit-url"]);
            return;
        }
    }
    if ($popupData["repeat-visit"] === true) {
        if (getCookie("msp_uid") != getCookie("msp_vid")) {
            $dataElement.data("popup_id", $popupData["repeat-visit-id"]);
            openAutoPopupURL($popupData["repeat-visit-url"]);
            return;
        }
    }
    if ($popupData["pages-visited"] === true) {
        if (getCookie("visit_num_pages") >= $popupData["pages-visited-count"]) {
            $dataElement.data("popup_id", $popupData["pages-visited-id"]);
            openAutoPopupURL($popupData["pages-visited-url"]);
            return;
        }
    }
    if ($popupData["time-spend"] === true) {
        if (parseInt(getCookie("active_time")) >= parseInt($popupData["time-spend-count"])) {
            $dataElement.data("popup_id", $popupData["time-spend-id"]);
            openAutoPopupURL($popupData["time-spend-url"]);
            return;
        }
    }
    if ($popupData["scroll"] === true) {
        if (window.location.href.indexOf("msp") !== -1 || window.location.href.indexOf("msf") !== -1) {
            $doc.on('scroll', function(e) {
                if ($doc.scrollTop() >= $win.height()) {
                    $dataElement.data("popup_id", $popupData["scroll-id"]);
                    openAutoPopupURL($popupData["scroll-url"]);
                }
            });
        }
    }
    if ($popupData["gts-made"] === true) {
        if (getCookie("gts_count") >= $popupData["gts-made-count"]) {
            $dataElement.data("popup_id", $popupData["gts-made-id"]);
            openAutoPopupURL($popupData["gts-made-url"]);
            return;
        }
    }
    if ($popupData["transaction"] === true) {
        if (getCookie("transaction_count") >= $popupData["time-spend-count"]) {
            $dataElement.data("popup_id", $popupData["transaction-id"]);
            openAutoPopupURL($popupData["transaction-url"]);
            return;
        }
    }

}

if (!getCookie("visit_num_pages")) {
    setCookie("visit_num_pages", 1);
} else {
    setCookie("visit_num_pages", (parseInt(getCookie("visit_num_pages")) + 1));
}

(function showPushNotifPopup() {
    if ("Notification" in window) {
        if (window.location.protocol === "https:") {
            if (Notification.permission !== "granted" && Notification.permission !== "denied" && !getCookie("notif-perm-seen")) {
                setTimeout(function() {
                    Notification.requestPermission().then(function(result) {
                        if (result === "granted") {
                            if (window.ga) {
                                ga('set', 'dimension9', '1');
                                ga("send", "event", "browser_notif", "permission_https", "granted", { nonInteraction: true });
                            }
                            $("<iframe>").attr("src", "https://www.mysmartprice.com/promotions/popups/push_notif_subscribe_window.php").hide().appendTo("body");
                        }
                    });
                    setCookie("notif-perm-seen", 1, 1);
                    if (window.ga) {
                        ga("send", "event", "browser_notif", "permission_https", "requested", { nonInteraction: true });
                    }
                }, 1000);
            }
        } else if (window.location.protocol === "http:") {
            if (getCookie("visit_num_pages") > 1) {
                $win.on("message", function(e) {
                    var event = e.originalEvent;
                    if (event.origin === "https://www.mysmartprice.com") {
                        $win.off(e);
                        if (event.data !== "granted" && event.data !== "denied") {
                            setTimeout(function() {
                                openPopup("https://www.mysmartprice.com/deals/popup/push_notif_popup_3.php?source=cron", "PromoB");
                            }, 5000);
                        }
                    }
                });
                // $("<iframe>").attr("src", "https://www.mysmartprice.com/promotions/popups/push_notif_iframe_3.php").hide().appendTo("body");
            }
        }
    }
}());

if (!getCookie("session-start-time")) {
    setCookie("session-start-time", new Date().getTime());
}
setCookie("active_time", ((new Date().getTime()) - getCookie("session-start-time")) / 1000);

function pageLeavePopupBind() {
    $('body').on('mouseleave', function(e) {
        if (e.pageY < 5) openAutoPopup(true);
    });
}
// autopopup functions end here
// popup functions end here

var qnaScrolled = false,
    recommScrolled = false,
    visited;


//If header is scrollable then dont hide the subheader
$win.scroll(MSP.utils.throttle(function(e) {
    var scrollTop = $win.scrollTop(),
        delta = 5,
        $subHeader = $('.sub-hdr'),
        $header = $('.hdr'),
        subHeaderHeight = $subHeader.outerHeight(),
        footerOffset = $($(".ftr")[0]).offset()?$($(".ftr")[0]).offset().top:0,
        $adSidebar = $('.ad-sdbr'),
        sidebarHeight = $adSidebar.height() + 40;

    if (footerOffset < (sidebarHeight + scrollTop) && !visited) {
        var pos = footerOffset - 620;
        $adSidebar.css("position", "absolute").css("top", pos + "px");
        visited = true;
    } else if (footerOffset > (sidebarHeight + scrollTop) && visited) {
        $adSidebar.css("position", "fixed").css("top", "20px");
        visited = false;
    } else if (footerOffset > (sidebarHeight + scrollTop)) {
        if ($header.height() > scrollTop) {
            $adSidebar.css("position", "absolute").css("top", "120px");
        } else {
            $adSidebar.css("position", "fixed").css("top", "20px");
        }
    }

    // QnA Scrolling Event
    if ($('.qna').length > 0) {
        if (scrollTop >= $('.qna').position().top && !qnaScrolled) {
            ga('send', 'event', 'QNA', 'qna-scroll', "", {
                nonInteraction: true
            });
            qnaScrolled = true;
        }
    }

    // Recommendations Scrolling Event
    if ($('#recomm').length > 0) {
        if (scrollTop >= $('#recomm').position().top && !recommScrolled) {
            ga('send', 'event', 'recommendations', 'scrollTo', "", {
                nonInteraction: true
            });
            recommScrolled = true;
        }
    }

    // Hide Menu on Scroll
    if ($('.drpdwn-menu-ovrly--show').length) {
        $('.js-ctgry-btn').click(); //if browse menu is displayed close it
    }
    if (!$header.hasClass("hdr--scrl")) {

        if (scrollTop <= 0) {
            $subHeader.removeClass('not-vsbl');
            if ($(".lead-hdr-wrpr").length && !getCookie("msp_lead_hdr_hide")) {
                $(".lead-hdr-wrpr").slideDown();
            }
            return;
        }
        if (Math.abs(lastScrollTop - scrollTop) <= delta) return;

        if (scrollTop > lastScrollTop && scrollTop > subHeaderHeight) {
            // Scroll Down
            $header.addClass('hdr--sld');
            $subHeader.addClass('not-vsbl');
            if ($(".lead-hdr-wrpr").length && !getCookie("msp_lead_hdr_hide")) {
                $(".lead-hdr-wrpr").slideUp();
            }
            $(".ad-sdbr").addClass("ad-sdbr--top");
        } else {
            // Scroll Up
            if (scrollTop + $win.height() < $doc.height()) {
                $subHeader.removeClass('not-vsbl');
                $header.removeClass('hdr--sld');
                $(".ad-sdbr").removeClass("ad-sdbr--top");
                if ($(".lead-hdr-wrpr").length && !getCookie("msp_lead_hdr_hide")) {
                    $(".lead-hdr-wrpr").slideDown();
                }
            }
        }

        lastScrollTop = scrollTop;
    }

    //Run tasks assigned to Lazy Load which run when scroll position hits the corresponding nodes.
    MSP.utils.lazyLoad.run();
}, 100));
/* RUI:: reveal new subheader when user scrolls - end */

// browse popup functions start here
function getBrowsePopupData() {
    return getAjaxDataSync("/browse-menu.htm");
}
// browse popup functions end here

// OLD:: AUTOCOMPLETE FUNCTON commented out
// function bindAutoComplete() {
//     if ($("#header-search")
//         .length !== 0) {

//         $("#header-search")
//             .autocomplete({
//                 minLength: 1,
//                 delay: 110,
//                 autoFocus: false,
//                 max: 10,
//                 position: {
//                     at: 'left-1 bottom+1',
//                     my: 'left top',
//                     of: '#header-search'
//                 },
//                 source: function(request, response) {
//                     var term = $.trim(request.term.toLowerCase()),
//                         element = this.element,
//                         //element is search bar
//                         autocompleteCache = this.element.data('autocompleteCache') || {},
//                         //initializing autocompleteCache
//                         foundInAutocompleteCache = false; //flag will be set to true if term found in autocompleteCache
//                     if (term in autocompleteCache && autocompleteCache[term].length !== 0) {
//                         response(autocompleteCache[term]);
//                         foundInAutocompleteCache = true;
//                     }

//                     if (foundInAutocompleteCache) return;

//                     request.term = term;
//                     $.ajax({
//                         url: 'http://www.mysmartprice.com/msp/search/auto_suggest_search.php',
//                         dataType: "json",
//                         data: request,
//                         success: function(data) {
//                             data = $.map(data, function(n, i) {
//                                 n['index'] = i;
//                                 return n;
//                             });
//                             autocompleteCache[term] = data;
//                             element.data('autocompleteCache', autocompleteCache);
//                             response(data);
//                         }
//                     });
//                 },
//                 select: function(event, ui) {
//                     var $form = $(this)
//                         .closest('form');
//                     $form.find('#header-search')
//                         .val(ui.item.value);
//                     $form.find('#header-search-subcat')
//                         .val(ui.item.subcategory_code);
//                     $form.find('.search-submit')
//                         .click();
//                 }
//             })
//             .data('uiAutocomplete')
//             ._renderItem = function(ul, item) {
//                 var term = this.term.split(' ')
//                     .join('|'),
//                     re = new RegExp("\\b(" + term + ")", "gi"),
//                     tempval = item.value.replace(re, "<b>$1</b>");
//                 if (item.subcategory !== "") tempval += " in <span style='color:#c00;font-weight:bold;'>" + item.subcategory + "</span>";
//                 return $("<li></li>")
//                     .data("item.autocomplete", item)
//                     .append("<a>" + tempval + "</a>")
//                     .appendTo(ul);
//             };
//     }
// }
// OLD:: autocomplete functions end here

/* RUI:: autocomplete functions - start */
function bindAutoComplete() {
    var $searchBox = $(".srch-wdgt"),
        $searchField = $searchBox.find(".js-atcmplt");
    if ($searchField.length) {
        var autocompleteObj = $searchField.autocomplete({
            minLength: 0,
            delay: 110,
            autoFocus: false,
            max: 10,
            open: function(event, ui) {
                $(".ui-menu").css({
                    "width": $searchBox.width(),
                    "left": "-1px",
                    "top": "1px",
                    "clear": "both"
                });
                $searchBox.addClass("srch-wdgt--show-rslt");
            },
            close: function(event, ui) {
                $searchBox.removeClass("srch-wdgt--show-rslt");
            },
            source: function(request, response) {
                request.term = $.trim(request.term).toLowerCase();
                if (request.term.length < 3)
                    request.term = "_top_";
                var _cache = bindAutoComplete._cache_ = bindAutoComplete._cache_ || { "keys": [], "values": [] },
                    keyIndex = _cache.keys.indexOf(request.term);
                if (keyIndex > -1) {
                    response(_cache.values[keyIndex]);
                    return;
                }
                $.ajax({
                    "url": "/msp/search/auto_suggest_search.php",
                    "dataType": "json",
                    "data": request
                }).done(function(json) {
                    if (!json) {
                        response([]);
                        return;
                    }
                    var results = [];
                    if (json.subcategories && json.subcategories.length)
                        $.merge(results, json.subcategories);
                    if (json.terms && json.terms.length)
                        $.merge(results, json.terms);
                    if (json.products && json.products.length)
                        $.merge(results, json.products);
                    if (!results.length) {
                        response([]);
                        return;
                    }
                    _cache.keys.push(request.term);
                    _cache.values.push(results);
                    if (_cache.keys.length > 25) {
                        _cache.keys.shift();
                        _cache.values.shift();
                    }
                    response(results);
                }).fail(function() {
                    response([]);
                });
            },
            select: function(event, ui) {
                if (ui.item.url) {
                    var pageUrl = window.location.href.split("#"),
                        searchUrl = ui.item.url.split("#");
                    if (pageUrl[0] === searchUrl[0]) {
                        if (pageUrl[1] !== searchUrl[1]) {
                            // Same path, different hashes; update URL and force-refresh
                            window.location.href = ui.item.url;
                            window.location.reload();
                        } else
                            window.location.reload(); // Identical URLs, just reload
                    } else
                        window.location.href = ui.item.url; // Different paths, just update URL
                } else {
                    $(this).parent().find('.search_type').val('auto');
                    var typed_term = $(this).val();
                    $(this).parent().find('.typed_term').val(typed_term);
                    $(this).val(ui.item.value).closest("form").submit();
                }
            }
        }).data("ui-autocomplete");

        autocompleteObj._renderItem = function(ul, item) {
            var term = this.term.split(" ").join("|"),
                regEx = new RegExp("\\b(" + term + ")", "gi"),
                innerHtml = item.value.replace(regEx, "<strong>$1</strong>"),
                $listItem = $("<li>").data("item.autocomplete", item);
            if (item.subcategory) {
                innerHtml += " in <span style='font-weight: bold; color: #c00;'>" + item.subcategory + "</span>";
                $listItem.addClass("subcategory-item");
            } else if (item.image) {
                innerHtml = "<span class='image'><img src='" + item.image + "' alt='" + item.value + "'/></span>" + innerHtml;
                $listItem.addClass("product-item");
            } else
                $listItem.addClass("string-item");
            innerHtml = "<a>" + innerHtml + "</a>";
            return $listItem.append(innerHtml).appendTo(ul);
        };

        autocompleteObj._renderMenu = function(ul, items) {
            var that = this;
            $.each(items, function(index, item) {
                that._renderItemData(ul, item);
            });

            var $ul = $(ul);
            $ul.find(".string-item").first().not(":first-child").before("<li class='separator-item'><span>Popular terms</span></li>");
            $ul.find(".product-item").first().before("<li class='separator-item'><span>Popular products</span></li>");
        };
    }
}
/* RUI:: autocomplete functions - end */

/* RUI:: scroll to top button functionality - start */
function initScrollToTop() {
    var $body = $('body'),
        toTopHtml = [
            "<div class='to-top'>",
            "<div class='to-top__btn js-lazy-bg'></div>",
            "<div class='to-top__lbl'>Back to top</div>",
            "</div>"
        ].join(""),
        $toTop = $(toTopHtml),
        showScrollToTopDisplay = 'hidden';

    $body.append($toTop);

    $toTop.on("click", function() {
        $body.add("html").animate({
            'scrollTop': '0'
        }, 'slow', function() {
            showScrollToTopDisplay = 'hidden';
        });
        $toTop.stop(true, true).fadeOut();
    });

    $win.on("scroll", function() {
        if ($(this).scrollTop() > 100) {
            if (showScrollToTopDisplay == 'hidden') {
                showScrollToTopDisplay = 'display';
                $toTop.stop(true, true).fadeIn();
            }
        } else {
            if (showScrollToTopDisplay == 'display') {
                showScrollToTopDisplay = 'hidden';
                $toTop.stop(true, true).fadeOut();
            }
        }
    });
}
/* RUI:: scroll to top button functionality - end */

/* Decide whether to show or hide sidebar ads */
;
(function sidebarAdsHandler() {
    var sidebarAds = function(gptId) {
            return [
                /* '<div class="ad-sdbr__cls">&times;</div>', */
                '<div id="' + gptId + '" style="height:600px; width:120px;">',
                '<script> googletag.cmd.push(function() { googletag.display("' + gptId + '"); }); </script>',
                '</div>'
            ].join('');
        },
        sideFreeSpace = window.innerWidth - 1000,
        adWidth = 120,
        adMarginFromCenter = 500 + Math.max(10, Math.min(40, (sideFreeSpace / 2 - adWidth) / 2));

    if (!getCookie('hideSidebarAds')) {
        var $leftAd = $('.ad-sdbr--left'),
            $rightAd = $('.ad-sdbr--rght');
        $leftAd.append(sidebarAds($leftAd.data('id')));
        $rightAd.append(sidebarAds($rightAd.data('id')));
        $leftAd.css('margin-right', adMarginFromCenter + 'px');
        $rightAd.css('margin-left', adMarginFromCenter + 'px');
        $('.ad-sdbr__cls').on('click', function() {
            setCookie('hideSidebarAds', 1, 1);
            $('.ad-sdbr').remove();
        });
    }
})();

// Check again when single goes live
$doc.ready(function() {

    $(".sdbr-login").length && sdbrWlcmPage.init();
    $(".demo-login").length && extnsnWlcmPage.init();

});

/*
 * Bottom Banner functions - not being called/used. commented out.
 *
// Show the slide-up banner
function showSlideup() {
    $(".ftr").last().addClass("ftr--prmtn");
    $(".bottom-slideup.hidden").removeClass("hidden");
}

// Hide the slide-up banner and set a cookie to not show it for a day
function hideSlideup(cookieName, cookieTimeMins) {
    $(".ftr").removeClass("ftr--prmtn");
    $(".bottom-slideup").addClass("hidden");
    addCookieMins(cookieName, "true", cookieTimeMins);
}
// Slide-up banner functions end here
*/


$.expr[':'].icontains = function(a, b, c, d) {
    var e = ($.trim(jQuery(a).text()) || '').toLowerCase(),
        f = e.indexOf(c[3].toLowerCase());
    if (f > 0) return true;
    else return false;
};

/* Jquery MSP UI components */


/*
 * FUTURE:: need to be update classes for search page in new RUI
 * used in search page left sidebar widgets collpasing
 * starts here
 */
;
(function($, window, document, undefined) {
    "use strict";

    function sidebarList(element, options) {
        this.element = element;
        this.defaults = {
            "listLength": $(this.element).data("default")
        };
        this.options = $.extend({}, this.defaults, options);
        this.init(true);
    }

    sidebarList.prototype = {
        "init": function() {
            var $elem = $(this.element),
                $default_no = this.options.listLength,
                $catname = $.trim($elem.find(".listhead").text()),
                $expand = $elem.find(".sublist.expand");
            $elem.each(function() {
                $elem.attr("data-cat", $catname);
                $elem.find('.sublist').not(".expand").slice($default_no).hide();
            });
            var $this = this;
            if ($default_no == 0) { $expand.css("border-top", "none"); }
            $expand.on('click', function() {
                var $action = $(this).find("a:visible").hasClass("show-all") ? 1 : 0,
                    $border = ["none", "1px dotted #ccc"];
                $this.expand($catname, $action);
                if ($default_no == 0) {
                    $(this).css("border-top", $border[$action]);
                }
                return false;
            });
        },
        "expand": function($catname, $action) {
            var $elem = $(this.element),
                $widget = $elem.filter('[data-cat="' + $catname + '"]'),
                $expand = $elem.filter('[data-cat="' + $catname + '"]').find('.expand'),
                $default_no = this.options.listLength;
            $widget.find('.sublist').not(".expand").slice($default_no).toggle();
            $expand.find(".show-all").toggle();
            $expand.find(".show-default").toggle();
        }
    };

    $.fn.sidebarList = function(options) {
        return this.each(function() {
            $.data(this, "sidebarList", new sidebarList(this, options));
            if (!$.data(this, "sidebarList")) {
                // preventing against multiple instantiations
                $.data(this, "sidebarList", new sidebarList(this, options));
            } else {
                var sidebarListObj = $.data(this, "sidebarList");
                // checking if option is a valid function name
                if (typeof options === "string" && sidebarListObj[options]) {
                    sidebarListObj[options].call(sidebarListObj);
                } else if (typeof options === "object") {
                    // if the option is object extending it with initalized object
                    sidebarListObj.options = $.extend({}, sidebarListObj.options, options);
                }
            }
        });
    };
})(jQuery, window, document);

$doc.ready(function() {
    $(".sidebardiv_collapsable").sidebarList();
});


/* init onload (no need of doc.ready) - start */

/** RUI::
 * - scroll to top on any page.
 * - scroll to element based on data-id.
 * starts here
 */
initScrollToTop();
/* ends here */

/* init onload (no need of doc.ready) - start */

$doc.ready(function() {
    // Only email capture popup on GTS:
    $(document).on('click', '.js-gts-only-email-popup', function(e) {
        e.preventDefault();
        e.stopImmediatePropagation();

        var $this = $(this),
            gtsURL = $this.data('url');
        gtsURL ? _gPopStoreUrl = gtsURL : _gPopStoreUrl = null; // set the store url (used by openPopup())

        $this.removeClass('js-instatab-popup js-prc-tbl__gts-btn');
        openPopup('/loyalty/popup/gts-only-email.php?gtsURL=' + encodeURIComponent(gtsURL));

        return false;
    });

    // Instatab Extension installer: GTS
    $(document).on('click', '.js-instatab-popup', function(e) {
        e.preventDefault();
        var $this = $(this),
            gtsURL = $this.data('url'),
            isEmailSet = getCookie('msp_login_email'),
            isInstatabInstalled = getCookie('instatab');

        var popupCookieVal = getCookie('gtspopup') ? getCookie('gtspopup').split(';') : undefined,
            cookieNumTimes = popupCookieVal ? popupCookieVal[0] : undefined,
            cookieCurMessage = popupCookieVal ? popupCookieVal[1] : undefined,
            isEmailCaptured = popupCookieVal ? popupCookieVal[2] : undefined;

        if (popupCookieVal) {
            if (cookieNumTimes < 4) {
                if (cookieCurMessage === 'instatab') {
                    if (isInstatabInstalled) {
                        if (!isEmailSet && !isEmailCaptured) {
                            setCookie('gtspopup', (Number(cookieNumTimes) + 1) + ';email;', 30);
                            openGTSPopup();
                        } else {
                            doGTS();
                        }
                    } else {
                        openGTSPopup();
                    }
                } else {
                    if (isEmailSet || isEmailCaptured === 'email_done') {
                        if (!isInstatabInstalled) {
                            setCookie('gtspopup', '4;instatab;' + (isEmailCaptured || ''), 30);
                            openGTSPopup();
                        } else {
                            doGTS();
                        }
                    } else {
                        openGTSPopup();
                    }
                }
            } else {
                doGTS();
            }
        } else {
            if (isInstatabInstalled) {
                if (!isEmailSet) {
                    setCookie('gtspopup', '1;email;', 30);
                    openGTSPopup();
                } else {
                    doGTS();
                }
            } else {
                openGTSPopup();
            }
        }

        return false;
        /* *************** */
        function openGTSPopup() {
            gtsURL ? _gPopStoreUrl = gtsURL : _gPopStoreUrl = null; // set the store url (used by openPopup())
            openPopup('/loyalty/popup/gts.php?gtsURL=' + encodeURIComponent(gtsURL), 'PromoB');
        }

        function doGTS() {
            window.open(gtsURL, '_blank');
        }
    });

    // Mobile number capture popup for users who land on single page
    // from price alert emailer and missed the drop in price
    if (qS && qS.utm_campaign === "PriceAlert") {
        var _hash = queryString(window.location.hash);
        if (_hash.price) {
            var $mspSingleTitle = $("#mspSingleTitle");
            if ($mspSingleTitle.length) {
                var emailPrice = parseInt(_hash.price, 10),
                    bestPrice = parseInt($mspSingleTitle.data("bestprice"), 10);
                if (bestPrice > emailPrice) {
                    openPopup("/price_alert/paepopup.php?mspid=" + $mspSingleTitle.data("mspid"));
                }
            }
        }
    }
});

$(document).on("click", ".chrome_install_offer", function() {
    var $this = $(this);

    tryInstallChrome($this.data("label"), function() {
        openPopup("/promotions/plugin/email_popup_noreward.php");
    }, function() {
        if ($this.data("showoffer") === true && isChrome()) {
            openPopup("/promotions/plugin/offer_popup.php?label=Home+Page+Banner+Offer+Popup");
        } else {
            window.open(CHROME_EXT_WEB_URL, "_blank");
        }
    });

    return false;
});

function tryInstallChrome(gaLabel, successCallback, failCallback, altExtension) {
    function installSuccess(gaLabel, callback) {
        if (typeof callback === "function")
            callback();
    }

    function installFail(callback) {
        if (typeof callback === "function")
            callback();
    }

    var installURL = CHROME_EXT_INSTALL_URL;
    if (altExtension === 'instatab') installURL = CHROME_INSTATAB_INSTALL_URL;

    if (window.chrome && chrome.webstore) {
        // Append <link> tag only when chrome_ext_install_url tag is not available.
        if (!$("link[rel='chrome-webstore-item'][href='" + installURL + "']").length) {
            $("head").append("<link rel='chrome-webstore-item' href='" + installURL + "'/>");
        }

        // Create a session cookie with the current url.Used for tracking capture_url in welcome page.
        setCookie("pluginInstallOrigin", window.location.href);

        chrome.webstore.install(installURL, function() {
            installSuccess(gaLabel, successCallback);
        }, function() {
            installFail(failCallback);
        });
    } else {
        installFail(failCallback);
    }
}

function tryInstallFirefox() {
    var params = {
        "MySmartPrice": {
            URL: "https://s3-ap-southeast-1.amazonaws.com/firefox-addon/mysmartprice-latest-fx.xpi",
            IconURL: "https://s3-ap-southeast-1.amazonaws.com/firefox-addon/logo-icon.png",
            toString: function() {
                return this.URL;
            }
        }
    };
    InstallTrigger.install(params);
    setCookie("pluginInstallOrigin", window.location.href);
}

function isPluginInstalled() {
    var dfd = $.Deferred();
    !!getCookie("plugin_id") ? dfd.resolve() : dfd.reject();
    return dfd.promise();
}

/*
(function() {
    setTimeout(function () {
        if (!$(".plugin_id").length){
            removeCookie('plugin_id');
        }
    }, 3000);
}());
*/
/* Discontinued this way of tracking install.Now being done through pluginCashback sessCookie and welcome page.
// Complete pending ajax when FF addon is successfully installed.
if(localStorage.getItem("FFInstallPendAjax")){
    if(isFirefox()){
        $.when(isPluginInstalled()).then(function(){
            // Addon is installed
            try{
                var pendingAjax = JSON.parse(localStorage.getItem("FFInstallPendAjax"));
            }
            catch(e){}
            $.ajax( pendingAjax ).done(function(){
                localStorage.removeItem("FFInstallPendAjax");
            });
        },function(){
            // Addon is not installed
        });
    }
}
*/
/* Search Function/Feature */
$doc.on("submit", ".js-srch-wdgt__frm", function() {
    var srch_inpt = $(".js-hdr-srch").val();
    var search_type = '';
    if ($('.js-srch-wdgt__frm .search_type').val()) {
        search_type = $('.js-srch-wdgt__frm .search_type').val();
    }
    var typed_term = '';
    if ($('.js-srch-wdgt__frm .typed_term').val()) {
        typed_term = $('.js-srch-wdgt__frm .typed_term').val();
    }
    var srch_url = '/msp/search/search.php?search_type=' + search_type + '&typed_term=' + typed_term +
        '&s=' + srch_inpt + '#s=' + srch_inpt;
    $('.js-srch-wdgt__frm').attr('action', srch_url);
});

// **START**
// OLD MSP.JS CODE --> Category dropdown: browse menu --> for old headers on non-comparables pages
// KEPT FOR COMPATIBILITY.
// browse menu processing start here
$doc.ready(function() {
    $doc.on('click', '.browse-menu-btn, .browse-popup-cont', function(e) {
        var left = $('.browse-menu-btn')
            .offset()
            .left;
        $('.browse-popup')
            .css('left', left)
            .toggleClass('show');
        $('.browse-popup-cont')
            .toggleClass('show');
        if ($('.browse-popup.show')
            .length !== 0) {

            if ($('.browse-popup-data')
                .data('processed') == 'done' && location.hash !== '#forcepopup') {
                setTimeout((function() {
                    $('.browse-popup')
                        .find('.loading-circle')
                        .hide();
                    $('.browse-popup-data')
                        .addClass('show');
                }), 340);
                return; //if already procesed
            }

            var data;

            if (localStorage && location.hash !== '#forcepopup') {

                //check if data is not one week old
                var time = parseInt(localStorage.browsePopupDataTime, 10),
                    now = new Date()
                    .getTime(),
                    diffTime = (now - time) / (1000 * 60 * 60 * 24);

                if (diffTime < 30 && localStorage.browsePopupDataVer == $('.browse-popup-data')
                    .data('ver')) {
                    //getting data from localStorage
                    data = localStorage.browsePopupData;
                }

            }

            if (!data || data == 'undefined' || data === undefined) {
                $('.browse-popup')
                    .find('.loading-circle')
                    .show();
                data = getBrowsePopupData();
                localStorage.browsePopupData = data;
                localStorage.browsePopupDataTime = new Date()
                    .getTime();
                localStorage.browsePopupDataVer = $('.browse-popup-data')
                    .data('ver');
                // if data is not avaialble in localStorage do ajax and save in localStorage for later use
            }
            if (data && data != 'undefined' && data !== undefined) {
                $('.browse-popup-data')
                    .html(data)
                    .data('processed', 'done');
                setTimeout((function() {
                    $('.browse-popup')
                        .find('.loading-circle')
                        .hide();
                    $('.browse-popup-data')
                        .addClass('show');
                }), 340);
                // on data available hide loading and show data
            }

        } else {
            $('.browse-popup-data')
                .removeClass('show');
        }
    });

    $doc.on('click', '.browse-popup', function(e) {
        e.stopPropagation();
    });
    // browse menu processing end here

    // // browse popup functions start here
    function getBrowsePopupData() {
        return getAjaxDataSync("/old_browse-menu.htm");
    }
    // browse popup functions end here

    // ajax functions start here
    function getAjaxDataSync(ajaxURL) {
        var ajaxData;
        $.ajax({
            url: ajaxURL,
            async: false
        }).done(function(data) {
            ajaxData = data;
        });
        return ajaxData;
    }
    // ajax functions end here
});


/** [START] Price table  openPopup_rd (price breakup popup and other instruction popup) **/


$("body").on("click", ".openPopup_rd", function handler(e) {
    var $popupCont = $(this),
        $popup, mspid, currentColour, storename, popupDetails;
    handler.popupData = handler.popupData || {};
    if ($(e.target).is($(".openPopup_rd, .openPopup_rd *").not(".popup_rd, .popup_rd *"))) {
        $(".popup_rd").slideUp("fast", function() {
            if ($(this).closest(".openPopup_rd").is(".offers:not(.cashback)"))
                $(this).remove();
        });
    }

    if ($popupCont.data("popup-type") === "common") {
        $popup = $popupCont.siblings(".popup_rd");
        if (!$popup.is(":visible")) {
            if ($popup.length)
                $popup.slideDown("fast");
            else {
                $popupCont.after([
                    '<div class="loyalty_expand popup_rd common">',
                    $("#common_popup_rd").html(),
                    '</div>'
                ].join("")).siblings(".popup_rd").slideDown("fast");
            }
        }
    } else if (!$popupCont.find(".popup_rd").is(":visible")) {
        if ($popupCont.is(".offers:not(.cashback)")) {
            mspid = $("#mspSingleTitle").data("mspid");
            storename = $(this).closest(".store_pricetable").data("storename");
            currentColour = $(".filter_colour").length ? ($(".filter_colour").find(".selected").data("callout") || "default") : "default";

            if (handler.popupData.colour !== currentColour) {
                $.ajax({
                    "url": "/msp/offertext_ajax.php",
                    "dataType": "json",
                    "data": {
                        "mspid": mspid,
                        "color": (currentColour !== "default") ? currentColour : undefined
                    }
                }).done(function(response) {
                    handler.popupData.content = response;
                    popupDetails = response[storename];
                    $popupCont.append(getPopupHtml(popupDetails));
                    $popupCont.find(".popup_rd").slideDown("fast");
                });
            } else {
                popupDetails = handler.popupData.content[storename];
                $popupCont.append(getPopupHtml(popupDetails));
                $popupCont.find(".popup_rd").slideDown("fast");
            }
        } else {
            $popup = $popupCont.find(".popup_rd");
            if ($popup.hasClass("coupon_expand")) {
                if (getCookie("msp_login") == "1" && getCookie("msp_login_email") && !$.trim($popup.find(".coupon_value").text())) {
                    $popup.find(".coupon_email").val(getCookie("msp_login_email"));
                    $popup.find(".coupon_form").submit();
                }
            }
            $popup.slideDown("fast");
        }
    }

    function getPopupHtml(popupDetails) {
        return [
            '<div class="offers_expand popup_rd">',
            '<div class="head">',
            '<div class="title">Offer Details</div>',
            '<div class="closebutton">&times;</div>',
            '<br clear="all">',
            '</div>',
            '<div class="text">',
            popupDetails,
            '</div>',
            '</div>'
        ].join("");
    }
});


$('body').on('click', '.closebutton', function(event) {
    $(this).parents('.popup_rd').slideUp("fast");
    event.stopPropagation();
});

/** [END] Price table  openPopup_rd (price breakup popup and other instruction popup) **/


// **END** (OLD MSP.JS FEATURES for old headers on non-comparables' pages)



/**
 * Initiating the script here when the dom is ready
 */
$doc.ready(function() {
    "use strict";

    $doc.on("click", ".usr_location__wrpr", function() {
        if (!$(".usr-location__overlay").length) {
            $(".usr_location__dd").stop(true, true).slideDown();
            $(this).addClass("usr_location--show");
            $(".hdr").addClass("hdr--sld");
            $(".sub-hdr").addClass('not-vsbl');
            $("<div class='popup-overlay usr-location__overlay' style='z-index:200;top:60px;'></div>").appendTo("body");
            $("body").css("overflow", "hidden");
            $("#usr_search_locat").focus();
        }
    });

    $doc.on("click", ".usr-location__overlay", function() {
        $(".usr_location__dd").stop(true, true).slideUp();
        $(".usr_location__wrpr").removeClass("usr_location--show");
        var scrollTop = $(window).scrollTop();
        if (scrollTop <= 56) {
            $(".sub-hdr").removeClass('not-vsbl');
        }
        $("body").css("overflow", "visible");
        $(this).remove();
    });
});


var sdbrWlcmPage = {};
if ($(".sdbr-login").length) {

    sdbrWlcmPage = {
        cnfrmtnMsg: "<div class='sdbr-login__icon'></div><p>You are part of our Cashback Program</p>",
        showCnfrmtn: function() {
            $(".sdbr-login__dtls,.js-pwd-tgglbtn").hide();
            $(".sdbr-login__cnfrmtn").show();
            $(".sdbr-login__msg").html(this.cnfrmtnMsg);
            $("#lylty-signup__email,#sdbr-signup__password").val("");
            $(".sdbr-login div.error").hide().html("");
        },

        hideCnfrmtn: function() {
            if ($(".sdbr-login").length) {
                $(".sdbr-login__dtls").show();
                $(".sdbr-login__cnfrmtn").hide();
            }
        },
        signupLoyaltyformValidator: function() {
            var $email = $('#sdbr-signup__email'),
                $password = $('#sdbr-signup__password'),
                $errorNode = $(".sdbr-login div.error");
            MSP.utils.validate.form([{
                "type": "email",
                "inputField": $email,
                "errorNode": $errorNode,
                "errorMsg": "Please enter a valid email"
            }, {
                "type": "required",
                "inputField": $password,
                "errorNode": $errorNode,
                "options": { "min": 6 },
                "errorMsg": "Please enter a valid password"
            }]).done(function() {
                var loylaty_utm_source = qS.utm_source ? qS.utm_source : utmsource;
                if ($(".js-chrm-wlcm").length || $(".wlcm-hdr").length) {
                    loylaty_utm_source = "chrome welcome";
                }

                $.ajax({
                    type: "POST",
                    url: "https://www.mysmartprice.com/users/login_common.php", //"/users/usermanage.php"
                    dataType: "JSON",
                    async: false,
                    data: {
                        process: 'signup',
                        email: encodeURIComponent($email.val()),
                        password: $password.val(),
                        subscribed_status: 'subscribed',
                        source: 'desktop',
                        login_type: 'signup_loyalty',
                        number: "",
                        utm_source: loylaty_utm_source
                    }
                }).done(function(msg) {
                    if (msg == "error" || msg.auth.result.msg == 'error') {
                        $errorNode.html("There is some error in signup. Please try after sometime");
                        if (getCookie('u99rs1deal')) {
                            alert('Unable to login. Please check credentials'); // Alert to bring back focus to current tab (Not GTS tab)
                        }
                    } else {
                        if (msg.auth.result.msg == 'true') {
                            loginme(msg);
                            closePopup();
                        } else {
                            $errorNode.html(msg.auth.result.msg + ". <a class='js-popup-trgt sdbr-login__link' data-href='/users/login.html'>Click here to login</a>");
                            $errorNode.show();
                        }
                    }
                    return false;
                });
            });
            return false;
        },
        eventHandlers: function() {
            $(".sdbr-signup__email").change(function() {
                $(".sdbr-signup__email").blur(function() {
                    $this = $(this);
                    if (MSP.utils.validate.email($this.val())) {
                        $this.removeClass("hghlght-err-fld");
                        !$(".sdbr-signup__form .hghlght-err-fld").length && $(".sdbr-signup__form div.error").text("");
                    } else {
                        $this.addClass("hghlght-err-fld");
                        $(".sdbr-signup__form div.error").text("Please enter a valid email");
                    }
                });
            });
            $('.sdbr-signup__password').on('change', function() {
                $('.sdbr-signup__password').on('blur', function() {
                    $this = $(this);
                    if (MSP.utils.validate.required($this.val())) {
                        $this.removeClass("hghlght-err-fld");
                        !$(".sdbr-signup__form .hghlght-err-fld").length && $(".sdbr-signup__form div.error").text("");
                    } else {
                        $this.addClass("hghlght-err-fld");
                        $(".sdbr-signup__form div.error").text("Please enter a password");
                    }
                });
            });
            $('.sdbr-signup__submit').click(function(e) {
                e.preventDefault();
                sdbrWlcmPage.signupLoyaltyformValidator();
            });
            $(".sdbr-signup__password").on("keydown", function() {
                if ($(this).val().length > 1)
                    $(".js-pwd-tgglbtn").show()
                else
                    $(".js-pwd-tgglbtn").hide()
            });
            $(".js-pwd-tgglbtn").on("click", function() {
                var $pwdField = $(".sdbr-signup__password"),
                    pwdField = $pwdField[0];
                if (pwdField.type === "password") {
                    pwdField.type = "text";
                    $(this).text("Hide").attr("title", "Hide Password");
                } else {
                    pwdField.type = "password";
                    $(this).text("Show").attr("title", "Show Password");
                }
            });
        },
        stickLogin: function() {
            var sdbrSignupTop = $(".js-sdbr-login-wrpr"),
                sdbrSignup = $(".js-sdbr-login"),
                sdbrSignupScrollPoint = sdbrSignupTop.offset().top + 5,
                $mainheaderHt = $('.main-hdr-wrpr').outerHeight(),
                $subheader = $('.sub-hdr'),

                scrlAmnt = $win.scrollTop() + $mainheaderHt;




            if (scrlAmnt >= sdbrSignupScrollPoint) {
                !sdbrSignup.hasClass("sticky") && sdbrSignup.addClass("sticky");
                $subheader.hide();
                // debugger;
                if (scrlAmnt + sdbrSignup.outerHeight() > $(".ftr").offset().top - 20) {
                    sdbrSignup.addClass("scroll");
                    // $(".sticky").removeProp("position").css("bottom", $(".ftr").offset().top - 20);
                } else if (scrlAmnt + sdbrSignup.outerHeight() > $(".ftr").offset().top - 150) {
                    // $(".sticky").removeProp("position").css("bottom", $(".ftr").offset().top - 20);
                    sdbrSignup.removeClass("scroll");
                }
            } else {
                sdbrSignup.removeClass("sticky");
                if (scrlAmnt < sdbrSignupScrollPoint - 40)
                    $subheader.show();
            }


        },

        init: function() {
            this.eventHandlers();
            $win.scroll(function() {
                sdbrWlcmPage.stickLogin();
            });
        }
    }
}

if (!window.userFormValidations) {
    var userFormValidations = {};
}

userFormValidations = (function() {
    var private = {
        shakeBtn: function(btn) {
            //defaults
            var settings = {
                'shakes': 2,
                'distance': 5,
                'duration': 200
            };
            $this = btn;
            // shake it
            for (var x = 1; x <= settings.shakes; x++) {
                $this.animate({ left: settings.distance * -1 }, (settings.duration / settings.shakes) / 4)
                    .animate({ left: settings.distance }, (settings.duration / settings.shakes) / 2)
                    .animate({ left: 0 }, (settings.duration / settings.shakes) / 4);
            }
        },
        showFieldValidation: function(inputField, isValid, errMsg) {
            if (!isValid) {
                if (!inputField.hasClass("hghlght-err-fld")) {
                    inputField.addClass("hghlght-err-fld").siblings(".js-vldtn-err").add(".lgn__err").slideDown();
                }
                // Signup/login PAGE (not popup): Fetch error div
                if ($('.lgn__err').length) {
                    $('.lgn__err').html(errMsg).slideDown();
                }
                typeof errMsg !== "undefined" && inputField.siblings(".usr-inputbox__error").text(errMsg);
            } else {
                if (inputField.hasClass("hghlght-err-fld")) {
                    inputField.removeClass("hghlght-err-fld").siblings(".usr-inputbox__error").add(".lgn__err").slideUp();
                }
            }
        },
        hasErrFields: function(form) {
            var errFields = form.find(".hghlght-err-fld");
            if (errFields.length) {
                private.shakeBtn(form.find("input[type='submit']"));
                errFields[0].focus();
                return true;
            } else
                return false;
        },
        redirectLoggedUser: function() {
            var cookieUrl = getCookie("previousUrl");
            deleteCookie("previousUrl");
            if (qS.close == "1" && window.opener) {
                    window.opener.postMessage("update_ui","*");
            }
            window.location = qS.destUrl || cookieUrl || "/";
        }
    };
    var public = {
        loginformValidator: function(e) {
            var $thisForm = $("#inputbox__login-form");

            function checkValidations() {
                var emailField = $('#login-form__email'),
                    pwdField = $('#login-form__pwd');

                // Form validation
                var formData = [{
                        "type": "email",
                        "inputField": emailField,
                        "errorNode": emailField.siblings(".js-vldtn-err").add(".lgn__err"),
                        "errorMsg": "Please enter a valid email address"
                    },
                    {
                        "type": "required",
                        "inputField": pwdField,
                        "errorNode": pwdField.siblings(".js-vldtn-err").add(".lgn__err"),
                        "errorMsg": "Please enter a valid password"
                    }
                ];

                MSP.utils.validate.form(formData).done(function() {
                    var loginemail_value = emailField.val(),
                        loginpassword_value = pwdField.val();

                    $('.pop-up__cntnr .ldr__ovrly').show();

                    $.ajax({
                        type: "POST",
                        url: "https://www.mysmartprice.com/users/login_common.php", // "/users/usermanage.php"
                        dataType: 'json',
                        data: {
                            process: 'login',
                            email: encodeURIComponent(loginemail_value),
                            password: loginpassword_value,
                            source: 'desktop',
                            login_type: 'login'
                        },
                        async: false
                    }).done(function(msg) {
                        if (msg === "error" || msg.auth.result.msg === "Incorrect password") {
                            e.preventDefault();
                            // If logged in from popup
                            if ($('.pop-up__cntnr').length) {
                                var $loginBox = $(".usr-inputbox"),
                                    errBlock = $("div.usr-inputbox__error");
                                errBlock.length && errBlock.remove();
                                $('.pop-up__cntnr').not('.hide').find(".usr-inputbox__inr").prepend("<div class='usr-inputbox__error usr-inputbox__error--in-popup'>The email and password you entered did not match our records. Please double-check and try again.</div>").slideDown('slow');
                            } else {
                                // If logged in from login page (/users/login.php)
                                var $pageErrorBox = $('.lgn__err');
                                $pageErrorBox
                                    .text("Email and password did not match.")
                                    .slideDown();
                                    logLoginPageEvents("login-error", "Email and password did not match.");
                            }

                            $("body").animate({ "scrollTop": 0 }, 500);
                            return false;
                        } else if (msg.auth.result.msg === "No account exists with this email_id") {
                            e.preventDefault();
                            // If logged in from popup
                            if ($('.pop-up__cntnr').length) {
                                var $loginBox = $(".usr-inputbox"),
                                    errBlock = $("div.usr-inputbox__error");
                                errBlock.length && errBlock.remove();
                                $('.pop-up__cntnr').not('.hide').find(".usr-inputbox__inr").prepend("<div class='usr-inputbox__error usr-inputbox__error--in-popup'>There is no account with your email id. Please signup and try again. </div>").slideDown('slow');
                            } else {
                                // If logged in from popup
                                var $pageErrorBox = $('.lgn__err'),
                                    signupURL = "signup.php"+location.search;
                                $pageErrorBox
                                    .html("Not Registered. Please <a href='"+signupURL+"'>Sign up</a>.")
                                    .slideDown();
                                logLoginPageEvents("login-error", "Not Registered.");
                            }

                            $("body").animate({ "scrollTop": 0 }, 500);
                            return false;
                        } else { // Success clause: Login done!
                            // If popup login:
                            if ($('.pop-up__cntnr').length) { $('.usr-inputbox__error').slideUp('slow'); }
                            if ($('.lgn__err').length) { $('.lgn__err').slideUp('slow'); }

                            loginme(msg); // login and ui update

                            if (!$('.pop-up__cntnr').length) {
                                // Not popup
                                logLoginPageEvents("login-success", "MSP Login.");
                                var rdrctUrl = qS.destUrl || getCookie("previousUrl") || "/";
                                rdrctUrl = (qS.destUrl && qS.utm_source) ? rdrctUrl + "?utm_source=" + qS.utm_source : rdrctUrl;
                                window.location.href = rdrctUrl; // Both utm_source & destUrl must be set for redirect.
                                deleteCookie("previousUrl");
                                return false;
                            } else {
                                closePopup_RUI();
                                e.preventDefault();
                                return false;
                            }
                        }
                    });
                }).fail(function() {
                    e.preventDefault();
                    if (!$('.pop-up__cntnr').length) {
                        logLoginPageEvents("validation-error", "Invalid email/password format.");
                    }
                    return false;
                }).always(function() {
                    $('.pop-up__cntnr .ldr__ovrly').hide();
                });
            }
            if (private.hasErrFields($thisForm)) {
                e.preventDefault();
                return false;
            } else {
                checkValidations();
            }
        },
        signupformValidator: function(e) {
            var $thisForm = $("#inputbox__signup-form");

            function checkValidations() {
                var emailField = $('#signup-form__email'),
                    pwdField = $('#signup-form__pwd');

                // Form validtion
                var formData = [{ "type": "email", "inputField": emailField, "errorNode": emailField.siblings(".js-vldtn-err").add(".lgn__err"), "errorMsg": "Please enter a valid email address" },
                    { "type": "required", "inputField": pwdField, "errorNode": pwdField.siblings(".js-vldtn-err").add(".lgn__err"), "errorMsg": "Please enter a valid password" }
                ];

                $('.pop-up__cntnr .ldr__ovrly').show();


                MSP.utils.validate.form(formData).done(function() {
                    var signupemail_value = emailField.val(),
                        name_value = $('#signup-form__name').val(),
                        signuppassword_value = pwdField.val(),
                        signup_utm = getCookie("signup-utm") || ((window.qS && qS.fromEducationPopup) ? "education_popup" : qS.utm_source || qS.ref),
                        signup_token = qS.utm_source == "chrome_extension_notif_nontrans_loyal" ? qS.signup_token : "";

                    $.ajax({
                        type: "POST",
                        url: "https://www.mysmartprice.com/users/login_common.php", //"/users/usermanage.php",
                        dataType: 'json',
                        async: false,
                        data: {
                            process: 'signup',
                            email: encodeURIComponent(signupemail_value),
                            password: signuppassword_value,
                            subscribed_status: 'subscribed',
                            name: name_value,
                            utm_source: signup_utm,
                            source: 'desktop',
                            login_type: 'signup',
                            signup_token: signup_token
                        },
                        async: false
                    }).done(function(msg) {

                        if (typeof msg !== 'string' && msg.auth.result.msg === 'Account already exists with this email_id') {
                            e.preventDefault();

                            if ($('.pop-up__cntnr').length) {
                                // If popup:
                                var $loginBox = $(".usr-inputbox"),
                                    errBlock = $("div.usr-inputbox__error");
                                errBlock.length && errBlock.remove();
                                $('.pop-up__cntnr').not('.hide').find(".usr-inputbox__inr").prepend("<div class='usr-inputbox__error usr-inputbox__error--in-popup'>This email address is already registered.</div>").slideDown('slow');
                            } else {
                                // If signed up from sign up page (/users/signup.php)
                                var $pageErrorBox = $('.lgn__err'),
                                    loginURL = "login.php"+location.search;

                                $pageErrorBox
                                    .html("Already Registered. <a href='"+loginURL+"'>Login</a> or <span class=\"text-link js-popup-trgt\" data-href=\"fp.htm\">Reset Your Password</span>.")
                                    .slideDown();
                                logLoginPageEvents("signup-error", "Already Registered.");
                            }
                            if (getCookie('u99rs1deal')) {
                                alert('Unable to login. Please check credentials'); // Alert to bring back focus to current tab (Not GTS tab)
                            }
                            $("body").animate({ "scrollTop": 0 }, 500);
                            return false;
                        } else if (msg === "error") {
                            e.preventDefault();

                            if ($('.pop-up__cntnr').length) {
                                var $loginBox = $(".usr-inputbox"),
                                    errBlock = $("div.usr-inputbox__error");
                                errBlock.length && errBlock.remove();
                                $('.pop-up__cntnr').not('.hide').find(".usr-inputbox__inr").prepend("<div class='usr-inputbox__error usr-inputbox__error--in-popup'>There is some error in signup. Please try after sometime.</div>").slideDown('slow');
                            } else {
                                // If signed up from sign up page (/users/signup.php)
                                var $pageErrorBox = $('.lgn__err');
                                $pageErrorBox
                                    .text("Error occurred. Please try after sometime.")
                                    .slideDown();
                                logLoginPageEvents("signup-error", "Error occurred. Please try after sometime.");
                            }

                            $("body").animate({ "scrollTop": 0 }, 500);
                            return false;
                        } else {
                            if (msg.auth.result.msg == 'true') { // Success clause: signup done!
                                // If popup login:
                                if ($('.pop-up__cntnr').length) { $('.usr-inputbox__error').slideUp('slow'); }
                                if ($('.lgn__err').length) { $('.lgn__err').slideUp('slow'); }

                                loginme(msg); // login and ui update

                                deleteCookie("signup-utm");

                                if (!$('.pop-up__cntnr').length) {
                                    // Not popup
                                    logLoginPageEvents("signup-success", "success");
                                    var rdrctUrl = qS.destUrl || getCookie("previousUrl") || "/";
                                    rdrctUrl = (qS.destUrl && qS.utm_source) ? rdrctUrl + "?utm_source=" + qS.utm_source : rdrctUrl;
                                    window.location.href = rdrctUrl; // Both utm_source & destUrl must be set for redirect.
                                    deleteCookie("previousUrl");
                                    return false;
                                } else {
                                    closePopup_RUI();
                                    e.preventDefault();
                                    return false;
                                }
                            } else {
                                formData[0].errorNode.html(msg.auth.result.msg);
                                formData[0].errorNode.show();
                            }
                        }
                    });

                }).fail(function() {
                    e.preventDefault();
                    if (!$('.pop-up__cntnr').length) {
                        logLoginPageEvents("validation-error", "Invalid email/password format.");
                    }
                    return false;
                }).always(function() {
                    $('.pop-up__cntnr .ldr__ovrly').hide();
                    //closePopup_RUI();
                });
            }

            if (private.hasErrFields($thisForm)) {
                e.preventDefault();
                return false;
            } else {
                checkValidations();
            }
        },
        forgotformValidator: function(e) {
            e.preventDefault();
            var $thisForm = $("#inputbox__forgot-form");

            function checkValidations() {
                var emailField = $('#forgot-form__email');

                // Form validtion
                var formData = [{ "type": "email", "inputField": emailField, "errorNode": emailField.siblings(".js-vldtn-err"), "errorMsg": "Please enter a valid email address" }];
                MSP.utils.validate.form(formData).done(function() {
                    var fpemail_value = emailField.val();
                    $.ajax({
                        type: "POST",
                        dataType: 'json',
                        url: "https://www.mysmartprice.com/users/login_common.php", //"/users/usermanage.php",
                        data: {
                            process: 'forgotpassword',
                            email: encodeURIComponent(fpemail_value),
                            login_type: 'forget_password'
                        }
                    }).done(function(msg) {
                        $(".usr-inputbox__inr").children().remove().end().append('<div class="usr-inputbox__cnfrmtn">The email for resetting the password has been sent to you. Please check your email.</div>');
                    })
                }).fail(function() {
                    e.preventDefault();
                    return false;
                });
            }
            if (private.hasErrFields($thisForm)) {
                e.preventDefault();
                return false;
            } else
                checkValidations();
        },
        resetformValidator: function(e) {
            e.preventDefault();
            var $thisForm = $("#inputbox__resetpass-form");

            function checkValidations() {
                var pwdField = $("#resetpass-form__pwd"),
                    cnfrmPwdField = $("#resetpass-form__pwd-cnfrm");
                // Form validtion
                var formData = [{ "type": "required", "inputField": pwdField, "errorNode": pwdField.siblings(".js-vldtn-err"), "errorMsg": "Please enter a valid password" },
                    { "type": "required", "inputField": cnfrmPwdField, "errorNode": cnfrmPwdField.siblings(".js-vldtn-err"), "errorMsg": "Please enter a valid password" }
                ];
                MSP.utils.validate.form(formData).done(function() {
                    var resetpassword_value = pwdField.val();

                    if (resetpassword_value === cnfrmPwdField.val()) {
                        var qS = queryString(window.location.search),
                            resetemail_value = qS.email,
                            userHash = qS.user;

                        $.ajax({
                            type: "POST",
                            url: "https://www.mysmartprice.com/users/login_common.php", //"/users/usermanage.php",

                            dataType: "json",
                            data: {
                                process: 'resetpass',
                                email: encodeURIComponent(resetemail_value),
                                password: resetpassword_value,
                                login_type: 'resetpass',
                                source: 'desktop',
                                user: userHash
                            }
                        }).done(function(msg) {
                            if (msg == 'error')
                                alert('error');
                            else {
                                loginme(msg); // 2 ajax get_msp_coins,
                                $(".usr-inputbox__form").hide();
                                $(".usr-inputbox__inr").append('<div class="usr-inputbox__cnfrmtn">Your password has been changed, You will be redirected to home page in 3 seconds.</div>');
                                setTimeout(function() { window.location = "/loyalty/#tabOpen=how_it_works" }, 3000);
                            }
                        });

                    }

                });

            }
            (!private.hasErrFields($thisForm) && checkValidations());
            return false;
        },
        eventHandlers: function() {

            /* specific to login page & signup page */
            if ($(".algn-wrpr--form-athntctn").length) {
                if (getCookie("msp_login")) {
                    var cookieUrl = getCookie("previousUrl");
                    deleteCookie("previousUrl");
                    if (qS.close == "1" && window.opener) {
                        window.opener.postMessage("update_ui","*");
                    }
                    window.location = qS.destUrl || cookieUrl || "/";
                }

                $(".algn-wrpr--form-athntctn .usr-inputbox__form input:eq(0)").focus();
                loginCallbackQueue.push(private.redirectLoggedUser);
            }
            $(".login-form__email, .signup-form__email, .forgot-form__email").on("change", function() {
                $(this).blur(function() {
                    var field = $(this);
                    isValid = MSP.utils.validate.email(field.val()),
                        private.showFieldValidation(field, isValid, "Please enter a valid email address");
                });
            })
            $(".login-form__pwd").on("change", function() {
                $(this).blur(function() {
                    var field = $(this);
                    isValid = MSP.utils.validate.required(field.val()),
                        private.showFieldValidation(field, isValid, "Please enter a valid password");
                });
            })
            $(".signup-form__pwd,.resetpass-form__pwd").on("change", function() {
                $(this).blur(function() {
                    var field = $(this),
                        errMsg = "",
                        isValid = false,
                        fieldVal = field.val();

                    if (!(isValid = MSP.utils.validate.required(fieldVal))) {
                        errMsg = "Please enter a valid password";
                    } else if (!(isValid = MSP.utils.validate.required(fieldVal, { "min": 6 }))) {
                        errMsg = "Password should be minimum of 6 characters";
                    }
                    private.showFieldValidation(field, isValid, errMsg);
                });
            })
            $(".resetpass-form__pwd-cnfrm").on("change", function() {
                $(this).blur(function() {
                    var field = $(this),
                        isValid = field.val() === $(".resetpass-form__pwd").val();
                    private.showFieldValidation(field, isValid, "Passwords does not match");
                });
            })

            $(".lgn__form").on("submit", function(e) {
                var $form = $(this),
                    $error = $(".lgn__err"),
                    $email = $form.find(".lgn__fld--eml .lgn__inpt"),
                    $password = $form.find(".lgn__fld--pswd .lgn__inpt");
                if (!MSP.utils.validate.email($email.val())) {
                    $error.text("Please enter a valid email address.").slideDown();
                } else if ($password.val().length < 6) {
                    $error.text("Please enter a valid password.").slideDown();
                } else {
                    // TODO
                }
                return false;
            });
            $(".lgn__btn--eml").on("click", function() {
                var $this = $(this);
                $this.fadeOut("fast", function () {
                    $this.siblings(".lgn__form").fadeIn("fast", function () {
                        $(".js-signup__email").focus();
                    });
                });
                logLoginPageEvents("email-button", "Clicked.");
            });
            $(".lgn__btn--ggl").on("click", function() {
                MSP.login.gplus();
            });
            $(".lgn__btn--fcbk").on("click", function() {
                MSP.login.facebook();
            });
            $("#login-form__submit").on("click", function(e) {
                userFormValidations.loginformValidator(e);
            });
            $("#signup-form__submit").on("click", function(e) {
                userFormValidations.signupformValidator(e);
            });
            $("#forgot-form__submit").on("click", function(e) {
                userFormValidations.forgotformValidator(e);
            });
            $("#resetpass-form__submit").on("click", function(e) {
                userFormValidations.resetformValidator(e);
            });
        }
    }
    return public;
})();

if ($(".sctn--lgn, .usr-inputbox").length) {
    userFormValidations.eventHandlers();
}


// Added from common.js [END]


MSP.login = {
    fb_init: function() {
        window.fbAsyncInit = function() {
            FB.init({
                //appId      : '516534571724606',//mspdvid:'327375840708379', // App ID
                appId: '253242341485828',
                channelUrl: '/users/fbchannel.html', // Channel File
                status: true, // check login status
                cookie: true, // enable cookies to allow the server to access the session
                xfbml: true,
                version: 'v2.9' // parse XFBML
            });
        };

        // Load the SDK Asynchronously
        (function(d) {
            var js, id = 'facebook-jssdk',
                ref = d.getElementsByTagName('script')[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement('script');
            js.id = id;
            js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
            ref.parentNode.insertBefore(js, ref);
        }(document));

    },
    extensionWelcome: function() {
        setCookie("chrome_extension_welcome", "1", 1);
        MSP.login.facebook();
    },
    showRedirectLoader: function() {
        var loaderHTML = [
            '<div class="sctn--ldng">',
            '<div class="ldr"><div class="ldr__crcl"></div><div class="ldr__text" style="">Redirecting...</div></div>',
            '</div>'
        ].join('');
        $('.sctn--lgn').append(loaderHTML);
    },
    removeRedirectLoader: function() {
        $('.sctn--ldng').length && $('.sctn--ldng').remove();
    },
    facebook: function() {
        fb_login();


        function check_fb_login() {
            var email = '';
            FB.getLoginStatus(function(response) {
                if (response.status === 'connected') {
                    update_f_data_login(response);
                    $(".userinfo img:first-child").attr('src', 'http://graph.facebook.com/' + response.authResponse.userID + '/picture');
                }
            });
        }

        function fb_login() {
            debugger
            if (!FBloggedIn) {
                var email = '';
                $('.pop-up__cntnr .ldr__ovrly').show();
                FB.login(function(response) {
                    if (response.authResponse) {
                        email = update_f_data_login(response);
                    }
                }, { scope: "email, user_birthday, user_likes, user_location, publish_actions" });
            }
        }

        function update_f_data_login(info) {
            var email = '';
            FB.api('/me', 'GET', {
                    "fields": "id, name, email, first_name, last_name, picture"
                },
                function(data) {
                    MSP.login.showRedirectLoader();
                    email = data.email;
                    if (!data.first_name) {
                        data.first_name = email.split('@')[0];
                    }
                    data['access_token'] = info.authResponse.accessToken;
                    data.email = encodeURIComponent(data.email);
                    if (!email) {
                        $(".pop-up__sgnp").removeClass("hide");
                        $(".pop-up__lgn").addClass("hide");
                        $(".pop-up__sgnp .usr-inputbox__msg").show();
                        $(".pop-up__sgnp .usr-inputbox__orline").hide();
                        $(".pop-up__sgnp .usr-inputbox__social").hide();
                        return false;
                    }
                    $.ajax({
                        url: 'https://www.mysmartprice.com/users/login_common.php',

                        type: 'POST',
                        dataType: 'json',
                        data: {
                            fb: data,
                            login_type: 'facebook',
                            source: 'desktop',
                            email: encodeURIComponent(email)
                        }
                    }).done(function(response) {
                        loginme_by_fb(response, data.picture.data.url, data.first_name);
                        if ($('.pop-up__cntnr').length) {
                            closePopup_RUI();
                        } else if ($('.scl__qna-popup').length) {
                            qnaSocialLogin();
                            $('.js-sbmt-answr').trigger('click');
                        } else {
                            logLoginPageEvents("fb-success", "success");
                            closePopup();
                        }
                    }).fail(function() {
                        logLoginPageEvents("fb-error", "error");
                        MSP.login.removeRedirectLoader();
                    });
                });
            email && captureEmail(email);
            return email;
        }
    },

    gplus: function() {
        var config = {
            'client_id': '697312397493-f0hdl2qr52fqfphvm8ihg01e17f5tfcr.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email'
        };
        gapi.auth.authorize(config, function() {
            fetch(gapi.auth.getToken());
        });

        function fetch(token) {
            var profile = {};
            $('.pop-up__cntnr .ldr__ovrly').show();
            $.ajax({
                url: "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token.access_token + "&alt=json",
            }).done(function(response) {
                MSP.login.showRedirectLoader();
                profile = response;
                $.ajax({
                    url: 'https://www.mysmartprice.com/users/login_common.php', //'/users/gplus_submit.php',

                    type: 'POST',
                    dataType: 'json',
                    data: { 'gplus': profile, login_type: 'gplus', source: 'desktop', email: profile.email, access_token: token.access_token }
                }).done(function(response) {
                    loginme_by_fb(response, profile.picture, profile.given_name);
                    $('.pop-up__cntnr .ldr__ovrly').hide();
                    if ($('.pop-up__cntnr').length) {
                        closePopup_RUI();
                    } else if ($('.scl__qna-popup').length) {
                        qnaSocialLogin();
                        $('.js-sbmt-answr').trigger('click');
                    } else {
                        logLoginPageEvents("ggl-success", "success");
                        closePopup();
                    }
                }).fail(function() {
                    logLoginPageEvents("ggl-error", "error");
                    MSP.login.removeRedirectLoader();
                });
            });
        }
    }
}

function captureEmail(email) {
    debugger
    var pluginInstallSource = getCookie("pluginInstallSource") || "",
        captureUrl = "/promotions/plugin/email_capture_noreward.php",
        pluginInstallOrigin = getCookie("pluginInstallOrigin") || "",
        data = {
            "email": email,
            "phone": ""
        };

    if (pluginInstallSource && (pluginInstallSource === "deal-comparables" || pluginInstallSource === "pluginCashback")) {
        captureUrl = "/loyalty/popup/register_chrome_cashback.php";
        data = {
            "email": email,
            "mobile_number": "",
            "source": pluginInstallSource,
            "capture_url": pluginInstallOrigin
        };
    }

    $.ajax({
        url: captureUrl,
        type: "POST",
        data: data,
        async: false
    });
}

// Function to store current viewed item to indexed db
// storeProductInfo();
$(document).ready(function() {
    if (window.location.pathname == '/' || window.location.pathname == '/deals/') {
        fillRecentlyViewedSection();
    }
});

function storeProductInfo() {
    var url = document.URL;
    if (dataLayer[0].url !== undefined && (url.indexOf('-msp') > -1 || url.indexOf('-msf') > -1 || url.indexOf('products') > -1 || url.indexOf('-dealid') > -1)) {
        var productInfo = {
            title: dataLayer[0].title,
            image: dataLayer[0].image,
            price: dataLayer[0]["min-price"],
            url: dataLayer[0].url,
            mspid: dataLayer[0].mspid,
            productType: dataLayer[0]["product-type"],
            timeStamp: Date.now()
        }
        if (window.indexedDB) {
            var request = window.indexedDB.open("userDb", 1);
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                // Create an objectStore for this database
                if (!db.objectStoreNames.contains("recentlyViewed")) {
                    var objectStore = db.createObjectStore("recentlyViewed", { autoIncrement: true });
                    objectStore.createIndex("url", "url", { unique: true });
                    objectStore.createIndex("timeStamp", "timeStamp", { unique: false });
                }
            };
            request.onerror = function(event) {
                // Do something with request.errorCode!
                console.log("error on indexdb open");
            };
            request.onsuccess = function(event) {
                db = event.target.result;
                var transaction = db.transaction(["recentlyViewed"], "readwrite");
                var store = transaction.objectStore("recentlyViewed");
                var myIndex = store.index('url');
                var getKeyRequest = myIndex.getKey(productInfo.url);
                getKeyRequest.onsuccess = function(event) {
                    var key = getKeyRequest.result;
                    if (key === undefined) {
                        store.put(productInfo);
                    } else {
                        var getRequest = store.get(key);
                        getRequest.onsuccess = function(event) {
                            var oldPrice = getRequest.result.price;
                            var newPrice = productInfo.price;
                            var lastVisited = new Date(getRequest.result.timeStamp).toDateString();
                            if (lastVisited == new Date().toDateString()) {
                                lastVisited = '';
                            } else {
                                lastVisited = ' on ' + lastVisited;
                            }
                            if (oldPrice > newPrice && oldPrice != '0' && newPrice != '0') {
                                var priceDiff = ((oldPrice - newPrice) * 100 / oldPrice).toFixed(1);
                                var priceText = "Price dropped by " + priceDiff + "% since your last visit" + lastVisited;
                                var eventAction = 'Dropped';
                            } else if (oldPrice < newPrice && oldPrice != '0' && newPrice != '0') {
                                var priceDiff = ((newPrice - oldPrice) * 100 / oldPrice).toFixed(1);
                                var priceText = "Price increased by " + priceDiff + "% since your last visit" + lastVisited;
                                var eventAction = 'Increased';
                            } else if (oldPrice = newPrice && oldPrice != '0' && newPrice != '0') {
                                var priceDiff = 0;
                                var priceText = "Price remained same since your last visit" + lastVisited;
                                var eventAction = 'Remainedsame';
                            }
                            //disabled by mallik
                            if (false && priceText !== undefined) {
                                var priceDiffHtml = "<div class='prdct-dtl__str-ftrs'><span class='prdct-dtl__str-ftr prdct-dtl__str-ftr--hghlght'>" + priceText + "</span>  </div>";
                                $(".prdct-dtl__str-dtls").append(priceDiffHtml);
                                ga('send', 'event', 'pricetool', eventAction, getRequest.result.mspid, priceDiff);
                            }
                            store.put(productInfo, key);
                        }
                    }
                }
                var countRequest = store.count();
                countRequest.onsuccess = function() {
                    if (countRequest.result > 20) {
                        delCount = countRequest.result - 20;
                        store.index("timeStamp").openCursor().onsuccess = function(event) {
                            var cursor = event.target.result;
                            if (cursor && delCount > 0) {
                                delCount--;
                                console.log(delCount);
                                store.delete(cursor.primaryKey);
                                cursor.continue();
                            }
                        };
                    }
                }
            };
        }
    }
}

function fillRecentlyViewedSection() {
    var isDealPage = window.location.pathname === "/deals/" ? true : false;

    if (window.indexedDB) {
        var request = indexedDB.open("userDb", 1);
        request.onupgradeneeded = function(event) {
            var thisDB = event.target.result;

            // Create an objectStore for this database
            if (!thisDB.objectStoreNames.contains("recentlyViewed")) {
                var objectStore = thisDB.createObjectStore("recentlyViewed", { autoIncrement: true });
                objectStore.createIndex("url", "url", { unique: true });
                objectStore.createIndex("timeStamp", "timeStamp", { unique: false });
            }
        };
        request.onerror = function(event) {
            // Do something with request.errorCode!
            console.log("error on indexdb open");
        };
        request.onsuccess = function(event) {
            db = event.target.result;
            var transaction = db.transaction(["recentlyViewed"], "readonly");
            var objectStore = transaction.objectStore("recentlyViewed");
            var cursor = objectStore.index("timeStamp").openCursor(null, "prev");
            var startHtml = '<div class="sctn" id="rcntly_vwd" data-slideitem="prdct-item" data-slideitemwrprper="sctn__inr"><div class="sctn__hdr clearfix"><div class="sctn__ttl">You Recently Viewed</div><div class="sctn__nvgtn"></div></div><div class="sctn__inr prdct-grid clearfix">';
            var snippet = '<div class="prdct-item" data-mspid="--mspid--"><div class="prdct-item__save-btn js-save-btn"></div><a class="prdct-item__img-wrpr" href="--url--"><img class="prdct-item__img" src="https://assets.mspcdn.net/w_70/logos/mysmartprice/owl/lazy.png" data-lazy-src="--image--" alt="--alttitle--"></a><div class="prdct-item__dtls"><a class="prdct-item__name" href="--hrefurl--">--title--</a><div class="prdct-item__prc"><span class="prdct-item__rpe">--priceSym--</span><span class="prdct-item__prc-val">--price--</span></div></div></div>';
            var endHtml = '</div></div>';
            var rvCount = 0;
            cursor.onsuccess = function(e) {
                var res = e.target.result;
                console.log(res);
                if (rvCount == 5) {
                    res = null;
                }
                if (res) {
                    newSnippet = snippet;
                    var price = res.value.price,
                        productType = res.value.productType;

                    if ((isDealPage && productType == "deals") || (!isDealPage && productType != "deals")) {
                        price = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        var priceSym = 'â‚¹';
                        if (price == '0') {
                            var priceSym = '';
                            price = 'Not Available';
                        }
                        newSnippet = newSnippet.replace('--url--', res.value.url + '?ref=rv').replace('--title--', res.value.title).replace('--image--', res.value.image).replace('--price--', price).replace('--mspid--', res.value.mspid).replace('--alttitle--', res.value.title).replace('--hrefurl--', res.value.url).replace('--priceSym--', priceSym);
                        rvCount++;
                        startHtml += newSnippet;
                    }

                    res.continue();

                } else {
                    if (rvCount > 0) {
                        startHtml += endHtml;
                        if ($('.spnsr-cntnt').length) {
                            $('.spnsr-cntnt').before(startHtml);
                        } else {
                            $('.main-wrpr').append(startHtml);
                        }
                        lazyLoadImages();
                    }
                }
            }
        }
    }
}

(function headerSPEvent() {

    $doc.on('click', '.js-lylty-hdr', function() {
        var partialLogin = getCookie("partial_login");

        var gaEvent = partialLogin ? "Partial-Login-Click" : "Loyalty-Header-Click";

        window.ga && ga("send", "event", "Loyalty", gaEvent, getCookie("msp_uid") || "");

    })
})();

function copyText($selector, successCallback, failCallback) {
    var text = $selector.data("text");
    $('body').append("<input class='js-temp-txt' value=" + text + " />");
    $(".js-temp-txt").select();
    try {
        document.execCommand('copy');
        successCallback();
    } catch (e) {
        failCallback(e);
    }
}

/*
function showFrosttyBanner(){
      window.ga&&ga("send","event","FrosttyBannerShowed","show",getCookie("msp_uid")||"");
      $(".body-wrpr").first().prepend('<div class="frostty_banner sctn" style="margin-bottom:0"><a href="https://www.frostty.com/?utm_source=msp_banner" target="_blank"> <img class="bnr__img" src="http://assets.mspcdn.net/image/upload/f_auto/frostty/banner/frostty_v2.1.png"/></a></div>');
      $(".frostty_banner").on("click",function(){window.ga&&ga("send","event","FrosttyBanner","click",getCookie("msp_uid")||"")});
}
*/

$doc.on("click", ".js-copy", function() {
    $this = $(this);
    copyText($this, function() {
        $this.text("COPIED").removeClass("bttn--blue").addClass("bttn--grn");
    }, function() {
        //Do something when copying is not supported by browser
    })
});


$doc.on("click", ".js-send-email", function() {
    var address = $(this).data("address"),
        subject = $(this).data("subject"),
        body = $(this).data("body"),
        cc = $(this).data("cc"),
        strMail = 'https://mail.google.com/mail/?view=cm&fs=1&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body) + '&cc=' + encodeURIComponent(cc);

    window.open(strMail, "_blank");

});


var QnA = {
    data: {
        mspId: $('.js-prdct-ttl').data('mspid'),
        leastAnsweredQuestionsList: [],
        answeringSingleQuestion: false // Excludes reading of a single question (ONLY answering)
    },
    generalFunctions: {
        randomInt: function(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

    },

    ajaxFunctions: {
        submitQuestion: function(emailInput, quesInput, $successDiv) {
            $.ajax({
                url: "/review/qna/submit_qna.php",
                data: {
                    email: emailInput,
                    question: quesInput,
                    mspid: QnA.data.mspId,
                    capture_point: document.referrer
                }
            }).done(function() {
                $successDiv.slideDown();
            });
        },
        submitAnswer: function(emailInput, ansInput, questionId) {
            $.ajax({
                url: "/review/qna/submit_qna.php",
                data: {
                    email: emailInput,
                    answer: ansInput,
                    mspid: QnA.data.mspId,
                    questionId: questionId,
                    capture_point: document.referrer
                }
            }).done(function() {
                var $successDiv = $this.closest('.wrt-answr-form').find('.wrt-answr-form__sccss');
                $successDiv.slideDown();

                // Automatically go to the next question:
                if (QnA.data.answeringSingleQuestion) {
                    $successDiv.append(' | Loading Next Question ... ');
                    setTimeout(function() {
                        QnA.eventFunctions.gotoNextQuestion();
                    }, 2000);
                }
            });
        },

        followQuestion: function($this) {
            $.ajax({
                url: "/review/qna/submit_user_action.php",
                data: {
                    entity_type: "q",
                    email_id: getCookie('msp_login_email'),
                    entity_id: questionId,
                    action: type,
                    source: "desktop_" + dataLayer[0].pagetype
                }
            }).done(function(response) {
                $this.each(function(i, v) {
                    $this = $(this);
                    if ($this.closest('.js-qstn-answr').data("question-id") == questionId) {
                        var followCount = parseInt($this.find($(".js-qstn-answr__flw__count")).html());
                        $this.data("followstate", "unfollow");
                        $this.find($(".js-qstn-answr__flw__count")).html(followCount + 1);

                        $this.find($(".js-flw__lbl")).html("Answer Requested");
                        window.ga && ga('send', 'event', "QNA", "click", "follow");
                        closePopup();
                        return false;
                    }
                });
            });

        },
        voteQuestion: function(questionId, type, $this) {
            $.ajax({
                url: "/review/qna/submit_user_action.php",
                data: {
                    entity_id: questionId,
                    entity_type: 'q',
                    email_id: getCookie('msp_login_email'),
                    action: type,
                    source: "desktop_" + dataLayer[0].pagetype
                }
            }).done(function(response) {
                var $count = $this.closest('.qstn-vote').find('.vte-cnt');
                if (response.count) {
                    if (response.count > 0) {
                        $count.removeClass('ngtv').addClass('pstv').text('+' + response.count);
                    } else {
                        $count.removeClass('pstv').addClass('ngtv').text('-' + response.count);
                    }
                } else {
                    $count.removeClass('pstv ngtv').text(response.count);
                }
            });
        },
        voteAnswer: function(answerId, type, $this) {
            //console.log(answerId);
            $.ajax({
                url: "/review/qna/submit_user_action.php",
                data: {
                    entity_id: answerId,
                    entity_type: 'a',
                    email_id: getCookie('msp_login_email'),
                    action: type,
                    source: "desktop_" + dataLayer[0].pagetype
                }
            }).done(function(response) {
                if (type === 'upvote') {
                    $this.text(response.likes);
                } else {
                    $this.text(response.dislikes);
                }
            });
        }
    },
    eventFunctions: {
        showQuestionForm: function($this) {
            $this.closest('.ask-qstn').removeClass('collapse');
        },
        showAnswerForm: function($this) {
            $this.slideUp();
            $this.closest('.wrt-answr').find('.wrt-answr-form').slideDown();
        },
        upvoteQuestion: function($this) {
            if ($this.hasClass('js-is-active-vote')) {
                return;
            }
            var questionId = $this.closest('.qstn-answr').data('question-id') || $this.closest('.qna__item').data('question-id'),
                upvoteCount = parseInt($this.find(".vte-cnt").html());
            $this.addClass('clckd-vte js-is-active-vote').find(".vte-cnt").html(upvoteCount + 1);

            QnA.ajaxFunctions.voteQuestion(questionId, 'upvote', $this);
        },
        downvoteQuestion: function($this) {
            if ($this.hasClass('js-is-active-vote')) {
                return;
            }
            var questionId = $this.closest('.qstn-answr').data('question-id');
            $this.addClass('clckd-vte js-is-active-vote')
                .closest('.qstn-vote')
                .find('.upvt')
                .removeClass('clckd-vte js-is-active-vote');
            QnA.ajaxFunctions.voteQuestion(questionId, 'downvote', $this);
        },

        followQuestion: function($this) {
            var $this = $this;
            var followCount = parseInt($this.find($(".js-qstn-answr__flw__count")).html());
            var questionId = $this.closest(".js-qstn-answr").data('question-id');
            if ($this.data("followstate") == "unfollow") {
                return;
            }
            if ($this.data("followstate") == "follow") {

                openPopup('/review/qna/popup/request_answer.php?source=desktop_q_list&q_id=' + questionId);
            } else {
                $this.data("followstate", "follow");
                $this.find($(".js-qstn-answr__flw__count")).html(followCount - 1);

                $this.find($(".js-flw__lbl")).html("Request Answer");
                window.ga && ga('send', 'event', "QNA", "click", "unfollow");
                QnA.ajaxFunctions.followQuestion(questionId, "unfollow", $this);
            }
        },
        upvoteAnswer: function($this) {
            if ($this.hasClass('js-is-active-vote')) {
                return;
            }
            var answerId = $this.closest('.qna__answr').data('answerid') || $this.closest('.user-answrs__answr').data('answerid');
            $this.addClass('clckd-vte js-is-active-vote')
                .closest('.answr-vote')
                .find('.dwnvt')
                .removeClass('clckd-vte js-is-active-vote');
            $this.closest(".answr-vote").removeClass("answr-vote");
            $this.html("Marked Helpful (" + (parseInt($this.find(".upvt-cnt").html()) + 1) + ")"); // Increasing the count when user clicks
            window.ga && ga('send', 'event', "QNA", "click", "upVote");
            QnA.ajaxFunctions.voteAnswer(answerId, 'upvote', $this);
        },
        downvoteAnswer: function($this) {
            if ($this.hasClass('js-is-active-vote')) {
                return;
            }
            var answerId = $this.closest('.user-answrs__answr').data('answerid');
            console.log(answerId);
            $this.addClass('clckd-vte js-is-active-vote')
                .closest('.answr-vote')
                .find('.upvt')
                .removeClass('clckd-vte js-is-active-vote');
            $this.html(parseInt($this.find(".upvt-cnt").html()) + 1); // decreasing the count when user clicks
            window.ga && ga('send', 'event', "QNA", "click", "downVote");
            // QnA.ajaxFunctions.voteAnswer(answerId, 'dislike', $this);
        },
        viewAllAnswers: function($this) {
            var questionId = $this.closest('.qstn-answr').data('question-id');
            window.location.hash = 'ans-qstn-' + questionId;
        },
        gotoNextQuestion: function($this) { // `$this` is an optional parameter (NOT applicable when next question is AUTOMATICALLY loaded)
            if (!QnA.data.leastAnsweredQuestionsList[0]) {
                if ($this) {
                    $this.closest('.answr-next-qstn').text('No more questions');
                }
                return;
            }
            var questionId = QnA.data.leastAnsweredQuestionsList[0].questionId,
                hash = window.location.hash;
            if (/hide-ans/.test(hash)) {
                window.location.hash = 'ans-qstn-hide-ans-' + questionId;
            } else {
                window.location.hash = 'ans-qstn-' + questionId;
            }
            QnA.data.leastAnsweredQuestionsList.shift();
        }
    },
    inputHandler: {
        email: function(emailInput, $emailError) {
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!regex.test(emailInput)) {
                $emailError.slideDown();
                return false;
            }
            return true;
        },
        text: function(textInput, $textError) {
            var regex = /^[a-z\d\-_\s?]+$/i;
            if (!regex.test(textInput) || textInput.length < 2) {
                $textError.slideDown();
                return false;
            }
            return true
        }
    },
    prefillEmail: function() {
        if (getCookie) {
            $('input[type=email]').val(getCookie('msp_login_email'));
        }
    },
    setEmailCookie: function(emailInput) {
        if (!getCookie('msp_login_email')) {
            setCookie("msp_login_email", emailInput, 365);
        }
    },
    hashHandler: function(hash) {
        var id;
        if (hash.length) {
            /*
            if ( /ask-qstn/.test(hash)) {
                $('.ask-qstn').removeClass('collapse');
                $('.js-user-answrs').addClass('all-shwn'); // show question and its answers as one
                $('.js-user-answrs, .js-qstn-answr').show(); // Show all the AnswerQues + UserAns divs
                $('.js-qstn-answr .js-wrt-answr__ttl').show(); // show button/link to open an answer form
                $('.js-qstn-answr .js-wrt-answr-form').hide(); // hide the answer forms themselves
                QnA.data.answeringSingleQuestion = false;
            } else if ( /read-qstn/.test(hash)) {
                id = hash.split('-').pop(); // Fetch Question ID from hash
                $('.js-user-answrs').removeClass('all-shwn'); // Do not club a question close to its answers
                QnA.data.answeringSingleQuestion = false;
                $('.js-ask-qstn__btn').closest('.ask-qstn').addClass('collapse'); // Hide ask question form
                $('.js-user-answrs, .js-qstn-answr').hide(); // Hide all the AnswerQues + UserAns divs
                $('.js-qstn-answr[data-question-id=' + id + ']').show(); // show only required AnswerQues
                $('.js-user-answrs[data-question-id=' + id + ']').show(); // show only required UserAns
            } else if ( /ans-qstn/.test(hash)) {
                id = hash.split('-').pop(); // Fetch Question ID from hash
                $('.js-user-answrs').removeClass('all-shwn'); // Do not club a question close to its answers
                QnA.data.answeringSingleQuestion = true;
                $('.js-ask-qstn__btn').closest('.ask-qstn').addClass('collapse'); // Hide ask question form
                $('.js-user-answrs, .js-qstn-answr').hide(); // Hide all the AnswerQues + UserAns divs
                $('.js-qstn-answr[data-question-id=' + id + '] .js-wrt-answr__ttl').hide(); // show only required AnswerQues
                $('.js-qstn-answr[data-question-id=' + id + '], .js-qstn-answr[data-question-id=' + id + '] .js-wrt-answr-form').show(); // show only required AnswerQues and AnswerForm
                $('.answr-next-qstn').show(); // Display option to answer other questions
                if (!/hide-ans/.test(hash)) {
                    $('.js-dsply-answrs').hide();
                    $('.js-user-answrs[data-question-id=' + id + ']').show(); // show all the UserAns divs for that question if 'hide-ans' is not in hash
                } else {
                    $('.js-dsply-answrs').show();
                }
            } else
            */
            if (/ans-qstn/.test(hash)) {
                var q_id = $(".wrt-answr__ttl").data("qid");
                (getCookie('msp_uid') % 2) ?
                openPopup("/review/qna/popup/answer_question.php?source=desktop_q_single&q_id=" + q_id):
                    openPopup("/review/qna/popup/fb_answer_question.php?source=desktop_q_single&q_id=" + q_id);
                //openPopup("/review/qna/popup/answer_question.php?source=desktop_q_single&q_id="+q_id);
                $(".popup-overlay") && $(".popup-overlay").addClass("noclose");
                $(".popup-closebutton").on("click", function() {
                    //window.location.hash = '';
                });
            }
        } else {
            /*
            // No hash condition: (Show all questions and answers):
            QnA.data.answeringSingleQuestion = false;
            $('.js-user-answrs').addClass('all-shwn'); // show question and its answers as one
            $('.js-user-answrs, .js-qstn-answr').show(); // Show all the AnswerQues + UserAns divs
            $('.js-qstn-answr .js-wrt-answr__ttl').show(); // show button/link to open an answer form
            $('.js-qstn-answr .js-wrt-answr-form').hide(); // hide the answer forms themselves
            */
        }
    },
    addAndSortQuestions: function() { // sorts questions on page from least answered to most answered.
        // Should be called on load to fetch all questions for a product at one time.
        // MUST BE CALLED after hashHandler() function.
        var hash = window.location.hash,
            id = false;
        if (QnA.data.answeringSingleQuestion) {
            id = +hash.split('-').pop();
        }
        $('.qstn-answr').each(function() {
            var questionId = +$(this).data('question-id'),
                answerCount = $('.user-answrs[data-question-id=' + questionId + '] .user-answrs__answr').length;
            // If currently viewing one particular question,
            // Do not add it to the list of least answered questions (We don't want to see it again).
            if (id !== questionId) {
                QnA.data.leastAnsweredQuestionsList.push({
                    questionId: questionId,
                    numAnswers: answerCount
                });
            }
        });
        QnA.data.leastAnsweredQuestionsList.sort(function(q1, q2) {
            return q1.numAnswers - q2.numAnswers;
        });
    },
    init: function() {
        /* Initial Hash Trigger (On Load): */
        QnA.hashHandler(window.location.hash);
        /* Make a list of all questions and sort them (ONE time operation - on load) */
        QnA.addAndSortQuestions(); // MUST COME AFTER hashHandler function (on load).

        /* Hash change on user action: */
        $(window).on('hashchange', function() {
            QnA.hashHandler(window.location.hash);
        });

        /* Prefill data functions: */
        QnA.prefillEmail();

        /* Puting random numbers in upvote, downvote and follow */
        $(".upvt").each(function(index) {
            //fetching numbers from backend for now.
            //$(this).html(QnA.generalFunctions.randomInt(20, 40));
            //$($(".dwnvt")[index]).html(QnA.generalFunctions.randomInt(0, 20));
            //$($(".js-qstn-answr__flw__count")[index]).html(QnA.generalFunctions.randomInt(10, 100));

        });

        /* Event Handlers for showing/hiding: */
        $('.js-ask-qstn__btn').on('click', function(e) {
            e.preventDefault();
            //QnA.eventFunctions.showQuestionForm($(this));

            window.ga && ga('send', 'event', "QNA", "click", "ask-qstn");
        });

        $(".js-qstn-answr__flw").on('click', function() {
            QnA.eventFunctions.followQuestion($(this));
        });

        $('.js-wrt-answr__ttl').on('click', function() {
            //QnA.eventFunctions.showAnswerForm($(this));

            window.ga && ga('send', 'event', "QNA", "click", "write-ans");
        });

        $('.js-dsply-answrs').on('click', function(e) {
            e.preventDefault();
            QnA.eventFunctions.viewAllAnswers($(this));
        });

        $('.js-next-qstn-link').on('click', function(e) {
            e.preventDefault();
            QnA.eventFunctions.gotoNextQuestion($(this));
        });

        /* Form submit & Ajax handlers: */
        $(".js-ask-qstn__submit").on("click", function(e) {
            e.preventDefault();
            var emailInput = $('.ask-qstn-form__ttl').val(),
                $emailError = $('.ask-qstn__ttl-err'),
                quesInput = $('.ask-qstn-form__desc').val(),
                $quesError = $('.ask-qstn-form__desc-err'),
                $successDiv = $('.ask-qstn__scs');

            if (!QnA.inputHandler.email(emailInput, $emailError) ||
                !QnA.inputHandler.text(quesInput, $quesError)) {
                return;
            }
            QnA.setEmailCookie(emailInput);
            QnA.ajaxFunctions.submitQuestion(emailInput, quesInput, $successDiv);
        });

        $('.js-wrt-answr-form__sbmt').on('click', function(e) {
            e.preventDefault();
            var $this = $(this),
                emailInput = $this.closest('.wrt-answr-form').find('.wrt-answr-form__eml').val(),
                $emailError = $this.closest('.wrt-answr-form').find('.wrt-answr-form__eml-error').slideDown(),
                ansInput = $this.closest('.wrt-answr-form').find('.wrt-answr-form__desc').val(),
                $ansError = $this.closest('.wrt-answr-form').find('.wrt-answr-form__desc-error').slideDown(),
                questionId = $this.closest('.qstn-answr').data('question-id');

            if (!QnA.inputHandler.email(emailInput, $emailError) ||
                !QnA.inputHandler.text(ansInput, $ansError)) {
                return;
            }
            QnA.setEmailCookie(emailInput);
            QnA.ajaxFunctions.submitAnswer(emailInput, ansInput, questionId);
        });

        $(".js-qsnt-upvt").on('click', function() {
            QnA.eventFunctions.upvoteQuestion($(this));
        });
        $('.qstn-vote .upvt').on('click', function() {
            QnA.eventFunctions.upvoteQuestion($(this));
        });
        $('.qstn-vote .dwnvt').on('click', function() {
            QnA.eventFunctions.downvoteQuestion($(this));
        });

        $('.answr-vote .upvt').on('click', function() {
            QnA.eventFunctions.upvoteAnswer($(this));
        });
        $('.answr-vote .dwnvt').on('click', function() {
            QnA.eventFunctions.downvoteAnswer($(this));
        });

        $(".js-ask-qstn__view-all-qstn--href").on("click", function() {
            window.ga && ga('send', 'event', "QNA", "click", "read-more-questions");
        });
        //View all ques btn on single page
        $(".ask-qstn__view-all-qstn__inr").on("click", function() {
            window.ga && ga('send', 'event', "QNA", "click", "viewall-ques-goto-list");
        });
        //Back to product link
        $(".ask-qstn__rtrn--href").on("click", function() {
            window.ga && ga('send', 'event', "QNA", "click", "back-to-pdp");
        });
    }
};

$doc.ready(function() {
    if ($(".usr-rvw-form--sngl").length) {

        // this class is being added from php
        // if the msp uid is even
        if ($(".usr-rvw-form__ttl-wrpr-vsbl").length > 0) {
            window.ga && ga('send', 'event', "user-review", "landing", "title-visible");
        } else {
            window.ga && ga('send', 'event', "user-review", "landing", "title-hidden");
        }

        var ratingWidth = $(".usr-rvw-form__rtng-wrpr .rtng-star").width(),
            $ratingInr = $(".usr-rvw-form__rtng-wrpr .rtng-star__inr"),
            $ratingRemark = $(".usr-rvw-form__rtng-rmrk"),
            remarksList = $ratingRemark.data("remarks").split(","),
            $ratingInput = $(".usr-rvw-form__rtng-inpt");
        isUserDetailsDisplayed = false;

        if (window.qS && qS.rating) {
            var inrWidth = parseInt(qS.rating) * 20,
                rating = parseInt(qS.rating) || 1,
                remarks = ["Terrible", "Bad", "Average", "Good", "Excellent"];

            $ratingRemark.data("remark", remarks[rating - 1]);
            $ratingInput.val(rating);
            $ratingInr.data("width", inrWidth).addClass("rtng-star__inr--rated");
            $ratingInr.width((rating * 20) + "%");
            $ratingRemark.text(remarks[rating - 1]);

            setTimeout(function() {
                $(".usr-rvw-form__desc-wrpr").slideDown("fast");
                $(".usr-rvw-form__submit").slideDown("fast");
            }, 500)
            // enlargeCompressRating(false);
        }

        $doc.on("keyup", ".js-usr-rvw__desc", function(e) {
            if (e.target.value.trim().length > 0) {
                if ($(".usr-rvw-form__ttl-wrpr-vsbl").length === 0) {
                    $(this).closest(".usr-rvw-form--sngl").find(".usr-rvw-form__ttl-wrpr").slideDown("fast");
                }
                // enlargeCompressRating(false);
            } else {
                if ($(".usr-rvw-form__ttl-wrpr-vsbl").length === 0) {
                    $(this).closest(".usr-rvw-form--sngl").find(".usr-rvw-form__ttl-wrpr").slideUp("fast");
                }
                // enlargeCompressRating(true);
            }
        });

        $doc.on("mousemove", ".usr-rvw-form__rtng-wrpr .rtng-star", function(e) {
            var offsetX = parseInt(e.pageX - $(this).offset().left, 10),
                rating = Math.ceil((offsetX / ratingWidth) * 5) || 1;

            $ratingRemark.text(remarksList[rating - 1]);
            if (offsetX <= ratingWidth) {
                $ratingInr.width((rating * 20) + "%");
            }
        });

        $doc.on("click", ".usr-rvw-form__rtng-wrpr .rtng-star", function() {
            var inrWidth = $ratingInr.width(),
                rating = Math.ceil((inrWidth / ratingWidth) * 5) || 1;

            $ratingRemark.data("remark", $ratingRemark.text());
            $ratingInput.val(rating);
            $ratingInr.data("width", inrWidth).addClass("rtng-star__inr--rated");

            $(".usr-rvw-form__desc-wrpr").slideDown("fast");
            $(".usr-rvw-form__submit").slideDown("fast");

            // enlargeCompressRating(false);
        });

        $doc.on("mouseleave", ".usr-rvw-form__rtng-wrpr .rtng-star", function() {
            if ($ratingInr.hasClass("rtng-star__inr--rated")) {
                $ratingRemark.text($ratingRemark.data("remark"));
                $ratingInr.width($ratingInr.data("width"));
            } else {
                $ratingInr.width(0);
                $ratingRemark.empty();
            }
        });

        $doc.on("submit", ".usr-rvw-form--sngl", function() {
            MSP.utils.validate.form([{
                "type": "rating",
                "inputField": $(".usr-rvw-form__rtng-inpt"),
                "errorNode": $(".usr-rvw-form__rtng-err")
            }, {
                "type": "text",
                "inputField": $(".usr-rvw-form__ttl"),
                "errorNode": $(".usr-rvw-form__ttl-err"),
                "options": { "min": 1 }
            }, {
                "type": "required",
                "inputField": $(".usr-rvw-form__desc"),
                "errorNode": $(".usr-rvw-form__desc-err"),
                "options": { "min": 1 }
            }]).done(function() {
                var rating = $(".usr-rvw-form__rtng-inpt").val(),
                    title = $(".usr-rvw-form__ttl").val(),
                    details = $(".usr-rvw-form__desc").val(),
                    errorMessage = "There was a problem submitting your review. Please try again.",
                    email_id = "",
                    mspLoginEmail = getCookie("msp_login_email");

                if (false && getCookie("msp_login_email") && getCookie("msp_login")) {
                    var submit_api = "/msp/review/save_a_review.php";
                } else {
                    var submit_api = "/msp/review/save_review_basic.php";
                }

                // 1st priority: User Email Query String
                if (window.qS && qS.user) {
                    try {
                        email_id = atob(qS.user); // throws error if unsuccessful
                        doAjax(true);
                    } catch (e) {
                        // Error in reading QS email: (Check for email cookie instead first)
                        if (mspLoginEmail) {
                            email_id = mspLoginEmail;
                            doAjax(true);
                        } else {
                            loginFetchEmail.call(this);
                        }
                    }
                } else if (mspLoginEmail) { // 2nd priority: MSP Login Email Cookie
                    email_id = mspLoginEmail;
                    doAjax(true);
                } else {
                    loginFetchEmail.call(this);
                }

                /*******************/

                function loginFetchEmail() {
                    loginCallback(doAjax, this, [false]);
                }

                function doAjax(qsEmailExists) {
                    if (!qsEmailExists) email_id = getCookie('msp_login_email');

                    $.ajax({
                        type: "POST",
                        url: submit_api,
                        data: {
                            "mspid": qS.mspid,
                            "title": title,
                            "details": details,
                            "rating_review": rating,
                            "email_id": email_id,
                            "source": 'desktop'
                        }
                    }).done(function(response) {
                        response = JSON.parse(response);
                        if (response.success == 1) {
                            $(".sctn__hdr").hide();
                            $(".usr-rvw-prdct").addClass("usr-rvw-prdct__scs");
                            $(".usr-rvw-form--sngl").hide();
                            $(".usr-rvw-form__wrpr").hide();
                            $(".usr-wrt-rvw__scs").fadeIn();
                            $(".usr-rvw-form").data("submitted", true);
                            $(".usr-wrt-rvw__scs-desc").after($(".usr-rvw-form--sngl").html());
                            $(".usr-rvw-form__rtng-lbl").text("You rated");

                            if ($(".usr-rvw-form__ttl-wrpr-vsbl").length > 0) {
                                window.ga && ga('send', 'event', "user-review", "submit", "title-visible");
                            } else {
                                window.ga && ga('send', 'event', "user-review", "submit", "title-hidden");
                            }

                        } else {
                            alert(errorMessage);
                        }
                    }).fail(function() {
                        alert(errorMessage);
                    });
                }
            });
            return false;
        });

        function enlargeCompressRating(enlargeCompress) {
            if (enlargeCompress) {
                $(".usr-rvw-prdct").addClass("usr-rvw-prdct--xl");
                $ratingInr.width($ratingInr.width() * 2);
            } else {
                $(".usr-rvw-prdct").removeClass("usr-rvw-prdct--xl");
                $ratingInr.width($ratingInr.width() / 2);
            }

            ratingWidth = $(".usr-rvw-form__rtng-wrpr .rtng-star").width();
        }
    }
});

$(document).ready(function() {
    /* Initialize QnA Page functionality: */
    QnA.init();

    $doc.on("click", ".js-user-answr__more-answr", function() {
        var state = $(this).data("state"),
            question_id = $(this).parents(".js-user-answrs").data("question-id"),
            answers_count = $(this).parents(".js-qstn-answr").data("ans-count"),
            moreAnswr = "More Answers (" + (parseInt(answers_count, 10) - 1) + ")";
        if (state === "collapsed") {
            $(this).text("Collapse Answers").data("state", "opened");
            if (parseInt(answers_count) > 10)
                $(this).before('<a class="user-answr__all-answrs js-all-answrs" href="single.php?q_id=' + question_id + '" target="_blank">Show all answers (' + answers_count + ')</a>');
            window.ga && ga('send', 'event', "QNA", "click", "read-more-answers");
        } else {

            $(this).text(moreAnswr).data("state", "collapsed");
            // $(this).parent().find(".js-answr-qstn").remove();
            $(this).parent().find(".js-all-answrs").remove();
            window.ga && ga('send', 'event', "QNA", "click", "collapse-more-answers");
        }
        $(this).toggleClass("qna__more-answr--opnd");
        $(this).parent().parent().find(".user-answrs__answr").toggleClass("user-answrs__answr--show");
    });

    $doc.on("submit", ".js-ask-qstn__frm", function() {
        $(".js-ask-qstn").click();
        return false;
    });

    $(".js-qstn-txt").on("focus", function() {
        $(".qna__ask-wrpr, .ask-qstn__ask-wrpr").css("border-color", "#999");
    }).on("blur", function() {
        $(".qna__ask-wrpr, .ask-qstn__ask-wrpr").css("border-color", "#bbb");
    });
});
//When coming for answer ackg email to asker.Clicks on say thanks btn.
if (qS && qS.ref === "email") {
    openPopup("/review/qna/popup/thankyou.html");
}

function validInput(e) {
    var searchText = $('.js-qstn-txt').val().length;
    if (!searchText) {
        $(".qna__ask-wrpr").addClass("qna__ask-wrpr-err");
        $(".js-qna__srch-kywrds").hide();
        $(".qna__ask-wrpr-msg").show();
        $(".ask-qstn__ask-wrpr").addClass("ask-qstn__ask-wrpr-err");
        $(".ask-qstn__ask-wrpr-msg").show();
        return false;
    } else {
        return true;
    }
}

$('body').on('click', '.js-ask-qstn', function(e) {
    if (!validInput(e)) {
        return false;
    }
});

$doc.on("keyup", ".js-qstn-txt", function() {
    console.log($(this).val().length);
    var queryLength = $(this).val().length;
    $(".qna__ask-wrpr").removeClass("qna__ask-wrpr-err");
    $(".qna__ask-wrpr-msg").hide();
    $(".js-qna__srch-kywrds").show();
    $(".ask-qstn__ask-wrpr").removeClass("ask-qstn__ask-wrpr-err");
    $(".ask-qstn__ask-wrpr-msg").hide();
});

function logLoginPageEvents(action, label) {
    window.ga && ga('send', 'event', 'DesktopLoginPage', action, label);
}

    (function() {
	if(window.location.href.indexOf("/users/login.php")>-1 || window.location.href.indexOf("/users/signup.php")>-1){
        	var msp_login_email = getCookie("msp_login_email");
        	if(msp_login_email) {
         		$(".js-signup__email").val(msp_login_email);
        	}
        	MSP.login.fb_init();
	}
    })();
