/**
 * User: arthur 
 * Date: 16-4-17
 **/
CloudApp.controller('Cloud_MonitorController',
    function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
             CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
             Cloud_Monitor, CheckboxGroup, DataCenter,urlParamsTrnasfer){

        $scope.$on('$viewContentLoaded', function(){
            Metronic.initAjax();
            
        });
        
        $scope.cloud_monitors = '';
        var checkboxGroup = $scope.checkboxGroup =  CheckboxGroup.init($scope.cloud_monitors);
        Cloud_Monitor.get(function(data){
            $scope.cloud_monitors = data;  
        });
        checkboxGroup.syncObjects($scope.cloud_monitors);
        var plot_style = {
            colors: ['#23b7e5', '#7266ba'],
            series: { shadowSize: 3 },
            xaxis:{ font: { color: '#a1a7ac' },ticks:[]},
            yaxis:{ font: { color: '#a1a7ac' }, max:20,ticks:[]},
            grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#dce5ec' },
            tooltip: false,
            tooltipOpts: { content: 'Visits of %x.1 is %y.4',  defaultTheme: false, shifts: { x: 0, y: 0 } }
        };
        //跳转详情页
        $scope.transfer =function(id){
           urlParamsTrnasfer.set(id);
           window.location.href = "#/cloud_monitor_detail/"

        }
        //设置默认值 (物理主机/24小时内)
        $scope.defaultTimeRange = 'rday';
        $scope.plot_style = plot_style;//图标样式
        checkboxGroup.syncObjects($scope.cloud_monitors);
        
        //ng-repeat 渲染完执行脚本
        $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        	 if($scope.sortname == ''){
 				$scope.table_page();
        	 }else{
        	 	$scope.table_page(false);
        	 }
             ngRepeatFinishedEvent.stopPropagation(); // 终止事件继续“冒泡”
             // ngRepeatFinishedEvent.destroy();
        })
        // //得到物理主机名称
        // for(var n in $scope.tempdata)
        // {
        //     console.log($scope.tempdata[n].host);
        // }
        // 分页函数
        $scope.table_page = function(compl){
            var show_page = 5;
            var totalitem = $('.content .pageitem').length;
            var current_page=1;//当前页
            var page_num=Math.ceil(totalitem/show_page);//总页数
            var current_num=0;//用于生成页标的计数器 
            var li = "";//页标元素
            //循环生成页标元素
            while(page_num>current_num){
                li+='<li class="page_num"><a href="javasctip:#">'+(current_num+1)+'</a></li>';
                current_num++;
            }
            $('.content .pageitem').css('display','none');//设置隐藏
            $('.content .pageitem').slice(0, show_page).css('display', '');//设置显示
            // // 添加页标到页面
            $('#page_num_all').html(li);
            //显示当前页
            $("#current_page").html(" "+current_page+" ");//显示当前页
            $("#page_all").html(" "+page_num+" ");//显示总页数
            $('#page_num_all li:eq(0)').addClass('active');
            //页面跳转
            $(".page_num").click(function(){//页标跳转
                $('#page_num_all li').removeClass('active');
                $(this).addClass('active');
                var new_page=parseInt($(this).text());
                tab_page(new_page);
            });
            if(compl == false)  return;
            //点击上一页
            $('#previous_li').click(function(){
                var new_page = parseInt($('#current_page').text()) - 1; 
                // alert(new_page);
                if(new_page>0)
                {
                    $('#page_num_all li').removeClass('active');
                    $('#page_num_all li:eq('+(new_page-1)+')').addClass('active');
                    $("#current_page").html(" "+new_page+" "); 
                    tab_page(new_page);//切换新页
                }
               return false;
            });
            //点击下一页
            $("#next_li").click(function(){//下一
            
                var new_page=parseInt($("#current_page").text())+1;//当前页标
             
                if(new_page<=page_num){//判断是否为最后或第一页
                    $('#page_num_all li').removeClass('active');
                    $('#page_num_all li:eq('+$("#current_page").text()+')').addClass('active');
                    $("#current_page").html(" "+new_page+" ");
                    tab_page(new_page);
                }
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
        //按时间查询  1周内/一个月内/一小时内
        $scope.setTimeRange = function(key){
            switch($scope.selected_2){
                case '0':
                {
                    
                    $scope.defaultTimeRange = 'rday'; 
                    break;
                }
                case '1':
                {
                    
                    $scope.defaultTimeRange = 'rday'; 
                    break;
                }
                case '2':
                {
                    
                    $scope.defaultTimeRange = 'rday';
                    break;
                } 
                case '3':
                {
                   
                    $scope.defaultTimeRange = 'rhouse'; 
                    break;
                }
                default:
                $scope.defaultTimeRange = 'rday'; 
               
            }
            // console.log($scope.defaultTimeRange);
        }
        //深度复制  
        function deepCopy(source) { 
            var result={};
            for (var key in source) {
                // console.log(typeof source[key]);
                //1.js 数组和对象区分
                result[key] = (typeof source[key]==='object' && !isArray(source[key]))? deepCopy(source[key]): source[key];
            } 
            return result; 
        }  
        //判断数组和对象
        function isArray(obj) {    
            return Object.prototype.toString.call(obj) === '[object Array]';     
        }
        $scope.sortname = '';
        //指定列筛选(显示数值由高到低从左到右排列) 
        $scope.sortbykey = function(keywords)
        {

            angular.forEach($('.sortitem'),function(v,i){
                $(v).removeClass('active');
            })
            switch(keywords){
                case 'me-name':
                {
                    $('.sortitem').eq(0).addClass('active');
                    var me_data ={};
                    var me_arr = [];
                    angular.forEach($('.site'),function(v,i){
                        me_arr.push( eval('(' + $(v).data('mename')+ ')'))//字符串转为json对象
                    })
                    me_arr.sort(function(a,b){
                        return a.name.localeCompare(b.name)
                    })
                    for(var i=0;i<me_arr.length;i++)
                    {
                        var key = me_arr[i].name;//键值
                        me_data[key] = deepCopy($scope.cloud_monitors[key]);
                    }
                    $scope.cloud_monitors = me_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'mechine';
                    break;
                }
                //cpu 排序
                case 'data_cpu':
                {
                    $('.sortitem').eq(2).addClass('active');
                    var c_data ={};
                    var cpu_arr = [];
                    angular.forEach($('.data_cpu'),function(v,i){
                        cpu_arr.push( eval('(' + $(v).data('kernal')+ ')'))//字符串转为json对象
                    })
                    // console.log(cpu_arr);
                    var scpu =  cpu_arr.sort(function(x,y){
                        return (y.knum - x.knum)
                    });//排序
                    for(var i=0;i<scpu.length;i++)
                    {
                        var key = scpu[i].name;//键值
                        c_data[key] = deepCopy($scope.cloud_monitors[key]);
                    }
                    $scope.cloud_monitors = c_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'cpu';
                    break;
                }
                //磁盘  排序
                case 'data_disk':
                {
                    $('.sortitem').eq(4).addClass('active');
                    var d_data ={};
                    var disk_arr = [];
                    angular.forEach($('.data_disk'),function(v,i){
                        disk_arr.push( eval('(' + $(v).data('diskread')+ ')'))//字符串转为json对象
                    })
                    var sdisk =  disk_arr.sort(function(x,y){
                        return (y.read - x.read)
                    });//排序
                    for(var i=0;i<sdisk.length;i++)
                    {
                        var key = sdisk[i].name;//键值
                        d_data[key] = deepCopy($scope.cloud_monitors[key]);
                       
                    }
                    $scope.cloud_monitors = d_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'disk';
                    break;
                }
                //内存 排序
                case 'data_memory':
                {
                    $('.sortitem').eq(3).addClass('active');
                    var memory_data ={};
                    var memory_arr = [];
                    angular.forEach($('.data_memory'),function(v,i){
                        memory_arr.push( eval('(' + $(v).data('memory')+ ')'))//字符串转为json对象
                    })
                    var sdisk =  memory_arr.sort(function(x,y){
                        return (y.mnum - x.mnum)
                    });//排序
                    for(var i=0;i<sdisk.length;i++)
                    {
                        var key = sdisk[i].name;//键值
                        memory_data[key] = deepCopy($scope.cloud_monitors[key]);
                       
                    }
                    $scope.cloud_monitors = memory_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'memory';
                    break;
                }
                //网络 排序
                case 'data_network':
                {
                    $('.sortitem').eq(5).addClass('active');
                    var network_data ={};
                    var network_arr = [];
                    angular.forEach($('.data_network'),function(v,i){
                        network_arr.push( eval('(' + $(v).data('network')+ ')'))//字符串转为json对象
                    })
                    var sdisk =  network_arr.sort(function(x,y){
                        return (y.updata - x.updata)
                    });//排序
                    for(var i=0;i<sdisk.length;i++)
                    {
                        var key = sdisk[i].name;//键值
                        network_data[key] = deepCopy($scope.cloud_monitors[key]);
                       
                    }
                    $scope.cloud_monitors = network_data;
                    checkboxGroup.syncObjects($scope.cloud_monitors);
                    $scope.sortname = 'network';
                    break;
                }
            }
        };
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
