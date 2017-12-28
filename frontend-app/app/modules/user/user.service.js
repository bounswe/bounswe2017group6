(function(){
    /**
     * @ngdoc service
     * @name UserService
     * @description
     * 
     * Service to send requests and get responses about users.
     */
    angular
        .module("interestHub")
        .factory("UserService", UserService);

    function UserService($http, $localStorage) {
        var api = {
            createUser: createUser,
            updateUser: updateUser,
            deleteUser: deleteUser,
            getUser: getUser,
            getAllUsers: getAllUsers,
            getLoggedInUser: getLoggedInUser,
            getFollowings: getFollowings,
            getFollowers: getFollowers,
            getFollowingsOfCurrent: getFollowingsOfCurrent,
            getFollowersOfCurrent: getFollowersOfCurrent,
            getContents: getContents,
            getGroups: getGroups,
            followUser: followUser,
            unfollowUser: unfollowUser,
            uploadProfile: uploadProfile
        };
        return api;
        /**
         * @ngdoc
         * @name getLoggedInUser
         * @methodOf UserService
         *
         * @description
         * Method to get logged in user from backend
         * @example
         * contentService.getLoggedInUser();
         * @returns {httpPromise} resolve with fetched data.
         */
        function getLoggedInUser(){
            
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/me/', {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name createUser
         * @methodOf UserService
         *
         * @description
         * Method to create a user
         * @param {object} user the user will be created
         * @returns {httpPromise} resolve with fetched data.
         */    
        function createUser(user){
            
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/users/',user , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name updateUser
         * @methodOf UserService
         *
         * @description
         * Method to update given user with given profile
         * @param {object} user the user will be updated 
         * @param {object} profile the new profile of the user
         * @returns {httpPromise} resolve with fetched data.
         */
        function updateUser(userID, profile){
            console.log(profile);
            /*console.log($http({
                    url: 'https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/users/'+userID+"/",
                    method: 'PATCH',
                    data: profile,
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': 'Bearer ' + $localStorage.token
                    }
                }));*/
            return $http.patch('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/users/'+userID+"/", profile , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token
                }
            });
        }
        /**
         * @ngdoc
         * @name uploadLogo
         * @methodOf UserService
         *
         * @description
         * Method to upload profile photo of user
         * @param {int} id of the user 
         * @param {file} new image to update profile
         * @returns {httpPromise} resolve with fetched data.
         */ 
        
        function uploadProfile(photo){
            var fd = new FormData();
            fd.append('file', photo);
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/me/',fd,{
                transformRequest: angular.identity,
                headers: {
                    'Content-Type' : undefined,
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name deleteUser
         * @methodOf UserService
         *
         * @description
         * Method to delete user with given id
         * @param {int} id the id of the user will be deleted
         * @returns {httpPromise} resolve with fetched data.
         */
        function deleteUser(userID){
            return $http.delete('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/users/'+userID , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name getUser
         * @methodOf UserService
         *
         * @description
         * Method to get user with given id
         * @param {int} id the id of the user will be got
         * @returns {httpPromise} resolve with fetched data.
         */
        function getUser(userID){
            console.log($localStorage.token);
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/users/'+userID , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name getAllUsers
         * @methodOf UserService
         *
         * @description
         * Method to get all users
         * 
         * @returns {httpPromise} resolve with fetched data.
         */
        function getAllUsers(){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/users/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name followUser
         * @methodOf UserService
         *
         * @description
         * Method to follow a user
         * @param {int} id the id of the user will be followed
         * @returns {httpPromise} resolve with fetched data.
         */
        function followUser(userId){
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/followings/', { "id": userId} ,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name unfollowUser
         * @methodOf UserService
         *
         * @description
         * Method to unfollow a user
         * @param {int} id the id of the user will be unfollowed
         * @returns {httpPromise} resolve with fetched data.
         */
        function unfollowUser(userId){

            return $http({
                    url: 'https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/followings/',
                    method: 'DELETE',
                    data: {
                        id: userId
                    },
                    headers: {
                        "Content-Type": "application/json;charset=utf-8",
                        'Authorization': 'Bearer ' + $localStorage.token
                    }
                });
            /*$http.delete('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/followings/', { "id": userId} ,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });*/
        }

         /**
         * @ngdoc
         * @name getFollowingsOfCurrent
         * @methodOf UserService
         *
         * @description
         * Method to get followings of logged in user
         * 
         * @returns {httpPromise} resolve with fetched data.
         */
        function getFollowingsOfCurrent(){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/followings/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name getFollowersOfCurrent
         * @methodOf UserService
         *
         * @description
         * Method to get followers of logged in user
         * 
         * @returns {httpPromise} resolve with fetched data.
         */
         function getFollowersOfCurrent(){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/followers/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name getFollowings
         * @methodOf UserService
         *
         * @description
         * Method to get followings of user with given id 
         * @param {int} id the id of the user whose followings will be got
         * @returns {httpPromise} resolve with fetched data.
         */
         function getFollowings(userId){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/user/'+userId+'/followings/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name getFollowers
         * @methodOf UserService
         *
         * @description
         * Method to get followers of user with given id 
         * @param {int} id the id of the user whose followers will be got
         * @returns {httpPromise} resolve with fetched data.
         */
         function getFollowers(userId){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/user/'+userId+'/followers/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name getContents
         * @methodOf UserService
         *
         * @description
         * Method to get contents of user with given id 
         * @param {int} id the id of the user whose contents will be got
         * @returns {httpPromise} resolve with fetched data.
         */
         function getContents(userId){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/user/'+userId+'/contents/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name getGroups
         * @methodOf UserService
         *
         * @description
         * Method to get groups of user with given id 
         * @param {int} id the id of the user whose groups will be got
         * @returns {httpPromise} resolve with fetched data.
         */
        function getGroups(userId){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/user/'+userId+'/groups/' , {
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        


    }
})();