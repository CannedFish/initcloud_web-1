angular.module('cloud.services')
    .constant('site_config', {{site_config|safe}})
    .constant('current_user', {{current_user|safe}});
// 配置文件
var _config = {
	// 首页 
	"storage_monitor":{
		"SBB" : "0" // 左下角显示 SBB ：1/0 (如果没有SBB的话，存储节点io流量统计)
	},
 	// 机柜各部分位置 现在的显示顺序
}
// 这个机柜现在是四部分 24_48_switchboard-对应div too1-01 / 通过
