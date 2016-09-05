/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Memory_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Memory_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.memory_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.memory_monitors);

        $scope.memory_monitor_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Memory_Monitor.query(function(data){
                        $scope.memory_monitors = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.memory_monitors);
                    });
                }
            });



        var deleteMemory_Monitors = function(ids){

            $ngBootbox.confirm($i18next("memory_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/memory_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.memory_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteMemory_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Memory_Monitor){
                    if(memory_monitor.checked){
                        ids.push(memory_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(memory_monitor){
            deleteMemory_Monitors([memory_monitor.id]);
        };


        $scope.edit = function(memory_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Memory_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    memory_monitor_table: function () {
                        return $scope.memory_monitor_table;
                    },
                    memory_monitor: function(){return memory_monitor}
                }
            });
        };

        $scope.openNewMemory_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-memory_monitor.html',
                backdrop: "static",
                controller: 'NewMemory_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.memory_monitor_table.reload();
            });
        };
    })


    .controller('NewMemory_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Memory_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Memory_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.memory_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/memory_monitor/create/', $scope.memory_monitor).then(function(result){
                    if(result.success){
                        ToastrService.success(result.msg, $i18next("success"));
                        $modalInstance.close();
                    } else {
                        ToastrService.error(result.msg, $i18next("op_failed"));
                    }
                    $scope.is_submitting = true;
                }).finally(function(){
                    $scope.is_submitting = false;
                });
            };
        }

   ).factory('Memory_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            memory_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/memory_monitor/is-name-unique/",
                                    data: {
                                        memory_monitorname: $("#memory_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            memory_monitorname: {
                                remote: $i18next('memory_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#memory_monitorForm', config);
                }
            }
        }]).controller('Memory_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 memory_monitor, memory_monitor_table,
                 Memory_Monitor, UserDataCenter, memory_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.memory_monitor = memory_monitor = angular.copy(memory_monitor);

            $modalInstance.rendered.then(memory_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = memory_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(memory_monitor){

                if(!$("#Memory_MonitorForm").validate().form()){
                    return;
                }

                memory_monitor = ResourceTool.copy_only_data(memory_monitor);


                CommonHttpService.post("/api/memory_monitor/update/", memory_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        memory_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('memory_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            memory_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/memory_monitor/is-name-unique/",
                                    data: {
                                        memory_monitorname: $("#memory_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            memory_monitorname: {
                                remote: $i18next('memory_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Memory_MonitorForm', config);
                }
            }
        }]);
