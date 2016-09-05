/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Service__BarController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Service__Bar, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.service__bars = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.service__bars);

        $scope.service__bar_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Service__Bar.query(function(data){
                        $scope.service__bars = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.service__bars);
                    });
                }
            });



        var deleteService__Bars = function(ids){

            $ngBootbox.confirm($i18next("service__bar.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/service__bar/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.service__bar_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteService__Bars(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Service__Bar){
                    if(service__bar.checked){
                        ids.push(service__bar.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(service__bar){
            deleteService__Bars([service__bar.id]);
        };


        $scope.edit = function(service__bar){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Service__BarUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    service__bar_table: function () {
                        return $scope.service__bar_table;
                    },
                    service__bar: function(){return service__bar}
                }
            });
        };

        $scope.openNewService__BarModal = function(){
            $modal.open({
                templateUrl: 'new-service__bar.html',
                backdrop: "static",
                controller: 'NewService__BarController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.service__bar_table.reload();
            });
        };
    })


    .controller('NewService__BarController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Service__BarForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Service__BarForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.service__bar = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/service__bar/create/', $scope.service__bar).then(function(result){
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

   ).factory('Service__BarForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            service__barname: {
                                required: true,
                                remote: {
                                    url: "/api/service__bar/is-name-unique/",
                                    data: {
                                        service__barname: $("#service__barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            service__barname: {
                                remote: $i18next('service__bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#service__barForm', config);
                }
            }
        }]).controller('Service__BarUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 service__bar, service__bar_table,
                 Service__Bar, UserDataCenter, service__barForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.service__bar = service__bar = angular.copy(service__bar);

            $modalInstance.rendered.then(service__barForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = service__barForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(service__bar){

                if(!$("#Service__BarForm").validate().form()){
                    return;
                }

                service__bar = ResourceTool.copy_only_data(service__bar);


                CommonHttpService.post("/api/service__bar/update/", service__bar).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        service__bar_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('service__barForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            service__barname: {
                                required: true,
                                remote: {
                                    url: "/api/service__bar/is-name-unique/",
                                    data: {
                                        service__barname: $("#service__barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            service__barname: {
                                remote: $i18next('service__bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Service__BarForm', config);
                }
            }
        }]);
