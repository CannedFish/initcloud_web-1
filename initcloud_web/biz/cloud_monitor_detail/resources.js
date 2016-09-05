/**
 * User: arthur 
 */

/**
 *
 * 将下面的内容，添加到/var/www/initcloud_web/initcloud_web/render/static/assets/global/scripts/resources.js
 */

.factory('Cloud_Monitor_Detail', ['$resource', function ($resource) {
    return $resource("/api/cloud_monitor_detail/:id", {id: '@id'});
}])
