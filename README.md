Javascript form validator
==============

[Demo and Examples](https://via-profit.github.io/js-form-validator/)

We present you a very simple solution for validating HTML forms. If you do not want to pull a MB of JS dependencies, like, «jQuery» just for the sake of checking the correctness of the entered user data, then our solution will suit you.

![Javascript Form Validator Screenshot Preview](https://raw.githubusercontent.com/Via-profit/js-form-validator/master/assets/img/form-validator-preview.png)

How to use
------------

1. Include script on your page
2. Apply «[data-rule]» attribute for each form element that you want to check, or the attribute value, specify the name of one or more rules
3. You need to create an instance of Validator and pass it two parameters (Form handle and Callback function)

```html    
	<!-- Your form -->
	<form name="form" id="my-form">

		<!-- Required field email -->
		<input type="text" name="email" data-rule="required|email"/>

		<input type="submit" value="Submit"/>

	</form>

	<!-- Append the validator JS script -->
	<script type="text/javascript" src="js-form-validator.js"></script>

	<script>
		// Init validator with standart settings
		new Validator(document.querySelector('#my-form'), function (err, res) {
			return res;
		});
	</script>
```


What else
------------

 - Rules customization
 - Errors messages customization
 - Automatic update when changing the form
 - Api

[Full documentation and examples](https://via-profit.github.io/js-form-validator/)