
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or restoreion 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.
--[[                                                                                                                                                                                                                                
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
    _floristModel       = require('../models/florist_model');
    
    
    let florist = {};
    
    
    /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
 florist.getFlorist = async (req, res) => {
console.log('fdksfjdslkfsdlkfsdjfkl111------1------',req.body)
        // let userId = await helper.getUUIDByTocken(req);
    
        // if ( userId && userId != '' ) {
    
            if ( req && req.body && req.body.lat && req.body.long && req.body.date ) {
    
                let userPostData = await _floristModel.getFloristData(req.body);
    
                if ( userPostData && userPostData != false ) {
    
                    helper.successHandler(res, {
                        status : true,
                        // message : ' ',
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
                    message : 'Please fill mandatory fields.'
                }, 200);
            };
        // } else {
            
        //     helper.errorHandler(res, {
        //         status 		: false,
        //         code        : "AAA-E1001",
        //         message		: "Unauthorized Error."
        //     }, 200);
        // };
    };
    
    
    /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
 florist.getFloristSliderList = async (req, res) => {
    console.log('fdksfjdslkfsdlkfsdjfkl111------1------',req.body)
    let userId ='';  
        
    if ( req && req.body && req.body.type ) {
        if(req.body.type == 'loginUser'){
             userId = await helper.getUUIDByTocken(req);

            if ( userId && userId != '' ) {    
                
                let userPostData = await _floristModel.getFloristSliderListData(req.body, userId);
                if ( userPostData && userPostData != false ) {
    
                    helper.successHandler(res, {
                        status : true,
                        // message : ' ',
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
                    status 		: false,
                    code        : "AAA-E1001",
                    message		: "Unauthorized Error."
                }, 200);
            };

        } else{

            let userPostData = await _floristModel.getFloristSliderListData(req.body, userId);

            if ( userPostData && userPostData != false ) {
    
                helper.successHandler(res, {
                    status : true,
                    // message : ' ',
                    payload : userPostData
                }, 200);
    
            } else {
    
                helper.successHandler(res, {
                    status  : false,
                    message : 'Something went wrong.'
                }, 200);
            };
        }

    } else {

        helper.errorHandler(res, {

            status 	: false,
            code 	: 'AAA-E1002',
            message : 'Please fill mandatory fields.'
        }, 200);
    };      
};
        
        
    
     /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
 florist.getAllFlorist = async (req, res) => {
    console.log('fdksfjdslkfsdlkfsdjfkl111------1--alll----',req.body)
            // let userId = await helper.getUUIDByTocken(req);
        
            // if ( userId && userId != '' ) {
        
                if ( req && req.body) {
        
                    let userPostData = await _floristModel.getAllFloristData(req.body);
        
                    if ( userPostData && userPostData != false ) {
        
                        helper.successHandler(res, {
                            status : true,
                            // message : ' ',
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
                        message : 'Please fill mandatory fields.'
                    }, 200);
                };
            // } else {
                
            //     helper.errorHandler(res, {
            //         status 		: false,
            //         code        : "AAA-E1001",
            //         message		: "Unauthorized Error."
            //     }, 200);
            // };
        };
        
        


florist.sentEmail = async (req, res) => {
    if (req && req.body) {

        let orderData = await _floristModel.getOrderData(req.body);
        if (orderData && orderData != false) {
            helper.successHandler(res, {
                status: true,
                message : 'Email has been sent to the recipients',
                // payload: orderData
            }, 200);

        } else {

            helper.successHandler(res, {
                status: false,
                message: 'Something went wrong.'
            }, 200);
        };
    } else {

        helper.errorHandler(res, {

            status: false,
            code: 'AAA-E1002',
            message: 'Please fill mandatory fields.'
        }, 200);
    };

};

        
        
    
    module.exports = florist;