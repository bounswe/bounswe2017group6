(function()
{
	/**
     * @ngdoc controller
     * @name TemplateCreateCtrl
     * @description
     * 
     * Controller for creating new template
     */
    angular
        .module("interestHub")
        .controller("TemplateCreateCtrl", TemplateCreateCtrl);
    
    function TemplateCreateCtrl($scope,  $rootScope, $location, TemplateService, $routeParams)
    {
		$scope.choices = [{id: '1', selection:[]}];
		$scope.req = {name:'',components:[],component_names:[],dropdowns:[],checkboxes:[]};
		 /**
         * @ngdoc
         * @name addNewChoice
         * @methodOf TemplateCreateCtrl
         *
         * @description
         * Method for adding a choice in template
         * @param {object} item the item will be added tp template
         */   
		$scope.addNewChoice = function() {
			var newItemNo = $scope.choices.length+1;
			$scope.choices.push({'id':newItemNo,selection:[]});
		};
		  /**
         * @ngdoc
         * @name removeChoice
         * @methodOf TemplateCreateCtrl
         *
         * @description
         * Method for removing a choice in template
         * @param {object} item the item will be removed from template
         */   
		  $scope.removeChoice = function(item) {
			var index = $scope.choices.indexOf(item);
			 $scope.choices.splice(index, 1);
			 for(i=index;i<$scope.choices.length;i++) { 
				$scope.choices[i].id=$scope.choices[i].id-1;
			}
			 
		  };
		  /**
         * @ngdoc
         * @name addNewSelection
         * @methodOf TemplateCreateCtrl
         *
         * @description
         * Method for adding a selection in template
         * @param {object} item the item will be added to template
         */  
		  $scope.addNewSelection = function(item) {
		    var index = $scope.choices.indexOf(item);
		    console.log(index);
		    var newSelectNo=$scope.choices[index].selection.length+1;
		    var newSelectNo = item.selection.length+1;
		    $scope.choices[index].selection.push({'id':newSelectNo});
			console.log($scope.choices);
		  };
		  /**
         * @ngdoc
         * @name removeSelection
         * @methodOf TemplateCreateCtrl
         *
         * @description
         * Method for removing a selection in template
         * @param {object} item the item will be removed from template
         */ 
		  $scope.removeSelection = function(choice,item) {
			var index = $scope.choices.indexOf(choice);
			var ind=$scope.choices[index].selection.indexOf(item);
			 $scope.choices[index].selection.splice(ind, 1);
			 
		  };
		  /**
         * @ngdoc
         * @name createTemplate
         * @methodOf TemplateCreateCtrl
         *
         * @description
         * Method for creating a template
         * 
         */ 
		  $scope.createTemplate = function(){
			  console.log($scope.tempname);
			for(i=0;i<$scope.choices.length;i++) { 
				$scope.req.components.push($scope.choices[i].type);
				$scope.req.component_names.push($scope.choices[i].name);
				if($scope.choices[i].type=="dropdown"){
					drop={name:$scope.choices[i].name,items:[]}
					for(j=0;j<$scope.choices[i].selection.length;j++){
						drop.items.push({title:$scope.choices[i].selection[j].name});
					}
					
					$scope.req.dropdowns.push(drop);
				}
				else if($scope.choices[i].type=="checkbox"){
					check={name:$scope.choices[i].name,items:[]}
					for(j=0;j<$scope.choices[i].selection.length;j++){
						check.items.push({title:$scope.choices[i].selection[j].name});
					}
					
					$scope.req.checkboxes.push(check);
				}
			}
			console.log($scope.req);
			
			TemplateService
		                .createTemplate($routeParams.id, $scope.req)
		                .then(handleSuccess, handleError);
						
		    
			
		  };
		   /**
         * @ngdoc
         * @name handleSuccess
         * @methodOf TemplateCreateCtrl
         *
         * @description
         * Method for assigning templates to $scope
         * @param {Array} templates the templates will be shown
         */ 
		function handleSuccess(response) {
			
			$scope.temps=response.data;
			console.log($scope.temps);
			$rootScope.$broadcast('AddTemplate', $scope.temps);
			$scope.choices = [{id: '1', selection:[]}];
			$scope.req = {name:'',components:[],component_names:[],dropdowns:[],checkboxes:[]};
			//$rootScope.PostCtrl.templates.push(response.data);
            //console.log($scope.posts);

        }

        function handleError(error) {
            $scope.error = error;
			$scope.choices = [{id: '1', selection:[]}];
			$scope.req = {name:'',components:[],component_names:[],dropdowns:[],checkboxes:[]};
            //console.log(error);
        }


        
      
 
	   }

     
})();
