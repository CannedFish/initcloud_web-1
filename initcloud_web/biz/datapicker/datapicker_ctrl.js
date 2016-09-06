/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('DatapickerController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Datapicker, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.datapickers = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.datapickers);

        $scope.datapicker_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Datapicker.query(function(data){
                        $scope.datapickers = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.datapickers);
                    });
                }
            });



        var deleteDatapickers = function(ids){

            $ngBootbox.confirm($i18next("datapicker.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/datapicker/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.datapicker_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteDatapickers(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Datapicker){
                    if(datapicker.checked){
                        ids.push(datapicker.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(datapicker){
            deleteDatapickers([datapicker.id]);
        };


        $scope.edit = function(datapicker){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'DatapickerUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    datapicker_table: function () {
                        return $scope.datapicker_table;
                    },
                    datapicker: function(){return datapicker}
                }
            });
        };

        $scope.openNewDatapickerModal = function(){
            $modal.open({
                templateUrl: 'new-datapicker.html',
                backdrop: "static",
                controller: 'NewDatapickerController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.datapicker_table.reload();
            });
        };
    })


    .controller('NewDatapickerController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, DatapickerForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = DatapickerForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.datapicker = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/datapicker/create/', $scope.datapicker).then(function(result){
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

   ).factory('DatapickerForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            datapickername: {
                                required: true,
                                remote: {
                                    url: "/api/datapicker/is-name-unique/",
                                    data: {
                                        datapickername: $("#datapickername").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            datapickername: {
                                remote: $i18next('datapicker.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#datapickerForm', config);
                }
            }
        }]).controller('DatapickerUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 datapicker, datapicker_table,
                 Datapicker, UserDataCenter, datapickerForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.datapicker = datapicker = angular.copy(datapicker);

            $modalInstance.rendered.then(datapickerForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = datapickerForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(datapicker){

                if(!$("#DatapickerForm").validate().form()){
                    return;
                }

                datapicker = ResourceTool.copy_only_data(datapicker);


                CommonHttpService.post("/api/datapicker/update/", datapicker).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        datapicker_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('datapickerForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            datapickername: {
                                required: true,
                                remote: {
                                    url: "/api/datapicker/is-name-unique/",
                                    data: {
                                        datapickername: $("#datapickername").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            datapickername: {
                                remote: $i18next('datapicker.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#DatapickerForm', config);
                }
            }
        }]);
