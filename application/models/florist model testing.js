
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

let floristModel = {};

/**
* This function is get Post data
* @param     	:  body
* @developer 	: 
* @modified	: 
*/
floristModel.getFloristData = async ( body) => {

 //  console.log('body=====>>>',body)
 let deferred                = q.defer(),
     conObj                  = await constant.getConstant(),
     obj                     = {
         data                : [],
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
         latd                     = '',
         longd                    = '',
         records_per_page        =5// conObj.RECORDS_PER_PAGE;

    if ( body.per_page && body.per_page != 'null' ) {
         records_per_page        = body.per_page;
     } 
     
    if ( body.lat && body.lat != 'null' ) {
        latd        = body.lat;
    } 

    if ( body.long && body.long != 'null' ) {
        longd        = body.long;
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

     const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

     // const d = new Date();
     // console.log('dddddd------',d)
     // const d = '2022-12-18T15:39:03.909Z';//'20-12-2022';
     // const d = new Date('2022-12-20');
     const d = new Date(body.date);
     let userSelectedDay = weekday[d.getDay()];
     console.log('dayyyyy-------',userSelectedDay);
     var currentDayName = '';
     
     if (userSelectedDay == 'Friday') {
         currentDayName = "'Παρασκευή'";
     } else if (userSelectedDay == 'Monday') {
         currentDayName = "'Δευτέρα'";
     } else if (userSelectedDay == 'Tuesday') {
         currentDayName = "'Τρίτη'";
     } else if (userSelectedDay == 'Wednesday') {
         currentDayName = "'Τετάρτη'";
     } else if (userSelectedDay == 'Thursday') {
         currentDayName = "'Πέμπτη'";
     } else if (userSelectedDay === 'Saturday') {
         currentDayName = "'Σάββατο'";
     } else if (userSelectedDay == 'Sunday') {
         currentDayName = "'Κυριακή'";
     }
     console.log('currentDayName---',currentDayName)

    //  SELECT id, seller_id, user_name, name, email, cellphone, address, country, city, region FROM `florists` WHERE city LIKE '%The%' or city Like '%the%';
    // LEFT JOIN states ON states.id = user.u_state 

    // let sql = ` SELECT id, seller_id, user_name, name, email, cellphone, address, country, city, region, image, back_image, rating, ratingCount, minimam_order FROM 3959  6371 florists` 
    //  + addCondition;
     let sql = "SELECT florists.id, florists.seller_id, florists.user_name, florists.name, florists.email, florists.cellphone, florists.address, florists.country, florists.city, florists.region, florists.image, florists.back_image, florists.rating, florists.ratingCount, florists.minimam_order, florists.status, (6371 * 2 * ASIN(SQRT( POWER(SIN(( "+latd+" - lat) * pi()/180 / 2), 2) +COS("+latd+" * pi()/180) * COS("+latd+" * pi()/180) * POWER(SIN(( "+longd+" - lng) * pi()/180 / 2), 2) ))) as distance from florists  left JOIN timetable ON  florists.id =timetable.florist_id  where timetable.day = " + currentDayName + " AND florists.delivery_limit >0 AND florists.status = 1 AND timetable.status = 1 AND florists.admin = 2 GROUP BY florists.id  having distance <= 10";

         dataArray       = [ 1 ];
         // dataArray       = '',
    //  let getLastRecIdSql = sql + " GROUP BY id ORDER BY id DESC",
    //      moreRecordSql   = sql;

    //  let offset          = page * records_per_page;
    //  moreRecordSql       += whereMore + " GROUP BY id ORDER BY " + sortBy + " " + sortOrder;
    //  sql                 += whereLast + " GROUP BY id ORDER BY " + sortBy + " " + sortOrder + " LIMIT " + offset + "," + records_per_page;

     let result          = await common.commonSqlQuery(sql,true);
     let floristList = [];

    //  console.log('getPostData == 33333333333333 result === ', result);
         
     if ( result && result.sqlMessage ) { 

         deferred.resolve(false);
     } else {

         // console.log('getPostData == 555555555555555555 result === ');

         if ( result && result.length > 0 ) {

            for(var i = 0; i< result.length; i++){
                let floristId = result[i].id;
                let sqlFlorist = 'Select florist_id, user_email, rating, text from florist_rating where florist_id =?';
                let resultRating          = await common.commonSqlQuery(sqlFlorist, [floristId],true);
                console.log('ressss---------i---',resultRating,i);
                result[i].rating = resultRating;
             
            }


            obj.data            = result;
             // obj.total_records   = resultOne.length;
             obj.last            = result[0].id;
             obj.page            = page;

            //  if ( checkNewRecord ) {
            //      // console.log("hi i am in");

            //      let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
            //      // console.log("getLastRecId obj is : ", getLastRecId);
            //      if ( getLastRecId && getLastRecId.length > 0 ) {
            //          obj.lastRecId = getLastRecId[0].id;
            //      } 
            //  } 

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
floristModel.getAllFloristData = async ( body) => {

    //  console.log('body=====>>>',body)
    let deferred                = q.defer(),
        conObj                  = await constant.getConstant(),
        obj                     = {
            data                : [],
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
           
            records_per_page        = conObj.RECORDS_PER_PAGE;
   
       if ( body.per_page && body.per_page != 'null' ) {
            records_per_page        = body.per_page;
        } 
        
       if ( body.lat && body.lat != 'null' ) {
           latd        = body.lat;
       } 
   
       if ( body.long && body.long != 'null' ) {
           longd        = body.long;
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
   
        let sql = "SELECT florists.id, florists.seller_id, florists.user_name, florists.name, florists.email, florists.cellphone, florists.address, florists.country, florists.city, florists.region, florists.image, florists.back_image, florists.rating, florists.ratingCount, florists.delivery_limit, florists.minimam_order  from florists where florists.status = 1 AND florists.admin = 2  GROUP BY florists.id ";
        
            dataArray       = [ 1 ];
         
        let result          = await common.commonSqlQuery(sql,true);
        let floristList = [];
   
            
        if ( result && result.sqlMessage ) { 
   
            deferred.resolve(false);
        } else {
   
   
            if ( result && result.length > 0 ) {
   
               for(var i = 0; i< result.length; i++){
                   let floristId = result[i].id;
                   let sqlFlorist = 'Select florist_id, user_email, rating, text from florist_rating where florist_id =?';
                   let resultRating          = await common.commonSqlQuery(sqlFlorist, [floristId],true);
                   console.log('ressss---------i---',resultRating,i);
                   result[i].rating = resultRating;
                
               }
   
   
               obj.data            = result;
                // obj.total_records   = resultOne.length;
                obj.last            = result[0].id;
                obj.page            = page;
   
               //  if ( checkNewRecord ) {
               //      // console.log("hi i am in");
   
               //      let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
               //      // console.log("getLastRecId obj is : ", getLastRecId);
               //      if ( getLastRecId && getLastRecId.length > 0 ) {
               //          obj.lastRecId = getLastRecId[0].id;
               //      } 
               //  } 
   
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
floristModel.getFloristSliderListData = async ( body, userId ) => {

    //  console.log('body=====>>>',body)
    let deferred                = q.defer(),
        conObj                  = await constant.getConstant(),
        obj                     = {
            data                : [],
            // more_records        : 0,
            // total_records       : 0,
            // last                : 0,
            // lastRecId           : 0,
            // page                : 0,
            // type                : 'recent',
            // user_profile_url    : conObj.SITE_URL + conObj.UPLOAD_PATH + conObj.PROFILE_IMAGE_PATH,
        };
   
    if ( body ) {
        // console.log('getPostData == 22222222222222');
   
        let whereLast               = '',
            whereMore               = '',
            id                      = '',
            sortBy                  = 'id',
            sortOrder               = 'DESC',
            type                = 'recent',
            page                    = 0,
            checkNewRecord          = false,
            additionalNewCondition  = '',
            addCondition            = '',
            dataArray               = '',
           
            records_per_page        =5// conObj.RECORDS_PER_PAGE;
   
       if ( body.per_page && body.per_page != 'null' ) {
            records_per_page        = body.per_page;
        } 
        
       if ( body.lat && body.lat != 'null' ) {
           latd        = body.lat;
       } 
   
       if ( body.long && body.long != 'null' ) {
           longd        = body.long;
       } 

       if ( body.type && body.type != 'null' ) {
            type        = body.type;
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
        let sql ='',
            userFloristIds = [];

        if ( type == 'recent' ){
            sql = "SELECT florists.id, florists.seller_id, florists.user_name, florists.name, florists.email, florists.cellphone, florists.address, florists.country, florists.city, florists.region, florists.image, florists.back_image, florists.rating, florists.ratingCount, florists.delivery_limit, florists.minimam_order from florists where florists.status = ? AND florists.admin = 2 GROUP BY florists.id  DESC LIMIT 10";
            dataArray       = [ 1 ];
        }
         else if ( type == 'featured' ){
            sql = "SELECT florists.id, florists.seller_id, florists.user_name, florists.name, florists.email, florists.cellphone, florists.address, florists.country, florists.city,  florists.region, florists.image, florists.back_image, florists.rating, florists.ratingCount, florists.delivery_limit, florists.minimam_order from florists where florists.status = ? AND florists.featured_status = ? AND florists.admin = 2  GROUP BY florists.id  DESC LIMIT 10";
            dataArray       = [ 1, 1 ];
        } 
        else if( type = 'loginUser' ){
            let userOrdersSql = "SELECT id, orderNo, user_id, florist_id FROM orders WHERE user_id = ?",
                 userOrdersResult          = await common.commonSqlQuery(userOrdersSql, userId, true);
                 if(userOrdersResult){
                    //  console.log('userdfjdfjldsfsd----',userOrdersResult)
                    //  console.log('userdfjdfjldsfsd--000--',userOrdersResult[0]['florist_id'])

                    for(i = 0; i< userOrdersResult.length; i ++){
                        userFloristIds.push(userOrdersResult[i]['florist_id'])
                    }
                    console.log('userdfjdfjldsfsd--11111--',userFloristIds)
                    //  console.log('userdfjdfjldsfsd--111113333--', new Set(userFloristIds))
                let uuserFloristIds = new Set(userFloristIds); 
                console.log('dsfdsjkfdsjfdsf------',uuserFloristIds);

                sql = "SELECT florists.id, florists.seller_id, florists.user_name, florists.name, florists.email, florists.cellphone, florists.address, florists.country, florists.city,  florists.region, florists.image, florists.back_image, florists.rating, florists.ratingCount, florists.delivery_limit, florists.minimam_order from florists where florists.status = ? AND florists.admin = 2  AND  florists.id in (?) GROUP BY florists.id  DESC LIMIT 10";
                dataArray       = [ 1, userFloristIds ];
            }
               
        }
        
            
        let result          = await common.commonSqlQuery(sql,dataArray,true);
        let floristList = [];
   
            
        if ( result && result.sqlMessage ) { 
   
            deferred.resolve(false);
        } else {
      
            if ( result && result.length > 0 ) {
   
               for(var i = 0; i< result.length; i++){
                   let floristId = result[i].id;
                   let sqlFlorist = 'Select florist_id, user_email, rating, text from florist_rating where florist_id =?';
                   let resultRating          = await common.commonSqlQuery(sqlFlorist, [floristId],true);
                   console.log('ressss---------i---',resultRating,i);
                   result[i].rating = resultRating;
                
               }
   
   
               obj.data            = result;
                // obj.total_records   = resultOne.length;
                // obj.last            = result[0].id;
                // obj.page            = page;
   
               //  if ( checkNewRecord ) {
               //      // console.log("hi i am in");
   
               //      let getLastRecId = await common.commonSqlQuery(getLastRecIdSql, dataArray, false);
               //      // console.log("getLastRecId obj is : ", getLastRecId);
               //      if ( getLastRecId && getLastRecId.length > 0 ) {
               //          obj.lastRecId = getLastRecId[0].id;
               //      } 
               //  } 
   
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
   
   

module.exports = floristModel;