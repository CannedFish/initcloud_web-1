/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //phy_monitor_storage
          .state("phy_monitor_storage", {
                url: "/phy_monitor_storage/",
                templateUrl: "/static/management/views/phy_monitor_storage.html",
                data: {pageTitle: 'Phy_Monitor_Storage'},
                controller: "Phy_Monitor_StorageController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/phy_monitor_storage_ctrl.js'
                            ]
                        });
                    }]
                }
            })
