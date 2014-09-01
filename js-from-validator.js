(function (root, factory) {

    'use strict';

    if (root.exports) {
        root.module.exports = factory();
    } else {
        root.Validator = factory(root);
    }

}(this, function () {

	var validator = {
			
		init: function (a, b) {
			return a + '-' + b;
		},

		publish: {
			init: function () {
				return validator.init.apply(this, arguments);
			}
		}
	}

	return validator.publish;

}));