// FUNCTION TO CREATE THE STYLE FOR INPUT RANGE
function inputRange($el) {
	var input = document.getElementById($el+'_value');
	var value = document.getElementById($el).value;
	var step = document.getElementById($el).getAttribute('max') - document.getElementById($el).getAttribute('min');
	var track_done = document.getElementById('range_track_done_'+$el);
	var track_todo = document.getElementById('range_track_todo_'+$el);
	var curWidth_done = (100 / step) * (value - document.getElementById($el).getAttribute('min'));
	var curWidth_todo = 100 - curWidth_done;
	track_done.style.width = curWidth_done+'%';
	track_todo.style.width = curWidth_todo+'%';
	input.innerHTML = value;
	if ($el === 'temperature') {
		var color, val, colorInv;
		switch (true) {
			case (value==1):
				color = '#D0050B';
				colorInv = '#0B2BFB';
				val = 'Very Cold';
				break;
			case (value==2):
				color = '#0055A5';
				colorInv = '#EF7F01';
				val = 'Cold';
				break;
			case (value==3):
				color = '#6AC6F2';
				colorInv = '#FFF272';
				val = 'Fresh';
				break;
			case (value==4):
				color = '#FFFFFF';
				colorInv = '#FFF';
				val = 'Normal';
				break;
			case (value==5):
				color = '#FFF272';
				colorInv = '#6AC6F2';
				val = 'Warm';
				break;
			case (value==6):
				color = '#EF7F01';
				colorInv = '#0055A5';
				val = 'Hot';
				break;
			case (value==7):
				color = '#D0050B';
				colorInv = '#0B2BFB';
				val = 'Very Hot';
				break;

		}
		input.innerHTML = val;
		track_done.style.backgroundColor = color;
		track_todo.style.backgroundColor = colorInv;
	}
}
// ON LOAD PAGE I LOAD THE INPUT RANGE FUNCTION
window.onload = function(){
	var elems = document.getElementsByClassName("range");
	for(var i=0;i<elems.length;i++) {
		myFunction(elems[i].getAttribute('name'))
	}
};
//FUNCTION FOR STEP FOR AND RESULT
function formSubmit(e, action) {
	e.preventDefault();
	var button = document.getElementById('form_next_submit');
	var elems = document.querySelectorAll('form .row');
	var id = button.getAttribute('data-id') ? parseInt(button.getAttribute('data-id')) : 0;
	var form =document.getElementById('form_test');
	var resultTag = document.getElementById('result');
	if (action === 'next') {
		if (id < elems.length - 1) {
			elems[id].style.display     = 'none';
			elems[id + 1].style.display = 'block';
			button.setAttribute('data-id', id + 1);
			if (id == elems.length - 3) {
				button.innerHTML = 'RESULT';
			}
			if (id == elems.length - 2) {
				var formData = serialize(form),
					result = '';
				readTextFile("./city.json", function(text){
					var data = JSON.parse(text).cities;
					console.log(data);
					console.log(formData['temperature']);
					switch (parseInt(formData['temperature'])) {
						case 1:
							result = 'Berlin';
							break;
						case 2:
							result ='Munich';
							break;
						case 3:
							result ='New York';
							break;
						case 4:
							result ='Tokyo';
							break;
						default:
							result ='Sidney';
							break
					}
					var selCity = filterByProperty(data, 'city', result)[0];
					resultTag.innerHTML = '<h5>'+selCity['city']+'</h5><img src="'+selCity['image']+'">';
					document.getElementById('footer_control').style.display = 'none';
					document.getElementById('intro').style.display = 'none';
				});
			}
		}

	} else {
		if (id > 0) {
			elems[id].style.display     = 'none';
			elems[id -1].style.display = 'block';
			button.setAttribute('data-id', id - 1);
			button.innerHTML = 'NEXT';
		}
	}
}
// FUNCTION TO SERIALIZE THE FORM DATA
function serialize(form, evt){
	var evt    = evt || window.event;
	evt.target = evt.target || evt.srcElement || null;
	var field = '', query=new Array();
	if(typeof form == 'object' && form.nodeName == "FORM"){
		for(i=form.elements.length-1; i>=0; i--){
			field = form.elements[i];
			if(field.name && field.type != 'file' && field.type != 'reset'){
				if(field.type == 'select-multiple'){
					for(j=form.elements[i].options.length-1; j>=0; j--){
						if(field.options[j].selected){
							query[field.name] = encodeURIComponent(field.options[j].value).replace(/%20/g,'+');
						}
					}
				}
				else{
					if((field.type != 'submit' && field.type != 'button') || evt.target == field){
						if((field.type != 'checkbox' && field.type != 'radio') || field.checked){
							query[field.name]  = encodeURIComponent(field.value).replace(/%20/g,'+');
						}
					}
				}
			}
		}
	}
	return query;
}
//FUNCTION TO GET THE JSON FILE
function readTextFile(file, callback) {
	var rawFile = new XMLHttpRequest();
	rawFile.overrideMimeType("application/json");
	rawFile.open("GET", file, true);
	rawFile.onreadystatechange = function() {
		if (rawFile.readyState === 4 && rawFile.status == "200") {
			callback(rawFile.responseText);
		}
	}
	rawFile.send(null);
}
// FUNCTION TO FILTER THE ARRAY DATA
function filterByProperty(array, prop, value){
	var filtered = [];
	var new_key = 0;
	for (var key in array) {
		var obj = array[key];
		var item = obj;
		if (prop instanceof Array) {
			prop.map(function (val, i) {
				if (val instanceof Array) {
					if (item[val[0]][val[1]].toLowerCase().search(value.toLowerCase()) !== -1) {
						filtered[new_key] = item;
					}
				} else {
					if (item[val].toLowerCase().search(value.toLowerCase()) !== -1) {
						filtered[new_key] = item;
					}
				}
			});
		} else if (typeof item[prop] !== 'undefined') {
			if (item[prop].toLowerCase().search(value.toLowerCase()) !== -1) {
				filtered.push(item);
			}
		}
		new_key++;

	}

	return filtered;

}