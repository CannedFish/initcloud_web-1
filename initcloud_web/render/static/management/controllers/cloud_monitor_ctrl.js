/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Cloud_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cloud_Monitor, CheckboxGroup, DataCenter){

        $scope.$on('$viewContentLoaded', function(){
            Metronic.initAjax();
            
        });
       
        $scope.cloud_monitors = [];
        $scope.data1 = Cloud_Monitor.query()
        var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.cloud_monitors);
        //初始化数据
        var _data = {
          "oa1.surdoc.com":[
                [
                    {
                      "type" : "CPU",
                      "param_01":["kernal_nums","6核"],
                      "param_02":["frequency","3.4Chz"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "内存",
                      "param_01":["memory_size","7.9GB"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "云盘",
                      "param_01":["write_totol","6MB/s"],
                      "param_02":["read_total","3MB/s"],
                      "data":[{'read_data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'write_data':[[0,9],[1,15],[2,2],[3,5],[4,2],[5,5],[6,12],[7,6.5],[8,8],[9,7]]}]
                    },
                    {
                      "type" : "网络",
                      "param_01":["ADSL_UP","上行223MB/s"],
                      "param_02":["ADSL_DOWN","下行223MB/s"],
                       "data":[{'ADSL_UP_DATA':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'ADSL_DOWN_DATA':[[0,1],[1,2],[2,15],[3,6],[4,7],[5,10],[6,13],[7,16],[8,1],[9,15]]}]
                    }
                ],
                [
                    {'run_time' : '30 : 20 :10'},
                    {'stop_time' : '30 : 40 :50'}
                ]
            ],
            "oa2.surdoc.com":[
                [
                    {
                      "type" : "CPU",
                      "param_01":["kernal_nums","24核"],
                      "param_02":["frequency","3.4Chz"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "内存",
                      "param_01":["memory_size","18GB"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "云盘",
                      "param_01":["write_totol","15MB/s"],
                      "param_02":["read_total","3MB/s"],
                      "data":[{'read_data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'write_data':[[0,9],[1,15],[2,2],[3,5],[4,2],[5,5],[6,12],[7,6.5],[8,8],[9,7]]}]
                    },
                    {
                      "type" : "网络",
                      "param_01":["ADSL_UP","上行223MB/s"],
                      "param_02":["ADSL_DOWN","下行223MB/s"],
                      "data":[{'ADSL_UP_DATA':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'ADSL_DOWN_DATA':[[0,1],[1,2],[2,15],[3,6],[4,7],[5,10],[6,13],[7,16],[8,1],[9,15]]}]
                    }
                ],
                [
                    {'run_time' : '30 : 20 :10'},
                    {'stop_time' : '30 : 40 :50'}
                ]
            ],
            "shushengioa3.surdoc":[
                [
                    {
                      "type" : "CPU",
                      "param_01":["kernal_nums","20核"],
                      "param_02":["frequency","3.4Chz"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "内存",
                      "param_01":["memory_size","20GB"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "云盘",
                      "param_01":["write_totol","17MB/s"],
                      "param_02":["read_total","3MB/s"],
                      "data":[{'read_data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'write_data':[[0,9],[1,15],[2,2],[3,5],[4,2],[5,5],[6,12],[7,6.5],[8,8],[9,7]]}]
                    },
                    {
                      "type" : "网络",
                      "param_01":["ADSL_UP","上行223MB/s"],
                      "param_02":["ADSL_DOWN","下行223MB/s"],
                      "data":[{'ADSL_UP_DATA':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'ADSL_DOWN_DATA':[[0,1],[1,2],[2,15],[3,6],[4,7],[5,10],[6,13],[7,16],[8,1],[9,15]]}]
                    }
                ],
                [
                    {'run_time' : '30 : 20 :10'},
                    {'stop_time' : '30 : 40 :50'}
                ]
            ],
            "oa4.surdoc.com":[
                [
                     {
                      "type" : "CPU",
                      "param_01":["kernal_nums","16核"],
                      "param_02":["frequency","3.4Chz"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "内存",
                      "param_01":["memory_size","16GB"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "云盘",
                      "param_01":["write_totol","18MB/s"],
                      "param_02":["read_total","3MB/s"],
                      "data":[{'read_data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'write_data':[[0,9],[1,15],[2,2],[3,5],[4,2],[5,5],[6,12],[7,6.5],[8,8],[9,7]]}]
                    },
                    {
                      "type" : "网络",
                      "param_01":["ADSL_UP","上行223MB/s"],
                      "param_02":["ADSL_DOWN","下行223MB/s"],
                       "data":[{'ADSL_UP_DATA':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'ADSL_DOWN_DATA':[[0,1],[1,2],[2,15],[3,6],[4,7],[5,10],[6,13],[7,16],[8,1],[9,15]]}]
                    }
                ],
                [
                    {'run_time' : '30 : 20 :10'},
                    {'stop_time' : '30 : 40 :50'}
                ]
            ],
            "oa5.surdoc.com":[
                [
                     {
                      "type" : "CPU",
                      "param_01":["kernal_nums","8核"],
                      "param_02":["frequency","3.4Chz"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "内存",
                      "param_01":["memory_size","10GB"],
                      'data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]
                    },
                    {
                      "type" : "云盘",
                      "param_01":["write_totol","12MB/s"],
                      "param_02":["read_total","3MB/s"],
                      "data":[{'read_data':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'write_data':[[0,9],[1,15],[2,2],[3,5],[4,2],[5,5],[6,12],[7,6.5],[8,8],[9,7]]}]
                    },
                    {
                      "type" : "网络",
                      "param_01":["ADSL_UP","上行223MB/s"],
                      "param_02":["ADSL_DOWN","下行223MB/s"],
                       "data":[{'ADSL_UP_DATA':[[0,7],[1,6.5],[2,12.5],[3,7],[4,9],[5,6],[6,11],[7,6.5],[8,8],[9,7]]},
                              {'ADSL_DOWN_DATA':[[0,1],[1,2],[2,15],[3,6],[4,7],[5,10],[6,13],[7,16],[8,1],[9,15]]}]
                    }
                ],
                [
                    {'run_time' : '30 : 20 :10'},
                    {'stop_time' : '30 : 40 :50'}
                ]
            ]
        };
        var plot_style = {
            colors: ['#23b7e5', '#7266ba'],
            series: { shadowSize: 3 },
            xaxis:{ font: { color: '#a1a7ac' },ticks:[]},
            yaxis:{ font: { color: '#a1a7ac' }, max:20,ticks:[]},
            grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#dce5ec' },
            tooltip: false,
            tooltipOpts: { content: 'Visits of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 0, y: 0 } }
        };
        var data_style = {
           show:'showSpline, tension: 0.4, lineWidth: 1, fill: 0.8',
           lines: { show: true, fill: true, fillColor: { colors: [{ opacity: 0.1 }, { opacity: 0.1}]}}
        };
        $scope.cloud_monitors = _data;//数据
        $scope.data_style = data_style;//数据样式 
        $scope.plot_style = plot_style;//图标样式
        // checkboxGroup.syncObjects($scope.cloud_monitors);
         // console.log($scope);
        //ng-repeat 渲染完执行脚本
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
             $scope.table_page();
        })
        // 分页函数
        $scope.table_page = function(){
           
            var show_page = 3;
            var totalitem = $('.content .pageitem').length;
            var current_page=1;//当前页
            var page_num=Math.ceil(totalitem/show_page);//总页数
            // alert(page_num);
            var current_num=0;//用于生成页标的计数器 
            var li = "";//页标元素
            //循环生成页标元素
            while(page_num>current_num){
                li+='<li class="page_num"><a href="javasctip:#">'+(current_num+1)+'</a></li>';
                current_num++;
            }
            $('.content .pageitem').css('display', 'none');//设置隐藏
            $('.content .pageitem').slice(0, show_page).css('display', '');//设置显示
            // // 添加页标到页面
            $('#page_num_all').html(li);
            //显示当前页
            $("#current_page").html(" "+current_page+" ");//显示当前页
            $("#page_all").html(" "+page_num+" ");//显示总页数
            //点击上一页
            $('#previous').click(function(){
                var new_page = parseInt($('#current_page').text()) - 1; 
                // alert(new_page);
                if(new_page>0)
                {
                     $("#current_page").html(" "+new_page+" "); 
                     tab_page(new_page);//切换新页
                }
               return false;
            });
            //点击下一页
            $("#next").click(function(){//下一页
                var new_page=parseInt($("#current_page").text())+1;//当前页标
                if(new_page<=page_num){//判断是否为最后或第一页
                    $("#current_page").html(" "+new_page+" ");
                tab_page(new_page);
                }
            });
            //页面跳转
            $(".page_num").click(function(){//页标跳转
                var new_page=parseInt($(this).text());
                tab_page(new_page);
            });
            //切换页面
            function tab_page(index){
                var start=(index-1)*show_page;//开始截取的页标
                var end=start+show_page;//截取个数
                $('.content .pageitem').css('display','none').slice(start, end).css({'display':''});
                current_page=index;
                $("#current_page").html(" "+current_page+" ");
            }
        }
        //指定列查询
        $scope.selected_1 = '';
        $scope.selected_2 = '';
        $scope.sel = function(){
             //请求后台排序
            CommonHttpService.post("../static/locales/cloud_monitor/cloud_monitor_query.json",{"phymechine":$scope.selected_1,"time_range":$scope.selected_2})
            .then(function(data){
                if (data) {
                    if($scope.selected_1 == "oa2.surdoc.com" && $scope.selected_2 ==""){
                        $scope.cloud_monitors = data[$scope.selected_1];
                    }else if($scope.selected_1 == "" && $scope.selected_2 =="一周内" )
                    {
                         $scope.cloud_monitors = data[$scope.selected_2];
                    }else if($scope.selected_1 == "oa4.surdoc.com" && $scope.selected_2 =="一周内")
                    {
                        $scope.cloud_monitors = data[$scope.selected_1+$scope.selected_2];
                    }
                    else{
                        $scope.cloud_monitors = _data;
                    }
                } else {
                    ToastrService.error(data.msg, $i18next("op_failed"));
                    alert('请求失败');
                }
            });
        }
        
        //filter过滤查询函数 
        // $scope.select = function()
        // { 
        //     var selected = $('.filter-status').find(':selected').text();
        //     console.log(selected);
        //     // console.log($scope.selected);
        // }
        //指定列筛选(显示数值由高到低从左到右排列) 
        $scope.sort = function(keywords)
        {
            //请求后台排序
            CommonHttpService.post("../static/locales/cloud_monitor/cloud_monitor_sort.json",{keywords})
            .then(function(data){
                if (data) {
                    // console.log($scope.selected_1);
                    // ToastrService.success(data.msg, $i18next("success"));
                    if(keywords == 'cpu'){
                        $scope.cloud_monitors = data.cpu;
                    }
                    else if(keywords == 'memory'){
                        $scope.cloud_monitors = data.memory;
                    }
                    else if(keywords == 'disk'){
                        $scope.cloud_monitors = data.disk;
                    }else if(keywords == 'network'){
                        $scope.cloud_monitors = data.network;
                    }else{
                        $scope.cloud_monitors = _data;
                    }
                    checkboxGroup.uncheck()
                } else {
                    ToastrService.error(data.msg, $i18next("op_failed"));
                    alert('请求失败');
                }
            });
        };
        
        // console.log($scope.cloud_monitor_table);
        var deleteCloud_Monitors = function(ids){

            $ngBootbox.confirm($i18next("cloud_monitor.confirm_delete")).then(function(){

                if(typeof ids == 'function'){
                    ids = ids();
                }

                CommonHttpService.post("/api/cloud_monitor/batch-delete/", {ids: ids}).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        $scope.cloud_monitor_table.reload();
                        checkboxGroup.uncheck()
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            });
        };

        $scope.batchDelete = function(){

            deleteCloud_Monitors(function(){
                var ids = [];

                checkboxGroup.forEachChecked(function(Cloud_Monitor){
                    if(cloud_monitor.checked){
                        ids.push(cloud_monitor.id);
                    }
                });

                return ids;
            });
        };

        $scope.delete = function(cloud_monitor){
            deleteCloud_Monitors([cloud_monitor.id]);
        };


        $scope.edit = function(cloud_monitor){

            $modal.open({
                templateUrl: 'update.html',
                controller: 'Cloud_MonitorUpdateController',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    cloud_monitor_table: function () {
                        return $scope.cloud_monitor_table;
                    },
                    cloud_monitor: function(){return cloud_monitor}
                }
            });
        };

        $scope.openNewCloud_MonitorModal = function(){
            $modal.open({
                templateUrl: 'new-cloud_monitor.html',
                backdrop: "static",
                controller: 'NewCloud_MonitorController',
                size: 'lg',
                resolve: {
                    dataCenters: function(){
                        return DataCenter.query().$promise;
                    }
                }
            }).result.then(function(){
                $scope.cloud_monitor_table.reload();
            });
        };
    })


    .controller('NewCloud_MonitorController',
        function($scope, $modalInstance, $i18next,
                 CommonHttpService, ToastrService, Cloud_MonitorForm, dataCenters){

            var form = null;
            $modalInstance.rendered.then(function(){
                form = Cloud_MonitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });

            $scope.dataCenters = dataCenters;
            $scope.cloud_monitor = {is_resource_user: false, is_approver: false};
            $scope.is_submitting = false;
            $scope.cancel = $modalInstance.dismiss;
            $scope.create = function(){

                if(form.valid() == false){
                    return;
                }

                $scope.is_submitting = true;
                CommonHttpService.post('/api/cloud_monitor/create/', $scope.cloud_monitor).then(function(result){
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

   ).factory('Cloud_MonitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor/is-name-unique/",
                                    data: {
                                        cloud_monitorname: $("#cloud_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitorname: {
                                remote: $i18next('cloud_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#cloud_monitorForm', config);
                }
            }
        }]).controller('Cloud_MonitorUpdateController',
        function($rootScope, $scope, $modalInstance, $i18next,
                 cloud_monitor, cloud_monitor_table,
                 Cloud_Monitor, UserDataCenter, cloud_monitorForm,
                 CommonHttpService, ToastrService, ResourceTool){

            $scope.cloud_monitor = cloud_monitor = angular.copy(cloud_monitor);

            $modalInstance.rendered.then(cloud_monitorForm.init);

            $scope.cancel = function () {
                $modalInstance.dismiss();
            };


            var form = null;
            $modalInstance.rendered.then(function(){
                form = cloud_monitorForm.init($scope.site_config.WORKFLOW_ENABLED);
            });
            $scope.submit = function(cloud_monitor){

                if(!$("#Cloud_MonitorForm").validate().form()){
                    return;
                }

                cloud_monitor = ResourceTool.copy_only_data(cloud_monitor);


                CommonHttpService.post("/api/cloud_monitor/update/", cloud_monitor).then(function(data){
                    if (data.success) {
                        ToastrService.success(data.msg, $i18next("success"));
                        cloud_monitor_table.reload();
                        $modalInstance.dismiss();
                    } else {
                        ToastrService.error(data.msg, $i18next("op_failed"));
                    }
                });
            };
        }
   ).factory('cloud_monitorForm', ['ValidationTool', '$i18next',
        function(ValidationTool, $i18next){
            return {
                init: function(){

                    var config = {

                        rules: {
                            cloud_monitorname: {
                                required: true,
                                remote: {
                                    url: "/api/cloud_monitor/is-name-unique/",
                                    data: {
                                        cloud_monitorname: $("#cloud_monitorname").val()
                                    },
                                    async: false
                                }
                            },
                            user_type: 'required'
                        },
                        messages: {
                            cloud_monitorname: {
                                remote: $i18next('cloud_monitor.name_is_used')
                            },
                        },
                        errorPlacement: function (error, element) {

                            var name = angular.element(element).attr('name');
                            if(name != 'user_type'){
                                error.insertAfter(element);
                            }
                        }
                    };

                    return ValidationTool.init('#Cloud_MonitorForm', config);
                }
            }
        }]);
