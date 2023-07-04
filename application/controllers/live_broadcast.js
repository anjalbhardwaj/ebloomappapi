
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[
                                                                              |___/             
--]]                                                                                                                                                                                                                                                                                                                    
 * Written By  : 
 * Description :
 * Modified By :
 */

const q 				= require('q'),
fs 				 	= require('fs'),
path 				= require('path'),
AWS                 = require('aws-sdk'),
Busboy 				= require('busboy'),
common              = require('../models/common'),
helper   		    = require('../../common/helpers'),
constant            = require('../../common/config/constants'),
config				= require('../../common/config').init(),
axios               = require("axios"),
liveBroadcastModel  =  require('../models/live_broadcast_model');

let liveBroadcast      = {};

/**
* Used to channel broadcast Video.
* @developer   : Dushyant Sharma
* @modified    :
* @params      :
*/

liveBroadcast.liveBroadcast = async  (req, res) => {

    let userId      = await helper.getUUIDByTocken(req),
        startData   = null;

    if (userId) {
        console.log('body body  body  body  body ===========>>',userId);

        let userUuid = await common.getRowId(userId,'u_id','u_uuid','user');
        console.log('body body  body  body  body ===========>>',req.body);
        console.log('body body  body  body  body userUuid ===========>>',userUuid);

        if( req.body && req.body.contestUuid ){
             
            let contestId  =  await common.getRowId(req.body.contestUuid,'ct_uuid','ct_id', 'contests');

            if( req.body.status == 'CHECK' ){

                let insertedId = await liveBroadcastModel.insertJoinBroadcast(req.body,userId)
                    console.log('insertJoinBroadcast ===========>>11111111111111111',insertedId);
                if( insertedId ){
                    let isPublisher = '';
                    if( req.body.isPublisher ){
                        isPublisher = req.body.isPublisher;
                    } 
                   
                    let broadcastSql   = `SELECT lb_id, lb_uuid,lb_views_count,lb_comments_count  FROM live_broadcast WHERE lb_fk_ct_uuid = ? AND lb_status = 'LIVE'`; 
                        broadcastUid   = await common.commonSqlQuery( broadcastSql, [ req.body.contestUuid ],true ),
                        streamId       = await common.getRowId(broadcastUid[0].lb_id,'lb_id','lb_uuid','live_broadcast'),
                        agoraToken     =  helper.agoraToken({channelId : streamId, uid:userId,isPublisher : isPublisher});
                        console.log('streamId streamId streamId streamId',streamId,agoraToken)

                        console.log( "agoraToken======>>>>>>>", agoraToken );
                    if( agoraToken ){

                        let    userTypeSql       = 'SELECT lbud.lbud_user_type AS userType FROM live_broadcast_users_detail as lbud WHERE lbud.lbud_fk_ch_uuid = ? AND lbud.lbud_fk_lb_uuid = ? AND lbud_fk_u_uuid = ? ',
                        userType      = await common.commonSqlQuery(userTypeSql,[req.body.contestUuid,streamId,userUuid] )
                        userBroadcastType = '';

                        if( userType && userType.length > 0 ){

                            userBroadcastType =  userType[0].userType

                        }
        
                        let data = {
                            agoraToken            : agoraToken.token,
                            agoraUid              : agoraToken.uid,
                            channelBroadcastName  : agoraToken.channelName,
                            role                  : agoraToken.role,
                            userType              : userBroadcastType,
                            liveViewCount         : broadcastUid[0].lb_views_count,
                            liveCommentCount      : broadcastUid[0].lb_comments_count,
                            isPublisher           : req.body.isPublisher,
                            broadcastUuid         : streamId,
                            startData             : startData,
                        }

                        console.log('liveToken liveTokenliveToken',data)

                        let obj = {
                            status  : true,
                            message : "Someone is Live",
                            payload : data
                        };
                        helper.successHandler(res, obj, 200);
                        
                    } else {

                        let obj = {
                            status  : false,
                            message : "Something Went Wrong",
                            payload : {}
                        };
                        helper.successHandler(res, obj, 200);
                    }

                } else {
                    console.log('Something Went Wrong...1111111111111111111111111')
                    let obj = {
                        status  : false,
                        message : "Something Went Wrong...",
                        payload : {}
                    };
                    helper.successHandler(res, obj, 200);

                }
                 
            } else {

                let insertedId = await liveBroadcastModel.insertContestBroadcast(req.body,userId);
                // console.log('liveBroadcastVideoAudio ===========>>11111111111111111',insertedId);

                if( insertedId ){

                    let isPublisher = '';
                    if( req.body.isPublisher ){
                        isPublisher = req.body.isPublisher;
                    } 
                    console.log('req.body.isPublisher req.body.isPublisher === >>22222222222222222',req.body.isPublisher)
                    console.log('req.body.isPublisher req.body.isPublisher === >>2222222222222222222',isPublisher)

                    let streamId     = await common.getRowId(insertedId,'lb_id','lb_uuid','live_broadcast');
                    let agoraToken   =  helper.agoraToken({channelId : streamId,uid:userId,isPublisher:isPublisher});
                        console.log('agoraToken agoraToken agoraToken ',agoraToken);
                    if ( agoraToken ) {

                        let recordToken  = helper.agoraToken( {  channelId : streamId } );

                        console.log( "recordToken======>>>>>>>>>", recordToken );

                        if ( recordToken && recordToken != null ) {

                            startData = await liveBroadcastModel.recordingAcquire( { token : recordToken.token, contestUuid : streamId } );

                            // console.log("startDatastartDatastartDatastartData========startData======>>>>>>>>>>", startData );

                        }
                        
                        let sql           = 'SELECT lb_views_count,lb_comments_count  FROM live_broadcast WHERE lb_id = ?';

                            broadcastData = await common.commonSqlQuery(sql,[insertedId]);
            
                        let userTypeSql       = 'SELECT lbud.lbud_user_type AS userType FROM live_broadcast_users_detail as lbud WHERE lbud.lbud_fk_ch_uuid = ? AND lbud.lbud_fk_lb_uuid = ? AND lbud_fk_u_uuid = ? ',
                        userType      = await common.commonSqlQuery(userTypeSql,[req.body.contestUuid,streamId,userUuid] )
                        userBroadcastType = '';

                        if( userType && userType.length > 0 ){

                            userBroadcastType =  userType[0].userType

                        }
                        let updatedLiveInContest = await common.updateContestLive(req.body.contestUuid,'L');
                        console.log('userType userType userType222222222222222updatedLiveInContest',updatedLiveInContest);
            
                        let data = {
                            agoraToken            : agoraToken.token,
                            agoraUid              : agoraToken.uid,
                            channelBroadcastName  : agoraToken.channelName,
                            role                  : agoraToken.role,
                            userType              : userBroadcastType,
                            liveViewCount         : broadcastData[0].lb_views_count,
                            liveCommentCount      : broadcastData[0].lb_comments_count,
                            isPublisher           : req.body.isPublisher,
                            broadcastUuid         : streamId,
                            startData             : startData,

                        }
                            console.log('liveBroadcastVideoAudio ===========>>44444444444444444',data)

                        let obj = {
                            status: true,
                            message: "Operation Perform successfully",
                            payload : data
                        };

                        helper.successHandler(res, obj, 200);

                    } else {

                        let obj = {
                            status: false,
                            message: "Something went wrong",
                            code: 'CHB-E10013'
                        };
                        helper.errorHandler(res, obj, 200);
                    }

                } else {
                    let obj = {
                        status: false,
                        message: "Something went wrong",
                        code: 'CHB-E10013'
                    };
                    helper.errorHandler(res, obj, 200);
                }
            }
        } else {

            let obj = {
                status: false,
                message: "All fields are required",
                code: 'CHB-E10013'
            };
            helper.errorHandler(res, obj, 200);
        }

    } else {

        let obj = {
            status: false,
            code: "CCS-E1000",
            message: "Unauthorized Error."
        };
        helper.errorHandler(res, obj, 401);
    }
}


/**
 * This function is used to stop Channel Broadcast.
 * @param     : contestUuid, sid, resource, mode
 * @returns   :
 * @developer : 
 */
 liveBroadcast.stopLiveBroadcast = async function(req, res) {

    console.log('req.body 11111111 ================================111111======= >>>> ', req.body );

    let userId          = await helper.getUUIDByTocken(req);

    if ( req && req.body && req.body.broadcastUuid && req.body.sid && req.body.resourceId && req.body.mode ) {

        let stopBroadcast = await liveBroadcastModel.stopLiveBroadcast( req.body, userId );

        console.log("stopBroadcast=======>>>>>>>>>>>", stopBroadcast );
        if ( stopBroadcast && stopBroadcast != false ) {

            helper.successHandler( res, {});

        } else {

            helper.errorHandler( res, {
                status : false
            });
        }

    } else {
        
        helper.successHandler(res, {
            
            status      : false,
            code 	    : "UELS-E1002",
            message		: "All fields are mandatory."

        });
    }
}

/**
* This function is using to check Some one is live or not
* @param     	: 
* @developer 	: 
* @modified	    : 
*/
liveBroadcast.checkLiveOrNot = async (req, res) => {

    let userId = await helper.getUUIDByTocken(req);
    
    if ( userId && userId != '' ) {
    
        if ( req && req.body && req.body.contestUuid ) {

            let result = await liveBroadcastModel.checkLiveOrNot(req.body,userId);
             console.log('We are hear ===================>>>>>>>result',result);

            if(result && result != ''){

                helper.successHandler(res, {
    
                    status 	: result.status,
                    message : result.message,
                    payload : result.data
                }, 200);


            } else {

                helper.errorHandler(res, {
    
                    status 	: false,
                    code 	: 'AAA-E1002',
                    message : 'Something went wrong.'
                }, 200);

            }
              
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
* This function is using to stop Broadcast
* @param     : userUuid 
* @returns   : 
* @developer : 
*/
liveBroadcast.stopBroadcast = async ( req , res ) => {

    let userId = await helper.getUUIDByTocken( req ); 

    console.log('req.body=============1=1=1===1=1', req.body );

    if ( userId ) {

        if( req.body && req.body.contestUuid && req.body.broadcastUuid ){

            let result =  await liveBroadcastModel.stopBroadcast(req.body);
            // console.log('result result result result',result)
            if( result ){

                let updatedLiveInContest = await common.updateContestLive(req.body.contestUuid,'C');

                console.log('We are hear ===================>>>>>>>updatedLiveInContest',updatedLiveInContest);
                if( updatedLiveInContest ){

                    let  resultOne  = await liveBroadcastModel.stopLiveBroadcast({ contestUuid : req.body.contestUuid, broadcastUuid : req.body.broadcastUuid, resourceId : req.body.resource, sid : req.body.sid });
                        console.log('resultOne resultOne resultOne',resultOne);

                    let obj = {
                        status 		: false,
                        code        : "UELS-E1003",
                        message		: "Leave Successfully",
                        payload     : { contestEnd : 'COMPLETE'}
                    };
            
                    helper.successHandler(res, obj, 200); 
    

                }
                

                // let  resultOne  = await liveBroadcastModel.stopLiveBroadcast({ contestUuid : req.body.contestUuid, broadcastUuid : req.body.broadcastUuid, resourceId : req.body.resource, sid : req.body.sid });
                // console.log('resultOne resultOne resultOne',resultOne);

                // if( resultOne ){

                //     let obj = {
                //         status 		: false,
                //         code        : "UELS-E1003",
                //         message		: "Leave Successfully"
                //     };
            
                //     helper.successHandler(res, obj, 200); 

                // } else {

                //     let obj = {
                //         status 		: false,
                //         code        : "UELS-E1003",
                //         message		: "Something went wrong"
                //     };
            
                //     helper.successHandler(res, obj, 401); 

                // }

            } else {

                let obj = {
                    status 		: false,
                    code        : "UELS-E1003",
                    message		: "Something went wrong"
                };
        
                helper.successHandler(res, obj, 401); 

            }

        } else {

            let obj = {
                status 		: false,
                code        : "UELS-E1003",
                message		: "All fields are required."
            };
    
            helper.successHandler(res, obj, 401); 

        }
    
       
    } else {

        let obj = {
            status 		: false,
            code        : "UELS-E1003",
            message		: "Unauthorized Error."
        };

        helper.successHandler(res, obj, 401);  

    }

}


module.exports = liveBroadcast;
