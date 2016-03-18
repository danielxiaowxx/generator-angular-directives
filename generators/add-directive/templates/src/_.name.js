
(function(_) {

  angular.module('gm.<%= camelDirectiveName %>', [])

    .constant('gm<%= firstCapCamelDirectiveName %>Config', {
      i18nData: {
        en   : {
          hello : 'Hello',
          // -- modal directive start //
          ok    : 'OK',
          cancel: 'Cancel',
          // modal directive end -- //
        },
        zh_CN: {
          hello : '你好',
          // -- modal directive start //
          ok    : '确定',
          cancel: '取消',
          // modal directive end -- //
        }
      }
    })

    .controller('gm<%= firstCapCamelDirectiveName %>Controller', ['gm<%= firstCapCamelDirectiveName %>Config', '$scope',

      function(gm<%= firstCapCamelDirectiveName %>Config, $scope) {

        var element, restService;

        var lang = $scope.gm<%= firstCapCamelDirectiveName %>Lang || 'en';

        var ngModelCtrl = {$setViewValue: angular.noop};

        /*========== Scope Models ==================================================*/

        $scope.i18nData = gm<%= firstCapCamelDirectiveName %>Config.i18nData[lang];

        /*========== Listeners ==================================================*/

        /*========== Watches ==================================================*/

        /*========== Public Functions ==================================================*/

        this.init = function(elementParam, restServiceParam, ngModelCtrlParam) {

          element = elementParam;

          restService = restServiceParam;

          ngModelCtrl = ngModelCtrlParam;
          ngModelCtrl.$render = this.render;

          // TODO: 仅作为演示, 修改成实际的方法, 并在合适的位置调用
          restService.getMockData({$param: 'hello'}).then(function(res) {
            var data = res.data || res;

            // UI -> model
            ngModelCtrl.$setViewValue(data);
            console.log('外部restService方法返回的数据:', data);
          })

        };

        // model -> UI
        this.render = function() {
          element.append(ngModelCtrl.$viewValue); // TODO 根据实际修改
        };

      }
    ])

    .directive('gm<%= firstCapCamelDirectiveName %>', [function() {
      return {
        restrict: 'AE',
        require: ['gm<%= firstCapCamelDirectiveName %>', 'ngModel'],
        controller: 'gm<%= firstCapCamelDirectiveName %>Controller',
        controllerAs: 'gm<%= firstCapCamelDirectiveName %>',
        templateUrl: 'gm/template/<%= directiveName %>/<%= directiveName %>.html',
        scope       : {
          gmCountriesSelectorLang: '@',
          getMockData: '&' // TODO: 修改成实际的方法
        },
        link: function(scope, element, attrs, ctrls) {

          var gm<%= firstCapCamelDirectiveName %>Ctrl = ctrls[0], ngModelCtrl = ctrls[1];

          var restService = {
            getMockData: scope.getMockData // TODO: 修改成实际的方法
          };

          gm<%= firstCapCamelDirectiveName %>Ctrl.init(element, restService, ngModelCtrl);

        }
      }
    }])

    // -- modal directive start //
    .controller('gm<%= firstCapCamelDirectiveName %>ModalController', ['$scope', '$modalInstance', 'gm<%= firstCapCamelDirectiveName %>Config', 'params',

      function($scope, $modalInstance, gm<%= firstCapCamelDirectiveName %>Config, params) {

        /*========== Scope Models ==================================================*/

        $scope.params = params;

        $scope.i18nData = gm<%= firstCapCamelDirectiveName %>Config.i18nData[params.lang];

        /*========== Scope Functions ==================================================*/

        $scope.ok = function() {
          $modalInstance.close($scope.params.modelData);
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
        };

        // TODO 修改成实际的方法名
        $scope.getMockData = function(param) {
          return $scope.params.getMockData({$param: param});
        };

    }])

    .directive('gm<%= firstCapCamelDirectiveName %>Modal', ['$modal', function($modal) {
      return {
        restrict: 'A',
        require : 'ngModel',
        scope   : {
          getMockData: '&' // TODO: 修改成实际的方法
        },
        link    : function(scope, element, attrs, ngModelCtrl) {

          element.on('click', function() {
            var modalInstance = $modal.open({
              templateUrl: 'gm/template/<%= directiveName %>/<%= directiveName %>-modal.html',
              controller : 'gm<%= firstCapCamelDirectiveName %>ModalController',
              size       : 'lg',
              resolve    : {
                params: function() {
                  return {
                    modelData   : ngModelCtrl.$viewValue,
                    getMockData : scope.getMockData, // TODO: 修改成实际的方法
                    lang        : attrs.gm<%= firstCapCamelDirectiveName %>ModalLang
                  }
                }
              }
            });

            modalInstance.result.then(function(modelData) {
              ngModelCtrl.$setViewValue(modelData);
            });

          });

        }
      }
    }])
    // modal directive end -- //

  ;

})(window._);


