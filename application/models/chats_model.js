
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[
              _____      _            _______        _                 _             _           
     /\      / ____|    | |          |__   __|      | |               | |           (_)          
    /  \    | |    _   _| |__   ___     | | ___  ___| |__  _ __   ___ | | ___   __ _ _  ___  ___ 
   / /\ \   | |   | | | | '_ \ / _ \    | |/ _ \/ __| '_ \| '_ \ / _ \| |/ _ \ / _` | |/ _ \/ __|
  / ____ \  | |___| |_| | |_) |  __/    | |  __/ (__| | | | | | | (_) | | (_) | (_| | |  __/\__ \
 /_/    \_\  \_____\__,_|_.__/ \___|    |_|\___|\___|_| |_|_| |_|\___/|_|\___/ \__, |_|\___||___/
                                                                                __/ |            
                                                                               |___/             
--]]                                                                                                                                                                                                                                                                                                                    
 * Written By  : 
 * Description :
 * Modified By :
 */


const passwordHash 		= require('password-hash'),
    pool 	            = require('../../common/config/pool'),
    // spacetime           = require('spacetime'),
    q                   = require('q'),
    // fs                  = require('fs'),
    {v1: uuidv1}        = require('uuid'),
    common              = require('../models/common'),
    constant            = require('../../common/config/constants'),
    commonHelper        = require('../../common/helpers/index'),
    helper			    = require('../../common/helpers');
// const { updateData } = require('../../common/helper/mongo_helper');

let chatModel = {};


/**
 * DESCTIPTION WILL BE HERE One to one chat 
 * @param     :  recvUuid 
 * @returns   : 
 * @developer : 
 */

 chatModel.chatOneToOne = async ( body , userId ) => {
    console.log('chatOneToOne model========>>>>>111111',body , userId);

    let deferred          = q.defer(),
        conObj            = await constant.getConstant(),
        convUuid          = uuidv1(Date.now()),
        currentDateTime   = await helper.getPstDateTime('timeDate'),
        nextDateTime      = await helper.increaseHours(24),
        convId            = '',
        convRecord        = [] ,
        replyMint         = conObj.TEXT_REPLY_MINUTES,
        // condition         = '',
        userUuid          = '';

    

        // body.recvUuId ? body.recvUuId : body.receiverUuid;
       // console.log('chatOneToOne model========>>>>>222222',body.recvUuId);

        if ( body && body.recvUuId ){
         //   console.log('chatOneToOne model========>>>>>222222',body.recvUuId);

            if ( userId && userId != '' ) {
                userUuid = await common.getRowById( userId , 'u_id', 'u_uuid', 'user');
            }
           // console.log('chatOneToOne model========>>>>>3333333',userUuid);

            if ( userUuid && userUuid != '' ) {
             //   console.log('chatOneToOne model========>>>>>4444444',userUuid);

                let convRecord    = await  chatModel.checkIfAlreadyHasConvId( userUuid , body ); 
               // console.log('ddadadadadadadad',convRecord)
                // let recId = await common.getRowById(body.recvUuId , 'u_uuid', 'u_id', 'user');
                        
                    // let blockedStatus = await common.getBlockedUserStatus(recId, userId);

                    // let expertBlockedStatus = await common.getBlockedUserStatus(userId , recId );

                if ( convRecord &&  convRecord.status && convRecord.conversationId != '' ) {
                 //   console.log('chatOneToOne model========>>>>>555555',convRecord);

                    let andCon = '';
                        convId = convRecord.conversationId;

                    let whereLast           = '',
                        id                  = '',
                        page                = 0,
                        records_per_page    = conObj.RECORDS_PER_PAGE;

                    if ( body ) {
                    //    console.log('chatOneToOne model========>>>>>666666666',body);

                        if ( body.per_page ) {
                            records_per_page = body.per_page;
                        }
                
                        if ( body.page ) {
                            page = body.page;
                        }
                
                        if ( body.last ) {
                            whereLast  += ' AND co.co_id > ' + body.last;
                            whereMore  += ' AND co.co_id > ' + body.last;
                        }

                        // if( body.requestType && body.requestType != ''){
                        //     condition = 'AND con_type = '+body.requestType+''
                        // }

                        let updateReadMsgSql = "UPDATE conversation_onetoone SET co_is_seen = '1' WHERE co_fk_con_uuid = ? AND co_is_seen = ? AND co_fk_receiver_u_uuid = ?";

                        let updateRead  =  await common.commonSqlQuery( updateReadMsgSql , [convId ,'0',userUuid], false);
                        //console.log('chatOneToOne model========>>>>>77777777',updateRead);

                    }  
                    let sql =` SELECT 
                        c.con_uuid,
                        co.co_id, 
                        co.co_parent_id, 
                        co.co_uuid  ,
                        co.co_fk_sender_u_uuid , 
                        co.co_msg_type , 
                        co.co_message , 
                        co.co_is_seen  ,
                        co.co_created_at ,
                        co.co_expire_time,
                        co.co_owner_expire_time,
                        co.co_message_price,
                        co.co_is_paid,
                        co.co_reply_paid_status,
                        co.co_rating,
                        co.co_rating_comment, 
                        u.u_name ,
                        u.u_image,
                        u.u_uuid ,
                        u.u_is_online 
                        FROM conversation_onetoone AS co 
                    LEFT JOIN user AS u ON u.u_uuid = co.co_fk_sender_u_uuid 
                    LEFT JOIN conversation AS c ON c.con_uuid = co.co_fk_con_uuid `+andCon+`  
                    WHERE co.co_fk_con_uuid = ? AND (co.co_delete_for_me IS NULL OR co.co_delete_for_me != ? ) ` ;
                    totalRecordSql  = sql ;
                    let offset      = page * records_per_page;
                
                    totalRecordSql   += whereLast + "  ORDER BY co.co_id DESC ";
                    sql              += whereLast + "  ORDER BY co.co_id DESC LIMIT "+ offset + "," +records_per_page;

                    let  convMessage  = await common.commonSqlQuery(sql,[ convId  , userUuid]),
                        resultOne    = await common.commonSqlQuery(totalRecordSql,[ convId , userUuid ]);

                    let timeText = '';

                    if ( convMessage && Object.keys(convMessage).length > 0 ) {
                        // console.log('chatOneToOne model========>>>>>8888888888',convMessage);

                        convMessage.sort(function(a, b) {
                            return parseFloat(a.co_id) - parseFloat(b.co_id);
                        });

                        for ( const convMessageOne of convMessage ) {

                            convMessageOne.created_date_time = await helper.getDateTimeFormat(convMessageOne.co_created_at);

                            convMessageOne.senderId                    = convMessageOne.con_sender_u_uuid;
                            
                            if ( convMessageOne.co_parent_id != null && convMessageOne.co_parent_id != ''  ){
                                convMessageOne.replyObj               = await chatModel.getMessageReply( convMessageOne.co_parent_id );
                                convMessageOne.replyStatus            = await chatModel.getReplyEarnedMsgStatus(convMessageOne.co_parent_id , convMessageOne.co_id);
                            }
                            if ( convMessageOne.co_msg_type == "IMAGE" || convMessageOne.co_msg_type == "VIDEO" ) {

                                let attachmentSql =" SELECT coa_video_thumbnail  AS coa_video_thumbnail ,coa_uuid AS coa_uuid, coa_attachments AS image FROM conversation_onetoone_attachments WHERE coa_fk_co_uuid = ? AND coa_fk_sender_uuid = ? ";

                                // let attachmentSql =" SELECT CONCAT('" + conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.GROUP_IMAGE_PATH + "',coa_video_thumbnail ) AS coa_video_thumbnail , CONCAT('" + conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.GROUP_IMAGE_PATH + "', coa_attachments ) AS image  FROM conversation_onetoone_attachments WHERE coa_fk_co_uuid = ? AND coa_fk_sender_uuid = ? ";

                                let dataArrayOne = [ convMessageOne.co_uuid,convMessageOne.co_fk_sender_u_uuid ];    

                                let  result  = await common.commonSqlQuery(attachmentSql ,dataArrayOne);

                                if ( result && result.length > 0 ) {
                                      //    console.log('result result result result result=======================yyyyyyyyyyyyyyy======================================================================================================>>>',result,convMessageOne.con_uuid)
                                    let filename = result[0].image,
                                        arr      = filename.split("."),
                                        videoFolder = arr[0];
                                        // console.log('videoUIdvideoUIdvideoUIdvideoUIdvideoUId===============>>>>>>>>1111111111111',videoFolder)
                                        // console.log('result[0].imageresult[0].image===============>>>>>>>>22222222222222222222',conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + convMessageOne.con_uuid +'/'+  conObj.AWS_IMAGE_PATH+ result[0].image)
                                    if ( result[0].image ) {

                                     //   console.log('result[0].imageresult[0].image===============>>>>>>>>1111111111111',result[0].image)

                                        result[0].image = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + convMessageOne.con_uuid +'/'+  conObj.AWS_IMAGE_PATH+ result[0].image; 
                
                                    }
                                    
                                    if ( result[0].coa_video_thumbnail ) {

                                       
                                        //('videoUIdvideoUIdvideoUIdvideoUIdvideoUId===============>>>>>>>>222222222222222',videoFolder)
                                        result[0].coa_video_thumbnail =  conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + convMessageOne.con_uuid +'/'+ conObj.AWS_VIDEO_PATH + videoFolder +'/'+ result[0].coa_video_thumbnail; 
                
                                    }
                                    
                                    convMessageOne.imageArray = result;
                                    convMessageOne.placeholderImage = false;
                                }
                            }    
                            console.log('sdsdfsdf',convMessageOne.imageArray );
                            if ( convMessageOne.u_image ) {

                            
                                convMessageOne.u_image  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH + convMessageOne.u_image;

                            }

                            let simpleDate     = await helper.simpleDateFormat(convMessageOne.co_created_at);

                            if ( simpleDate != timeText ) {
                                convMessageOne.time = convMessageOne.created_date_time;
                                timeText            = simpleDate;
                            }
                            convMessageOne.co_created_at = await helper.agoTime(convMessageOne.co_created_at );

                            
                            
                        }

                        let obj = {

                            convUuid                    : convId ,
                            // anotherUserBlockedStatus    : blockedStatus,
                            // expertBlockedLoginUser      : expertBlockedStatus,
                            // conversationPrice           : con_is_paid,
                            // userPrice                   : userPrice,
                            data                        : convMessage , 
                            time                        : timeText,
                            nextDayTime                 : await helper.expireDateFormat(nextDateTime),
                            more_records                : 0,
                            total_records               : resultOne.length,
                            last                        : id,

                    

                        };
                        
                            deferred.resolve( obj );

                    } else {
                        let obj = {

                            convUuid                    : convId ,
                            // anotherUserBlockedStatus    : blockedStatus,
                            // expertBlockedLoginUser      : expertBlockedStatus,
                            // conversationPrice           : con_is_paid,
                            // userPrice                   : userPrice,
                            nextDayTime                 : await helper.expireDateFormat(nextDateTime),
                            time                        : '',
                            data                        : [], 
                            total                       : 0
        
                        };
        

                    deferred.resolve( obj ); 

                    }
                        
                } else {
                    let otherUserId = await common.getRowById(body.recvUuId,'u_uuid','u_id','user');
                    let followStatus = await common.getFollowStatus(otherUserId,userId);

                    // console.log('chatOneToOne model========>>>>>999999999',otherUserId, 'userId',userId,followStatus);
                    let conType = 'ONE_TO_ONE';

                    if(followStatus == 'YES'){
                        conType = 'ONE_TO_ONE';

                    } else {

                        if( body.requestType && body.requestType != ''){
                            conType = body.requestType
                        }
                    }
                    
                    
                    let insertObj = {

                        "con_uuid"               : convUuid ,
                        "con_sender_u_uuid"	     : userUuid,
                        "con_receiver_u_uuid"    : body.recvUuId,
                        "con_last_message"       : '',
                        "con_type"               : conType,
                        // "con_price"              : userPrice,
                        // "con_is_paid"            : con_is_paid,
                        "con_is_start"           : 'N',
                        "con_created_at"         : currentDateTime
                    }

                    let sql =" INSERT INTO conversation SET ? ";
                    let aa = pool.query(sql, [ insertObj ],  async (error, result) => {
                        // console.log('chatOneToOne model========>>>>>101010101010',aa.sql);

                        if (error) {
                            
                            deferred.resolve(false);
            
                        } else {
                            // console.log('chatOneToOne model========>>>>>11,111,111',result);

                            if ( result ) {

                                let conRecords = await common.getRowIdAll(result.insertId, 'con_id', 'conversation');
                                let obj = {

                                    convUuid                    : conRecords.con_uuid,
                                    // anotherUserBlockedStatus    : blockedStatus,
                                    // expertBlockedLoginUser      : expertBlockedStatus,
                                    // conversationPrice           : con_is_paid,
                                    // userPrice                   : userPrice,
                                    data                        : [],
                                    total                       : 0
                                
                
                                };
                                // console.log('chatOneToOne model========>>>>>1212121212',conRecords, obj);
                                
                                deferred.resolve( obj );
            
                            } else {
                                console.log('chatOneToOne model========>>>>>1313131313');

                                deferred.resolve(false);
            
                            }
                        }
        
                    });

                }

            } else {
                console.log('chatOneToOne model========>>>>>1414414');

                deferred.resolve(false); 
            }
        

        } else {
            console.log('chatOneToOne model========>>>>>1515515');

            deferred.resolve(false);

        }
    
     return deferred.promise;
}



/**
 * DESCTIPTION WILL BE HERE -: check if already exit coneversations id 
 * @param     :   
 * @returns   : 
 * @developer : 
 */

 chatModel.checkIfAlreadyHasConvId =  async ( loginUserUuid , body ) => {
    let deferred  = q.defer();

    if ( body &&  loginUserUuid && body.recvUuId ) {

        let  sql = " SELECT con_uuid FROM conversation WHERE ( con_sender_u_uuid = ? AND con_receiver_u_uuid = ? ) || ( con_sender_u_uuid = ? AND con_receiver_u_uuid = ? ) ";
        
        pool.query( sql ,[ loginUserUuid , body.recvUuId , body.recvUuId , loginUserUuid ] , async ( error , result  ) => {
            
            if ( result  && result.length > 0 ) {

                let obj =  {
                    status         : true ,
                    conversationId : result[0].con_uuid
                }
                
                deferred.resolve( obj );

            } else {

                let obj = {

                    status         : false ,
                    conversationId : ''
                }

                deferred.resolve( obj )
            }
        });


    } else {

        deferred.resolve(false);
    }

    return deferred.promise;
}

/**
 * This function is using to 
 * @param     :
 * @returns   :
 * @developer :
 */
 chatModel.getMessageReply = async ( id ) => {
    let deferred = q.defer(),
        conObj   = await constant.getConstant();

    if ( id && id != '' ){

        // let sql = " SELECT co.co_fk_cgcq_uuid,cgcq.cgcq_uuid, cgcq.cgcq_question, cgcq.cgcq_request_type ,cgcq.cgcq_price,cgcq.cgcq_is_paid, co.co_reply_paid_status, co.co_id, co.co_message ,co.co_uuid, co.co_fk_attachment_uuid , co.co_msg_type , u.u_name , CONCAT('" + conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH + "', u.u_image ) AS u_image,u_uuid FROM conversation_onetoone AS co LEFT JOIN user AS u ON u.u_uuid = co.co_fk_sender_u_uuid LEFT JOIN conversation_group_chat_questions AS cgcq ON cgcq.cgcq_uuid = co.co_fk_cgcq_uuid  WHERE co.co_id = ? ";

         let sql = " SELECT  co.co_reply_paid_status, co.co_id, co.co_message ,co.co_uuid, co.co_fk_attachment_uuid , co.co_msg_type , u.u_name , u.u_image AS u_image,u_uuid FROM conversation_onetoone AS co LEFT JOIN user AS u ON u.u_uuid = co.co_fk_sender_u_uuid WHERE co.co_id = ? ";

        let result = await common.commonSqlQuery(sql,[id]);

        if ( result && result.length > 0 ) {

            let conUuid   = await common.getRowId(result[0].co_uuid, 'co_uuid', 'co_fk_con_uuid', 'conversation_onetoone' );

            if ( result[0].co_msg_type == 'IMAGE' ) {

                let imageName   = await common.getRowId(result[0].co_uuid, 'coa_fk_co_uuid', 'coa_attachments', 'conversation_onetoone_attachments' );
             
                if ( imageName && conUuid ) {


                    result[0].image = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + conUuid +'/'+  conObj.AWS_IMAGE_PATH+ imageName;

                    result[0].image_url = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + conUuid +'/'+  conObj.AWS_IMAGE_PATH+ imageName; 
                    
                }

            }

            if ( result[0].co_msg_type == 'VIDEO' ) {

                let thumbName   = await common.getRowId(result[0].co_uuid, 'coa_fk_co_uuid', 'coa_video_thumbnail', 'conversation_onetoone_attachments' );

                    let filename    = thumbName,
                    arr         = filename.split("."),
                    videoFolder = arr[0];  

                if ( thumbName ) {
                   
                    result[0].coa_video_thumbnail =  conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + conUuid +'/'+ conObj.AWS_VIDEO_PATH + videoFolder +'/'+ result[0].thumbName; 

                    result[0].thumbnail_url = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + conUuid +'/'+ conObj.AWS_VIDEO_PATH + videoFolder +'/'+ thumbName;
                }

            }

            if ( result[0].u_image ) {

                result[0].u_image  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH + result[0].u_image;
            }

            deferred.resolve(result[0]);

        } else {

            deferred.resolve({});
        }


    } 
    else {

        deferred.resolve(false);
    }


    return deferred.promise;
}

/**
 * This function is using to add new participants in a group
 * @param     :
 * @returns   :
 * @developer :
 */
 chatModel.getReplyEarnedMsgStatus = async ( parentId,chatId ) => {
    let deferred = q.defer();

    if ( parentId && chatId ){

        let sql = " SELECT co_id FROM conversation_onetoone  WHERE co_parent_id = ? ORDER BY co_id ASC LIMIT 1";

        let result = await common.commonSqlQuery(sql,[parentId]);

        if ( result && result.length > 0 ) {
            
            if ( result[0].co_id == chatId ) {

                deferred.resolve(true);

            } else {
                deferred.resolve(false);
            }
            
        } else {
            deferred.resolve(false);
        }

    } else {

        deferred.resolve(false);
    }

    return deferred.promise;

}

/**
 * DESCTIPTION WILL BE HERE my chat group list data
 * @param     :   userId 
 * @returns   : 
 * @developer : 
 */
 chatModel.myChatList = async( body , userId) => {
    // console.log('myChatList model========>>>>>11111111',body, userId)

    let deferred        = q.defer();
    if ( body && userId && userId != undefined && userId != "null" ) {
        // console.log('myChatList model========>>>>>22222222')

        let conObj            = await constant.getConstant(),
            whereLast         = '',
            whereMore         = '',
            sortBy            = 'c.con_last_message_at',
            sortOrder         = 'DESC',
            page              = '0',
            addCondition      =  '',
            // addConditionGroup = ''
            recordsPerPage    = conObj.RECORDS_PER_PAGE;
       
        let userUuid = await common.getRowById(userId, 'u_id', 'u_uuid', 'user');
        if ( userUuid != '' ) {
            // console.log('myChatList model========>>>>>33333333',userUuid)

            if ( body.keywords && body.keywords != 'null' ) {
                
                whereLast += " AND ( u1.u_name LIKE '%" + body.keywords.trim() + "%' OR u2.u_name LIKE '%" + body.keywords.trim() + "%')";
                whereMore += " AND ( u1.u_name LIKE '%" + body.keywords.trim() + "%' OR u2.u_name LIKE '%" + body.keywords.trim() + "%')";
                // whereLast += " AND  u2.u_name LIKE '%" + body.keywords.trim() + "";

                // whereMore += " AND u2.u_name LIKE '%" + body.keywords.trim() + "";
            }
           

            if ( body.per_page ) {

                recordsPerPage = body.per_page;
            }
            
            if ( body.page && body.page != '' && body.page != null && body.page != 'null' ) {

                page = Number(body.page) + 1;

                if ( body.lastRecId != null && body.lastRecId != "null" && body.lastRecId != "" && sortOrder == "DESC" ) {
                }

            } else {

                checkNewRecord = true;
            }

            if ( body.type && body.type != 'null') {

                addCondition = 'AND c.con_type = "'+ body.type +'"';
            } else {
                addCondition = 'AND c.con_type = "ONE_TO_ONE"';
            }
           

            let sql = ` SELECT c.con_id , c.con_uuid , c.con_last_message , c.con_last_msg_type , c.con_price , co.co_created_at ,
             u1.u_name AS sender_name ,u1.u_uuid AS sender_uuid , u1.u_is_available AS sender_is_Available, u1.u_image AS sender_image ,  
            u2.u_name AS receiver_name ,
            u2.u_is_online AS receiver_is_online , u2.u_image AS receiver_image , u2.u_is_available AS receiver_is_Available , u2.u_uuid AS receiver_uuid , 
            c.con_sender_u_uuid , c.con_receiver_u_uuid , c.con_last_message_at 
           FROM conversation AS c  
           LEFT JOIN user AS u1 ON u1.u_uuid = c.con_sender_u_uuid
           LEFT JOIN user AS u2 ON u2.u_uuid = c.con_receiver_u_uuid 
           LEFT JOIN conversation_onetoone AS co ON co.co_fk_con_uuid = c.con_uuid AND co.co_reply_paid_status = '0'
           WHERE(c.con_sender_u_uuid = ? || c.con_receiver_u_uuid = ? ) AND c.con_is_start = ? AND c.con_is_delete = ? 
           ` + addCondition ;
        

            let totalRecordSql  = sql,
                offset          = page * recordsPerPage;
                
            totalRecordSql += whereLast + " GROUP BY c.con_id ORDER BY " + sortBy + " " + sortOrder;
            sql            += whereLast + " GROUP BY c.con_id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + recordsPerPage;

            let resultTwo = await common.commonSqlQuery(totalRecordSql, [userUuid, userUuid, 'Y' , '0']),
                result    = await common.commonSqlQuery(sql, [userUuid, userUuid, 'Y','0']);
            
            if ( result ) {
                // console.log('myChatList model========>>>>>444444444',result)

                let conId = '';

                for ( const resultOne of result ) {
                    // console.log('myChatList model========>>>>>55555555')

                    if ( resultOne.con_last_message_at ) {

                        resultOne.con_created_at =  await helper.getDateTimeFormat(resultOne.con_last_message_at) ;
                        resultOne.con_last_message_at = await helper.agoTime( resultOne.con_last_message_at );
                    }

                    let u_name            = '',
                        user_image        = '',
                        user_uuid         = '',
                        user_is_available = '',
                        user_designation  = '',
                        user_is_online    = '' ;  

                        let obj= {
                            'con_uuid': resultOne.con_uuid,
                            'loginUser': userUuid
                        };
                        if ( resultOne.con_sender_u_uuid == userUuid ) {
                        
                            u_name            = resultOne.receiver_name;
                            user_is_online    = resultOne.receiver_is_online;
                            user_is_available = resultOne.receiver_is_Available;
                            user_uuid         = resultOne.receiver_uuid;
                            user_image        = resultOne.receiver_image;
                            user_designation  = resultOne.receiver_designation;

                            if ( user_image && user_image != '' ) {

                                user_image  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH + user_image;
                            }
                            
                        } else if ( resultOne.con_receiver_u_uuid == userUuid ) {
                        
                            u_name            = resultOne.sender_name;
                            user_is_online    = resultOne.sender_is_online;
                            user_is_available = resultOne.sender_is_Available;
                            user_uuid         = resultOne.sender_uuid;
                            user_image        = resultOne.sender_image;
                            user_designation  = resultOne.sender_designation;

                            if ( user_image && user_image != '' ) {

                                user_image  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH + user_image;
                            }
                        }
                        
                        resultOne.unSeenCount = await  chatModel.getMessageCount(obj);

                    
                    // remove from array
                    delete  resultOne.sender_image ;
                    delete  resultOne.sender_is_online;
                    delete  resultOne.sender_uuid;
                    delete  resultOne.sender_is_Available;
                    delete  resultOne.sender_designation;
                    delete  resultOne.receiver_name;
                    delete  resultOne.receiver_image;
                    delete  resultOne.con_sender_u_uuid;
                    delete  resultOne.con_receiver_u_uuid ;
                    delete  resultOne.receiver_is_online;
                    delete  resultOne.receiver_is_Available;
                    delete  resultOne.receiver_uuid;
                    delete  resultOne.receiver_designation;


                    resultOne.userRecords = {

                        user_name         :  u_name ,
                        user_uuid         :  user_uuid,
                        user_image        :  user_image,
                        user_is_online    :  user_is_online,
                        user_is_available :  user_is_available,
                        user_designation  :  user_designation,

                    } 
                }
                let lastRecordId = '';
                if ( conId ) {
                    let indexValue   = result.length - 1;
                    lastRecordId = result[indexValue].con_id;
                }
                
                let obj = {
                    data         : result,
                    more_records : 0,
                    total        : resultTwo.length,
                    lastRecId    : lastRecordId,
                    per_page     : recordsPerPage,
                    offset       : offset,
                    page         : page
                };
                // console.log('myChatList model========>>>>>66666666666666',obj)

                deferred.resolve(obj);

            } else {
                console.log('myChatList model========>>>>>7777777777777')

                deferred.resolve(false);
            }

        } else {
            console.log('myChatList model========>>>>>88888888888888')

            deferred.resolve(false);
        }

    } else {
        console.log('myChatList model========>>>>>999999999999999999')

        deferred.resolve(false);
    }

    return deferred.promise;
}

/**
 * This function is using to check user exist in group or not
 * @param     :   
 * @returns   : 
 * @developer : 
 */
 chatModel.getMessageCount =  async function( obj) {

    let deferred   =  q.defer();

    if ( obj ) {
        
        let sql = "SELECT COUNT(co_id) as unSeenCount  FROM conversation_onetoone WHERE co_fk_con_uuid = ? AND co_fk_receiver_u_uuid = ? AND co_is_seen = ?",
            res = await common.commonSqlQuery(sql, [obj.con_uuid, obj.loginUser , "0" ]);
        if ( res && res.length > 0 ) {

           deferred.resolve(res[0].unSeenCount);
        } else {

         deferred.resolve(false);

        }

    } else {
        
        deferred.resolve(false);
    }

    return deferred.promise; 
}

/**
 * This function is using to add new participants in a 
 * @param     :   
 * @returns   : 
 * @developer : 
 */
 chatModel.updateThumbnail =  async ( obj ) => {
    console.log('updateThumbnail in =======================>>>>>>>>>>11111111111',obj)

   let deferred          =  q.defer();
   if ( obj ) {
       console.log('updateThumbnail in =======================>>>>>>>>>>22222222222222222222')

       let sql = "SELECT coa_id FROM conversation_onetoone_attachments WHERE coa_fk_co_uuid = ? ",
           res = await common.commonSqlQuery(sql,[ obj.uuid ]);

         if ( res && res.length > 0 ) {

           console.log('updateThumbnail in =======================>>>>>>>>>>333333333333333333333333333')

           let updateSql = "UPDATE conversation_onetoone_attachments SET coa_video_thumbnail = ? WHERE coa_fk_co_uuid = ? ",
               updateData = await common.commonSqlQuery(updateSql, [ obj.thumbnail.imageName , obj.uuid ]);

           if ( updateData ) {
               console.log('updateThumbnail in =======================>>>>>>>>>>4444444444444444444444',obj)
               deferred.resolve(true);
           } else {
               deferred.resolve(false);
           }

       } else {
           deferred.resolve(false);
       }

   } else {
       deferred.resolve(false);
   }

   return deferred.promise; 
}



/** 
 * This function is using to delete massage from both user
 * @param     : question uuid , user id  
 * @returns   : true , false 
 * @developer : 
 */
 chatModel.deleteMessages = async(object) =>{
    let deferred =  q.defer();
    if ( object && object != '' ) {

        let messgaeId   = '',
            userUuid    = '';

        if ( object.co_id ) {
            messgaeId = object.co_id ;
        }
       
        if ( object.userUuid ) {
            userUuid = object.userUuid; 
        }

        let checkSql = "SELECT co_id FROM conversation_onetoone WHERE co_id = ? AND co_delete_for_me !=''",
            res      = await common.commonSqlQuery(checkSql,[ messgaeId ] , false );

        if ( res && res.length > 0 ) {

            let deleteSQl = "DELETE FROM conversation_onetoone WHERE co_id = ? ",
                deleteRes = await common.commonSqlQuery(deleteSQl ,[ messgaeId ]);

            if ( deleteRes ) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }

        } else {

            let updateSql = "UPDATE conversation_onetoone SET co_delete_for_me ='"+userUuid+"' WHERE co_id = ? AND (co_fk_sender_u_uuid = ? || co_fk_receiver_u_uuid = ?)",
                resOne    = await common.commonSqlQuery(updateSql,[ messgaeId , userUuid , userUuid ] , false );

            if ( resOne ) {
                deferred.resolve(true);
            } else {
                deferred.resolve(false);
            }

        }
        
    } else {
      deferred.resolve(false);
    }

    return deferred.promise; 

}


/** 
 * This function is using to delete massage from both user
 * @param     : question uuid , user id  
 * @returns   : true , false 
 * @developer : Dushyant Sarma
 */
 chatModel.deleteEveryoneMessages = async(object) =>{
    console.log('deleteEveryoneMessages innnnn ====>>>>......',object)
   let deferred =  q.defer();

   let conObj   = await constant.getConstant()

   if ( object && object != '' ) {

       let messgaeId   = '',
           userUuid    = '';

       if ( object.co_id ) {
           messgaeId = object.co_id ;
       }
      
       if ( object.userUuid ) {
           userUuid = object.userUuid; 
       }

       let checkSql = "SELECT co_id, co_uuid , co_fk_con_uuid, co_msg_type  FROM conversation_onetoone WHERE co_id = ? ",
           res      = await common.commonSqlQuery(checkSql,[ messgaeId ] , true );
      
       if ( res && res.length > 0 ) {

           console.log('res==============================>>>>',res)
           let attachId= await helper.getRowId(res[0].co_uuid,'coa_fk_co_uuid','coa_attachments','conversation_onetoone_attachments');
               console.log('attachId============>>',attachId)
           if( res[0].co_msg_type == 'VIDEO' ){
                   console.log('VIDEO in===========>>>>>>>>>11111')
                if( attachId && res[0].co_fk_con_uuid ){
                    console.log('VIDEO in===========>>>>>>>>>22222222',attachId)
                let fileName = attachId.split('.')[0] ;
                    console.log('VIDEO in===========>>>>>>>>>33333333',fileName)
                    fileObj = {
                        sId  : fileName,
                        path : conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + body.conUuid +'/'+ conObj.AWS_VIDEO_PATH + oneToOneUuid +'/' ,
                        // status: 'groups', 
                    };
                       
                }
                      console.log('VIDEO in===========>>>>>>>>>44444444',fileObj)
                       let deltedVideo = await helper.removeAwsVideo(fileObj); // work in pending
                   console.log('VIDEO in===========>>>>>>>>>55555555555555',deltedVideo)
                   if( deltedVideo ) {
               
                   deleteMsg = true;
               
                   } else {
               
                   deleteMsg = false;
               
                   }
               
               
            } else if( res[0].co_msg_type == 'IMAGE' ){
                console.log('IMAGE in===========>>>>>>>>>111111111')
                if( attachId && res[0].co_fk_con_uuid ){
                    console.log('IMAGE in===========>>>>>>>>>22222222',attachId)
                    fileObj  = {

                        filepath       : conObj.UPLOAD_PATH + conObj.AWS_ONE_TO_ONE_PATH + res[0].co_fk_con_uuid +'/'+  conObj.AWS_IMAGE_PATH ,
                        fileName       : attachId,
                    };
                    
                }
                console.log('IMAGE in===========>>>>>>>>>333333333',fileObj)
                let deltedImage = await helper.deleteFileToAwsBucket(fileObj)
                console.log('IMAGE in===========>>>>>>>>>44444444',deltedImage)
                if( deltedImage ) {
            
                deleteMsg = true;
            
                } else {
            
                deleteMsg = false;
                    
                }
            
            } else {
                deleteMsg = true;
            }

           let deleteSQl = "DELETE FROM conversation_onetoone WHERE co_id = ? ",
               deleteRes = await common.commonSqlQuery(deleteSQl ,[ messgaeId ]);

           if ( deleteRes ) {
               deferred.resolve(true);
           } else {
               deferred.resolve(false);
           }

           let updateSql = "UPDATE conversation_onetoone SET co_delete_for_me ='"+userUuid+"' WHERE co_id = ? AND (co_fk_sender_u_uuid = ? || co_fk_receiver_u_uuid = ?)",
                   resOne    = await common.commonSqlQuery(updateSql,[ messgaeId , userUuid , userUuid ] , false );
   
               if ( resOne ) {
                   deferred.resolve(true);
               } else {
                   deferred.resolve(false);
               }

       } else {

        //    let updateSql = "UPDATE conversation_onetoone SET co_delete_for_me ='"+userUuid+"' WHERE co_id = ? AND (co_fk_sender_u_uuid = ? || co_fk_receiver_u_uuid = ?)",
        //        resOne    = await common.commonSqlQuery(updateSql,[ messgaeId , userUuid , userUuid ] , false );

        //    if ( resOne ) {
        //        deferred.resolve(true);
        //    } else {
        //        deferred.resolve(false);
        //    }
        deferred.resolve(false);


       }
       
   } else {
     deferred.resolve(false);
   }

   return deferred.promise; 

}


/**
* This function is using to add text Chat  in table
* @param     : 
* @returns   :
* @developer : 
*/
chatModel.textMessage = async ( body,userId ) => {

    let deferred          =  q.defer(),
        currentDateTime   = await helper.getPstDateTime('timeDate'),
        uuid              = uuidv1(Date.now()),
        conUuid           = '',
        createConversation= '',
        conObj            = await constant.getConstant();

        if( body.requestType && body.requestType != ''){

            body.recvUuId = body.receiverUuid  
            console.log('sdfsdfsfsdf',body.recvUuId)
            createConversation = await chatModel.chatOneToOne( body, userId  );
            
        }
        console.log('createConversation============>>>',createConversation)

        if( body.conUuid && body.conUuid != ''){
            conUuid = body.conUuid 
        } else {
            conUuid = createConversation.convUuid
        }
        console.log('conUuid conUuid conUuid conUuid =>>>>>>>>>>>',conUuid)
        if ( body && userId && body.receiverUuid  && body.message && body.type  ) {

            

            let userUuid       = await common.getRowById(userId, 'u_id', 'u_uuid', 'user');
                // msgUserUuid    = await common.getRowById( userUuid,'co_id','co_fk_sender_u_uuid',"conversation_onetoone"),
                // recId          = await common.getRowById(body.receiverUuid, 'u_uuid', 'u_id', 'user');
                
            let object = {
                co_uuid                     : uuid,
                co_fk_con_uuid              : conUuid,
                co_fk_sender_u_uuid         : userUuid,
                co_message                  : body.message,
                co_msg_type                 : body.type,
                co_fk_receiver_u_uuid       : body.receiverUuid,
                co_created_at               : currentDateTime,
            }
        
            if ( body.messageId ) {
                object.co_parent_id = body.messageId;
        
            }
        
            let oneToOneUuid = "";
        
            let insertedId = await common.insert('conversation_onetoone', object);
        
            if ( insertedId && insertedId != false ) {
        
                oneToOneUuid = await common.getRowById(insertedId, 'co_id', 'co_uuid', 'conversation_onetoone');
                if ( oneToOneUuid ){
                    let conversationUpdate = {
                        con_last_msg_type    : body.type,
                        con_last_user_u_uuid : userUuid,
                        con_is_start         : 'Y',
                        con_last_message_at  :currentDateTime,
            
                    };
                    let sql = "UPDATE conversation SET ? WHERE con_uuid = ? ";
            
                    let updatedResult = await helper.getDataOrCount(sql, [ conversationUpdate ,  conUuid ], 'U', true);
                    
                    if ( updatedResult ) {
                        
                        let attachmentSql = "SELECT co_message FROM conversation_onetoone WHERE co_uuid = ? AND co_fk_sender_u_uuid = ? ";
            
                        let dataArrayOne = [oneToOneUuid , userUuid ];    
            
                        let  result  = await common.commonSqlQuery(attachmentSql ,dataArrayOne);
                        let sqlUserData  =  "SELECT u_id , u_uuid , u_name , CONCAT('" + conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH +"', u_image ) FROM user  WHERE u_uuid = ? ";
                        let  resultUserData  = await common.commonSqlQuery(sqlUserData ,[body.receiverUuid],true);
                            // console.log('dzdfdfssfsdfsdf===================>>>>>>>>>>>>>>>>',resultUserData)
                        if ( result && result !='' ) {
                            console.log('result in model in mode ======>>>>11111',result);
                            deferred.resolve(result)
                    
                        } else {
                            console.log('result in model in mode ======>>>>11111');

                            deferred.resolve(false);
                        }
                    } else {
                        console.log('result in model in mode ======>>>>22222222222');

                        deferred.resolve(false);

                    }

                } else {

                    console.log('result in model in mode ======>>>>3333333333333333');
                    deferred.resolve(false);
                }
            } else {
                console.log('result in model in mode ======>>>>4444444444444444');

                deferred.resolve(false);

            } 
                        
        } else {
            console.log('result in model in mode ======>>>>5555555555555555');

            deferred.resolve(false)
        }     
    
    return deferred.promise;

}



module.exports = chatModel;
