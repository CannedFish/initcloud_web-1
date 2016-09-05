/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('TreeviewController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Treeview, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.treeviews = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.treeviews);

        $scope.treeview_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Treeview.query(function(data){
                        $scope.treeviews = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.treeviews);
                    });
                }
            });



        var deleteTreeviews = function(ids){

            $ngBootbox.confirm($i18next("treeview.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/treeview/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.treeview_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteTreeviews(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Treeview){
                    if(treeview.checked){
                        ids.push(treeview.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(treeview){
            deleteTreeviews([treeview.id]);
        };


        $scope.edit = function(treeview){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'TreeviewUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    treeview_table: function () {
                        return $scope.treeview_table;
                    },
                    treeview: function(){return treeview}
                }
            });
        };

        $scope.openNewTreeviewModal = function(){
            $modal.open({
                templateUrl: 'new-treeview.html',
                backdrop: "static",
                controller: 'NewTreeviewController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.treeview_table.reload();
            });
        };
    })


    .controller('NewTreeviewController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, TreeviewForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = TreeviewForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.treeview = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/treeview/create/', $scope.treeview).then(function(result){
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

   ).factory('TreeviewForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            treeviewname: {
                                required: true,
                                remote: {
                                    url: "/api/treeview/is-name-unique/",
                                    data: {
                                        treeviewname: $("#treeviewname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            treeviewname: {
                                remote: $i18next('treeview.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#treeviewForm', config);
                }
            }
        }]).controller('TreeviewUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 treeview, treeview_table,
                 Treeview, UserDataCenter, treeviewForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.treeview = treeview = angular.copy(treeview);

            $modalInstance.rendered.then(treeviewForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = treeviewForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(treeview){

                if(!$("#TreeviewForm").validate().form()){
                    return;
                }

                treeview = ResourceTool.copy_only_data(treeview);


                CommonHttpService.post("/api/treeview/update/", treeview).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        treeview_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('treeviewForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            treeviewname: {
                                required: true,
                                remote: {
                                    url: "/api/treeview/is-name-unique/",
                                    data: {
                                        treeviewname: $("#treeviewname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            treeviewname: {
                                remote: $i18next('treeview.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#TreeviewForm', config);
                }
            }
        }]);
