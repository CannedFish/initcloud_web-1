/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_Monitor_NetworkController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor_Network, CheckboxGroup, DataCenter,custimer){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.phy_monitor_networks = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitor_networks);
        //初始化数 显示第一个
        var init_data = Phy_Monitor_Network.query(function(data) {
            }, {id: 1});
        $scope.phy_monitor_networks = init_data; 
        checkboxGroup.syncObjects($scope.phy_monitor_networks);
       
        $scope.$on('to-child-network',function(d,id){
        	d.preventDefault();
            var Timer  = custimer.getInstance();//创建自定义定时器
            Timer.stop();
            var data = '';
            Timer.start(function(){
                data = Phy_Monitor_Network.query(function(data) { 
                }, {id: id});
                $scope.phy_monitor_networks = data; 
            },5000);
            var data = Phy_Monitor_Network.query(function(data) {
            }, {id: id});
            $scope.phy_monitor_networks = data; 
            checkboxGroup.syncObjects($scope.phy_monitor_networks);

        })
        var deletePhy_Monitor_Networks = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor_network.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor_network/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_network_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitor_Networks(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor_Network){
                    if(phy_monitor_network.checked){
                        ids.push(phy_monitor_network.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor_network){
            deletePhy_Monitor_Networks([phy_monitor_network.id]);
        };


        $scope.edit = function(phy_monitor_network){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_Monitor_NetworkUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_network_table: function () {
                        return $scope.phy_monitor_network_table;
                    },
                    phy_monitor_network: function(){return phy_monitor_network}
                }
            });
        };

        $scope.openNewPhy_Monitor_NetworkModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor_network.html',
                backdrop: "static",
                controller: 'NewPhy_Monitor_NetworkController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_network_table.reload();
            });
        };
    })


    .controller('NewPhy_Monitor_NetworkController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_Monitor_NetworkForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_Monitor_NetworkForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor_network = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor_network/create/', $scope.phy_monitor_network).then(function(result){
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

   ).factory('Phy_Monitor_NetworkForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_networkname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_network/is-name-unique/",
                                    data: {
                                        phy_monitor_networkname: $("#phy_monitor_networkname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_networkname: {
                                remote: $i18next('phy_monitor_network.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitor_networkForm', config);
                }
            }
        }]).controller('Phy_Monitor_NetworkUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor_network, phy_monitor_network_table,
                 Phy_Monitor_Network, UserDataCenter, phy_monitor_networkForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor_network = phy_monitor_network = angular.copy(phy_monitor_network);

            $modalInstance.rendered.then(phy_monitor_networkForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitor_networkForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor_network){

                if(!$("#Phy_Monitor_NetworkForm").validate().form()){
                    return;
                }

                phy_monitor_network = ResourceTool.copy_only_data(phy_monitor_network);


                CommonHttpService.post("/api/phy_monitor_network/update/", phy_monitor_network).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_network_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitor_networkForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_networkname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_network/is-name-unique/",
                                    data: {
                                        phy_monitor_networkname: $("#phy_monitor_networkname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_networkname: {
                                remote: $i18next('phy_monitor_network.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_Monitor_NetworkForm', config);
                }
            }
        }]);
