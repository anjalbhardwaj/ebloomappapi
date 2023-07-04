
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[
                                                                                    __/ |            
                                                                               |___/             
--]]                                                                                                                                                                                                                                                                                                                    
 * Written By  : 
 * Description :
 * Modified By :
 */


const 	request 		= require('request'),
    AWS                 = require('aws-sdk'),
    passwordHash 		= require('password-hash'),
    payloadChecker 		= require('payload-validator'),
    path				= require('path'),
    https				= require('https'),
    Stream				= require('stream'),
    fs					= require('fs'),
    // download            = require('image-downloader'),
    // {v1: uuidv1}        = require('uuid'),
    q                   = require('q'),
    Busboy              = require('busboy'),
    config				= require('../../common/config').init(),
    contestsModel	    = require('../models/contests_model'),
    commonModel		    = require('../models/common'),
    helper				= require('../../common/helpers/index'),
    constant 			= require('../../common/config/constants');
// ALTER TABLE `user` CHANGE `u_id` `u_id` INT(11) NOT NULL AUTO_INCREMENT, add PRIMARY KEY (`u_id`);			

let contests = {}



/**
*  This function is using to add contest
* @param         :
* @returns       :
* @developer     :  
* @modification  : Ashwani Kumar
*/
contests.addContests = async ( req, res ) => {
    
    let userId = await helper.getUUIDByTocken(req)

    if( userId && userId != ''){
        console.log('result======================>>>>>>>>>>>',req.body);

        if ( req && req.body && req.body.contestName  && req.body.startTime && req.body.endTime && req.body.contestType ) {

            let result = await  contestsModel.addContests(req.body,userId);

            if( result && result != '' ) {
               console.log('result======================>>>>>>>>>>>',result);
                // let dataObj = {
                //     contestId : result
                // }
                let obj = {
                    code    : "AAA-E2001",
                    message : 'Contest added Successfully ' ,
                    status  : true,
                    payload : { contestId : result }
                };
                helper.successHandler(res,obj);

            } else {
                let obj = {
                    message : 'Something went wrong.' ,
                    status : false
                };
                helper.successHandler(res,obj);

            }
          
        } else {

            let obj = {
                code : "AAA-E2001",
                message : 'All fields are required' ,
                status : false
            };
            helper.successHandler(res,obj);
        }
    } else {
    
        helper.errorHandler(res, {
            status 		: false,
            code        : "AAA-E1001",
            message		: "Unauthorized Error."
        }, 200);
    };
}


/**
* This function is used to upload contest image in AWS S3 bucket.
* @param     	:
* @developer 	: 
* @modified	    : Ashwani Kumar
*/
contests.uploadContestImage = async (req, res) => {

    let	userId            = await helper.getUUIDByTocken(req),
        conObj            = await constant.getConstant(),
        // uuid              = uuidv1(Date.now()),
        currentDateTime   = await helper.getPstDateTime('timeDate');

    if ( userId ) {
        
        const fields    = {},
        buffers         = {};

        let chunks          = [], fName, fType, fEncoding,
        // imagesToUpload      = [],
        imageToAdd          = {},
        contestId           = '',
        contestUid          = '';

        busboy = Busboy({ 
            headers: req.headers 
        });

        busboy.on('field', async (fieldname, val) => {
        
            fields[fieldname] = val;
        
        });

        busboy.on('file', async function(fieldname, file, filename, encoding, mimetype) {

            buffers[fieldname] = [] ;
        //   console.log('ccsddsff',filename.filename)
            let ext  = (path.extname(filename.filename).toLowerCase());
                
            if ( ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' ) {
                
                let obj =  {
                    status  : true,
                    code    :  "",
                    message : "invalid extension!",
                    payload : []
                };

                chunks.push(obj);
                file.resume();

            } else {

                contestId = fields.contestId,   
                contestUid = await commonModel.getRowById(contestId,'ct_id','ct_uuid','contests')   
                
                let newName = contestUid + ext;                
                fName       = newName.replace(/ /g,"_");
                fType       = mimetype;
                fEncoding   = encoding;
                file.on('data', function(data) {

                    buffers[fieldname].push(data);
                });
                
                imageToAdd = { 
                    fName, 
                    mimetype,
                    fEncoding,
                    fType,
                    ext,
                    fileBuffer:buffers[fieldname]
                };
                
                // imagesToUpload.push(imageToAdd);


            }

        });
    
        busboy.on('finish', async function() {
            
                 
                let fileObj = {

                    fileName        : imageToAdd.fName,
                    chunks          : imageToAdd.fileBuffer,
                    encoding        : imageToAdd.fEncoding,
                    contentType     : imageToAdd.fType,
                    uploadFolder    : conObj.UPLOAD_PATH + conObj.CONTESTS_UPLOAD_PATH + contestUid +'/'+  conObj.AWS_IMAGE_PATH

                },
                returnObj = await helper.uploadFile(fileObj);

                if( returnObj ){
                   let sql = "UPDATE contests SET ? WHERE ct_id = ?",
                       obj ={
                        ct_image      : imageToAdd.fName  ,
                        ct_updated_at : currentDateTime
                       }
                    result = await commonModel.commonSqlQuery(sql,[obj,contestId], true)

                    if( result ){

                        helper.successHandler(res,{
                            status : true,
                            message : 'Image Uploaded Successfully'
                        },200);
                    } else{

                        helper.errorHandler(res,{status: false},500)
                    }  

                } else {

                    helper.errorHandler(res,{status: false},500)

                }

                
        });

        return req.pipe(busboy);

    } else {

        helper.successHandler(res, {
            status 		: false,
            code        : "UIS-E1003",
            message		: "Unauthorized Error."
        }, 401);   

    }
}

/**
* This function is get user contests data
* @param     	: 
* @developer 	: Ashwani Kumar
* @modified	: 
*/
contests.getContestsData = async (req, res) => {

    let userId = await helper.getUUIDByTocken(req);
    
    if ( userId && userId != '' ) {
    
        if ( req && req.body ) {
    
            let userPostData = await contestsModel.getContestsData(userId,req.body);
    
            if ( userPostData && userPostData != false ) {
    
                helper.successHandler(res, {
                    status : true,
                    message : 'Operation  successfully  Performed',
                    payload : userPostData
                }, 200);
    
            } else {
    
                helper.successHandler(res, {
                    status  : false,
                    message : 'Something went wrong.'
                }, 200);
            };
        } else {
    
            helper.errorHandler(res, {
    
                status 	: false,
                code 	: 'AAA-E1002',
                message : 'Something went wrong.'
            }, 200);
        };
    } else {
        
        helper.errorHandler(res, {
            status 		: false,
            code        : "AAA-E1001",
            message		: "Unauthorized Error."
        }, 200);
    };
};

/**
* This function is get user contests Detail 
* @param     	: 
* @developer 	: 
* @modified	    : 
*/
contests.getContestsDetail = async (req, res) => {

    let userId = await helper.getUUIDByTocken(req);
    
    if ( userId && userId != '' ) {
    
        if ( req && req.body ) {
    
            let userPostData = await contestsModel.getContestsDetail(userId,req.body);
    
            if ( userPostData && userPostData != false ) {
    
                helper.successHandler(res, {
                    status : true,
                    message : 'Operation  successfully  Performed',
                    payload : userPostData
                }, 200);
    
            } else {
    
                helper.successHandler(res, {
                    status  : false,
                    message : 'Something went wrong.'
                }, 200);
            };
        } else {
    
            helper.errorHandler(res, {
    
                status 	: false,
                code 	: 'AAA-E1002',
                message : 'Something went wrong.'
            }, 200);
        };
    } else {
        
        helper.errorHandler(res, {
            status 		: false,
            code        : "AAA-E1001",
            message		: "Unauthorized Error."
        }, 200);
    };
};


/**
*  This function is used to delete contests 
* @param     : contestUuid
* @returns   : 
* @developer : 
*/
contests.contestsDelete = async ( req , res ) => {

    let userId   = await helper.getUUIDByTocken(req);

    if ( userId ) {

        console.log('deleteContests in ========================>>>>1111111111111111');

        if ( req && req.body && req.body.contestUuid ) { 

            console.log('deleteContests in ========================>>>>2222222222222222222',req.body.contestUuid)

            let contestUuid  =  req.body.contestUuid ; 

            let userUuid    = await  commonModel.getRowById( userId , 'u_id' , 'u_uuid', 'user');

            if ( userUuid ) {
                console.log('deleteContests in ========================>>>>333333333333333333333333');

                let obj = {
                    contestUuid   :  contestUuid,
                    userUuid      :  userUuid,
                    userId        :  userId
                };
                let result = await contestsModel.contestsDelete(obj);

                if ( result ) {

                    helper.successHandler(res, {
                        status : true,
                        message : ' Contest Deleted successfully'
                    });

                } else {

                    helper.successHandler(res, {
                        code 	: 'UIS-E1000',
                        message : 'something went wrong.',
                        status  : false
                    });

                }

                
            } else {

                helper.successHandler(res, {
                    code    : 'UIS-E1003',
                    message : 'something went wrong.',
                    status  : false
                });   

            }
            
        } else {

            helper.successHandler(res, {
                code    : 'UIS-E1004',
                message : 'All fields are mandatory.',
                status  : false
            }); 

        }

    } else {

        let obj = {
            status 		: false,
            code        : "UIS-E1005",
            message		: "Unauthorized Error."
        };

        helper.successHandler(res, obj, 401);

    }

}


module.exports = contests;