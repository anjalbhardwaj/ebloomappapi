/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[
                                                                                                                                                                                                                                
 * Written By  : 
 * Description :
 * Modified By :
 */	

 const 	request 			= require('request'),
		path				= require('path'),
		uuidv1              = require('uuid/v1'),
		q                   = require('q'),
        helper              = require('../../common/helpers/index'),
		config				= require('../../config').init(),
		commonModel		    = require('../../models/common'),
		_userModel 		    = require('../../models/user');
        _reportModel        = require('../../models/report/report_model');
		
        let constant      = require('../../config/constants');
let report = {};


/**
 * This function is using to get report list
 * @param        :
 * @returns      :
 * @developer    : Dushyant sharma
 * @modification :  
 */
report.getReportList = async (req,res) => {

    let userId = await helper.getUUIDByToken(req);
    // console.log('userId========>',userId);

    if( userId ){

        let sql     = 'SELECT rt_id, rt_uuid, rt_message FROM report_type WHERE rt_enable = ?',

        result = await commonModel.commonSqlQuery(sql, ['0'], true);
        //    console.log('result==========>>',result);
        if( result ){
            let obj = {data : result}

            helper.successHandler( res, {
                status  : true, 
                payload : obj
            }, 200 );

        } else {

            helper.errorHandler( res, {
                status  : false,
                code    : "CCS-E1000",
                message : 'something went wrong' 
            }, 200 );
        }

    } else {

        helper.errorHandler( res, {
			status  : false,
			code    : "CCS-E1000",
			message : 'Not authorize please try again.' 
		}, 401 );
    }

}

/**
 * This function is using to get report list
 * @param        :
 * @returns      :
 * @developer    : Dushyant sharma
 * @modification :  
 */
 report.reportSomeone = async (req,res) => {

    let userId  = await helper.getUUIDByToken(req),
        conObj  = await constant.getConstant(),
        appType = 'KnowEx Bitcoin';
    if( userId ){
         
        if( req && req.body &&  req.body.reportType && req.body.reportTo && req.body.createdById && req.body.reportId ) {
                     console.log('request=====>', req.body)

            let result = await _reportModel.reportSomeone(req.body,userId);
                    
            if( result ) {
                
                let sql  = `SELECT u_name, u_email FROM user WHERE u_id = ?`,
                userData = await common.commonSqlQuery(sql, [userId], true);
                     console.log('userData======>>>>>>',userData);

                if( req.body.appType != null ){

                    appType = req.body.appType
                } 
                
                if( userData ){
    
                    let text    = await commonModel.getEmailText('Report');
                    console.log('text====',text);
                    if (text) {

                        let dataEmail = text.replace('USERNAME',userData[0].u_name);
                        dataEmail = dataEmail.replace('APPTYPE',appType);
                       let email         = userData[0].u_email,
                        emailArray    = {
                            to      : email,
                            from    : conObj.SITE_EMAIL,
                            subject : 'Report',
                            body    : dataEmail
                        };
                        console.log('email======>>>',email);    
                        commonModel.sendEmails( emailArray );

                    }
                    
                    // console.log("sendemail",a);
                }
                // console.log('result====>')

                helper.successHandler(res, {
                    status  : true,
                    message :'Report Successfully Send',
                });

            } else {
                console.log('result else========>>>>>');

                helper.successHandler( res, {
                    status  : false,         
                    message :'something went wrong..!'

                });

            }

        } else {
            console.log('req.body==============>>>>else');
            helper.successHandler( res, {
                status  : false,
                message :'something went wrong'
            });
        }

    } else {

        helper.successHandler( res, {
			status  : false,
			code    : "CCS-E1000",
			message : 'Not authorize please try again.' 
		}, 401 );
    }

}

module.exports = report;