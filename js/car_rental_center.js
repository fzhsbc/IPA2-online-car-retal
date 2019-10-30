var carData = [];
function getCars(){
	var carArr = [];
	var xml = new XMLHttpRequest();
	xml.open('GET','cars.xml', false);
	xml.onload = e => {
		var xmlDoc = xml.responseXML;
		var rawCarTags = xmlDoc.getElementsByTagName('car');
		for(let i =0; i < rawCarTags.length; i++ ){
			let singleCar = {}
			singleCar['id'] = rawCarTags[i].id
			singleCar['counts'] = 1;
			singleCar['deleteshow'] = 0;
			for(let j=0; j<rawCarTags[i].childNodes.length; j++){
				if(rawCarTags[i].childNodes[j].nodeType == 3){
					rawCarTags[i].removeChild(rawCarTags[i].childNodes[j])
					j--;
				}
				else {
					singleCar[rawCarTags[i].childNodes[j].nodeName] = rawCarTags[i].childNodes[j].innerHTML;
				}
			}
			carData.push(singleCar);
		}
	}
	xml.send();
}
getCars();
function getSession(){
	var xml = new XMLHttpRequest();
	xml.open('GET', 'update.php', false);
	xml.onload = () => {	

		var hertz = new Vue({
			el: '#car_table',
			data: {
				cars: carData,
				cart: JSON.parse(xml.responseText),
			},
			computed: {
				car_list: function(){
					var carList = [];
					var carLength = this.cars.length;
					var sessionLength = this.cart.length;
					for(let i = 0; i < sessionLength; i++){
						for(let j = 0; j < carLength; j++){
							if(this.cart[i].id == this.cars[j]['id']){
								let singleCar = this.cars[j];
								carList.push(singleCar);
							}
						}
					}
					return carList;
				},
				total: function(){
					var total = 0;
					for(let i=0; i< this.car_list.length; i++){
						total += this.car_list[i].counts * this.car_list[i].price_per_day;
					}
					return total;
				}
			},
			methods: {
				pop_box: function(){

				},
				deleteCars: function(id){
					var xml = new XMLHttpRequest();
					xml.open('GET', 'update.php?deleteId='+id, false);
					xml.onload = e => {
						this.cart = JSON.parse(xml.responseText)
					}
					xml.send();
				},
				checkOut: function(){
					var cartLength = this.cart.length;
					if(cartLength==0){
						warningBox('No car has been reserved',0)
						var countDown = 4;
						var count = setInterval(function(){countDown--;},1000);
						var jump = setTimeout(function(){document.location.href="index.html"}, 5000) ;
					}
					else{
						var data = [];
						for(let i=0; i<this.car_list.length; i++){
							data.push(
								{ 'counts': this.car_list[i].counts,
									'id': this.car_list[i].id
								}
							)
						}
						var sendCar = new XMLHttpRequest();
						sendCar.open('POST', 'checkout.php');
						sendCar.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
						sendCar.send(JSON.stringify(data));

						var sendTotal = new XMLHttpRequest();
						sendTotal.open('GET', 'totalamount.php?total='+this.total);
						sendTotal.send();
						document.location.href="checkout.html";
					}
				},
				clearCart: function(){
					var xml = new XMLHttpRequest();
					xml.open('GET','clear.php', false);
					xml.onload = e => {
						this.cart = [];
					}
					xml.send();
				}
			}
		})
	}
	xml.send();
}
getSession();
// warning information box
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

