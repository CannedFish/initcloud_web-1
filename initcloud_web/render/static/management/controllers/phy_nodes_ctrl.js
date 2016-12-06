/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_NodesController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Nodes, CheckboxGroup, DataCenter,custimer,global_custimer){
        
        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });
        var timer = new global_custimer();
        timer.start(function(){
            Phy_Nodes.query(function(data){
            	// 如果有SBB 传递数据加标示位
                data.datatype = _config.storage_monitor.SBB;
	        	if(data.datatype == "1"){
	        		// 模拟数据
			        var _data = {
			            'updatapackage':[[24,5],[23,50],[18,40],[12,30],[8,20],[10,10],[0,0]],
			        	'downdatapackage':[[24,8],[23,45],[18,70],[12,55],[8,30],[10,35],[0,0]],
			        };
	        	}else if(data.datatype.SBB == "0"){
	        		_data = data;
	        	}
                $scope.phy_nodess = _data;
                checkboxGroup.syncObjects($scope.phy_nodess);
            });
        },5000);
        $scope.phy_nodess = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_nodess);
        Phy_Nodes.query(function(data){
        	// 如果有SBB 传递数据加标示位
        	data.datatype = _config.storage_monitor.SBB;
        	if(data.datatype == "1"){
        		// 模拟数据
		        var _data = {
		            'updatapackage':[[-24,5],[-23,50],[-18,40],[-12,30],[-8,20],[-4,10],[-2,35],[-0,0]],
			        'downdatapackage':[[-24,8],[-23,45],[-18,70],[-12,55],[-8,30],[-4,35],[-2,60],[0,0]],
			        'datatype':'IO',
		         
		        };
        	}else if(data.datatype == "0"){
        		_data = data;
        	}
            $scope.phy_nodess = _data;
            checkboxGroup.syncObjects($scope.phy_nodess);
        });
        // $scope.phy_nodes_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Phy_Nodes.query(function(data){
        //                 $scope.phy_nodess = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.phy_nodess);
        //             });
        //         }
        //     });



        var deletePhy_Nodess = function(ids){

            $ngBootbox.confirm($i18next("phy_nodes.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_nodes/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_nodes_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Nodess(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Nodes){
                    if(phy_nodes.checked){
                        ids.push(phy_nodes.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_nodes){
            deletePhy_Nodess([phy_nodes.id]);
        };


        $scope.edit = function(phy_nodes){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_NodesUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_nodes_table: function () {
                        return $scope.phy_nodes_table;
                    },
                    phy_nodes: function(){return phy_nodes}
                }
            });
        };

        $scope.openNewPhy_NodesModal = function(){
            $modal.open({
                templateUrl: 'new-phy_nodes.html',
                backdrop: "static",
                controller: 'NewPhy_NodesController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_nodes_table.reload();
            });
        };
    })


    .controller('NewPhy_NodesController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_NodesForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_NodesForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_nodes = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_nodes/create/', $scope.phy_nodes).then(function(result){
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

   ).factory('Phy_NodesForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_nodesname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_nodes/is-name-unique/",
                                    data: {
                                        phy_nodesname: $("#phy_nodesname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_nodesname: {
                                remote: $i18next('phy_nodes.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_nodesForm', config);
                }
            }
        }]).controller('Phy_NodesUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_nodes, phy_nodes_table,
                 Phy_Nodes, UserDataCenter, phy_nodesForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_nodes = phy_nodes = angular.copy(phy_nodes);

            $modalInstance.rendered.then(phy_nodesForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_nodesForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_nodes){

                if(!$("#Phy_NodesForm").validate().form()){
                    return;
                }

                phy_nodes = ResourceTool.copy_only_data(phy_nodes);


                CommonHttpService.post("/api/phy_nodes/update/", phy_nodes).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_nodes_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_nodesForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_nodesname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_nodes/is-name-unique/",
                                    data: {
                                        phy_nodesname: $("#phy_nodesname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_nodesname: {
                                remote: $i18next('phy_nodes.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_NodesForm', config);
                }
            }
        }]);
