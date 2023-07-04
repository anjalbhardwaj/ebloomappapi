var SCD_DEBUG=true;function scd_fetch_location(scdOptions){var countryRequest1=jQuery.get("//ipinfo.io/json",function(localdata){if(localdata.country===undefined){if(SCD_DEBUG)
console.log("Location detection failed in first request, second request init...");scd_requestUserLocationSecondAttempt(scdOptions);}else{if(SCD_DEBUG)
console.log("Location detection success in first request");scd_handleLocationDetectionComplete(true,localdata.country,scdOptions);}});countryRequest1.fail(function(){scd_requestUserLocationSecondAttempt(scdOptions);});}
function scd_requestUserLocationSecondAttempt(scdOptions){var countryRequest2=jQuery.get("//api.hostip.info/country.php");countryRequest2.done(function(localdata){if(localdata==='XX'){if(SCD_DEBUG)
console.log("Location detection failed in second request");scd_handleLocationDetectionComplete(false,"",scdOptions);}else{if(SCD_DEBUG)
console.log("Location detection success in second request");scd_handleLocationDetectionComplete(true,localdata,scdOptions);}});countryRequest2.fail(function(){if(SCD_DEBUG)
console.log("Location detection failed in second request");scd_handleLocationDetectionComplete(false,"",scdOptions);});}
function scd_handleLocationDetectionComplete(bSuccessful,countryCode,scdOptions){if(bSuccessful)
{localStorage['scd_countryCode']=countryCode;if(countryCode in countryMap){jQuery(document).trigger("scd:scd_country_code_updated",countryCode);}}}
var scd_local_rates;function scd_init_local_rates()
{if(scd_local_rates===undefined){scd_local_rates={};if(localStorage.getItem('scd_rates')!==null){scd_local_rates.data=JSON.parse(localStorage['scd_rates']);}
else{scd_local_rates.data=scd_default_exchange.rates;scd_local_rates.data["base"]=scd_default_exchange.base;scd_local_rates.data["timestamp"]=scd_default_exchange.timestamp;}}}
function scd_refresh_local_rates(){var timeNow=Math.floor(Date.now()/1000);if((localStorage.getItem('scd_rates')===null)||(localStorage.getItem('scd_last_rate_update')===null)||((timeNow-localStorage['scd_last_rate_update'])>6*3600))
{console.log('updating rates in progress......');jQuery.cachedScript=function(url,options){options=jQuery.extend(options||{},{dataType:"script",cache:true,url:url});return jQuery.ajax(options);};jQuery.cachedScript("https://cdn.shopify.com/s/javascripts/currencies.js").done(function(script,textStatus){console.log('fetch rates '+textStatus);var sh_rates={};sh_rates['base']='USD';jQuery.each(Currency.rates,function(index,item){sh_rates[index]=1/item;});localStorage['scd_rates']=JSON.stringify(sh_rates);localStorage['scd_last_rate_update']=Math.floor(Date.now()/1000);sh_rates['timestamp']=localStorage['scd_last_rate_update'];if(scd_local_rates===undefined){scd_local_rates={};}
scd_local_rates.data=sh_rates;console.log('SCD: rates updated');}).fail(function(jqxhr,settings,exception){jQuery.post(ajaxurl,{'action':'scd_ajax_load_rates',},function(response,status){if(status=='success'){localStorage['scd_rates']=response;localStorage['scd_last_rate_update']=Math.floor(Date.now()/1000);if(scd_local_rates===undefined){scd_local_rates={};}
scd_local_rates.data=JSON.parse(response);console.log('SCD: rates updated from open echangerate');}else{console.log('SCD: fetching rates failed! status='+status);}});});}}
function scd_get_convert_rate(base,target)
{if(scd_local_rates===undefined){scd_init_local_rates();}
if(scd_local_rates.data[base]!==undefined&&scd_local_rates.data[target]!==undefined)
{rate=parseFloat(scd_local_rates.data[target])/parseFloat(scd_local_rates.data[base]);return rate;}
else
{return undefined}}
function scd_fetchRates_from_shpy(){jQuery.cachedScript=function(url,options){options=jQuery.extend(options||{},{dataType:"script",cache:true,url:url});return jQuery.ajax(options);};jQuery.cachedScript("https://cdn.shopify.com/s/javascripts/currencies.js").done(function(script,textStatus){console.log(textStatus);console.log('load script succefully from shpy');}).fail(function(jqxhr,settings,exception){console.log('fail to load script from shpy');});}