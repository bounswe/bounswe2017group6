(function()
{

    /**
     * @ngdoc controller
     * @name GroupTimelineCtrl
     * @description
     * 
     * Controller for showing/editting/controlling the group page  
     */
    angular
        .module("interestHub")
        .controller("GroupTimelineCtrl", GroupTimelineCtrl);
    
    function GroupTimelineCtrl($scope, $q, $rootScope,  $location, $routeParams, GroupService, TemplateService, UserService, $localStorage)
    {
      $scope.joined = false;  
      console.log($scope.joined);
      checkJoined();
      $scope.joinGroup = joinGroup;
      $scope.leaveGroup = leaveGroup;
      console.log($routeParams.id);
    
      $scope.group = GroupService.getGroup($routeParams.id)
                        .then(handleSuccess,handleError);
       /**
         * @ngdoc
         * @name checkJoined
         * @methodOf GroupTimelineCtrl
         *
         * @description
         * Method for checking whether the logged in user is joined this group or not 
         * 
         */ 
      function checkJoined(){
        UserService.getLoggedInUser().then(function(response){
          console.log(response.data);
             UserService.getGroups(response.data.id)
            .then(function(response){
              groups = response.data;
              for(var i = 0; i < groups.length;i++){
                if(groups[i].id == $routeParams.id){

                  $scope.joined = true;
                  return true;
                }
              }
              return false;
            },handleError);
        });
       
      }
        /**
         * @ngdoc
         * @name handleSuccess
         * @methodOf GroupTimelineCtrl
         *
         * @description
         * Method for assigning the fields of groups to $scope
         * @param {object} group the group will be shown
         */ 
      function handleSuccess(response) {
            $scope.group = response.data;
            $scope.members = [];
            members = [];   
            GroupService.getMembers($routeParams.id)
                    .then(function(response){
                        members = response.data;             
                        console.log($scope.members);
                        $q.all(members.map(function (member) {
                          UserService.getUser(member.id)
                              .then(
                                  function(response){
                                      if(response.status != 404){
                                          member = response.data;
                                          console.log(member);
                                      };
                                           $scope.members.push(member);
                                  },handleError);
                     
            
                })).then(function () {
                });
              },handleError);

                   
      }

      function handleError(error) {
            $scope.error = error;
            console.log(error);

      }
       /**
         * @ngdoc
         * @name joinGroup
         * @methodOf GroupTimelineCtrl
         *
         * @description
         * Method for joining a group
         * @param {int} groupId the group will be joined
         */ 
      function joinGroup(groupId){
        $scope.joined = true;
          GroupService.joinGroup(groupId)
              .then(function(response){
                console.log(response.data);
                  $scope.members.push($localStorage.user);
                  console.log($scope.members);
              },handleError);
      }
      /**
         * @ngdoc
         * @name leaveGroup
         * @methodOf GroupTimelineCtrl
         *
         * @description
         * Method for leaving a group
         * @param {int} groupId the group will be leaved
         */ 
      function leaveGroup(groupId){
        $scope.joined = false;
          GroupService.leaveGroup(groupId)
              .then(function(response){
                console.log(response.data);
                  $scope.members.splice(groupId,1);
                  console.log($scope.members);

              },handleError);
      }

      $scope.tab = "timeline";

      $scope.today = function() {
        $scope.dt = new Date();
      };
      $scope.today();

      $scope.clear = function() {
        $scope.dt = null;
      };

      $scope.inlineOptions = {
        customClass: getDayClass,
        minDate: new Date(),
        showWeeks: true
      };

      $scope.dateOptions = {
        dateDisabled: disabled,
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(),
        startingDay: 1
      };

      function disabled(data) {
        var date = data.date,
          mode = data.mode;
        return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
      }

      $scope.toggleMin = function() {
        $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
        $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
      };

      $scope.toggleMin();

      $scope.openModal = function() {
        $scope.popup1.opened = true;
      };

      $scope.setDate = function(year, month, day) {
        $scope.dt = new Date(year, month, day);
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];
      $scope.altInputFormats = ['M!/d!/yyyy'];

      $scope.popup1 = {
        opened: false
      };
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);
      $scope.events = [
        {
          date: tomorrow,
          status: 'full'
        },
        {
          date: afterTomorrow,
          status: 'partially'
        }
      ];

      function getDayClass(data) {
        var date = data.date,
          mode = data.mode;
        if (mode === 'day') {
          var dayToCheck = new Date(date).setHours(0,0,0,0);

          for (var i = 0; i < $scope.events.length; i++) {
            var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

            if (dayToCheck === currentDay) {
              return $scope.events[i].status;
            }
          }
        }

        return '';
      }
      
      
      
     
    	}
})();