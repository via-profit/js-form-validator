(function () {

    //main init
    var init = function () {

        //get form handle
        var formHandle = document.querySelector('form[name="demo-form"]'),

            //got to validation
            validator = new Validator(formHandle, function (err, res) {
                
                //return validation result
                return res;
            });

        window.validator = validator;
    };





    //call init before windo loaded
    if (window.addEventListener) {

        //normal browsers
        window.addEventListener('load', init);
    } else {

        //IE 8
        window.attachEvent('onload', init);
    }

}());