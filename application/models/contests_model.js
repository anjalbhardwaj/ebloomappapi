
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

const { async } = require('q');
const { result } = require('underscore');

const passwordHash 		= require('password-hash'),
    AWS                 = require('aws-sdk'),
    q                   = require('q'),
    spacetime           = require('spacetime'),
    {v1: uuidv1}        = require('uuid'),

    config				= require('../../common/config').init(),
    connectionManager 	= require('../../common/config/db'),
    pool 	            = require('../../common/config/pool'),
    common              = require('../models/common'),
    constant            = require('../../common/config/constants'),
    commonHelper        = require('../../common/helpers/index'),
    // updateModel         = require('../models/update_users_count'),
    helper              = require('../../common/helpers/index');
    // email_template      = require('./email_templates');
        

let contestsModel           = {};

/**
 * This function is used to add contest
 * @param        :
 * @returns      :
 * @developer    :
 * @modification : Ashwani Kumar
 */
contestsModel.addContests = async ( body,userId ) => {
    console.log('We are hear ===================>>>>>>>addContests',body);
    let deferred = q.defer(),
        conObj   = await constant.getConstant();
    // console.log('model 111111111=================');
    if ( body && userId && body.contestName && body.startTime && body.endTime ) {
        // console.log('model 222222222222=================');
            uuid            = uuidv1(Date.now()),
            contestName     = await commonHelper.capitalizeFirstLetter(body.contestName),
            date            = await commonHelper.getPstDateTime('timeDate'),

            insertData      = {
                ct_fk_u_id                 : userId,
                ct_uuid                    : uuid,
                ct_name                    : body.contestName,
                ct_start_date              : body.startDate,
                ct_start_time              : body.startTime,
                ct_end_time                : body.endTime,
                ct_is_location_based       : body.locationBased,
                ct_point_type_earn         : body.pointEarnType,
                ct_views_require           : body.viewsBased,
                ct_contestType             : body.contestType == 'FREE' ? body.contestType : 'POINTS',
                ct_created_at              : date ,            
            };

            if( body.locationBased == 'YES'){

                if( body.location && body.location != '' ){

                    if(  body.latitude && body.longitude && body.latitude != '' && body.longitude != '' ){

                        insertData.ct_latitude  = body.latitude;
                        insertData.ct_longitude = body.longitude;
                        insertData.ct_address   = body.location;

                        
                    } else {

                        insertData.ct_address = body.location;

                    }

                } else {

                    deferred.resolve(false)
 
                }
                
            }

            if( body.distance && body.distance != '' ){

                insertData.ct_contest_distance = body.distance;

            }

            if( body.viewsBased == 'YES'){
                insertData.ct_views       = body.views;
                
            }

            if( body.contestType == 'POINTS BASED '){

                insertData.ct_points       = body.points ? body.points : '0' ;
                
            }

            if( body.pointEarnType == 'STORE'){

               
            }

            console.log('We are hear ===================>>>>>>>insertData',insertData);

      
        
        let insertedId = await common.insert('contests', insertData, true);
        console.log('insertedId======================>>>>>>>>>>>>>>11111111111',insertedId)
        if( insertedId && insertedId != '' ) {
            console.log('insertedId======================>>>>>>>>>>>>>>222222222222222',insertedId)

            deferred.resolve(insertedId)

        } else {
            console.log('insertedId======================>>>>>>>>>>>>>>333333333333333333')

            deferred.resolve(false)

        }
    } else {

        deferred.resolve(false)

    }
    
    return deferred.promise;
}

/**
 * This function is get contests data Detail
 * @param     	: userId, contestUuid
 * @developer 	: 
 * @modified	: 
 */
 contestsModel.getContestsDetail = async (userId, body) => {
    //  console.log('body=====>>>',body)
    let deferred                = q.defer(),
        conObj                  = await constant.getConstant(),
        date                    = await helper.getPstDateTime('date'),
        time                    = await helper.getPstDateTime('time'),
        dateTime                = await helper.getPstDateTime('timeDate'),
        obj                     = {
            data                : '',
            user_profile_url    : conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH,
        };


        // console.log('getContestsData == 111111111111111111111111');

    if ( userId && body && body.contestUuid ) {
        // console.log('getContestsData == 22222222222222');

        let dataArray               = [body.contestUuid];
        
        let sql  = ` SELECT  ct_id, ct_fk_u_id, ct_uuid, ct_name,ct_start_date, ct_start_time, ct_end_date,ct_image, ct_end_time, ct_start_date_time, ct_end_date_time,ct_contestType, ct_points, ct_is_live,ct_store_joining_points,ct_views_require, ct_views,ct_viewer_count, ct_address, ct_contest_distance, ct_created_at,ct_latitude,ct_longitude,ct_point_type_earn,ct_is_location_based FROM contests WHERE ct_uuid = ?`;

        let result          = await common.commonSqlQuery(sql, dataArray,true);        
        // console.log('getContestsData == 33333333333333 result === ', result);

        if ( result && result.length > 0 ) {

            let getContestCreatedSql = 'SELECT ct_id FROM contests WHERE ct_id= ? AND ct_fk_u_id = ? ',
            getContestCreatedData    = await common.commonSqlQuery(getContestCreatedSql,[result[0].ct_id,userId]);

            if( getContestCreatedData && getContestCreatedData != '' ){
                result[0].createdByLoginUser = 'YES' 

            } else {
                result[0].createdByLoginUser = 'NO' 
            }

            let contestTypeSql =  " SELECT ct_id FROM contests WHERE CONCAT(ct_end_date, ' ', ct_end_time) <= '"+date+" "+time+"' AND  ct_deleted = '0' AND ct_id = ?",
            contestTypeData    = await common.commonSqlQuery(contestTypeSql,[result[0].ct_id]);

            if( contestTypeData && contestTypeData != ''){
                result[0].contestExpire  = 'YES'
            } else {
                result[0].contestExpire  = 'NO'
            }


            let isLiveSql = 'SELECT lb_id FROM live_broadcast WHERE lb_fk_ct_uuid = ? AND lb_status ="LIVE"', 
                isLiveData = await common.commonSqlQuery(isLiveSql,[result[0].ct_uuid]);
                if( isLiveData && isLiveData != ''){
                    result[0].isSomeOneLive  = 'YSE'
                } else {
                    result[0].isSomeOneLive  = 'NO'
                }

            let checkUserJoinedSql = 'SELECT ctv_id FROM content_viewers WHERE ctv_fk_ct_id = ? AND ctv_fk_u_id =? ',
            checkUserJoinedData    = await common.commonSqlQuery(checkUserJoinedSql,[result[0].ct_id,userId],true);

            if( checkUserJoinedData && checkUserJoinedData != '' ){
                result[0].userJoinedContest = 'YES' 

            } else {
                result[0].userJoinedContest = 'NO' 
            }

            if( result[0].ct_views_require == 'YES' ){

                if( result[0].ct_views == result[0].ct_viewer_count ){
                    result[0].joinedContest = 'FULL' 


                } else {

                    result[0].joinedContest = 'NOT FULL' 

                }

            }

                if( result[0].ct_is_live == 'L' ){

                    result[0].contestEnd = 'START' 

                } else if( result[0].ct_is_live == 'C' ){

                    result[0].contestEnd = 'COMPLETE' 

                } else {

                    result[0].contestEnd = 'NOTSTART' 

                }

            if ( result[0].ct_is_live == 'C' ) {
                
                    //  console.log('dsdfsdfsdfsdfsdfsdfsd',result[0].p_post_type)
                let attachmentSql =" SELECT lb_uuid, lb_status, lb_attachment AS videoPath, lb_video_thumbnail AS video_thumbnail ,lb_fk_ct_uuid FROM live_broadcast WHERE lb_fk_ct_uuid = ? ";

                let dataArrayOne = [result[0].ct_uuid];    

                let  resultOne  = await common.commonSqlQuery(attachmentSql ,dataArrayOne, true);
                // console.log('dsdfsdfsdfsdfsdfsdfsd=============>>>111',resultOne)

                if ( resultOne && resultOne.length > 0 ) {
                    
                        
                    if ( resultOne[0].video_thumbnail ) {

                        result[0].video_thumbnail  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.BROADCAST_UPLOAD_PATH + resultOne[0].ct_uuid +'/' + resultOne[0].lb_uuid +'/' + conObj.AWS_VIDEO_PATH + resultOne[0].video_thumbnail ;

                    }

                    if ( resultOne[0].videoPath ) {

                        result[0].videoPath  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.BROADCAST_UPLOAD_PATH + resultOne[0].ct_uuid +'/' + resultOne[0].lb_uuid +'/' + conObj.AWS_VIDEO_PATH + resultOne[0].videoPath;

                    } 

                    resultOne[0].videoData = resultOne;
                    console.log('We are hear ===================>>>>>>>result[0].videoData',result[0].videoData);
                }
            }
                console.log('We are hear ===================>>>>>>>result[0].ct_is_live',result[0].contestEnd);

            if( result[0].ct_image ) {
                
                result[0].ct_image  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.CONTESTS_UPLOAD_PATH + result[0].ct_uuid +'/'+  conObj.AWS_IMAGE_PATH + result[0].ct_image;
            }

            let adsSql = `SELECT ma_id, ma_uuid, ma_title,ma_points, ma_detail, ma_attachment, ma_thumbnail,	ma_type, ma_status,ma_deleted, ma_created
            FROM marketing_ads`,
            adsData          = await common.commonSqlQuery(adsSql,'');
            if( adsData && adsData.length > 0 ){

                if( adsData[0].ma_created ){
                    adsData[0].ma_created = await commonHelper.dateFormat( adsData[0].ma_created );
                }
    
                if ( adsData[0].ma_type == 'IMAGE' || adsData[0].ma_type ==  'VIDEO' ) {
                                               
                    if (  adsData[0].ma_attachment && adsData[0].ma_type == 'IMAGE' ) {
                        //   console.log('adsData[0]qweqeqweqeqeqeqeqee2222222222222222222222',adsData[0].ma_attachment)
                        adsData[0].ma_attachment = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.ADS_UPLOAD_PATH + adsData[0].ma_uuid +'/'+ conObj.AWS_IMAGE_PATH  +  adsData[0].ma_attachment; 
                        // console.log('adsData[0].image',adsData[0].image)
                        // adsData[0].ma_attachment = adsData[0].ma_attachment;
                    }
                    console.log('adsData[0].image 11111',adsData[0])
    
                    if ( adsData[0].ma_thumbnail && adsData[0].ma_type ==  'VIDEO' ) {
                        console.log('adsData[0].image',adsData[0].ma_thumbnail )
    
                        adsData[0].ma_thumbnail  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.ADS_UPLOAD_PATH + adsData[0].ma_uuid +'/'+ conObj.AWS_VIDEO_PATH + adsData[0].ma_thumbnail ;
                        // adsData[0].video_thumbnail = adsData[0].video_thumbnail
                    }
                    console.log('We are hear ===================>>>>>>>adsData[0].ma_thumbnail',adsData[0].ma_thumbnail);
    
                    if ( adsData[0].ma_attachment && adsData[0].ma_type ==  'VIDEO' ) {
    
                        adsData[0].videoPath  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.ADS_UPLOAD_PATH + adsData[0].ma_uuid +'/'+ conObj.AWS_VIDEO_PATH + adsData[0].ma_attachment;
    
                    } 
                    console.log('We are hear ===================>>>>>>>adsData[0].ma_attachment',adsData[0].videoPath);
                }  
                
                
                result[0].adsData  = adsData[0];


            }

            obj.data            = result;

            deferred.resolve(obj);

        } else {
            deferred.resolve(false);
        }

    } else {
        // console.log('getContestsData == 1231231234234243243242343243');
        deferred.resolve(false);
    }
    
    return deferred.promise;
}


/**
 * This function is get contests data
 * @param     	: userId, body
 * @developer 	: 
 * @modified	: 
 */
contestsModel.getContestsData = async (userId, body) => {
    //  console.log('body=====>>>',body)
    let deferred                = q.defer(),
        conObj                  = await constant.getConstant(),
        date                    = await helper.getPstDateTime('date'),
        time                    = await helper.getPstDateTime('time'),
        dateTime                = await helper.getPstDateTime('timeDate'),
        obj                     = {
            data                : '',
            more_records        : 0,
            total_records       : 0,
            last                : 0,
            lastRecId           : 0,
            page                : 0,
            user_profile_url    : conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH,
        };


        // console.log('getContestsData == 111111111111111111111111');

    if ( userId && body ) {
        // console.log('getContestsData == 22222222222222');

        let whereLast               = '',
            whereMore               = '',
            id                      = '',
            sortBy                  = 'ct_id',
            sortOrder               = 'DESC',
            page                    = 0,
            checkNewRecord          = false,
            additionalNewCondition  = '',
            addCondition            = '',
            dataArray               = '',
            records_per_page        = conObj.RECORDS_PER_PAGE;

        if ( body.per_page && body.per_page != 'null' ) {
            records_per_page        = body.per_page;
        } 

        if ( body.page && body.page != '' && body.page != null && body.page != 'null' ) {
            //  console.log('sdffdfdsfsf',body.page)
            page = Number(body.page) + 1;

            if ( body.lastRecId != null && body.lastRecId != "null" && body.lastRecId != "" && sortOrder == "DESC") {
                // console.log(body.lastRecId)
                additionalNewCondition = " AND ct_id <= " + body.lastRecId;
            }
        } else {
            // console.log('new last id ');
            checkNewRecord  = true;
        }

        if ( body.last && body.last != 'null' ) {
            whereLast       += 'AND ct_id <= ' + body.last;
            whereMore       += 'AND ct_id > ' + body.last;
        }

        if ( body.sortOrder && body.sortOrder != 'null' ) {
            sortOrder       = body.sortOrder;
        }

        if ( body.sortBy && body.sortBy != 'null' ) {
            sortBy          = body.sortBy;
        }

        if ( body.keyword && body.keyword != 'null' ) {
            whereLast       +=  " AND ct_name LIKE '%" + body.keyword + "%'";
            whereMore       +=  " AND ct_name LIKE '%" + body.keyword + "%'";
        }

        whereLast           += additionalNewCondition;
        if( body.type == 'UPCOMMING' ){

            addCondition = " WHERE CONCAT(ct_start_date, ' ', ct_end_time) >= '"+date+" "+time+"' AND  ct_deleted = '0' AND (ct_is_live = 'I' OR ct_is_live = 'L') "

        } else if( body.type == 'PAST' ){

            addCondition = " WHERE (CONCAT(ct_start_date, ' ', ct_end_time) <= '"+date+" "+time+"' OR ct_is_live = 'C') AND  ct_deleted = '0'  "

        } else {

            addCondition = `WHERE ct_deleted = '0' `
        }

        if( body.myContest && body.myContest == 'MY' ){

            addCondition += ` AND ct_fk_u_id =  ? AND ct_deleted = '0' `
            dataArray     = [ userId ];
        }

        if( body.userUuid ){

            let user_id = await common.getRowById(body.userUuid, 'u_uuid','u_id','user');
            addCondition += `AND ct_fk_u_id =  ?`
            dataArray     = [ user_id ];

        }
        
        
        let sql  = ` SELECT user.u_name,user.u_uuid, ct_id, ct_fk_u_id, ct_uuid, ct_name,ct_start_date, ct_start_time, ct_end_date,ct_image, ct_end_time, ct_start_date_time, ct_end_date_time,ct_contestType, ct_points, ct_is_live,ct_store_joining_points,ct_views_require, ct_views,ct_viewer_count, ct_address, ct_contest_distance, ct_created_at,ct_latitude,ct_longitude,ct_point_type_earn,ct_is_location_based FROM contests LEFT JOIN user ON contests.ct_fk_u_id = user.u_id ` + addCondition,
        sqlOne   = ` SELECT ct_id FROM contests ` + addCondition;

            // dataArray       = [ '0', '0', '0', '1', '1' ];
            // dataArray       = '',
        let getLastRecIdSql = sql + " GROUP BY ct_id ORDER BY ct_id DESC",
            moreRecordSql   = sqlOne;

        let offset          = page * records_per_page;
        // moreRecordSql       += whereMore + " GROUP BY ct_id ORDER BY " + sortBy + " " + sortOrder;
        sql                 += whereLast + " GROUP BY ct_id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;

        let result          = await common.commonSqlQuery(sql, dataArray,true),
            resultOne       = await common.commonSqlQuery(moreRecordSql,dataArray);
        // console.log('getContestsData == 33333333333333 result === ', result);
            
        if ( result && result.sqlMessage ) { 
            // console.log('getContestsData == 444444444444 result === ');
            deferred.resolve(false);
        } else {

            // console.log('getContestsData == 555555555555555555 result === ');

            if ( result && result.length > 0 ) {

                for( let resultData of result ) {

                    // let getContestCreatedSql = await common.getRowById(userId,'ct_id','ct_fk_u_id','contest');

                    let getContestCreatedSql = 'SELECT ct_id FROM contests WHERE ct_id= ? AND ct_fk_u_id = ? ',
                    getContestCreatedData    = await common.commonSqlQuery(getContestCreatedSql,[resultData.ct_id,userId]);

                    if( getContestCreatedData && getContestCreatedData != '' ){
                        resultData.createdByLoginUser = 'YES' 

                    } else {
                        resultData.createdByLoginUser = 'NO' 
                    }

                    let contestTypeSql =  " SELECT ct_id FROM contests WHERE CONCAT(ct_end_date, ' ', ct_end_time) <= '"+date+" "+time+"' AND  ct_deleted = '0' AND ct_id = ?",
                    contestTypeData    = await common.commonSqlQuery(contestTypeSql,[resultData.ct_id]);

                    if( contestTypeData && contestTypeData != ''){
                        resultData.contestExpire  = 'YES'
                    } else {
                        resultData.contestExpire  = 'NO'
                    }


                    let isLiveSql = 'SELECT lb_id FROM live_broadcast WHERE lb_fk_ct_uuid = ? AND lb_status ="LIVE"', 
                        isLiveData = await common.commonSqlQuery(isLiveSql,[resultData.ct_uuid]);
                        if( isLiveData && isLiveData != ''){
                            resultData.isSomeOneLive  = 'YSE'
                        } else {
                            resultData.isSomeOneLive  = 'NO'
                        }

                    let checkUserJoinedSql = 'SELECT ctv_id FROM content_viewers WHERE ctv_fk_ct_id = ? AND ctv_fk_u_id =? ',
                    checkUserJoinedData    = await common.commonSqlQuery(checkUserJoinedSql,[resultData.ct_id,userId],true);

                    if( checkUserJoinedData && checkUserJoinedData != '' ){
                        resultData.userJoinedContest = 'YES' 

                    } else {
                        resultData.userJoinedContest = 'NO' 
                    }

                    if( resultData.ct_views_require == 'YES' ){

                        if( resultData.ct_views == resultData.ct_viewer_count ){
                            resultData.joinedContest = 'FULL' 
    
    
                        } else {
    
                            resultData.joinedContest = 'NOT FULL' 
    
                        }

                    }

                        if( resultData.ct_is_live == 'L' ){

                            resultData.contestEnd = 'START' 

                        } else if( resultData.ct_is_live == 'C' ){

                            resultData.contestEnd = 'COMPLETE' 

                        } else {

                            resultData.contestEnd = 'NOTSTART' 

                        }

                    if ( resultData.ct_is_live == 'C' ) {
                        
                            //  console.log('dsdfsdfsdfsdfsdfsdfsd',resultData.p_post_type)
                        let attachmentSql =" SELECT lb_uuid, lb_status, lb_attachment AS videoPath, lb_video_thumbnail AS video_thumbnail ,lb_fk_ct_uuid FROM live_broadcast WHERE lb_fk_ct_uuid = ? ";

                        let dataArrayOne = [resultData.ct_uuid];    

                        let  result  = await common.commonSqlQuery(attachmentSql ,dataArrayOne, true);
                        // console.log('dsdfsdfsdfsdfsdfsdfsd=============>>>111',result)

                        if ( result && result.length > 0 ) {
                           
                             
                            if ( result[0].video_thumbnail ) {

                                resultData.video_thumbnail  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.BROADCAST_UPLOAD_PATH + resultData.ct_uuid +'/' + result[0].lb_uuid +'/' + conObj.AWS_VIDEO_PATH + result[0].video_thumbnail ;
        
                            }

                            if ( result[0].videoPath ) {

                                resultData.videoPath  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.BROADCAST_UPLOAD_PATH + resultData.ct_uuid +'/' + result[0].lb_uuid +'/' + conObj.AWS_VIDEO_PATH + result[0].videoPath;
        
                            } 

                            resultData.videoData = result;
                            console.log('We are hear ===================>>>>>>>resultData.videoData',resultData.videoData);
                        }
                    }
                        console.log('We are hear ===================>>>>>>>resultData.ct_is_live',resultData.contestEnd);

                    if( resultData.ct_image ) {
                        
                        resultData.ct_image  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.CONTESTS_UPLOAD_PATH + resultData.ct_uuid +'/'+  conObj.AWS_IMAGE_PATH + resultData.ct_image;
                    }
                   
                    // console.log('resultData.ct_image================>>>',resultData.ct_image)
                }



                obj.data            = result;
                obj.total_records   = resultOne.length;
                obj.last            = result[0].ct_id;
                obj.page            = page;
                console.log('We are hear ===================>>>>>>>obj.total_records',obj.total_records);
                if ( checkNewRecord ) {
                    // console.log("hi i am in");

                    let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
                    // console.log("getLastRecId obj is : ", getLastRecId);
                    if ( getLastRecId && getLastRecId.length > 0 ) {
                        obj.lastRecId = getLastRecId[0].ct_id;
                    } 
                } 

                deferred.resolve(obj);

            } else {
                deferred.resolve(obj);
            }
        }

    } else {
        // console.log('getContestsData == 1231231234234243243242343243');
        deferred.resolve(obj);
    }
    
    return deferred.promise;
}

/** 
 * This function is using to delete post
 * @param     : 
 * @returns   : true , false 
 * @developer : 
 */
 contestsModel.contestsDelete = async(object) =>{
    // console.log('postDelete innnnn ====>>>>......',object)
   let deferred =  q.defer();

   let conObj   = await constant.getConstant();

    if ( object && object != '' ) {

        let contestUuid    = '',
            userUuid  = '',
            userId    =  '',
            fileObj   = '';
        if ( object.contestUuid ) {
            contestUuid = object.contestUuid ;
        }
        
        if ( object.userUuid ) {
            userUuid = object.userUuid; 
        }
        if( object.userId ){
            userId = object.userId
        }

        let deleteSQl = "DELETE FROM contests WHERE ct_uuid = ? ",
        deleteRes = await common.commonSqlQuery(deleteSQl ,[ contestUuid ]);

        if ( deleteRes ) {

            deferred.resolve(true);

        } else {

            deferred.resolve(false);

        }

    } else {

        deferred.resolve(false);
    }

   return deferred.promise; 

}

module.exports = contestsModel;