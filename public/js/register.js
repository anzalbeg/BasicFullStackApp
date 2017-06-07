
var siteUrl = window.location.origin + "/";

function register(){
var flag=true;
 
    var values = {"USERS":{ "country": "India","number": "9891791198","type": "user","photo":"dist/img/user2-160x160.jpg"}};
    $.each($('#myForm').serializeArray(), function(i, field) {
        values.USERS[field.name] = field.value;
            if(values.USERS[field.name]==""){
                $('[name='+field.name+']').css('border-color','#ff0000');
                $('#emptyUser').css('display','block');
               // event.preventDefault();
                flag=false;
            }
               
           
            $("[name="+field.name+"]").keypress(function(){
                $('[name='+field.name+']').css('border-color','');
            });
          
    });
      if(flag){
           $('#emptyUser').css('display','none');
          $('#registerloader').show();
               alert("values -********--"+JSON.stringify(values));
               
                $.ajax({
                        url:siteUrl+"register/post",
                        type:"POST",
                        async:true,
                        data:{data:values},
                        success:function(data){
                            if (data !== null || typeof (data) !== 'undefined'){
                                console.log("ajx response of login check is----"+data);
                                if(data===true){
                                   $('#registerloader').css('display','none');
                                   $("#myModal").modal('show');
                                }
                                else{
                                    $("#register").css("display","block");
                                }
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown) {
                        console.log(textStatus, errorThrown);
                        }
	        	});
            }
}