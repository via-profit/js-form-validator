JS form validator
==============
*Form validation on native javascript*

How to use
=========

```javascript    
	new Validator(formHandle, [callback], [settings]);
```

**Example**
*your HTML code*
```html    
	<form name="example-form">
		
		<input type="text" name="phone" data-rule="required|phone"/>
		
		<input type="submit" value="Submit"/>

	</form>
```
*Your Javascript code*
```javascript    
    //get form handle
    var formHandle = document.querySelector('form[name="example-form"]'),

	//got to validation
	validator = new Validator(formHandle, function (res) {
		return res;
	});
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
	validator = new Validator(formHandle, function (res) {
		return res;
	});
```

Settings
=======

| Name                  | Type    | Default | Description                                                                 |
|-----------------------|---------|---------|-----------------------------------------------------------------------------|
| onAir                 | Boolean | true    | Validation of a current field after the events of "change", "keyup", "blur" |
| showErrors            | Boolean | true    | Show validation errors                                                      |
| autoHideErrors        | Boolean | true    | Auto-hide the error messages                                                |
| autoHideErrorsTimeout | Integer | 2000    | Timeout auto-hide error messages                                            |
| showHelpers           | Boolean | false   | Show validation help messages                                               |
| autoHideHelpers       | Boolean | true    | Auto-hide the help messages                                                 |
| locale*                | String  | 'en'    | Language error messages                                                    |
| messages**             | Object  | {}      | Object for custom error messages                                            |
| rules***                 | Object  | {}      | Object for custom rules                   

***locale** - location index for message object.

***messages** - an object having the structure:

```javascript 
    messages: {
		localeName: {
			RuleName1: {
				empty: 'Message text for empty value',
				incorrect: 'Message text for incorrect value',
				helper: 'Helper message text'
			},
			RuleName2: {
				empty: 'Message text for empty value',
				incorrect: 'Message text for incorrect value',
				helper: 'Helper message text'
			}
			//..
		}
	}
```
*****rules** - an object having the structure:

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
	validator = new Validator(formHandle, function (res) {
		return res;
	}, {
	    onAir: false,
    	locale: 'ru'
	});
```

Rules
====

For the attaching of the rules, you have to add the attribute **data-rule** to the form element, and as value is **rule name**
*data-rule="phone"*

For a form element, you can use a few rules that are listed through the separator "**|**"
*data-rule="phone|required"*

Some rules may have parameters. The parameters must be separated by the symbol "**-**"
*data-rule="between-5-9"*

List of rules:
---------------

| Name     | Parameters      | Description |
|----------|-----------------|-------------|
| required |        -        |             |
| notzero  |        -        |             |
| integer  |        -        |             |
| float    |        -        |             |
| name     |        -        |             |
| lastname |        -        |             |
| phone    |        -        |             |
| email    |        -        |             |
| min      | numeric         |             |
| max      | numeric         |             |
| between  | numeric-numeric |             |
...coming soon