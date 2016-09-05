/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('BbController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Bb, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.bbs = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.bbs);

        $scope.bb_table = new ngTableParams({
                page: 1,
                count: 10
            },{
                counts: [],
                getData: function($defer, params){
                    Bb.query(function(data){
                        $scope.bbs = ngTableHelper.paginate(data, $defer, params);
                        checkboxGroup.syncObjects($scope.bbs);
                    });
                }
            });



        var deleteBbs = function(ids){

            $ngBootbox.confirm($i18next("bb.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/bb/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.bb_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteBbs(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Bb){
                    if(bb.checked){
                        ids.push(bb.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(bb){
            deleteBbs([bb.id]);
        };


        $scope.edit = function(bb){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'BbUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    bb_table: function () {
                        return $scope.bb_table;
                    },
                    bb: function(){return bb}
                }
            });
        };

        $scope.openNewBbModal = function(){
            $modal.open({
                templateUrl: 'new-bb.html',
                backdrop: "static",
                controller: 'NewBbController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.bb_table.reload();
            });
        };
    })


    .controller('NewBbController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, BbForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = BbForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.bb = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/bb/create/', $scope.bb).then(function(result){
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

   ).factory('BbForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            bbname: {
                                required: true,
                                remote: {
                                    url: "/api/bb/is-name-unique/",
                                    data: {
                                        bbname: $("#bbname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            bbname: {
                                remote: $i18next('bb.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#bbForm', config);
                }
            }
        }]).controller('BbUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 bb, bb_table,
                 Bb, UserDataCenter, bbForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.bb = bb = angular.copy(bb);

            $modalInstance.rendered.then(bbForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = bbForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(bb){

                if(!$("#BbForm").validate().form()){
                    return;
                }

                bb = ResourceTool.copy_only_data(bb);


                CommonHttpService.post("/api/bb/update/", bb).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        bb_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('bbForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            bbname: {
                                required: true,
                                remote: {
                                    url: "/api/bb/is-name-unique/",
                                    data: {
                                        bbname: $("#bbname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            bbname: {
                                remote: $i18next('bb.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#BbForm', config);
                }
            }
        }]);
