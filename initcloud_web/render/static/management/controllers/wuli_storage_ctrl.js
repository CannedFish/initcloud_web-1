/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Wuli_StorageController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Wuli_Storage, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.wuli_storages = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.wuli_storages);

        // $scope.wuli_storage_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Wuli_Storage.query(function(data){
        //                 $scope.wuli_storages = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.wuli_storages);
        //             });
        //         }
        //     });



        var deleteWuli_Storages = function(ids){

            $ngBootbox.confirm($i18next("wuli_storage.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/wuli_storage/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.wuli_storage_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteWuli_Storages(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Wuli_Storage){
                    if(wuli_storage.checked){
                        ids.push(wuli_storage.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(wuli_storage){
            deleteWuli_Storages([wuli_storage.id]);
        };


        $scope.edit = function(wuli_storage){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Wuli_StorageUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    wuli_storage_table: function () {
                        return $scope.wuli_storage_table;
                    },
                    wuli_storage: function(){return wuli_storage}
                }
            });
        };

        $scope.openNewWuli_StorageModal = function(){
            $modal.open({
                templateUrl: 'new-wuli_storage.html',
                backdrop: "static",
                controller: 'NewWuli_StorageController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.wuli_storage_table.reload();
            });
        };
    })


    .controller('NewWuli_StorageController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Wuli_StorageForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Wuli_StorageForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.wuli_storage = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/wuli_storage/create/', $scope.wuli_storage).then(function(result){
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

   ).factory('Wuli_StorageForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            wuli_storagename: {
                                required: true,
                                remote: {
                                    url: "/api/wuli_storage/is-name-unique/",
                                    data: {
                                        wuli_storagename: $("#wuli_storagename").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            wuli_storagename: {
                                remote: $i18next('wuli_storage.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#wuli_storageForm', config);
                }
            }
        }]).controller('Wuli_StorageUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 wuli_storage, wuli_storage_table,
                 Wuli_Storage, UserDataCenter, wuli_storageForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.wuli_storage = wuli_storage = angular.copy(wuli_storage);

            $modalInstance.rendered.then(wuli_storageForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = wuli_storageForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(wuli_storage){

                if(!$("#Wuli_StorageForm").validate().form()){
                    return;
                }

                wuli_storage = ResourceTool.copy_only_data(wuli_storage);


                CommonHttpService.post("/api/wuli_storage/update/", wuli_storage).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        wuli_storage_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('wuli_storageForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            wuli_storagename: {
                                required: true,
                                remote: {
                                    url: "/api/wuli_storage/is-name-unique/",
                                    data: {
                                        wuli_storagename: $("#wuli_storagename").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            wuli_storagename: {
                                remote: $i18next('wuli_storage.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Wuli_StorageForm', config);
                }
            }
        }]);
