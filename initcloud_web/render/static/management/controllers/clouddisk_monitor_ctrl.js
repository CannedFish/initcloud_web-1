/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Clouddisk_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Clouddisk_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.clouddisk_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.clouddisk_monitors);

        $scope.clouddisk_monitor_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Clouddisk_Monitor.query(function(data){
                        $scope.clouddisk_monitors = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.clouddisk_monitors);
                    });
                }
            });



        var deleteClouddisk_Monitors = function(ids){

            $ngBootbox.confirm($i18next("clouddisk_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/clouddisk_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.clouddisk_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteClouddisk_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Clouddisk_Monitor){
                    if(clouddisk_monitor.checked){
                        ids.push(clouddisk_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(clouddisk_monitor){
            deleteClouddisk_Monitors([clouddisk_monitor.id]);
        };


        $scope.edit = function(clouddisk_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Clouddisk_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    clouddisk_monitor_table: function () {
                        return $scope.clouddisk_monitor_table;
                    },
                    clouddisk_monitor: function(){return clouddisk_monitor}
                }
            });
        };

        $scope.openNewClouddisk_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-clouddisk_monitor.html',
                backdrop: "static",
                controller: 'NewClouddisk_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.clouddisk_monitor_table.reload();
            });
        };
    })


    .controller('NewClouddisk_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Clouddisk_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Clouddisk_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.clouddisk_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/clouddisk_monitor/create/', $scope.clouddisk_monitor).then(function(result){
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

   ).factory('Clouddisk_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            clouddisk_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/clouddisk_monitor/is-name-unique/",
                                    data: {
                                        clouddisk_monitorname: $("#clouddisk_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            clouddisk_monitorname: {
                                remote: $i18next('clouddisk_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#clouddisk_monitorForm', config);
                }
            }
        }]).controller('Clouddisk_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 clouddisk_monitor, clouddisk_monitor_table,
                 Clouddisk_Monitor, UserDataCenter, clouddisk_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.clouddisk_monitor = clouddisk_monitor = angular.copy(clouddisk_monitor);

            $modalInstance.rendered.then(clouddisk_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = clouddisk_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(clouddisk_monitor){

                if(!$("#Clouddisk_MonitorForm").validate().form()){
                    return;
                }

                clouddisk_monitor = ResourceTool.copy_only_data(clouddisk_monitor);


                CommonHttpService.post("/api/clouddisk_monitor/update/", clouddisk_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        clouddisk_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('clouddisk_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            clouddisk_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/clouddisk_monitor/is-name-unique/",
                                    data: {
                                        clouddisk_monitorname: $("#clouddisk_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            clouddisk_monitorname: {
                                remote: $i18next('clouddisk_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Clouddisk_MonitorForm', config);
                }
            }
        }]);
