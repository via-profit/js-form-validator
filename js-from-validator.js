(function (root) {

    "use strict";

    var JsFormValidator = function (formHandle, submitCallback, settings) {

        this.settings = {
            onAir: true,
            removeSpaces: false,
            autoHideHelpers: true,
            autoHideErrors: true,
            autoHideErrorsTimeout: 2000,
            showErrors: true,
            showHelpers: true,
            locale: 'ru',
            messages: {},
            rules: {}
        };


        this.messages = {
            en: {
                required: {
                    empty: 'Place value',
                    incorrect: 'Incorrect value',
                    helper: 'Use the all symbols'
                },
                notzero: {
                    empty: 'Select this',
                    incorrect: 'Incorrect value',
                    helper: 'Just select'
                },
                integer: {
                    empty: 'Enter an integer',
                    incorrect: 'Incorrect integer',
                    helper: 'Example, 125'
                },
                float: {
                    empty: 'Enter an float number',
                    incorrect: 'Incorrect float',
                    helper: 'Example, 12.00'
                },
                min: {
                    empty: 'Enter more',
                    incorrect: 'Enter more',
                    helper: 'Enter more'
                },
                max: {
                    empty: 'Enter less',
                    incorrect: 'Enter less',
                    helper: 'Enter less'
                },
                between: {
                    empty: 'Enter the between',
                    incorrect: 'Enter the between',
                    helper: 'Enter the between'
                },
                name: {
                    empty: 'Please, enter your name',
                    incorrect: 'Incorrect name',
                    helper: 'Use the alphabet and spaces'
                },
                lastname: {
                    empty: 'Please, enter your lastname',
                    incorrect: 'Incorrect lastname',
                    helper: 'Use the alphabet and spaces'
                },
                phone: {
                    empty: 'Please, enter the phone number',
                    incorrect: 'Incorrect phone number',
                    helper: 'Use the digits, spaces and symbols "-", "_", "()"'
                },
                email: {
                    empty: 'Please, enter your email address',
                    incorrect: 'Incorrect email address',
                    helper: 'Use your realy email address'
                }
            },
            ru: {
                required: {
                    empty: 'Не оставляйте это поле пустым',
                    incorrect: 'Недопустимое значение',
                    helper: 'Любые символы'
                },
                notzero: {
                    empty: 'Сделайте выбор',
                    incorrect: 'Выберите {0}',
                    helper: 'Просто выберите {0}'
                },
                integer: {
                    empty: 'Укажите натуральное число',
                    incorrect: 'Введенное значение не является натуральным числом',
                    helper: 'Например, 125'
                },
                float: {
                    empty: 'Укажите число с плавающей точкой',
                    incorrect: 'Введенное значение не является числом с плавающей точкой',
                    helper: 'Например, 12.00'
                },
                min: {
                    empty: 'Укажите число не меньше {0}',
                    incorrect: 'Указанное значение меньше {0}',
                    helper: 'Укажите значение больше {0}'
                },
                max: {
                    empty: 'Укажите число не более {0}',
                    incorrect: 'Указанное число больше {0}',
                    helper: 'Укажите число меньше чем {0}'
                },
                between: {
                    empty: 'Укажите диапозон от {0} до {1}',
                    incorrect: 'Укажите диапозон от {0} до {1}',
                    helper: 'Укажите диапозон от {0} до {1}'
                },
                name: {
                    empty: 'Укажите ваше Имя',
                    incorrect: 'Некорректное имя',
                    helper: 'Например, Иван'
                },
                lastname: {
                    empty: 'Укажите вашу Фамилию',
                    incorrect: 'Некорректная фамилия',
                    helper: 'Например, Иванов'
                },
                phone: {
                    empty: 'Введите номер телефона',
                    incorrect: 'Некорректный номер',
                    helper: 'Например +7(618)216-99-55'
                },
                email: {
                    empty: 'Укажите ваш E-mail адрес',
                    incorrect: 'Некорректный E-mail',
                    helper: 'Например, email@mail.com'
                }
            }
        };


        if (!formHandle) {
            return false;
        }

        var self = this,
            eventList = ['keyup', 'change', 'blur'],
            eventListLength = eventList.length,
            n,
            i;

        //set handle
        this.formHandle = formHandle || null;

        //set callback
        this.submitCallback = submitCallback || null;

        //get fields and rules
        this.fields = this.getFields(this.formHandle.querySelectorAll('[data-rule]'));

        //apply custom settings
        if (settings) {

            if (settings.rules) {
                for (n in settings.rules) {
                    if (settings.rules.hasOwnProperty(n)) {
                        this.rules[n] = settings.rules[n];
                    }
                }
                delete settings.rules;
            }


            //apply other settings
            for (n in settings) {
                if (settings.hasOwnProperty(n)) {
                    this.settings[n] = settings[n];
                }
            }
        }

        //set submit callback
        if (this.submitCallback) {

            this.formHandle.addEventListener('submit', (self.events.submit).bind(this));

            if (this.settings.onAir) {
                for (n in this.fields) {
                    if (this.fields.hasOwnProperty(n)) {
                        for (i = 0; i < eventListLength; i += 1) {
                            this.fields[n].handle.addEventListener(eventList[i], (self.events.change).bind(this));
                        }
                    }
                }
            }

        }

        return this;
    };

    //main prototype
    JsFormValidator.prototype = {

        //service objects
        formHandle: null,
        submitCallback: null,
        errors: null,
        fields: {},
        intervalID: null,

        //rules
        rules: {
            required: function (value) {
                return '' !== value;
            },
            notzero: function (value) {
                return parseInt(value, 10) > 0;
            },
            integer: function (value) {
                return !isNaN(parseInt(value, 10));
            },
            float: function (value) {
                return new RegExp(/^([0-9])+(\.)([0-9]+$)/gi).test(value);
            },
            min: function (value, params) {
                if (this.float(value)) {
                    return parseFloat(value) >= parseFloat(params[0]);
                }
                return parseInt(value, 10) >= parseInt(params[0], 10);
            },
            max: function (value, params) {
                if (this.float(value)) {
                    return parseFloat(value) <= parseFloat(params[0]);
                }
                return parseInt(value, 10) <= parseInt(params[0], 10);
            },
            between: function (value, params) {
                if (this.float(value)) {
                    return parseFloat(value) >= parseFloat(params[0]) && parseFloat(value) <= parseFloat(params[1]);
                }
                if (this.integer(value)) {
                    return parseInt(value, 10) >= parseInt(params[0], 10) && parseInt(value, 10) <= parseInt(params[1], 10);
                }
                return false;
            },
            name: function (value) {
                if (value.length > 0 && value.length < 2) {
                    return false;
                }
                return new RegExp(/^[a-zA-Z\sа-яА-ЯёЁ\-]+$/g).test(value);
            },
            lastname: function (value) {
                return this.name(value);
            },
            phone: function (value) {
                if (value.match(/[0-9]+/gi) && value.match(/[0-9]+/gi)[0].length < 6) {
                    return false;
                }
                return new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/g).test(value);
            },
            email: function (value) {
                return new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value);
            }
        },
        orderFields: function (attrName, attrValue) {

            if (!attrName || !attrValue) {
                return {};
            }

            var ret = {},
                n;

            for (n in this.fields) {
                if (this.fields.hasOwnProperty(n)) {
                    if (this.fields[n].handle[attrName] && this.fields[n].handle[attrName] === attrValue) {
                        ret[n] = this.fields[n];
                    }
                }
            }

            return ret;
        },
        validate: function (validationField) {

            if (this.errors) {
                this.errors = null;
            }

            var n,
                i,
                l,
                ruleName,
                value,
                defaultValue,
                result = true,
                message,
                messageType = null,
                helper,
                params,
                fields = this.fields;

            if (validationField) {
                fields = this.getFields([validationField]);
            }

            //each fields
            for (n in  fields) {
                result = true;
                l = fields[n].rules.length;

                 //each rules
                //for (i = l - 1; i > -1; i -= 1){
                for (i = 0; i < l; i += 1) {

                    ruleName = fields[n].rules[i][0];
                    params = fields[n].rules[i][1];
                    defaultValue = fields[n].defaultValue;
                    value = fields[n].handle.value;

                    //if is radio button
                    if (fields[n].handle.type === 'checkbox' && !fields[n].handle.checked) {
                        value = '';
                    }

                    //if is radio button
                    if (fields[n].handle.type === 'radio') {

                        //get radio groupe
                        var radioBtns = this.orderFields('name', fields[n].handle.name),
                            checked = false,
                            index;

                        //each radio buttons
                        for (index in radioBtns) {
                            if (radioBtns[index].handle.checked) {
                                //set status check 
                                checked = true;
                            }
                        }

                        if (!checked) {
                            //add an error to one element
                            for (index in radioBtns) {
                                try {
                                    message = this.settings.messages[this.settings.locale][ruleName].empty;
                                } catch (e) {
                                    message = this.messages[this.settings.locale][ruleName].empty;
                                }
                                
                                try {
                                    helper = this.settings.messages[this.settings.locale][ruleName].helper;
                                } catch (e) {
                                    helper = this.messages[this.settings.locale][ruleName].helper;
                                }
                                break;
                            }

                            //set value as for empty rules
                            value = '';
                        }
                    }

                    if (result && !(value === '' && !fields[n].rules.join('|').match(/\|{0,1}required\|{0,1}/))) {

                        //if exist default value and value is eq default
                        if (result && defaultValue && value !== defaultValue) {
                            
                            result = false;
                            messageType = 'incorrect';
                            
                        //if default value not exist
                        } else if (result && this.rules[ruleName] && !this.rules[ruleName](value, params)) {

                            //set message to empty data
                            if ('' === value) {
                                result = false;
                                messageType = 'empty';

                            //set message to incorrect data
                            } else {
                                result = false;
                                messageType = 'incorrect'
                            }
                        }

                        if (!result) {

                            //define errors stack if not exist
                            if (!this.errors) {
                                this.errors = {};
                            }

                            //append error messages
                            try {
                                try {
                                    message = this.settings.messages[this.settings.locale][ruleName][messageType];
                                } catch (e) {
                                    message = this.messages[this.settings.locale][ruleName][messageType];
                                }
                            } catch (e) {
                                message = this.messages[this.settings.locale]['required'][messageType];
                            }

                            //append helpers to stack
                            try {
                                try {
                                    helper = this.settings.messages[this.settings.locale][ruleName].helper;
                                } catch (e) {
                                    helper = this.messages[this.settings.locale][ruleName].helper;
                                }
                            } catch (e) {
                                helper = this.messages[this.settings.locale]['required'].helper;
                            }

                            //add error
                            this.errors[n] = {
                                name: fields[n].name,
                                errorText: this.formatString(message, params),
                                helper: this.formatString(helper, params)
                            }

                            //call callback if exist
                            if (!this.submitCallback) {
                                this.errors[n].handle = fields[n].handle;
                            }
                        }
                    }
                }
            }

            //run callback if callback is exists and not errors or return error data object
            if (this.submitCallback) {
                return (this.errors) ? false : true;
            } else {
                return (this.errors) ? this.errors : true;
            }
        },
        hideErrors: function (validationField, notClass, notHelpers) {
            var n,
                errorDiv,
                helperDiv;

            for (n in this.fields) {

                if ((validationField && validationField === this.fields[n].handle) || !validationField) {

                    errorDiv = this.fields[n].handle.parentNode.querySelector('[data-type="validator-error"]');
                    helperDiv = this.fields[n].handle.parentNode.querySelector('[data-type="validator-helper"]');

                    if (!notClass) {
                        this.fields[n].handle.classList.remove('error');
                    }

                    if (errorDiv) {
                        errorDiv.parentNode.removeChild(errorDiv);
                    }

                    if (helperDiv && !notHelpers) {
                        helperDiv.parentNode.removeChild(helperDiv);
                    }            
                }
            }
        },
        showErrors: function (validationField) {

            var n,
                errorDiv,
                se = this.settings.showErrors,
                sh = this.settings.showHelpers,
                insertNodeError = function (refNode, errorObj) {
                    
                    refNode.classList.add('error');

                    //error
                    if (se) {
                        errorDiv = document.createElement('div');
                        errorDiv.setAttribute('class', 'error');
                        errorDiv.setAttribute('data-type', 'validator-error');
                        errorDiv.innerHTML = errorObj.errorText;
                        refNode.parentNode.insertBefore(errorDiv, refNode.nextSibling);
                    }

                    //helper
                    if (sh) {
                        errorDiv = document.createElement('div');
                        errorDiv.setAttribute('class', 'helper');
                        errorDiv.setAttribute('data-type', 'validator-helper');
                        errorDiv.innerHTML = errorObj.helper;
                        refNode.parentNode.insertBefore(errorDiv, refNode.nextSibling);
                    }
                }

            for (n in  this.errors) {

                if (validationField) {

                    for (var i in this.fields){
                        if ( this.fields[i].handle.getAttribute('name') === validationField.getAttribute('name')) {
                            insertNodeError(this.fields[i].handle, this.errors[n]);
                        }
                    }

                } else {
                    insertNodeError(this.fields[n].handle, this.errors[n]);
                }
            }

            if (this.settings.autoHideErrors) {
                
                if (this.intervalID) {
                    clearInterval(this.intervalID);
                }

                this.intervalID = setTimeout((function () {
                    this.intervalID = null;
                    this.hideErrors(validationField, true, !this.settings.autoHideHelpers);
                }).bind(this), this.settings.autoHideErrorsTimeout);
                
            }

        },
        init: function (formHandle, submitCallback, settings) {
            
            if (!formHandle) {
                return false;
            }

            var self = this,
                eventList = ['keyup', 'change', 'blur'],
                eventListLength = eventList.length,
                n,
                i;

            //set handle
            this.formHandle = (formHandle) ? formHandle : null;

            //set callback
            this.submitCallback = (submitCallback) ? submitCallback: null;

            //get fields and rules
            this.fields = this.getFields(this.formHandle.querySelectorAll('[data-rule]'));

            if (settings) {
                for (n in settings) {
                    this.settings[n] = settings[n];
                }
            }

            //set submit callback
            if (this.submitCallback) {

                this.formHandle.addEventListener('submit', (self.events.submit).bind(this));

                if (this.settings.onAir) {
                    for (n in this.fields) {
                        
                        for (i = 0; i < eventListLength; i += 1) {
                            this.fields[n].handle.addEventListener(eventList[i], (self.events.change).bind(this));
                        }
                    }
                }

            }

            return this;
        },
        events: {
            submit: function (e) {

                e.preventDefault();

                //validate
                var validateResult = this.validate();

                //hide errors
                this.hideErrors();

                //show errors
                if (!validateResult) {
                    this.showErrors();
                }

                //callback
                var callbackResult = this.submitCallback((this.errors) ? this.errors : null, (this.errors) ? false : true);

                if (callbackResult === true) {
                    this.formHandle.submit();
                }
            },
            change: function (e) {

                //remove spaces
                if (this.settings.removeSpaces && new RegExp(/\s{2,}/g).test(e.target.value)) {
                    e.target.value = e.target.value.replace(/\s{2,}/g, ' ');
                }

                //hide errors for this
                this.hideErrors(e.target);
                
                //validate and show errors for this
                if (!this.validate(e.target)) {
                    this.showErrors(e.target);
                }
            }
        },
        getFields: function (fields) {

            var retData = {},
                rules = [],
                params = [],
                fieldsLength = fields.length,
                fieldIndex,
                ruleIndex,
                rulesLength;

            for (fieldIndex = 0; fieldIndex < fieldsLength; fieldIndex += 1) {

                rules = fields[fieldIndex].getAttribute('data-rule').split('|');

                rulesLength = rules.length;
                for (ruleIndex = 0; ruleIndex < rulesLength; ruleIndex += 1) {
                    if (rules[ruleIndex].match(/-/gi)) {
                        params = rules[ruleIndex].split('-');
                        rules[ruleIndex] = params[0];
                        params = params.splice(1);
                        rules[ruleIndex] = [rules[ruleIndex], params];
                    } else {
                        rules[ruleIndex] = [rules[ruleIndex], []];
                    }
                }

                retData[fieldIndex] = {
                    name: fields[fieldIndex].getAttribute('name'),
                    rules: rules,
                    defaultValue: fields[fieldIndex].getAttribute('data-default'),
                    handle: fields[fieldIndex]
                }
            }
            return retData;
        },
        formatString: function (format) {
            var args = [arguments[1]][0];

            if (!args.length) {
                return arguments[0];
            }

            return format.replace(/{(\d+)}/gi, function(match, number) { 
                return typeof args[number] != 'undefined' ? args[number] : ''/*match*/;
            });
        }
    }

    root.Validator = function (formHandle, submitCallback, settings) {

        var jsFormValidator = new JsFormValidator(formHandle, submitCallback, settings);

        function multiplex(object, memberList, fn) {
            var a = 0,
                l = memberList.length;

            for (a = 0; a < l; a += 1) {
                fn(object, memberList[a]);
            }
        }

        multiplex(Validator.prototype, ['validate'], function(object, member) {
            object[member] = function(){
                var args = arguments;
                return this.each(function(){
                    this[member].apply(this,args);
                });
            };
        });

        return this;
    }

})(this);