angular.module('orderCloud.course')
    .factory('ApiConsole', ApiConsoleSvc)
    .factory('CourseDefinition', CourseDefinitionSvc)
    .factory('ClassDefinition', ClassDefinitionSvc);

function ApiConsoleSvc($resource, $cookies, $localForage, $q) {
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

    function _setConfig(newVals) {
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
    function _getConfig(cb) {
        $localForage.getItem('courseConfig').then(function(data) {
            cb(data);
        })
    }


    return {
        processRequest: _processRequest,
        addCallLogItem: _addCallLogItem,
        getCallLog: _getCallLog,
        delCallLogItem: _delCallLogItem,
        setEnvironment: _setEnvironment,
        getEnvironment: _getEnvironment,
        setConfig: _setConfig,
        getConfig: _getConfig
    };
}



function ClassDefinitionSvc($http) {
    function _getClasses() {
        return $http.get('assets/classes.json');
    }

    function _setScope(classID, cb) {
        var returnObject = {};
        _getClasses()
            .success(function(data) {
                data.forEach(function(each) {
                    if (each.ID == classID) {
                        returnObject.name = each.Name;
                        for (var key in each.Scope) {
                            returnObject[key] = each.Scope[key];
                        }
                    }
                });
                cb(returnObject);
            })
    }

    return {
        getClasses: _getClasses,
        setScope: _setScope
    }
}

function CourseDefinitionSvc($http) {
    function _getCourses() {
        return $http.get('assets/courses.json');
    }

    function _setScope(courseID, classID, cb) {
        var returnObject = {};
        _getCourses()
            .success(function(data){
                data.forEach(function(each) {
                    if (each.ID == courseID) {
                        returnObject.name = each.Name;
                        returnObject.ID = each.ID;
                        returnObject.classCount = each.Classes.length;
                        returnObject.classIDs = each.Classes;
                        for (var i = 0; i < each.Classes.length; i++) {
                            if (each.Classes[i] == classID) {
                                returnObject.courseLevel = i + 1;
                                if (i + 1 != each.Classes.length) {
                                    returnObject.nextClass = each.Classes[i + 1]
                                }
                            }
                        }
                        for (var key in each.Scope) {
                            returnObject[key] = each[key];
                        }
                    }
                });
                cb(returnObject)
            });


    }

    return {
        getCourses: _getCourses,
        setScope: _setScope
    }
}