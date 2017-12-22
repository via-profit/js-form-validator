(function () {


	function preloadImages (images, callback) {

	    var currentCount = 0,
	        allCount = images.length;


	    [].forEach.call(images, function (image, index) {

	        //create new image
	        (function (img, src) {

	            var newImg = new Image();
	            newImg.src = src;
	            
	            //onload event
	            newImg.onload = function(){

	                currentCount += 1;

	                if (currentCount === allCount) {
	                    currentCount = null;
	                    allCount = null;

	                    //run callback in main context
	                    callback && callback.call(this);
	                    return;
	                }
	            }

	            newImg = null;

	        }(image, ((typeof image === 'string') ? image: image.getAttribute('src'))));
	    });
	}




	





	// top scroller
	var showScroller = function () {
	    var topOffset = 1000,
	        topButton = document.querySelector('.top-scroller'),
	        doc = document.documentElement,
	        left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0),
	        top = (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0);


	    if (top > topOffset) {
	        
	        if (!topButton.classList.contains('-visible')) {
	            topButton.classList.add('-visible');
	        }

	    } else {
	        topButton.classList.remove('-visible');
	    }
	}

	showScroller();
	window.addEventListener('scroll', showScroller);
	
	// click event
	document.querySelector('.top-scroller').addEventListener('click', function () {
	    new JsScroller().scrollTo(-5);
	});












	// top menu sticky
	new JsTopper(document.querySelector('.cap-wrapper'), {
	    stickStartOffsetTop: 0
	});











	// top menu anchor click
	[].forEach.call(document.querySelectorAll('.menu-elem'), function (elem) {
	    elem.addEventListener('click', function (e) {
	        e.preventDefault();

	        document.querySelector('.menu-elem.-active').classList.remove('-active');
	        this.classList.add('-active');

	        !!document.body.classList.contains('mobile-menu-opener') && document.body.classList.remove('mobile-menu-opener');

	    });
	});















	// click on menu element
	[].forEach.call(document.querySelectorAll('a[href^="#"]'), function (elem) {
	    elem.addEventListener('click', function (e) {
	        e.preventDefault();

	        var anchor = this.getAttribute('href').replace('#', ''),
	            target = document.querySelector('a[name="' + this.getAttribute('href').replace('#', '') + '"]'),
	            offset = -35;

	           	if (anchor === 'home') {
	           		offset = -10;
	           		target = 0.01;
	           	}

	        target && new JsScroller({offset: offset}).scrollTo(target);
	    });
	});








	window.addEventListener('scroll', function (e) {


	    [].forEach.call(document.querySelectorAll('a[name]'), function (element) {
	        if ((element.getBoundingClientRect().top >= 0) && (element.getBoundingClientRect().bottom <= window.innerHeight)) {

	            [].forEach.call(document.querySelectorAll('.menu-elem[href="#' + element.getAttribute('name') + '"]'), function (menuElem) {
	                menuElem.parentNode.querySelector('.menu-elem.-active').classList.remove('-active');
	                menuElem.classList.add('-active');
	            });
	        }
	    });
	});
















	preloadImages([document.querySelector('.home-screen').getAttribute('data-image')], function () {
		document.body.classList.add('-img-loaded');
	});









	var mount = document.querySelector('.home-screen .mount');
	window.addEventListener('scroll', function () {

		if (window.pageYOffset > 10) {
			mount.classList.add('-hidden');
		} else {
			mount.classList.remove('-hidden');
		}
	});










	// codemirror
	[].forEach.call(document.querySelectorAll('textarea.codemirror'), function (textarea) {

		codeMirrorHandle = CodeMirror.fromTextArea(textarea, {
		    lineNumbers: true,
		    mode: textarea.getAttribute('data-mode'),
		    tabMode: 'indent',
		    theme: 'github-light',
		    readOnly: true,
		    lineNumbers: false
		}).setSize('100%', '100%');
	});
	




}());









document.addEventListener('DOMContentLoaded', function () {


	// social network LIKE buttons
	new JsSocnet();



	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	[].forEach.call(document.querySelectorAll('form'), function (form) {
		switch (form.getAttribute('name')) {
			case 'demo-form-1':
				new Validator(form, function (err, res) {

					res && new JsSplash('Validation success', {
						closeBtn: false,
						autoClose: 1600
					});
				});
			break;


			case'demo-form-2':

				form.querySelector('.example-2-create-field').addEventListener('click', function (e) {

					e.preventDefault();

					var randomInt1 = getRandomInt(1, 30),
						randomInt2 = getRandomInt(1, 30),
						rules = {
							rule1: {
								name: 'required|integer',
								label: 'Enter an integer value'
							},
							rule2: {
								name: 'required|between-' + randomInt1 + '-' + randomInt2,
								label: 'Enter the between ' + randomInt1 + '-' + randomInt2
							},
							rule3: {
								name: 'required|minlength-' + randomInt1,
								label: 'You need entered more than ' + randomInt1 + ' characters'
							},
							rule4: {
								name: 'required|email',
								label: 'Enter your E-mail address'
							},
							rule5: {
								name: 'required|min-' + randomInt1,
								label: 'You need entered not less than ' + randomInt1 + ' integer value'
							},
							rule6: {
								name: 'required|float',
								label: 'Enter an float or integer number'
							}
						},
						rule = rules['rule' + getRandomInt(1, 6).toString()],
						field = document.createElement('div'),
						inputWrapper = document.createElement('div'),
						input = document.createElement('input'),
						placeholder = document.createElement('label'),
						remover = document.createElement('a'),
						id = 'example-2-interests-' + form.querySelectorAll('.field').length + 1;

					field.setAttribute('class', 'field');
					inputWrapper.setAttribute('class', 'input-wrapper');
					input.setAttribute('name', 'interests[' + (form.querySelectorAll('.field').length + 1) + ']');
					input.setAttribute('id', id);
					input.setAttribute('type', 'text');
					input.setAttribute('data-rule', rule.name);
					input.setAttribute('autocomplete', 'off');
					placeholder.setAttribute('for', id);
					placeholder.setAttribute('class', 'placeholder');
					placeholder.innerHTML = rule.label;
					remover.setAttribute('href', '#');
					remover.setAttribute('class', 'example-2-remove-input fa fa-times');
					remover.setAttribute('title', 'Remove field');

					inputWrapper.appendChild(input);
					inputWrapper.appendChild(placeholder);

					field.appendChild(inputWrapper);
					field.appendChild(remover);

					form.querySelector('.fields-list').appendChild(field);

					input.focus();

				});

				form.addEventListener('click', function (event) {
				    var selectors = form.querySelectorAll('.example-2-remove-input'),
				        element = event.target,
				        index = -1;

				    if (selectors) {

				        while (element && ((index = [].indexOf.call(selectors, element)) === -1)) {
				            element = element.parentElement;
				        }

				        if (index > -1) {
				            (function (e) {
				            	e.preventDefault();
				                
				                var field = this.parentNode;
				                field.parentNode.removeChild(field);

				            }).call(element, event);
				        }
				    }
				});

				new Validator(form, function (err, res) {

					res && new JsSplash('Validation success', {
						closeBtn: false,
						autoClose: 1600
					});
				});
			break;




			case'demo-form-3':
				new Validator(form, function (err, res) {

					res && new JsSplash('Validation success', {
						closeBtn: false,
						autoClose: 1600
					});
				}, {
					rules: {
						milk: function (value) {
							return (value.trim().toLowerCase() === 'milk');
						}
					},
					messages: {
						en: {
							milk: {
								incorrect: 'This is not a Milk ;-)'
							}
						}
					}
				});
			break;
		}
	});
});