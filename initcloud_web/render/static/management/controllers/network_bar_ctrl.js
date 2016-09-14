/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Network_BarController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Network_Bar, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });
        $scope.network_bars = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_bars);
        //初始化假数据 上行数据包/下行数据包/上行流量/下行流量
        var data = {
        'updatapackage':[[60,10],[50,30],[40,25],[30,30],[20,50],[10,60],[0,0]],
        'downdatapackage':[[60,4],[50,45],[40,70],[30,55],[20,30],[10,35],[0,0]],
        'uprate':[[60,25],[50,5],[40,60],[30,45],[20,30],[10,38],[0,0]],
        'downrate':[[60,4],[50,45],[40,40],[30,55],[20,30],[10,55],[0,0]]
         }
        $scope.network_bars = data;
        checkboxGroup.syncObjects($scope.network_bars);
     //    $scope.network_bars = '';
     //    var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.network_bars);
	    // // Network_Bar.query(function(data){
     // //         $scope.network_bars = data[0];
     // //         checkboxGroup.syncObjects($scope.network_bars);
     // //    })
     // //     checkboxGroup.syncObjects($scope.network_bars);
     //     var data = [{
     //            'upuppacket':[[60,10],[50,30],[40,25],[30,30],[20,50],[10,60],[0,0]],
     //            'downpacket':[[60,4],[50,45],[40,70],[30,55],[20,30],[10,35],[0,0]],
     //            'uprate':[[60,25],[50,5],[40,60],[30,45],[20,30],[10,38],[0,0]],
     //            'downrate':[[60,4],[50,45],[40,40],[30,55],[20,30],[10,55],[0,0]]
     //         }]
     //    $scope.network_bars = data[0];
     //    checkboxGroup.syncObjects($scope.network_bars);
        // console.log($scope.network_bars)
        //非table 接口数据
        // $scope.network_bar_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Network_Bar.query(function(data){
        //                 $scope.network_bars = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.network_bars);
        //             });
        //         }
        //     });



        var deleteNetwork_Bars = function(ids){

            $ngBootbox.confirm($i18next("network_bar.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/network_bar/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.network_bar_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteNetwork_Bars(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Network_Bar){
                    if(network_bar.checked){
                        ids.push(network_bar.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(network_bar){
            deleteNetwork_Bars([network_bar.id]);
        };


        $scope.edit = function(network_bar){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Network_BarUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    network_bar_table: function () {
                        return $scope.network_bar_table;
                    },
                    network_bar: function(){return network_bar}
                }
            });
        };

        $scope.openNewNetwork_BarModal = function(){
            $modal.open({
                templateUrl: 'new-network_bar.html',
                backdrop: "static",
                controller: 'NewNetwork_BarController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.network_bar_table.reload();
            });
        };
    })


    .controller('NewNetwork_BarController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Network_BarForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Network_BarForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.network_bar = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/network_bar/create/', $scope.network_bar).then(function(result){
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

   ).factory('Network_BarForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_barname: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar/is-name-unique/",
                                    data: {
                                        network_barname: $("#network_barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_barname: {
                                remote: $i18next('network_bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#network_barForm', config);
                }
            }
        }]).controller('Network_BarUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 network_bar, network_bar_table,
                 Network_Bar, UserDataCenter, network_barForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.network_bar = network_bar = angular.copy(network_bar);

            $modalInstance.rendered.then(network_barForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = network_barForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(network_bar){

                if(!$("#Network_BarForm").validate().form()){
                    return;
                }

                network_bar = ResourceTool.copy_only_data(network_bar);


                CommonHttpService.post("/api/network_bar/update/", network_bar).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        network_bar_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('network_barForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            network_barname: {
                                required: true,
                                remote: {
                                    url: "/api/network_bar/is-name-unique/",
                                    data: {
                                        network_barname: $("#network_barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            network_barname: {
                                remote: $i18next('network_bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Network_BarForm', config);
                }
            }
        }]);
