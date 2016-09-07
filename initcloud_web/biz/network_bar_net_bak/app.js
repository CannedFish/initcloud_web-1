/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //network_bar_net
          .state("network_bar_net", {
                url: "/network_bar_net/",
                templateUrl: "/static/management/views/network_bar_net.html",
                data: {pageTitle: 'Network_Bar_Net'},
                controller: "Network_Bar_NetController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/network_bar_net_ctrl.js'
                            ]
                        });
                    }]
                }
            })
