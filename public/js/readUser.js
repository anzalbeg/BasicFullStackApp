 /*eslint-env browser, jquery*/
 //$(document).ready(function() {
    
 //});
 //var socket = io.connect();
 var socket = io.connect('http://localhost:3000', {
													reconnection: true,
													reconnectionDelay: 1000,
													reconnectionDelayMax: 5000,
													reconnectionAttempts: Infinity
							});
 var username1;
 var room = '';
 var connected = false;
 var siteUrl = window.location.origin + "/";
 var loginusername= $("#loginusername").text();
 var timeout;
 var typing;

 getLoginUser();	
 function getLoginUser(name=0) {
	 name =0;
	 console.log("----name----"+name);
	 var loginArray=[];
     $.ajax({
         url: siteUrl + "getLoginUser",
         type: "GET",
         async: true,
         success: function(data) {
             if (data !== null || typeof(data) !== "undefined") {
				 var jsonObj=JSON.parse(JSON.stringify(data));
								 if(jsonObj.length>0){
										//console.log("-- getLoginUser.length------  --" + jsonObj.length);
										$("#loginUsers").empty();
										for (var i = 0; i < jsonObj.length; i++) {
											username1=jsonObj[i].username;
											loginArray.push(jsonObj[i].username);
										}
										  // console.log("loginArray----------"+loginArray);
											var index=loginArray.indexOf(loginusername);
											if(index!== -1){
										     	loginArray.splice(index,1);
										   	//	console.log("loginArray----after delete----"+loginArray);
											}
										if(loginArray.length>0){
											for (var i = 0; i < loginArray.length; i++) {
														$("#loginUsers").append(
														"<div class=\"user-panel\">" +
														"<div class=\"pull-left image\">" +
														"<img src=\"dist/img/user2-160x160.jpg\" class=\"img-circle\" alt=\"User Image\">" +
														"</div>" +
														"<div class=\"pull-left info\">" +
														"<p>" + loginArray[i] + "</p>" +
														"<a href=\"#\" onclick=\"startChat('" + loginArray[i] + "')\";><i class=\"fa fa-circle text-success\"></i> Online</a>" +
														"</div>" +
														"</div>"
												);
											}
										}
								}
								else{
									//console.log("first user");
								}
                 
             }
         }
     });
    setTimeout(getLoginUser, 2000);
 }

 					function showchatbox(){
						$('#startChatDiv').css('display','block');
						$(".direct-chat-primary").css('display','block');
					 }

					function startChat(username) {
							$("#chatwith").empty().append(username);
							showchatbox();
							socket.emit("connect2user",{'username':username});
							}
        
						socket.on('connect', function() {
							connected = true;
							if (username1) {
									alert("username- inside if----" + username1);
									socket.emit('login', {
											'username': username1
									});
							}
						});

				socket.on('chat start', function(data) {
						room = data.room;
					//	startChat(data.name); // some method which will show chat window
						//$('#startChatDiv').show();
				});

					function sendMessage() {
						var $messageForm = $('#send-message');
						var $messageBox = $('#message');
						var msg = {
								user: loginusername,
								message: $("#message").val()
						};
						if (connected) {
								socket.emit("message", {'msg':msg});
								$("#directChatMessageLeft").append("<div class=\"direct-chat-info clearfix\">" +
										"<span class=\"direct-chat-name pull-left\">" + loginusername + "</span>" +
										"<span class=\"direct-chat-timestamp pull-right\">" + new Date() + "</span>" +
										"</div>"+
										"<img class=\"direct-chat-img\" src=\"../dist/img/user1-128x128.jpg\" alt=\"message user image\">" +
										"<div class=\"direct-chat-text\">" +
										$("#message").val() +                                                                                                                                           
										"</div>");
								$("#message").val("");
						}
					}
					
					socket.on('message',function(data){
						$("#chatwith").empty().append(data.msg.user);
						showchatbox();
						$("#directChatMessageRight").append("<div class=\"direct-chat-info clearfix\">" +
							"<span class=\"direct-chat-name pull-left\">" + data.msg.user + "</span>" +
							"<span class=\"direct-chat-timestamp pull-right\">" + new Date() + "</span>" +
							"</div>" +
							"<img class=\"direct-chat-img\" src=\"../dist/img/user1-128x128.jpg\" alt=\"message user image\">" +
							"<div class=\"direct-chat-text\">" +
							data.msg.message+
							"</div>");
					});

				socket.on('disconnect', function(data) { // handle server/connection falling
						console.log('Connection fell or your browser is closing.');
				});

				function timeoutfunction(){
						typing=false;
						socket.emit('typing',false);
				}
				
				$("#message").keyup(function(){
						console.log("key up hapend..");
						typing=true;
						socket.emit('typing','Typing......');
						clearTimeout(timeout);
						timeout=setTimeout(timeoutfunction,1000);
				});
				
				socket.on('typing',function(data){
					 if (data) {
						$('.typing').attr("placeholder", data);
					} else {
						$('.typing').attr("placeholder", 'Type message');
					}
				});

				var leave_chat = function() { // call this when user want to end current chat
						if (connected) {
								socket.emit('leave room');
								socket.leave(room);
								room = '';
						}
				};
