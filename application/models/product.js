
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

const { token } = require('apn');
const { async } = require('q');


    const q 			= require('q'),
    path				= require('path'),
    {v1: uuidv1}        = require('uuid'),
    helper				= require('../../common/helpers'),
    config				= require('../../common/config').init(),
    common              = require('../models/common'),
    constant            = require('../../common/config/constants'),
    _productModel       = require('../models/product_model');
    
    
    let product = {};
    
    
    // /**
    // * This function is get user post data
    // * @param     	: adsType, contestId
    // * @developer 	: 
    // * @modified	    : 
    // */
    // product.getFloristProducts = async (req, res) => {
    // console.log('prodddddoct')
    //     // let userId = await helper.getUUIDByTocken(req);
    
    //     // if ( userId && userId != '' ) {
    
    //         if ( req && req.body && req.body.emailId ) {
    //             let floristId = await common.getRowId(req.body.emailId, "email", "id" , "florists");

    //             console.log("flosrist iddidididi----",floristId)

    //             let userPostData = await _productModel.getFloristProductData(req.body,floristId);
    
    //             if ( userPostData && userPostData != false ) {
    
    //                 helper.successHandler(res, {
    //                     status : true,
    //                     // message : ' ',
    //                     payload : userPostData
    //                 }, 200);
    
    //             } else {
    
    //                 helper.successHandler(res, {
    //                     status  : false,
    //                     message : 'Something went wrong.'
    //                 }, 200);
    //             };
    //         } else {
    
    //             helper.errorHandler(res, {
    
    //                 status 	: false,
    //                 code 	: 'AAA-E1002',
    //                 message : 'Please fill mandatory fields.'
    //             }, 200);
    //         };
    //     // } else {
            
    //     //     helper.errorHandler(res, {
    //     //         status 		: false,
    //     //         code        : "AAA-E1001",
    //     //         message		: "Unauthorized Error."
    //     //     }, 200);
    //     // };
    // }


    /**
    * This function is get user getUserProducts data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
    product.getUserProducts = async (req, res) => {
    // console.log('prodddddgetUserProductsdoct')
        let userId = await helper.getUUIDByTocken(req);
        // console.log('prodddddgetUseuserIduserIdrProductsdoct====',userId)

        if ( userId && userId != '' ) {
    
            if ( req && req.body ) {

                let userPostData = await _productModel.getUserProductData(req.body, userId);
    
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
        } else {
            
            helper.errorHandler(res, {
                status 		: false,
                code        : "AAA-E1001",
                message		: "Unauthorized Error."
            }, 200);
        };
    }
    /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
    product.getFloristProducts = async (req, res) => {
    console.log('prodddddoct')
        // let userId = await helper.getUUIDByTocken(req);
    
        // if ( userId && userId != '' ) {
    
            if ( req && req.body && req.body.emailId ) {
                let floristId = await common.getRowId(req.body.emailId, "email", "id" , "florists");

                console.log("flosrist iddidididi----",floristId)

                let userPostData = await _productModel.getFloristProductData(req.body,floristId);
    
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
    }

     /**
    * This function is add to cart any product
    * @param     	: 
    * @developer 	: 
    * @modified	    : 
    */
    product.addProductToCart = async (req, res) => {
    console.log('prodddddoct')
            let userId = await helper.getUUIDByTocken(req);
        
            // if ( userId && userId != '' ) {
        
                if ( req && req.body && req.body.emailId && req.body.productId && req.body.size && req.body.quantity ) {
                    let productData = await common.getRowIdAll(req.body.productId, "id", "products");
                 
                    // console.log("product iddidididi----",productData)
                    if(productData && productData != null && productData != ''){
                        let userPostData = await _productModel.addToCart(userId, req.body, productData);
        
                        if ( userPostData && userPostData == true ) {
            
                            helper.successHandler(res, {
                                status : true,
                                message : 'Product added to cart successfully.',
                                // payload : userPostData
                            }, 200);
            
                        } else {
            
                            helper.successHandler(res, {
                                status  : false,
                                message : 'Something went wrong.'
                            }, 200);
                        };
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
        }
        
     /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
    product.getProductsInCartList = async (req, res) => {
            let userId = await helper.getUUIDByTocken(req);
        
            // if ( userId && userId != '' ) {
        
                if ( req && req.body && req.body.emailId ) {
    
                    let userPostData = await _productModel.getProductsInCartList(req.body, userId);
        
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
        }
    
     /**
    * This function is add to cart any product
    * @param     	: 
    * @developer 	: 
    * @modified	    : 
    */
     product.checkout = async (req, res) => {
        console.log('prodddddoct')
        let userId = await helper.getUUIDByTocken(req);
    
        // if ( userId && userId != '' ) {
                
            if ( req && req.body && req.body.u_id && req.body.r_name && req.body.u_name && req.body.r_address && req.body.florist_id  &&  req.body.u_email ) {
                // let productData = await common.getRowIdAll(req.body.productId, "id", "products");
                
                // console.log("product iddidididi----",productData)
                // if(productData && productData != null && productData != ''){
                    let userPostData = await _productModel.checkout( req.body );
    
                    if ( userPostData && userPostData == true ) {
        
                        helper.successHandler(res, {
                            status : true,
                            message : 'Order created successfully.',
                            // payload : userPostData
                        }, 200);
        
                    } else {
        
                        helper.successHandler(res, {
                            status  : false,
                            message : 'Something went wrong.'
                        }, 200);
                    };
                // } else {
        
                //     helper.successHandler(res, {
                //         status  : false,
                //         message : 'Something went wrong.'
                //     }, 200);
                // };

                
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
    }

    product.doPay =async(body)=>{
                            const https = require('https')

                                    const querystring = require('querystring');

        const form = querystring.stringify({
            token: body.token,// 'ctn_QVWLkIC0S8N6akj254xrl0fr',
            amount: body.amount,
            description: body.description
        });
        
        const auth = 'Basic ' +  Buffer("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
        
        const options = {
        hostname: 'sandbox-api.everypay.gr',
        path: '/payments',
        method: 'POST',
        //   body:form,
        headers: {
            "Authorization": auth,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        }
        console.log('sfjadfksdfdskfsd--------------1111f')


        // https.request({ headers: {
        //     "Authorization": auth,
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   }, method:"post", url: "sandbox-api.everypay.gr/payments", body:form}, callback);



        const req = https.request(options,  res => {
            console.log(`statusCoderessse: ${res['Object']}`)

            console.log(`statusCoderessse: ${res}`)

            // console.log('sfjadfksdfdskfsd----------222222----1111f', res)
        console.log(`statusCode: ${res.statusCode}`)
        
        res.on('data', d => {
            console.log('response', d);
            process.stdout.write(d);

        })
        })
        console.log('rejwkrwerwe-r----sdfsd---re----',req.body)

        req.on('error', error => {
        console.error(error)
        })
        
        req.write(form)

        console.log('rejwkrwerwe-r-------re----',req.body)

        req.end()
        // outputData
        console.log('rejwkrwerwe-r-----ddsf--re----',req.body)
        console.log('rejwkrwerwe-r-----ddsf--re----',req.outputData)

    }

    product.payment = async (req, res) => {
        console.log('prodddddoct')
        let userId = await helper.getUUIDByTocken(req);
    
        
        // if ( userId && userId != '' ) {
                
            if ( req && req.body && req.body.token  && req.body.token && req.body.sellerId  && req.body.amount  && req.body.description ) {
                // let productData = await common.getRowIdAll(req.body.productId, "id", "products");
                
                // console.log("product iddidididi----",productData)
                // if(productData && productData != null && productData != ''){
                    // let userPostData = await _productModel.checkout( req.body );
    
                    // const https = require('https')
                    // const querystring = require('querystring');
         dataPay =    product.doPay(req.body);
           console.log('daadskjflsd------',dataPay)     
                    if ( userPostData && userPostData == true ) {
        
                        helper.successHandler(res, {
                            status : true,
                            message : 'Order created successfully.',
                            // payload : userPostData
                        }, 200);
        
                    } else {
        
                        helper.successHandler(res, {
                            status  : false,
                            message : 'Something went wrong.'
                        }, 200);
                    };
                // } else {
        
                //     helper.successHandler(res, {
                //         status  : false,
                //         message : 'Something went wrong.'
                //     }, 200);
                // };

                
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
    }




    product.splitPayment = async (req, res) => {
        console.log('prodddddoct')
        let userId = await helper.getUUIDByTocken(req);
    
        
        // if ( userId && userId != '' ) {
                
            if ( req && req.body && req.body.token  && req.body.token && req.body.sellerId  && req.body.amount  && req.body.description ) {
                // let productData = await common.getRowIdAll(req.body.productId, "id", "products");
                
                // console.log("product iddidididi----",productData)
                // if(productData && productData != null && productData != ''){
                    // let userPostData = await _productModel.checkout( req.body );
    
                    // const https = require('https')
                    // const querystring = require('querystring');
         dataPay =    product.doPay(req.body);
           console.log('daadskjflsd------',dataPay)     
                    if ( userPostData && userPostData == true ) {
        
                        helper.successHandler(res, {
                            status : true,
                            message : 'Order created successfully.',
                            // payload : userPostData
                        }, 200);
        
                    } else {
        
                        helper.successHandler(res, {
                            status  : false,
                            message : 'Something went wrong.'
                        }, 200);
                    };
                // } else {
        
                //     helper.successHandler(res, {
                //         status  : false,
                //         message : 'Something went wrong.'
                //     }, 200);
                // };

                
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
    }


    product.loadViewCreateToken = async () => {
        console.log('proddloaddddddddddoct')
        const { createToken } = require('@lytrax/everypay/Tokens');
   
    // This should be called at the client
    createToken({
        // endPointURL: 'https://api.everypay.gr',
        endPointURL: 'https://sandbox-api.everypay.gr',
        
    // Will use EVERYPAY_PUBLIC_KEY environment variable when omitted
    endPointKey: 'sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc',
    card_number: '5217925525906273',
    expiration_year: '2023',
    expiration_month: '05',
    cvv: '343',
    holder_name: 'John Doe'
    })
    .then((token) => {
        console.log('tokenenennene-------',token)
        console.log('tokenenennene--222-----',token.token)

        // ...
    })
    .catch((error) => {
        if ('endPointError' in error) {
            console.log('tokenenennene-----errr--',error)

        // Handle EveryPay API error
        } else {
            console.log('tokenenennene--elelle-----',)

        // Handle other code error
        }
    });
    //   console.log('tokenenennene--222-----',token)

    //   return token;

    }    



    product.loadView = async () => {
        console.log('proddloaddddddddddoct')
        const { createToken } = require('@lytrax/everypay/Tokens');
   
    // This should be called at the client
    createToken({
        // endPointURL: 'https://api.everypay.gr',
        endPointURL: 'https://sandbox-api.everypay.gr',
        
    // Will use EVERYPAY_PUBLIC_KEY environment variable when omitted
    endPointKey: 'sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc',
    card_number: '5217925525906273',
    expiration_year: '2023',
    expiration_month: '05',
    cvv: '343',
    holder_name: 'John Doe'
    })
    .then((token) => {
        console.log('tokenenennene-------',token)
        console.log('tokenenennene--222-----',token.token)


        const https = require('https')
        const querystring = require('querystring');
        
        const form = querystring.stringify({
            token:token.token,// 'ctn_QVWLkIC0S8N6akj254xrl0fr',
            amount: 10000,
            description: 'Order No.123'
        });
        
        const auth = 'Basic ' +  Buffer("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
        
        const options = {
        hostname: 'sandbox-api.everypay.gr',
        path: '/payments',
        method: 'POST',
        //   body:form,
        headers: {
            "Authorization": auth,
            'Content-Type': 'application/x-www-form-urlencoded',
        }
        }
        console.log('sfjadfksdfdskfsd--------------1111f')


        // https.request({ headers: {
        //     "Authorization": auth,
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   }, method:"post", url: "sandbox-api.everypay.gr/payments", body:form}, callback);



        const req = https.request(options,  res => {
            console.log(`statusCoderessse: ${res['Object']}`)

            console.log(`statusCoderessse: ${res}`)

            // console.log('sfjadfksdfdskfsd----------222222----1111f', res)
        console.log(`statusCode: ${res.statusCode}`)
        
        res.on('data', d => {
            console.log('response', d);
            process.stdout.write(d);

        })
        })
        console.log('rejwkrwerwe-r----sdfsd---re----',req.body)

        req.on('error', error => {
        console.error(error)
        })
        
        req.write(form)

        console.log('rejwkrwerwe-r-------re----',req.body)

        req.end()
        // outputData
        console.log('rejwkrwerwe-r-----ddsf--re----',req.body)
        console.log('rejwkrwerwe-r-----ddsf--re----',req.outputData)

    
        // return token.token;
        // Success: Store or use the token
        return token;
        // ...
    })
    .catch((error) => {
        if ('endPointError' in error) {
            console.log('tokenenennene-----errr--',error)

        // Handle EveryPay API error
        } else {
            console.log('tokenenennene--elelle-----',)

        // Handle other code error
        }
    });
    //   console.log('tokenenennene--222-----',token)

    //   return token;

    }    



        /**
    * This function is add to cart any product
    * @param     	: 
    * @developer 	: 
    * @modified	    : 
    */


        product.loadViewo = async () => {
            console.log('proddloaddddddddddoct')
    
            const { createToken } = require('@lytrax/everypay/Tokens');
    // Or ES6 import
    // import { createToken } from '@lytrax/everypay/Tokens';
    
    // This should be called at the client
    
    createToken({
        // endPointURL: 'https://api.everypay.gr',
        endPointURL: 'https://sandbox-api.everypay.gr',
        
  // Will use EVERYPAY_PUBLIC_KEY environment variable when omitted
  endPointKey: 'sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc',
      card_number: '5217925525906273',
      expiration_year: '2023',
      expiration_month: '05',
      cvv: '343',
      holder_name: 'John Doe'
    })
      .then((token) => {
        console.log('tokenenennene-------',token)
        console.log('tokenenennene--222-----',token.token)


        const https = require('https')
        const querystring = require('querystring');
        
        const form = querystring.stringify({
            // token: 'ctn_KJ53Qx3ZGaNLttUNxyB5JQO3',
            token:token.token,// 'ctn_QVWLkIC0S8N6akj254xrl0fr',
            // token: 'ctn_Yj0NIWKRpfiwsOgXG27kxnvO',
// token: 'ctn_KJ53Qx3ZGaNLttUNxyB5JQO3',
        //   token: 'ctn_jx3Efckpim7gGAZqkFpxMG1',//'ctn_Yj0NIWKRpfiwsOgXG27kxnvO',
          amount: 10000,
          description: 'Order No.123'
        });
        
        const auth = 'Basic ' +  Buffer("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
        
        const options = {
          hostname: 'sandbox-api.everypay.gr',
          path: '/payments',
          method: 'POST',
        //   body:form,
          headers: {
            "Authorization": auth,
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
        console.log('sfjadfksdfdskfsd--------------1111f')


        // https.request({ headers: {
        //     "Authorization": auth,
        //     'Content-Type': 'application/x-www-form-urlencoded',
        //   }, method:"post", url: "sandbox-api.everypay.gr/payments", body:form}, callback);



        const req = https.request(options,  res => {
            console.log(`statusCoderessse: ${res['Object']}`)

            console.log(`statusCoderessse: ${res}`)

            // console.log('sfjadfksdfdskfsd----------222222----1111f', res)
          console.log(`statusCode: ${res.statusCode}`)
        
          res.on('data', d => {
            console.log('response', d);
            process.stdout.write(d);

          })
        })
        console.log('rejwkrwerwe-r----sdfsd---re----',req.body)

        req.on('error', error => {
          console.error(error)
        })
        
        req.write(form)

        console.log('rejwkrwerwe-r-------re----',req.body)

        req.end()
        // outputData
        console.log('rejwkrwerwe-r-----ddsf--re----',req.body)
        console.log('rejwkrwerwe-r-----ddsf--re----',req.outputData)

      
        // return token.token;
        // Success: Store or use the token
        return token;
        // ...
      })
      .catch((error) => {
        if ('endPointError' in error) {
            console.log('tokenenennene-----errr--',error)

          // Handle EveryPay API error
        } else {
            console.log('tokenenennene--elelle-----',)

          // Handle other code error
        }
      });
    //   console.log('tokenenennene--222-----',token)

    //   return token;

    }    


     product.loadViewold = async () => {
        console.log('proddloaddddddddddoct')
     token =  await product.loadView(); 
     console.log('tokeennene----000-------',token)
        
                // let userId = await helper.getUUIDByTocken(req);
                const https = require('https')
                const querystring = require('querystring');
                
                const form = querystring.stringify({
                    // token: 'ctn_KJ53Qx3ZGaNLttUNxyB5JQO3',
                    token:token,// 'ctn_QVWLkIC0S8N6akj254xrl0fr',
                    // token: 'ctn_Yj0NIWKRpfiwsOgXG27kxnvO',
// token: 'ctn_KJ53Qx3ZGaNLttUNxyB5JQO3',
                //   token: 'ctn_jx3Efckpim7gGAZqkFpxMG1',//'ctn_Yj0NIWKRpfiwsOgXG27kxnvO',
                  amount: 10000,
                  description: 'Order No.123'
                });
                
                const auth = 'Basic ' +  Buffer("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
                
                const options = {
                  hostname: 'sandbox-api.everypay.gr',
                  path: '/payments',
                  method: 'POST',
                //   body:form,
                  headers: {
                    "Authorization": auth,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  }
                }
                console.log('sfjadfksdfdskfsd--------------1111f')


                // https.request({ headers: {
                //     "Authorization": auth,
                //     'Content-Type': 'application/x-www-form-urlencoded',
                //   }, method:"post", url: "sandbox-api.everypay.gr/payments", body:form}, callback);



                const req = https.request(options,  res => {
                    console.log(`statusCoderessse: ${res['Object']}`)

                    console.log(`statusCoderessse: ${res}`)

                    // console.log('sfjadfksdfdskfsd----------222222----1111f', res)
                  console.log(`statusCode: ${res.statusCode}`)
                
                  res.on('data', d => {
                    console.log('response', d);
                    process.stdout.write(d);

                  })
                })
                console.log('rejwkrwerwe-r----sdfsd---re----',req.body)

                req.on('error', error => {
                  console.error(error)
                })
                
                req.write(form)

                console.log('rejwkrwerwe-r-------re----',req.body)

                req.end()
                // outputData
                console.log('rejwkrwerwe-r-----ddsf--re----',req.body)
                console.log('rejwkrwerwe-r-----ddsf--re----',req.outputData)

              
            //     const pk = 'sk_b8e82LpmyE5XRbzf9iLqIySUPqXe8PWM';

            // const https = require('https')
            // const querystring = require('querystring');
            
            // const form = querystring.stringify({
            //   token: 'ctn_Yj0NIWKRpfiwsOgXG27kxnvO',
            //   amount: '10000',
            //   description: 'Order No.123'
            // });
            
            // // const auth = 'Basic ' + new Buffer("{your-private-key}:").toString('base64');
            // const auth = 'Basic ' + new Buffer("{sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc}:").toString('base64');

            // const options = {
            // //   hostname: 'api.everypay.gr',
            // hostname: 'sandbox-api.everypay.gr',

            //   path: '/payments',
            //   method: 'POST',
            //   headers: {
            //     "Proxy-Authorization": auth,
            //     'Content-Type': 'application/x-www-form-urlencoded',
            //   }
            // }
            // console.log('sfjadfksdfdskfsd--------------1111f')

            // const req = https.request(options, res => {
            //     console.log('sfjadfksdfdskfsd-------------22222-1111f')
            //     console.log('sfjadfksdfdskfsd---33333333-----------1111f--------',res)

            //   console.log(`statusCode: ${res.statusCode}`)
            
            //   res.on('data', d => {
            //     console.log('response', d);
            //   })
            // })
            
            // req.on('error', error => {
            //   console.error(error)
            // })
            
            // req.write(form)
            // req.end()
    

            
                // if ( userId && userId != '' ) {
                    	
            //         if ( req && req.body && req.body.user_id && req.body.name && req.body.address && req.body.florist_id && req.body.sender && req.body.senderName && req.body.senderEmail ) {
                      
            //                 let userPostData = await _productModel.checkout( req.body );
            
            //                 if ( userPostData && userPostData == true ) {
                
            //                     helper.successHandler(res, {
            //                         status : true,
            //                         message : 'Order created successfully.',
            //                         // payload : userPostData
            //                     }, 200);
                
            //                 } else {
                
            //                     helper.successHandler(res, {
            //                         status  : false,
            //                         message : 'Something went wrong.'
            //                     }, 200);
            //                 };
                   
        
                        
            //         } else {
            // console.log('sfjadfksdfdskfsdf')
            //             // helper.errorHandler(res, {
            
            //             //     status 	: false,
            //             //     code 	: 'AAA-E1002',
            //             //     message : 'Please fill mandatory fields.'
            //             // }, 200);
            //         };
                // } else {
                    
                //     helper.errorHandler(res, {
                //         status 		: false,
                //         code        : "AAA-E1001",
                //         message		: "Unauthorized Error."
                //     }, 200);
                // };
            }
            
            

   /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
//    product.loadViewddd = async (req, res) => {
//     let userId = await helper.getUUIDByTocken(req);

//     // if ( userId && userId != '' ) {

//         // if ( req && req.body && req.body.emailId ) {


//         // const https = require('https')
//         const querystring = require('querystring');
        
//         const form = querystring.stringify({
//           token: 'ctn_Yj0NIWKRpfiwsOgXG27kxnvO',
//           amount: '10000',
//           description: 'Order No.123'
//         });
        
//         const auth = 'Basic ' + new Buffer("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
        
//         const options = {
//           hostname: 'sandbox-api.everypay.gr',
//           path: '/payments',
//           method: 'POST',
//           headers: {
//             "Authorization": auth,
//             'Content-Type': 'application/x-www-form-urlencoded',
//           }
//         }
//         console.log('sfjadfksdfdskfsd--------------1111f')

//         const req = https.request(options, res => {
//             console.log('sfjadfksdfdskfsd----------222222----1111f', res)
//           console.log(`statusCode: ${res.statusCode}`)
        
//           res.on('data', d => {
//             console.log('response', d);
//           })
//         })
        
//         req.on('error', error => {
//           console.error(error)
//         })
        
//         req.write(form)

//         req.end()

//         app.get('/api', function(req, res) {
//             request({
//                 url: url,
//                 method: "POST",
//                 json: data
//             }, function(err, apiRes, apiBody) {
//                 res.send(apiBody);
//             });
//             });

//             let userPostData = await _productModel.getProductsInCartList(req.body, userId);

//             if ( userPostData && userPostData != false ) {

//                 helper.successHandler(res, {
//                     status : true,
//                     // message : ' ',
//                     payload : userPostData
//                 }, 200);

//             } else {

//                 helper.successHandler(res, {
//                     status  : false,
//                     message : 'Something went wrong.'
//                 }, 200);
//             };
//         // } else {

//             // helper.errorHandler(res, {

//             //     status 	: false,
//             //     code 	: 'AAA-E1002',
//             //     message : 'Please fill mandatory fields.'
//             // }, 200);
//         };
        
//     // } else {
        
//     //     helper.errorHandler(res, {
//     //         status 		: false,
//     //         code        : "AAA-E1001",
//     //         message		: "Unauthorized Error."
//     //     }, 200);
//     // };
// // }



product.payment = async (req, res) => {
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", '*'); //<-- you can change this with a specific url like http://localhost:4200
        res.header("Access-Control-Allow-Credentials", true);
        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,POST,DELETE,OPTIONS');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization");
        // res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
        return next();
    });
    console.log('prodddddoct')
   // let userId = await helper.getUUIDByTocken(req);
    // if ( userId && userId != '' ) {
        if ( req && req.body && req.body.token  && req.body.token && req.body.sellerId  && req.body.amount  && req.body.description ) {

 try  {
    //  auth = 'Basic ' +  Buffer.from("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
       const auth = 'Basic ' +  Buffer("sk_3twVit0RWMSevu7fDQIiyZnjA4YaabLc:").toString('base64');
        const url = 'https://sandbox-api.everypay.gr/payments'

        const  resultPay      = await axios.post(
        "https://sandbox-api.everypay.gr/payments",
        {
            token: req.body.token,// 'ctn_QVWLkIC0S8N6akj254xrl0fr',
            amount: req.body.amount,
            description: req.body.description

            // token : "ctn_UuYxRdKDZLOGpZFQ5yJ9Uwi1",
            // amount:1,

            },
            { headers: 
                { Authorization:auth ,
                "Access-Control-Allow-Origin":"*",
                "Access-Control-Allow-Credentials": true,
                'Access-Control-Allow-Methods': 'GET,HEAD,PUT,POST,DELETE,OPTIONS', 
                "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type,Accept, x-client-key, x-client-token, x-client-secret, Authorization",
                'Content-Type': 'application/x-www-form-urlencoded',
                } 
            }
        ).then(function (response) {
            console.log('response-------',response.data);

            helper.successHandler(res, {

                status 	: true,
                payload: response.data,

            }, 200);
        });

        } catch (err) {
            // console.log( "er================.....>>>>>>>>>", err );
            console.log( "er================.....dddd>>>>>>>>>",typeof(err.response.data) );
            var errr = err.response.data;
            helper.errorHandler(res, {

                status 	: false,
                payload: errr,
            }, 200);
            return false;

        } 
            
        } else {

            helper.errorHandler(res, {

                status 	: false,
                code 	: 'AAA-E1002',
                message : 'Please fill mandatory fields.'
            }, 200);
        };
   
}

 /**
    * This function is get user post data
    * @param     	: adsType, contestId
    * @developer 	: 
    * @modified	    : 
    */
    product.updateTransactionId = async (req, res) => {
    console.log('prodddddoct')
        // let userId = await helper.getUUIDByTocken(req);
    
        // if ( userId && userId != '' ) {
    
            if ( req && req.body && req.body.transactionId && req.body.orderId ) {
                // let floristId = await common.getRowId(req.body.orderId, "email", "id" , "orders");
                // commonModel.getRowId = function (uuid, wherecolname, selectcolname, tablename) {

                // console.log("flosrist iddidididi----",floristId)

                let userPostData = await _productModel.updateTransactionId(req.body);
    
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
    }


    module.exports = product;