/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Network_Bar_LoadbanlanceController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Network_Bar_Loadbanlance, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.network_bar_loadbanlances = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_bar_loadbanlances);

        // $scope.network_bar_loadbanlance_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Network_Bar_Loadbanlance.query(function(data){
        //                 $scope.network_bar_loadbanlances = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.network_bar_loadbanlances);
        //             });
        //         }
        //     });
        var data = {'lb_pool_num':'4,532,165','lb_virtualip_num':'25,654'};
        $scope.network_bar_loadbanlances = data;
        
        var deleteNetwork_Bar_Loadbanlances = function(ids){

            $ngBootbox.confirm($i18next("network_bar_loadbanlance.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/network_bar_loadbanlance/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.network_bar_loadbanlance_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteNetwork_Bar_Loadbanlances(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Network_Bar_Loadbanlance){
                    if(network_bar_loadbanlance.checked){
                        ids.push(network_bar_loadbanlance.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(network_bar_loadbanlance){
            deleteNetwork_Bar_Loadbanlances([network_bar_loadbanlance.id]);
        };


        $scope.edit = function(network_bar_loadbanlance){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Network_Bar_LoadbanlanceUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    network_bar_loadbanlance_table: function () {
                        return $scope.network_bar_loadbanlance_table;
                    },
                    network_bar_loadbanlance: function(){return network_bar_loadbanlance}
                }
            });
        };

        $scope.openNewNetwork_Bar_LoadbanlanceModal = function(){
            $modal.open({
                templateUrl: 'new-network_bar_loadbanlance.html',
                backdrop: "static",
                controller: 'NewNetwork_Bar_LoadbanlanceController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.network_bar_loadbanlance_table.reload();
            });
        };
    })


    .controller('NewNetwork_Bar_LoadbanlanceController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Network_Bar_LoadbanlanceForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Network_Bar_LoadbanlanceForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.network_bar_loadbanlance = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/network_bar_loadbanlance/create/', $scope.network_bar_loadbanlance).then(function(result){
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

   ).factory('Network_Bar_LoadbanlanceForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_loadbanlancename: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_loadbanlance/is-name-unique/",
                                    data: {
                                        network_bar_loadbanlancename: $("#network_bar_loadbanlancename").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_loadbanlancename: {
                                remote: $i18next('network_bar_loadbanlance.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#network_bar_loadbanlanceForm', config);
                }
            }
        }]).controller('Network_Bar_LoadbanlanceUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 network_bar_loadbanlance, network_bar_loadbanlance_table,
                 Network_Bar_Loadbanlance, UserDataCenter, network_bar_loadbanlanceForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.network_bar_loadbanlance = network_bar_loadbanlance = angular.copy(network_bar_loadbanlance);

            $modalInstance.rendered.then(network_bar_loadbanlanceForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = network_bar_loadbanlanceForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(network_bar_loadbanlance){

                if(!$("#Network_Bar_LoadbanlanceForm").validate().form()){
                    return;
                }

                network_bar_loadbanlance = ResourceTool.copy_only_data(network_bar_loadbanlance);


                CommonHttpService.post("/api/network_bar_loadbanlance/update/", network_bar_loadbanlance).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        network_bar_loadbanlance_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('network_bar_loadbanlanceForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_loadbanlancename: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_loadbanlance/is-name-unique/",
                                    data: {
                                        network_bar_loadbanlancename: $("#network_bar_loadbanlancename").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_loadbanlancename: {
                                remote: $i18next('network_bar_loadbanlance.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Network_Bar_LoadbanlanceForm', config);
                }
            }
        }]);
