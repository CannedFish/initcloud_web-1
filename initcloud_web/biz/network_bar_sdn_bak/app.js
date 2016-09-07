/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //network_bar_sdn
          .state("network_bar_sdn", {
                url: "/network_bar_sdn/",
                templateUrl: "/static/management/views/network_bar_sdn.html",
                data: {pageTitle: 'Network_Bar_Sdn'},
                controller: "Network_Bar_SdnController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/network_bar_sdn_ctrl.js'
                            ]
                        });
                    }]
                }
            })
