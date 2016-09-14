/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Network_Bar_NetController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Network_Bar_Net, CheckboxGroup, DataCenter){
        
        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });
        
        $scope.network_bar_nets = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_bar_nets);
        //tree自定义内容
        var apple_selected, tree, treedata_avm, treedata_geography;
        $scope.my_tree_handler = function(branch) {
            var _ref;//递归层次
            $scope.output = "You selected: " + branch.label;
            if ((_ref = branch.data) != null ? _ref.description : void 0) {
                return $scope.output += '(' + branch.data.description + ')';
            }
        };
        apple_selected = function(branch) {
          return $scope.output = "APPLE! : " + branch.label;
        };

        Network_Bar_Net.get(function(data){
            $scope.my_data = data.list;
            $scope.$emit('to-parent-net', data.total);
            checkboxGroup.syncObjects($scope.my_data);
        })
        //初始化数据绑定--
        //网络监控树结构数据 
        // 网络->(总数,)
        // var treedata_network ={
        //     'datalist':[
        //         {   "data":{"description":"1,104"},
        //             "children":[
        //                 {
        //                     "data":{"num":11124875,"description":"1,104"},
        //                     "children":[
        //                         {
        //                             "data":{"description":"10444"},
        //                             "label":"子网络",
        //                             "children":[
        //                             {
        //                                 "data":{"num":"10444"},
        //                                 "label":"路由器",
        //                                 "children":[
        //                                     {
        //                                         "data":{"description":"10444"},
        //                                         "label":"路由器"
        //                                     },
        //                                     {
        //                                         "data":{"description":"10444"},
        //                                         "label":"路由器"
        //                                     }
        //                                 ]
        //                             }
        //                             ]
        //                         },
        //                         {
        //                             "data":{"description":"10445"},
        //                             "label":"子网络"
        //                         },
        //                         {
        //                             "data":{"description":"10446"},
        //                             "label":"子网络"
        //                         }
        //                     ],
        //                     "label":"子网络"
        //                 }
        //             ],
        //             "label":"网络"
        //         },
        //         {   "data":{"description":"1,104"},
        //             "children":[
        //                 {
        //                     "data":{"num":11124875,"description":"1,104"},
        //                     "children":[
        //                         {
        //                             "data":{"num":11124875,"description":"10444"},
        //                             "label":"路由器"
        //                         }
        //                     ],
        //                     "label":"子网络"
        //                 }
        //             ],
        //             "label":"网络"
        //         }
        //     ],
        //     'total':'1245445'
        // }   
        // $scope.my_data = treedata_network.datalist;
        // 网络总数:
        // $scope.$emit('to-parent',treedata_network.total);
        // $scope.network_total = treedata_network.total;
        $scope.tree_name = 'network_bar_net_treeview';
        $scope.try_changing_the_tree_data = function() {
                if($scope.my_data === treedata_avm) {
                    return $scope.my_data = treedata_geography;
                }else{
                    return $scope.my_data = treedata_avm;
              }
            };
            $scope.my_tree = tree = {};
            $scope.try_async_load = function() {
                $scope.my_data = [];
                $scope.doing_async = true;
                return $timeout(function() {
                    if (Math.random() < 0.5) {
                        $scope.my_data = treedata_avm;
                    }else{
                        $scope.my_data = treedata_geography;
                    }
                    $scope.doing_async = false;
                    return tree.expand_all();
                }, 1000);
            };
            return $scope.try_adding_a_branch = function() {
              var b;
              b = tree.get_selected_branch();
              return tree.add_branch(b, {
                label: 'New Branch',
                data: {
                  something: 42,
                  "else": 43
                }
              });
            };
        // $scope.network_bar_net_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Network_Bar_Net.query(function(data){
        //                 $scope.network_bar_nets = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.network_bar_nets);
        //             });
        //         }
        //     });



        var deleteNetwork_Bar_Nets = function(ids){

            $ngBootbox.confirm($i18next("network_bar_net.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/network_bar_net/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.network_bar_net_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteNetwork_Bar_Nets(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Network_Bar_Net){
                    if(network_bar_net.checked){
                        ids.push(network_bar_net.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(network_bar_net){
            deleteNetwork_Bar_Nets([network_bar_net.id]);
        };


        $scope.edit = function(network_bar_net){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Network_Bar_NetUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    network_bar_net_table: function () {
                        return $scope.network_bar_net_table;
                    },
                    network_bar_net: function(){return network_bar_net}
                }
            });
        };

        $scope.openNewNetwork_Bar_NetModal = function(){
            $modal.open({
                templateUrl: 'new-network_bar_net.html',
                backdrop: "static",
                controller: 'NewNetwork_Bar_NetController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.network_bar_net_table.reload();
            });
        };
    })


    .controller('NewNetwork_Bar_NetController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Network_Bar_NetForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Network_Bar_NetForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.network_bar_net = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/network_bar_net/create/', $scope.network_bar_net).then(function(result){
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

   ).factory('Network_Bar_NetForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_netname: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_net/is-name-unique/",
                                    data: {
                                        network_bar_netname: $("#network_bar_netname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_netname: {
                                remote: $i18next('network_bar_net.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#network_bar_netForm', config);
                }
            }
        }]).controller('Network_Bar_NetUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 network_bar_net, network_bar_net_table,
                 Network_Bar_Net, UserDataCenter, network_bar_netForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.network_bar_net = network_bar_net = angular.copy(network_bar_net);

            $modalInstance.rendered.then(network_bar_netForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = network_bar_netForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(network_bar_net){

                if(!$("#Network_Bar_NetForm").validate().form()){
                    return;
                }

                network_bar_net = ResourceTool.copy_only_data(network_bar_net);


                CommonHttpService.post("/api/network_bar_net/update/", network_bar_net).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        network_bar_net_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('network_bar_netForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_bar_netname: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar_net/is-name-unique/",
                                    data: {
                                        network_bar_netname: $("#network_bar_netname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_bar_netname: {
                                remote: $i18next('network_bar_net.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Network_Bar_NetForm', config);
                }
            }
        }]);
