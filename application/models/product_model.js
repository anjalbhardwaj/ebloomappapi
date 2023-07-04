
/**
 * Copyright (C) A Cube Technologies - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential. Dissemination of this information or reproduction 
 * of this material is strictly forbidden unless prior written permission is obtained
 * from A Cube Technologies.                                                                                                                                                                                                                                                                                                                  
 * Written By  : 
 * Description :
 * Modified By :
 */

 const pool 	            = require('../../common/config/pool')// common/config/pool'),
 // spacetime           = require('spacetime'),
 q                   = require('q'),
 // fs                  = require('fs'),
 {v1: uuidv1}        = require('uuid'),
 common              = require('./common'),
 constant            = require('../../common/config/constants'),
 commonHelper        = require('../../common/helpers/index'),
 helper			    = require('../../common/helpers'),
 path				= require('path');
const commonModel = require('./common');

// const { updateData } = require('../../common/helper/mongo_helper');

let productModel = {};

/**
* This function is get Post data
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
productModel.getFloristProductData = async ( body, floristId) => {

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
         sortBy                  = 'id',
         sortOrder               = 'DESC',
         page                    = 0,
         checkNewRecord          = false,
         additionalNewCondition  = '',
         addCondition            = '',
         dataArray               = '',
         records_per_page        = 100//conObj.RECORDS_PER_PAGE;

     if ( body.per_page && body.per_page != 'null' ) {
         records_per_page        = body.per_page;
     } 

     if ( body.page && body.page != '' && body.page != null && body.page != 'null' ) {
         page = Number(body.page) + 1;
         // page = body.page;

         if ( body.lastRecId != null && body.lastRecId != "null" && body.lastRecId != "" && sortOrder == "DESC") {
             // console.log(body.lastRecId)
             additionalNewCondition = " AND id <= " + body.lastRecId;
         }
     } else {
         // console.log('new last id ');
         checkNewRecord  = true;
     }
     if ( body.last && body.last != 'null' ) {
         whereLast       += 'AND id <= ' + body.last;
         whereMore       += 'AND id > ' + body.last;
     }

     if ( body.sortOrder && body.sortOrder != 'null' ) {
         sortOrder       = body.sortOrder;
     }

     if ( body.sortBy && body.sortBy != 'null' ) {
         sortBy          = body.sortBy;
     }
    //  capitalizeFirstLetter

     if ( body.keyword && body.keyword != 'null' ) {
         whereLast       +=  " WHERE city LIKE '%" + body.keyword + "%' OR city LIKE '%" + await helper.capitalizeFirstLetter(body.keyword) + "%'";
         whereMore       +=  " WHERE city LIKE '%" + body.keyword + "%' OR city LIKE '%" + await helper.capitalizeFirstLetter(body.keyword) + "%'";
     }

     whereLast           += additionalNewCondition;
    //  SELECT id, seller_id, user_name, name, email, cellphone, address, country, city, region FROM `products` WHERE city LIKE '%The%' or city Like '%the%';

    let sql = ` SELECT id, name, code, company, description, name_eng, code_eng, description_eng, price, slug, image, florist_id, occasion_id FROM products WHERE florist_id = ? AND status = ?

    
    ` + addCondition;
         dataArray       = [ floristId, 1 ];
         // dataArray       = '',
     let getLastRecIdSql = sql + " GROUP BY id ORDER BY id DESC",
         moreRecordSql   = sql;

     let offset          = page * records_per_page;
     moreRecordSql       += whereMore + " GROUP BY id ORDER BY " + sortBy + " " + sortOrder;
     sql                 += whereLast + " GROUP BY id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;

     let result          = await common.commonSqlQuery(sql, dataArray,true);

     console.log('getPostData == 33333333333333 result === ', result);

     let sqlCat = ` SELECT  occasion_id FROM products WHERE florist_id = ? AND status = ?`
     dataArrayCat       = [ floristId, 1 ];
     let resultCat          = await common.commonSqlQuery(sqlCat, dataArrayCat,true);
     console.log('getPostData == 3333dsfasfds3333333333 result === ', resultCat);

let resultCatDataArr = [];
     for(var i=0; i<=resultCat.length; i++){
        console.log('rrreeeee--------', resultCat[i])
        if(resultCat && resultCat[i] && resultCat[i] != null && resultCat[i] != undefined && resultCat[i].occasion_id &&  resultCat[i].occasion_id != undefined &&  resultCat[i].occasion_id != null && resultCat[i].occasion_id != ''){
            let sqlCatData = ` SELECT  * FROM occasions WHERE id = ? AND status = ?`
            dataArrayCatData       = [ resultCat[i].occasion_id, 1 ];
            let resultCatData          = await common.commonSqlQuery(sqlCatData, dataArrayCat,true);
            console.log('getPostData == 3333dsfasfds3333333333 result ==Data= ', resultCatData);
            resultCatDataArr.push(resultCatData);
        }
        
     }
     
    //  let sqlCatData = ` SELECT  occasion_id FROM products WHERE florist_id = ? AND status = ?`
    //  dataArrayCatData       = [ floristId, 1 ];
    //  let resultCatData          = await common.commonSqlQuery(sqlCatData, dataArrayCat,true);
    //  console.log('getPostData == 3333dsfasfds3333333333 result ==Data= ', resultCatData);



     if ( result && result.sqlMessage ) { 

         deferred.resolve(false);
     } else {

         // console.log('getPostData == 555555555555555555 result === ');

         if ( result && result.length > 0 ) {

            for(var i = 0; i<result.length;i++){
                result[i].count = 0;
                result[i].itemCountTotalCost = 0;
                result[i].comment = '';
            }


            obj.category        = resultCatDataArr;
             obj.data            = result;
             // obj.total_records   = resultOne.length;
             obj.last            = result[0].id;
             obj.page            = page;

             if ( checkNewRecord ) {
                 // console.log("hi i am in");

                 let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
                 // console.log("getLastRecId obj is : ", getLastRecId);
                 if ( getLastRecId && getLastRecId.length > 0 ) {
                     obj.lastRecId = getLastRecId[0].id;
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
* This function is get Post data
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
productModel.getUserProductData = async ( body, userId ) => {

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
            sortBy                  = 'orders_products.id',
            sortOrder               = 'DESC',
            page                    = 0,
            checkNewRecord          = false,
            additionalNewCondition  = '',
            addCondition            = '',
            dataArray               = '',
            records_per_page        = 100//conObj.RECORDS_PER_PAGE;
   
        if ( body.per_page && body.per_page != 'null' ) {
            records_per_page        = body.per_page;
        } 
   
        if ( body.page && body.page != '' && body.page != null && body.page != 'null' ) {
            page = Number(body.page) + 1;
            // page = body.page;
   
            if ( body.lastRecId != null && body.lastRecId != "null" && body.lastRecId != "" && sortOrder == "DESC") {
                // console.log(body.lastRecId)
                additionalNewCondition = " AND id <= " + body.lastRecId;
            }
        } else {
            // console.log('new last id ');
            checkNewRecord  = true;
        }
        if ( body.last && body.last != 'null' ) {
            whereLast       += 'AND id <= ' + body.last;
            whereMore       += 'AND id > ' + body.last;
        }
   
        if ( body.sortOrder && body.sortOrder != 'null' ) {
            sortOrder       = body.sortOrder;
        }
   
        if ( body.sortBy && body.sortBy != 'null' ) {
            sortBy          = body.sortBy;
        }
       //  capitalizeFirstLetter
   
        if ( body.keyword && body.keyword != 'null' ) {
            whereLast       +=  " WHERE city LIKE '%" + body.keyword + "%' OR city LIKE '%" + await helper.capitalizeFirstLetter(body.keyword) + "%'";
            whereMore       +=  " WHERE city LIKE '%" + body.keyword + "%' OR city LIKE '%" + await helper.capitalizeFirstLetter(body.keyword) + "%'";
        }
   
        whereLast           += additionalNewCondition;
       //  SELECT id, seller_id, user_name, name, email, cellphone, address, country, city, region FROM `products` WHERE city LIKE '%The%' or city Like '%the%';
   
    //    let sql = ` SELECT name, code, company, description, name_eng, code_eng, description_eng, price, slug, image, florist_id, occasion_id FROM products WHERE florist_id = ? AND status = ?
   
    let sql = `SELECT *, florist_id, occasion_id FROM orders_products LEFT JOIN products on products.id = orders_products.product_id where user_id = ? 

       ` + addCondition;
            dataArray       = [userId];
            // dataArray       = '',
        let getLastRecIdSql = sql + " GROUP BY orders_products.id ORDER BY orders_products.id DESC",
            moreRecordSql   = sql;
   
        let offset          = page * records_per_page;
        moreRecordSql       += whereMore + " GROUP BY orders_products.id ORDER BY " + sortBy + " " + sortOrder;
        sql                 += whereLast + " GROUP BY orders_products.id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;
   
        let result          = await common.commonSqlQuery(sql, dataArray,true);
   
        console.log('getPostData == 33333333333333 result === ', result);
   
//         let sqlCat = ` SELECT  occasion_id FROM products WHERE florist_id = ? AND status = ?`
//         dataArrayCat       = [ floristId, 1 ];
//         let resultCat          = await common.commonSqlQuery(sqlCat, dataArrayCat,true);
//         console.log('getPostData == 3333dsfasfds3333333333 result === ', resultCat);
   
   
//         console.log('getPostData == 3333dsfasfds3333333333 result === ', resultCat[0].occasion_id);
//    let resultCatDataArr = [];
//         for(var i=0; i<=resultCat.length; i++){
//            console.log('rrreeeee--------', resultCat[i])
//            if(resultCat && resultCat[i] && resultCat[i] != null && resultCat[i] != undefined && resultCat[i].occasion_id &&  resultCat[i].occasion_id != undefined &&  resultCat[i].occasion_id != null && resultCat[i].occasion_id != ''){
//                let sqlCatData = ` SELECT  * FROM occasions WHERE id = ? AND status = ?`
//                dataArrayCatData       = [ resultCat[i].occasion_id, 1 ];
//                let resultCatData          = await common.commonSqlQuery(sqlCatData, dataArrayCat,true);
//                console.log('getPostData == 3333dsfasfds3333333333 result ==Data= ', resultCatData);
//                resultCatDataArr.push(resultCatData);
//            }
           
//         }
     
   
        if ( result && result.sqlMessage ) { 
   
            deferred.resolve(false);
        } else {
   
            // console.log('getPostData == 555555555555555555 result === ');
   
            if ( result && result.length > 0 ) {
            //    obj.category        = resultCatDataArr;
                obj.data            = result;
                // obj.total_records   = resultOne.length;
                obj.last            = result[0].id;
                obj.page            = page;
   
                if ( checkNewRecord ) {
                    // console.log("hi i am in");
   
                    let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
                    // console.log("getLastRecId obj is : ", getLastRecId);
                    if ( getLastRecId && getLastRecId.length > 0 ) {
                        obj.lastRecId = getLastRecId[0].id;
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
* This function is add to cart product
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
productModel.addToCart = async (userId, body, productData ) => {

    let deferred    = q.defer(),
        date        = new Date(),
        conObj      = await constant.getConstant();
        
    if ( body ) {

        let productId    = '',
            userEmail    = '',           
            quantity     = '',   
            productSize  = '', 
            productName  = '',
            productCode  = '',   
            company      = '',
            productColor = '',  
            productprice = '',           
            userId       = '',  
            tablename    = 'cart';                

        if ( body.productId && body.productId != 'null' ) {
            productId        = body.productId;
        } 
        if ( body.emailId && body.emailId != 'null' ) {
            userEmail        = body.emailId;
        }  
        if ( body.size && body.size != 'null' ) {
            productSize        = body.size;
        }  
        if ( body.quantity && body.quantity != 'null' ) {
            quantity        = body.quantity;
        } 
        if ( body.productColor && body.productColor != 'null' ) {
            productColor        = body.productColor;
        } 
        

        if ( userId && userId != 'null' ) {
            userId        = userId;
        } 

        if ( productData.name && productData.name != 'null' ) {
            productName        = productData.name;
        } 
        if ( productData.code && productData.code != 'null' ) {
            productCode        = productData.code;
        } 
        if ( productData.price && productData.price != 'null' ) {
            productprice        = productData.price;
        }
        if ( productData.company && productData.company != 'null' ) {
            company        = productData.company;
        } 

        productObj = {
            product_id      : productId,
            product_name    : productName,
            product_code    : productCode,
            company         : company,
            product_color   : productColor,
            size            : productSize,
            price           : productprice,
            quantity        : quantity,
            user_email      : userEmail,
            user_id         : userId,
            created_at      : date,
            updated_at      : date,
        }
       
        let result      = await commonModel.insert (tablename, productObj, true) 
   
        console.log('getPostData == 33333333333333 result === ', result);
            
        if ( result && result.sqlMessage ) { 
   
            deferred.resolve(false);
        } else 
        {
            deferred.resolve(true);
   
        } 
        return deferred.promise;
    }
}


 /**
* This function is get Post data
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
productModel.getProductsInCartList = async ( body, userId) => {

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
            sortBy                  = 'id',
            sortOrder               = 'DESC',
            page                    = 0,
            checkNewRecord          = false,
            additionalNewCondition  = '',
            addCondition            = '',
            dataArray               = '',
            records_per_page        =conObj.RECORDS_PER_PAGE;
   
        if ( body.per_page && body.per_page != 'null' ) {
            records_per_page        = body.per_page;
        } 
   
        if ( body.page && body.page != '' && body.page != null && body.page != 'null' ) {
            page = Number(body.page) + 1;
            // page = body.page;
   
            if ( body.lastRecId != null && body.lastRecId != "null" && body.lastRecId != "" && sortOrder == "DESC") {
                // console.log(body.lastRecId)
                additionalNewCondition = " AND id <= " + body.lastRecId;
            }
        } else {
            // console.log('new last id ');
            checkNewRecord  = true;
        }
        if ( body.last && body.last != 'null' ) {
            whereLast       += 'AND id <= ' + body.last;
            whereMore       += 'AND id > ' + body.last;
        }
   
        if ( body.sortOrder && body.sortOrder != 'null' ) {
            sortOrder       = body.sortOrder;
        }
   
        if ( body.sortBy && body.sortBy != 'null' ) {
            sortBy          = body.sortBy;
        }
       //  capitalizeFirstLetter
   
        if ( body.keyword && body.keyword != 'null' ) {
            whereLast       +=  " WHERE city LIKE '%" + body.keyword + "%' OR city LIKE '%" + await helper.capitalizeFirstLetter(body.keyword) + "%'";
            whereMore       +=  " WHERE city LIKE '%" + body.keyword + "%' OR city LIKE '%" + await helper.capitalizeFirstLetter(body.keyword) + "%'";
        }
   
        whereLast           += additionalNewCondition;
       //  SELECT id, seller_id, user_name, name, email, cellphone, address, country, city, region FROM `products` WHERE city LIKE '%The%' or city Like '%the%';
   
       let sql = ` SELECT id,	product_id,	product_name, product_code,company,product_color, size, price, quantity, user_email, user_id FROM cart WHERE user_email = ? 
   
       
       ` + addCondition;
            dataArray       = [ body.emailId ];
            // dataArray       = '',
        let getLastRecIdSql = sql + " GROUP BY id ORDER BY id DESC",
            moreRecordSql   = sql;
   
        let offset          = page * records_per_page;
        moreRecordSql       += whereMore + " GROUP BY id ORDER BY " + sortBy + " " + sortOrder;
        sql                 += whereLast + " GROUP BY id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;
   
        let result          = await common.commonSqlQuery(sql, dataArray,true);
   
        console.log('getPostData == 33333333333333 result === ', result);
            
        if ( result && result.sqlMessage ) { 
   
            deferred.resolve(false);
        } else {
   
            // console.log('getPostData == 555555555555555555 result === ');
   
            if ( result && result.length > 0 ) {
   
                obj.data            = result;
                // obj.total_records   = resultOne.length;
                obj.last            = result[0].id;
                obj.page            = page;
   
                if ( checkNewRecord ) {
                    // console.log("hi i am in");
   
                    let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
                    // console.log("getLastRecId obj is : ", getLastRecId);
                    if ( getLastRecId && getLastRecId.length > 0 ) {
                        obj.lastRecId = getLastRecId[0].id;
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





//    "u_id": apiData.uId,
//    "u_Type": apiData.uType,
//    "s_type": apiData.sType,
//    "u_name": apiData.sName,
//    "u_email": apiData.sEmail,
//    "u_phone": apiData.sPhone,
//    "u_RIType": apiData.sriType,
//    "ui_companyName": apiData.companyName,
//    "ui_vat": apiData.vat,
//    "ui_business": apiData.business,
//    "ui_aoy": apiData.aoy,
//    "ui_address": apiData.addrees,
//    "ui_area": apiData.area,
//    "ui_tx": apiData.tx,
//    "ui_phone": apiData.phone,
//    "ui_isEmail": apiData.isEmail,
//    "r_address": apiData.rAddress,
//    "r_name": apiData.rName,
//    "r_Mobile": apiData.rMobile,
//    "r_doorBell": apiData.rDoorBell,
//    "r_floor": apiData.rFloor,
//    "r_comments": apiData.rComments,
//    "r_couponCode": apiData.rCouponCode,
//    "florist_id": apiData.florist_id,
//    "florist_name": apiData.florist_name,
//    "cartitems": apiData.product,
//    "totalAmount": apiData.totalAmount,
//    "shippingFee": apiData.shippingFee,

/**
* This function is add to cart product
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
productModel.checkout= async ( body ) => {

    let deferred    = q.defer(),
        date        = new Date(),
        conObj      = await constant.getConstant();
        
    if ( body ) {

        let user_id         = '',	
            florist_id      = '',
            florist_name    = '',	
            user_email	    = '',
            name            = '',
            address	        = '',
            floor	        = '',
            pincode	        = '',
            city            = '',	
            country	        = '',
            mobile	        = '',
            doorbell        = '',	
            optional_phone  = '',	
            address_msg	    = '',
            delivery_limit	= '',
            shipping_charges= '0',	
            coupon_code	    = '',
            coupon_amount   = '0',	
            redeem_amount   = '',	
            remaining_points= '',	
            order_status    = 'New',
            payment_method  = '',	
            grand_total     = '0',	
            delivery_date   = '',	
            fromHour        = '',	
            delivery_time   = 'any',	
            sender          = '',
            senderName      = '',
            senderEmail     = '',	
            company         = 'no',
            tablename       = 'orders',
            receiptOptions  = 'Receipt';

                        

        if ( body.u_id && body.u_id != 'null' ) {
            user_id        = body.u_id;
        } 
        if ( body.florist_id && body.florist_id != 'null' ) {
            florist_id        = body.florist_id;
        }  
        if ( body.florist_name && body.florist_name != 'null' ) {
            florist_name        = body.florist_name;
        }  
        if ( body.u_email && body.u_email != 'null' ) {
            user_email        = body.u_email;
        } 
        if ( body.r_name && body.r_name != 'null' ) {
            name        = body.r_name;
        } 
        if ( body.r_address && body.r_address != 'null' ) {
            address        = body.r_address;
        } 
        
        if ( body.r_floor && body.r_floor != 'null' ) {
            floor        = body.r_floor;
        } 
        
        if ( body.pincode && body.pincode != 'null' ) {
            pincode        = body.pincode;
        } 
        
        if ( body.city && body.city != 'null' ) {
            city        = body.city;
        }  
        
        if ( body.country && body.country != 'null' ) {
            country        = body.country;
        } 

         if ( body.r_Mobile && body.r_Mobile != 'null' ) {
            mobile        = body.r_Mobile;
        } 
         if ( body.r_doorBell && body.r_doorBell != 'null' ) {
            doorbell        = body.r_doorBell;
        } 
         if ( body.optional_phone && body.optional_phone != 'null' ) {
            optional_phone        = body.optional_phone;
        }  
        if ( body.address_msg && body.address_msg != 'null' ) {
            address_msg        = body.address_msg;
        } 
         if ( body.delivery_limit && body.delivery_limit != 'null' ) {
            delivery_limit        = body.delivery_limit;
        }  
        if ( body.shipping_charges && body.shipping_charges != 'null' ) {
            shipping_charges        = body.shipping_charges;
        }  
        if ( body.r_couponCode && body.r_couponCode != 'null' ) {
            coupon_code        = body.r_couponCode;
        }  
        if ( body.coupon_amount && body.coupon_amount != 'null' ) {
            coupon_amount        = body.coupon_amount;
        } 
         if ( body.redeem_amount && body.redeem_amount != 'null' ) {
            redeem_amount        = body.redeem_amount;
        } 
         if ( body.remaining_points && body.remaining_points != 'null' ) {
            remaining_points        = body.remaining_points;
        } 
        if ( body.payment_method && body.payment_method != 'null' ) {
            payment_method        = body.payment_method;
        }
         if ( body.totalAmount && body.totalAmount != 'null' ) {
            grand_total        = body.totalAmount;
        } 
        if ( body.delivery_date && body.delivery_date != 'null' ) {
            delivery_date        = body.delivery_date;
        }
         if ( body.fromHour && body.fromHour != 'null' ) {
            fromHour        = body.fromHour;
        }
         if ( body.delivery_time && body.delivery_time != 'null' ) {
            delivery_time        = body.delivery_time;
        }
         if ( body.u_id && body.u_id != 'null' ) {
            sender        = body.u_id;
        } 
        if ( body.u_name && body.u_name != 'null' ) {
            senderName        = body.u_name;
        } 
        if ( body.u_email && body.u_email != 'null' ) {
            senderEmail        = body.u_email;
        } 
     
          if ( body.company && body.company != 'null' ) {
            company        = body.company;
        }  
         if ( body.receiptOptions && body.receiptOptions != 'null' ) {
            receiptOptions        = body.receiptOptions;
        } 
    
        orderObj = {
            user_id         : user_id,
            florist_id      : florist_id,
            florist_name    : florist_name,
            user_email	    : user_email,
            name            : name,
            address	        : address,
            floor	        : floor,
            pincode	        : pincode,
            city            : city,
            country	        : country,
            mobile	        : mobile,
            doorbell        : doorbell,	
            optional_phone  : optional_phone,	
            address_msg	    : address_msg,
            delivery_limit	: delivery_limit,
            shipping_charges: shipping_charges,	
            coupon_code	    : coupon_code,
            coupon_amount   : coupon_amount,	
            redeem_amount   :redeem_amount,	
            remaining_points:remaining_points,	
            order_status    : 'New',
            payment_method  : payment_method,	
            grand_total     : grand_total,	
            delivery_date   : delivery_date,	
            fromHour        : fromHour,	
            delivery_time   : delivery_time,	
            sender          : sender,
            senderName      : senderName,
            senderEmail     : senderEmail,	
            company         : company,
            receiptOptions  : receiptOptions,
            created_at      : date,
            updated_at      : date,
        }
       
        let result      = await commonModel.insert (tablename, orderObj, true) 
   
        console.log('orderObj == 33333333333333 result === ', result);
            
        if ( result && result.sqlMessage ) { 
   
            deferred.resolve(false);
       
       
        } else 
        {
            if (result && result != ''){
                let sqlupdate = "UPDATE orders SET orderNo = ? , showOrder = ? WHERE id = ?",
                 resultUpdate          = await common.commonSqlQuery(sqlupdate, ['EB0'+result, 0, result],true);

            }
            deferred.resolve(result);
   
        } 
        return deferred.promise;
    }
}



/**
* This function is a
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
productModel.updateTransactionId = async ( body ) => {

    let deferred    = q.defer(),
        date        = new Date(),
        conObj      = await constant.getConstant();
        
    if ( body ) {

        let orderId    = '',
                    
            transactionId       = '';
            // tablename    = 'orders';                

        if ( body.orderId && body.orderId != 'null' ) {
            orderId        = body.orderId;
        } 
        if ( body.transactionId && body.transactionId != 'null' ) {
            transactionId        = body.transactionId;
        }  
      


        let sqlupdate = "UPDATE orders SET payment_token = ? WHERE id = ?, UPDATE orders SET showOrders = 1 WHERE id = ?",
        resultUpdate          = await common.commonSqlQuery(sqlupdate, [transactionId, orderId],true);
        
   
        console.log('getPostData == 33333333333333 result sqlupdate=== ', sqlupdate);
            
        if ( sqlupdate && sqlupdate.sqlMessage ) { 
   
            deferred.resolve(false);
        } else 
        {
            deferred.resolve(true);
   
        } 
        return deferred.promise;
    }
}



module.exports = productModel;