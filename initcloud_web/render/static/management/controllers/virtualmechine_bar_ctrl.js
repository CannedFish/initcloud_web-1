/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Virtualmechine_BarController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Virtualmechine_Bar, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.virtualmechine_bars = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.virtualmechine_bars);
        var cloud_data ={'total_kernel':'9999','total_memory':'2234','cloud_kernel':'1045','cloud_allocat_memory':'2545',
                'established_cloudmechine':'1098','running_cloudmechine':'2015','total_ypan':'2000','total_capacity':'4000',
                'storage':{'n':[30,70],'h':[40,60],'RAY':[50,50]},'empty_float_ip':'100','used_float_ip':'200','read':'2323',
                'write':'2243','cpu_loadbalance':'56%'
        };
        $scope.virtualmechine_bars = cloud_data;
        checkboxGroup.syncObjects($scope.virtualmechine_bars);
        // $scope.virtualmechine_bar_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Virtualmechine_Bar.query(function(data){
        //                 $scope.virtualmechine_bars = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.virtualmechine_bars);
        //             });
        //         }
        //     });



        var deleteVirtualmechine_Bars = function(ids){

            $ngBootbox.confirm($i18next("virtualmechine_bar.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/virtualmechine_bar/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.virtualmechine_bar_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteVirtualmechine_Bars(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Virtualmechine_Bar){
                    if(virtualmechine_bar.checked){
                        ids.push(virtualmechine_bar.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(virtualmechine_bar){
            deleteVirtualmechine_Bars([virtualmechine_bar.id]);
        };


        $scope.edit = function(virtualmechine_bar){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Virtualmechine_BarUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    virtualmechine_bar_table: function () {
                        return $scope.virtualmechine_bar_table;
                    },
                    virtualmechine_bar: function(){return virtualmechine_bar}
                }
            });
        };

        $scope.openNewVirtualmechine_BarModal = function(){
            $modal.open({
                templateUrl: 'new-virtualmechine_bar.html',
                backdrop: "static",
                controller: 'NewVirtualmechine_BarController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.virtualmechine_bar_table.reload();
            });
        };
    })


    .controller('NewVirtualmechine_BarController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Virtualmechine_BarForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Virtualmechine_BarForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.virtualmechine_bar = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/virtualmechine_bar/create/', $scope.virtualmechine_bar).then(function(result){
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

   ).factory('Virtualmechine_BarForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            virtualmechine_barname: {
                                required: true,
                                remote: {
                                    url: "/api/virtualmechine_bar/is-name-unique/",
                                    data: {
                                        virtualmechine_barname: $("#virtualmechine_barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            virtualmechine_barname: {
                                remote: $i18next('virtualmechine_bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#virtualmechine_barForm', config);
                }
            }
        }]).controller('Virtualmechine_BarUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 virtualmechine_bar, virtualmechine_bar_table,
                 Virtualmechine_Bar, UserDataCenter, virtualmechine_barForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.virtualmechine_bar = virtualmechine_bar = angular.copy(virtualmechine_bar);

            $modalInstance.rendered.then(virtualmechine_barForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = virtualmechine_barForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(virtualmechine_bar){

                if(!$("#Virtualmechine_BarForm").validate().form()){
                    return;
                }

                virtualmechine_bar = ResourceTool.copy_only_data(virtualmechine_bar);


                CommonHttpService.post("/api/virtualmechine_bar/update/", virtualmechine_bar).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        virtualmechine_bar_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('virtualmechine_barForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            virtualmechine_barname: {
                                required: true,
                                remote: {
                                    url: "/api/virtualmechine_bar/is-name-unique/",
                                    data: {
                                        virtualmechine_barname: $("#virtualmechine_barname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            virtualmechine_barname: {
                                remote: $i18next('virtualmechine_bar.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Virtualmechine_BarForm', config);
                }
            }
        }]);
