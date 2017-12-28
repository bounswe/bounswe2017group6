(function()
 {
 	/**
     * @ngdoc controller
     * @name SearchCtrl
     * @description
     * 
     * Controller for search page
     */
     angular
         .module("interestHub")
         .controller("SearchCtrl", SearchCtrl);
     
     function SearchCtrl($q, $scope,  $rootScope, $location,  $window, $routeParams, $timeout, PostService, SearchService, GroupService, UserService)
     {
         $scope.isSearched=false;
         $scope.searchedUsers=[];
         $scope.search = search;
         $scope.groupSearch = groupSearch;
         $scope.showGroups = showGroups;
         $scope.showPeople = showPeople;
         $scope.searchUser = searchUser;
         $scope.searchContent = searchContent;
         $scope.searchGroupContent = searchGroupContent;
         function search(query){
            console.log(query);

            $location.path("/search/"+query);

            console.log(query);
            console.log($routeParams);
            searchUser($routeParams.q);

            searchGroup(query);
            searchContent(query);
            searchGroupContent(query,$routeParams.id);
         }

         function groupSearch(query,groupId){
            console.log(query);
            $location.path("group/"+groupId+"/search/"+query);

            console.log($routeParams);

            searchGroupContent(query,groupId);
         }
         function showGroups(){
            GroupService.getAllGroups().then(function(response){
                $scope.groups = response.data;
            });
         }
         function showPeople(){

            UserService.getAllUsers().then(function(response){
                console.log(response.data);
                $scope.users = response.data;
            });
         }
         function init(){
            console.log("init");
            console.log($routeParams);
            searchUser($routeParams.q);
            searchGroup($routeParams.q);
            searchContent($routeParams.q);
            searchGroupContent($routeParams.q,$routeParams.id);
            /*GroupService.getAllGroups().then(function(response){
                $scope.groups = response.data;
            });*/
            /*UserService.getAllUsers().then(function(response){
                $scope.users = response.data;
            });*/
         }
         $scope.groupSec= true;
         $scope.peopleSec=true; 
         $scope.contentSec=true;
        $scope.users=[];
        init();
        

        /**

         * @ngdoc
         * @name searchUser
         * @methodOf SearchCtrl
         *
         * @description
         * Method for searching users
         * @param {string} input the string will be searched 
         * 
         */
        function searchUser(val) {
            console.log(val);
            console.log($routeParams.q);
            SearchService.searchUser(val)
               .then(function(response){
                console.log(response.data);
                users = response.data;
                  $q.all(users.map(function (user) {
                   
                    UserService.getUser(user.id)
                        .then(function (response) {
                                console.log(response.data);
                                user = response.data;
                                $scope.users.push(user);
                            },handleError);
                   
                   
                             
                    })).then(function () {
                    
                    }); 
               }
               ,handleError);
               
                       
        };

        function searchGroup(query){
            console.log("group"+query);
            SearchService.searchGroup(query)
                .then(function(response){
                    console.log(response.data);
                    $scope.groups = response.data;
                },handleError);
        }



         function searchContent(query){
             console.log("content"+query);
            SearchService.searchContent(query)
                .then(function(response){
                    console.log(response.data);
                    $scope.searchedContents = response.data;
                },handleError);
        }

		
		
      
        function searchGroupContent(query, groupId){

           console.log("groupcontent"+query);
         

                    SearchService.searchGroupContent(query, groupId)
                       .then(
                           function(response){
                               console.log(response.data);

                            $scope.query=query;
                        $scope.searchedGroupContents= response.data;   

                  
                  console.log("searchedGroupPosts",$scope.searchedGroupContents);
                  },handleError);
      }



      $scope.checkGroupContent = function(){
       if($scope.query.length === 0 || typeof $scope.query === 'undefined'){
           PostService
               .getAllPosts($routeParams.id)
               .then(handleSuccess, handleError);

       }else{
          
        }
      } 

        $scope.goToProfile=function (selected) {
            if($scope.isSearched==true){  

            angular.forEach($scope.searchedUsers, function(item, index) {
                console.log(item, index);
                console.log(selected);
                if(item.username==selected){
                    $location.path('/user/'+item.id);
                   }
              });
               
               
            } 
               
                       
        };

        function handleError(error) {
            $scope.error = error;
            $scope.isSearched=false;
        }
       

        $scope.goBack=function(){
            $location.path('group/'+$routeParams.id);
        }
  
 	}
 })();