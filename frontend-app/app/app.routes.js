(function() {
  /**
  * @ngdoc overview
  * 
  * @name interestHub.config
  * @description 
  *  
  *  Configuration for routing pages
  *
  */
    angular.module("interestHub")
        .config(function($routeProvider, $locationProvider) {
          console.log("router");
            $locationProvider
              .html5Mode(true);
            $locationProvider
              .hashPrefix("!"); 


            $routeProvider
              .when('/', {
                  templateUrl: 'modules/home/home.view.html',
                  controller: 'HomeCtrl'
                                  
              })
              .when('/home', {
                  templateUrl: 'modules/home/home.view.html',
                  controller: 'HomeCtrl'
                  
              })
              .when('/profile', {
                  templateUrl: 'modules/profile/profile.view.html',
                  controller: 'ProfileCtrl',
                  requireAuth: true
                  
                  /*resolve: {
                      loggedin: checkLoggedin
                  }*/
              }).when('/group-timeline', {
                 templateUrl: 'modules/group-timeline/group-timeline.view.html',
                 controller: 'GroupTimelineCtrl',
                 requireAuth: true                 
             })
              
              .when('/group/:id', {
                 templateUrl: 'modules/group-timeline/group-timeline.view.html',
                 controller: 'GroupTimelineCtrl',
                 requireAuth: true                 
             })

             .when('/search/:q', {
                templateUrl: 'modules/search/search.view.html',
                controller: 'SearchCtrl',
                requireAuth: true
             })
             .when('/user/:id', {
                templateUrl: 'modules/profile/profile.view.html',
                 controller: 'ProfileCtrl',
                 requireAuth: true                 
                 
            })
             
             .when('/guest-timeline', {
                 templateUrl: 'modules/guest-timeline/guest-timeline.view.html',
                 controller: 'GuestTimelineCtrl'
             })
          
              .when('/login', {
                  templateUrl: 'modules/login/login.view.html',
                  controller: 'LoginCtrl',
                  controllerAs: 'model',
                  requireAuth: true                  
              })
              .when('/register', {
                  templateUrl: 'modules/register/register.view.html',
                  controller: 'RegisterCtrl',
                  controllerAs: 'model',
                  requireAuth: true                  
              })
              .when('/timeline', {
                  templateUrl: 'modules/timeline/timeline.view.html',
                  controller: 'TimelineCtrl',
                  requireAuth: true
                  
              })
        .when('/groupcreate', {
                  templateUrl: 'modules/groupcreate/groupcreate.view.html',
                  controller: 'GroupCtrl',
                  requireAuth: true                  
              })
        .when('/templatecreate', {
                  templateUrl: 'modules/templatecreate/templatecreate.view.html',
                  controller: 'TemplateCreateCtrl',
                  requireAuth: true                  
              })
        .when('/postcreate', {
                  templateUrl: 'modules/postcreate/postcreate.view.html',
                  controller: 'PostCreateCtrl',
                  requireAuth: true                  
              })

        .when('/allgroups', {
                templateUrl: 'modules/listgroups/listgroups.view.html',
                controller: 'ListGroupsCtrl',
                requireAuth: true                  
            })

            .when('/group/:id/search/:q', {
                templateUrl: 'modules/search/groupsearch.view.html',
                controller: 'SearchCtrl',
                requireAuth: true                  
            });
/*
              .otherwise({
                  redirectTo: '/'
              });
*/

          
        })

        .run(
            
            function($rootScope, $location, $localStorage) {
                
                        $rootScope.$on('$routeChangeStart', function(angularEvent, newUrl) {
                
                            if (newUrl.requireAuth && !$localStorage.token) {
                                // User isn’t authenticated
                                $location.path("/home");
                            }
                
                        });
                    }

            );

    /*
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope)
    {
        var deferred = $q.defer();
    
        $http.get('/api/loggedin').success(function(user)
        {
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
                $rootScope.currentUser = user;
                deferred.resolve();
            }
            // User is Not Authenticated
            else
            {
				$rootScope.role=false;
                $rootScope.errorMessage = 'You need to log in.';
                deferred.reject();
                $location.url('/login');
            }
        });
        
        return deferred.promise;
    };

	var checkRole = function($q, $timeout, $http, $location, $rootScope)
	{
		 var deferred = $q.defer();
    
        $http.get('/api/loggedin').success(function(user)
        {
			if(user !== '0' && user.role=="manager"){
				$rootScope.role = true;		
				deferred.resolve();
			}
		});
		return deferred.promise;	
	};	

    
    var checkCurrentUser = function($q, $timeout, $http, $location, $rootScope)
    {
		console.log("check current user");
        var deferred = $q.defer();
    
        $http.get('/api/loggedin').success(function(user)
        {
			
            $rootScope.errorMessage = null;
            // User is Authenticated
            if (user !== '0')
            {
				console.log("authorized");
                $rootScope.currentUser = user;
                if(user.role== "manager"){
                    $rootScope.role = true;   

                }else{
                    $rootScope.role = false;
                }
            }else{
				$rootScope.role = false;			
			}
        console.log($rootScope.role);
            deferred.resolve();
        });
        
        return deferred.promise;
    };

  */
})();