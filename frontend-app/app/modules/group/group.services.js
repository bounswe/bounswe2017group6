(function(){
    /**
     * @ngdoc service
     * @name GroupService
     * @description
     * 
     * Service to send requests and get responses about groups.
     */
    angular
        .module("interestHub")
        .factory("GroupService", GroupService);

    function GroupService($http, $localStorage) {
        var api = {
            createGroup: createGroup,
            updateGroup: updateGroup,
            deleteGroup: deleteGroup,
            getGroup: getGroup,
            getAllGroups: getAllGroups,
            getMembers: getMembers,
            joinGroup: joinGroup,
            leaveGroup: leaveGroup,
			uploadCover:uploadCover,
			uploadLogo:uploadLogo,
            getWaitings:getWaitings,
            acceptRequest:acceptRequest

        };
        return api;
         /**
         * @ngdoc
         * @name createGroup
         * @methodOf GroupService
         *
         * @description
         * Method to create a group
         * @param {object} group the group will be created
         * @returns {httpPromise} resolve with fetched data.
         */    
        
        function createGroup(group){
            console.log(group);
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/',group , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
		
		/**
         * @ngdoc
         * @name uploadLogo
         * @methodOf GroupService
         *
         * @description
         * Method to upload logo of a group
		 * @param {groupID} id of the group 
         * @param {logo} new image to update logo
         * @returns {httpPromise} resolve with fetched data.
         */ 
		
		function uploadLogo(groupID,logo){
            var fd = new FormData();
			console.log(logo);
			fd.append('file', logo);
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupID+'/logo/',fd,{
				transformRequest: angular.identity,
                headers: {
                    'Content-Type' : undefined,
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
		
        function acceptRequest(groupId,userId){
            console.log(groupId);
            console.log(userId);
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId +'/waitings/',{"id":userId},{
                headers: {
                  
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
		/**
         * @ngdoc
         * @name uploadCover
         * @methodOf GroupService
         *
         * @description
         * Method to upload cover of a group
		 * @param {groupID} id of the group 
         * @param {cover} new image to update cover photo
         * @returns {httpPromise} resolve with fetched data.
         */ 
		
		function uploadCover(groupID,cover){
            var fd = new FormData();
			console.log(cover);
			fd.append('file', cover);
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupID+'/cover/',fd,{
				transformRequest: angular.identity,
                headers: {
                    'Content-Type' : undefined,
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
		
        /**
         * @ngdoc
         * @name updateGroup
         * @methodOf GroupService
         *
         * @description
         * Method to update a group with given id and group object
         * @param {int} groupId the id of the group will be updated
         * @param {object} group the updated group
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function updateGroup(groupID, group){
            return $http.put('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/'+groupID, group , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name deleteGroup
         * @methodOf GroupService
         *
         * @description
         * Method to delete a group
         * @param {int} groupId the id of the group will be deleted
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function deleteGroup(groupID){
            return $http.delete('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/'+groupID , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name getGroup
         * @methodOf GroupService
         *
         * @description
         * Method to get a group with given group id
         * @param {int} groupId the id of the group will be got
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getGroup(groupID){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/'+groupID , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }

        function getWaitings(groupID){
            //http://34.209.230.231:8000/group/21/waitings/
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupID +'/waitings/', {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name getAllGroups
         * @methodOf GroupService
         *
         * @description
         * Method to get all groups
         * 
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getAllGroups(){
            console.log('Bearer '+ $localStorage.token);
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }

        /**
         * @ngdoc
         * @name joinGroup
         * @methodOf GroupService
         *
         * @description
         * Method to join a group with given group id
         * @param {int} groupId the id of the group will be joined
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function joinGroup(groupID){
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupID+'/members/', {},{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer '+$localStorage.token
                }
            });
        }
         /**
         * @ngdoc
         * @name leaveGroup
         * @methodOf GroupService
         *
         * @description
         * Method to leave a group with given group id
         * @param {int} groupId the id of the group will be leaved
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function leaveGroup(groupID){
        
            return $http.delete('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupID+'/members/',{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer '+$localStorage.token
                }
            });
        }
        /**
         * @ngdoc
         * @name getMembers
         * @methodOf GroupService
         *
         * @description
         * Method to get members of a group with given id 
         * @param {int} groupId the id of the group whose members will be get
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getMembers(groupID){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupID+'/members/', {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }


    }
})();