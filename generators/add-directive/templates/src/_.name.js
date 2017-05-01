
(function(_) {

  angular.module('dn.<%= camelDirectiveName %>', [])

    .value('dn<%= firstCapCamelDirectiveName %>Value', { // 用于缓存组件多个实例共享的数据

    })

    .constant('dn<%= firstCapCamelDirectiveName %>Config', {
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

    .controller('dn<%= firstCapCamelDirectiveName %>Controller', ['dn<%= firstCapCamelDirectiveName %>Config', 'dn<%= firstCapCamelDirectiveName %>Value', '$scope',

      function(dn<%= firstCapCamelDirectiveName %>Config, dn<%= firstCapCamelDirectiveName %>Value, $scope) {

        var element, restService;

        var lang = $scope.dn<%= firstCapCamelDirectiveName %>Lang || 'en';

        var ngModelCtrl = {$setViewValue: angular.noop};

        /*========== Scope Models ==================================================*/

        $scope.i18nData = dn<%= firstCapCamelDirectiveName %>Config.i18nData[lang];

        /*========== Scope Functions ==================================================*/

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

        /*========== Private Functions ==================================================*/

      }
    ])

    .directive('dn<%= firstCapCamelDirectiveName %>', [function() {
      return {
        restrict: 'AE',
        require: ['dn<%= firstCapCamelDirectiveName %>', 'ngModel'],
        controller: 'dn<%= firstCapCamelDirectiveName %>Controller',
        controllerAs: 'dn<%= firstCapCamelDirectiveName %>',
        templateUrl: 'dn/template/<%= directiveName %>/<%= directiveName %>.html',
        scope       : {
          dn<%= firstCapCamelDirectiveName %>Lang: '@',
          getMockData: '&' // TODO: 修改成实际的方法
        },
        link: function(scope, element, attrs, ctrls) {

          var dn<%= firstCapCamelDirectiveName %>Ctrl = ctrls[0], ngModelCtrl = ctrls[1];

          var restService = {
            getMockData: scope.getMockData // TODO: 修改成实际的方法
          };

          dn<%= firstCapCamelDirectiveName %>Ctrl.init(element, restService, ngModelCtrl);

        }
      }
    }])

    // -- modal directive start //
    .controller('dn<%= firstCapCamelDirectiveName %>ModalController', ['$scope', '$modalInstance', 'dn<%= firstCapCamelDirectiveName %>Config', 'params',

      function($scope, $modalInstance, dn<%= firstCapCamelDirectiveName %>Config, params) {

        /*========== Scope Models ==================================================*/

        $scope.params = params;

        $scope.i18nData = dn<%= firstCapCamelDirectiveName %>Config.i18nData[params.lang];

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

    .directive('dn<%= firstCapCamelDirectiveName %>Modal', ['$modal', function($modal) {
      return {
        restrict: 'A',
        require : 'ngModel',
        scope   : {
          getMockData: '&' // TODO: 修改成实际的方法
        },
        link    : function(scope, element, attrs, ngModelCtrl) {

          element.on('click', function() {
            var modalInstance = $modal.open({
              templateUrl: 'dn/template/<%= directiveName %>/<%= directiveName %>-modal.html',
              controller : 'dn<%= firstCapCamelDirectiveName %>ModalController',
              size       : 'lg',
              resolve    : {
                params: function() {
                  return {
                    modelData   : ngModelCtrl.$viewValue,
                    getMockData : scope.getMockData, // TODO: 修改成实际的方法
                    lang        : attrs.dn<%= firstCapCamelDirectiveName %>ModalLang
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


