/*eslint-env jquery, browser*/
var email;
var password;
var siteUrl = window.location.origin + "/";
var jsonObj;
$( "form" ).submit(function( event ) {
	email=$("#email").val();
	password=$("#password").val();
	console.log("email---"+email);
	console.log("password---"+password);
	if(email ==="" && password===""){
		$("#emptyUser").css("display","block");
		event.preventDefault();
	} 
	else{
		$.ajax({
			url:siteUrl+"loginCheck",
			type:"POST",
			async:false,
			data:{email:email,password:password},
			success:function(data){
				  if (data !== null || typeof (data) !== 'undefined'){
				  	console.log("ajx response of login check is----"+data);
				  	if(data==="invalidUser"){
				  		$("#invalidUser").css("display","block");
				  		event.preventDefault();
				  	}
				  	else{
				  		jsonObj=JSON.parse(JSON.stringify(data));
						alert("logincheck response---->>>"+JSON.stringify(jsonObj));
						// var div = document.getElementById('#loginUsers');
						// alert("div---id"+div);
						// 	div.innerHTML = div.innerHTML + "<div class=\"user-panel\">"+
						// 	"<div class=\"pull-left image\">"+
						// 	"<img src=\"dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">"+
						// 	"</div>"+
						// 	"<div class=\"pull-left info\">"+
						// 	"<p>"+jsonObj[i].name+"</p>"+
						// 	"<a href=\"#\" onclick=\"startChat('" +jsonObj[i].sessionId + "','"+ jsonObj[i].name+"')\";><i class=\"fa fa-circle text-success\"></i> Online</a>"+
						// 	"</div>"+
						// 	"</div>";
				  	}
					
				}
			},
			error: function(jqXHR, textStatus, errorThrown) {
			  console.log(textStatus, errorThrown);
			}
		});
	}
});