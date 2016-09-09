/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Service_BarController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Service_Bar, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.service_bars = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.service_bars);

        $scope.service_bar_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Service_Bar.query(function(data){
                        $scope.service_bars = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.service_bars);
                    });
                }
            });



        var deleteService_Bars = function(ids){

            $ngBootbox.confirm($i18next("service_bar.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/service_bar/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.service_bar_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteService_Bars(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Service_Bar){
                    if(service_bar.checked){
                        ids.push(service_bar.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(service_bar){
            deleteService_Bars([service_bar.id]);
        };


        $scope.edit = function(service_bar){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Service_BarUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    service_bar_table: function () {
                        return $scope.service_bar_table;
                    },
                    service_bar: function(){return service_bar}
                }
            });
        };

        $scope.openNewService_BarModal = function(){
            $modal.open({
                templateUrl: 'new-service_bar.html',
                backdrop: "static",
                controller: 'NewService_BarController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.service_bar_table.reload();
            });
        };
    })


    .controller('NewService_BarController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Service_BarForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Service_BarForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.service_bar = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/service_bar/create/', $scope.service_bar).then(function(result){
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

   ).factory('Service_BarForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            service_barname: {
                                required: true,
                                remote: {
                                    url: "/api/service_bar/is-name-unique/",
                                    data: {
                                        service_barname: $("#service_barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            service_barname: {
                                remote: $i18next('service_bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#service_barForm', config);
                }
            }
        }]).controller('Service_BarUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 service_bar, service_bar_table,
                 Service_Bar, UserDataCenter, service_barForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.service_bar = service_bar = angular.copy(service_bar);

            $modalInstance.rendered.then(service_barForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = service_barForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(service_bar){

                if(!$("#Service_BarForm").validate().form()){
                    return;
                }

                service_bar = ResourceTool.copy_only_data(service_bar);


                CommonHttpService.post("/api/service_bar/update/", service_bar).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        service_bar_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('service_barForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            service_barname: {
                                required: true,
                                remote: {
                                    url: "/api/service_bar/is-name-unique/",
                                    data: {
                                        service_barname: $("#service_barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            service_barname: {
                                remote: $i18next('service_bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Service_BarForm', config);
                }
            }
        }]);
