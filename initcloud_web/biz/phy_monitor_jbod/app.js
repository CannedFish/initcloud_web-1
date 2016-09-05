/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_monitor_jbod
          .state("phy_monitor_jbod", {
                url: "/phy_monitor_jbod/",
                templateUrl: "/static/management/views/phy_monitor_jbod.html",
                data: {pageTitle: 'Phy_Monitor_Jbod'},
                controller: "Phy_Monitor_JbodController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_monitor_jbod_ctrl.js'
                            ]
                        });
                    }]
                }
            })
