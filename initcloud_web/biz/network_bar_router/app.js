/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //network_bar_router
          .state("network_bar_router", {
                url: "/network_bar_router/",
                templateUrl: "/static/management/views/network_bar_router.html",
                data: {pageTitle: 'Network_Bar_Router'},
                controller: "Network_Bar_RouterController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/network_bar_router_ctrl.js'
                            ]
                        });
                    }]
                }
            })
