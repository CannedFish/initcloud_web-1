/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('CabinetController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cabinet, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.cabinets = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cabinets);

        $scope.cabinet_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Cabinet.query(function(data){
                        $scope.cabinets = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.cabinets);
                    });
                }
            });



        var deleteCabinets = function(ids){

            $ngBootbox.confirm($i18next("cabinet.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cabinet/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cabinet_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCabinets(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cabinet){
                    if(cabinet.checked){
                        ids.push(cabinet.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cabinet){
            deleteCabinets([cabinet.id]);
        };


        $scope.edit = function(cabinet){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'CabinetUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cabinet_table: function () {
                        return $scope.cabinet_table;
                    },
                    cabinet: function(){return cabinet}
                }
            });
        };

        $scope.openNewCabinetModal = function(){
            $modal.open({
                templateUrl: 'new-cabinet.html',
                backdrop: "static",
                controller: 'NewCabinetController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cabinet_table.reload();
            });
        };
    })


    .controller('NewCabinetController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, CabinetForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = CabinetForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cabinet = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cabinet/create/', $scope.cabinet).then(function(result){
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

   ).factory('CabinetForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cabinetname: {
                                required: true,
                                remote: {
                                    url: "/api/cabinet/is-name-unique/",
                                    data: {
                                        cabinetname: $("#cabinetname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cabinetname: {
                                remote: $i18next('cabinet.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cabinetForm', config);
                }
            }
        }]).controller('CabinetUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cabinet, cabinet_table,
                 Cabinet, UserDataCenter, cabinetForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cabinet = cabinet = angular.copy(cabinet);

            $modalInstance.rendered.then(cabinetForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cabinetForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cabinet){

                if(!$("#CabinetForm").validate().form()){
                    return;
                }

                cabinet = ResourceTool.copy_only_data(cabinet);


                CommonHttpService.post("/api/cabinet/update/", cabinet).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cabinet_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cabinetForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cabinetname: {
                                required: true,
                                remote: {
                                    url: "/api/cabinet/is-name-unique/",
                                    data: {
                                        cabinetname: $("#cabinetname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cabinetname: {
                                remote: $i18next('cabinet.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#CabinetForm', config);
                }
            }
        }]);
