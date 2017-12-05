(function (root) {

    "use strict";

    /**
     * Common object params
     * @type {Object}
     */
    var common = {
            publicMethods: ['open', 'close', 'setPosition', 'getHandle'],
            className: 'JsSplash'
        },

        /**
         * Main constructor
         * @param {string} html - inner html
         * @param {object} [options] - custom settings
         * @return {function} [callback] - callback function
         */
        Protected = function (html, options, callback) {

            var n;

            if (!callback && typeof options === 'function') {
                callback = options;
                options = {};
            }

            this.html = html || '';
            this.callback = callback || null;

            this.settings = {
                closeBtn: true,             //view close button
                closeOutClick: true,        //close the window by clicking outside of it
                closeToEscape: true,        //close the window by push escape key
                cssClass: null,             //custom CSS class string
                closeCallback: null,        //callback function after close splash
                fullscreen: false,          //fullscreen mode,
                removeTimeout: 240,          //timeout for remove splash after close.
                autoClose: 0,
                modal: false
            };

            //apply options to settings 
            if (options) {
                for (n in options) {
                    if (options.hasOwnProperty(n)) {
                        this.settings[n] = options[n];
                    }
                }
            }

            //services classes
            this.cssClasses = {
                viewport: 'jsplash-viewport',
                wrapper: 'jsplash-wrapper',
                inner: 'jsplash-inner',
                closeBtn: 'jsplash-closebtn',
                visible: 'jsplash-visible',
                fullscreen: 'jsplash-fullscreen',
                blured: '-jsplash-blured'
            };

            this.settings.cssClass = (this.settings.cssClass) ? ' ' + this.settings.cssClass : '';

            if (this.settings.modal) {
                this.settings.closeBtn = false;
                this.settings.closeOutClick = false;
                this.settings.closeToEscape = false;
            }

            //show splash
            this.open();

            return this;
        };


    /**
     * Main prototype
     * @type {Object}
     */
    Protected.prototype = {

        createSplash: function () {

            var self = this;

            //create viewport
            this.viewport = document.createElement('div');
            this.viewport.setAttribute('class', this.cssClasses.viewport + this.settings.cssClass);

            //create splash box
            this.splashWrapper = document.createElement('div');
            this.splashWrapper.setAttribute('class', this.cssClasses.wrapper + this.settings.cssClass);

            //create splash
            this.splashInner = document.createElement('div');
            this.splashInner.setAttribute('class', this.cssClasses.inner + this.settings.cssClass);

            //if fullscreen
            this.settings.fullscreen && (this.splashWrapper.classList.add(this.cssClasses.fullscreen));

            //create viewport close button
            if (this.settings.closeBtn) {
                this.closeBtn = document.createElement('div');
                this.closeBtn.setAttribute('class', this.cssClasses.closeBtn + this.settings.cssClass);
                this.splashWrapper.appendChild(this.closeBtn);
            }

            //put html into the splash inner
            this.splashInner.innerHTML = this.html;

            //put splash inner into the wrapper
            this.splashWrapper.appendChild(this.splashInner);

            //put splash box into the viewport
            this.viewport.appendChild(this.splashWrapper);

            //put main viewport into the body
            document.body.appendChild(this.viewport);

            // blured elements collection
            this.bluredCollection = [];

            // set blured css class
            [].forEach.call(this.viewport.parentNode.children, function (elem) {

                if ((elem !== self.viewport) && !elem.classList.contains(self.cssClasses.blured)) {
                    self.bluredCollection.push(elem);
                    elem.classList.add(self.cssClasses.blured);
                }
            });
        },

        removeSplash: function () {

            this.splashInner.parentNode && (this.splashInner.parentNode.removeChild(this.splashInner));
            this.splashWrapper.parentNode && (this.splashWrapper.parentNode.removeChild(this.splashWrapper));
            this.viewport.parentNode && (this.viewport.parentNode.removeChild(this.viewport));
        },

        close: function () {
            
            var self = this;

            this.settings.fullscreen && (document.body.style.overflow = '');

            this.viewport.classList.remove(this.cssClasses.visible);

            this.removeSplash = this.removeSplash.bind(this);

            [].forEach.call(this.bluredCollection, function (elem) {
                elem.classList.remove(self.cssClasses.blured);
            });

            window.removeEventListener('resize', this.setPosition);
            this.settings.closeToEscape && document.removeEventListener('keyup', this.closeToEscape);
            this.settings.closeCallback && this.settings.closeCallback();

            setTimeout(this.removeSplash, this.settings.removeTimeout);
        },

        closeToEscape: function (event) {
            event.keyCode && (event.keyCode === 27) && this.close.call(this);
        },

        open: function () {

            var self = this;

            this.settings.fullscreen && (document.body.style.overflow = 'hidden');

            //create splash
            this.createSplash();

            //bind to this context
            this.setPosition = this.setPosition.bind(this);

            this.close = this.close.bind(this);
            this.closeToEscape = this.closeToEscape.bind(this);

            //resize window event
            window.addEventListener('resize', this.setPosition);


            //close events (click on viewport)
            if (this.settings.closeOutClick || this.settings.closeBtn) {

                //click on viewport event
                this.viewport.addEventListener('click', function (e) {
                    
                    //close out click
                    if (self.settings.closeOutClick && e.target === self.viewport) {
                        self.close.call(self);
                        return;
                    }

                    //close on close button click
                    if (self.settings.closeBtn && e.target === self.closeBtn) {
                        self.close.call(self);
                        return;
                    }

                });
            }


            //escape event
            this.settings.closeToEscape && document.addEventListener('keyup', this.closeToEscape);

            

       
            //set center positionfor splash box
            this.setPosition.call(this);

            //show viewport
            this.viewport.classList.add(this.cssClasses.visible);

            //set center positionfor splash box
            this.setPosition.call(this);    
  

            

            //auto close
            !!this.settings.autoClose && setTimeout(this.close, this.settings.autoClose);

            //callback
            this.callback && this.callback();
            
        },

        getHandle: function () {
            return this.splashWrapper;
        },

        setPosition: function () {

            var computedStyles,
                windowAspect,
                windowPadding = 10;

            this.splashWrapper.style.height = '';
            this.splashWrapper.style.width = '';

            windowAspect = (window.innerWidth) ? {width: window.innerWidth, height: window.innerHeight} : {width: document.body.clientWidth,height: document.body.clientHeight};
            computedStyles = getComputedStyle(this.splashWrapper);

            //if splash > window height
            if (windowAspect.height < Math.max(this.splashWrapper.offsetHeight, this.splashWrapper.offsetHeight + parseInt(computedStyles.marginTop, 10) + parseInt(computedStyles.marginBottom, 10))) {
                this.splashWrapper.style.height = (windowAspect.height - (parseInt(computedStyles.paddingTop, 10) + parseInt(computedStyles.paddingBottom, 10)) - (windowPadding * 2)) + 'px';
            }

            //if splash > window width
            if (windowAspect.width < Math.max(this.splashWrapper.offsetWidth, this.splashWrapper.offsetWidth + parseInt(computedStyles.marginLeft, 10) + parseInt(computedStyles.marginRight, 10))) {
                this.splashWrapper.style.width = (windowAspect.width - (parseInt(computedStyles.paddingLeft, 10) + parseInt(computedStyles.paddingRight, 10)) - (windowPadding * 2)) + 'px';
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