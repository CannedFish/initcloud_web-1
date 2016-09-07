/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Network_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Network_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.network_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_monitors);

        // $scope.network_monitor_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Network_Monitor.query(function(data){
        //                 $scope.network_monitors = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.network_monitors);
        //             });
        //         }
        //     });
        $scope.$on('to-parent',function(d,data){
             $scope.network_total = data;
        })
        checkboxGroup.syncObjects($scope.network_monitors);
        

        var deleteNetwork_Monitors = function(ids){

            $ngBootbox.confirm($i18next("network_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/network_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.network_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteNetwork_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Network_Monitor){
                    if(network_monitor.checked){
                        ids.push(network_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(network_monitor){
            deleteNetwork_Monitors([network_monitor.id]);
        };


        $scope.edit = function(network_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Network_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    network_monitor_table: function () {
                        return $scope.network_monitor_table;
                    },
                    network_monitor: function(){return network_monitor}
                }
            });
        };

        $scope.openNewNetwork_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-network_monitor.html',
                backdrop: "static",
                controller: 'NewNetwork_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.network_monitor_table.reload();
            });
        };
    })


    .controller('NewNetwork_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Network_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Network_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.network_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/network_monitor/create/', $scope.network_monitor).then(function(result){
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

   ).factory('Network_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/network_monitor/is-name-unique/",
                                    data: {
                                        network_monitorname: $("#network_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_monitorname: {
                                remote: $i18next('network_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#network_monitorForm', config);
                }
            }
        }]).controller('Network_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 network_monitor, network_monitor_table,
                 Network_Monitor, UserDataCenter, network_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.network_monitor = network_monitor = angular.copy(network_monitor);

            $modalInstance.rendered.then(network_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = network_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(network_monitor){

                if(!$("#Network_MonitorForm").validate().form()){
                    return;
                }

                network_monitor = ResourceTool.copy_only_data(network_monitor);


                CommonHttpService.post("/api/network_monitor/update/", network_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        network_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('network_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/network_monitor/is-name-unique/",
                                    data: {
                                        network_monitorname: $("#network_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_monitorname: {
                                remote: $i18next('network_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Network_MonitorForm', config);
                }
            }
        }]);
