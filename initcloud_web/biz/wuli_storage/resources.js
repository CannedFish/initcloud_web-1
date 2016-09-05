/**
 * User: arthur 
 */

/**
 *
 * 将下面的内容，添加到/var/www/initcloud_web/initcloud_web/render/static/assets/global/scripts/resources.js
 */

.factory('Wuli_Storage', ['$resource', function ($resource) {
    return $resource("/api/wuli_storage/:id", {id: '@id'});
}])
