(function (root, factory) {

    'use strict';

    if (root.exports) {
        root.module.exports = factory();
    } else {
        root.Validator = factory(root);
    }

}(this, function () {


	var validator = {
		settings: {
			onAir: true
		},
		formHandle: null,
		submitCallback: null,
		errors: null,
		fields: {},
		rules: {
			nutnull: function (value) {
				return '' !== value;
			},
			name: function (value) {
				return new RegExp(/^[a-zA-Z\sа-яА-ЯёЁ]+$/g).test(value);
			},
			lastname: function (value) {
				return this.name(value);
			},
			phone: function (value) {
				if ( value.length < 6 ) {
					return false;
				}
				return new RegExp(/^(?:(?:\(?(?:00|\+)([1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?((?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(\d+))?$/g).test(value);
			},
			email: function (value) {
				return new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i).test(value);
			}
		},
		locale: 'en',
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
						message = this.messages[this.locale][ruleName].empty;
					} else {
						message = this.messages[this.locale][ruleName].incorrect;
					}

					this.errors[n] = {
						name: fields[n].name,
						errorText: message,
						helper: this.messages[this.locale][ruleName].helper
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
			
			var self = this,
				n;

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

				this.formHandle.addEventListener('submit', self.events.submit);

				if (this.settings.onAir) {
					for (n in this.fields) {

						this.fields[n].handle.addEventListener('keyup', self.events.change);
						this.fields[n].handle.addEventListener('change', self.events.change);
						this.fields[n].handle.addEventListener('blur', self.events.change);
					}
				}

			}

			return validator.publish;
		},
		events: {
			submit: function (e) {
				e.preventDefault();

				//hide errors
				validator.hideErrors();
				
				//validate and show errors
				if (!validator.validate()) {
					validator.showErrors();
				}

				//callback
				validator.submitCallback((validator.errors) ? validator.errors : null, (validator.errors) ? false : true);

				return false;	
			},
			change: function (e) {
				//hide errors for this
				validator.hideErrors(this);
				
				//validate and show errors for this
				if (!validator.validate(this)) {
					validator.showErrors(this);
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




	//out of space
	function multiplex(object, memberList, fn) {
		var a = 0,
			l = memberList.length;

		for(a = 0; a < l; a += 1) {
			fn(object, memberList[a]);
		}
	}; 	

	validator.publish = {};

	multiplex(validator.publish, ['init', 'validate'], function (object, member) {
		object[member] = function () {
			return validator[member].apply(validator, arguments);
		};
	});

	return validator.publish;

}));