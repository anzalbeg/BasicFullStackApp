var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var cfenv = require('cfenv');
var Cloudant = require("cloudant"),
    cloudant = Cloudant("https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com");
var request = require('request');
// create a new viewing engine
app.set('views', path.join(__dirname, 'views'));
// create a new Temaplting engine
app.engine('html', require('ejs').renderFile);
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.set('view engine','html');
//session managment
app.use(session({secret: 'ssshhhhh'}));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


var sess;
var revId;
var sessionIds = [];
var loginuser=[];

var i=0;
var insert=true;
var register=false;


/* GET home page. */
app.get("/", function(req, res, next) {
    sess = req.session;
    if (sess.email) {
                     var json={ "selector": { "_id": { "$gt": 0 }, "USERS.email":sess.email }, "fields": [ "USERS.photo" ], "sort": [ { "_id": "asc" } ] };
                    request({
                                url: "https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com/user_info/_find",
                                method: "post",
                                json: true,
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: json
                            }, function(error, body) {
                                if (error) {
                                    console.log(error.message);
                                } else {
                                    if (body.body.docs.length > 0) {
                                            sess._src=body.body.docs[0].USERS.photo;
                                            // console.log("sess._src=----" +sess._src);
                                    } 
                                }
                            });
        res.render("dashboard.html", {
              username: sess.username,
                    sessionId: sess.sessionId,
                    src:sess._src,
                    email:sess.email,
                    pass:sess.pass,
                    dob:sess.dob,
                    status:sess.status
        });
    } else
        res.render("index.html");
});

app.get("/login", function(req, res, next) {
    sess = req.session;
    if (sess.email) {
                    var json={ "selector": { "_id": { "$gt": 0 }, "USERS.email":sess.email }, "fields": [ "USERS.photo" ], "sort": [ { "_id": "asc" } ] };
                    request({
                                url: "https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com/user_info/_find",
                                method: "post",
                                json: true,
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: json

                            }, function(error, body) {
                                if (error) {
                                    console.log(error.message);
                                } else {
                                    
                                    if (body.body.docs.length > 0) {
                                            sess._src=body.body.docs[0].USERS.photo;
                                           // console.log("sess._src=----" +sess._src);
                                    } 
                                }
                            });
        res.render("dashboard.html", {
              username: sess.username,
                    sessionId: sess.sessionId,
                    src:sess._src,
                    email:sess.email,
                    pass:sess.pass,
                    dob:sess.dob,
                    status:sess.status
        });
    } else
        res.render("index.html");
});

app.post("/loginCheck", function(req, res, next) {
    sess = req.session;
    var sid = req.sessionID;
    var email = req.body.email;
    var password = req.body.password;
    var json = {
        "selector": {
            "_id": {
                "$gt": 0
            },
            "USERS.email": {
                "$eq": email
            },
            "USERS.password": {
                "$eq": password
            }
        },
        "fields": [
        ],
        "sort": [{
            "_id": "asc"
        }]
    };
    request({
        url: "https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com/user_info/_find",
        method: "post",
        json: true,
        headers: {
            "content-type": "application/json"
        },
        body: json

    }, function(error, body) {
        if (error) {
            console.log(error.message);
        } else {
          //  console.log("body=----" + JSON.stringify(body.body));
            if (body.body.docs.length > 0) {
               // console.log("-- body.docs[0].USERS.type ---" + body.body.docs[0].USERS.type);
                //console.log("-- body.docs[0].USERS.names ---" + body.body.docs[0].USERS.username);
                //console.log("-- body.docs[0].USERS.email ---" + body.body.docs[0].USERS.email);

                    sess._id=body.body.docs[0]._id;
                    sess._rev=body.body.docs[0]._rev;
                    sess.email = body.body.docs[0].USERS.email;
                    sess.pass=body.body.docs[0].USERS.password;
                    sess.username = body.body.docs[0].USERS.username;
                    sess.type = body.body.docs[0].USERS.type;
                    sess.country=body.body.docs[0].USERS.country;
                    sess.number=body.body.docs[0].USERS.number;
                    sess.dob=body.body.docs[0].USERS.dob;
                    sess.src=body.body.docs[0].USERS.photo;
		    sess.status=body.body.docs[0].USERS.status;
                    sess.sessionId = sid;
                    loginuser.push({'username':sess.username,'sessionId':sid});
                    res.send("validUser")
            } else {
                res.send("invalidUser");
            }
        }
    });
});

app.get('/getLoginUser',function(req,res){
       res.send(loginuser);

});

app.get('/register',function(req,res){
       res.render("register.html");

});

app.post("/login", function(req, res) {
    sess = req.session;
    console.log("src in session is---"+sess.src);
    if(sess.email && sess.username){
            var json={ "selector": { "_id": { "$gt": 0 }, "USERS.email":sess.email }, "fields": [ "USERS.photo" ], "sort": [ { "_id": "asc" } ] };
                    request({
                                url: "https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com/user_info/_find",
                                method: "post",
                                json: true,
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: json

                            }, function(error, body) {
                                if (error) {
                                    console.log(error.message);
                                } else {
                                   // console.log("body=----" + JSON.stringify(body.body));
                                    if (body.body.docs.length > 0) {
                                            sess.src=body.body.docs[0].USERS.photo;
                                           // console.log("sess._src=--post call--" +sess.src);
                                    } 
                                }
                            });
    	res.render("dashboard", { 
                     username: sess.username,
                    sessionId: sess.sessionId,
                    src:sess.src,
                    email:sess.email,
                    pass:sess.pass,
                    dob:sess.dob,
                    status:sess.status
                });
    }
    else {
        res.redirect("/");
    }
});

 function readUserProfile (req, res, next) {
  console.log('readUserProfile function called');
  next()
}


app.post("/setuserimage", function(req, res) {
    var src = req.body.src;
     sess = req.session;
        if(sess.email && sess.username){
                     var jsonupdate= {  
                                        "_id": sess._id,
                                        "_rev": sess._rev,
                                        "USERS": {
                                            "username": req.body.username,
                                            "password": req.body.password,
                                            "email":    req.body.email,
                                            "country": sess.country,
                                            "number": sess.number,
                                            "type": sess.type,
                                            "dob": req.body.dob,
                                            "status":req.body.status,
                                            "photo":src
                                        }
                                    };
                                    console.log("updated json is ----"+JSON.stringify(jsonupdate));
                                        request({
                                            url: "https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com/user_info/"+sess._id,
                                            method: 'PUT',
                                            json: true,
                                            headers: {
                                                "content-type": "application/json"
                                            },
                                            body: jsonupdate

                                        }, function(error, body) {
                                            if (error) {
                                                try {
                                                    throw error;
                                                } catch (error) {
                                                    console.log("error in updateing userprofile phto doc");
                                                }
                                            } else {
                                                //console.log("body=-userprofile updated db---" + JSON.stringify(body.body));
                                                var jsonobj=JSON.parse(JSON.stringify(body.body));
                                                console.log("jsonobj-----ok--"+jsonobj.ok);

                                                if (jsonobj.ok) {
                                                    sess._id=jsonobj.id;
                                                    sess._rev=jsonobj.rev;
                                                    //insert=false;
                                                    res.send("success");
                                                } else {
                                                    res.send("invalidUser");
                                                }
                                            }
                                        });
        }
        else {
            res.redirect("/");
        }
    
});
//logout action
app.get("/logout", function(req, res, next) {
    sess = req.session;
    var sessionIdLocal=req.param("sessionId");
    for(var i=0;i<loginuser.length;i++){
        if(loginuser[i].sessionId==sessionIdLocal){
            req.session.destroy(function(err) {
		        if (err) {
		        } else {
                    loginuser.splice(i,1);
		            res.redirect("/");
		        }
		    });
            break;
        }
    }
});




app.post("/register/post", function(req, res) {
    var json=req.body.data;
    console.log("json---"+JSON.stringify(json));
                    request({
                                url: "https://86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix:123cca80c9ec5e3a0aeb6e0c7455091a76479329ce1e470e7ba55464f74a2ac5@86a605b3-0605-4cd3-adb7-22247578dbf5-bluemix.cloudant.com/user_info",
                                method: "post",
                                json: true,
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: json

                            }, function(error, body) {
                                if (error) {
                                    console.log(error.message);
                                } else {
                                    console.log("body.body.ok=-"+body.body.ok);
                                    console.log("body.body-=-"+body.body);
                                    if (body.body.ok==true) {
                                       // register=true;
                                        console.log("register is---"+register);
                                           res.send(body.body.ok);
                                           // console.log("sess._src=--post call--" +sess.src);
                                    } 
                                    else{
                                        res.send('notok');
                                    }
                                }
                            });
    	
    
});




var appEnv = cfenv.getAppEnv();
// start server on the specified port and binding host
app.listen(appEnv.port, function() {

    console.log("server starting on " + appEnv.url);
});
