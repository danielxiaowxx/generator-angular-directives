
angular.module('gm.<%= camelDirectiveName %>', [])

  .constant('gm<%= firstCapCamelDirectiveName %>Config', {
  })

  .controller('gm<%= firstCapCamelDirectiveName %>Controller', ['gm<%= firstCapCamelDirectiveName %>Config', function(gm<%= firstCapCamelDirectiveName %>Config) {
  }])

  .directive('gm<%= firstCapCamelDirectiveName %>', [function() {
    return {
      require: ['gm<%= firstCapCamelDirectiveName %>', 'ngModel'],
      controller: 'gm<%= firstCapCamelDirectiveName %>Controller',
      controllerAs: 'gm<%= firstCapCamelDirectiveName %>',
      templateUrl: function(element, attrs) {
        return attrs.templateUrl || 'gm/template/<%= directiveName %>/<%= directiveName %>.html';
      },
      link: function(scope, element, attrs, ctrls) {
        var gm<%= firstCapCamelDirectiveName %>Ctrl = ctrls[0], ngModelCtrl = ctrls[1];

        // model -> UI
        ngModelCtrl.$render = function() {
          element.html(ngModelCtrl.$modelValue);
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
