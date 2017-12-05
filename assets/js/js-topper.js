(function (root) {

    "use strict";

    /**
     * Common object params
     * @type {Object}
     */
    var common = {
            publicMethods: [],
            className: 'JsTopper'
        },

        /**
         * Main constructor
         * @return {Object} - this handle
         */
        Protected = function (selector, options) {

            var self = this;

            this.settings = {
                container: document.body,
                stickCssClass: 'stick',
                visibleCssClass: 'stick-visible',
                stickTop: 0,
                stickStartOffsetTop: 'auto'
            };


            
            

            
            
            this.scrollAction = this.scrollAction.bind(this);
            this.reload = this.reload.bind(this);
            this.init(selector, options);

            


            

            this.scrollAction.call(this);
            
            return this;

        };


    /**
     * Main prototype
     * @type {Object}
     */
    Protected.prototype = {


        scrollAction: function () {

            var self = this,
                elem = this.selector,
                container = this.settings.container,
                ghostRect = this.ghost.getBoundingClientRect(),
                containerStyles = (container === document.body) ? {} : getComputedStyle(container),
                scrollTop = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
                offset = this.settings.stickTop - ((this.settings.stickStartOffsetTop !== 'auto') ? this.settings.stickStartOffsetTop : 0),
                left,
                step;

            if (container !== document.body) {
                
                step = function () {
                    elem.style.top = (container.scrollTop + self.settings.stickTop) + 'px';
                }
            }

            if (scrollTop > this.settings.stickStartOffsetTop) {

                left = ghostRect.left + container.scrollLeft;

                if (container !== document.body) {
                    left -= parseInt(containerStyles.left, 10) - parseInt(containerStyles.marginLeft, 10) - parseInt(this.selectorStyles.marginLeft, 10);
                    requestAnimationFrame(step);
                }

                this.ghost.style.height = this.capHeight + 'px';
                elem.classList.add(this.settings.stickCssClass);
                elem.classList.add(this.id);

                setTimeout(function () {
                    elem.classList.add(self.settings.visibleCssClass);
                }, 10);

            } else {
                this.ghost.style.height = 0;
                elem.classList.remove(self.settings.visibleCssClass);
                elem.classList.remove(this.settings.stickCssClass);
                elem.classList.remove(this.id);

                (container !== document.body) && (elem.style.top = '');
            }
        },

        init: function (selector, options) {
            
            var self = this;
           


            this.selector = (typeof selector === 'string') ? document.querySelector(selector) : selector;


            //set options
            if (options) {

                var n;

                for (n in options) {
                    if (options.hasOwnProperty(n)) {
                        this.settings[n] = options[n];
                    }
                }
            }

            if (this.settings.container !== document.body) {
                this.settings.container.addEventListener('scroll', this.scrollAction);
            } else {
                window.addEventListener('scroll', this.scrollAction);
            }


            window.addEventListener('resize', this.reload);



            this.id = '-stick-' + (Math.floor(Math.random() * 999)).toString();
            this.selectorStyles = getComputedStyle(this.selector);
            this.ghost = document.createElement('div');
            this.selector.parentNode.insertBefore(this.ghost, this.selector);

            [].forEach.call(['position', 'width', 'float', 'top', 'left', 'right', 'bottom', 'margin', 'padding', 'display'], function (prop) {
                self.ghost.style[prop] = self.selectorStyles[prop];
            });

            this.ghost.style.width = this.selector.clientWidth + parseInt(this.selectorStyles.paddingLeft, 10) + parseInt(this.selectorStyles.paddingRight, 10) + 'px';
            this.ghost.style.height = 0;


            // set styles
            var sheet = window.document.styleSheets[0],
                width = this.selector.clientWidth + parseInt(this.selectorStyles.paddingLeft, 10) + parseInt(this.selectorStyles.paddingRight, 10),
                height = this.selector.clientHeight + parseInt(this.selectorStyles.paddingTop, 10) + parseInt(this.selectorStyles.paddingBottom, 10);


            this.ruleSetIndex = sheet.insertRule('.' + this.id + '{position:fixed!important;' + ((this.settings.container === document.body) ? 'top:' + this.settings.stickTop + 'px!important;' : '') + 'z-index:100!important;width:' + width + 'px!important;min-height:' + height + 'px!important}', sheet.cssRules ? sheet.cssRules.length : 0);




            this.capHeight = this.selector.getBoundingClientRect().height;

            this.settings.container = (typeof this.settings.container === 'string') ? document.querySelector(this.settings.container) : this.settings.container;
       
            this.scrollAction.call(this);

        },

        destroy: function () {

            if (this.settings.container !== document.body) {
                this.settings.container.removeEventListener('scroll', this.scrollAction);
            } else {
                window.removeEventListener('scroll', this.scrollAction);
            }
            window.removeEventListener('resize', this.reload);
            this.ghost.parentNode.removeChild(this.ghost);
            this.selector.classList.remove(this.id);
            this.selector.classList.remove(this.settings.stickCssClass);
            this.selector.classList.remove(this.settings.visibleCssClass);
        },

        reload: function () {
            this.destroy();
            this.init(this.selector, this.settings);
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