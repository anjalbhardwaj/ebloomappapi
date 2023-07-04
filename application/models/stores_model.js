
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
    path				= require('path');
const commonModel = require('../models/common');

// const { updateData } = require('../../common/helper/mongo_helper');

let storesModel = {};

/**
 * This function is get Post data
 * @param     	:  body
 * @developer 	: Dushyant Sharma
 * @modified	: 
 */
 storesModel.getStoresData = async ( body) => {

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
            sortBy                  = 's_id',
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
                additionalNewCondition = " AND s_id <= " + body.lastRecId;
            }
        } else {
            // console.log('new last id ');
            checkNewRecord  = true;
        }
        if ( body.last && body.last != 'null' ) {
            whereLast       += 'AND s_id <= ' + body.last;
            whereMore       += 'AND s_id > ' + body.last;
        }

        if ( body.sortOrder && body.sortOrder != 'null' ) {
            sortOrder       = body.sortOrder;
        }

        if ( body.sortBy && body.sortBy != 'null' ) {
            sortBy          = body.sortBy;
        }

        if ( body.keyword && body.keyword != 'null' ) {
            whereLast       +=  " AND s_name LIKE '%" + body.keyword + "%'";
            whereMore       +=  " AND s_name LIKE '%" + body.keyword + "%'";
        }

        whereLast           += additionalNewCondition;
       
        let sql  = ` SELECT s_id, s_uuid, s_name, s_detail, s_address, s_image, s_status,s_deleted, s_created
        FROM stores 
        ` + addCondition;
            // dataArray       = [ '0', '0', '0', '1', '1' ];
            // dataArray       = '',
        let getLastRecIdSql = sql + " GROUP BY s_id ORDER BY s_id DESC",
            moreRecordSql   = sql;

        let offset          = page * records_per_page;
        moreRecordSql       += whereMore + " GROUP BY s_id ORDER BY " + sortBy + " " + sortOrder;
        sql                 += whereLast + " GROUP BY s_id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;

        let result          = await common.commonSqlQuery(sql, dataArray);

        // console.log('getPostData == 33333333333333 result === ', result);
            
        if ( result && result.sqlMessage ) { 
            // console.log('getPostData == 444444444444 result === ');
            deferred.resolve(false);
        } else {

            // console.log('getPostData == 555555555555555555 result === ');

            if ( result && result.length > 0 ) {

                for ( let  resultData of result ) {

                    if( resultData.s_created ){
                        resultData.s_created = await commonHelper.dateFormat( resultData.s_created );
                    }

                    if (  resultData.s_image ) {
                        
                        resultData.image = conObj.AWS_CLOUDFRONT_URL + conObj.UPLOAD_PATH + conObj.STORES_UPLOAD_PATH + resultData.s_uuid +'/'+ conObj.AWS_IMAGE_PATH  +  resultData.s_image; 
                    }
                    console.log('resultData.image',resultData.image)
                    
                }

                obj.data            = result;
                // obj.total_records   = resultOne.length;
                obj.last            = result[0].s_id;
                obj.page            = page;

                if ( checkNewRecord ) {
                    // console.log("hi i am in");

                    let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
                    // console.log("getLastRecId obj is : ", getLastRecId);
                    if ( getLastRecId && getLastRecId.length > 0 ) {
                        obj.lastRecId = getLastRecId[0].s_id;
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



module.exports = storesModel;