/** #################################
	Project		 : Ebloomapi
	Module		 : Node Server
    Created		 : 2021-11-14
	Developed By : Ashwani Kumar 
    Description	 : Routes file.
*/
const request 		  	= require('request'),
    url 			   	= require('url'),
    middle 	        	= require('../routes/middleware'),
    _AUTHOBJ            = require('../controllers/auth'),
	_USEROBJ 			= require('../controllers/user'),
	// _CONFIGOBJ 			= require('../controllers/configuration'),
    // _POSTOBJ            = require('../controllers/post'),
	// _USERPROFILEOBJ     = require('../controllers/upload_image'),
	// _FOLLOWOBJ          = require('../controllers/follow'),
	// _CHATSOBJ           = require('../controllers/chats'),
	// _CONTESTOBJ         = require('../controllers/contests'),
	// _BROADCASTOBJ       = require('../controllers/live_broadcast'),
	// _ADSOBJ             = require('../controllers/ads'),
	_CITYOBJ                = require('../controllers/city');    
	_FLORISTOBJ				= require('../controllers/florist');
	_FLORISTPDTOBJ			= require('../controllers/product');
	_SENDMAIL				= require('../controllers/sendMails');

	_STOREOBJ          = require('../controllers/store');                  ;
    // const validateRequest = SchemaValidator(true);
	const path = require('path');

const genericHandler = (req, res, next) => {
 res.json({
     status: 'success',
     data: req.body
 });
};

module.exports.init = async (app, jwt, socket, http) => {
 
	app.all('/*', middle.allowHeaders );
	app.all('/private/*', middle.authenticate);
	app.get('/testing', function(req , res){
		console.log("Got a GET request for the homepage");
        res.send('Hello GET get get get');
	});
	
	/*** Authentication APIs*/
	app.post('/signup', _AUTHOBJ.signup);
	app.post('/signup-with-phone', _AUTHOBJ.signupWithPhone);
	app.post('/login',  _AUTHOBJ.login);

	// app.post('/send-activation-email', _AUTHOBJ.sendActivationCode);
    // app.post('/send-email-token', _AUTHOBJ.sendEmailToken);
	app.post('/forgot-password', _AUTHOBJ.forgotPassword);
	// app.post('/activate-account',  _AUTHOBJ.activateAccount);
	app.post('/reset-password', _AUTHOBJ.resetPassword);
	// app.post('/resend-activation-code',  _AUTHOBJ.resendActivationCode);
	// app.post('/change-phone-number',  _AUTHOBJ.changePhoneNumber);
	// app.post('/validate-with-password' , _AUTHOBJ.validateWithPassword);
	// app.post('/verify-phone-number',  _AUTHOBJ.verifyPhoneNumber);
	// app.post('/private/update-user-email', _AUTHOBJ.updateUserEmail);
	// app.post('/private/add-user-email', _AUTHOBJ.updateEmail);
	// app.post('/private/user/add-business-data', _AUTHOBJ.addUserBusinessData);
	// app.post('/get-country-list', _CONFIGOBJ.getCountryList);
    
	/* user Data APIs*/

	app.get('/private/user',  _USEROBJ.getRow);
	app.get('/private/get-me',  _USEROBJ.getMe);
	app.get('/private/get-other-user',  _USEROBJ.getOtherUser);

	// app.post('/private/user/change-password', _USEROBJ.changePassword);
	// app.post('/private/user/update-profile-data', _USEROBJ.updateUserProfileData);
	// app.post('/private/user/upload-profile-image', _USERPROFILEOBJ.uploadProfileImage);
	// app.post('/private/user/remove-profile-image', _USERPROFILEOBJ.deleteProfileImage);
	// app.post('/private/user/all-user-data',  _USEROBJ.getUsersData);
	// app.post('/private/userProfile', _USEROBJ.otherUserProfile);
	// app.post('/private/user/update-profile-type',_USEROBJ.updateActiveProfile);
	// app.post('/private/user/update-user-location',_USEROBJ.updateUserLocation);
	// app.post('/private/user/update-user-bio',_USEROBJ.updateUserBio);
	// app.post('/private/user/update-user-business',_USEROBJ.updateUserBusiness);
	// app.post('/private/user/update-business-profile',_USERPROFILEOBJ.uploadBusinessImage);
	// app.post('/private/user/remove-business-profile', _USERPROFILEOBJ.deleteBusinessImage);
	// app.post('/private/user/enable-disable-follow',_USEROBJ.enableDisableFollow);
	// app.post('/private/user/upload-user-video',_USEROBJ.userImageVideo);
	// app.post('/private/user/update-address',_USEROBJ.updateAddress);
	// app.post('/private/user/update-account-type',_USEROBJ.updateAccountType);
	// app.post('/private/user/all-user-latitude-longitude',_USEROBJ.getAllUserLatitudeAndLongitude)



	/* City APIs */

	app.post('/get/city',_CITYOBJ.getCityData);
	// app.get('/checkout',_FLORISTOBJ.index);
	// app.get('/checkout', function(req , res){
	// 	return res.redirect('/checkout.html');

	// 	// res.send(index.html)
	// });

// app.set('view engine', 'html');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views')); 


	app.get('/checkout', function(request, response) {
        response.render('checkout');
});
	/* Florist APIs */
	app.post('/florist-list',_FLORISTOBJ.getFlorist);
	app.post('/all-florist-list',_FLORISTOBJ.getAllFlorist);
	app.post('/get-florist-slider-list',_FLORISTOBJ.getFloristSliderList);
	app.post('/sendEmailNew',_FLORISTOBJ.sentEmail);


	// app.post('/florist-list-s',_FLORISTOBJ.getFlorist);


	/* Product APIs */
	app.post('/florist/product-list',_FLORISTPDTOBJ.getFloristProducts);
	app.post('/florist/product-list/add-product-to-cart',_FLORISTPDTOBJ.addProductToCart);
	app.post('/florist/user/product-in-cart-list',_FLORISTPDTOBJ.getProductsInCartList);
	app.post('/florist/user-product-list',_FLORISTPDTOBJ.getUserProducts);
	app.post('/florist/checkout',_FLORISTPDTOBJ.checkout);
	app.post('/florist/load-view',_FLORISTPDTOBJ.loadView);
	app.post('/florist/load-view-oo',_FLORISTPDTOBJ.loadViewCreateToken);
	app.post('/florist/payment',_FLORISTPDTOBJ.payment);
	app.post('/florist/update-transaction-id',_FLORISTPDTOBJ.updateTransactionId);


	app.post('/sendMails',_SENDMAIL.sendMails);


	// loadView


	app.post('/store-list',_STOREOBJ.getstoreData);


	/* Business Card API's */
	// app.post('/private/user/send-business-card-request',_USEROBJ.businessCardRequest);
	// app.post('/private/user/business-card-data',_USEROBJ.getBusinessCardData);
	// app.post('/private/user/accept-cancel-card-request', _USEROBJ.businessCardAcceptCancel);

	/* follow UnFollow*/

	// app.post('/private/followUnFollow', _FOLLOWOBJ.followUnFollow);
	// app.post('/private/follow-list', _FOLLOWOBJ.getMyFollowersList);
	
	/* Chat APIs */

	// app.post('/private/select-user',_FOLLOWOBJ.friendsList);
	// app.post('/private/chat/one-to-one-chat',_CHATSOBJ.chatOneToOne);
	// app.post('/private/chat/my-chats-list',_CHATSOBJ.myChatList);
	// app.post('/private/chat/add-media-records',_CHATSOBJ.addMultipleMediaRecords);
	// app.post('/private/chat/delete-messages',_CHATSOBJ.deleteMessages);
	// app.post('/private/chat/text-Message',_CHATSOBJ.textMessage);

	/* user post APIs*/

	// app.post('/private/user/post', _POSTOBJ.userPost);
	// app.post('/private/user/post/data', _POSTOBJ.getPostData);
	// app.post('/private/user/post/videos-images', _POSTOBJ.postImageVideo);
	// app.post('/private/user/post/delete', _POSTOBJ.postDelete);
	// app.post('/private/user/post/comments',_POSTOBJ.userPostComment);
	// app.post('/private/user/post/get-comments',_POSTOBJ.getCommentData);
	// app.post('/private/user/post/like',_POSTOBJ.userPostLike);
	// app.post('/private/user/post/get-like',_POSTOBJ.getLikeData);
	// app.post('/private/user/post/delete-comment',_POSTOBJ.deletePostComment);
	// app.post('/private/user/post/share-post',_POSTOBJ.userPostShare);

	/* contest APIs*/
	
	// app.post('/private/user/contest',_CONTESTOBJ.addContests);
	// app.post('/private/user/contest/upload-image',_CONTESTOBJ.uploadContestImage);
	// app.post('/private/user/contest/data',_CONTESTOBJ.getContestsData);
	// app.post('/private/user/contest/delete',_CONTESTOBJ.contestsDelete);
	// app.post('/private/user/contest/detail',_CONTESTOBJ.getContestsDetail)

	/* live Broadcast APIs */
	// app.post('/private/contest/broadcast/start',_BROADCASTOBJ.liveBroadcast);
	// app.post('/private/contest/broadcast/stop',_BROADCASTOBJ.stopLiveBroadcast);
	// app.post('/private/contest/broadcast/check-live-orNot',_BROADCASTOBJ.checkLiveOrNot);
	// app.post('/private/contest/broadcast/end-live',_BROADCASTOBJ.stopBroadcast)

	/* Marketing Ads APIs */

	// app.post('/private/ads/data',_ADSOBJ.getAdsData);
	// app.post('/private/ads/add-points-to-user',_ADSOBJ.addAdsPointToUser);


	


	// app.get('/play-m3u8/:type/:id', _POSTOBJ.streamAWSCloudfrontVideo);
}  

