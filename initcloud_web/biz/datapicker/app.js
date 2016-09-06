/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //datapicker
          .state("datapicker", {
                url: "/datapicker/",
                templateUrl: "/static/management/views/datapicker.html",
                data: {pageTitle: 'Datapicker'},
                controller: "DatapickerController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/datapicker_ctrl.js'
                            ]
                        });
                    }]
                }
            })
