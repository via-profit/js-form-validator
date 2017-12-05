/**
* Js page Scroller
*/
(function (root) {

    "use strict";

    /**
     * Common object params
     * @type {Object}
     */
    var common = {
            publicMethods: ['scrollTo'],
            className: 'JsScroller'
        },

        /**
         * Main constructor
         * @return {Object} - this handle
         */
        Protected = function (options) {

            //main settings
            this.settings = {
                container: document,
                offset: 0,
                speed: 10,
                stopOnClick: true,
                stopOnWheel: true,
                anchors: true
            };

            //action flag
            this.action = false;

            //set options
            if (options) {

                var n;

                for (n in options) {
                    if (options.hasOwnProperty(n)) {
                        this.settings[n] = options[n];
                    }
                }
            }

            //initialization
            this.init();

            return this;
        };


    /**
     * Main prototype
     * @type {Object}
     */
    Protected.prototype = {

        init: function () {

            var self = this;

            window.addEventListener('DOMContentLoaded', function () {

                //stop scroll if event
                if (self.settings.stopOnClick) {
                    document.body.addEventListener('click', self.stopScroll.bind(self));
                }

                if (self.settings.stopOnWheel) {
                    window.addEventListener('mousewheel', self.stopScroll.bind(self));
                    window.addEventListener('wheel', self.stopScroll.bind(self));
                }

                if (self.settings.anchors) {

                    var clickFn,
                        links = document.querySelectorAll('a'),
                        linksLength = links.length,
                        link,
                        i;

                    clickFn = function (link) {
                        link.addEventListener('click', function (e) {
                            e.preventDefault();

                            var allLinks = document.querySelectorAll('a'),
                                allLinksLength = allLinks.length,
                                iterator;

                            for (iterator = 0; iterator < allLinksLength; iterator += 1) {

                                if (allLinks[iterator].name === this.hash.substr(1)) {
                                    self.scrollTo(allLinks[iterator]);
                                }
                            }
                        });
                    };

                    for (i = 0; i < linksLength; i += 1) {

                        link = links[i];

                        if (link.href && link.href.indexOf('#') !== -1 && ((link.pathname === location.pathname) || ('/' + link.pathname === location.pathname))) {
                            clickFn(link);
                        }
                    }
                }
            });
        },





        scrollTo: function (selector, speed) {

            speed = speed || this.settings.speed;

            var offset = 0;

            switch (typeof selector) {

                case 'string':
                    
                    if (selector.match(/^[0-9\.]+$/gmi)) {
                        return this.scrollTo(parseFloat(selector), speed);
                    }

                    selector = document.querySelector(selector);

                break;
                
                case 'number':
                    offset = selector;
                break;

                default:
                break;
            }


            if (!selector) {
                return false;
            }

            if (!offset) {
                
                offset = selector.offsetTop + this.settings.offset;

                //if selector have parent
                if (selector.offsetParent) {
                    while (selector.offsetParent) {
                        selector = selector.offsetParent;
                        offset += selector.offsetTop;
                    }
                }
            }

            return this.scrollByOffset(offset, speed);
        },

        scrollByOffset: function (offsetY, speed) {
           
            speed = speed || this.settings.speed;

            var self = this,
                offset = offsetY + this.settings.offset,
                windowHeight = (this.settings.container === document) ? (window.innerHeight || document.documentElement.clientHeight) : this.settings.container.clientHeight,
                scrollHeight = (this.settings.container === document) ? document.body.scrollHeight : this.settings.container.scrollHeight,
                offsetTop    = (this.settings.container === document) ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : this.settings.container.scrollTop,
                currentOffsetTop = 0;

            //stop scroll
            this.stopScroll();


            //start scroll
            this.interval = setInterval(function () {

                //flag action
                self.action = true;

                //recalculate offsetTop
                if (offset > offsetTop) {

                    if ((scrollHeight - offset) > windowHeight) {
                        offsetTop += Math.ceil((offset - offsetTop) / speed);

                    } else {
                        offsetTop += Math.ceil((offset - offsetTop - (scrollHeight - offset)) / speed);
                    }

                } else {
                    offsetTop = offsetTop + (offset - offsetTop) / speed;
                }

                (self.settings.container === document) ? window.scrollTo(0, offsetTop) : (self.settings.container.scrollTop = offsetTop);

                if (Math.round(offsetTop) === Math.round(offset) || Math.round(currentOffsetTop) === Math.round(offsetTop)) {
                    self.stopScroll();
                }

                currentOffsetTop = offsetTop;

            }, 10);
        },






        stopScroll: function () {

            if (this.action) {
                clearInterval(this.interval);
                this.action = false;
            }
        }
    };

    /**
     * Encapsulation
     * @return {Object} - this handle
     */
    root[common.className] = function () {

        function construct(constructor, args) {

            function Class() {
                return constructor.apply(this, args);
            }
            Class.prototype = constructor.prototype;
            return new Class();
        }

        var original = construct(Protected, arguments),
            Publicly = function () {};
        
        Publicly.prototype = {};
        Array.prototype.forEach.call(common.publicMethods, function (member) {
            Publicly.prototype[member] = function () {
                return original[member].apply(original, arguments);
            };
        });

        return new Publicly(arguments);
    };

}(this));