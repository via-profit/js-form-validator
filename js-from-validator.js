(function (root, factory) {

    'use strict';

    if (root.exports) {
        root.module.exports = factory();
    } else {
        root.Validator = factory(root);
    }

}(this, function () {


	var validator = {

		formHandle: null,

		init: function (formHandle) {
			this.formHandle = formHandle;
			return validator.publish;
		},

		start: function () {
			return validator.publish;
		},

		sayOk: function () {
			return validator.publish;
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

	multiplex(validator.publish, ['init', 'start'], function (object, member) {
		object[member] = function () {
			return validator[member].apply(validator, arguments);
		};
	});

	return validator.publish;

}));