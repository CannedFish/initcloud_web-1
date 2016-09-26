/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Cloud_Monitor_DetailController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cloud_Monitor_Detail, CheckboxGroup, DataCenter,urlParamsTrnasfer,cloud_id){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.cloud_monitor_details = '';
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cloud_monitor_details);

        //接搜id 查找数据
        $scope.cloud_id = cloud_id;
        //id 为传递的参数
	    var data = Cloud_Monitor_Detail.query({'cloud_id':$scope.cloud_id});
        $scope.cloud_monitor_details = data;
        checkboxGroup.syncObjects($scope.cloud_monitor_details);
         //ng-repeat 渲染完执行脚本
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
            console.log($('.pagination').find('.footable-page-arrow:eq(0)')
            .find('a').text());
            $('.pagination').find('.footable-page-arrow:eq(0)')
            .find('a').text('上一页').css({'background':'transparent','border':'solid 1px #0077bc','height':'28px;','marginRight':'10px'});
            $('.pagination').find('.footable-page-arrow:eq(1)')
            .find('a').text('下一页').css({'background':'transparent','border':'solid 1px #0077bc','height':'28px;'});
        })
        var deleteCloud_Monitor_Details = function(ids){

            $ngBootbox.confirm($i18next("cloud_monitor_detail.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cloud_monitor_detail/batch-delete/", {ids:ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cloud_monitor_detail_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCloud_Monitor_Details(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cloud_Monitor_Detail){
                    if(cloud_monitor_detail.checked){
                        ids.push(cloud_monitor_detail.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cloud_monitor_detail){
            deleteCloud_Monitor_Details([cloud_monitor_detail.id]);
        };


        $scope.edit = function(cloud_monitor_detail){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Cloud_Monitor_DetailUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cloud_monitor_detail_table: function () {
                        return $scope.cloud_monitor_detail_table;
                    },
                    cloud_monitor_detail: function(){return cloud_monitor_detail}
                }
            });
        };

        $scope.openNewCloud_Monitor_DetailModal = function(){
            $modal.open({
                templateUrl: 'new-cloud_monitor_detail.html',
                backdrop: "static",
                controller: 'NewCloud_Monitor_DetailController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cloud_monitor_detail_table.reload();
            });
        };
    })


    .controller('NewCloud_Monitor_DetailController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Cloud_Monitor_DetailForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Cloud_Monitor_DetailForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cloud_monitor_detail = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cloud_monitor_detail/create/', $scope.cloud_monitor_detail).then(function(result){
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

   ).factory('Cloud_Monitor_DetailForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitor_detailname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor_detail/is-name-unique/",
                                    data: {
                                        cloud_monitor_detailname: $("#cloud_monitor_detailname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitor_detailname: {
                                remote: $i18next('cloud_monitor_detail.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cloud_monitor_detailForm', config);
                }
            }
        }]).controller('Cloud_Monitor_DetailUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cloud_monitor_detail, cloud_monitor_detail_table,
                 Cloud_Monitor_Detail, UserDataCenter, cloud_monitor_detailForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cloud_monitor_detail = cloud_monitor_detail = angular.copy(cloud_monitor_detail);

            $modalInstance.rendered.then(cloud_monitor_detailForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cloud_monitor_detailForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cloud_monitor_detail){

                if(!$("#Cloud_Monitor_DetailForm").validate().form()){
                    return;
                }

                cloud_monitor_detail = ResourceTool.copy_only_data(cloud_monitor_detail);


                CommonHttpService.post("/api/cloud_monitor_detail/update/", cloud_monitor_detail).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cloud_monitor_detail_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cloud_monitor_detailForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitor_detailname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor_detail/is-name-unique/",
                                    data: {
                                        cloud_monitor_detailname: $("#cloud_monitor_detailname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitor_detailname: {
                                remote: $i18next('cloud_monitor_detail.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Cloud_Monitor_DetailForm', config);
                }
            }
        }]);
