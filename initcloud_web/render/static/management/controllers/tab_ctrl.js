/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('TabController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.tabs = [];
        var data =  _config.cabinet_show_index;
        $scope.data = data;
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.tabs);

        // $scope.tab_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Tab.query(function(data){
        //                 $scope.tabs = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.tabs);
        //             });
        //         }
        //     });
        //初始化创建tab数组
        // var $scope.table
        
        angular.forEach($('.hd>ul'),function(v,i){
            if(i == 0){
                $scope.tabs.push(true);
            }else{
               $scope.tabs.push(false); 
            }
        });
        //tab切换函数
         $scope.tab = function(index){
            angular.forEach($scope.tabs, function(i, v) {
              $scope.tabs[v] = false;
            });
            $scope.tabs[index] = true;
        }
        // pdu tab切换
        $scope.tab_pdu =  function(){
            angular.forEach($scope.tabs, function(i, v) {
              $scope.tabs[v] = false;
            }); 
            $scope.tabs[5] = true;
        }
        //根据id 查询显示(向父级传递)
        $scope.tabById = function(id,sect,$event,element,attr){
            $scope.$emit('to-parent-'+sect,id);
        }
        var deleteTabs = function(ids){

            $ngBootbox.confirm($i18next("tab.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/tab/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.tab_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteTabs(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Tab){
                    if(tab.checked){
                        ids.push(tab.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(tab){
            deleteTabs([tab.id]);
        };


        $scope.edit = function(tab){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'TabUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    tab_table: function () {
                        return $scope.tab_table;
                    },
                    tab: function(){return tab}
                }
            });
        };

        $scope.openNewTabModal = function(){
            $modal.open({
                templateUrl: 'new-tab.html',
                backdrop: "static",
                controller: 'NewTabController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.tab_table.reload();
            });
        };
    })


    .controller('NewTabController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, TabForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = TabForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.tab = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/tab/create/', $scope.tab).then(function(result){
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

   ).factory('TabForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            tabname: {
                                required: true,
                                remote: {
                                    url: "/api/tab/is-name-unique/",
                                    data: {
                                        tabname: $("#tabname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            tabname: {
                                remote: $i18next('tab.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#tabForm', config);
                }
            }
        }]).controller('TabUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 tab, tab_table,
                 Tab, UserDataCenter, tabForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.tab = tab = angular.copy(tab);

            $modalInstance.rendered.then(tabForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = tabForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(tab){

                if(!$("#TabForm").validate().form()){
                    return;
                }

                tab = ResourceTool.copy_only_data(tab);


                CommonHttpService.post("/api/tab/update/", tab).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        tab_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('tabForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            tabname: {
                                required: true,
                                remote: {
                                    url: "/api/tab/is-name-unique/",
                                    data: {
                                        tabname: $("#tabname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            tabname: {
                                remote: $i18next('tab.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#TabForm', config);
                }
            }
        }]);
