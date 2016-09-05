/**
 *
 * 将下列内容添加到/var/www/initcloud_web/initcloud_web/render/static/management/app.js中
 */
            


          //tab
          .state("tab", {
                url: "/tab/",
                templateUrl: "/static/management/views/tab.html",
                data: {pageTitle: 'Tab'},
                controller: "TabController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CloudApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                '/static/management/controllers/tab_ctrl.js'
                            ]
                        });
                    }]
                }
            })
