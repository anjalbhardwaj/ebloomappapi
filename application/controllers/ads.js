
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


const q 			= require('q'),
path				= require('path'),
{v1: uuidv1}        = require('uuid'),
helper				= require('../../common/helpers'),
config				= require('../../common/config').init(),
common              = require('../models/common'),
constant            = require('../../common/config/constants'),
_adsModelObj 		= require('../models/ads_model');


let ads = {};


/**
* This function is get user post data
* @param     	: adsType, contestId
* @developer 	: 
* @modified	    : 
*/
ads.getAdsData = async (req, res) => {

    let userId = await helper.getUUIDByTocken(req);

    if ( userId && userId != '' ) {

        if ( req && req.body ) {

            let userPostData = await _adsModelObj.getAdsData(userId,req.body);

            if ( userPostData && userPostData != false ) {

                helper.successHandler(res, {
                    status : true,
                    message : 'Post successfully uploaded',
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
* This function is used to add Ads Point To User
* @param     	:  adId
* @developer 	: 
* @modified	    : 
*/
ads.addAdsPointToUser = async (req, res) => {

    let userId = await helper.getUUIDByTocken(req);

    if ( userId && userId != '' ) {

        if ( req && req.body ) {

            let userPostData = await _adsModelObj.addAdsPointToUser(userId,req.body);

            if ( userPostData && userPostData != false ) {

                helper.successHandler(res, {
                    status : true,
                    message : 'Add Points successfully',
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


module.exports = ads