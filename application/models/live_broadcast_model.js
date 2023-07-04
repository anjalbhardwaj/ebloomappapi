
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
    axios               = require("axios"),
    common              = require('../models/common'),
    constant            = require('../../common/config/constants'),
    commonHelper        = require('../../common/helpers/index'),
    helper			    = require('../../common/helpers');
// const { updateData } = require('../../common/helper/mongo_helper');

let liveBroadcastModel = {};

/**
* Used to contest insert broadcast Data
* @developer   : Dushyant Sharma
* @modified    :
* @params      :
*/
liveBroadcastModel.insertContestBroadcast = async (body, userId) => {

    let deferred            = q.defer(),
          uuid              = uuidv1(Date.now()),
          insertedDate      = new Date();

  
    if( body && userId ) {
  
      let userUuid = await common.getRowId(userId,'u_id','u_uuid','user'),
           object   = {
  
          lb_fk_ct_uuid : body.contestUuid,
          lb_fk_u_uuid  : userUuid,
          lb_uuid       : uuid,
          lb_status     : body.status ? body.status : 'LIVE',
          lb_created	: insertedDate
         };
        
          let insertedId = await common.insert('live_broadcast',object, true );
  
          console.log('insertedId insertedId insertedId',insertedId );
  
          if ( insertedId && insertedId > 0 ){
  
              body.userType   = 'H';
              let result      =   await liveBroadcastModel.insertJoinBroadcast(body, userId);
  
              console.log('result result result result result result result ',result)
              deferred.resolve( insertedId );
  
          } else {
  
              deferred.resolve( false );
  
          }
  
     
    } else {
  
      deferred.resolve( false );
    }
  
    return deferred.promise
}

 /**
* Used to channel insert broadcast Data
* @developer   : Dushyant Sharma
* @modified    :
* @params      :
*/
liveBroadcastModel.insertJoinBroadcast = async (body, userId) => {

    let deferred            = q.defer(),
          uuid              = uuidv1(Date.now()),
          insertedDate      = new Date();;
  
    if( body && userId ) {
  
        let userUuid       = await common.getRowId(userId,'u_id','u_uuid','user'),
            broadCastSql   = 'SELECT lb_uuid FROM live_broadcast WHERE lb_fk_ct_uuid = ? AND lb_status ="LIVE"',
            broadCastUuid  = await common.commonSqlQuery(broadCastSql,[body.contestUuid],true);
        if( broadCastUuid && broadCastUuid != ''  ){
            console.log('broadcast================>>',broadCastUuid)

            object   = {
    
                lbud_fk_ct_uuid : body.contestUuid,
                lbud_fk_lb_uuid : broadCastUuid[0].lb_uuid,
                lbud_fk_u_uuid  : userUuid,
                lbud_uuid       : uuid,
                lbud_user_type  : body.userType ? body.userType : 'V',
                //   lbud_status     : body.status,
                lbud_created	  : insertedDate
            };

            let sql = 'SELECT lbud_id FROM live_broadcast_users_detail WHERE lbud_fk_ct_uuid = ? AND lbud_fk_lb_uuid = ? AND lbud_fk_u_uuid = ? AND lbud_status = "live"'
                isExist = await common.commonSqlQuery(sql,[body.contestUuid,broadCastUuid[0].lb_uuid,userUuid],true);

            if( isExist == '' ){
        
                let insertedId = await common.insert('live_broadcast_users_detail',object);
                console.log('insertedId insertedId insertedId asdasdasdadasd',insertedId );
                if ( insertedId ){
                    
                 deferred.resolve( insertedId );
        
                } else {
        
                 deferred.resolve( false );
        
                }
                
            } else {

                deferred.resolve( true );

            }
        } else {

            deferred.resolve( false );

        }
    
  
    } else {
  
      deferred.resolve( false );
    }
  
    return deferred.promise
}


/**
* Used to  broadcast  acquire
* @developer   : 
* @modified    :
* @params      : channelUuid, uid
*/

liveBroadcastModel.recordingAcquire = async ( body ) => {

	console.log(body, 'body==========bo=<<<<<<<<<<<<<<')
    if ( body ) {

        let conObj   = await constant.getConstant();

            agoraApiUrl = conObj.AGORA_API_URL,
            appID       = conObj.AGORA_APP_ID,
            restKey     = conObj.AGORA_REST_KEY,
            restSecret  = conObj.AGORA_SECRET_KEY;
            
        const Authorization = `Basic ${Buffer.from(`${restKey}:${restSecret}`).toString("base64")}`;
        
        try {

            const acquire 		= await axios.post(

            `${agoraApiUrl}${appID}/cloud_recording/acquire`,

            {
                cname   : body.contestUuid,
                uid		: '1111111111',

                clientRequest: {

                resourceExpiredHour: 24,
                },
            },
            { headers: { Authorization } }
            );
          
            body.resourceId =  acquire.data.resourceId
            let starts = await liveBroadcastModel.startVideoRecording( body );

            // console.log( "starts======>>>>>>>>", starts )
            return starts
     
        } catch (err) {
            console.log( "er================.....>>>>>>>>>", err );
            return false;

        } 
    } else {

        return false;
    }
}

/**
 * This function is used to start video recording.
 * @param     : resourceId, contestUuid, uid
 * @returns   :
 * @developer :
 **/

liveBroadcastModel.startVideoRecording = async ( body ) => {

    if ( body ) {
        console.log('AAAAAAAAAA =========================> ', body);
        
        let conObj      = await constant.getConstant(),
            agoraApiUrl = conObj.AGORA_API_URL,
            appID       = conObj.AGORA_APP_ID,
            restKey     = conObj.AGORA_REST_KEY,
            restSecret  = conObj.AGORA_SECRET_KEY;
        
        const Authorization = `Basic ${Buffer.from(`${restKey}:${restSecret}`).toString("base64")}`;
        console.log('BBBBBBBBBBBBBBBBBBB Authorization : =========================> ', Authorization);
       
        const resource      = body.resourceId,
        token               = body.token,
        mode                = 'mix';

        let data            = JSON.stringify({
            "cname"         : body.contestUuid,
            "uid"           : "1111111111",
            "clientRequest" : {
                "token"             : token,
                "recordingConfig"   : {
                    "channelType"       : 0,
                    "streamTypes"       : 2,
                    "audioProfile"      : 1,
                    "videoStreamType"   : 0,
                    "maxIdleTime"       : 120,
                    "transcodingConfig" : {
                        "width"             : 640,
                        "height"            : 360,
                        "fps"               : 30,
                        "bitrate"           : 600,
                        "maxResolutionUid"  : "1",
                        "mixedVideoLayout"  : 1
                    },
                    
                },
                "recordingFileConfig" : {
                    "avFileType"        : ["hls", "mp4"],
                },
                "storageConfig"     : {
                    "vendor"            : 1,
                    "region"            : 0,
                    "bucket"            : conObj.AWS_BUCKET_NAME,
                    "accessKey"         : conObj.AWS_ACCESS_KEY,
                    "secretKey"         : conObj.AWS_SECRET_ACCESS_KEY,
                    "fileNamePrefix"    : ["streams"]
                }
            }
        }),
        
            config = {
                method  : 'post',
                url     : agoraApiUrl + appID + '/cloud_recording/resourceid/' + resource + '/mode/' + mode + '/start',
                headers : { 
                    'Content-Type'    : 'application/json', 
                    'Authorization'   : Authorization
                },
                data    : data
            },

            start = await axios(config);
        // console.log('CCCCCCCCCCCCCCCCCCCCCCCCC start : =========================> ', start.data);
        return start.data;

        
    } else {
        return false;
    }
}


/**
 * Used to update recorded file name to database.
 * @param       : broadcastUuid, contestUuid 
 * @returns     :  
 * @developer   : 
 */
 liveBroadcastModel.stopLiveBroadcast = async ( body ) => {

    let deferred            = q.defer();
    console.log('bodyyyyy======', body );

    if ( body ) {

        let conObj          = await constant.getConstant(),
            filePath        = conObj.UPLOAD_PATH,
            folderPath      = conObj.BROADCAST_UPLOAD_PATH,
            subFolderPath   = conObj.AWS_VIDEO_PATH;

        let sourcePath      = "streams",
            newFile         = '',
            fileMp4         = '';
        const resource      = body.resourceId,
            sid             = body.sid,
            agoraApiUrl     = conObj.AGORA_API_URL,
            appID           = conObj.AGORA_APP_ID,
            restKey         = conObj.AGORA_REST_KEY,
            restSecret      = conObj.AGORA_SECRET_KEY,
            mode            = "mix";
           
        try {

            const Authorization   = `Basic ${Buffer.from(`${restKey}:${restSecret}`).toString("base64")}`;
            console.log('We are hear ===================>>>>>>>1111111111',Authorization);

            const stopOne            = await axios.post(
                `${agoraApiUrl}${appID}/cloud_recording/resourceid/${resource}/sid/${sid}/mode/${mode}/stop`,
                {

                    cname : body.broadcastUuid,
                    uid   : '1111111111',
                    clientRequest: {
                        resourceExpiredHour: 24
                    },

                },
                { headers: { Authorization } }
            );
          
            // console.log( 'stopOne=======>>>>>>>>>>stopOneppppppppppppp>>>>', stopOne );
            if ( stopOne && stopOne.data ) {

                if ( stopOne.data.resourceId ) {
    
                    resourseId  = stopOne.data.resourceId;
                }
    
                if ( stopOne.data.sid ) {
    
                    asid        = stopOne.data.sid;
                }
    
                if ( stopOne.data.serverResponse && stopOne.data.serverResponse.fileList && stopOne.data.serverResponse.fileList.length > 0 ) {
    
                    fileMp4     =  stopOne.data.serverResponse.fileList[0].fileName;
    
                    if ( fileMp4 ) {
    
                        let splitFile   = fileMp4.split('/');
    
                        console.log( "splitFile=====>>>>>>>", splitFile );
    
                        if ( splitFile && splitFile.length > 0 ) {
    
                            if ( splitFile[1] ) {
    
                                newFile = splitFile[1];
    
                            }
                        }
    
                        filePath += folderPath + body.contestUuid + '/' + body.broadcastUuid + '/' + subFolderPath;
                    
                        console.log("filePathfilePathfilePath=======>>>>>>",filePath);
    
                        let crtFolderObj = {
                            
                            sourcePath      : sourcePath,  
                            destinationPath : filePath,
                            fileName        : stopOne.data.sid + '_' + body.broadcastUuid,
                            // moveName        : body.broadcastUuid,
                            
                        };
                        let copyFile = await helper.copyFileWithInAWSBucket( crtFolderObj );
                        console.log('We are hear ===================>>>>>>>copyFile',copyFile);
                        if ( copyFile ) {

                            let thumbDataObj    = {
                                videoName       : newFile,
                                folderPath      : filePath,
                                folderUId       : body.contestUuid,
                            };

                            console.log("thumbDataObj===========>",thumbDataObj);

                            let thumbnailData   = await helper.createThumbnailAWSBucket( thumbDataObj );

                            console.log( 'thumbnailData=========>>>>>>>', thumbnailData );

                            if ( thumbnailData ) {

                                let addData = await liveBroadcastModel.updateBroadcastFileName( body );

                                console.log ("addData ===========>>>>>>>",addData);

                                if ( addData && addData != '' ) {

                                    console.log ("addData 111111=======1111====>>>>>>>",addData);

                                    let objRemove = {

                                        sId: stopOne.data.sid,
                                        path: 'streams',

                                    },
                                    removeStatus = await helper.removeAgoraRecodedVideo( objRemove );

                                    console.log("removeStatus======--->>>>",removeStatus);

                                    if ( removeStatus ) {

                                        deferred.resolve( true );

                                    } else {

                                        console.log("elseeee1111111111111");
                                        deferred.resolve( false );

                                    }
                                } else {

                                    console.log("elseeeeeeeeeee222222222");
                                    deferred.resolve( false );

                                }

                            } else {

                                console.log("elseeeeeeeeee3333333333333");
                                deferred.resolve( false );

                            }
    
                        } else {
    
                            console.log("elseeeeee55555555555");
                            deferred.resolve( false );
    
                        }
                    } else {
    
                        console.log("elseeeee666666666666");
                        deferred.resolve( false );
    
                    }
                } else {
    
                    console.log("elseeee777777777777");
                    deferred.resolve( false );
    
                }
            } else {
    
                console.log("elseeeee8888888888");
                deferred.resolve( false );
    
            }

        } catch ( err ) {

            console.log("errrrrrr=======>>>>>", err );
            deferred.resolve( false );
            
        }
        
    } else {

        deferred.resolve( false );
    }
    return deferred.promise;
}


/**
 * Used to update recorded file name to database.
 * @param       :
 * @returns     :  
 * @developer   : 
 */
 liveBroadcastModel.updateBroadcastFileName = async ( body ) => {

    let deferred            = q.defer();
    
    // console.log( 'BODYBODYBODYBODYBODYBODYBODYBODYBODYBODYBODYBODYBODYBODY====================> ', body );

    if ( body && body.broadcastUuid ) {
        
        // console.log('innn iiiiiiiffffffffffffffffffffffffff ======================>>>>>>>>');

        let videoUuId       = body.sid + '_' + body.broadcastUuid,
            // broadcastStatus = body.status,
            videoExt        = '.m3u8',
            videoExtMp4     = '.mp4',
            thumbExt        = '.png',

            videoM3u8Name   = videoUuId + videoExt,
            // vidMp4Name      = videoUuId + videoExtMp4,
            vidMp4Name      = videoUuId,
            thumbName       = videoUuId + '_0' + thumbExt,

            sql             = 'UPDATE live_broadcast SET lb_attachment = ?, lb_video_thumbnail = ?  WHERE lb_uuid = ?';
            
            // console.log( "sqlQuery====>>>>>>>", sql );

        let updateRes   = await common.commonSqlQuery( sql, [ videoM3u8Name, thumbName, body.broadcastUuid ], true );

         // console.log("updateData=======>>>>updatevideotodb>>>>>", updateRes );

        if ( updateRes ) {

            let obj = {

                videoFullName   : videoM3u8Name,
                videoName       : videoUuId,
                agoraVidMp4Name : vidMp4Name,
        
            };
            deferred.resolve(obj);

        } else {

            // console.log("updateData=======>>>>else>>>>>" );
            deferred.resolve( false );

        }

    } else {

        // console.log('innn elseseseseseeeeeeeeeeeeeeeeeeee ======================>>>>>>>>');
        deferred.resolve( false );

    } 

    return deferred.promise;
}

/**
 * This function is using to stop Broadcast 
 * @param     :   
 * @returns   : 
 * @developer : 
 */
 liveBroadcastModel.stopBroadcast =  async function( body ) {

    let deferred   =  q.defer();

    if ( body && body.contestUuid && body.broadcastUuid ) {
        
        let sql     = "UPDATE live_broadcast SET ? WHERE lb_fk_ct_uuid= ? AND lb_uuid = ?",
            obj     = {
                lb_status : 'ENDLIVE'
            },
            res     = await common.commonSqlQuery(sql,[obj,body.contestUuid,body.broadcastUuid],true);
        //    console.log('res res res ',res)
        if ( res ) {

            deferred.resolve(true);

        } else {

            deferred.resolve(false);

        }

    } else {
        deferred.resolve(false);
    }

    return deferred.promise; 
}



/**
 * This function is using to check Live Or Not 
 * @param     :   
 * @returns   : 
 * @developer : 
 */
 liveBroadcastModel.checkLiveOrNot =  async ( body, userId ) => {

    let deferred   =  q.defer();

    if ( userId && body && body.contestUuid ) {

        let sql          = 'SELECT ct_id, ct_views_require, ct_contestType,ct_points, ct_views,ct_viewer_count FROM contests WHERE ct_uuid = ?',
            contestData  = await common.commonSqlQuery(sql,[body.contestUuid],true),
            isLiveOrNot  = await common.getRowId(body.contestUuid,'lb_fk_ct_uuid','lb_status','live_broadcast'),
            obj          = {};
        console.log('We are hear ===================>>>>>>>contestData',contestData);
        if( contestData && contestData.length > 0 ){

            let userPoints    = await common.getRowId(userId,'u_id','u_ads_points','user');

            if( contestData[0].ct_views_require == 'YES' || contestData[0].ct_contestType == 'POINTS' ) {

                console.log('We are hear ===================>>>>>>>111111111');
                let  isFullOrNot = 'NOTFULL';

                if( contestData[0].ct_views_require == 'YES' ){
                    if( contestData[0].ct_views != contestData[0].ct_viewer_count ){

                        isFullOrNot = 'NOTFULL';

                    } else {

                        isFullOrNot = 'FULL';

                    }
                    // isFullOrNot = await common.checkContestFullOrNot(body.contestUuid,contestData[0].ct_id,userId);

                }
                console.log('We are hear ===================>>>>>>>isFullOrNot',isFullOrNot,'contestData[0].ct_views != contestData[0].ct_viewer_count',contestData[0].ct_views != contestData[0].ct_viewer_count);
                if( isFullOrNot == 'NOTFULL' ){

                    console.log('We are hear ===================>>>>>>>1212121212111121112121');
                    if( contestData[0].ct_contestType == 'POINTS' && contestData[0].ct_views_require == 'YES'   ){

                        console.log('We are hear ===================>>>>>>>222222222222');
                        if( userPoints >= contestData[0].ct_points ){

                            // if( contestData[0].ct_views != contestData[0].ct_viewer_count ){

                                console.log('We are hear ===================>>>>>>>333333333333');
                                let insertViewerData = await liveBroadcastModel.insertViewerData(userId, contestData[0].ct_id);

                                if( insertViewerData ){
                                    console.log('We are hear ===================>>>>>>>444444444444');
                                    obj = {
                                        status  : true,
                                        message : 'Contest Join successfully',
                                        data    : {userJoinedContest : 'YES'}
                                    };
                                    deferred.resolve(obj)
            
                                } else {
            
                                    if ( isLiveOrNot && isLiveOrNot == 'LIVE' ) {
                                        obj = {
                                            status  : true,
                                            message : 'Some One is Live'
                                        };
                                       deferred.resolve(obj)
                            
                                    } else {
                            
                                        obj = {
                                            status  : false,
                                            message : 'No  Live'
                                        };
                                        deferred.resolve(obj)

                                    };
            
                                }
                            // } else {

                            //     obj = {
                            //         status  : false,
                            //         message : 'contest IS Full'
                            //     };
                            //     deferred.resolve(obj);

                            // }

                        } else {
                            console.log('We are hear ===================>>>>>>>55555555555555');
                            obj = {

                                status  : false,
                                message : 'Get Points from Watching Ads'
                            };

                            deferred.resolve(obj)
                            
                        }

                    } else if ( contestData[0].ct_views_require == 'YES' ){
                        console.log('We are hear ===================>>>>>>>6666666666666666');
                        // if( contestData[0].ct_views != contestData[0].ct_viewer_count ){

                            let insertViewerData = await liveBroadcastModel.insertViewerData(userId, contestData[0].ct_id);

                            if( insertViewerData ){

                                obj = {
                                    status  : true,
                                    message : 'Contest Join successfully',
                                    data    : {userJoinedContest : 'YES'}
                                };
                                deferred.resolve(obj)
        
                            } else {
        
                                if ( isLiveOrNot && isLiveOrNot == 'LIVE' ) {
                                    obj = {
                                        status  : true,
                                        message : 'Some One is Live'
                                    };
                                deferred.resolve(obj)
                        
                                } else {
                        
                                    obj = {
                                        status  : false,
                                        message : 'No  Live'
                                    };
                                    deferred.resolve(obj)

                                };
        
                            }

                        // } else {

                        //     obj = {
                        //         status  : false,
                        //         message : 'contest IS Full'
                        //     };
                        //     deferred.resolve(obj);

                        // }


                    } else if( contestData[0].ct_contestType == 'POINTS' ){

                        console.log('We are hear ===================>>>>>>>77777777777777777');
                        if( userPoints >= contestData[0].ct_points ){

                            let insertViewerData = await liveBroadcastModel.insertViewerData(userId, contestData[0].ct_id);

                            if( insertViewerData ){

                                obj = {
                                    status  : true,
                                    message : 'Contest Join successfully',
                                    data    : {userJoinedContest : 'YES'}
                                };
                               deferred.resolve(obj)
        
                            } else {
        
                                if ( isLiveOrNot && isLiveOrNot == 'LIVE' ) {
                                    obj = {
                                        status  : true,
                                        message : 'Some One is Live'
                                    };
                                   deferred.resolve(obj)
                        
                                } else {
                        
                                    obj = {
                                        status  : false,
                                        message : 'No  Live'
                                    };
                                    deferred.resolve(obj)

                                };
        
                            }

                        } else {
                            obj = {

                                status  : false,
                                message : 'Get Points from Watching Ads'
                            };

                            deferred.resolve(obj)
                            
                        }


                    } else {
                        console.log('We are hear ===================>>>>>>>in else');
                    }

                } else {
                    console.log('We are hear ===================>>>>>>>888888888888888');
                    obj = {
                        status  : false,
                        message : 'contest IS Full'
                    };
                    deferred.resolve(obj);

                }

            } else {
                console.log('We are hear ===================>>>>>>>ddddddddddddddddddd');
                let insertViewerData = await liveBroadcastModel.insertViewerData(userId, contestData[0].ct_id);

                if ( isLiveOrNot && isLiveOrNot == 'LIVE' ) {
            
                    obj = {
                        status  : true,
                        message : 'Some One is Live'
                    };
                    deferred.resolve(obj)
        
                } else {

                    obj = {
                        status  : false,
                        message : 'No  Live'
                    };
                    deferred.resolve(obj);
                };



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
 * This function is using to insert Viewer Data
 * @param     :   
 * @returns   : 
 * @developer : 
 */
 liveBroadcastModel.insertViewerData =  async ( userId, contestId )=> {

    let deferred   =  q.defer();

    if ( userId && contestId ) {
        
        let insertData = {
            ctv_fk_u_id  :  userId,
            ctv_fk_ct_id :	contestId
        },
        isExistSql =  'SELECT ctv_id FROM content_viewers WHERE ctv_fk_ct_id = ? AND ctv_fk_u_id =? ',
        isExist    =  await common.commonSqlQuery(isExistSql, [contestId,userId]);
        console.log('We are hear ===================>>>>>>>isExist',isExist);
        if( isExist && isExist.length > 0 && isExist != '' ){
            console.log('We are hear ===================>>>>>>>ishklasdjasldjadjadjaljdk');
            deferred.resolve(false);

        } else {

            let  insert    = await common.insert('content_viewers',insertData,true);
        
            if( insert && insert != '' ){
            
                let viewsCountSql = 'SELECT ctv_id FROM content_viewers WHERE ctv_fk_ct_id = ? '
                countData      = await helper.getDataOrCount(viewsCountSql,[contestId], 'L',true);
                console.log('We are hear ===================>>>>>>>countData',countData);
                if( countData && countData != '0' ){
            
                    let updateSql  = 'UPDATE contests SET ct_viewer_count = ? WHERE ct_id = ?'
                        updateData = await common.commonSqlQuery(updateSql,[countData,contestId], true);
                    console.log('We are hear ===================>>>>>>>updateData',updateData);
                    if( updateData  ){
                        deferred.resolve(true);
                    }
            
                }
            }
        }
       

    } else {
        deferred.resolve(false);
    }

    return deferred.promise; 
}

module.exports = liveBroadcastModel;