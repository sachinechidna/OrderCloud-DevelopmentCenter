angular.module('orderCloud.course')
    .controller('courseCtrl', CourseController);

function CourseController($stateParams, ApiConsole, CourseDefinition, ClassDefinition, $filter) {
    var vm = this;
    vm.class = {};
    vm.course = {};
    vm.config = {};
    vm.setCourseScope = setCourseScope;
    vm.setClassScope = setClassScope;
    vm.getConfig = getConfig;
    vm.getCallLog = getCallLog;
    vm.processApiRequest = processApiRequest;
    vm.setClassLinks = setClassLinks;
    vm.stringifyAceModels = stringifyAceModels;

    //init
    vm.setCourseScope();
    vm.setClassScope();
    vm.getCallLog();
    vm.submitDisable = false;

    if ($stateParams.classID == 'api-intro') {
        vm.submitDisable = true;
    }
    function setClassLinks(classIDs) {
        var output = [];
        var tempObj = {};
        ClassDefinition.getClasses().then(function(data) {
            classIDs.forEach(function(ID) {
                data.data.forEach(function(eachClass) {
                    if (ID == eachClass.ID) {
                        tempObj.ID = ID;
                        tempObj.Name = eachClass.Name;
                        output.push(tempObj);
                        tempObj = {};

                    }
                })
            });
            vm.classes = output;
        });
    }
    function stringifyAceModels() {
        for (var i = 0; i < vm.class.leftScripts.length; i++) {
            if ( typeof vm.class.leftScripts[i] != 'string') {
                vm.class.leftScripts[i] = $filter('json')(vm.class.leftScripts[i]);
            }
        }
    }
    function getConfig() {
        ApiConsole.getConfig(function(data) {
            vm.config.prefill = true;
            if (vm.config.prefill == true && data) {
                if (data.token && vm.class.apiCall.headers.Authorization) {
                    vm.class.apiCall.headers.Authorization = vm.class.apiCall.headers.Authorization.replace('{token}', data.token);
                }
                if (data.apiEnv) {
                    vm.class.apiCall.url = vm.class.apiCall.url.replace('{apiEnv}', data.apiEnv);
                } else {
                    vm.class.apiCall.url = vm.class.apiCall.url.replace('{apiEnv}', "test");
                }
                if (data.buyerID) {
                    vm.class.apiCall.url = vm.class.apiCall.url.replace('{buyerID}', data.buyerID);
                }

            } else {
                vm.class.apiCall.url = vm.class.apiCall.url.replace('{apiEnv}', "test");
            }
        })
    }
    function setCourseScope() {
        CourseDefinition.setScope($stateParams.courseID, $stateParams.classID, function(data) {
            vm.course = data;
            vm.setClassLinks(data.classIDs);
        })
    }
    function setClassScope() {
        ClassDefinition.setScope($stateParams.classID, function(data) {
            vm.class = data;
            if (vm.class.apiCall.object) {
                vm.class.apiCall.object = $filter('json')(vm.class.apiCall.object);
            }
            vm.class.apiCallError = false;
            vm.class.apiCallSuccess = false;
            vm.stringifyAceModels();
            if (vm.class.xp.setResponse) {
                vm.class.apiCall.apiResponse = $filter('json')(vm.class.xp.setResponse);
            }
            getConfig();
        });
    }
    function getCallLog() {
        ApiConsole.getCallLog(function(data) {
            vm.callLog = data;
        });
    }
    function processApiRequest (method, url, params, headers, object) {

        ApiConsole.processRequest(method, url, params, headers, object)
            .then(function(data) {
                vm.class.apiCall.apiResponse = $filter('json')(data);
                data = JSON.parse(vm.class.apiCall.apiResponse);
                vm.class.apiCallError = false;
                vm.class.apiCallSuccess = true;
                if ($stateParams.classID == 'auth-intro') {
                    ApiConsole.setConfig({token: data.access_token});
                }

                var callLogData = {
                    'method': method,
                    'url': url,
                    'params': params,
                    'headers': headers,
                    'object': object,
                    'response': data,
                    'success': true,
                    'time': Date.now()
                };
                ApiConsole.addCallLogItem(callLogData)
                    .then(function() {
                        getCallLog();
                        vm.getConfig();
                    });


            }, function(reason) {
                vm.class.apiCall.apiResponse = $filter('json')(reason);
                reason = JSON.parse(vm.class.apiCall.apiResponse);
                vm.class.apiCallError = true;
                vm.class.apiCallSuccess = false;
                var callLogData = {
                    'method': method,
                    'url': url,
                    'params': params,
                    'headers': headers,
                    'object': object,
                    'response': reason,
                    'success': false,
                    'time': Date.now()
                };
                ApiConsole.addCallLogItem(callLogData)
                    .then(function() {
                        getCallLog();
                        vm.getConfig();

                    });
            })
    }
    function addParam(){
        /*TODO: adds line for new param in console*/
    }
    function deleteLog() {
        /*TODO: deletes log item*/
    }
    function deleteAllLogs(){
        /*TODO: Deletes all log items*/
    }
    function viewLog() {
        /*TODO: Populates console with log item*/
    }
    function pinLog() {
        /*TODO: Pins a log item to the top of the log*//**/
    }
    function saveTab() {
        /*TODO: Saves working data for current request*/
    }
    function tabToggle() {
        /*TODO: Allows user to toggle between multiple working tabs*/
    }

    vm.httpOptions = [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE'
    ];
}