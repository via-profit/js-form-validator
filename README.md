Form validation on native javascript
-------------------------------------------

**Simple Example:**

    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (err, res) {
		return res;
	}

**Description for this:**
You need to create an instance of **Validator** and pass it two parameters:
 1. Form handle
 2. Callback function

Callback function has two arguments: **err** and **res**. If the form has a validation error, the argument **err** will be the **Object**, and if there are no errors - **null**. Argument **res** returns a boolean value (**true** or **false**) and there is always.