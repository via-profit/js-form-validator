(function () {

    var init = function () {

        //validation demo form 1
        new Validator(document.querySelector('form[name="demo-form"]'), function (err, res) {
            
            res && alert('Success');
        });

        //validation demo form 2
        new Validator(document.querySelector('form[name="demo-form-2"]'), function (err, res) {

            res && alert('Success');
        });
    };





    //call init before window loaded
    if (window.addEventListener) {

        //normal browsers
        window.addEventListener('load', init);
    } else {

        //IE 8
        window.attachEvent('onload', init);
    }

}());