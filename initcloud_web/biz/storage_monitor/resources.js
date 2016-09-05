/**
 * User: arthur 
 */

/**
 *
 * 将下面的内容，添加到/var/www/initcloud_web/initcloud_web/render/static/assets/global/scripts/resources.js
 */

.factory('Storage_Monitor', ['$resource', function ($resource) {
    return $resource("/api/storage_monitor/:id", {id: '@id'});
}])
