var getTotal = new XMLHttpRequest();
getTotal.open('GET', 'totalamount.php');
getTotal.onloadend = e=>{
	var hertz = new Vue({
		el: '#total',
		data: {
			total: getTotal.response
		}
	})
}
getTotal.send();
// Validate the form
function validateForm(){
	// var popLayer = document.querySelector('#pop_layer');
	var name = document.querySelector("input[name='name']");
	var email = document.querySelector("input[name='email']");
	var address = document.querySelector("input[name='address']");
	var city = document.querySelector("input[name='city']");	
	var state = document.querySelector("input[name='state']");
	var postCode = document.querySelector("input[name='post_code']");

	var feedbackBox = document.querySelector('#feedback');
	

	function warningInfo(text){	
		var feedbackContent = document.querySelector('#feedback p');
		feedbackBox.classList.add('active');
		feedbackContent.innerText = text;
	}

	function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
	}

	if(name.value == ''){
		return false;
	}
	else if(email.value == ''){
		return false;
	}
	else if(!validateEmail(email.value)){
		warningInfo('Invalidate email address');
		return false;
	}
	else if(address.value == ''){
		return false;
	}
	else if(city.value == ''){
		return false;
	}
	else if(state.value == ''){
		return false;
	}
	else if(postCode.value == ''){
		return false;
	}
	else{
		feedbackBox.classList.remove('active');
		var formData = [{
					name: name.value,
					email: email.value,
					address: address.value,
					city: city.value,
					state: state.value,
					post_code: postCode.value,
				}]
		var xml = new XMLHttpRequest();
		xml.open('POST', 'email.php');
		xml.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		xml.onload = e => {
			var res = e.target.response;
			if(res == 1){
				warningBox('The email has been sent to you',0);
				var countDown = 4;
				var count = setInterval(function(){countDown--;},1000);
				var jump = setTimeout(function(){document.location.href="index.html"}, 5000) ;
			}
		};
		xml.send(JSON.stringify(formData));
	}
}
var submit = document.querySelector('#submit');
submit.addEventListener('click', ()=>{
	validateForm();
})
function warningBox(text, isFade){
	var warningBox = document.querySelector('#warning');
	var contentBox = document.querySelector('#warning strong');

	contentBox.innerText = text;
	warningBox.classList.add('active');

	var toggleWarning = function(){
		warningBox.classList.remove('active');
	}
	if(isFade == 0){
		return;
	}
	else{
		clearTimeout(toggleWarning);
		setTimeout(toggleWarning, 2500);
	}
}