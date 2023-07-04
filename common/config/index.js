/* #################################
	Project		 : Ebloomapi
	Module		 : Node Server
    Created		 : 2021-11-14
	Developed By : GlobalTouch
    Description	 : Mysql configuration file.
*/

 exports.init = function() {

 	return {
 		"serverurl" : "https://app.ebloom.gr/",
 		"mysql": {   
 			"client"			: "mysql",
 			
			"host"              : "159.69.58.67",
			// "host"				: "linuxzone120.grserver.gr",
			"user"              : "globalto184946_ebloom_user",
			// "user"              : "Ebloomappuser", 
			"password"			: "K3325zu*a!@",
 			"port" 				: 3306, 
			"database"          : "globalto184946_ebloom_db",
			// "database"			: "ebloom_app",
 			"timezone"			: "utc",
 			"multipleStatements": true,
 			"charset"			: "utf8"
 		},
 		"secret": "@&*(29783-d4343daf4dd*&@&^#^&@#"
 	}
 }; 

// exports.init = function() {
// 	return {
// 		"serverurl" : "https:api.boomceleb.com/",
// 		"mysql": {   
// 			"client"			: "mysql",
// 			"host"				: "54.209.34.0",
// 			"user"				: "root",
// 			"password"			: "M5cVBOO8lSI1XK",
// 			"port" 				: 3306,
// 			"database"			: "glimpsters_live",
// 			"timezone"			: "utc",
// 			"multipleStatements": true,
// 			"charset"			: "utf8"
// 		},
// 		"secret": "@&*(29783-d4343daf4dd*&@&^#^&@#"
// 	}
	
// };


