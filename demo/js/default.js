window.addEventListener('load', function () {

	//get form handle
	var formHandle = document.querySelector('form[name="demo-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (err, res) {
	   	console.log(res);
	    return res;
	});

});