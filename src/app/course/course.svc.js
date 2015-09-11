angular.module('orderCloud')
    .factory('ApiConsole', ApiConsoleSvc);

function ApiConsoleSvc($resource, $localForage, $q, apiurl, Underscore, $injector, $cookies) {
    function get(url, params, headers) {
        return $resource(url, params, {apiGet: {method: 'GET', headers: headers}}, {'stripTrailingSlashes': true}).apiGet().$promise;
    }
    function post(url, params, headers, object) {
        return $resource(url, {}, {apiPost: {method: 'POST', headers: headers, params: params}}, {'stripTrailingSlashes': true}).apiPost(object).$promise;
    }
    function put(url, params, headers, object) {
        return $resource(url, {}, {apiPut: {method: 'PUT', headers: headers, params: params}}, {'stripTrailingSlashes': true}).apiPut(object).$promise;
    }
    function patch(url, params, headers, object) {
        return $resource(url, {}, {apiPatch: {method: 'PATCH', headers: headers, params: params}}, {'stripTrailingSlashes': true}).apiPatch(object).$promise;
    }
    function del(url, params, headers, object) {
        return $resource(url, {}, {apiDelete: {method: 'DELETE', headers: headers, params: params}}, {'stripTrailingSlashes': true}).apiDelete(object).$promise;
    }

    function _processRawRequest(callObject) {
        callObject.Headers.Authentication = callObject.Headers.Authentication.replace('Bearer ', '');
        callObject.Headers.Authentication = callObject.Headers.Authentication.replace('{token}', '');
        callObject.Headers.Authentication =  callObject.Headers.Authentication != '' ? callObject.Headers.Authentication : eval($cookies.get('DevCenter.token'));
        callObject.Headers.Authentication = 'Bearer ' + callObject.Headers.Authentication;
        if (callObject.Method == 'POST') {
            return post(callObject.Url, callObject.Params, callObject.Headers, callObject.Object)
        }
        if (callObject.Method == 'PUT') {
            return put(callObject.Url, callObject.Params, callObject.Headers, callObject.Object)
        }
        if (callObject.Method == 'PATCH') {
            return patch(callObject.Url, callObject.Params, callObject.Headers, callObject.Object)
        }
        if (callObject.Method == 'GET') {
            return get(callObject.Url, callObject.Params, callObject.Headers)
        }
        if (callObject.Method == 'DELETE') {
            return del(callObject.Url, callObject.Params, callObject.Headers, callObject.Object)
        }
    }

    function _processSdkRequest(callObject, fnParams, sdkParams, serviceName, methodName) {
        //Adds Main Params if any
        var callParams = [];
        fnParams = Underscore.pluck(fnParams, 'Name');
        sdkParams.forEach(function(paramName) {
            (fnParams.indexOf(paramName) > -1) ? callParams.push(callObject.Params[paramName] || null) : null;
        });
        //Adds Object if any
        var nonFnParams = Underscore.difference(sdkParams, fnParams);
        var object = Underscore.difference(nonFnParams, ['authToken', 'overrideUrl']);
        (object.length > 0) ? callParams.push(JSON.parse(callObject.Object)) : null;

        //Adds Auth if specified
        callObject.Headers.Authentication = callObject.Headers.Authentication.replace('Bearer ', '');
        callObject.Headers.Authentication = callObject.Headers.Authentication.replace('{token}', '');
        callObject.Headers.Authentication != '' ? callParams.push(callObject.Headers.Authentication) : callParams.push(eval($cookies.get('DevCenter.token')));
       /* callParams.push(callObject.Headers.Authentication);*/

        callObject.BaseUrl ? callParams.push(callObject.BaseUrl) : null;
        console.log(callParams);

        return $injector.get(serviceName)[methodName].apply(this, callParams);

    }

    function _addCallLogItem(data) {
        var dfd = $q.defer();
        $localForage.getItem('callLog').then(function(callList) {
            if (!callList) {
                callList = [];
            }
            callList.push(data);
            $localForage.setItem('callLog', callList).then(function() {
                    dfd.resolve(data);
            }, function(reason) {console.log(reason)});
        });
        return dfd.promise;
    }
    function _getCallLog(cb) {
        $localForage.getItem('callLog').then(function(callList) {
            cb(callList)
        })
    }
    function _delCallLogItem(callObj, cb) {
        $localForage.getItem('callLog').then(function(callList) {
            for (var i = 0; i < callList.length; i++) {
                if (callList[i].name == callObj.name) {
                    callList.splice(i,1);
                }
            }
            cb(callList);
        })
    }

    function _setEnvironment(newVals) {
        $localForage.getItem('workEnv').then(function(vals) {
            if (!vals) {
                $localForage.setItem('workEnv', [newVals]);
            }
            for (var newKey in newVals) {
                var complete = false;
                for (var oldKey in vals) {
                    if (newKey == oldKey) {
                        vals[oldKey] = newVals[newKey];
                        complete = true;
                    }
                }
                if (complete == false) {
                    vals[newKey] = newVals[newKey];
                }
            }
            $localForage.setItem('workEnv', vals)
        })
    }

    function _getEnvironment(cb) {
        $localForage.getItem('workEnv').then(function(data) {
            cb(data);
        })
    }

    function _updateConfig(configObj) {

        $localForage.getItem('courseConfig').then(function(vals) {
            if (!vals) {
                $localForage.setItem('courseConfig', newVals)
            } else {
                for (var newKey in newVals) {
                    var complete = false;
                    for (var oldKey in vals) {
                        if (newKey == oldKey) {
                            vals[oldKey] = newVals[newKey];
                            complete = true;
                        }
                    }
                    if (complete == false) {
                        vals[newKey] = newVals[newKey];
                    }
                }
                $localForage.setItem('courseConfig', vals)
            }
        })
    }
    function _getConfig(config, prefill) {
        $localForage.getItem('courseConfig').then(function(data) {

        })
    }

    function _selectService(services, selectedService) {
        var dfd = $q.defer();
        var returnObj = {};
        services.forEach(function(service) {
            if (selectedService == service.name) {
                returnObj = service;
                $resource( apiurl + '/v1/docs/' + returnObj.name ).get().$promise
                    .then(function(data) {
                        returnObj.Documentation = data.toJSON();
                        dfd.resolve(returnObj);
                    });
            }
        });
        return dfd.promise;
    }

    function _selectMethod(currentService, selectedMethod) {
        var returnObj = {};
        if (currentService.methods) {
            currentService.methods.forEach(function(method) {
                if (method.name == selectedMethod) {
                    returnObj = method;
                }
            })
        }
        return returnObj;
    }

    function _selectEndpoint(currentService, currentSDKMethodName) {
        var returnObj = {};
        currentService.Documentation.Endpoints.forEach(function(endpoint) {
            if (endpoint.ID == currentSDKMethodName) {
                returnObj = endpoint;
            }
        });
        return returnObj;
    }

    return {
        processRawRequest: _processRawRequest,
        processSdkRequest: _processSdkRequest,
        addCallLogItem: _addCallLogItem,
        getCallLog: _getCallLog,
        delCallLogItem: _delCallLogItem,
        setEnvironment: _setEnvironment,
        getEnvironment: _getEnvironment,
        updateConfig: _updateConfig,
        getConfig: _getConfig,
        selectService: _selectService,
        selectMethod: _selectMethod,
        selectEndpoint: _selectEndpoint
    };
}



