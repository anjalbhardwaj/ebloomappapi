
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
 *                                                                                                                                                                                                                                                                                                                  
 * Written By  : 
 * Description :
 * Modified By :
 */

const pool 	      = require('../config/pool'),
      q           = require('q');

let constants     = {};

constants.getConstant =  () => {

    let deferred                    = q.defer(),
        obj                         = {};

    obj.SITE_EMAIL                  = 'abc',
    obj.RECORDS_PER_PAGE            = '10',
    obj.SITE_URL                    = ''
    obj.UPLOAD_PATH                 = 'uploads/',
    obj.PROFILE_IMAGE_PATH          = 'profile/',
    obj.POST_UPLOAD_PATH            = 'posts/',
    obj.CONTESTS_UPLOAD_PATH        = 'contest/',
    obj.BROADCAST_UPLOAD_PATH       = 'broadcast/',
    obj.ADS_UPLOAD_PATH             = 'marketingAds/',
    obj.STORES_UPLOAD_PATH          = 'stores/',
    obj.AWS_IMAGE_PATH              = 'images/',
    obj.AWS_VIDEO_PATH              = 'videos/',
    obj.DEALS_IMAGE_PATH            = 'deals/',
    obj.BUSINESS_IMAGE_PATH         = 'business/',
    obj.AWS_REGION                  = 'us-east-1',
    obj.AWS_ONE_TO_ONE_PATH         = 'one_to_one_chat/',

    obj.AWS_LAMBDA_API_GATEWAY_URL  = '',
    obj.AWS_CLOUDFRONT_URL          = '',

    obj.AWS_ACCESS_KEY              = '',
    obj.AWS_SECRET_ACCESS_KEY       = '',
    obj.AWS_BUCKET_NAME             = '',
    obj.NODE_MAILER_USER            = '',                                                                                                                       
    obj.NODE_MAILER_PASS            = 'anil@2021',
    obj.API_URL                     = 'https://app.ebloom.gr/',

    obj.AGORA_API_URL                = 'https://app.ebloom.gr/',
    obj.AGORA_APP_ID                 = '768bc658c07e410198b05e14e72965be',
    obj.AGORA_APP_CERTIFICATE        = '6ae71efd404c4c119f466a0c776572ae',
    obj.AGORA_REST_KEY               = '5af06721e99a4e20a3f701f73c2dfd13',
    obj.AGORA_SECRET_KEY             = 'dd5511aee71e49238ba9eafba06ad226';

    // obj.SENDINBLUE_USER              = 'acubetechnologies2021@gmail.com',
    // obj.SENDINBLUE_PASS              = 'btEDpm46XSLJq3Bc',
    // obj.SENDINBLUE_API_KEY           = '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';

    // pool.query('SELECT * FROM master_configuration WHERE master_configuration.mts_con_enabled = ? AND master_configuration.mts_con_deleted = ?', ['1', '0'], async function (error, masterCon, fields) {

    //     if ( masterCon && masterCon.length > 0 ) {
            
    //         for ( const result of masterCon ) {
                
    //             if ( result.mts_con_key && result.mts_con_key == "SITE_EMAIL" ) {
    //                 obj.SITE_EMAIL = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "SITE_NAME" ) {
    //                 obj.SITE_NAME = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "RECORDS_PER_PAGE" ) {
    //                 obj.RECORDS_PER_PAGE = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "BASE_URL" ) {
    //                 obj.BASE_URL = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "SITE_URL" ) {
    //                 obj.SITE_URL = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "UPLOAD_PATH" ) {
    //                 obj.UPLOAD_PATH = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "PROFILE_IMAGE_PATH" ) {
    //                 obj.PROFILE_IMAGE_PATH = result.mts_con_value;
    //             }  
    //             if ( result.mts_con_key && result.mts_con_key == "MINIMUM_WITHDRAWAL_AMT" ) {
    //                 obj.MINIMUM_WITHDRAWAL_AMT = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "PAYPAL_COMMISSION" ) {
    //                 obj.PAYPAL_COMMISSION = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "KNOWEX_COMMISSION" ) {
    //                 obj.KNOWEX_COMMISSION = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "EXPERT_COMMISSION" ) {
    //                 obj.EXPERT_COMMISSION = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "STUDENT_COMMISSION" ) {
    //                 obj.STUDENT_COMMISSION = result.mts_con_value;
    //             }  
    //             if ( result.KNOWEX_UUID && result.mts_con_key == "KNOWEX_UUID" ) {
    //                 obj.KNOWEX_UUID = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "ESCROW_UUID" ) {
    //                 obj.ESCROW_UUID = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "authorizeLoginKey" ) {
    //                 obj.authorizeLoginKey = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "authorizeTransactionKey" ) {
    //                 obj.authorizeTransactionKey = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MAXIMUM_POINTS" ) {
    //                 obj.MAXIMUM_POINTS = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "MINIMUM_POINTS" ) {
    //                 obj.MINIMUM_POINTS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MEETING_URL" ) {
    //                 obj.MEETING_URL = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MAXIMUM_TAGS" ) {
    //                 obj.MAXIMUM_TAGS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MAXIMUM_USER_EMAILS" ) {
    //                 obj.MAXIMUM_USER_EMAILS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "REJECT_COMMISSION" ) {
    //                 obj.REJECT_COMMISSION = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "EXPERT_MIN_PRICE" ) {
    //                 obj.EXPERT_MIN_PRICE = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "CURRENCY_DOLLAR" ) {
    //                 obj.CURRENCY_DOLLAR = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MIN_COURSE_SEATS" ) {
    //                 obj.MIN_COURSE_SEATS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "RESERVE_AMOUNT_SECONDS" ) {
    //                 obj.RESERVE_AMOUNT_SECONDS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "RUNWAY_TIME" ) {
    //                 obj.RUNWAY_TIME = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MAXIMUM_WITHDRAWAL_AMT" ) {
    //                 obj.MAXIMUM_WITHDRAWAL_AMT = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "MAX_WALLET_AMOUNT" ) {
    //                 obj.MAX_WALLET_AMOUNT = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MIN_RECHARGE_AMOUNT" ) {
    //                 obj.MIN_RECHARGE_AMOUNT = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MAX_RECHARGE_AMOUNT" ) {
    //                 obj.MAX_RECHARGE_AMOUNT = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_ACCESS_KEY" ) {
    //                 obj.AWS_ACCESS_KEY = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_SECRET_ACCESS_KEY" ) {
    //                 obj.AWS_SECRET_ACCESS_KEY = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_BUCKET_NAME" ) {
    //                 obj.AWS_BUCKET_NAME = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_VIDEO_URL" ) {
    //                 obj.AWS_VIDEO_URL = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_VIDEO_FOLDER" ) {
    //                 obj.AWS_VIDEO_FOLDER = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_THUMBNAIL_FOLDER" ) {
    //                 obj.AWS_THUMBNAIL_FOLDER = result.mts_con_value;
    //             } 
    //             if ( result.mts_con_key && result.mts_con_key == "AWS_VIDEO_UPLOAD_URL" ) {
    //                 obj.AWS_VIDEO_UPLOAD_URL = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "KNOWEX_VIDEO_COMMISSION" ) {
    //                 obj.KNOWEX_VIDEO_COMMISSION = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "STAGING_UPLOAD_PATH" ) {
    //                 obj.STAGING_UPLOAD_PATH = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "MAX_ONLINE_COURSE_SEATS" ) {
    //                 obj.MAX_ONLINE_COURSE_SEATS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "WEBSITE_URL" ) {
    //                 obj.WEBSITE_URL = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "NODE_MAILER_USER" ) {
    //                 obj.NODE_MAILER_USER = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "NODE_MAILER_PASS" ) {
    //                 obj.NODE_MAILER_PASS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "API_URL" ) {
    //                 obj.API_URL = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "REQUEST_EXPIRE_DAYS" ) {
    //                 obj.REQUEST_EXPIRE_DAYS = result.mts_con_value;
    //             }
    //             if ( result.mts_con_key && result.mts_con_key == "TEXT_REPLY_MINUTES" ) {
    //                 obj.TEXT_REPLY_MINUTES = result.mts_con_value;
    //             }
                
    //             if ( result.mts_con_key && result.mts_con_key == "GROUP_IMAGE_PATH" ) {
    //                 obj.GROUP_IMAGE_PATH = result.mts_con_value;
    //             }
 
    //             if ( result.mts_con_key && result.mts_con_key == "BITCOIN_UUID" ) {
    //                 obj.BITCOIN_UUID = result.mts_con_value;
    //             }

    //             // AGORA CONFIG VARIABLES //

    //             if ( result.mts_con_key && result.mts_con_key == "AGORA_APP_ID" ) {
    //                 obj.AGORA_APP_ID = result.mts_con_value;
    //             }

    //             if ( result.mts_con_key && result.mts_con_key == "AGORA_APP_CERTIFICATE" ) {
    //                 obj.AGORA_APP_CERTIFICATE = result.mts_con_value;
    //             }

    //             if ( result.mts_con_key && result.mts_con_key == "AGORA_REST_KEY" ) {
    //                 obj.AGORA_REST_KEY = result.mts_con_value;
    //             }

    //             if ( result.mts_con_key && result.mts_con_key == "AGORA_SECRET_KEY" ) {
    //                 obj.AGORA_SECRET_KEY = result.mts_con_value;
    //             }

    //             if ( result.mts_con_key && result.mts_con_key == "AGORA_API_URL" ) {
    //                 obj.AGORA_API_URL = result.mts_con_value;
    //             }
                
    //         }
    //     } 
    //     deferred.resolve(obj);
    // });
    deferred.resolve(obj);
    return deferred.promise;
        
}

module.exports = constants;


