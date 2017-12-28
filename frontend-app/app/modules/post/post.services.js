(function(){
    /**
     * @ngdoc service
     * @name PostService
     * @description
     * 
     * Service to send requests and get responses about group contents.
     */
    angular
        .module("interestHub")
        .factory("PostService", PostService);

    function PostService($http, $localStorage) {
        var api = {
            createPost: createPost,
			uploadImage: uploadImage,
            updatePost: updatePost,
            deletePost: deletePost,
            getPost: getPost,
            getAllPosts: getAllPosts
        };
        return api;

        /**
         * @ngdoc
         * @name createPost
         * @methodOf PostService
         *
         * @description
         * Method to create a post with given group id and post object
         * @param {int} groupID the id of group
         * @param {object} post post will updated
         * @returns {httpPromise} resolve with fetched data.
         */    
        function createPost(groupId,post){
            
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/contents/',post,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
		
		/**
         * @ngdoc
         * @name uploadImage
         * @methodOf PostService
         *
         * @description
         * Method to upload an image to the component
         * @param {int} compId the id of component to upload an image
         * @param {object} compImage image which will be uploaded
         * @returns {httpPromise} resolve with fetched data.
         */ 
		function uploadImage(compId,compImage){
            var fd = new FormData();
			fd.append('file', compImage);
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/upload_image/'+compId+'/',fd,{
				transformRequest: angular.identity,
                headers: {
                    'Content-Type' : undefined,
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
		
         /**
         * @ngdoc
         * @name updatePost
         * @methodOf PostService
         *
         * @description
         * Method to update a post with given group id, post id and post object
         * @param {int} groupID the id of group
         * @param {int} postID the id of post
         * @param {Object} post post will updated
         * @returns {httpPromise} resolve with fetched data.
         */    
        function updatePost(groupId,postID, post){
            return $http.put('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/contents/'+postID, post,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
        /**
         * @ngdoc
         * @name deletePost
         * @methodOf PostService
         *
         * @description
         * Method to delete a post with given group id, post id
         * @param {int} groupID the id of group
         * @param {int} postID the id of post
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function deletePost(groupId,post){
            return $http({  
				method: "DELETE",  
				url: "https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/" +groupId + "/contents/",  
				data: post,  
				headers: {'Content-Type': 'application/json', Authorization: "Bearer " + $localStorage.token }  
			});
			
			
			
			/*
			$http.delete('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/contents/',post,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });*/
        }
        /**
         * @ngdoc
         * @name getPost
         * @methodOf PostService
         *
         * @description
         * Method to get a post with given group id, post id
         * @param {int} groupID the id of group
         * @param {int} postID the id of post
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getPost(groupId,postID){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/contents/'+postID,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name getAllPosts
         * @methodOf PostService
         *
         * @description
         * Method to get all posts with given group id
         * @param {int} id the id of group
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getAllPosts(groupId){
            console.log(groupId);
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/contents/',{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }

    }
})();