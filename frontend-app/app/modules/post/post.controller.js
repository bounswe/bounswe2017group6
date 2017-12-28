
(function()
{

    /**
     * @ngdoc controller
     * @name PostCtrl
     * @description
     * 
     * Controller for getting contents of groups
     */
    angular
        .module("interestHub")
		.directive('fileModel', ['$parse', function ($parse) {
			  return {
				  restrict: 'A',
				  link: function(scope, element, attrs) {
					  var model = $parse(attrs.fileModel);
					  var modelSetter = model.assign;

					  element.bind('change', function(){
							  modelSetter(scope, element[0].files[0]);
					  scope.$emit("fileSelected",[element[0].id,element[0].files[0]]);
					  });
				  }
			  };
		  }])
	
		
			
        .controller("PostCtrl", PostCtrl);
		
		
    function PostCtrl($scope,  $rootScope, $location, PostService, $routeParams, TemplateService, $q,ContentService,TagService,UserService)

    {                                                                                                                                          
	
        //$scope.createPost = createPost;
        $scope.remove = remove;
        $scope.update = update;
        $scope.add    = add;
		$scope.typeSelect=typeSelect;
		$scope.addContentTag = addContentTag;
        $scope.removeContentTag = removeContentTag;
		$scope.upVote = upVote;
        $scope.downVote = downVote;
        $scope.postComment = postComment;
		$scope.checksth=checksth;
		$scope.drInit=drInit;
		$scope.chInit=chInit;
		
		
		
      	$scope.tab = {};
        $scope.templates = [];
		$scope.content={content_type_id:'',tags:[],comps:[]};
		$scope.tags=[];
		$scope.fileToUpload = [];
		/**
         * @ngdoc
         * @name init
         * @methodOf PostCtrl
         *
         * @description
         * Method for initialization of contents of templates of groups
         * 
         */ 
        function init() {
			
			
            PostService
                .getAllPosts($routeParams.id)
                .then(handleSuccess, handleError);
			TemplateService
				.getAllTemplates($routeParams.id)
				.then(tempSuccess, tempError);
		
        }
        
        init();
		getUser();
		$scope.user={};
		
		function checksth(index,comp_name){
			
			console.log(index)
			console.log(comp_name)
			console.log($scope.content)
		}
		function drInit(postIndex,comIndex,post){
			console.log("dropdown "+comIndex+" "+postIndex)
			
			console.log(post);
		}
		function chInit(postIndex,comIndex,post){
			console.log("checkbox "+comIndex+" "+postIndex)
		}
		
		/**
         * @ngdoc
         * @name getUser
         * @methodOf PostCtrl
         *
         * @description
         * Method for getting the logged in user
         */ 
		function getUser(){
        UserService.getLoggedInUser().then(function(response){
          console.log(response.data);
           $scope.user=response.data;  
        },handleError);
       
      }
		
    
/*  
        function createPost(){
            $location.path('/postcreate');
        }
*/
        /**
         * @ngdoc
         * @name remove
         * @methodOf PostCtrl
         *
         * @description
         * Method for removing content of group
         * @param {object} content the content will be deleted
         */ 
        function remove(post_id)
        {
			tobeDeleted={id:post_id};
			console.log(tobeDeleted);
			
            PostService
                .deletePost($routeParams.id,tobeDeleted)
                .then(console.log("Deleted"), handleError);
				
			for(i=0;i<$scope.posts.length;i++){
				if($scope.posts[i].id==post_id){
					$scope.posts.splice(i,1);
				}
			}
        }
        /**
         * @ngdoc
         * @name update
         * @methodOf PostCtrl
         *
         * @description
         * Method for updating content of group
         * @param {object} content the content will be updated
         */ 
        function update(post)
        {
       

            PostService
                .updatePost(post._id, post)
                .then(handleSuccess, handleError);
			
        }
        /*
        function add(post)
        {
            PostService
                .createPost(post)
                .then(handleSuccess, handleError);
            

            console.log("added");
        } */  
		
		/**
         * @ngdoc
         * @name add
         * @methodOf PostCtrl
         *
         * @description
         * Method for adding content of group
         * @param {object} content the content will be added
         */ 
		function add(content)
        {
			$scope.req={"content_type_id": $scope.content.content_type_id,"tags":[],"components":[]}
			console.log($scope.content);
			for(i=0;i<$scope.content.tags.length;i++){
				tempTag={
					"label": $scope.content.tags[i].label,
					"description": $scope.content.tags[i].description,
					"url":"https:"+$scope.content.tags[i].url 
				}
				console.log("tempTag "+tempTag);
				$scope.req.tags.push(tempTag);
			}
			for(i=0;i<$scope.templates.length;i++){
				if($scope.templates[i].id==$scope.content.content_type_id){
					$scope.con_type=angular.copy($scope.templates[i]);
				}
			}
			console.log($scope.con_type);
			var x=1;
			for(i=0;i<$scope.con_type.components.length;i++){
				if($scope.con_type.components[i]=="dropdown"){
					console.log(content.comps[$scope.con_type.component_names[i]])
					temp= {
					"component_type": $scope.con_type.components[i],
					"order": i+1,
					"type_data": {
						"data": "ddown",
						"selected":content.comps[$scope.con_type.component_names[i]].selected[0].id
						}	
					
					}
					$scope.req.components.push(temp);
				}
				else if($scope.con_type.components[i]=="checkbox"){
					var x={};
					var sels=[];
					for(j=0;j<$scope.con_type.checkboxes.length;j++){
								if($scope.con_type.checkboxes[j].name==$scope.con_type.component_names[i]){
									console.log("hello")
									x=$scope.con_type.checkboxes[j];
								}
							}
					sels=[];
					var result = "";
					  $.each(content.comps[$scope.con_type.component_names[i]].selected, function(k, v) {
						result += k + " , " + v + "\n";
						if(v==true){
							sels.push(x.items[parseInt(k)].id);
						}
					  }); 
					
					
					
					temp= {
					"component_type": $scope.con_type.components[i],
					"order": i+1,
					"type_data": {
						"data": "cbox",
						"selecteds":sels
						}	
					
					}
					$scope.req.components.push(temp);
				}
				else{
					temp= {
					"component_type": $scope.con_type.components[i],
					"order": i+1,
					"type_data": {
						"data": content.comps[$scope.con_type.component_names[i]]
						}	
					
					}
					$scope.req.components.push(temp);
				}
			}
			
			//$scope.req.content_type=$scope.con_type;
			
			console.log($scope.req)
			//console.log($scope.content)
	
            PostService
                .createPost($routeParams.id, $scope.req)
                .then(handleSuccessPost, handleError);
			$scope.content={content_type_id:$scope.content.content_type_id,tags:[],comps:[]};

            
        }
        /**
         * @ngdoc
         * @name handleSuccess
         * @methodOf PostCtrl
         *
         * @description
         * Method for getting comments and votes of contents
         * @param {Array} contents the contents whose comments and votes will be got
         */ 
        function handleSuccess(response) {
            //$scope.posts = response.data;
            $scope.posts = [];
            posts = response.data;
                        $q.all(posts.map(function (post) {
                   UserService.getUser(post.owner.id)
                        .then(function(response){
                            post.owner = response.data;
                        },handleError);
                    ContentService.getCommentsOfContent(post.id)
                            .then(function (response) {
                                post.comments = response.data;
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
                                console.log(post.votes);
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
            //console.log($scope.posts);

        }
        /**
         * @ngdoc
         * @name handleSuccessPost
         * @methodOf PostCtrl
         *
         * @description
         * Method for getting and assigning the contents to $scope
         * @param {Array} contents the contents will be got
         */ 
		function handleSuccessPost(response){
			console.log(response.data);
			
			for(i=0;i<response.data.content_type.component_names.length;i++){
				for(j=0;j<$scope.files.length;j++){
					var y=Object.keys($scope.files[j]);
					if(response.data.content_type.component_names[i]==y[0]){
						compID=response.data.components[i].id;
						console.log(compID);
						console.log($scope.files[j][y[0]]);
						PostService.uploadImage(compID,$scope.files[j][y[0]])
						.then(function(res){console.log(res.data)},handleError)
					}
				}
			}
			/*PostService.getPost($routeParams.id,response.data.id).then(function(res){
				
			},handleError);*/
			$scope.posts.push(response.data);
			$scope.files=[];
		}

        function handleError(error) {
            $scope.error = error;
            //console.log(error);
        }
        /**
         * @ngdoc
         * @name tempSuccess
         * @methodOf PostCtrl
         *
         * @description
         * Method for assigning the templates to $scope
         * @param {Array} templates the templates will be shown
         */ 
		function tempSuccess(response) {
			$scope.templates=response.data;
			console.log($scope.templates);
			
			

        }
		$scope.content={content_type_id:'',tags:[],comps:[]};
		 /**
         * @ngdoc
         * @name typeSelect
         * @methodOf PostCtrl
         *
         * @description
         * Method for selecting the content type that user will use to create content
         * @param {object} type_id id of the template to be used for creating contents
         */
		function typeSelect(type_id){
			$scope.content={content_type_id:'',tags:[],comps:[]};
			$scope.content.content_type_id=type_id;
			$scope.files=[];
			//console.log($scope.content);
			
			
		}

        function tempError(error) {
            $scope.temperror = error;
            //console.log(temperror);
        }
		
		$scope.templates = [ ];


		  $scope.model = {
		    name: 'Tabs'
		};
		var _selected;
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
         * @methodOf PostCtrl
         *
         * @description
         * Method for searching tags
         * @param {string} input the input will be searched in wikidata  
         * @returns {Array} tags the search results from wikidata
         */ 
		$scope.selected = undefined;
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
         * @name addContentTag
         * @methodOf PostCtrl
         *
         * @description
         * Method for adding tag
         * @param {object} tag the tag will be added to view
         */   
        function addContentTag(tag) {
			  console.log(tag);
			  console.log("post");
			  
            if (tag != ""){

                var tagStored = {
                    "label" : tag.label ,
                    "description" : tag.description,
                    "url" : tag.url
                }
              
                $scope.content.tags.push(tagStored);
                $scope.selected = undefined;
            }
          }

         /**
         * @ngdoc
         * @name removeContentTag
         * @methodOf PostCtrl
         *
         * @description
         * Method for removing tag
         * @param {object} tag the tag will be removed from view 
         */   
        function removeContentTag($index){
            $scope.content.tags.splice($index,1);
        }

		function handleTag(response){
            console.log(response.data);

            $scope.tags = response.data;
        }
		 /**
         * @ngdoc
         * @name postComment
         * @methodOf PostCtrl
         *
         * @description
         * Method for posting comment to a content
         * @param {string} comment the comment will be added to content
         * @param {int} index the index of the content in the view
         * @param {int} contenId the id of the content will be commented
         */  
		function postComment(text,index, ContentID){
            console.log(index);
            console.log(text);
            var comment = {
                "text" : text
            };
            ContentService.createCommentToContent(ContentID,comment)
                .then(
                    function(response){
                        $scope.posts[index].comments.push(response.data);
                    },
                    handleError);
                console.log($scope.posts);
        }
         /**
         * @ngdoc
         * @name upVote
         * @methodOf PostCtrl
         *
         * @description
         * Method for up voting a content
         * @param {int} index the index of the content in the view
         * @param {int} contenId the id of the content will be up voted
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
         * @methodOf PostCtrl
         *
         * @description
         * Method for down voting a content
         * @param {int} index the index of the content in the view
         * @param {int} contenId the id of the content will be down voted
         */  
         function downVote(index, contentId){
             var vote = {
                "isUp" : false,
                "content_id": contentId
            }
            console.log("down");
            ContentService.voteToContent(contentId,vote)
                .then(function(response){
                    console.log(response.data);

                    $scope.posts[index].votes.push(response.data);
                },handleError);

        }
		
		$scope.$on('AddTemplate', function(proc, response) {
			console.log(response);
			$scope.templates.push(response);
		});
		
		$scope.removeTemplate=function(){
			  tobeDeleted={id:$scope.content.content_type_id}
			  console.log(tobeDeleted)
			  console.log($scope.templates);
			  for(i=0;i<$scope.templates.length;i++){
				  console.log(i)
				  if($scope.content.content_type_id==$scope.templates[i].id){
					  console.log("hello");
					 $scope.templates.splice(i,1);
				  }
			  }
			  
			  console.log($scope.templates);
			 
			  TemplateService
		                .deleteTemplate($routeParams.id, tobeDeleted)
		                .then(console.log("temp deleted"), handleError);
		  };
		
		$scope.files = [];

		//listen for the file selected event
		$scope.$on("fileSelected", function (event, args) {
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
		
		$scope.dt;
		
		  $scope.clear = function() {
			$scope.dt = null;
		  };


		  $scope.dateOptions = {
			formatYear: 'yy',
			startingDay: 1
		  };



		  $scope.open2 = function() {
			$scope.popup2.opened = true;
		  };

		  

		  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		  $scope.format = $scope.formats[0];


		  $scope.popup2 = {
			opened: false
		  };

		  

		  $scope.changed = function (x) {
			  console.log(x);
			  console.log($scope.content);
			  console.log($scope.dt);
			  $scope.content.comps[x]=$scope.dt;
			  console.log($scope.content);
				
		  };

		
		
		
		
		
		
		
		
		
		
		
		
		
 
	}
})();
