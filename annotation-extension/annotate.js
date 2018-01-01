// // var ann = new Annotator(document.body);

// $(function() {
//     console.log("==========")
//     setTimeout(addAnnotator, 2000);
// });



// function addAnnotator() {
//     for(var i=0; i<$("[component-id]").length; i++) {
//         console.log($("[component-id]")[i]);
//         var el = $("[component-id]")[i];
//         var content = $(el).annotator();
//         var component_id = el.getAttribute("component-id");
//         console.log(component_id)
//         content.annotator('addPlugin', 'Store', {
//             // The endpoint of the store on your server.
//             prefix: 'http://34.209.230.231:8000',
    
//             // Attach the uri of the current page to all annotations to allow search.
//             annotationData: {
//                 'component_id': component_id,
//                 'uri': 'http://this/document/only'
//             },

//             urls: {
//                 // These are the default URLs.
//                 create:  '/anootations/',
//                 update:  '/anootations/:id/',
//                 destroy: '/anootations/:id/',
//                 search:  '/anootations/search/'
//             },
    
//             // This will perform a "search" action when the plugin loads. Will
//             // request the last 20 annotations for the current url.
//             // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
//             loadFromSearch: {
//             'limit': 20,
//             'uri': 'http://this/document/only'
//             },
//             showViewPermissionsCheckbox: true
//         });
//     }
// }




// var ann = new Annotator(document.body);

$(function() {
    console.log("==========")
    setTimeout(addAnnotator, 2000);
});



function addAnnotator() {
    for(var i=0; i<$("[component-id]").length; i++) {
        console.log($("[component-id]")[i]);
        
    }
    console.log($("[component-id]"));
    var content = $("[component-id]").annotator();
    content.annotator('addPlugin', 'Store', {
        // The endpoint of the store on your server.
        prefix: 'http://34.209.230.231:8000',
  
        // Attach the uri of the current page to all annotations to allow search.
        annotationData: {
            'uri': window.location.href
        },

        urls: {
            // These are the default URLs.
            create:  '/annotations/',
            update:  '/annotations/:id/',
            destroy: '/annotations/:id/',
            search:  '/annotations/search/'
        },
  
        // This will perform a "search" action when the plugin loads. Will
        // request the last 20 annotations for the current url.
        // eg. /store/endpoint/search?limit=20&uri=http://this/document/only
        loadFromSearch: {
          'limit': 20,
          'uri': window.location.href
        },
        showViewPermissionsCheckbox: true
      });
}
