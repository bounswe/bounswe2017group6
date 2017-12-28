(function(){
    /**
     * @ngdoc service
     * @name TemplateService
     * @description
     * 
     * Service to send requests and get responses about group templates.
     */
    angular
        .module("interestHub")
        .factory("TemplateService", TemplateService);

    function TemplateService($http, $localStorage) {
        var api = {
            createTemplate: createTemplate,
            updateTemplate: updateTemplate,
            deleteTemplate: deleteTemplate,
            getTemplate: getTemplate,
            getAllTemplates: getAllTemplates
        };
        return api;

        /**
         * @ngdoc
         * @name createTemplate
         * @methodOf TemplateService
         *
         * @description
         * Method to create a template in given group id and template 
         * @param {int} groupId the id of the group in which the template is created
         * @param {object} template the template will be created
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function createTemplate(groupId,template){
            
            return $http.post('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/content-types/',template,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name updateTemplate
         * @methodOf TemplateService
         *
         * @description
         * Method to update a template in given group id with template and id 
         * @param {int} groupId the id of the group in which the template is updated
         * @param {int} templateId the id of the template is updated
         * @param {object} template the template will be updated
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function updateTemplate(groupId,templateID, template){
            return $http.put('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/content-types/'+templateID, template,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name deleteTemplate
         * @methodOf TemplateService
         *
         * @description
         * Method to delete a template in given group id with template id 
         * @param {int} groupId the id of the group in which the template is deleted
         * @param {int} templateId the id of the template is deleted
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function deleteTemplate(groupId,templateID){
			return $http({  
				method: "DELETE",  
				url: "https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/" +groupId+'/content-types/',  
				data: templateID,  
				headers: {'Content-Type': 'application/json', Authorization: "Bearer " + $localStorage.token }  
			});
			
			/*
            return $http.delete('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/content-types/'+templateID,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });*/
        }
         /**
         * @ngdoc
         * @name getTemplate
         * @methodOf TemplateService
         *
         * @description
         * Method to get a template in given group id with template id 
         * @param {int} groupId the id of the group in which the template is got
         * @param {int} templateId the id of the template is got
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getTemplate(groupId,templateID){
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/content-types/'+templateID,{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }
         /**
         * @ngdoc
         * @name getAllTemplates
         * @methodOf TemplateService
         *
         * @description
         * Method to get all templates in given group id 
         * @param {int} groupId the id of the group whose templates are got
         * @returns {httpPromise} resolve with fetched data.
         */ 
        function getAllTemplates(groupId){
            console.log(groupId);
            return $http.get('https://limitless-sands-55256.herokuapp.com/http://34.209.230.231:8000/group/'+groupId+'/content-types/',{
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': 'Bearer ' + $localStorage.token

                }
            });
        }

    }
})();