/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('LoginController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Login, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.logins = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.logins);

        $scope.login_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Login.query(function(data){
                        $scope.logins = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.logins);
                    });
                }
            });



        var deleteLogins = function(ids){

            $ngBootbox.confirm($i18next("login.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/login/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.login_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteLogins(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Login){
                    if(login.checked){
                        ids.push(login.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(login){
            deleteLogins([login.id]);
        };


        $scope.edit = function(login){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'LoginUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    login_table: function () {
                        return $scope.login_table;
                    },
                    login: function(){return login}
                }
            });
        };

        $scope.openNewLoginModal = function(){
            $modal.open({
                templateUrl: 'new-login.html',
                backdrop: "static",
                controller: 'NewLoginController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.login_table.reload();
            });
        };
    })


    .controller('NewLoginController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, LoginForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = LoginForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.login = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/login/create/', $scope.login).then(function(result){
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

   ).factory('LoginForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            loginname: {
                                required: true,
                                remote: {
                                    url: "/api/login/is-name-unique/",
                                    data: {
                                        loginname: $("#loginname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            loginname: {
                                remote: $i18next('login.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#loginForm', config);
                }
            }
        }]).controller('LoginUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 login, login_table,
                 Login, UserDataCenter, loginForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.login = login = angular.copy(login);

            $modalInstance.rendered.then(loginForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = loginForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(login){

                if(!$("#LoginForm").validate().form()){
                    return;
                }

                login = ResourceTool.copy_only_data(login);


                CommonHttpService.post("/api/login/update/", login).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        login_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('loginForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            loginname: {
                                required: true,
                                remote: {
                                    url: "/api/login/is-name-unique/",
                                    data: {
                                        loginname: $("#loginname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            loginname: {
                                remote: $i18next('login.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#LoginForm', config);
                }
            }
        }]);
