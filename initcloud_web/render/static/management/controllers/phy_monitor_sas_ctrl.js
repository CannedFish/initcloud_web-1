/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_Monitor_SasController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor_Sas, CheckboxGroup, DataCenter,custimer){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.phy_monitor_sass = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitor_sass);
        $scope.$on('to-child-sas',function(d,id){
            d.preventDefault();
            var Timer  = custimer.getInstance();//创建自定义定时器
            Timer.stop();
            var data = '';
            Timer.start(function(){
                data = Phy_Monitor_Sas.query(function(data) { 
                }, {id: id});
                $scope.phy_monitor_sass = data; 
            },5000);
            var data = Phy_Monitor_Sas.query(function(data) {
            }, {id: id});
            $scope.phy_monitor_sass = data; 
            checkboxGroup.syncObjects($scope.phy_monitor_sass);

        })
        $scope.phy_monitor_sas_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Phy_Monitor_Sas.query(function(data){
                        $scope.phy_monitor_sass = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.phy_monitor_sass);
                    });
                }
            });



        var deletePhy_Monitor_Sass = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor_sas.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor_sas/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_sas_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitor_Sass(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor_Sas){
                    if(phy_monitor_sas.checked){
                        ids.push(phy_monitor_sas.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor_sas){
            deletePhy_Monitor_Sass([phy_monitor_sas.id]);
        };


        $scope.edit = function(phy_monitor_sas){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_Monitor_SasUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_sas_table: function () {
                        return $scope.phy_monitor_sas_table;
                    },
                    phy_monitor_sas: function(){return phy_monitor_sas}
                }
            });
        };

        $scope.openNewPhy_Monitor_SasModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor_sas.html',
                backdrop: "static",
                controller: 'NewPhy_Monitor_SasController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_sas_table.reload();
            });
        };
    })


    .controller('NewPhy_Monitor_SasController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_Monitor_SasForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_Monitor_SasForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor_sas = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor_sas/create/', $scope.phy_monitor_sas).then(function(result){
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

   ).factory('Phy_Monitor_SasForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_sasname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_sas/is-name-unique/",
                                    data: {
                                        phy_monitor_sasname: $("#phy_monitor_sasname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_sasname: {
                                remote: $i18next('phy_monitor_sas.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitor_sasForm', config);
                }
            }
        }]).controller('Phy_Monitor_SasUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor_sas, phy_monitor_sas_table,
                 Phy_Monitor_Sas, UserDataCenter, phy_monitor_sasForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor_sas = phy_monitor_sas = angular.copy(phy_monitor_sas);

            $modalInstance.rendered.then(phy_monitor_sasForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitor_sasForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor_sas){

                if(!$("#Phy_Monitor_SasForm").validate().form()){
                    return;
                }

                phy_monitor_sas = ResourceTool.copy_only_data(phy_monitor_sas);


                CommonHttpService.post("/api/phy_monitor_sas/update/", phy_monitor_sas).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_sas_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitor_sasForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_sasname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_sas/is-name-unique/",
                                    data: {
                                        phy_monitor_sasname: $("#phy_monitor_sasname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_sasname: {
                                remote: $i18next('phy_monitor_sas.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_Monitor_SasForm', config);
                }
            }
        }]);
