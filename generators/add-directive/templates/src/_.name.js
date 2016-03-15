
(function(_) {

  angular.module('gm.<%= camelDirectiveName %>', [])

    .constant('gm<%= firstCapCamelDirectiveName %>Config', {
      i18nData: {
        en: {
          hello: 'Hello'
        },
        zh_CN: {
          hello: '你好'
        }
      }
    })

    .controller('gm<%= firstCapCamelDirectiveName %>Controller', ['gm<%= firstCapCamelDirectiveName %>Config', function(gm<%= firstCapCamelDirectiveName %>Config) {

    }])

    .directive('gm<%= firstCapCamelDirectiveName %>', ['gm<%= firstCapCamelDirectiveName %>Config', function(gm<%= firstCapCamelDirectiveName %>Config) {
      return {
        restrict: 'A',
        require: ['gm<%= firstCapCamelDirectiveName %>', 'ngModel'],
        controller: 'gm<%= firstCapCamelDirectiveName %>Controller',
        controllerAs: 'gm<%= firstCapCamelDirectiveName %>',
        templateUrl: function(element, attrs) {
          return attrs.templateUrl || 'gm/template/<%= directiveName %>/<%= directiveName %>.html';
        },
        link: function(scope, element, attrs, ctrls) {

          var gm<%= firstCapCamelDirectiveName %>Ctrl = ctrls[0], ngModelCtrl = ctrls[1];

          scope.i18nData = gm<%= firstCapCamelDirectiveName %>Config.i18nData[attrs.gm<%= firstCapCamelDirectiveName %>Lang || 'en'];

          // model -> UI
          ngModelCtrl.$render = function() {
            element.append(ngModelCtrl.$modelValue);
          };

          // ui -> model
          element.on('click', function() {
            scope.$apply(function() {
              ngModelCtrl.$setViewValue('clicked and modal change');
            });
          });
        }
      }
    }])
  ;

})(window._);


