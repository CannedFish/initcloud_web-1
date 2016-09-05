/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_Monitor_JbodController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor_Jbod, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.phy_monitor_jbods = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitor_jbods);

        $scope.phy_monitor_jbod_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Phy_Monitor_Jbod.query(function(data){
                        $scope.phy_monitor_jbods = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.phy_monitor_jbods);
                    });
                }
            });



        var deletePhy_Monitor_Jbods = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor_jbod.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor_jbod/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_jbod_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitor_Jbods(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor_Jbod){
                    if(phy_monitor_jbod.checked){
                        ids.push(phy_monitor_jbod.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor_jbod){
            deletePhy_Monitor_Jbods([phy_monitor_jbod.id]);
        };


        $scope.edit = function(phy_monitor_jbod){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_Monitor_JbodUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_jbod_table: function () {
                        return $scope.phy_monitor_jbod_table;
                    },
                    phy_monitor_jbod: function(){return phy_monitor_jbod}
                }
            });
        };

        $scope.openNewPhy_Monitor_JbodModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor_jbod.html',
                backdrop: "static",
                controller: 'NewPhy_Monitor_JbodController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_jbod_table.reload();
            });
        };
    })


    .controller('NewPhy_Monitor_JbodController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_Monitor_JbodForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_Monitor_JbodForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor_jbod = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor_jbod/create/', $scope.phy_monitor_jbod).then(function(result){
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

   ).factory('Phy_Monitor_JbodForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_jbodname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_jbod/is-name-unique/",
                                    data: {
                                        phy_monitor_jbodname: $("#phy_monitor_jbodname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_jbodname: {
                                remote: $i18next('phy_monitor_jbod.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitor_jbodForm', config);
                }
            }
        }]).controller('Phy_Monitor_JbodUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor_jbod, phy_monitor_jbod_table,
                 Phy_Monitor_Jbod, UserDataCenter, phy_monitor_jbodForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor_jbod = phy_monitor_jbod = angular.copy(phy_monitor_jbod);

            $modalInstance.rendered.then(phy_monitor_jbodForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitor_jbodForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor_jbod){

                if(!$("#Phy_Monitor_JbodForm").validate().form()){
                    return;
                }

                phy_monitor_jbod = ResourceTool.copy_only_data(phy_monitor_jbod);


                CommonHttpService.post("/api/phy_monitor_jbod/update/", phy_monitor_jbod).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_jbod_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitor_jbodForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_jbodname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_jbod/is-name-unique/",
                                    data: {
                                        phy_monitor_jbodname: $("#phy_monitor_jbodname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_jbodname: {
                                remote: $i18next('phy_monitor_jbod.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_Monitor_JbodForm', config);
                }
            }
        }]);
