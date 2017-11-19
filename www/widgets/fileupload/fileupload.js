app.directive('fileuploadFileupload', [
  "settings",
  "$window",
  "Upload",
  function(
    settings,
    $window,
    Upload
  ) {
    return {
      templateUrl: settings.widgets + 'fileupload/fileupload.html',
      link: function(scope, element, attrs) {


        scope.fileChanged = function() {
            //update GUI to show file
            $(".uploads").empty();
            if (scope.file) { //check if file is valid
              for(var i  = 0, len = scope.file.length; i < len; i++){
                  $(".uploads").append(" " + scope.file[i].name);
              }
            }
        }

        scope.submit = function(){ //function to call on form submit

            if (scope.file) { //check if file is valid
              for(var i  = 0, len = scope.file.length; i < len; i++){
                upload(scope.file[i]); //call upload function
              }
            }
            return true;
        }


        upload = function (file) {
    //      console.log("file", file);
            Upload.upload({
                url: 'https://learningmadesimple.herokuapp.com/upload', //webAPI exposed to upload the file
                data:{file:file} //pass file as data, should be user ng-model
            }).then(function (resp) { //upload function returns a promise
                if(resp.data.error_code === 0){ //validate success
                  //  console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                } else {
                    console.log('an error occured');
                }
            }, function (resp) { //catch error
                console.log('Error status: ' + resp.status);
                // $window.alert('Error status: ' + resp.status);
                $window.alert('File was not uploaded');
            }, function (evt) {
              //  console.log(evt);
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                //console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                scope.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });

      }
    }
  };
}
]);
