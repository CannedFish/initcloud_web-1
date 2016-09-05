// /**
//  * User: arthur 
//  * Date: 16-4-17
//  **/
// CloudApp.controller('OverviewController',
//     function($rootScope, $scope, $filter, $modal, $i18next, $ngBootbox,
//              CommonHttpService, ToastrService, ngTableParams, ngTableHelper,
//              Overview, CheckboxGroup, DataCenter){

//         $scope.$on('$viewContentLoaded', function(){
//                 Metronic.initAjax();
//         });

//         $scope.overviews = [];
//         var checkboxGroup = $scope.checkboxGroup = CheckboxGroup.init($scope.overviews);

//         $scope.overview_table = new ngTableParams({
//                 page: 1,
//                 count: 10
//             },{
//                 counts: [],
//                 getData: function($defer, params){
//                     Overview.query(function(data){
//                         $scope.overviews = ngTableHelper.paginate(data, $defer, params);
//                         checkboxGroup.syncObjects($scope.overviews);
//                     });
//                 }
//             });



//         var deleteOverviews = function(ids){

//             $ngBootbox.confirm($i18next("overview.confirm_delete")).then(function(){

//                 if(typeof ids == 'function'){
//                     ids = ids();
//                 }

//                 CommonHttpService.post("/api/overview/batch-delete/", {ids: ids}).then(function(data){
//                     if (data.success) {
//                         ToastrService.success(data.msg, $i18next("success"));
//                         $scope.overview_table.reload();
//                         checkboxGroup.uncheck()
//                     } else {
//                         ToastrService.error(data.msg, $i18next("op_failed"));
//                     }
//                 });
//             });
//         };

//         $scope.batchDelete = function(){

//             deleteOverviews(function(){
//                 var ids = [];

//                 checkboxGroup.forEachChecked(function(Overview){
//                     if(overview.checked){
//                         ids.push(overview.id);
//                     }
//                 });

//                 return ids;
//             });
//         };

//         $scope.delete = function(overview){
//             deleteOverviews([overview.id]);
//         };


//         $scope.edit = function(overview){

//             $modal.open({
//                 templateUrl: 'update.html',
//                 controller: 'OverviewUpdateController',
//                 backdrop: "static",
//                 size: 'lg',
//                 resolve: {
//                     overview_table: function () {
//                         return $scope.overview_table;
//                     },
//                     overview: function(){return overview}
//                 }
//             });
//         };

//         $scope.openNewOverviewModal = function(){
//             $modal.open({
//                 templateUrl: 'new-overview.html',
//                 backdrop: "static",
//                 controller: 'NewOverviewController',
//                 size: 'lg',
//                 resolve: {
//                     dataCenters: function(){
//                         return DataCenter.query().$promise;
//                     }
//                 }
//             }).result.then(function(){
//                 $scope.overview_table.reload();
//             });
//         };
//     })


//     .controller('NewOverviewController',
//         function($scope, $modalInstance, $i18next,
//                  CommonHttpService, ToastrService, OverviewForm, dataCenters){

//             var form = null;
//             $modalInstance.rendered.then(function(){
//                 form = OverviewForm.init($scope.site_config.WORKFLOW_ENABLED);
//             });

//             $scope.dataCenters = dataCenters;
//             $scope.overview = {is_resource_user: false, is_approver: false};
//             $scope.is_submitting = false;
//             $scope.cancel = $modalInstance.dismiss;
//             $scope.create = function(){

//                 if(form.valid() == false){
//                     return;
//                 }

//                 $scope.is_submitting = true;
//                 CommonHttpService.post('/api/overview/create/', $scope.overview).then(function(result){
//                     if(result.success){
//                         ToastrService.success(result.msg, $i18next("success"));
//                         $modalInstance.close();
//                     } else {
//                         ToastrService.error(result.msg, $i18next("op_failed"));
//                     }
//                     $scope.is_submitting = true;
//                 }).finally(function(){
//                     $scope.is_submitting = false;
//                 });
//             };
//         }

//    ).factory('OverviewForm', ['ValidationTool', '$i18next',
//         function(ValidationTool, $i18next){
//             return {
//                 init: function(){

//                     var config = {

//                         rules: {
//                             overviewname: {
//                                 required: true,
//                                 remote: {
//                                     url: "/api/overview/is-name-unique/",
//                                     data: {
//                                         overviewname: $("#overviewname").val()
//                                     },
//                                     async: false
//                                 }
//                             },
//                             user_type: 'required'
//                         },
//                         messages: {
//                             overviewname: {
//                                 remote: $i18next('overview.name_is_used')
//                             },
//                         },
//                         errorPlacement: function (error, element) {

//                             var name = angular.element(element).attr('name');
//                             if(name != 'user_type'){
//                                 error.insertAfter(element);
//                             }
//                         }
//                     };

//                     return ValidationTool.init('#overviewForm', config);
//                 }
//             }
//         }]).controller('OverviewUpdateController',
//         function($rootScope, $scope, $modalInstance, $i18next,
//                  overview, overview_table,
//                  Overview, UserDataCenter, overviewForm,
//                  CommonHttpService, ToastrService, ResourceTool){

//             $scope.overview = overview = angular.copy(overview);

//             $modalInstance.rendered.then(overviewForm.init);

//             $scope.cancel = function () {
//                 $modalInstance.dismiss();
//             };


//             var form = null;
//             $modalInstance.rendered.then(function(){
//                 form = overviewForm.init($scope.site_config.WORKFLOW_ENABLED);
//             });
//             $scope.submit = function(overview){

//                 if(!$("#OverviewForm").validate().form()){
//                     return;
//                 }

//                 overview = ResourceTool.copy_only_data(overview);


//                 CommonHttpService.post("/api/overview/update/", overview).then(function(data){
//                     if (data.success) {
//                         ToastrService.success(data.msg, $i18next("success"));
//                         overview_table.reload();
//                         $modalInstance.dismiss();
//                     } else {
//                         ToastrService.error(data.msg, $i18next("op_failed"));
//                     }
//                 });
//             };
//         }
//    ).factory('overviewForm', ['ValidationTool', '$i18next',
//         function(ValidationTool, $i18next){
//             return {
//                 init: function(){

//                     var config = {

//                         rules: {
//                             overviewname: {
//                                 required: true,
//                                 remote: {
//                                     url: "/api/overview/is-name-unique/",
//                                     data: {
//                                         overviewname: $("#overviewname").val()
//                                     },
//                                     async: false
//                                 }
//                             },
//                             user_type: 'required'
//                         },
//                         messages: {
//                             overviewname: {
//                                 remote: $i18next('overview.name_is_used')
//                             },
//                         },
//                         errorPlacement: function (error, element) {

//                             var name = angular.element(element).attr('name');
//                             if(name != 'user_type'){
//                                 error.insertAfter(element);
//                             }
//                         }
//                     };

//                     return ValidationTool.init('#OverviewForm', config);
//                 }
//             }
//         }]);
