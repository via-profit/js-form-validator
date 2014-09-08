JS form validator
==============
*Form validation on native javascript*

How to use
-------------
```javascript
    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (res) {
		return res;
	}
```

**Description for this:**
You need to create an instance of **Validator** and pass it two parameters:
 1. Form handle
 2. Callback function

Callback function has two arguments: **err** and **res**. If the form has a validation error, the argument **err** will be the **Object**, and if there are no errors - **null**. Argument **res** returns a boolean value (**true** or **false**) and there is always.

**If you want to use an object error:**
```javascript
    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (err, res) {
		if (err) {
			//Your code
		}
		return res;
	}
```

Settings
----------

| Name                  | Type    | Default | Description                                                                 |
|-----------------------|---------|---------|-----------------------------------------------------------------------------|
| onAir                 | Boolean | true    | Validation of a current field after the events of "change", "keyup", "blur" |
| showErrors            | Boolean | true    | Show validation errors                                                      |
| autoHideErrors        | Boolean | true    | Auto-hide the error messages                                                |
| autoHideErrorsTimeout | Integer | 2000    | Timeout auto-hide error messages                                            |
| showHelpers           | Boolean | false   | Show validation help messages                                               |
| autoHideHelpers       | Boolean | true    | Auto-hide the help messages                                                 |
| locale                | String  | 'en'    | Language error messages                                                     |
| messages              | Object  | {}      | Object for custom error messages                                            |
| rules                 | Object  | {}      | Object for custom rules                                                     |