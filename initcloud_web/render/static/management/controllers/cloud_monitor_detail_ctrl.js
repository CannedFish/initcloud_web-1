/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Cloud_Monitor_DetailController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cloud_Monitor_Detail, CheckboxGroup, DataCenter,urlParamsTrnasfer,cloud_id){

        $scope.$on('$viewContentLoaded', function(){
                Metronic.initAjax();
        });

        $scope.cloud_monitor_details = [];
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cloud_monitor_details);

        // $scope.cloud_monitor_detail_table = new ngTableParams({
        //         page: 1,
        //         count: 10
        //     },{
        //         counts: [],
        //         getData: function($defer, params){
        //             Cloud_Monitor_Detail.query(function(data){
        //                 $scope.cloud_monitor_details = ngTableHelper.paginate(data, $defer, params);
        //                 checkboxGroup.syncObjects($scope.cloud_monitor_details);
        //             });
        //         }
        //     });
        //接搜id 查找数据
        $scope.cloud_id = urlParamsTrnasfer.get();
	$scope.cloud_id2 = cloud_id;
	$scope.data1 = Cloud_Monitor_Detail.query({'cloud_id':$scope.cloud_id2})
        var id = urlParamsTrnasfer.get(); // 得到id的值
        console.log(id);
        CommonHttpService.post("/api/cloud_monitor_detail/query/", {id:id}).then(function(data){
            console.log(data);
            // if (data.success) {
            //     ToastrService.success(data.msg, $i18next("success"));
            //     $scope.cloud_monitor_detail_table.reload();
            //     checkboxGroup.uncheck()
            // } else {
            //     ToastrService.error(data.msg, $i18next("op_failed"));
            // }
        });

>>>>>>> 0a03eff5fd9be0ed9f75a68fcd78f47345e1305b
        // var data = 
        //     {
        //         'id':1,
        //         'cpu':{
        //             'usage':'10%',//利用率
        //             'speed':'0.80',
        //             'noraml_run_time':'0:02:31:08',
        //             'basic_frequency':'1.60',
        //             'logic_kernal':'4',
        //             'CPU_type':'E36608',
        //             'data':[]
        //         },
        //         'memory':{
        //             'using':'2.7',
        //             'surplus':'4.8',
        //             'memory_usage':'20%',
        //             'data':[]
        //         },
        //         'network':{
        //             'ADSL_UP':'223',
        //             'ADSL_DOWN':'225',
        //             'network_occupyrate':'56%',
        //             'data':[]
        //         },
        //         'cloud_disk':[
        //           {'name':'oa110.cn.com','read_speed':'234','write_speed':'235','volumn':'256'}, 
        //           {'name':'oa120.cn.com','read_speed':'234','write_speed':'235','volumn':'256'}, 
        //           {'name':'oa130.cn.com','read_speed':'234','write_speed':'235','volumn':'256'}, 
        //           {'name':'oa140.cn.com','read_speed':'234','write_speed':'235','volumn':'256'}, 
        //           {'name':'oa150.cn.com','read_speed':'234','write_speed':'235','volumn':'256'}, 
        //         ]
        //     };
        var data = {
                    'network_data': {
                        'hour_data': [
                            {
                                'ADSL_UP_DATA': [
                                    [
                                        0,
                                        100
                                    ],
                                    [
                                        1,
                                        4
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            },
                            {
                                'ADSL_DOWN_DATA': [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        6
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ]
                                ]
                            }
                        ],
                        'param_02': [
                            {
                                'hour': [
                                    'ADSL_DOWN',
                                    3
                                ]
                            },
                            {
                                'day': [
                                    'ADSL_DOWN',
                                    0
                                ]
                            }
                        ],
                        'type': 'network',
                        'day_data': [
                            {
                                'ADSL_UP_DATA': [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                'ADSL_DOWN_DATA': [
                                    [
                                        0,
                                        0
                                    ],
                                    [
                                        1,
                                        0
                                    ],
                                    [
                                        2,
                                        0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        'param_01': [
                            {
                                'hour': [
                                    'ADSL_UP',
                                    3
                                ]
                            },
                            {
                                'day': [
                                    'ADSL_UP',
                                    5
                                ]
                            }
                        ]
                    },
                    'host': 'localhost',
                    'disk_data': {
                        'hour_data': [
                            {
                                'read_data': [
                                    [
                                        0,
                                        0.0
                                    ],
                                    [
                                        1,
                                        0.5
                                    ],
                                    [
                                        2,
                                        0.7
                                    ],
                                    [
                                        3,
                                        0.0
                                    ],
                                    [
                                        4,
                                        0.0
                                    ],
                                    [
                                        5,
                                        0.0
                                    ]
                                ]
                            },
                            {
                                'write_data': [
                                    [
                                        0,
                                        0.9
                                    ],
                                    [
                                        1,
                                        0.0
                                    ],
                                    [
                                        2,
                                        0.0
                                    ],
                                    [
                                        3,
                                        10
                                    ],
                                    [
                                        4,
                                        0.0
                                    ],
                                    [
                                        5,
                                        0.0
                                    ]
                                ]
                            }
                        ],
                        'param_02': [
                            {
                                'hour': [
                                    'write_total',
                                    0.0
                                ]
                            },
                            {
                                'day': [
                                    'write_total',
                                    0.0
                                ]
                            }
                        ],
                        'type': 'disk',
                        'day_data': [
                            {
                                'read_data': [
                                    [
                                        0,
                                        0.0
                                    ],
                                    [
                                        1,
                                        0.0
                                    ],
                                    [
                                        2,
                                        0.0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            },
                            {
                                'write_data': [
                                    [
                                        0,
                                        0.0
                                    ],
                                    [
                                        1,
                                        0.0
                                    ],
                                    [
                                        2,
                                        0.0
                                    ],
                                    [
                                        3,
                                        0
                                    ],
                                    [
                                        4,
                                        0
                                    ],
                                    [
                                        5,
                                        0
                                    ],
                                    [
                                        6,
                                        0
                                    ],
                                    [
                                        7,
                                        0
                                    ],
                                    [
                                        8,
                                        0
                                    ],
                                    [
                                        9,
                                        0
                                    ],
                                    [
                                        10,
                                        0
                                    ],
                                    [
                                        11,
                                        0
                                    ],
                                    [
                                        12,
                                        0
                                    ],
                                    [
                                        13,
                                        0
                                    ],
                                    [
                                        14,
                                        0
                                    ],
                                    [
                                        15,
                                        0
                                    ],
                                    [
                                        16,
                                        0
                                    ],
                                    [
                                        17,
                                        0
                                    ],
                                    [
                                        18,
                                        0
                                    ],
                                    [
                                        19,
                                        0
                                    ],
                                    [
                                        20,
                                        0
                                    ],
                                    [
                                        21,
                                        0
                                    ],
                                    [
                                        22,
                                        0
                                    ],
                                    [
                                        23,
                                        0
                                    ]
                                ]
                            }
                        ],
                        'param_01': [
                            {
                                'hour': [
                                    'read_total',
                                    1.0
                                ]
                            },
                            {
                                'day': [
                                    'read_total',
                                    0.0
                                ]
                            }
                        ]
                    },
                    'cloud_id':'6baa642f-529c-4e99-813b-5464b05d5436',
                    'cpu_data': {
                        'hour_data': [
                            [
                                0,
                                4.209433560522372
                            ],
                            [
                                1,
                                4.38185458324851
                            ],
                            [
                                2,
                                7.2093578980613175
                            ],
                            [
                                3,
                                4.413223488200711
                            ],
                            [
                                4,
                                4.323602391110132
                            ],
                            [
                                5,
                                4.20569360234738
                            ]
                        ],
                        'param_02': [
                            'frequency',
                            '3.4Chz'
                        ],
                        'type': 'CPU',
                        'day_data': [
                            [
                                0,
                                4.209433560522372
                            ],
                            [
                                1,
                                4.4283380716550695
                            ],
                            [
                                2,
                                4.432319924138686
                            ],
                            [
                                3,
                                0
                            ],
                            [
                                4,
                                0
                            ],
                            [
                                5,
                                0
                            ],
                            [
                                6,
                                0
                            ],
                            [
                                7,
                                0
                            ],
                            [
                                8,
                                0
                            ],
                            [
                                9,
                                0
                            ],
                            [
                                10,
                                0
                            ],
                            [
                                11,
                                0
                            ],
                            [
                                12,
                                0
                            ],
                            [
                                13,
                                0
                            ],
                            [
                                14,
                                0
                            ],
                            [
                                15,
                                0
                            ],
                            [
                                16,
                                0
                            ],
                            [
                                17,
                                0
                            ],
                            [
                                18,
                                0
                            ],
                            [
                                19,
                                0
                            ],
                            [
                                20,
                                0
                            ],
                            [
                                21,
                                0
                            ],
                            [
                                22,
                                0
                            ],
                            [
                                23,
                                0
                            ]
                        ],
                        'param_01': [
                            'kernal_nums',
                            '4'
                        ]
                    }
                }
        $scope.cloud_monitor_details = data;
         //ng-repeat 渲染完执行脚本
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
             $('.disk_table tr th').removeClass('footable-sortable');
             $('.footable-sort-indicator').remove();
             $('.pagination li.footable-page').css('display','none');
             angular.forEach($('.pagination li.footable-page-arrow'),function(t){
                if($(t).index() == 0 || $(t).index() == 6)
                {
                    $(t).css({'display':'none','border':'solid 1px #ff0000'});
                }else if($(t).index() == 1){
                    $(t).find('a').text('上一页').css({'background':'transparent','border':'solid 1px #0077bc','height':'28px;','marginRight':'10px'});
                }else if($(t).index() == 5){
                     $(t).find('a').text('下一页').css({'background':'transparent','border':'solid 1px #0077bc','height':'28px;'});
                }
             });
        })
        var deleteCloud_Monitor_Details = function(ids){

            $ngBootbox.confirm($i18next("cloud_monitor_detail.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cloud_monitor_detail/batch-delete/", {ids:ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cloud_monitor_detail_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCloud_Monitor_Details(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cloud_Monitor_Detail){
                    if(cloud_monitor_detail.checked){
                        ids.push(cloud_monitor_detail.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cloud_monitor_detail){
            deleteCloud_Monitor_Details([cloud_monitor_detail.id]);
        };


        $scope.edit = function(cloud_monitor_detail){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Cloud_Monitor_DetailUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cloud_monitor_detail_table: function () {
                        return $scope.cloud_monitor_detail_table;
                    },
                    cloud_monitor_detail: function(){return cloud_monitor_detail}
                }
            });
        };

        $scope.openNewCloud_Monitor_DetailModal = function(){
            $modal.open({
                templateUrl: 'new-cloud_monitor_detail.html',
                backdrop: "static",
                controller: 'NewCloud_Monitor_DetailController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cloud_monitor_detail_table.reload();
            });
        };
    })


    .controller('NewCloud_Monitor_DetailController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Cloud_Monitor_DetailForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Cloud_Monitor_DetailForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cloud_monitor_detail = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cloud_monitor_detail/create/', $scope.cloud_monitor_detail).then(function(result){
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

   ).factory('Cloud_Monitor_DetailForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitor_detailname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor_detail/is-name-unique/",
                                    data: {
                                        cloud_monitor_detailname: $("#cloud_monitor_detailname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitor_detailname: {
                                remote: $i18next('cloud_monitor_detail.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cloud_monitor_detailForm', config);
                }
            }
        }]).controller('Cloud_Monitor_DetailUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cloud_monitor_detail, cloud_monitor_detail_table,
                 Cloud_Monitor_Detail, UserDataCenter, cloud_monitor_detailForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cloud_monitor_detail = cloud_monitor_detail = angular.copy(cloud_monitor_detail);

            $modalInstance.rendered.then(cloud_monitor_detailForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cloud_monitor_detailForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cloud_monitor_detail){

                if(!$("#Cloud_Monitor_DetailForm").validate().form()){
                    return;
                }

                cloud_monitor_detail = ResourceTool.copy_only_data(cloud_monitor_detail);


                CommonHttpService.post("/api/cloud_monitor_detail/update/", cloud_monitor_detail).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cloud_monitor_detail_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cloud_monitor_detailForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitor_detailname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor_detail/is-name-unique/",
                                    data: {
                                        cloud_monitor_detailname: $("#cloud_monitor_detailname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitor_detailname: {
                                remote: $i18next('cloud_monitor_detail.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Cloud_Monitor_DetailForm', config);
                }
            }
        }]);
