/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Cloud_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cloud_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.cloud_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cloud_monitors);

        $scope.cloud_monitor_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Cloud_Monitor.query(function(data){
                        $scope.cloud_monitors = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.cloud_monitors);
                    });
                }
            });



        var deleteCloud_Monitors = function(ids){

            $ngBootbox.confirm($i18next("cloud_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cloud_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cloud_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCloud_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cloud_Monitor){
                    if(cloud_monitor.checked){
                        ids.push(cloud_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cloud_monitor){
            deleteCloud_Monitors([cloud_monitor.id]);
        };


        $scope.edit = function(cloud_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Cloud_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cloud_monitor_table: function () {
                        return $scope.cloud_monitor_table;
                    },
                    cloud_monitor: function(){return cloud_monitor}
                }
            });
        };

        $scope.openNewCloud_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-cloud_monitor.html',
                backdrop: "static",
                controller: 'NewCloud_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cloud_monitor_table.reload();
            });
        };
    })


    .controller('NewCloud_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Cloud_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Cloud_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cloud_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cloud_monitor/create/', $scope.cloud_monitor).then(function(result){
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

   ).factory('Cloud_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor/is-name-unique/",
                                    data: {
                                        cloud_monitorname: $("#cloud_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitorname: {
                                remote: $i18next('cloud_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cloud_monitorForm', config);
                }
            }
        }]).controller('Cloud_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cloud_monitor, cloud_monitor_table,
                 Cloud_Monitor, UserDataCenter, cloud_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cloud_monitor = cloud_monitor = angular.copy(cloud_monitor);

            $modalInstance.rendered.then(cloud_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cloud_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cloud_monitor){

                if(!$("#Cloud_MonitorForm").validate().form()){
                    return;
                }

                cloud_monitor = ResourceTool.copy_only_data(cloud_monitor);


                CommonHttpService.post("/api/cloud_monitor/update/", cloud_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cloud_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cloud_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor/is-name-unique/",
                                    data: {
                                        cloud_monitorname: $("#cloud_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitorname: {
                                remote: $i18next('cloud_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Cloud_MonitorForm', config);
                }
            }
        }]);
