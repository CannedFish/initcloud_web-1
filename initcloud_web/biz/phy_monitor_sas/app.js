/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_monitor_sas
          .state("phy_monitor_sas", {
                url: "/phy_monitor_sas/",
                templateUrl: "/static/management/views/phy_monitor_sas.html",
                data: {pageTitle: 'Phy_Monitor_Sas'},
                controller: "Phy_Monitor_SasController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_monitor_sas_ctrl.js'
                            ]
                        });
                    }]
                }
            })
