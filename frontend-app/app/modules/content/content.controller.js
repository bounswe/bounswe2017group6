
(function()
{
    /**
     * @ngdoc controller
     * @name ContentCtrl
     * @description
     * 
     * Controller for creating/getting/updating/deleting and showing contents
     */
    angular
        .module("interestHub")
        .controller("ContentCtrl", ContentCtrl);
    
    function ContentCtrl($scope,  $rootScope, $location, ContentService, GroupService, $q, $filter, UserService)
    {
        $scope.remove = remove;
        $scope.update = update;
        $scope.add    = add;
        $scope.upVote = upVote;
        $scope.downVote = downVote;
      	$scope.tab = {};
        $scope.posts = [];
        $scope.postComment = postComment;
        posts = [];
        

         /**
         * @ngdoc
         * @name init
         * @methodOf ContentCtrl
         *
         * @description
         * Method for initialization of contents by getting all of them
         * 
         */ 
        function init() {

            ContentService
                .getAllContents()
                .then(handleSuccess, handleError);

        }
        
        init();

         /**
         * @ngdoc
         * @name remove
         * @methodOf ContentCtrl
         *
         * @description
         * Method to delete content 
         * @param {object} content the content will be removed
         * 
         */ 
        function remove(post)
        {
            ContentService
                .deleteContent(post._id)
                .then(handleSuccess, handleError);
        }
          /**
         * @ngdoc
         * @name update
         * @methodOf ContentCtrl
         *
         * @description
         * Method to update content 
         * @oaram {object} content the content will be updated
         * 
         */ 
        function update(post)
        {
       

            ContentService
                .updateContent(post._id, post)
                .then(handleSuccess, handleError);
        }
          /**
         * @ngdoc
         * @name add
         * @methodOf ContentCtrl
         *
         * @description
         * Method to add a content 
         * @param {object} content the content will be added
         * 
         */ 
        function add(post)
        {
            ContentService
                .createContent(post)
                .then(handleSuccess, handleError);

        }      
         /**
         * @ngdoc
         * @name handleSuccess
         * @methodOf ContentCtrl
         *
         * @description
         * Method to get the fields of content and assigns them to scope variables
         * @param {object} contents the contents whose comments, votes will be got 
         * 
         */
        function handleSuccess(response) {
            //$scope.posts = {};+++++++

            contents = response.data;
            //$scope.ordersBySalary = $filter('orderBy')($scope.employees ,'+salary');

            contents = $filter('orderBy')(contents, '-created_date'); 
            //Get group name
            /*var arrayLength = $scope.posts.length;
            for (var i = 0; i < arrayLength; i++) {
                GroupService.getGroup($scope.posts[i].groups[0])
                    .then(
                    function(response){
                        $scope.posts.groupname = response.data.name; 
                    },
                    handleError);
            }*/
            console.log(posts.length);
            posts = contents.slice(0, posts.length + 8);
             $q.all(posts.map(function (post) {
                    GroupService.getGroup(post.groups[0])
                        .then(
                            function(response){
                                if(response.status != 404){
                                    post.group = response.data;
                                };
                            },handleError);
                          UserService.getUser(post.owner.id)
                        .then(function(response){
                            post.owner = response.data;
                        },handleError);
                    ContentService.getCommentsOfContent(post.id)
                            .then(function (response) {
                                post.comments = $filter('orderBy')(response.data,'+created_date');

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
                                //console.log(post.votes);
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
              
           
        }

         /**
         * @ngdoc
         * @name postComment
         * @methodOf ContentCtrl
         *
         * @description
         * Method to add a comment to a content 
         * @param {string} comment the comment will be added
         * @param {int} index the index of the content in the view that will be commented
         * @param {int} contentId the id of the content that will commented
         */
        function postComment(text,index, ContentID){
            //console.log(index);
            //console.log(text);
            var comment = {
                "text" : text
            };
            ContentService.createCommentToContent(ContentID,comment)
                .then(
                    function(response){
                        $scope.posts[index].comments.push(response.data);
                    },
                    handleError);
                //console.log($scope.posts);
        }
        /**
         * @ngdoc
         * @name upVote
         * @methodOf ContentCtrl
         *
         * @description
         * Method to up vote to a content 
         * @param {int} index the index of the content in the view that will be up voted
         * @param {int} contentId the id of the content that will be voted
         */
        function upVote(index, contentId){
            var vote = {
                "isUp" : true,
                "content_id": contentId
            }
            ContentService.voteToContent(contentId,vote)
                .then(function(response){
                    console.log(response.data);
                    $scope.posts[index].votes.push(response.data);

                },handleError);
                console.log($scope.posts[index].votes);
                
        }
        /**
         * @ngdoc
         * @name downVote
         * @methodOf ContentCtrl
         *
         * @description
         * Method to down vote to a content
         * @param {int} index the index of the content in the view that will be down voted
         * @param {int} contentId the id of the content that will be voted
         */
         function downVote(index, contentId){
             var vote = {
                "isUp" : false,
                "content_id": contentId
            }
            //console.log("down");
            ContentService.voteToContent(contentId,vote)
                .then(function(response){
                    //console.log(response.data);

                    $scope.posts[index].votes.push(response.data);

                },handleError);

        }
        function handleError(error) {
            $scope.error = error;

        }

        
      
 
	}
})();
