/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });
        $scope.phy_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitors);
        //接受传递过来的参数查询显示 
        // 网络监控
        $scope.$on('to-parent-network',function(d,data){
    
             d.stopPropagation();
            //接收参数 广播给指定的孩子节点
            $scope.$broadcast('to-child-network',data);
           
        })
        // 服务器监控
        $scope.$on('to-parent-server',function(d,data){
            d.stopPropagation();
            $scope.$broadcast('to-child-server',data);
        })
        // sas
        $scope.$on('to-parent-sas',function(d,data){
            d.stopPropagation();
            $scope.$broadcast('to-child-sas',data);
        })
        //jbod
        $scope.$on('to-parent-jbod',function(d,data){
            d.stopPropagation();
            $scope.$broadcast('to-child-jbod',data);
        })
        var deletePhy_Monitors = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor){
                    if(phy_monitor.checked){
                        ids.push(phy_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor){
            deletePhy_Monitors([phy_monitor.id]);
        };


        $scope.edit = function(phy_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_table: function () {
                        return $scope.phy_monitor_table;
                    },
                    phy_monitor: function(){return phy_monitor}
                }
            });
        };

        $scope.openNewPhy_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor.html',
                backdrop: "static",
                controller: 'NewPhy_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_table.reload();
            });
        };
    })


    .controller('NewPhy_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor/create/', $scope.phy_monitor).then(function(result){
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

   ).factory('Phy_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor/is-name-unique/",
                                    data: {
                                        phy_monitorname: $("#phy_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitorname: {
                                remote: $i18next('phy_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitorForm', config);
                }
            }
        }]).controller('Phy_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor, phy_monitor_table,
                 Phy_Monitor, UserDataCenter, phy_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor = phy_monitor = angular.copy(phy_monitor);

            $modalInstance.rendered.then(phy_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor){

                if(!$("#Phy_MonitorForm").validate().form()){
                    return;
                }

                phy_monitor = ResourceTool.copy_only_data(phy_monitor);


                CommonHttpService.post("/api/phy_monitor/update/", phy_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor/is-name-unique/",
                                    data: {
                                        phy_monitorname: $("#phy_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitorname: {
                                remote: $i18next('phy_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_MonitorForm', config);
                }
            }
        }]);
