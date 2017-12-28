(function()
{
     /**
     * @ngdoc controller
     * @name RecommendationCtrl
     * @description
     * 
     * Controller for recommendations
     */
    angular
        .module("interestHub")
        .controller("RecommendationCtrl", RecommendationCtrl);
        function RecommendationCtrl($scope,  $rootScope, $routeParams, $q, $location, $localStorage,UserService, RecommendationService)
        {
            $scope.suggestedUsers = [];
            $scope.suggestedGroups = [];
            function init() {
                RecommendationService.recommendUsers()
                    .then(getUsers, handleError);
                RecommendationService.recommendGroups()
                    .then(getGroups, handleError);

            }
            init();
             /**
             * @ngdoc
             * @name getUsers
             * @methodOf RecommendationCtrl
             *
             * @description
             * Method to assign recommended users
             * 
             * @param {object} response returned users
             */
            function getUsers(response) {
       
                console.log(response.data);
                suggestedUsers = response.data;
                   
                $q.all(suggestedUsers.map(function (user) {
                          UserService.getUser(user.id)
                              .then(
                                  function(response){
                                      if(response.status != 404){
                                          user = response.data;
                                    
                                      };
                                           $scope.suggestedUsers.push(user);
                                  },handleError);
                     
            
                })).then(function () {
                });
            }
            /**
             * @ngdoc
             * @name getGroups
             * @methodOf RecommendationCtrl
             *
             * @description
             * Method to assign recommended groups 
             * 
             * @param {object} response returned groups
             */
             function getGroups(response) {
       
                console.log(response.data);       
                $scope.suggestedGroups = response.data;
            }
             
            function handleError(error) {
                $scope.error = error;

            }   

        

        }
 })();