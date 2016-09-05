/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('MyappController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Myapp, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.myapps = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.myapps);

        $scope.myapp_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Myapp.query(function(data){
                        $scope.myapps = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.myapps);
                    });
                }
            });



        var deleteMyapps = function(ids){

            $ngBootbox.confirm($i18next("myapp.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/myapp/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.myapp_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteMyapps(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Myapp){
                    if(myapp.checked){
                        ids.push(myapp.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(myapp){
            deleteMyapps([myapp.id]);
        };


        $scope.edit = function(myapp){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'MyappUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    myapp_table: function () {
                        return $scope.myapp_table;
                    },
                    myapp: function(){return myapp}
                }
            });
        };

        $scope.openNewMyappModal = function(){
            $modal.open({
                templateUrl: 'new-myapp.html',
                backdrop: "static",
                controller: 'NewMyappController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.myapp_table.reload();
            });
        };
    })


    .controller('NewMyappController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, MyappForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = MyappForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.myapp = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/myapp/create/', $scope.myapp).then(function(result){
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

   ).factory('MyappForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            myappname: {
                                required: true,
                                remote: {
                                    url: "/api/myapp/is-name-unique/",
                                    data: {
                                        myappname: $("#myappname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            myappname: {
                                remote: $i18next('myapp.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#myappForm', config);
                }
            }
        }]).controller('MyappUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 myapp, myapp_table,
                 Myapp, UserDataCenter, myappForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.myapp = myapp = angular.copy(myapp);

            $modalInstance.rendered.then(myappForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = myappForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(myapp){

                if(!$("#MyappForm").validate().form()){
                    return;
                }

                myapp = ResourceTool.copy_only_data(myapp);


                CommonHttpService.post("/api/myapp/update/", myapp).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        myapp_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('myappForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            myappname: {
                                required: true,
                                remote: {
                                    url: "/api/myapp/is-name-unique/",
                                    data: {
                                        myappname: $("#myappname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            myappname: {
                                remote: $i18next('myapp.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#MyappForm', config);
                }
            }
        }]);
