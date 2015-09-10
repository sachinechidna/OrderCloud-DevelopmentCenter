angular.module('orderCloud')
    .factory('ApiConsole', ApiConsoleSvc);

function ApiConsoleSvc($resource, $cookies, $localForage, $q, apiurl) {
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

    function _processRequest(method, url, params, headers, object) {
        if (method == 'POST') {
            return post(url, params, headers, object)
        }
        if (method == 'PUT') {
            return put(url, params, headers, object)
        }
        if (method == 'PATCH') {
            return patch(url, params, headers, object)
        }
        if (method == 'GET') {
            return get(url, params, headers)
        }
        if (method == 'DELETE') {
            return del(url, params, headers, object)
        }
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
        processRequest: _processRequest,
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



