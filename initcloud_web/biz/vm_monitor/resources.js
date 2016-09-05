/**
 * User: arthur 
 */

/**
 *
 * 将下面的内容，添加到/var/www/initcloud_web/initcloud_web/render/static/assets/global/scripts/resources.js
 */

.factory('Vm_Monitor', ['$resource', function ($resource) {
    return $resource("/api/vm_monitor/:id", {id: '@id'});
}])
