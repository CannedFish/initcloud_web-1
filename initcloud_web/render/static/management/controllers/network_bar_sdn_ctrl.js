/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Network_Bar_SdnController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Network_Bar_Sdn, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.network_bar_sdns = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_bar_sdns);
        //网络监控 sdn 数据

        Network_Bar_Sdn.query(function(data){
            $scope.network_bar_sdns = data ;
            checkboxGroup.syncObjects($scope.network_bar_sdns);
        })
        // var data = {'switchboard':'456,456,777',
        //     'switchboard_recive_request_datapackage_num':'56,336,345,232',
        //     'switchboard_recive_request_datapackage_bits':'56,336,345,232',
        //     'switchboard_flow_sustained_time':'50天23小时40分45秒',
        //     'switchboard_trans_failedpackage_num':'7,456,223,167'
        // };
        // $scope.network_bar_sdns = data;
        // checkboxGroup.syncObjects($scope.network_bar_sdns);
        var deleteNetwork_Bar_Sdns = function(ids){

            $ngBootbox.confirm($i18next("network_bar_sdn.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/network_bar_sdn/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.network_bar_sdn_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteNetwork_Bar_Sdns(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Network_Bar_Sdn){
                    if(network_bar_sdn.checked){
                        ids.push(network_bar_sdn.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(network_bar_sdn){
            deleteNetwork_Bar_Sdns([network_bar_sdn.id]);
        };


        $scope.edit = function(network_bar_sdn){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Network_Bar_SdnUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    network_bar_sdn_table: function () {
                        return $scope.network_bar_sdn_table;
                    },
                    network_bar_sdn: function(){return network_bar_sdn}
                }
            });
        };

        $scope.openNewNetwork_Bar_SdnModal = function(){
            $modal.open({
                templateUrl: 'new-network_bar_sdn.html',
                backdrop: "static",
                controller: 'NewNetwork_Bar_SdnController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.network_bar_sdn_table.reload();
            });
        };
    })


    .controller('NewNetwork_Bar_SdnController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Network_Bar_SdnForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Network_Bar_SdnForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.network_bar_sdn = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/network_bar_sdn/create/', $scope.network_bar_sdn).then(function(result){
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

   ).factory('Network_Bar_SdnForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_sdnname: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_sdn/is-name-unique/",
                                    data: {
                                        network_bar_sdnname: $("#network_bar_sdnname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_sdnname: {
                                remote: $i18next('network_bar_sdn.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#network_bar_sdnForm', config);
                }
            }
        }]).controller('Network_Bar_SdnUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 network_bar_sdn, network_bar_sdn_table,
                 Network_Bar_Sdn, UserDataCenter, network_bar_sdnForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.network_bar_sdn = network_bar_sdn = angular.copy(network_bar_sdn);

            $modalInstance.rendered.then(network_bar_sdnForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = network_bar_sdnForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(network_bar_sdn){

                if(!$("#Network_Bar_SdnForm").validate().form()){
                    return;
                }

                network_bar_sdn = ResourceTool.copy_only_data(network_bar_sdn);


                CommonHttpService.post("/api/network_bar_sdn/update/", network_bar_sdn).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        network_bar_sdn_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('network_bar_sdnForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_sdnname: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_sdn/is-name-unique/",
                                    data: {
                                        network_bar_sdnname: $("#network_bar_sdnname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_sdnname: {
                                remote: $i18next('network_bar_sdn.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Network_Bar_SdnForm', config);
                }
            }
        }]);
