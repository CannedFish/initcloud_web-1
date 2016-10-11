/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Phy_Monitor_PduController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Phy_Monitor_Pdu, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.phy_monitor_pdus = [];
        //pdu 监控
        // $scope.phy_monitor_pdus =
        // {
            // 'PDU1':{
                // 'currentdata':[123.12,45.12,258.12],
                // 'data':{
                    // 'voltdata':[[0,4.81],[1,7.31],[2,6.55],[3,2.15],[4,3.76]],
                    // 'currentdata':[[0,4.81],[1,7.31],[2,7.55],[3,6.35],[4,3.76]],
                    // 'wattdata':[[0,4.81],[1,7.31],[2,6.55],[3,2.15],[4,3.76]]
                // }
            // },
            // 'PDU2':{
                // 'currentdata':[124.12,46.12,259.12],
                // 'data':{
                    // 'voltdata':[[0,4.81],[1,7.31],[2,6.55],[3,5.15],[4,3.76]],
                    // 'currentdata':[[0,2.81],[1,7.31],[2,2.55],[3,4.15],[4,4.76]],
                    // 'wattdata':[[0,1.81],[1,7.38],[2,8.55],[3,2.15],[4,5.16]]
                // }
            // },
        // }
        Phy_Monitor_Pdu.get(function(data) {
          $scope.phy_monitor_pdus = data;
          console.log($scope.phy_monitor_pdus);
        });
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.phy_monitor_pdus);
        var deletePhy_Monitor_Pdus = function(ids){

            $ngBootbox.confirm($i18next("phy_monitor_pdu.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/phy_monitor_pdu/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.phy_monitor_pdu_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deletePhy_Monitor_Pdus(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Phy_Monitor_Pdu){
                    if(phy_monitor_pdu.checked){
                        ids.push(phy_monitor_pdu.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(phy_monitor_pdu){
            deletePhy_Monitor_Pdus([phy_monitor_pdu.id]);
        };


        $scope.edit = function(phy_monitor_pdu){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Phy_Monitor_PduUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    phy_monitor_pdu_table: function () {
                        return $scope.phy_monitor_pdu_table;
                    },
                    phy_monitor_pdu: function(){return phy_monitor_pdu}
                }
            });
        };

        $scope.openNewPhy_Monitor_PduModal = function(){
            $modal.open({
                templateUrl: 'new-phy_monitor_pdu.html',
                backdrop: "static",
                controller: 'NewPhy_Monitor_PduController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.phy_monitor_pdu_table.reload();
            });
        };
    })


    .controller('NewPhy_Monitor_PduController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Phy_Monitor_PduForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Phy_Monitor_PduForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.phy_monitor_pdu = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/phy_monitor_pdu/create/', $scope.phy_monitor_pdu).then(function(result){
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

   ).factory('Phy_Monitor_PduForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_pduname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_pdu/is-name-unique/",
                                    data: {
                                        phy_monitor_pduname: $("#phy_monitor_pduname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_pduname: {
                                remote: $i18next('phy_monitor_pdu.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#phy_monitor_pduForm', config);
                }
            }
        }]).controller('Phy_Monitor_PduUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 phy_monitor_pdu, phy_monitor_pdu_table,
                 Phy_Monitor_Pdu, UserDataCenter, phy_monitor_pduForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.phy_monitor_pdu = phy_monitor_pdu = angular.copy(phy_monitor_pdu);

            $modalInstance.rendered.then(phy_monitor_pduForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = phy_monitor_pduForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(phy_monitor_pdu){

                if(!$("#Phy_Monitor_PduForm").validate().form()){
                    return;
                }

                phy_monitor_pdu = ResourceTool.copy_only_data(phy_monitor_pdu);


                CommonHttpService.post("/api/phy_monitor_pdu/update/", phy_monitor_pdu).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        phy_monitor_pdu_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('phy_monitor_pduForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            phy_monitor_pduname: {
                                required: true,
                                remote: {
                                    url: "/api/phy_monitor_pdu/is-name-unique/",
                                    data: {
                                        phy_monitor_pduname: $("#phy_monitor_pduname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            phy_monitor_pduname: {
                                remote: $i18next('phy_monitor_pdu.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Phy_Monitor_PduForm', config);
                }
            }
        }]);
