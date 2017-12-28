
(function()
{
    /**
     * @ngdoc controller
     * @name GroupCtrl
     * @description
     * 
     * Controller for creating/getting/updating/deleting and showing groups
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
        .controller("GroupCtrl", GroupCtrl)
		
    
    function GroupCtrl($scope,  $rootScope, $location, GroupService, $window,TagService, $http, UserService)
    {
        $scope.remove = remove;
        $scope.update = update;
        $scope.add    = add;
        $scope.addTag = addTag;
        $scope.removeTag = removeTag;
        $scope.tab = {};
        /**
         * @ngdoc
         * @name init
         * @methodOf GroupCtrl
         *
         * @description
         * Method for initialization of groups by getting all of them
         * 
         */ 
        function init() {
      
            UserService.getLoggedInUser()
            .then(handleUser, handleError);


            function handleUser(response) {
                $scope.user=response.data;

                UserService.getGroups($scope.user.id)
                .then(function(response){
                    $scope.groups = response.data;
                });

            }
        }
        init();
       
        function handleTag(response){

            $scope.tags = response.data;
        }
       
        /**
         * @ngdoc
         * @name remove
         * @methodOf GroupCtrl
         *
         * @description
         * Method for removing a group
         * @param {object} group the group will be deleted
         */ 

        function remove(group)
        {
            GroupService
                .deleteGroup(group._id)
                .then(handleSuccess, handleError);
        }
        
        /**
         * @ngdoc
         * @name update
         * @methodOf GroupCtrl
         *
         * @description
         * Method for updating a group
         * @param {object} group the group will be updated
         */ 
        function update(group)
        {
       

            GroupService
                .updateGroup(group._id, group)
                .then(handleSuccess, handleError);
        }
        /**
         * @ngdoc
         * @name add
         * @methodOf GroupCtrl
         *
         * @description
         * Method for adding a group
         * @param {object} group the group will be added
         */
        function add(group1)
        {	
			group=angular.copy(group1);
            //tags = JSON.parse(angular.toJson(group.tags));
			
            for(i=0;i<group.tags.length;i++){
				group.tags[i].url="https:"+group.tags[i].url;
				
			}
			//group.tags = [];
            
            if(group.is_public == "public"){
                group.is_public = true;
            }else{
                group.is_public = false;
            }
			console.log(group);
			
            GroupService
                .createGroup(group)
                .then(handleSuccessGroup, handleError);    
            console.log("added");
		
            $scope.newgroup.tags = [];


        }
        /**
         * @ngdoc
         * @name handleSuccessGroup
         * @methodOf GroupCtrl
         *
         * @description
         * Method for pushing a new group to $scope
         * @param {object} group the group will be added
         */      
        function handleSuccessGroup(response) {
			fil=$scope.files;
			for(i=0;i<fil.length;i++){
				var y=Object.keys(fil[i]);
				if(y[0]=="logo"){
					console.log("logo");
					GroupService
						.uploadLogo(response.data.id,fil[i][y[0]])
						.then(function(res){
							console.log(res.data);
						},handleError)
				}
				else if(y[0]=="cover"){
					console.log("cover")
					GroupService
						.uploadCover(response.data.id,fil[i][y[0]])
						.then(function(res){
							console.log(res.data);
						},handleError)
					
				}
			}
            $scope.groups.push(response.data);
			console.log($scope.files);
			$scope.files=[];
			
            $location.path('/group/'+response.data.id);

        }

        /**
         * @ngdoc
         * @name handleSuccess
         * @methodOf GroupCtrl
         *
         * @description
         * Method for assigning the groups to $scope.groups
         * @param {Array} groups the groups will be assigned and shown  
         */ 
        function handleSuccess(response) {
            $scope.groups = response.data;
            
        }

        function handleError(error) {
            $scope.error = error;
        }

        
                 
          var _selected;
          $scope.newgroup = {};
          $scope.newgroup.tags = [];
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
         * @methodOf GroupCtrl
         *
         * @description
         * Method for searching tags
         * @param {string} input the input will be searched in wikidata  
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
         * @name addTag
         * @methodOf GroupCtrl
         *
         * @description
         * Method for adding tag
         * @param {object} tag the tag will be added to view
         */ 
          function addTag(tag) {
            if (tag != ""){

                var tagStored = {
                    "label" : tag.label ,
                    "description" : tag.description,
                    "url" : tag.url
                }
              
                $scope.newgroup.tags.push(tagStored);
                $scope.selected = undefined;
            }
          }

        /**
         * @ngdoc
         * @name removeTag
         * @methodOf GroupCtrl
         *
         * @description
         * Method for removing tag
         * @param {object} tag the tag will be removed from view 
         */ 
        function removeTag($index){
            $scope.newgroup.tags.splice($index,1);
        }
		
		$scope.files = [];

		//listen for the file selected event
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
