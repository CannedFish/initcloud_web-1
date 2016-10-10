/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Storage_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,$timeout,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Storage_Monitor, CheckboxGroup, DataCenter,custimer){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.storage_monitors = '';
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.storage_monitors);
        var Timer = custimer.getInstance();//创建自定义定时器
        Timer.start(function(){
            Storage_Monitor.get(function(data) { 
                if(data.results){
                    for(var o in data.results){
                        // var nc = data.results[o].item.network_card;
                        // nc.up_rate ='2'+nc.up_rate.substring(1);
                        // nc.down_rate ='2'+nc.down_rate.substring(1);
                    } 
                    $scope.storage_monitors = data.results;
                    checkboxGroup.syncObjects($scope.storage_monitors);
                }
                
            })
        },30000);
        
        Storage_Monitor.get(function(data){
            if(data.results){
                for(var o in data.results){
                    // var nc = data.results[o];
                    // if(nc == undefined) return;
                    // nc.item.network_card.up_rate ='2'+nc.up_rate.substring(1);
                    // nc.item.network_card.down_rate ='2'+nc.down_rate.substring(1);
                }
                $scope.storage_monitors = data.results;
                checkboxGroup.syncObjects($scope.storage_monitors); 
            }
           
        });
        // $scope.storage_monitors = data.results;
        checkboxGroup.syncObjects($scope.storage_monitors);
        var deleteStorage_Monitors = function(ids){

            $ngBootbox.confirm($i18next("storage_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/storage_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.storage_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteStorage_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Storage_Monitor){
                    if(storage_monitor.checked){
                        ids.push(storage_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(storage_monitor){
            deleteStorage_Monitors([storage_monitor.id]);
        };


        $scope.edit = function(storage_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Storage_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    storage_monitor_table: function () {
                        return $scope.storage_monitor_table;
                    },
                    storage_monitor: function(){return storage_monitor}
                }
            });
        };

        $scope.openNewStorage_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-storage_monitor.html',
                backdrop: "static",
                controller: 'NewStorage_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.storage_monitor_table.reload();
            });
        };
    })


    .controller('NewStorage_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Storage_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Storage_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.storage_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/storage_monitor/create/', $scope.storage_monitor).then(function(result){
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

   ).factory('Storage_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            storage_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/storage_monitor/is-name-unique/",
                                    data: {
                                        storage_monitorname: $("#storage_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            storage_monitorname: {
                                remote: $i18next('storage_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#storage_monitorForm', config);
                }
            }
        }]).controller('Storage_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 storage_monitor, storage_monitor_table,
                 Storage_Monitor, UserDataCenter, storage_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.storage_monitor = storage_monitor = angular.copy(storage_monitor);

            $modalInstance.rendered.then(storage_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = storage_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(storage_monitor){

                if(!$("#Storage_MonitorForm").validate().form()){
                    return;
                }

                storage_monitor = ResourceTool.copy_only_data(storage_monitor);


                CommonHttpService.post("/api/storage_monitor/update/", storage_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        storage_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('storage_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            storage_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/storage_monitor/is-name-unique/",
                                    data: {
                                        storage_monitorname: $("#storage_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            storage_monitorname: {
                                remote: $i18next('storage_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Storage_MonitorForm', config);
                }
            }
        }]);
