JS form validator
==============
*Form validation on native javascript*

Supported browsers
================
![Supported browsers](https://raw.githubusercontent.com/Kunano/js-form-validator/master/browsers.png)

 - Opera
 - Firefox
 - Chrome
 - Safari
 - Internet Explorer 8+

How to use
=========

```javascript    
	var validator = new Validator(formHandle, [callback], [settings]);
```

**In HTML:**
```html    
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>My title</title>

		<!-- Append the validator JS script -->
		<script type="text/javascript" src="js-form-validator.js"></script>
	</head>

	<body>
		
		<!-- Your form -->
		<form name="example-form">
			
			<!-- Required field phone -->
			<input type="text" name="phone" data-rule="required|phone"/>

			<!-- Required field email -->
			<input type="text" name="phone" data-rule="required|email"/>

			<!-- Submit button -->
			<input type="submit" value="Submit"/>

		</form>

	</body>

	</html>
```
**In Javascript:**
```javascript

	//Notice: run this code after the DOM loaded!

    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (err, res) {
		return res;
	});
```

[Demo](http://codepen.io/dhs/pen/oxCFp)

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
		return res;
	});
```

Settings
=======

| Name                  | Type    | Default | Description                                                                 |
|-----------------------|---------|---------|-----------------------------------------------------------------------------|
| onAir                 | Boolean | true    | Validation of a current field after the events of "change", "keyup", "blur" |
| showErrors            | Boolean | true    | Show validation errors                                                      |
| autoHideErrors        | Boolean | false    | Auto-hide the error messages                                                |
| autoHideErrorsTimeout | Integer | 2000    | Timeout auto-hide error messages                                            |
| locale*                | String  | 'en'    | Language error messages                                                    |
| messages**             | Object  | {}      | Object for custom error messages                                            |
| rules***                 | Object  | {}      | Object for custom rules                   

*locale - location index for message object.

**messages - an object having the structure:

```javascript 
    messages: {
		localeName: {
			RuleName1: {
				empty: 'Message text for empty value',
				incorrect: 'Message text for incorrect value'
			},
			RuleName2: {
				empty: 'Message text for empty value',
				incorrect: 'Message text for incorrect value'
			}
			//..
		}
	}
```
***rules - an object having the structure:

```javascript
    rules: {
		myCustomRulename: function (value, params) {
			//Your code here..
			//The function should return a boolean value
			//true - if the filed
		}
	}
```    

How to apply settings
-------------------------

```javascript    
    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (err, res) {
		return res;
	}, {
	    onAir: false,
    	locale: 'ru'
	});
```

Rules
====

For the attaching of the rules, you have to add the attribute **data-rule** to the form element, and as value is **rule name**
```html
	<input type="text" name="phone" data-rule="phone"/>
```

For a form element, you can use a few rules that are listed through the separator "**|**"
```html
	<input type="text" name="phone" data-rule="phone|required"/>
```

Some rules may have parameters. The parameters must be separated by the symbol "**-**"
```html
	<input type="text" name="count" data-rule="between-5-9"/>
```
List of rules
-------------

| Name        | Parameters      | Description                                                                                               |
|-------------|-----------------|-----------------------------------------------------------------------------------------------------------|
| required    |        -        | Required field                                                                                            |
| notzero     |        -        | The value can not be zero                                                                                 |
| integer     |        -        | Value must be an positive integer                                                                         |
| float       |        -        | The value must be a floating point number                                                                 |
| name        |        -        | The correct name. Use spaces, letters of the alphabet and the symbol "-"                                  |
| lastname    |        -        | The correct lastname. Use spaces, letters of the alphabet and the symbol "-"                              |
| phone       |        -        | The correct phone number                                                                                  |
| email       |        -        | The correct email address                                                                                 |
| min         | numeric         | The value must not be less than the value specified in the first parameter                                |
| max         | numeric         | The value must not be greater than the value specified in the first parameter                             |
| between     | numeric-numeric | The value must be between the values ​​specified in the first and the second parameter                      |
| length      | numeric-numeric | The number of characters value must be between the values ​​specified in the first and the second parameter |
| minlength   | numeric         | The number of characters value must not be less than the value specified in the first parameter           |
| maxlength   | numeric         | The number of characters value must not be greater than the value specified in the first parameter        |
| maxfilesize | numeric         | The size of one or more selected files must not be greater than the value specified in the first parameter|

Custom rules
------------
You can add custom rules.

**Notice:** Function should return boolean value

```html
	<input type="text" name="custom" data-rule="myrule-param1-param2"/>
```

```javascript
    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (err, res) {
		return res;
	}, rules: {
		myrule: function (value, params) {
			//value - value
			//params - [param1, param2]
			//Notice: Function should return boolean value
		}
	});
```

License
=======
*The MIT License (MIT)*
*Copyright (c) 2013 kunano.ru*

*Permission is hereby granted, free of charge, to any person obtaining a copy of*
*this software and associated documentation files (the "Software"), to deal in*
*the Software without restriction, including without limitation the rights to*
*use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of*
*the Software, and to permit persons to whom the Software is furnished to do so,*
*subject to the following conditions:*

*The above copyright notice and this permission notice shall be included in all*
*copies or substantial portions of the Software.*

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR*
*IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS*
*FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR*
*COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER*
*IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN*
*CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*