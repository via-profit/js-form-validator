/**
* Simple Encapsulation Class template
*/
(function (root) {

    "use strict";

    /**
     * Common object params
     * @type {Object}
     */
    var common = {
            publicMethods: ['getProvidersList', 'getCounter', 'share'],
            className: 'JsSocnet'
        },

        /**
         * Main constructor
         * @return {Object} - this handle
         */
        Protected = function (url) {

            if (/msie/.test(navigator.userAgent.toLowerCase()) && parseFloat((navigator.userAgent.toLowerCase().match(/.*(?:rv|ie)[\/: ](.+?)([ \);]|$)/) || [])[1]) < 10) {
                return;
            }

            this.providers = {
                vkontakte: {
                    counterUrl: 'https://vk.com/share.php?act=count&url={url}&index={index}',
                    popupUrl: '{protocol}//vk.com/share.php?url={url}',
                    type: 'script',
                    getCount: function (data, callback) {
                        root.VK = root.VK || {Share: {}};
                        root.VK.Share.count = function (index, count) {
                            callback && callback(parseInt(count, 10));
                        }
                    }
                },
                facebook: {
                    counterUrl: 'https://graph.facebook.com/fql?q=SELECT%20total_count%20FROM%20link_stat%20WHERE%20url="{url}"&format=json',
                    popupUrl: 'https://www.facebook.com/sharer/sharer.php?u={url}',
                    type: 'get',
                    getCount: function (data, callback) {
                        data && callback && callback(parseInt(data.data[0].total_count, 10));
                    }
                },
                twitter: {
                    counterUrl: 'https://cdn.api.twitter.com/1/urls/count.json?url={url}&callback={callback}',
                    popupUrl: 'https://twitter.com/intent/tweet?url={url}',
                    type: 'script',
                    getCount: function (data, callback) {
                        data && callback && callback(parseInt(data.count, 10));
                    }
                },
                mailru: {
                    counterUrl: '{protocol}//connect.mail.ru/share_count?url_list={url}&callback=1&func={callback}',
                    popupUrl: '{protocol}//connect.mail.ru/share?share_url={url}&title={title}',
                    type: 'script',
                    getCount: function (data, callback) {
                        
                        var url;

                        if (data && typeof data === 'object') {

                            if (!Object.getOwnPropertyNames(data).length) {
                                callback && callback(0);
                                return;
                            }

                            for (url in data) {
                                if (data.hasOwnProperty(url)) {
                                    callback && callback(parseInt(data[url].shares, 10));
                                }
                            }
                        }
                    }
                },
                odnoklassniki: {
                    counterUrl: 'https://ok.ru/dk?st.cmd=extLike&uid=odklcnt0&ref={url}',
                    popupUrl: 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}',
                    type: 'script',
                    getCount: function (data, callback) {
                        root.ODKL = root.ODKL || {};
                        root.ODKL.updateCount = function (index, count) {
                            callback && callback(parseInt(count, 10));
                        }
                    }
                },
                pinterest: {
                    counterUrl: '{protocol}//api.pinterest.com/v1/urls/count.json?url={url}&callback={callback}',
                    popupUrl: '{protocol}//pinterest.com/pin/create/button/?url={url}&description={title}&media={image}',
                    type: 'script',
                    getCount: function (data, callback) {
                        data && callback && callback(parseInt(data.count, 10));
                    }
                },
                linkedin: {
                    counterUrl: 'https://www.linkedin.com/countserv/count/share?url={url}',
                    popupUrl: 'https://www.linkedin.com/shareArticle?mini=true&url={url}&title={title}',
                    type: 'script',
                    getCount: function (data, callback) {
                        root.IN = root.IN || {Tags: {Share:{}}};
                        root.IN.Tags.Share.handleCount = function (counters) {
                            callback && callback(parseInt(counters.count, 10));
                        }
                    }
                },
                google: {
                    counterUrl: 'https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ',
                    popupUrl: 'https://plus.google.com/share?url={url}',
                    type: 'post',
                    contentType: 'application/json',
                    params: '[{"method":"pos.plusones.get","id":"p","params":{"nolog":true,"id":"{url}","source":"widget","userId":"@viewer","groupId":"@self"},"jsonrpc":"2.0","key":"p","apiVersion":"v1"}]',
                    getCount: function (data, callback) {
                        data && callback && callback(parseInt(data[0].result.metadata.globalCounts.count, 10));
                    }
                },
                reddit: {
                    counterUrl: 'https://www.reddit.com/api/info.json?url={url}',
                    type: 'get',
                    popupUrl: 'https://www.reddit.com/submit?url={url}&title={title}',
                    getCount: function (data, callback) {
                        data && callback && callback((data.data.children.length) ? parseInt(data.data.children[0].data.score, 10) : 0);
                    }
                }
            };



            var p = this.providers;
            this.getProvider = (function () {
                var a = p;
                return function () { 
                    return a;
                }
            }());


            this.protocol = root.location.protocol === 'https:' ? 'https:' : 'http:';

            this.url = url || root.location.href.replace(root.location.hash, '');

            this.combineHtml();
            this.init();


            return this;
        };


    /**
     * Main prototype
     * @type {Object}
     */
    Protected.prototype = {

        init: function () {
            
            var self = this,
                containers = document.querySelectorAll('.js-socnet-buttons'),
                container,
                buttons,
                button,
                provider,
                counter,
                i, l, j, k,
                hasClass = function (element, className) {
                    return (element.classList) ? element.classList.contains(className) : new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
                };

            if (!containers.length) {
                return;
            }

            l = containers.length;
            for (i = 0; i < l; i += 1) {

                container = containers[i];
                buttons = container.querySelectorAll('.js-socnet-button');

                if (buttons.length) {
                    k = buttons.length;

                    for (j = 0; j < k; j += 1) {

                        button = buttons[j];
                        for (provider in this.providers) {

                            if (this.providers.hasOwnProperty(provider) && hasClass(button, provider)) {
                                
                                //set counter
                                counter = button.querySelector('.js-socnet-counter');

                                if (counter) {
                                    
                                    (function (context, providerName, counterElem) {

                                        if (providerName === 'twitter') {
                                            return;
                                        }

                                        context.getCounter(providerName, function (shareCount) {
                                            counterElem.innerHTML = (shareCount > 0) ? shareCount : '';
                                        });

                                    }(self, provider, counter));
                                }


                                (function (context, providerName, buttonElem, counterElem) {

                                    //set click event
                                    buttonElem.addEventListener('click', function (e) {

                                        e.preventDefault();
                                        
                                        //share
                                        self.share(providerName, function () {
                                            
                                            //update counter
                                            if (counterElem) {
                                                setTimeout(function () {
                                                    self.getData(providerName, self.providers[providerName].counterUrl, function (shareCount) {
                                                        counterElem.innerHTML = (shareCount > 0) ? shareCount : '';
                                                    });
                                                }, 10000);
                                            }
                                        });
                                    });

                                }(self, provider, button, counter));
                            }
                        }
                    }
                }
            }
        },

        combineHtml: function () {

            var self = this,
                containers = document.querySelectorAll('.js-socnet-buttons'),
                button,
                buttonInner,
                buttonName,
                buttonCounter,
                i, j, k, l = containers.length;


            if (!l) {
                return;
            }

            for (i = 0; i < l; i += 1) {


                if (containers[i].children.length) {
                    k = containers[i].children.length;

                    for (j = 0; j < k; j += 1) {

                        button = containers[i].children[j];

                        button.classList.add('js-socnet-button');

                        buttonInner = document.createElement('span');
                        buttonInner.setAttribute('class', 'js-socnet-inner');

                        buttonName = document.createElement('span');
                        buttonName.setAttribute('class', 'js-socnet-name');
                        buttonName.innerHTML = button.innerHTML;

                        buttonCounter = document.createElement('span');
                        buttonCounter.setAttribute('class', 'js-socnet-counter');

                        buttonInner.appendChild(buttonName);
                        buttonInner.appendChild(buttonCounter);

                        button.innerHTML = '';
                        button.appendChild(buttonInner);

                    }
                }
            }
        },

        instantProvider: function (provider, callback) {

            var anonimusFnName = '_js_' + provider + root.performance.now().toString().replace(/\./, ''),
                providerObj = this.providers[provider],
                pattern,
                replaces,
                n;

            replaces = {
                '{url}': this.url,
                '{index}': 1,
                '{protocol}': location.protocol === 'https:' ? 'https:' : 'http:',
                '{title}': document.title,
                '{image}': (document.querySelector('img')) ? document.querySelector('img').src : '',
                '{callback}': anonimusFnName
            };

            for (n in providerObj) {
                if (providerObj.hasOwnProperty(n) && typeof providerObj[n] === 'string') {
                    for (pattern in replaces) {
                        if (replaces.hasOwnProperty(pattern)) {
                            providerObj[n] = providerObj[n].replace(pattern, replaces[pattern]);
                        }
                    }
                }
            }


            (function (c, p, cb) {
                root[anonimusFnName] = function (data) {
                    c.removeScript(p);
                    setTimeout(function () {
                        delete root[anonimusFnName];
                    }, 1000);
                    return providerObj.getCount(data, cb);
                };

                root[anonimusFnName].apply(c, [false, cb]);
            }(this, provider, callback));
        },

        getData: function (provider, url, callback) {

            if (this.providers[provider].type && this.providers[provider].type !== 'script') {

                var request = new XMLHttpRequest(),
                    getCountFunc = this.providers[provider].getCount;

                request.open(this.providers[provider].type.toUpperCase(), url, true);
                
                if (this.providers[provider].contentType) {
                    request.setRequestHeader('Content-type', this.providers[provider].contentType);
                }

                request.onload = function() {
                    if (request.status >= 200 && request.status < 400) {
                        getCountFunc(JSON.parse(request.responseText), callback);
                    }
                };

                request.send(this.providers[provider].params);
                return;
            }

            this.instantProvider(provider, callback);

            var node = document.querySelector("script"),
                script = document.createElement('script');

            script.type = 'text/javascript';
            script.async = true;
            script.src = url;
            script.setAttribute('data-js-socnet-provider', provider);

            node.parentNode.insertBefore(script, node);

            
        },

        removeScript: function (provider) {
            if (!this.providers[provider].type || this.providers[provider].type === 'script') {
                var script = document.querySelector('script[data-js-socnet-provider="' + provider + '"]');
                script && script.parentNode.removeChild(script);
            }
        },

        openPopup: function (url, params, callback) {

            if (typeof params === 'function') {
                callback = params;
                params = {};
            }

            params = params || {};

            var n,
                popup,
                self = this,
                interval,
                windowOptions = {
                    width: 600,
                    height: 400,
                    left: 0,
                    top: 0
                };

            windowOptions.left = Math.round((root.screen.width / 2) - (windowOptions.width / 2));
            windowOptions.top = (screen.height > windowOptions.height) ? Math.round((root.screen.height / 3) - (windowOptions.height / 2)): windowOptions.top;

            //apply params
            for (n in params) {
                windowOptions[n] = params[n];
            }

            //try to opent window
            popup = root.open(url, '', 'left=' + windowOptions.left + ',top=' + windowOptions.top + ',' + 'width=' + windowOptions.width + ',height=' + windowOptions.height + ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');

            if (popup) {

                popup.focus();

                interval = root.setInterval(function() {

                    try {
                        if (popup == null || popup.closed) {
                            root.clearInterval(interval);
                            callback.call(self, popup);
                        }
                    } catch (e) {
                        //nop
                    }
                }, 5000);

                return;
            }
        },






        /*
        * ****************
        * PUBLIC METHODS *
        * ****************
        */

        getProvidersList: function () {
            var n,
                retArr = [];

            for (n in this.providers) {
                if (this.providers.hasOwnProperty(n)) {
                    retArr.push(n);
                }
            }

            return retArr;
        },

        getCounter: function (provider, callback) {

            if (provider === 'facebook') {
                return;
            }

            if (!this.providers[provider]) {
                callback && callback(0);
                return false;
            }

            this.instantProvider(provider, callback);
            this.getData(provider, this.providers[provider].counterUrl, callback);

            return true;
        },

        share: function (provider, callback) {

            if (!this.providers[provider]) {
                return false;
            }

            this.instantProvider(provider);

            this.openPopup(this.providers[provider].popupUrl, function () {
                callback && callback.call(this);
            });

            return true;
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

        var publicly = construct(Protected, arguments),
            i,
            l = common.publicMethods.length;

        for (i = 0; i < l; i += 1) {

            (function () {
                var member = common.publicMethods[i];
                root[common.className].prototype[member] = function () {
                    return publicly[member].apply(publicly, arguments);
                };
            }());
        }

        return this;
    };

}(this));