(function(){
    /**
     * @ngdoc service
     * @name SearchService
     * @description
     * 
     * Service to send requests and get responses about group contents.
     */
    angular
        .module("interestHub")
        .factory("SearchService", SearchService);

    function SearchService($http, $localStorage) {
        var api = {
            searchGroup: searchGroup,
            searchUser: searchUser,
            searchContent: searchContent,
            searchGroupContent : searchGroupContent
        };
        return api;

        /**
         * @ngdoc
         * @name searchGroup
         * @methodOf TagService
         *
         * @description
         * Method to get search results of groups
         * @param {string} input the input will be searched
         * @returns {httpPromise} resolve with fetched data.
         */     
        function searchGroup(input){
            
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/search/groups/?q=' + input,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }



                /**
         * @ngdoc
         * @name searchUser
         * @methodOf TagService
         *
         * @description
         * Method to get search results of users
         * @param {string} input the input will be searched
         * @returns {httpPromise} resolve with fetched data.
         */     
        function searchUser(input){
            
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/search/users/?q=' + input,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }



                        /**
         * @ngdoc
         * @name searchContent
         * @methodOf TagService
         *
         * @description
         * Method to get search results of contents
         * @param {string} input the input will be searched
         * @returns {httpPromise} resolve with fetched data.
         */     
        function searchContent(input){
            
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/search/contents/?q=' + input,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }


                                /**
         * @ngdoc
         * @name searchGroupContent
         * @methodOf TagService
         *
         * @description
         * Method to get search results of contents in the group
         * @param {string} input the input will be searched
         * @returns {httpPromise} resolve with fetched data.
         */     
        function searchGroupContent(input, groupId){
            
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/search/?q=' + input,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }

    }
})();