/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_Monitor_ServerController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor_Server, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.phy_monitor_servers = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitor_servers);

        $scope.phy_monitor_server_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Phy_Monitor_Server.query(function(data){
                        $scope.phy_monitor_servers = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.phy_monitor_servers);
                    });
                }
            });



        var deletePhy_Monitor_Servers = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor_server.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor_server/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_server_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitor_Servers(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor_Server){
                    if(phy_monitor_server.checked){
                        ids.push(phy_monitor_server.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor_server){
            deletePhy_Monitor_Servers([phy_monitor_server.id]);
        };


        $scope.edit = function(phy_monitor_server){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_Monitor_ServerUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_server_table: function () {
                        return $scope.phy_monitor_server_table;
                    },
                    phy_monitor_server: function(){return phy_monitor_server}
                }
            });
        };

        $scope.openNewPhy_Monitor_ServerModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor_server.html',
                backdrop: "static",
                controller: 'NewPhy_Monitor_ServerController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_server_table.reload();
            });
        };
    })


    .controller('NewPhy_Monitor_ServerController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_Monitor_ServerForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_Monitor_ServerForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor_server = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor_server/create/', $scope.phy_monitor_server).then(function(result){
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

   ).factory('Phy_Monitor_ServerForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_servername: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_server/is-name-unique/",
                                    data: {
                                        phy_monitor_servername: $("#phy_monitor_servername").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_servername: {
                                remote: $i18next('phy_monitor_server.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitor_serverForm', config);
                }
            }
        }]).controller('Phy_Monitor_ServerUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor_server, phy_monitor_server_table,
                 Phy_Monitor_Server, UserDataCenter, phy_monitor_serverForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor_server = phy_monitor_server = angular.copy(phy_monitor_server);

            $modalInstance.rendered.then(phy_monitor_serverForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitor_serverForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor_server){

                if(!$("#Phy_Monitor_ServerForm").validate().form()){
                    return;
                }

                phy_monitor_server = ResourceTool.copy_only_data(phy_monitor_server);


                CommonHttpService.post("/api/phy_monitor_server/update/", phy_monitor_server).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_server_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitor_serverForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_servername: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_server/is-name-unique/",
                                    data: {
                                        phy_monitor_servername: $("#phy_monitor_servername").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_servername: {
                                remote: $i18next('phy_monitor_server.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_Monitor_ServerForm', config);
                }
            }
        }]);
