
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[--]]                                                                                                                                                                                                                                                                                                                    
 * Written By  : 
 * Description :
 * Modified By :
 */

/* #################################
	Project		 : ebloom 
	Module		 : Node Server
    Created		 : 2021-11-14
	Developed By : Anshu Salaria 
    Description	 : Server configuration file.
*/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1";

const express			= require('express'),
    http 				= require('http'),
    cookieParser	    = require('cookie-parser'),
    helmet			    = require('helmet'),
    bodyParser 		    = require('body-parser'),
    nocache             = require('nocache'),
    jwt		            = require('jsonwebtoken'),
    fs		            = require('fs');
    // redis 		        = require('socket.io-redis');
    
    router		        = require('./application/routes/index');
    const config		= require('./common/config').init();
   

const app 	            = express();
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*'); //<-- you can change this with a specific url like http://localhost:4200
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    // res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    return next();
});

global.app = app;       
global.jwt = jwt;

app.set('port', process.env.PORT || 3000);
app.set('superSecret', config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());



app.use(express.static('assets'));

// app.use('/uploads', express.static('uploads'));
// app.use(express.static(__dirname + 'uploads'));
// app.use('/public',express.static(path.join(__dirname,'public')));
// app.use('/public/images',router);
app.use(cookieParser());
	app.use(nocache());


let server = http.createServer(app);
const socketio          = require("socket.io")(server, {
	pingInterval: 1000, // how often to ping/pong.
	pingTimeout: 2000 // time after which the connection is considered timed-out.
});

// const socketio          = require("socket.io");

const io    = socketio.listen(app.listen(app.get('port')));

global.io   = io;
// console.log('Global io--->');
// console.log(global.io);
router.init( app, '' , '' , '' );
console.log('Just Testing--->,');


// socketObj.init(io);

// io.on('connection', function (socket) {
//     console.log("new user connected !" , socket.id);
	
// 	socket.on('call',function(data){
// 		socket.emit('call', {socket_id :  socket.id});
// 		console.log("calll",data)
// 	}) 

// 	socket.on('data',function(data){
// 		socket.emit('init', {socket_id :  socket.id});
// 		console.log("dataaa",data)
// 	})
// 	socket.on('disconnect', async function (channel) {
// 		console.log("disconnect ------>>",socket.id)
// 	});
	
// });











