
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

const pool 	            = require('../../common/config/pool'),
    // spacetime           = require('spacetime'),
    q                   = require('q'),
    // fs                  = require('fs'),
    {v1: uuidv1}        = require('uuid'),
    common              = require('../models/common'),
    constant            = require('../../common/config/constants'),
    commonHelper        = require('../../common/helpers/index'),
    helper			    = require('../../common/helpers'),
    path				= require('path'),
    commonModel = require('../models/common');


let adsModel = {};

/**
 * This function is get Post data
 * @param     	:  body
 * @developer 	: Dushyant Sharma
 * @modified	: 
 */
 adsModel.getAdsData = async ( body) => {

    //  console.log('body=====>>>',body)
    let deferred                = q.defer(),
        conObj                  = await constant.getConstant(),
        obj                     = {
            data                : '',
            more_records        : 0,
            total_records       : 0,
            last                : 0,
            lastRecId           : 0,
            page                : 0,
            user_profile_url    : conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH,
        };

    if ( body ) {
        // console.log('getPostData == 22222222222222');

        let whereLast               = '',
            whereMore               = '',
            id                      = '',
            sortBy                  = 'ma_id',
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
            page = Number(body.page) + 1;
            // page = body.page;

            if ( body.lastRecId != null && body.lastRecId != "null" && body.lastRecId != "" && sortOrder == "DESC") {
                // console.log(body.lastRecId)
                additionalNewCondition = " AND ma_id <= " + body.lastRecId;
            }
        } else {
            // console.log('new last id ');
            checkNewRecord  = true;
        }
        if ( body.last && body.last != 'null' ) {
            whereLast       += 'AND ma_id <= ' + body.last;
            whereMore       += 'AND ma_id > ' + body.last;
        }

        if ( body.sortOrder && body.sortOrder != 'null' ) {
            sortOrder       = body.sortOrder;
        }

        if ( body.sortBy && body.sortBy != 'null' ) {
            sortBy          = body.sortBy;
        }

        if ( body.keyword && body.keyword != 'null' ) {
            whereLast       +=  " AND ma_title LIKE '%" + body.keyword + "%'";
            whereMore       +=  " AND ma_title LIKE '%" + body.keyword + "%'";
        }

        whereLast           += additionalNewCondition;
       
        let sql  = ` SELECT ma_id, ma_uuid, ma_title,ma_points, ma_detail, ma_attachment, ma_thumbnail,	ma_type, ma_status,ma_deleted, ma_created
        FROM marketing_ads 
        ` + addCondition;
            // dataArray       = [ '0', '0', '0', '1', '1' ];
            // dataArray       = '',
        let getLastRecIdSql = sql + " GROUP BY ma_id ORDER BY ma_id DESC",
            moreRecordSql   = sql;

        let offset          = page * records_per_page;
        moreRecordSql       += whereMore + " GROUP BY ma_id ORDER BY " + sortBy + " " + sortOrder;
        sql                 += whereLast + " GROUP BY ma_id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;

        let result          = await common.commonSqlQuery(sql, dataArray);

        // console.log('getPostData == 33333333333333 result === ', result);
            
        if ( result && result.sqlMessage ) { 
            // console.log('getPostData == 444444444444 result === ');
            deferred.resolve(false);
        } else {

            // console.log('getPostData == 555555555555555555 result === ');

            if ( result && result.length > 0 ) {

                for ( let  resultData of result ) {

                    if( resultData.ma_created ){
                        resultData.ma_created = await commonHelper.dateFormat( resultData.ma_created );
                    }

                    if ( resultData.ma_type == 'IMAGE' || resultData.ma_type ==  'VIDEO' ) {
                                                   
                        if (  resultData.ma_attachment && resultData.ma_type == 'IMAGE' ) {
                            //   console.log('resultDataqweqeqweqeqeqeqeqee2222222222222222222222',resultData.ma_attachment)
                            resultData.ma_attachment = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.ADS_UPLOAD_PATH + resultData.ma_uuid +'/'+ conObj.AWS_IMAGE_PATH  +  resultData.ma_attachment; 
                            // console.log('resultData.image',resultData.image)
                            // resultData.ma_attachment = resultData.ma_attachment;
                        }
                        console.log('resultData.image 11111',resultData)

                        if ( resultData.ma_thumbnail && resultData.ma_type ==  'VIDEO' ) {
                            console.log('resultData.image',resultData.ma_thumbnail )

                            resultData.ma_thumbnail  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.ADS_UPLOAD_PATH + resultData.ma_uuid +'/'+ conObj.AWS_VIDEO_PATH + resultData.ma_thumbnail ;
                            // resultData.video_thumbnail = resultData.video_thumbnail
                        }
                        console.log('We are hear ===================>>>>>>>resultData.ma_thumbnail',resultData.ma_thumbnail);

                        if ( resultData.ma_attachment && resultData.ma_type ==  'VIDEO' ) {

                            resultData.videoPath  = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.ADS_UPLOAD_PATH + resultData.ma_uuid +'/'+ conObj.AWS_VIDEO_PATH + resultData.ma_attachment;
    
                        } 
                        console.log('We are hear ===================>>>>>>>resultData.ma_attachment',resultData.videoPath);
                    }
                   
                    

                }

                obj.data            = result;
                // obj.total_records   = resultOne.length;
                obj.last            = result[0].ma_id;
                obj.page            = page;

                if ( checkNewRecord ) {
                    // console.log("hi i am in");

                    let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
                    // console.log("getLastRecId obj is : ", getLastRecId);
                    if ( getLastRecId && getLastRecId.length > 0 ) {
                        obj.lastRecId = getLastRecId[0].ma_id;
                    } 
                } 

                deferred.resolve(obj);

            } else {
                deferred.resolve(obj);
            }
        }

    } else {
        // console.log('getPostData == 1231231234234243243242343243');
        deferred.resolve(obj);
    }
    
    return deferred.promise;

}


/**
 * This function is used to add Ads Point To User
*  @developer   : 
 * @modified    :
 * @params      : userId , body
 */

adsModel.addAdsPointToUser = async ( userId,body ) => {
    let deferred        = q.defer();
       
    if( body && userId && body.adUuid ){

        let updateSql       = 'UPDATE user SET ? WHERE u_id = ?'
            date            = await commonHelper.getPstDateTime('timeDate'),
            updateData      = {};
           
        let adsPoints = await commonModel.getRowById(body.adUuid,'ma_uuid','ma_points','marketing_ads');
        console.log('We are hear ===================>>>>>>>adsPoints',adsPoints);
        if( adsPoints && adsPoints != '' && adsPoints != '0' ){

            let userAdsPointsData = await commonModel.getRowById(userId,'u_id','u_ads_points','user'),
            userAdsPoints         =  parseInt(userAdsPointsData) +  parseInt(adsPoints);

            updateData      = {
                u_ads_points    : userAdsPoints,
                u_updated       : date
            };
            let result = await commonModel.commonSqlQuery(updateSql,[updateData,userId],true)

            console.log('We are hear ===================>>>>>>>userAdsPoints',adsPoints,userAdsPointsData,'TOTALPOINTS',userAdsPoints);
            console.log('We are hear ===================>>>>>>>result',result);
            if( result ){
    
                deferred.resolve(true);
               
            } else {

                deferred.resolve(false);
            }

        } else {

            deferred.resolve(false);
        }
        
    } else {

        deferred.resolve(false)
    }

   return deferred.promise;
}


module.exports = adsModel;