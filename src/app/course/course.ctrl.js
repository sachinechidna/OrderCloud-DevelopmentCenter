angular.module('orderCloud')
    .controller('courseCtrl', CourseController);

function CourseController($q, $stateParams, ApiConsole, apiurl, $filter, OrderCloudServices, CoursesService, ClassesService) {
    var vm = this;
    vm.class = {};
    vm.course = {};
    vm.config = {};
    vm.request = {};
    vm.services = {};

    vm.getCallLog = getCallLog;
    vm.processRequest = processRequest;
    vm.toggleConsoleMode = toggleConsoleMode;
    vm.setService = setService;
    vm.setMethod = setMethod;
    vm.setEndpoint = setEndpoint;
    vm.setUrl = setUrl;
    vm.updateMethodDependencies = updateMethodDependencies;

    //init config
    vm.request.selectedService = "";
    vm.request.selectedMethod = "";
    vm.request.selectedEndpoint = null;
    vm.request.mode = "";
    vm.request.call = {
        Params: {},
        Object: null,
        Url: null,
        Headers: {
            Authentication: 'Bearer {token}',
            'Content-Type': 'application/json'
        }
    };

    vm.config.submitDisable = false;
    vm.config.prefill = false;
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
        vm.course.CourseList = ClassesService.getClassList(vm.course.Classes, ['ID', 'Name']);
    }
    function setClassScope() {
        vm.class = ClassesService.setScope($stateParams.classID);


    }
    function setRequestScope() {
        vm.setService(vm.services, vm.class.SelectedService)
            .then(function() {
                vm.setMethod(vm.class.SelectedMethod);
                vm.setEndpoint();
                vm.setUrl();
                vm.request.call.Object = vm.request.selectedEndpoint.RequestBody.Sample;
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
        vm.request.call.Method = vm.request.selectedEndpoint.HttpVerb;
        vm.request.call.Object = vm.request.selectedEndpoint.RequestBody ? vm.request.selectedEndpoint.RequestBody.Sample : "";
    }

    function setUrl() {
        vm.request.call.BaseUrl = vm.config.environment ? 'https://" + vm.config.environment' + 'api.ordercloud.io' : apiurl;
        vm.request.call.Url = vm.request.call.BaseUrl + '/' + vm.request.selectedEndpoint.UriTemplate;

    }

    function updateMethodDependencies(newMethodName) {
        setMethod(newMethodName);
        setEndpoint();
        setUrl();

    }


    function processRequest () {
        if (vm.request.mode == 'API') {
            ApiConsole.processRawRequest(vm.request.call)
                .then(function(data) {
                    callSuccess(data)
                }, function(reason) {
                    callFailure(reason)
                })
        }
        if (vm.request.mode = 'SDK') {
            ApiConsole.processSdkRequest(vm.request.call, vm.request.selectedEndpoint.Parameters, vm.request.selectedMethod.params, vm.request.selectedService.name, vm.request.selectedMethod.name)
                .then(function(data) {
                    callSuccess(data)
                }, function(reason) {
                    callFailure(reason)
                })
        }
    }


    function callSuccess(data) {
        vm.request.call.Response = $filter('json')(data);
        data = JSON.parse(vm.request.call.Response);
        vm.request.call.error = false;
        vm.request.call.success = true;
        /* TODO: add config services and include in controller
        if ($stateParams.classID == 'auth-intro') {
            ApiConsole.setConfig({token: data.access_token});
        }*/
        addToCallLog(data, true);
    }
    function callFailure(reason) {
        vm.request.call.Response = $filter('json')(reason);
        reason = JSON.parse(vm.request.call.Response);
        vm.request.error = true;
        vm.request.success = false;
        addToCallLog(reason, false);
    }
    function addToCallLog(data, passed) {
        var callLogData = {
            'method': vm.request.call.Method,
            'url': vm.request.call.Url,
            'params': vm.request.call.Params,
            'headers': vm.request.call.Headers,
            'object': vm.request.call.Object,
            'response': data,
            'success': passed,
            'time': Date.now()
        };
        ApiConsole.addCallLogItem(callLogData)
            .then(function() {
                getCallLog();
            });

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