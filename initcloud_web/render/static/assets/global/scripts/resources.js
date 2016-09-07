/**
 * User: arthur 
 */


angular.module('cloud.resources', [])

.factory('Image', ['$resource', function ($resource) {
    return $resource("/api/images/:id");
}])

.factory('Instance', ['$resource', function ($resource) {
    return $resource("/api/instances/:id");
}])

.factory('UserCheck', ['$resource', function ($resource) {
    return $resource("/api/UserGrouper/UserCheck", {id:'@id'});
}])


.factory('Usergrouper', ['$resource', function ($resource) {
    return $resource("/api/UserGrouper/:id", {id: '@id'});
}])

.factory('User', ['$resource', function($resource){
    return $resource("/api/users/:id/:action/", {id: '@id'},
        {
            getActiveUsers: {isArray: true,  params: {action: 'active'}},
            query: {isArray: false},
            all: {isArray: true, params: {action: 'all'}},
            getApprovers: {isArray: true, params: {action: 'workflow-approvers'}}
        });
}])

.factory('Contract', ['$resource', function($resource){
    return $resource("/api/contracts/:id/", {id: '@id'}, {query: {isArray: false}});
}])

.factory('Quota', ['$resource', function($resource){
    return $resource("/api/quotas/:id/", {id: '@id'}) ;
}])

.factory('Operation', ['$resource', function ($resource) {
    return $resource("/api/operation/:id", {}, {query: {isArray: false}});
}])

//update start 
.factory('Role', ['$resource', function ($resource) {
    return $resource("/api/roles/:id", {id: '@id'});
}])


.factory('Storage_Monitor', ['$resource', function ($resource) {
    return $resource("/api/storage_monitor/:id", {id: '@id'});
}])



.factory('Nova_Role', ['$resource', function ($resource) {
    return $resource("/api/policy_nova/role/", {id: '@id'});
}])

.factory('Policy_Nova', ['$resource', function ($resource) {
    return $resource("/api/policy_nova/:id", {id: '@id'});
}])


.factory('Policy_Cinder', ['$resource', function ($resource) {
    return $resource("/api/policy_cinder/:id", {id: '@id'});
}])

.factory('Policy_Neutron', ['$resource', function ($resource) {
    return $resource("/api/policy_neutron/:id", {id: '@id'});
}])


.factory('Group', ['$resource', function ($resource) {
    return $resource("/api/group/:id", {id: '@id'});
}])
//update end

.factory('Flavor', ['$resource', function ($resource) {
    return $resource("/api/flavors/:id");
}])

.factory('Network', ['$resource', function ($resource) {
    return $resource("/api/networks/:id");
}])

.factory('Router', ['$resource', function ($resource) {
    return $resource("/api/routers/:id");
}])

.factory('Firewall', ['$resource', function ($resource) {
    return $resource("/api/firewall/:id");
}])

.factory('Volume', ['$resource', function ($resource) {
    return $resource("/api/volumes/:id");
}])

.factory('UserDataCenter', ['$resource', function($resource){
   return $resource("/api/user-data-centers/:id")
}])

.factory('DataCenter', ['$resource', function($resource){
  return $resource("/api/data-centers/:id")
}])

.factory('Forum', ['$resource', function($resource){
    return $resource("/api/forum/:id")
}])

.factory('ForumReply', ['$resource', function($resource){
    return $resource("/api/forum-replies/:id")
}])

.factory('Backup', ['$resource', function ($resource) {
    return $resource("/api/backup/:id");
}])

.factory('BackupItem', ['$resource', function ($resource) {
    return $resource("/api/backup-items/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
            restore: {method: 'POST', isArray:false, params: {action: 'restore'}},
            delete: {method: 'POST', isArray:false, params: {action: 'delete'}},
            getChain: {isArray:true, params: {action: 'chain'}}
        }
    );
}])

.factory('Notification', ['$resource', function ($resource){
    return $resource("/api/notifications/:id/:action/", {id: '@id'});
}])

.factory('Feed', ['$resource', function ($resource){
    return $resource("/api/feeds/:id/:action/",
        {id: '@id'},
        {
            status: {isArray: false,  params: {action: 'status'}},
            markRead: {method: 'POST', isArray:false, params: {action: 'mark-read'}}
        });
}])

.factory('FlowInstance', ['$resource', function ($resource){
    return $resource("/api/workflow-instances/:id/:action/",
        {id: '@id'},
        {status: {isArray: false, params: {action: 'status'}}});
}])

.factory('Workflow', ['$resource', function ($resource){
    return $resource("/api/workflows/:id/:action/", {id: '@id'});
}])

.factory('PriceRule', function($resource){
    return $resource("/api/price-rules/:id/:action/", {id: '@id'},
        {
            query: {isArray: true}
        });
})

.factory("Order", function($resource){
     return $resource("/api/orders/:id/:action/", {id: '@id'}, {
         query: {isArray: false}
     });
})

.factory("Bill", function($resource){
     return $resource("/api/bills/:id/:action/", {id: '@id'}, {
         query: {isArray: false},
         overview: {isArray: true, params: {action: 'overview'}}
     });
})

//update start
.factory('Alarm_Meter', ['$resource', function ($resource) {
    return $resource("/api/alarm/meter/", {id: '@id'});
}])

.factory('Alarm_Resource', ['$resource', function ($resource) {
    return $resource("/api/alarm/resource/", {id: '@id'});
}])

.factory('Alarm', ['$resource', function ($resource) {
    return $resource("/api/alarm/:id", {id: '@id'});
}])
.factory('Virtualmechine_Bar', ['$resource', function ($resource) {//云主机监控接口
    return $resource("/api/virtualmechine_bar/:id", {id: '@id'});
}])
.factory('Storage__Bar', ['$resource', function ($resource) {//存储监控
    return $resource("/api/storage__bar/:id", {id: '@id'});
}])
.factory('Service__Bar', ['$resource', function ($resource) {//服务监控
    return $resource("/api/service__bar/:id", {id: '@id'});
}])
.factory('Network_Bar', ['$resource', function ($resource) {//网络监控
    return $resource("/api/network_bar/:id", {id: '@id'});
}])
.factory('Phy_Nodes', ['$resource', function ($resource) {//存储监控物理节点
    return $resource("/api/phy_nodes/:id", {id: '@id'});
}])
.factory('Cabinet', ['$resource', function ($resource) { //机柜
    return $resource("/api/cabinet/:id", {id: '@id'});
}])
.factory('Warning', ['$resource', function ($resource) {//报警信息
    return $resource("/api/warning/:id", {id: '@id'});
}])
.factory('Tech_Support', ['$resource', function ($resource) {//技术支持
    return $resource("/api/tech_support/:id", {id: '@id'});
}])
.factory('Storage_Monitor', ['$resource', function ($resource) { //存储监控二级
    return $resource("/api/storage_monitor/:id", {id: '@id'});
}])
.factory('Phy_Monitor', ['$resource', function ($resource) { //物理监控二级
    return $resource("/api/phy_monitor/:id", {id: '@id'});
}])
.factory('Network_Monitor', ['$resource', function ($resource) { //网络监控二级
    return $resource("/api/network_monitor/:id", {id: '@id'});
}])
.factory('Memory_Monitor', ['$resource', function ($resource) { //存储监控二级
    return $resource("/api/memory_monitor/:id", {id: '@id'});
}])
.factory('Cloud_Monitor', ['$resource', function ($resource) { //云主机监控
    return $resource("/api/cloud_monitor/:id", {id: '@id'});
}])
.factory('Cloud_Monitor_Detail', ['$resource', function ($resource) {//云主机详情页
    return $resource("/api/cloud_monitor_detail/:id", {id: '@id'});
}])
.factory('Phy_Monitor_Network', ['$resource', function ($resource) { //物理监控-网络监控
    return $resource("/api/phy_monitor_network/:id", {id: '@id'});
}])
.factory('Phy_Monitor_Server', ['$resource', function ($resource) { //物理监控-服务器监控
    return $resource("/api/phy_monitor_server/:id", {id: '@id'});
}])
.factory('Phy_Monitor_Jbod', ['$resource', function ($resource) {  //物理监控-JBOD监控
    return $resource("/api/phy_monitor_jbod/:id", {id: '@id'});
}])
.factory('Phy_Monitor_Storage', ['$resource', function ($resource) { //物理监控-存储监控
    return $resource("/api/phy_monitor_storage/:id", {id: '@id'});
}])
.factory('Treeview', ['$resource', function ($resource) { //存储监控树引入
    return $resource("/api/treeview/:id", {id: '@id'});
}])
.factory('Network_Bar_Router', ['$resource', function ($resource) { //网络监控子模块 路由器
    return $resource("/api/network_bar_router/:id", {id: '@id'});
}])
.factory('Network_Bar_Loadbanlance', ['$resource', function ($resource) { //网络监控-负载均衡
    return $resource("/api/network_bar_loadbanlance/:id", {id: '@id'});
}])
.factory('Network_Bar_Sdn', ['$resource', function ($resource) {  //网络监控 - sdn
    return $resource("/api/network_bar_sdn/:id", {id: '@id'});   
}])
.factory('Network_Bar_Net', ['$resource', function ($resource) {  //网络监控 - 网络树
    return $resource("/api/network_bar_net/:id", {id: '@id'});
}])
.factory('Volume_Monitor', ['$resource', function ($resource) {  //云盘监控
    return $resource("/api/volume_monitor/:id", {id: '@id'});
}]);
