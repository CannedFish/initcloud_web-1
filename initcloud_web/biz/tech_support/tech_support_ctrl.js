/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Tech_SupportController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Tech_Support, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.tech_supports = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.tech_supports);

        $scope.tech_support_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Tech_Support.query(function(data){
                        $scope.tech_supports = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.tech_supports);
                    });
                }
            });



        var deleteTech_Supports = function(ids){

            $ngBootbox.confirm($i18next("tech_support.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/tech_support/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.tech_support_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteTech_Supports(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Tech_Support){
                    if(tech_support.checked){
                        ids.push(tech_support.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(tech_support){
            deleteTech_Supports([tech_support.id]);
        };


        $scope.edit = function(tech_support){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Tech_SupportUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    tech_support_table: function () {
                        return $scope.tech_support_table;
                    },
                    tech_support: function(){return tech_support}
                }
            });
        };

        $scope.openNewTech_SupportModal = function(){
            $modal.open({
                templateUrl: 'new-tech_support.html',
                backdrop: "static",
                controller: 'NewTech_SupportController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.tech_support_table.reload();
            });
        };
    })


    .controller('NewTech_SupportController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Tech_SupportForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Tech_SupportForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.tech_support = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/tech_support/create/', $scope.tech_support).then(function(result){
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

   ).factory('Tech_SupportForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            tech_supportname: {
                                required: true,
                                remote: {
                                    url: "/api/tech_support/is-name-unique/",
                                    data: {
                                        tech_supportname: $("#tech_supportname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            tech_supportname: {
                                remote: $i18next('tech_support.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#tech_supportForm', config);
                }
            }
        }]).controller('Tech_SupportUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 tech_support, tech_support_table,
                 Tech_Support, UserDataCenter, tech_supportForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.tech_support = tech_support = angular.copy(tech_support);

            $modalInstance.rendered.then(tech_supportForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = tech_supportForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(tech_support){

                if(!$("#Tech_SupportForm").validate().form()){
                    return;
                }

                tech_support = ResourceTool.copy_only_data(tech_support);


                CommonHttpService.post("/api/tech_support/update/", tech_support).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        tech_support_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('tech_supportForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            tech_supportname: {
                                required: true,
                                remote: {
                                    url: "/api/tech_support/is-name-unique/",
                                    data: {
                                        tech_supportname: $("#tech_supportname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            tech_supportname: {
                                remote: $i18next('tech_support.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Tech_SupportForm', config);
                }
            }
        }]);
