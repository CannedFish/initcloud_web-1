/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //wuli_storage
          .state("wuli_storage", {
                url: "/wuli_storage/",
                templateUrl: "/static/management/views/wuli_storage.html",
                data: {pageTitle: 'Wuli_Storage'},
                controller: "Wuli_StorageController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/wuli_storage_ctrl.js'
                            ]
                        });
                    }]
                }
            })
