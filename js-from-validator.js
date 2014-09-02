(function () {

	Validator = function (formHandle, submitCallback, settings) {
	
		var jsFormValidator = new JsFormValidator(formHandle, submitCallback, settings);

		function multiplex(object, memberList, fn) {
			var a = 0,
				l = memberList.length;

			for(a = 0; a < l; a += 1) {
				fn(object, memberList[a]);
			}
		}; 	

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

	var JsFormValidator = function (formHandle, submitCallback, settings) {

		this.settings = {
			onAir: true,
			removeSpaces: false,
			locale: 'ru',
			messages: {
				en: {
					nutnull: {
						empty: 'Place value',
						incorrect: 'Incorrect value',
						helper: 'Use the all symbols'
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
					nutnull: {
						empty: 'RU-Place value',
						incorrect: 'RU-Incorrect value',
						helper: 'RU-Use the all symbols'
					},
					name: {
						empty: 'RU-Please, enter your name',
						incorrect: 'RU-Incorrect name',
						helper: 'RU-Use the alphabet and spaces'
					},
					lastname: {
						empty: 'RU-Please, enter your lastname',
						incorrect: 'RU-Incorrect lastname',
						helper: 'RU-Use the alphabet and spaces'
					},
					phone: {
						empty: 'RU-Please, enter the phone number',
						incorrect: 'RU-Incorrect phone number',
						helper: 'RU-Use the digits, spaces and symbols "-", "_", "()"'
					},
					email: {
						empty: 'RU-Please, enter your email address',
						incorrect: 'RU-Incorrect email address',
						helper: 'RU-Use your realy email address'
					}
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
	};

	JsFormValidator.prototype = {

		formHandle: null,
		submitCallback: null,
		errors: null,
		fields: {},
		rules: {
			nutnull: function (value) {
				return '' !== value;
			},
			name: function (value) {
				if (value.length < 2) {
					return false;
				}
				return new RegExp(/^[a-zA-Z\sа-яА-ЯёЁ-]+$/g).test(value);
			},
			lastname: function (value) {
				return this.name(value);
			},
			phone: function (value) {
				if ( value.replace(/[^0-9]+/gi, '').length < 6 ) {
					return false;
				}
				return new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/g).test(value);
			},
			email: function (value) {
				return new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value);
			}
		},
		validate: function (validationField) {
			
			if (this.errors) {
				this.errors = null;
			}

			var n,
				ruleName,
				value,
				message,
				fields = this.fields;

			if (validationField) {
				fields = this.getFields([validationField]);
			}

			for (n in  fields) {
				
				ruleName = fields[n].rule;
				value = fields[n].handle.value.trim();

				if (this.rules[ruleName] && !this.rules[ruleName](value)) {

					if (!this.errors) {
						this.errors = {};
					}

					if ('' === value) {
						message = this.settings.messages[this.settings.locale][ruleName].empty;
					} else {
						message = this.settings.messages[this.settings.locale][ruleName].incorrect;
					}

					this.errors[n] = {
						name: fields[n].name,
						errorText: message,
						helper: this.settings.messages[this.settings.locale][ruleName].helper
					}

					if (!this.submitCallback) {
						this.errors[n].handle = fields[n].handle;
					}
				}
			}

			if (this.submitCallback) {
				return (this.errors) ? false : true;
			} else {

				return (this.errors) ? this.errors : true;
			}
		},
		hideErrors: function (validationField) {
			var n,
				errorDiv;

			for (n in this.fields) {
				
				if ((validationField && validationField === this.fields[n].handle) || !validationField) {
					errorDiv = this.fields[n].handle.nextElementSibling;

					if (errorDiv) {
						errorDiv.parentNode.removeChild(errorDiv);
					}					
				}
			}
		},
		showErrors: function (validationField) {
			var n,
				errorDiv,
				insertNodeError = function (refNode, text) {
					errorDiv = document.createElement('div');
					errorDiv.setAttribute('class', 'error');
					errorDiv.setAttribute('data-type', 'validator-error');
					errorDiv.innerHTML = text;
					refNode.parentNode.insertBefore(errorDiv, refNode);	
				}

			for (n in  this.errors) {

				if (validationField) {

					for (var i in this.fields){
						if ( this.fields[i].handle.getAttribute('name') === validationField.getAttribute('name')) {
							insertNodeError(this.fields[i].handle.nextSibling, this.errors[n].errorText);
						}
					}

				} else {
					insertNodeError(this.fields[n].handle.nextSibling, this.errors[n].errorText);
				}
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

				//hide errors
				this.hideErrors();
				
				//validate and show errors
				if (!this.validate()) {
					this.showErrors();
				}

				//callback
				this.submitCallback((this.errors) ? this.errors : null, (this.errors) ? false : true);

				return false;	
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
				l = fields.length,
				i;

			for (i = 0; i < l; i += 1) {
				retData[i] = {
					name: fields[i].getAttribute('name'),
					rule: fields[i].getAttribute('data-rule'),
					handle: fields[i]
				}
			}

			return retData;
		}
			
	}


})();