/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('WarningController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Warning, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
               //过滤筛选条件
                $('table').footable().bind('footable_filtering', function(e) {
                    var selected = "";
                        angular.forEach($('.filter-status'),function(v,i){
                            selected += $(v).find(':selected').text()+' ';
                        })
                        if (selected && selected.length > 0) {
                          // e.filter += (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
                           e.filter = (e.filter && e.filter.length > 0) ? ' ' + selected : selected;
                           e.clear = !e.filter;
                        }
                      });
              
                    $('.filter-status').change(function(e) {
                        e.preventDefault();
                        $('table.footable').data('footable-filter').filter();    
                    });
        });

        $scope.warnings = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.warnings);
       
        var data =[
            {'name':'网络设备','warning_type':'硬件报警','warning_info':'CPU温度过高','memory_point':'1','virtual_mechine':'1','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'超微服务器','warning_type':'硬件报警','warning_info':'CPU温度过高','memory_point':'2','virtual_mechine':'2','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'JBDO','warning_type':'硬件报警','warning_info':'CPU温度过高','memory_point':'3','virtual_mechine':'3','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'存储服务器','warning_type':'硬件报警','warning_info':'CPU温度过高','memory_point':'4','virtual_mechine':'4','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'存储服务器','warning_type':'硬件报警','warning_info':'CPU温度过高','memory_point':'5','virtual_mechine':'5','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'6号超级微服务器','warning_type':'系统报警','warning_info':'CPU温度过高','memory_point':'6','virtual_mechine':'6','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'7号超级微服务器','warning_type':'系统报警','warning_info':'CPU温度过高','memory_point':'7','virtual_mechine':'7','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'8号超级微服务器','warning_type':'系统报警','warning_info':'CPU温度过高','memory_point':'8','virtual_mechine':'8','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'9号超级微服务器','warning_type':'系统报警','warning_info':'CPU温度过高','memory_point':'9','virtual_mechine':'9','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'},
            {'name':'10号超级微服务器','warning_type':'系统报警','warning_info':'CPU温度过高','memory_point':'10','virtual_mechine':'10','cloud_disk':'123','warning_time':'2016/08/12/ 11:23:34'}
        ];
        $scope.initData = data[0];//初始值
        $scope.warnings = data; 
        checkboxGroup.syncObjects($scope.warnings);
        //点击显示数据
        $scope.setDatatoLeftBar = function(item){
           $scope.rightbar = item;
        }
        var deleteWarnings = function(ids){

            $ngBootbox.confirm($i18next("warning.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/warning/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.warning_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteWarnings(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Warning){
                    if(warning.checked){
                        ids.push(warning.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(warning){
            deleteWarnings([warning.id]);
        };


        $scope.edit = function(warning){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'WarningUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    warning_table: function () {
                        return $scope.warning_table;
                    },
                    warning: function(){return warning}
                }
            });
        };

        $scope.openNewWarningModal = function(){
            $modal.open({
                templateUrl: 'new-warning.html',
                backdrop: "static",
                controller: 'NewWarningController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.warning_table.reload();
            });
        };
    })


    .controller('NewWarningController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, WarningForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = WarningForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.warning = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/warning/create/', $scope.warning).then(function(result){
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

   ).factory('WarningForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            warningname: {
                                required: true,
                                remote: {
                                    url: "/api/warning/is-name-unique/",
                                    data: {
                                        warningname: $("#warningname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            warningname: {
                                remote: $i18next('warning.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#warningForm', config);
                }
            }
        }]).controller('WarningUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 warning, warning_table,
                 Warning, UserDataCenter, warningForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.warning = warning = angular.copy(warning);

            $modalInstance.rendered.then(warningForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = warningForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(warning){

                if(!$("#WarningForm").validate().form()){
                    return;
                }

                warning = ResourceTool.copy_only_data(warning);


                CommonHttpService.post("/api/warning/update/", warning).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        warning_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('warningForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            warningname: {
                                required: true,
                                remote: {
                                    url: "/api/warning/is-name-unique/",
                                    data: {
                                        warningname: $("#warningname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            warningname: {
                                remote: $i18next('warning.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#WarningForm', config);
                }
            }
        }]);
