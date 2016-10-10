/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_Monitor_StorageController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor_Storage, CheckboxGroup, DataCenter,custimer){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.phy_monitor_storages = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitor_storages);
        
        // $scope.phy_monitor_storage_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Phy_Monitor_Storage.query(function(data){
        //                 $scope.phy_monitor_storages = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.phy_monitor_storages);
        //             });
        //         }
        //     });
        /* var data = { */
            // 'nodes':[
                        
                        // {'id':1,'cpu1':[80,70],'cpu2':[60,90],'memory_voltage':[10,12,12,12,12,11,11,11,11,11,12,10,10,11,10,13]},
                        
                        // {'id':1,'cpu1':[88,60],'cpu2':[90,100],'memory_voltage':[14,11,13,12,12,11,11,11,11,11,12,10,10,11,10,13]}
                        
                        
                    // ],
            // 'disk':[1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,0,1,0,0,-1,
                    // 0,1,1,1,1,1,0,0,0,-1,1,1,0,0,0,1,1,0,0,1],
            // 'disk_status':{'-1':'没插盘','0':'插盘未分配','1':'插盘已分配'},
            // 'electric_rota':[1200,1500],
            // 'systemUI':[1.2,12],
            // 'PDU':[[220,12,1.2],[220,12,1.5]]
        // }
       /* $scope.phy_monitor_storages = data; */
        var Timer  = custimer.getInstance();//创建自定义定时器
        Timer.stop();
        Timer.start(function(){
            Phy_Monitor_Storage.get(function(data) { 
                $scope.phy_monitor_storages = data;
                checkboxGroup.syncObjects($scope.phy_monitor_storages);
            });
             
        },30000);
        Phy_Monitor_Storage.get(function(data) {
           $scope.phy_monitor_storages = data; 
        });
        checkboxGroup.syncObjects($scope.phy_monitor_storages);
        var deletePhy_Monitor_Storages = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor_storage.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor_storage/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_storage_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitor_Storages(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor_Storage){
                    if(phy_monitor_storage.checked){
                        ids.push(phy_monitor_storage.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor_storage){
            deletePhy_Monitor_Storages([phy_monitor_storage.id]);
        };


        $scope.edit = function(phy_monitor_storage){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_Monitor_StorageUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_storage_table: function () {
                        return $scope.phy_monitor_storage_table;
                    },
                    phy_monitor_storage: function(){return phy_monitor_storage}
                }
            });
        };

        $scope.openNewPhy_Monitor_StorageModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor_storage.html',
                backdrop: "static",
                controller: 'NewPhy_Monitor_StorageController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_storage_table.reload();
            });
        };
    })


    .controller('NewPhy_Monitor_StorageController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_Monitor_StorageForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_Monitor_StorageForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor_storage = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor_storage/create/', $scope.phy_monitor_storage).then(function(result){
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

   ).factory('Phy_Monitor_StorageForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_storagename: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_storage/is-name-unique/",
                                    data: {
                                        phy_monitor_storagename: $("#phy_monitor_storagename").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_storagename: {
                                remote: $i18next('phy_monitor_storage.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitor_storageForm', config);
                }
            }
        }]).controller('Phy_Monitor_StorageUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor_storage, phy_monitor_storage_table,
                 Phy_Monitor_Storage, UserDataCenter, phy_monitor_storageForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor_storage = phy_monitor_storage = angular.copy(phy_monitor_storage);

            $modalInstance.rendered.then(phy_monitor_storageForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitor_storageForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor_storage){

                if(!$("#Phy_Monitor_StorageForm").validate().form()){
                    return;
                }

                phy_monitor_storage = ResourceTool.copy_only_data(phy_monitor_storage);


                CommonHttpService.post("/api/phy_monitor_storage/update/", phy_monitor_storage).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_storage_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitor_storageForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_storagename: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_storage/is-name-unique/",
                                    data: {
                                        phy_monitor_storagename: $("#phy_monitor_storagename").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_storagename: {
                                remote: $i18next('phy_monitor_storage.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_Monitor_StorageForm', config);
                }
            }
        }]);
