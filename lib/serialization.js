var _ = require('lodash');

exports.serializeRequest = serializeRequest;

function serializeRequest(validationObject, req, res, next){
    var missingVars = [];
    req.deSerialized = {};
    _.forIn(validationObject.required, function(value, key){
        var requestValue = _.get(req, key, null);
        if(requestValue === null){
            missingVars.push(value);
            return;
        }
        _.set(req, 'deSerialized.'+value, requestValue);
    });

    if(!_.isEmpty(missingVars)){
        return next({'status': 400, 'error': 'Missing Parameter', 'message': 'Missing Parameter: '+missingVars.toString()});
    }

    _.forIn(validationObject.optional, function(value, key){
        var requestValue = _.get(req, key, null);
        if(_.isArray(requestValue) && _.isEmpty(requestValue)) {
            _.set(req, 'deSerialized.' + value, null);
            requestValue = null;
        }

        if(requestValue !== null) {
            _.set(req, 'deSerialized.' + value, requestValue);
        }
    });
    return next();
}
