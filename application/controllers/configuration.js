/** #################################
	Project		 : Ebloomapi
	Module		 : Node Server
    Created		 : 2021-11-14
	Developed By : Ashwani Kumar 
    Description	 : Routes file.
*/

const _commonModel = require('../models/common'),
      helper	   = require('../../common/helpers');
		

let configuration = {};

/**
 * This function is using to get countries listing
 * @param     : 
 * @returns   : 
 * @developer : Ashwani Kumar
 */
configuration.getCountryList = async function(req, res) {

    // console.log('start working data', req.body);

    if(req && typeof req == 'object' ) {

                let result =  await _commonModel.getCountryList(req.body);
                // console.log('resultresultresult',result)
                // application/controllers/configuration.js
                if ( result ) {
    
                    helper.successHandler(res, { 
                        payload : result 
                    }, 200);
    
                } else {
                    
                    let obj = {
                        code 	: 'AAA -E1001',
                        message : 'Failed, Please try again.',
                        status  : false
                    };
                    helper.successHandler(res, obj);
    
                }
            
        } else {
    
            helper.errorHandler(res, {
                status  : false
            });
            
        };
}

/**
 * This function is using to add community id
 * @param     : 
 * @returns   : 
 * @developer : Ashwani Kumar
 */
configuration.getStateList = async function(req, res) {
    let returnMessage   = '',
        returnStatus    = false,
        returnCode		= '';
        
    if ( req && req.body && req.body.countryId ) {

        let result = await _commonModel.getAll( req.body.countryId, 'country_id', 'states' );

        if ( result && typeof(result) == 'object' ) {

            returnMessage = {
                payload : result
            };

        } else {

            returnMessage = { 
                message : 'No Record Found.'
            };

        }
        
    } else {

        returnCode = "AAA-E1000";

    }

    if ( typeof returnMessage == 'object' ) {

        helper.successHandler(res, returnMessage, 200);
        
    } else {

        helper.errorHandler(res, {
            status  : returnStatus,
            message : returnMessage,
            code	: returnCode
        }, 500);

    }

}

module.exports = configuration;
