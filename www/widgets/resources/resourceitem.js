app.directive('resourcesResourceitem', [
  "settings",
  "$routeParams",
  "Course",
  function(
    settings,
    $routeParams,
    Course
  ) {

    return {
      templateUrl: settings.widgets + 'resources/resourceitem.html',
      link: function(scope, element, attrs) {
          var url = $routeParams.url;


        scope.resourceList = [];
        Course.get({ url: url}, function(course){
          if(course[0].resources !== undefined){
            for (var i = 0; i < course[0].resources.length; i++) {
                scope.resourceList.push(course[0].resources[i]);
            }
          }

        });

      }
    };
  }
]);