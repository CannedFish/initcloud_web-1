angular.module('cloud.services')
    .constant('site_config', {{site_config|safe}})
    .constant('current_user', {{current_user|safe}})
   
// 配置文件
var _config = {
	// 首页 
	"storage_monitor":{
		"SBB" : "0" // 左下角显示 SBB ：1/0 (如果没有SBB的话，存储节点io流量统计)
	},
 	// 机柜各部分位置 现在的显示顺序

 	"cabinet_type":{
 		'_42U':'1',//前段展示42U的机柜
 		'_24U':'0',//前段展示24U的机柜
 	} 
}
//24U详细配置
var  _config_temp_24U = [
        {'name':'switchboard','index':'1','num':3,'status':1,'pblock':'item-box-01','cblock':'tool-01','h':20,'sub_index':[3,2,1]},
        {'name':'sas','index':'2','num':2,'status':1,'pblock':'item-box-02','cblock':'tool-02','h':21,'sub_index':[1,2]},
        {'name':'cpu_temperature','index':'3','num':5,'status':1,'pblock':'item-box-03','cblock':'tool-03','h':35,'sub_index':[5,2,3,4,1]},
        {'name':'memory_server_status','index':'4','num':1,'status':1,'pblock':'item-box-04','cblock':'tool-04','h':44,'sub_index':[1]},
        {'name':'jbod','index':'5','num':1,'status':1,'pblock':'item-box-05','cblock':'tool-05','h':66,'sub_index':[1]}
    ];
//42U详细配置
var  _config_temp_42U = [
        {'name':'switchboard','index':'1','num':3,'status':1,'pblock':'item-box-01','cblock':'tool-01','h':20,'sub_index':[3,2,1]},
        {'name':'sas','index':'2','num':2,'status':1,'pblock':'item-box-02','cblock':'tool-02','h':21,'sub_index':[1,2]},
        {'name':'cpu_temperature','index':'3','num':5,'status':1,'pblock':'item-box-03','cblock':'tool-03','h':35,'sub_index':[5,2,3,4,1]},
        {'name':'memory_server_status','index':'4','num':1,'status':1,'pblock':'item-box-04','cblock':'tool-06','h':32,'sub_index':[1]},
        {'name':'jbod','index':'5','num':2,'status':1,'pblock':'item-box-05','cblock':'tool-07','h':52,'sub_index':[1,2]}
    ]; 
// 这个机柜现在是四部分 24_48_switchboard-对应div too1-01 / 通过
	