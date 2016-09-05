/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //network_bar_loadbanlance
          .state("network_bar_loadbanlance", {
                url: "/network_bar_loadbanlance/",
                templateUrl: "/static/management/views/network_bar_loadbanlance.html",
                data: {pageTitle: 'Network_Bar_Loadbanlance'},
                controller: "Network_Bar_LoadbanlanceController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/network_bar_loadbanlance_ctrl.js'
                            ]
                        });
                    }]
                }
            })
