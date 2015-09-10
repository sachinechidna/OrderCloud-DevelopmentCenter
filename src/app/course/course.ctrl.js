angular.module('orderCloud')
    .controller('courseCtrl', CourseController);

function CourseController($q, $stateParams, ApiConsole, ApiConsoleService, $filter, OrderCloudServices, CoursesService, ClassesService) {
    var vm = this;
    vm.class = {};
    vm.course = {};
    vm.config = {};
    vm.request = {};
    vm.services = {};

    vm.getCallLog = getCallLog;
    vm.processApiRequest = processApiRequest;
    vm.toggleConsoleMode = toggleConsoleMode;
    vm.setService = setService;
    vm.setMethod = setMethod;
    vm.setEndpoint = setEndpoint;
    vm.updateMethodDependencies = updateMethodDependencies;

    //init config
    vm.request.selectedService = "";
    vm.request.selectedMethod = "";
    vm.request.selectedEndpoint = null;
    vm.request.response = null;
    vm.request.mode = "";
    vm.request.call = {};
    vm.request.call.Headers = {};
    vm.request.call.Params = {};
    vm.request.call.object = {};
    vm.request.call.Headers['Content-Type'] = 'application/json';
    vm.request.call.Headers.Authentication = 'Bearer {token}';

    vm.config.submitDisable = false;
    vm.config.consoleType = 'API';
    vm.config.prefill = false;
    vm.config.sdkSet = false;
    vm.config.hideParams = true;

    vm.services = OrderCloudServices;
    setCourseScope();
    setClassScope();
    setRequestScope();
    vm.getCallLog();


    if ($stateParams.classID == 'api-intro') {
        vm.config.submitDisable = true;
    }

    function setCourseScope() {
        vm.course = CoursesService.setScope($stateParams.courseID, $stateParams.classID);
        vm.courseList = ClassesService.getClassList(vm.course.Classes, ['ID', 'Name']);
    }
    function setClassScope() {
        vm.class = ClassesService.setScope($stateParams.classID);
        vm.class.apiCallError = false;
        vm.class.apiCallSuccess = false;
        vm.config.sdkSet = false;


    }
    function setRequestScope() {
        vm.setService(vm.services, vm.class.SelectedService)
            .then(function() {
                vm.setMethod(vm.class.SelectedMethod);
                vm.setEndpoint();
            });
        if (vm.class && vm.class.Mode) {
            vm.request.mode = vm.class.Mode;
            if (vm.request.mode = 'API') {
                vm.config.sdkMode = false;
            } else {
                vm.config.sdkMode = true;
            }
        } else {
            vm.request.mode = 'API';
            vm.config.sdkMode = false;
        }
    }

    function getCallLog() {
        ApiConsole.getCallLog(function(data) {
            vm.callLog = data;
        });
    }

    function toggleConsoleMode() {
        if (vm.request.mode == 'API') {
            vm.request.mode = 'SDK';
            vm.config.sdkMode = true;
        } else {
            vm.request.mode = 'API';
            vm.config.sdkMode = false;
        }
    }

    function setService(services, newService) {
        var dfd = $q.defer();
       ApiConsole.selectService(services, newService)
           .then(function(data) {
               vm.request.selectedService = data;
               dfd.resolve();
           });
        vm.request.selectedMethod = null;
        vm.request.selectedEndpoint = null;
        return dfd.promise;
    }

    function setMethod(newMethodName) {
        vm.request.selectedMethod = ApiConsole.selectMethod(vm.request.selectedService, newMethodName);
    }

    function setEndpoint() {
        vm.request.selectedEndpoint = ApiConsole.selectEndpoint(vm.request.selectedService, vm.request.selectedMethod.name);
        vm.request.httpVerb = vm.request.selectedEndpoint.HttpVerb;
    }

    function updateMethodDependencies(newMethodName) {
        setMethod(newMethodName);
        setEndpoint();
    }


    function processApiRequest (method, url, params, headers, object) {

        ApiConsole.processRequest(method, url, params, headers, object)
            .then(function(data) {
                vm.request.response = $filter('json')(data);
                data = JSON.parse(vm.class.apiCall.apiResponse);
                vm.request.error = false;
                vm.request.success = true;
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
                vm.request.response = $filter('json')(reason);
                reason = JSON.parse(vm.class.request.response);
                vm.request.error = true;
                vm.request.success = false;
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

}