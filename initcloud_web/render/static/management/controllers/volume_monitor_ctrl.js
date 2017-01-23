/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Volume_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Volume_Monitor, CheckboxGroup, DataCenter,custimer){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.volume_monitors = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.volume_monitors);
        var Timer = custimer.getInstance();//创建自定义定时器
        Timer.stop();
        // $scope.volume_monitor_table = new ngTableParams({
        //          page: 1,
        //          count: 10
        //      },{
        //          counts: [],
        //          getData: function($defer, params){
        //              console.log(params);
        //              Volume_Monitor.query(function(data){ 
        //                  // alert("data")
        //                  // alert($scope.volume_monitors)
        //                  // $scope.volume_monitors = ngTableHelper.paginate(data, $defer, params);
        //                  // alert($scope.volume_monitors)
        //                  // checkboxGroup.syncObjects($scope.volume_monitors);
                        
        //              });
        //          }
        //      });
        // var data = [
        //     {
        //         'name':'虚拟云盘01',
        //         'location':'存储服务器一',
        //         'capacity':'20',
        //         'status':'online',
        //         'type':'高速存储',
        //         'mounting':'虚拟机01'
        //     },
        //     {
        //         'name':'虚拟云盘02',
        //         'location':'存储服务器一',
        //         'capacity':'20',
        //         'status':'online',
        //         'type':'高速存储',
        //         'mounting':'虚拟机01'
        //     },
        //     {
        //         'name':'虚拟云盘03',
        //         'location':'存储服务器一',
        //         'capacity':'20',
        //         'status':'online',
        //         'type':'高速存储',
        //         'mounting':'虚拟机01'
        //     }
        // ]
        // $scope.volume_monitors = data ;
        // checkboxGroup.syncObjects($scope.volume_monitors);
        Volume_Monitor.query(function(data){
            $scope.volume_monitors = data ;
             //ng-repeat 渲染完执行脚本
            $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
                 checkboxGroup.syncObjects($scope.volume_monitors);
                 ngRepeatFinishedEvent.stopPropagation(); // 终止事件继续“冒泡”
            })
            
        })
        var deleteVolume_Monitors = function(ids){

            $ngBootbox.confirm($i18next("volume_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }
                CommonHttpService.post("/api/volume_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.volume_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteVolume_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Volume_Monitor){
                    if(volume_monitor.checked){
                        ids.push(volume_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(volume_monitor){
            deleteVolume_Monitors([volume_monitor.id]);
        };


        $scope.edit = function(volume_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Volume_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    volume_monitor_table: function () {
                        return $scope.volume_monitor_table;
                    },
                    volume_monitor: function(){return volume_monitor}
                }
            });
        };

        $scope.openNewVolume_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-volume_monitor.html',
                backdrop: "static",
                controller: 'NewVolume_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.volume_monitor_table.reload();
            });
        };
    })


    .controller('NewVolume_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Volume_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Volume_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.volume_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/volume_monitor/create/', $scope.volume_monitor).then(function(result){
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

   ).factory('Volume_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            volume_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/volume_monitor/is-name-unique/",
                                    data: {
                                        volume_monitorname: $("#volume_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            volume_monitorname: {
                                remote: $i18next('volume_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#volume_monitorForm', config);
                }
            }
        }]).controller('Volume_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 volume_monitor, volume_monitor_table,
                 Volume_Monitor, UserDataCenter, volume_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.volume_monitor = volume_monitor = angular.copy(volume_monitor);

            $modalInstance.rendered.then(volume_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = volume_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(volume_monitor){

                if(!$("#Volume_MonitorForm").validate().form()){
                    return;
                }

                volume_monitor = ResourceTool.copy_only_data(volume_monitor);


                CommonHttpService.post("/api/volume_monitor/update/", volume_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        volume_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('volume_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            volume_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/volume_monitor/is-name-unique/",
                                    data: {
                                        volume_monitorname: $("#volume_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            volume_monitorname: {
                                remote: $i18next('volume_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Volume_MonitorForm', config);
                }
            }
        }]);
