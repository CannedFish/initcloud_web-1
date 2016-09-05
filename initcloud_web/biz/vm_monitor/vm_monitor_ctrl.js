/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Vm_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Vm_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.vm_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.vm_monitors);

        $scope.vm_monitor_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Vm_Monitor.query(function(data){
                        $scope.vm_monitors = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.vm_monitors);
                    });
                }
            });



        var deleteVm_Monitors = function(ids){

            $ngBootbox.confirm($i18next("vm_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/vm_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.vm_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteVm_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Vm_Monitor){
                    if(vm_monitor.checked){
                        ids.push(vm_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(vm_monitor){
            deleteVm_Monitors([vm_monitor.id]);
        };


        $scope.edit = function(vm_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Vm_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    vm_monitor_table: function () {
                        return $scope.vm_monitor_table;
                    },
                    vm_monitor: function(){return vm_monitor}
                }
            });
        };

        $scope.openNewVm_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-vm_monitor.html',
                backdrop: "static",
                controller: 'NewVm_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.vm_monitor_table.reload();
            });
        };
    })


    .controller('NewVm_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Vm_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Vm_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.vm_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/vm_monitor/create/', $scope.vm_monitor).then(function(result){
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

   ).factory('Vm_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            vm_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/vm_monitor/is-name-unique/",
                                    data: {
                                        vm_monitorname: $("#vm_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            vm_monitorname: {
                                remote: $i18next('vm_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#vm_monitorForm', config);
                }
            }
        }]).controller('Vm_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 vm_monitor, vm_monitor_table,
                 Vm_Monitor, UserDataCenter, vm_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.vm_monitor = vm_monitor = angular.copy(vm_monitor);

            $modalInstance.rendered.then(vm_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = vm_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(vm_monitor){

                if(!$("#Vm_MonitorForm").validate().form()){
                    return;
                }

                vm_monitor = ResourceTool.copy_only_data(vm_monitor);


                CommonHttpService.post("/api/vm_monitor/update/", vm_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        vm_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('vm_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            vm_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/vm_monitor/is-name-unique/",
                                    data: {
                                        vm_monitorname: $("#vm_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            vm_monitorname: {
                                remote: $i18next('vm_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Vm_MonitorForm', config);
                }
            }
        }]);
