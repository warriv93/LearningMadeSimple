app.directive('profilePrivateprofile', [
  "settings",
  "User",
  "SessionService",
  "$routeParams",
  "$location",
  "$http",
  "$window",
  "Upload",
  "Tag",
  function(
    settings,
    User,
    SessionService,
    $routeParams,
    $location,
    $http,
    $window,
    Upload,
    Tag
     ) {

    return {
      templateUrl: settings.widgets + 'profile/privateprofile.html',
      link: function($scope, element, attrs) {

  		var redirectSuccess = function(){
	    	var code = $location.search().code; //slack code returned in url if auth success
	    	if(code != undefined){

	    		//Name of the slackTeam changes for each company using LMS, for example
	    		//the following means the user will be connected to lmsproject.slack.com
	    		var slackTeam = "lmsproject"
	    		//url contains a special temporary code needed for aquaring user token
	    		var url = "https://slack.com/api/oauth.access?client_id=19435876323.23240924768&client_secret=e6a4a2f97a72b6a1e889830b6ba7612b&code=" + code + "&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fmyprofile%2F&pretty=1&team=" + slackTeam;

	    		//uses temp code to get access token
	    		$http.get(url).then(function(response) {
		    		var token = response.data.access_token;
            		var slack_username = response.data.user_id;

		    		//gets session
		    		SessionService.getSession().success(function(response) {
		    				//returns user from session
							User.update({_id:response.user._id},{ slack_token: token , slack_username: slack_username});

              //update session here
              SessionService.updateSession($scope.user.email).success(function(session) {
                if(session.slack_token != undefined) {
                  $scope.authButton = false;
                }
              });
					});
	    		});
	    	}
	    }

		redirectSuccess();

  		//Controlls that switches input
	    $scope.descriptionEnabled = true;
	    $scope.contactEnabled = true;
	    $scope.linksEnabled = true;
	    $scope.expEnabled = true;
	    $scope.class = "fa fa-pencil";
	    $scope.contact_class = "fa fa-pencil";
	    $scope.links_class = "fa fa-pencil";
	    $scope.exp_class = "fa fa-pencil";
	    $scope.isStudent = false;
	    var obj = null;
        var isEditing = false;

	    // Get profile data from DB
	    var initializeProfile = function (data) {
	        if (data != false) {
              if(data.slack_token == undefined){
                $scope.authButton = true;
              }

	            $scope.first_name = data.first_name;
	            $scope.last_name = data.last_name;
	            $scope.email = data.email;

	            $scope.profile_pic = data.profile_pic;

	            //console.log(data.profile_pic);

	            $scope.phone_number = data.phone_number;
	            $scope.url = data.public_url;
	            $scope.homepage = data.homepage;

	            $scope.description = data.description;

	            $scope.linkedin = data.linkedin;
	            $scope.facebook = data.facebook;
	            $scope.twitter = data.twitter;
	            $scope.github = data.github;

	            $scope.user = data;
	            $scope.role = data.role;

	            $scope.courses = data.courses;

	            $scope.experiences = data.experiences;
	            $scope.skills = data.skills;

	            $scope.tag = [];
	            Tag.get({}, function(res){
	            	for (var i = 0; i < res.length; i++) {
	            		$scope.tag.push(res[i].tag);
	            	};

            	  	$( "#skills" ).autocomplete({
			        	source: $scope.tag,
			        	select: function(e, ui) {
					        $scope.searchTag = ui.item.value;

					    }
			        });
	            });

	            obj = data;

	            if(data.role == "Student")
                {
                    $scope.isStudent = true;
                }
	            $scope.personality = data.personality;

	            showPicture();

	        } else {
	            $scope.first_name = "No profile found";
	        }
	    };

        //Edit description code
	    $scope.editDescription = function () {
	            $scope.descriptionEnabled = false;
        };

        $scope.cancelDescription = function () {
	            $scope.descriptionEnabled = true;
                $scope.description = obj.description;
        };

        $scope.saveDescription = function (){
            $scope.descriptionEnabled = true;
            obj.description = $scope.description;

            User.update({
                _id: obj._id
            },{
                description: obj.description
              });

            if(obj != null){
                $scope.user = obj;
            }
            $scope.descriptionEnabled = true;
            $scope.class = "fa fa-pencil";
	    };

        //Edit contact code
        $scope.cancelContact = function () {
                $(' .profile__contact .fa-pencil, .profile__contact input').css({
                    opacity: 0
                })
	            $scope.contactEnabled = true;
                $scope.email = obj.email;
                $scope.phone_number = obj.phone_number;
                $scope.homepage = obj.homepage;
        };

         $scope.saveContact = function (){
             $('.profile__contact .fa-pencil, .profile__contact input').css({
                    opacity: 0
                })
            $scope.ContactEnabled = true;
            obj.email = $scope.email;
            obj.phone_number = $scope.phone_number;
            obj.homepage = $scope.homepage;

            User.update({
                _id: obj._id
            },{
                email: obj.email,
                phone_number: obj.phone_number,
                homepage: obj.homepage
              });

            if(obj != null){
                $scope.user = obj;
            }
            $scope.contactEnabled = true;
	    };


	    $scope.editContact = function () {
            $('.profile__contact .fa-pencil, .profile__contact input').css({
                    'opacity': 1,
                    'background-color': 'rgba(150, 150, 150, 0.1)',
                    'height':'31px'

                })
            $('.pbl-profile-link').css({
                    'margin-top': '20px!important'

                })


	            $scope.contactEnabled = false;
	    };

        //Edit links code

        $scope.cancelSocial = function () {
            console.log('hej')
                $(' .profile__social .fa-pencil, .profile__social input').css({
                    opacity: 0
                })
	            $scope.linksEnabled = true;
                $scope.linkedin = obj.linkedin;
                $scope.twitter = obj.twitter;
                $scope.facebook = obj.facebook;
                $scope.github = obj.github;
        };

         $scope.saveSocial = function (){
             $('.profile__social .fa-pencil, .profile__social input').css({
                    opacity: 0
                })
            $scope.linksEnabled = true;
            obj.linkedin = $scope.linkedin;
            obj.twitter = $scope.twitter;
            obj.facebook = $scope.facebook;
            obj.github = $scope.github;

            User.update({
                _id: obj._id
            },{
                linkedin: obj.linkedin,
                twitter: obj.twitter,
                facebook: obj.facebook,
                github: obj.github
              });

            if(obj != null){
                $scope.user = obj;
            }
            $scope.linksEnabled = true;
	    };


	    $scope.editLinks = function () {
            $('.profile__social .fa-pencil, .profile__social input').css({
                    'opacity': 1,
                    'background-color': 'rgba(150, 150, 150, 0.1)',
                    'height':'31px'
                })
	            $scope.linksEnabled = false;
	    };


        $scope.showAddDiv = function () {

            $("#addExp").css({
                'display': 'none'
            })

            $('.show_add_div').css({
                'display': 'block'
            })

            $('.profile__stuff__ex ul').css({
                'display': 'none'
            })
        }

        $scope.closeAddDiv = function () {
            $('input, textarea').val('');
            $('.show_add_div').css({
                'display': 'none'
            })

            $('.profile__stuff__ex ul').css({
                'display': 'block'
            })

            $("#addExp").css({
                'display': 'block'
            })
            isEditing = false;
        }

        notFilled = function(field){
        	return (field === undefined || field === "")
        }

	    addExp = function () {
	    	if(notFilled($scope.company_school) && notFilled($scope.title_education) && notFilled($scope.location)){
	    		return;
	    	}
            if(obj.experiences === undefined){
	        		obj.experiences = [];
	        	}

	            obj.experiences.push({
	            	company_school : $scope.company_school,
	        		title_education: $scope.title_education,
				    location: $scope.location,
				    info: $scope.info
				});

	        	User.update({
	                _id: obj._id
	            },{ $push: {
	                  experiences:{
	                    company_school : $scope.company_school,
		        		title_education: $scope.title_education,
					    location: $scope.location,
					    info: $scope.info
	                  }
	              }
	            });

	            if(obj != null){
		            $scope.user = obj;
		   		}

	            //$scope.expEnabled = true;
                $('.show_add_div').css({
                'display': 'none'
                })

                $('.profile__stuff__ex ul').css({
                'display': 'block'
                })

                $('.fa-plus').css({
                'display': 'block'
                })
                console.log('should be hided')
	            $scope.class = "fa fa-pencil";

	    };

        $scope.showMoreExpInfo = function() {
            if (this.showOnClickMoreInfo == true){
                this.showOnClickMoreInfo = false;
            } else{
                this.showOnClickMoreInfo = true;
            }

        };

	    editExp = function(){
	    	if(notFilled($scope.company_school) && notFilled($scope.title_education) && notFilled($scope.location)){
	    		return;
	    	}

            $.each(obj.experiences, function(){
                if(this._id == $scope.exp._id){
                    this.company_school = $scope.company_school,
	        		this.title_education = $scope.title_education,
				    this.location = $scope.location,
				    this.info = $scope.info
                }
            });

            User.update({
               	_id: obj._id,
                experiences: {$elemMatch: {_id: $scope.exp._id}}
            },{
                "experiences.$.company_school" :  $scope.company_school,
                "experiences.$.title_education" : $scope.title_education,
                "experiences.$.location": $scope.location,
				"experiences.$.info": $scope.info
            }, function(res){
                console.log(res);
            });

            $('.show_add_div').css({
                'display': 'none'
                })

                $('.profile__stuff__ex ul').css({
                'display': 'block'
                })

                $('.fa-plus').css({
                'display': 'block'
            })
	    };

	    $scope.prepareEditExp = function(exp){

            $scope.exp = exp;

	    	 isEditing = true;


            $scope.company_school = exp.company_school;
            $scope.title_education = exp.title_education;
            $scope.location = exp.location;
			$scope.info = exp.info;

            $scope.showAddDiv();
	    }

	    $scope.addOrUpdateExp = function(){
	    	if(isEditing === false){
                console.log('add');
	    		addExp();
                $('input, textarea').val('');
	    	}else{
                console.log('edit');
	    		editExp();
                $('input, textarea').val('');
	    	}
	    }

        $scope.removeExp = function(exp){
            var i = obj.experiences.indexOf(exp)

            if(i != -1){
                obj.experiences.splice(i,1);
            }

           User.update({
                  _id: obj._id,
           },{
               $pull: {
                   experiences : exp
               }
           });
        };


        $scope.addSkill = function () {

        	if(notFilled($scope.searchTag)){
                 console.log($scope.searchTag);
        		return;
        	}

	        if(obj.skills === undefined){
        		obj.skills = [];
        	}


        	Tag.get({tag: $scope.searchTag},function(tag){
				if(tag.length === 0){
					Tag.create({
              			tag: $scope.searchTag
          			});
          			$scope.tag.push($scope.searchTag);
				}
			});

			var exist = false;

			for (var i = obj.skills.length - 1; i >= 0; i--) {
				if(obj.skills[i].tag === $scope.searchTag)
				{
					exist = true;
				}
			}

			if(exist === false){
				obj.skills.push({
            		tag : $scope.searchTag
				});

	        	User.update({
	                _id: obj._id
	            },{ $push: {
	                  skills:{
	                    tag : $scope.searchTag
	                  }
	              }
	            });

	            if(obj != null){
		            $scope.user = obj;
		            $('input').val('');
		   		}
			}
	    };

	    $scope.removeSkill = function(skill){
            var i = obj.skills.indexOf(skill)

            if(i != -1){
                obj.skills.splice(i,1);
            }

           User.update({
                  _id: obj._id,
           },{
               $pull: {
                   skills : skill
               }
           });
        };

	    var getUser = function () {
			SessionService.getSession().success(function(response) {
				User.get({_id:response.user._id, _populate:"courses"},function(newUser){
 					initializeProfile(newUser[0]);
				});
			});
	    }

        showUploadDivOnHover = function(){
            $('.profile__about__img').mouseenter(function(event){
                event.stopPropagation();
                $(this).find('.upload_img').animate({
                    opacity: 1
                }, 200, function() {
                    // Animation co
                })
            });

            $('.profile__about__img').mouseleave(function(event){
                $(this).find('.upload_img').animate({
                    opacity: 0
                }, 2000, function() {
                    // Animation co
                })
            });

             $('.profile__about__img').click(function(event){
                $(this).find('.upload_img').animate({
                    opacity: 0
                }, 2000, function() {
                    // Animation co
                })
            });
        }

	    showPicture = function(){
	   		var pic = ""
        	if(obj == null){ return }

   			if(obj.profile_pic === undefined || obj.profile_pic === ""){
   				pic = "/img/profile_default.png";
            	$('.upload_img').css({
                	'opacity': '1',
                	'cursor': 'pointer'
            	})
   			}else{
            	showUploadDivOnHover();
   				pic = './uploads/' + obj.profile_pic;
   			}
    		$('.profile__about__img').css({
	    		'background' : 'url('+ pic + ')',
	    		'-webkit-background-size': 'contain',
			    '-moz-background-size': 'contain',
			    '-o-background-size': 'contain',
			    'background-size': 'contain'
			})
	    }

      	$scope.uploadPicture = function (file) {
            showUploadDivOnHover()
      		var strippedFileName = file.name.replace(/[\n\t\r\x20]/g, "_");
	        Upload.upload({
	            url: 'https://learningmadesimple.herokuapp.com/upload', //webAPI exposed to upload the file
	            data:{
	               	file: file
	            } //pass file as data, should be user ng-model
	        }).then(function (resp) {
	            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
	            obj.profile_pic = strippedFileName;

	            User.update({
	                _id: obj._id
	            },{
		            profile_pic: obj.profile_pic,
	              });

		        if(obj != null){
		            $scope.user = obj;
		            showPicture();
		        }

                // hideDivWhenUploaded() //NO DEFINITION?!?!?!?
	        }, function (resp) {
	            console.log('Error status: ' + resp.status);
	        }, function (evt) {
	            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
	            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
	        });
    	};

		getUser();
      }
    };
  }
]);
