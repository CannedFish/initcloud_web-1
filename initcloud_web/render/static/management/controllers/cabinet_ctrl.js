/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('CabinetController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cabinet, CheckboxGroup, DataCenter,$timeout){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });
        $scope.cabinets = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cabinets);
        // 机柜数据信息:这个是机柜的控制逻辑 _config 是全局变量，这个controller可以取道 （console.log()）
        // 1. 24接口交换机(1)/ 48接口交换机(3) 24switchboard /48switchboard
        // 2. 每节点CPU温度:(有五组，一组四个节点，每个节点有两个cpu温度)  cpu_temperature  
        // 3.JBOD 90块盘运行状态 JBOD_status
        // 4.存储服务器20块盘 运行状态 memory_server_status 
         /* var status_arr = {'_24switchboard':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1], */
                          // '_48switchboard_01':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,
                                           // 1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,0
                          // ],
                          // '_48switchboard_02':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,
                                           // 1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,0
                          // ],
                          // '_48switchboard_03':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,1,
                                           // 1,0,1,1,0,1,1,0,0,0,1,1,1,1,0,0,1,0,1,0,1,1,1,0
                          // ],
                          // 'cpu_temperature':[
                               // {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                               // {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                               // {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                               // {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]}, 
                               // {'node1':[23,24],'node2':[23,25],'node3':[22,24],'node4':[23,25]},  
                          // ],
                          // 'jbod_status_01':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,1,
                                // 1,0,1,0,1,1,1,1,0,1,1,0,0,0,0,
                                // 1,0,1,0,1,1,0,1,1,0,1,1,0,0,1,
                                // 1,1,0,1,1,0,0,0,1,1,1,0,1,1,1,
                                // 1,1,0,1,1,0,0,0,1,1,0,1,0,1,0,
                                // 1,0,1,1,0,0,0,1,1,0,0,0,1,1,1
                            // ],
                          // 'jbod_status_02':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,1,
                                // 1,0,1,0,1,1,1,1,0,1,1,0,0,0,0,
                                // 1,0,1,0,1,1,0,1,1,0,1,1,0,0,1,
                                // 1,1,0,1,1,0,0,0,1,1,1,0,1,1,1,
                                // 1,1,0,1,1,0,0,0,1,1,0,1,0,1,0,
                                // 1,0,1,1,0,0,0,1,1,0,0,0,1,1,1
                            // ],
                          // 'memory_server_status_01':[1,0,1,1,0,1,1,0,0,0,1,1,1,1,1,1,0,1,1,0],
                          // 'memory_server_status_02':[1,0,1,0,0,1,1,0,1,1,0,1,1,0,0,0,1,1,1,1]
                    // }; 
            /* $scope.cabinets = status_arr; */
            //创建定时器
            function Timer() {
                ///<summary>Simple timer object created around a timeout.</summary>
                var t = this;
                t.id = null;
                t.busy = false;
                t.start = function (code, milliseconds) {
                    ///<summary>Starts the timer and waits the specified amount of <paramref name="milliseconds"/> before executing the supplied <paramref name="code"/>.</summary>
                    ///<param name="code">The code to execute once the timer runs out.</param>
                    ///<param name="milliseconds">The time in milliseconds to wait before executing the supplied <paramref name="code"/>.</param>

                    if (t.busy) {
                        return;
                    }
                    t.stop();
                    t.id = setInterval(function () {
                        code();
                        t.id = null;
                        t.busy = false;
                    }, milliseconds);
                    t.busy = true;
                };
                t.stop = function () {
                    ///<summary>Stops the timer if its runnning and resets it back to its starting state.</summary>

                    if (t.id !== null) {
                        clearTimeout(t.id);
                        t.id = null;
                        t.busy = false;
                    }
                };
            }
            var timer = new Timer();
            timer.start(function(){
                Cabinet.get(function(data) {
                    data.cabinet_type = _config.cabinet_show_index.cabinet_type;
                    $scope.cabinets = data;
                });
            },5000);
            Cabinet.get(function(data) {
              data.cabinet_type = _config.cabinet_show_index.cabinet_type;
              $scope.cabinets = data; //这个data就返回后台的shuju
            });
            // 根据配置文件决定机柜各部分显示
            
            checkboxGroup.syncObjects($scope.cabinets);
            
        var deleteCabinets = function(ids){

            $ngBootbox.confirm($i18next("cabinet.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cabinet/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cabinet_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCabinets(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cabinet){
                    if(cabinet.checked){
                        ids.push(cabinet.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cabinet){
            deleteCabinets([cabinet.id]);
        };


        $scope.edit = function(cabinet){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'CabinetUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cabinet_table: function () {
                        return $scope.cabinet_table;
                    },
                    cabinet: function(){return cabinet}
                }
            });
        };

        $scope.openNewCabinetModal = function(){
            $modal.open({
                templateUrl: 'new-cabinet.html',
                backdrop: "static",
                controller: 'NewCabinetController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cabinet_table.reload();
            });
        };
    })


    .controller('NewCabinetController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, CabinetForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = CabinetForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cabinet = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cabinet/create/', $scope.cabinet).then(function(result){
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

   ).factory('CabinetForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cabinetname: {
                                required: true,
                                remote: {
                                    url: "/api/cabinet/is-name-unique/",
                                    data: {
                                        cabinetname: $("#cabinetname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cabinetname: {
                                remote: $i18next('cabinet.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cabinetForm', config);
                }
            }
        }]).controller('CabinetUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cabinet, cabinet_table,
                 Cabinet, UserDataCenter, cabinetForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cabinet = cabinet = angular.copy(cabinet);

            $modalInstance.rendered.then(cabinetForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cabinetForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cabinet){

                if(!$("#CabinetForm").validate().form()){
                    return;
                }

                cabinet = ResourceTool.copy_only_data(cabinet);


                CommonHttpService.post("/api/cabinet/update/", cabinet).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cabinet_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cabinetForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cabinetname: {
                                required: true,
                                remote: {
                                    url: "/api/cabinet/is-name-unique/",
                                    data: {
                                        cabinetname: $("#cabinetname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cabinetname: {
                                remote: $i18next('cabinet.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#CabinetForm', config);
                }
            }
        }]);
