/**
 * User: arthur 
 */

/**
 *
 * 将下面的内容，添加到/var/www/initcloud_web/initcloud_web/render/static/assets/global/scripts/resources.js
 */

.factory('Network_Bar_Sdn', ['$resource', function ($resource) {
    return $resource("/api/network_bar_sdn/:id", {id: '@id'});
}])
