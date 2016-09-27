/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Network_Bar_RouterController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Network_Bar_Router, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.network_bar_routers = '';
        // var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_bar_routers)
        // Network_Bar_Router.get(function(data){
        //     $scope.rightbar = data.list[0];//初始ip值
        //     $scope.network_bar_routers = data.list;
        //     $scope.$emit('to-parent-route', data.total);
        //     checkboxGroup.syncObjects($scope.network_bar_routers);
        // })
        //临时数据
        $scope.network_bar_routers = {'total': 2, 
        'list': [
        {'ips': [{'ip': '172.24.4.230', 'ip_type': 'network:router_gateway', 'ip_connect_vm': 'fa:16:3e:48:91:3e'}],
         'name': 'test_router2'}, 
        {'ips': [
            {'ip': '172.24.4.226', 'ip_type': 'network:router_gateway', 'ip_connect_vm': 'fa:16:3e:d5:50:1f'}, 
            {'ip': '10.0.0.1', 'ip_type':'network:router_interface', 'ip_connect_vm': 'fa:16:3e:bc:c6:7f'}
        ], 
        'name': 'router1'}
        ]}
        //折叠函数
        $scope.floder = function(e){
            var speed =1000;
            // $(e.target).trigger();
            
            $(e.target).find('.ipbox').slideDown(speed).end().addClass("selected");
            // console.log($(this).next().html())
            //             $(this).next().slideDown(speed).end().addClass("selected");
            //             if($(this).find("b")){
            //                 $(this).find("b").html("-");
            //             }
            //         }else{
            //             $(obj_c).slideUp(speed);
            //             $(obj).removeClass("selected");
            //             $(this).next().slideDown(speed).end().addClass("selected");
            //         }
            //     }
            // });
        }
        // 点击触发右边列表
        $scope.triggerRightBar = function(item){
           $scope.rightbar = item;
        }
        var deleteNetwork_Bar_Routers = function(ids){

            $ngBootbox.confirm($i18next("network_bar_router.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/network_bar_router/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.network_bar_router_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteNetwork_Bar_Routers(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Network_Bar_Router){
                    if(network_bar_router.checked){
                        ids.push(network_bar_router.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(network_bar_router){
            deleteNetwork_Bar_Routers([network_bar_router.id]);
        };


        $scope.edit = function(network_bar_router){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Network_Bar_RouterUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    network_bar_router_table: function () {
                        return $scope.network_bar_router_table;
                    },
                    network_bar_router: function(){return network_bar_router}
                }
            });
        };

        $scope.openNewNetwork_Bar_RouterModal = function(){
            $modal.open({
                templateUrl: 'new-network_bar_router.html',
                backdrop: "static",
                controller: 'NewNetwork_Bar_RouterController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.network_bar_router_table.reload();
            });
        };
    })


    .controller('NewNetwork_Bar_RouterController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Network_Bar_RouterForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Network_Bar_RouterForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.network_bar_router = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/network_bar_router/create/', $scope.network_bar_router).then(function(result){
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

   ).factory('Network_Bar_RouterForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_routername: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_router/is-name-unique/",
                                    data: {
                                        network_bar_routername: $("#network_bar_routername").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_routername: {
                                remote: $i18next('network_bar_router.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#network_bar_routerForm', config);
                }
            }
        }]).controller('Network_Bar_RouterUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 network_bar_router, network_bar_router_table,
                 Network_Bar_Router, UserDataCenter, network_bar_routerForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.network_bar_router = network_bar_router = angular.copy(network_bar_router);

            $modalInstance.rendered.then(network_bar_routerForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = network_bar_routerForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(network_bar_router){

                if(!$("#Network_Bar_RouterForm").validate().form()){
                    return;
                }

                network_bar_router = ResourceTool.copy_only_data(network_bar_router);


                CommonHttpService.post("/api/network_bar_router/update/", network_bar_router).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        network_bar_router_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('network_bar_routerForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_routername: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_router/is-name-unique/",
                                    data: {
                                        network_bar_routername: $("#network_bar_routername").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_routername: {
                                remote: $i18next('network_bar_router.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Network_Bar_RouterForm', config);
                }
            }
        }]);
