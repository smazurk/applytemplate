var renderContent = function ($contentElement, context) {
    //$contentElement is jquery content element for my red control and context contains entity type and entity id
    $contentElement.append('<button id="templateAddNewButton">Add New Template</button><div id="templateAddNewDiv" style="display: none;"><input type = "text" id = "newTemplateName"><BR></div><div id="templateApplyTemplateDiv"><div id="templateTableDiv"></div></div>');
};

//Append my controls to user story view
tau.mashups.addDependency('tp/userStory/view')
    .addMashup(function (view) {
        view.addTab('Template', renderContent)
          
    });



/*
Get the project Id for the userstory we are looking at.                                                
*/                                  
        
function getProjectID(handleData, userstoryID) {

console.log(appHostAndPath);
	$.ajax({
		type: 'GET',
                url: appHostAndPath + '/api/v1/UserStories?where=Id%20eq%20' + userstoryID + '&format=json',
                contentType: 'application/json',
                dataType: 'json',
                success: function(resp) {
                     handleData(resp); 
            	}
			   
        });
}

        
/*
Load the templates                                            
*/                                  
        
function loadTemplates(handleData, userstoryID) {
console.log(appHostAndPath);
                    $.ajax({
                        type: 'GET',
                        url: appHostAndPath + '/api/v1/UserStories?where=Id%20eq%20' + userstoryID + '&format=json',
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function(resp) {
                           handleData(resp); 
            		}
			   
                    });
	}      
        
        
function applyTemplate(id, templatename, template){
    var conf = confirm("Are you sure you want to apply the template " + templatename);

    if(conf == true){
                     
		getProjectID(function(output){
                	
                   	console.log(template);
  		
		      	
      			
        		$.each(template.Items, function(k,item) {
                                                                 
                                                                 
			        var postdata = {};
                                postdata.Name = item.Name;
			        postdata.Project = {'Id' : output.Items[0].Project.Id};
              			postdata.UserStory = { 'Id' : id }
                		postdata.Description  = item.Description;
                                
                  
                		if(item.Type == 'TestCases'){
	                                postdata.Steps = item.Steps;
		                 	postdata.Success = item.Success;
                                }
                        	
                		$.ajax({ 
                                	type: 'POST', 
                                  	url: appHostAndPath + '/api/v1/' + item.Type + '/&format=json', 
                                  	dataType: 'json',
	                                processData: false,
                                  	contentType: 'application/json',
        				data: JSON.stringify(postdata), 
        				success: function(){ 
                                                            //in the future add role efforts for tasks after created?
                                                            console.log("yay!");
                                                            }, 
       					error: function(){console.log("boo!");}
    					
                                      }); 
                        });    
            	}, id);
               
            	
    }

}


function getTemplate(id, name, template){
                            
  console.log('get the actual template');
                            
   	var templates = {'template' : {}};
  	templates.template["atemplate"] = {
                                        'Items'         : []
				       };
    	
    	templates.template["atemplate"].Items.push({
                                            'Type'    : 'Tasks',
                                            'Name'    : 'aTask1',
          				    'Description' : 'the first task'
              				    
                                         });
                    
                    
    	templates.template["atemplate"].Items.push({
                                            'Type'    : 'Tasks',
                                            'Name'    : 'aTask2',
          				    'Description' : 'the second task'
              				    
                                         });
    	templates.template["atemplate"].Items.push({
                                            'Type'    : 'Tasks',
                                            'Name'    : 'aTask3',
          				    'Description' : 'the third task'
              				   
                                         });
                    
                    
                    
    	templates.template["atemplate"].Items.push({
                                            'Type'    : 'TestCases',
                                            'Name'    : 'aTestCase1',
          				    'Steps'   : 'Steps',
              				    'Success' : 'Sucess'
                                         });            
     	templates.template["atemplate"].Items.push({
                                            'Type'    : 'TestCases',
                                            'Name'    : 'aTestCase2',
          				    'Steps'   : 'Steps',
              				    'Success' : 'Sucess'
                                         });
                    
                    
  applyTemplate(id, name, templates.template["atemplate"].Items);
  
}




function removeTemplate(templatename){

                                      
                                      
  console.log('remove template' + templatename);
	
  	$.ajax({
                    type: 'DELETE',
                    url: appHostAndPath+'/storage/v1/ApplyTemplateMashup/' + templatename,
                    contentType: 'application/json; charset=utf8',
                    success: function(){console.log("yay!");
                                        rebuildTemplateTable();
                                        }, 
       		    error: function(){console.log("boo!");}
                });
  
}


function addTemplateTable($element){
	$element.find("#templateTableDiv").html('');
	$element.find("#templateTableDiv").append(buildTemplateTable());
}


function rebuildTemplateTable(){
	$("#templateTableDiv").html('');
	$("#templateTableDiv").append(buildTemplateTable()); 
}

function buildTemplateTable(){
        
	console.log($element.length);
	//$("#templateTableDiv").html('');
    	
    
        var table = $('<table class="" width= 500></table>');
        table.append($('<tr><th colspan = 2; width= 400>Template</th></tr>'));
                  
          
             	$.ajax({
                type: 'GET',
                url: appHostAndPath+'/storage/v1/ApplyTemplateMashup',
                contentType: 'application/json; charset=utf8',
				success: function(data) {
                                        console.log(data);                 
                                        $.each(data.items, function(k,item) {
                				var tr = $('<tr class="hoverHi"></tr>');
				                tr.append($('<td class="more" width = 75><a href = "#">Apply</a></td>').click(function() {
          	      					getTemplate(id, item.key);
                                                }));
                          			tr.append($('<td class="more" width = 75><a href = "#">Delete</a></td>').click(function() {
          	      					removeTemplate(item.key);
                                                }));
                            			tr.append($('<td class="more" width = 75><a href = "#">Modify</a></td>').click(function() {
          	      					modifyTemplate(item.key);
                                                }));
              				tr.append("<td>" + item.key + "</td>");
             			 	table.append(tr);
				        });    
                                        
				}
            });
              
     
		  return table;                            
                                       
}
                             
                         
function modifyTemplate(templatename){

                                      
                                      
  console.log('modify template ' + templatename);

}




var startApplyTemplate = function(eventdata) {
                                              
                                              
                                              
    
          
            
                                                   
	var id = eventdata.data.context.entity.id;
                   
       
   
        console.log(eventdata);    
	
	$element = eventdata.element;
	
        

		addTemplateTable($element);  
          
		$element.find('#templateAddNewButton').click(function( event ){ 
		       	$element.find('#templateAddNewButton').hide();
        	        $element.find("#templateAddNewDiv").show();
	                var myitem;
                        myitem = $('<button id="doadd">Add!</button>').click(function(){
			
                        
                $.ajax({
                    type: 'POST',
                    async: false,
                    url: appHostAndPath+'/storage/v1/ApplyTemplateMashup/' + $('#newTemplateName').val(),
                    data: JSON.stringify({
                        'scope'     : 'Private',
                        'publicData': null,
                        'userData'  : ''
                    }),
                    contentType: 'application/json; charset=utf8',
                    success: function(){
                                        console.log("yay!");
                                        rebuildTemplateTable();
                      			
                                        }, 
       		    error: function(){console.log("boo!");}
                });
			                                                                     
			return false;
			});
                
		$element.find("#templateAddNewDiv").append(myitem);
        	
            		return false;
        	});
	
        
	
                                                  
};
    
tau.mashups 
    .addDependency('app.bus') 
    .addMashup(function ($deferred) { 
 		
        $deferred.then(function (bus) { 
                bus.on('afterRender', function (evt, data) {
	  		if(evt.caller.name.indexOf("custom control:tab:Template") !== -1 && data.data.type == 'container'){
			   
                       	startApplyTemplate(data);

      			}
      		
      
		return;      
                
            }); 
        }) 
 
    });
