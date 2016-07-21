// JavaScript Document
// add event listener

$(document).ready(function() {
	deleteAllCookies();

	$( "#userform" ).submit(function( event ) {
		console.log( "--> Handler for submit() called." );
		
		var is_validated = validate(event);
		
		if(is_validated){
			var name = $("#nameinput").val();
			var birth = $("#birthdateinput").val();
			var id = $("#idinput").val();

 			var data = {
                'name': name,
                'birth': birth,
                'id': id,
            };

            var dataToSend = JSON.stringify(data);

			createCookie('name', name);
			createCookie('birth', birth);
			createCookie('id', id);
			showAllCookies();
			// window.location.href = "review.html";
		    $.ajax({
		        url: '/add',
		        type: 'POST',
		        data: dataToSend,
		        
		        success: function (jsonResponse) {
		            var objresponse = JSON.parse(jsonResponse);
		            console.log(objresponse);

		            // $("#responsefield").text(objresponse);

		        },
		        error: function () {
		            // $("#responsefield").text("Error to load api");
		            console.log("Error to load api")
		        }
		    });
    	}
	});
});

// Javascript Style create and read cookie
function createCookie(name, value) {
	$.cookie(name, value);
	// console.log("Create Cookie -> " + cookie_str);
}

function readCookie(name){
	return $.cookie(name)
}

// JQuery Style Set and Get Cookie
function deleteAllCookies() {
	var cookies = $.cookie();
	for(var cookie in cookies) {
	   $.removeCookie(cookie);
	}
}

function showAllCookies(){
	var cookies = $.cookie();
	var count = 1;
	for(var cookie in cookies) {
	   console.log(count + " " +  $.cookie(cookie));
	   count = count + 1
	}
}

function setCookie(name,value,expires){
	document.cookie = name + "=" + value + ( (expires==null) ? "" : ";expires=" + expires.toGMTString() )

}

function getCookie(name) {
    var cname = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(cname) == 0) {
            return c.substring(cname.length,c.length);
        }
    }
    return "";
}

// function write_cookie(){
//    var name = $("#nameinput").val(),
//    var birthdate = $("#birthdateinput").val();
//    var id = $("#idinput").val();
//    $.cookie('name',name);
//    $.cookie('birthdate',birthdate);
//    $.cookie('id',id);
// }



// $('#userform').submit(validate);

// add masking
$(".socialSecLabel input").mask("999-99-9999");

// add datepicker
$( ".birthLabel input" ).datepicker();

// function that executes when click event is fired
function validate(evt){
	console.log("--> start validation");
	// alert("start validation");

	evt.preventDefault(); // stop button from submitting a form or link from going to a URL

	// console.log(this);
	var errorCount = 0; // always start error count at 0


	var $target = $(evt.currentTarget);// the element you clicked on
	var $form = $target.closest('form');


	var $nameLabel = $form.find('.nameLabel'); // set the label element to a variable for convinience and readability
	var $nameInput = $nameLabel.find('input'); // get the input field inside of that label
	var nameVal = $nameInput.val(); // get the value inside of that field

	//alert(birthVal);
	if(nameVal === ''){ // check to see if the input is blank
	$nameLabel.addClass('hasError'); // add the class that shows the error and changes colors
	errorCount++; // add 1 to this number, because this has an error: we'll use this later
	  }
	else{
	$nameLabel.removeClass('hasError');
	}


	var $birthLabel = $form.find('.birthLabel'); // set the label element to a variable for convinience and readability
	var $birthInput = $birthLabel.find('input'); // get the input field inside of that label
	var birthVal = $birthInput.val(); // get the value inside of that field

	//alert(birthVal);
	if(birthVal === ''){ // check to see if the input is blank
		$birthLabel.addClass('hasError'); // add the class that shows the error and changes colors
		errorCount++; // add 1 to this number, because this has an error: we'll use this later
	  }
	else{
		$birthLabel.removeClass('hasError');
	}

	var $socialSecLabel = $form.find('.socialSecLabel'); // set the label element to a variable for convinience and readability
	var $socialSecInput = $socialSecLabel.find('input'); // get the input field inside of that label
	var socialSecVal = $socialSecInput.val(); // get the value inside of that field

	//alert(birthVal);
	if(socialSecVal === ''){ // check to see if the input is blank
		$socialSecLabel.addClass('hasError'); // add the class that shows the error and changes colors
		errorCount++; // add 1 to this number, because this has an error: we'll use this later
	  }
	else{
		$socialSecLabel.removeClass('hasError');
	}

	// check to see if there are any errors in the form
	if(errorCount > 0){
		$form.addClass('hasError');
		$form.removeClass('hasSuccess');
		return false
	}
	else{
		$form.removeClass('hasError');
		$form.addClass('hasSuccess');
		return true
	}
  
}



//jquery
// $(document).ready(function() {
//  	$('.submit_button').click(function() {
// 		doSomething();
// 	});
//  });


    // var content_birthdate = $('#birthdate').val();
    // var listElement = $("<li></li>").text(content_birthdate);
    // $('#birthdate_list').append(listElement);

    // var content_id = $('#id').val();
    // var listElement = $("<li></li>").text(content_id);
    // $('#id_list').append(listElement);
//	alert("Save")


 // $('#reset').click(function(e) {
 //     $('#name').empty();
 // });
// $(".submit_button a").on('click',function(){
//    var name = $("#nameinput").val(),
//    birthdate = $("#birthdateinput").val();
//    id = $("#idinput").val();
//    $.cookie('name',name);
//    $.cookie('birthdate',birthdate);
//    $.cookie('id',id);
// });

function doSomething(){
	// alert("Save");
	console.log($.cookie('name')); 
	var content_name = $.cookie('name');
    var listElement = $("<li></li>").text(content_name);
	$('#name_list').append(listElement);
}

