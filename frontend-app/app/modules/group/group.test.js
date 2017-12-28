describe('GroupService', function() {
	
	var GroupService, PostService, LoginService, httpBackend, localStorage;
	var createdGroup = {};
	var createdPost = {};	
	var registeredUser = {"username":"gokce","password":"testing12","email":"gokceuludogan@gmail.com" ,"profile":{"contacts":"","about":"about","is_public":"true","facebook_account":"@test","twitter_account":"@test","instagram_account":"@test","photo":null}};
	var groups = [{"name": "TestedGroup","is_public": true,"description": "More interesting group","logo": "", "cover_photo": "","tags": [{ "label": "google", "description": "Unique search engine","url": "https://www.google.com"}]}];
    
	var post = {"content_type_id": 13,"tags":[{"id": 3,"label": "google2","description": "Unique search engine","url": "https://www.google.com"},{"id": 4,"label": "google3","description": "Unique search engine","url": "https://www.google.com"}],
		"components": [{"component_type": "number","order": 2,"type_data": {"data": "1231233.00000"}},{"component_type": "longtext","order": 1,"type_data": {"data": "example long text"}},
			{"component_type": "text","order": 3,"type_data": {"data": "text example"}},{"component_type": "image","order": 4,"type_data": {}}]};

	beforeEach(angular.mock.module('interestHub'));

	beforeEach(inject(function($httpBackend, _GroupService_,  _PostService_, _LoginService_, _$localStorage_) {
	    GroupService = _GroupService_;
		httpBackend = $httpBackend;
		PostService = _PostService_;
		LoginService = _LoginService_;
		localStorage = _$localStorage_;

	  }));

	  it('getAllGroups', function() {
		  var returnData = {};
			//console.log(resp.data);
	  	httpBackend.expectGET("https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/").respond(returnData);
        // make the call
        var returnedPromise = GroupService.getAllGroups();
 
        // set up a handler for the response, that will put the result
        // into a variable in this scope for you to test.
        var result;
        returnedPromise.then(function (response) {
            result = response.data;

        });
 
        // flush the backend to "execute" the request to do the expectedGET assertion.
        httpBackend.flush();
 
        // check the result. 

		expect(result).toEqual(returnData);
	    
	  });

	 
	  
	  it('createGroup',function(){
	  	
	  	
		var groupData = {};
		LoginService.getToken(registeredUser).then(function(resp){
	  		//console.log(resp.data);
	  		httpBackend.expectPOST("https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/",groups[0]).respond(createdGroup);
	  		var returnedPromise = GroupService.createGroup(groups[0]);

	  		var result;
	  		returnedPromise.then(function(response){
			  	result = response.data;
		  	});
		  	console.log("Result ",result.id);			  		  
		  	console.log("CreatedGroup ",createdGroup.id);
		  	httpBackend.flush();



	  		expect(result.id).toEqual(createdGroup.id);
			expect(result.name).toEqual(createdGroup.name);
			expect(result.tags[0].id).toEqual(createdGroup.tags[0].id);

		},function(resp){
	  		//console.log(resp);
	  	});

	
	  });
	



	  it('getGroup',function(){
	  	var groupData = {};
	  	httpBackend.expectGET("https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/groups/"+createdGroup.id).respond(groupData);

	  	var returnedPromise = GroupService.getGroup(createdGroup.id);

	  	returnedPromise.then(function(response){
	  		result = response.data;
	  	});
	  	httpBackend.flush();

	  	expect(result).toEqual(groupData);
	  	
	  });
		

	it('createPost',function(){
		
		
		var postData = {};
		LoginService.getToken(registeredUser).then(function(resp){
			//console.log(resp.data);
		httpBackend.expectPOST("https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/"+createdGroup.id+"/contents/",post).respond(createdPost);
		var returnedPromise = PostService.createPost(createdGroup.id,post);

		var result;
		returnedPromise.then(function(response){
			result = response.data;
		});
		httpBackend.flush();

		expect(result.id).toEqual(createdPost.id);
		expect(result.content_type).toEqual(createdPost.content_type);
		expect(result.created_date).toEqual(createdPost.created_date);
		expect(result.owner.id).toEqual(createdPost.owner.id);
		expect(result.components).toEqual(createdPost.components);
		expect(result.tags[0].id).toEqual(createdPost.tags[0].id);
		expect(result.content_type.component_names).toEqual(createdPost.content_type.component_names);		
	},function(resp){
		//console.log(resp);
	});
	});



	it('getPost',function(){
		var postData = {};
		httpBackend.expectGET("https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/"+createdGroup.id+"/contents/"+createdPost.id).respond(postData);

		var returnedPromise = PostService.getPost(createdGroup.id, createdPost.id);

		returnedPromise.then(function(response){
			result = response.data;
		});
		httpBackend.flush();

		expect(result).toEqual(postData);
		
	});



	it('getAllPosts', function() {
		var returnData = {};
		httpBackend.expectGET("https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/"+createdGroup.id+"/contents/").respond(returnData);
	  // make the call
	  var returnedPromise = PostService.getAllPosts(createdGroup.id);

	  // set up a handler for the response, that will put the result
	  // into a variable in this scope for you to test.
	  var result;
	  returnedPromise.then(function (response) {
		  result = response.data;

	  });

	  // flush the backend to "execute" the request to do the expectedGET assertion.
	  httpBackend.flush();

	  // check the result. 

	  expect(result).toEqual(returnData);
	  
	});


});