(function()
{
     /**
     * @ngdoc controller
     * @name ProfileCtrl
     * @description
     * 
     * Controller for user profile page
     */

     angular
        .module("interestHub")
        .directive('fileUpload', ['$parse', function ($parse) {
              return {
                  restrict: 'A',
                  link: function(scope, element, attrs) {
                      var model = $parse(attrs.fileModel);

                      element.bind('change', function(){
                      scope.$emit("photoSelected",[element[0].id,element[0].files[0]]);
                      });
                  }
              };
          }])
        .controller("ProfileCtrl", ProfileCtrl);
    
    function ProfileCtrl($scope,  $rootScope, $routeParams, $q, $location, UserService, ContentService, GroupService, $localStorage, TagService)
    {
        $scope.me = false;
        $scope.follow = false;
        $scope.removeInterest = removeInterest;
        $scope.addInterest = addInterest;
        $scope.editUser = editUser;
        $scope.followUser = followUser;
        $scope.unfollowUser = unfollowUser;
    	 /**
         * @ngdoc
         * @name init
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for initialization of user in profile page
         * 
         */ 
        function init(){


            if($location.path() == '/profile' || $routeParams.id == $localStorage.user.id){
                $scope.me = true;
        		UserService.getLoggedInUser()
        			.then(handleSuccess, handleError);
            }else{
                UserService.getUser($routeParams.id)
                    .then(handleSuccess,handleError);
               
            }

    	
        }
         $scope.files = [];
        init();
	    
        
         /**
         * @ngdoc
         * @name handleSuccess
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for getting user's groups, followings, followers and contents
         * @param {object} user the owner of the profile
         */ 
      	function handleSuccess(response) {
            
            $scope.user = response.data;
           
            console.log($scope.user.profile.interests);            
            if($scope.me == false){
                isFollow();
            }
            
            $scope.posts = [];
            $scope.groups = []; 
            $scope.followings = [];
            $scope.followers = [];
            posts = [];
            UserService.getGroups($scope.user.id)
                .then(function(response){
                    $scope.groups = response.data;
                });

            UserService.getContents($scope.user.id)
                .then(function(response){
                    console.log(response.data);
                     posts = response.data;
                     $q.all(posts.map(function (post) {
                        GroupService.getGroup(post.groups[0])
                            .then(
                                function(response){
                                    if(response.status != 404){
                                        post.group = response.data;
                                    };
                                },handleError);
                        ContentService.getCommentsOfContent(post.id)
                                .then(function (response) {
                                    post.comments = response.data;
                                     $q.all(post.comments.map(function (comment) {
                                        UserService.getUser(comment.owner.id)
                                            .then(function(response){
                                                comment.owner = response.data;
                                            },handleError);
        
                                        })).then(function () {
                                        }); 
                                },handleError);
                        ContentService.getVotesOfContent(post.id)
                                .then(function (response) {
                                    post.votes = response.data;
                                    console.log(post.votes);
                                    var like = 0;
                                    var dislike = 0;
                                    for (var i = 0; i < post.votes.length; i++){
                                        if (post.votes[i].isUp == true){
                                            like = like + 1;
                                        }else{
                                            dislike = dislike + 1;
                                        }
                                    }
                                    post.likes = like;
                                    post.dislikes = dislike;
                                },handleError);
                        $scope.posts.push(post);
            
                    })).then(function () {
                    });
                },handleError);  
           
            UserService.getFollowings($scope.user.id)
                .then(function(response){
                    followings = response.data;

                     $q.all(followings.map(function (following) {
                         UserService.getUser(following.id)
                            .then(function(response){
                                following = response.data;
                                 $scope.followings.push(following);
                            },handleError);
                           
                    })).then(function () {
                    }); 

                    if($localStorage.user.id != $scope.user.id){
                        UserService.getFollowingsOfCurrent()
                            .then(function(response){
                                followingsOfCurrent = response.data;
                                for(var i = 0 ; i < $scope.followings.length;i++){
                                    $scope.followings[i].isFollowed = true;
                                    for(var j = 0; j < followingsOfCurrent.length; j++){
                                        if($scope.followings[i].id == followingsOfCurrent.id){
                                            $scope.followings[i].isFollowed = false;
                                            break;
                                        }
                                    }

                                }
                            },handleError);

                    }
                },handleError);
            UserService.getFollowers($scope.user.id)
                .then(function(response){
                    followers = response.data;
                     $q.all(followers.map(function (follower) {
                         UserService.getUser(follower.id)
                            .then(function(response){
                                console.log(response.data);
                                follower = response.data;
                                 $scope.followers.push(follower);
                            },handleError);

                           
                    })).then(function () {
                    }); 
                });     

        }

         /**
         * @ngdoc
         * @name isFollow
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for checking whether the logged in user is following the owner of the profile or not
         * @param {int} userID the id of the owner of the profile
         */ 
        function isFollow(userID){
            UserService.getFollowingsOfCurrent()
                .then(function(response){
                    followings = response.data;
                    for(var i = 0; followings.length;i++ ){
                        if(followings[i].id == $scope.user.id){
                            $scope.follow = true;
                            return true;
                        }
                    }
                    return false;
                },handleError);
        }

        function handleError(error) {
            $scope.error = error;
        }

        /**
         * @ngdoc
         * @name editUser
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for updating user profile
         * @param {object} user the user will be updated
         */        
        function editUser(user){
            console.log(user);

            user = JSON.parse(angular.toJson(user));
            console.log(JSON.parse(angular.toJson(user)));
            delete user.profile.interests.id;
            user.profile.birthdate;
            console.log(user.profile.interests);
            interests = [];
            for(var i =0 ; i<user.profile.interests.length;i++ ){
                interest = {};
                interest.label = user.profile.interests[i].label;
                if (user.profile.interests[i].url.indexOf("http")==-1) {
                    user.profile.interests[i].url = "http:" + user.profile.interests[i].url;
                }
                interest.url =  user.profile.interests[i].url;
                interest.description = user.profile.interests[i].description;
                console.log(interest);
                interests.push(interest);
            }
            console.log(interests);
            user.profile.interests = interests;
            editedUser = {};
            console.log(user.profile);
            //interests = JSON.parse(angular.toJson(interests));
            editedUser.profile = user.profile;
            delete editedUser.profile.photo;/*{"profile":  {
                                            "interests": interests
                            }
                        };*/
            console.log(editedUser);

             
            
            UserService.updateUser($scope.user.id, angular.toJson(editedUser))
                .then(handleSuccess,handleError);
            for(i=0;i<$scope.files.length;i++){
                if($scope.files[i] != null){
                    var y=Object.keys($scope.files[i]);
                   
                    console.log("profile");
                    UserService
                        .uploadProfile($scope.files[i][y[0]])
                            .then(function(res){
                                console.log(res.data);
                            },handleError);
                    
                }
            }
            console.log($scope.files);
            $scope.files=[];
            $scope.edit=false;
        }
        /**
         * @ngdoc
         * @name followUser
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for following the owner of profile page
         * 
         */
        function followUser(){
            console.log($scope.user.id);
            UserService.followUser($scope.user.id)
                .then(function(response){
                    $scope.follow = true;
                    console.log($localStorage.user);
                    $scope.followers.push($localStorage.user);
            },handleError);
        }
        /**
         * @ngdoc
         * @name unfollowUser
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for unfollowing the owner of profile page
         * 
         */
        function unfollowUser(){
            console.log($scope.user.id);
            UserService.unfollowUser($scope.user.id)
                .then(function(response){
                    $scope.follow = false;
                    console.log($localStorage.user);
                    $scope.followers.splice($localStorage.user);
            },handleError);
        }

          var _selected;
         
          $scope.selected = undefined;

          $scope.ngModelOptionsSelected = function(value) {
            if (arguments.length) {
              _selected = value;
            } else {
              return _selected;
            }
          };

          $scope.modelOptions = {
            debounce: {
              default: 500,
              blur: 250
            },
            getterSetter: true
          };


            /**
         * @ngdoc
         * @name searchTag
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for searching tags
         * @param {string} input the input will be searched in wikidata  
         * @returns {Array} tags the search results from wikidata
         */ 

        $scope.searchTag = function(val) {
			return TagService.searchTag(val)
                .then(function(response){
                    console.log(response.data.search);
                    return tags = response.data.search;
                }
                ,handleError);
				
            			
         };
     
	     /**
         * @ngdoc
         * @name removeInterest
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for removing interest
         * @param {object} interest the interest will be removed from view 
         */   
        function removeInterest($index){
            $scope.user.profile.interests.splice($index,1);
        }
        /**
         * @ngdoc
         * @name addInterest
         * @methodOf ProfileCtrl
         *
         * @description
         * Method for adding interest
         * @param {object} interest the interest will be added to view
         */ 
        function addInterest(interest){
            if (interest != ""){

                var tagStored = {
                    "label" : interest.label ,
                    "description" : interest.description,
                    "url" : interest.url
                }
                $scope.user.profile.interests.push(tagStored);
                $scope.selected = undefined;
            }

        }
        $scope.$on("photoSelected", function (event, args) {
            $scope.$apply(function () {            
                //add the file object to the scope's files collection
                
                var x={
                    [args[0]]:args[1]
                }
                for(i=0;i<$scope.files.length;i++){
                    var y=Object.keys($scope.files[i]);
                    if(y[0]==args[0]){
                        $scope.files.splice(i,1);
                    }
                }
                    $scope.files.push(x);
                
                
                console.log($scope.files);
            });
        });

    }

  
     
})();
