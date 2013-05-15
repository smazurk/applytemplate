var renderContent = function ($contentElement, context) {
    //$contentElement is jquery content element for my red control and context contains entity type and entity id
    $contentElement.append('<button id="templateAddNewButton">Add New Template</button><div id="templateAddNewDiv" style="display: none;">WooWoo!</div><div id="templateApplyTemplateDiv"></div>');
};

//Append my controls to user story view
tau.mashups.addDependency('tp/userStory/view')
    .addMashup(function (view) {
        view.addTab('Template', renderContent)
          
    });



        
function getProjectID(handleData, userstoryID) {
/*
Get the project Id for the userstory we are looking at.                                                
*/                                  
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
        
function loadTemplates(handleData, userstoryID) {
/*
Load the templates                                            
*/                                  
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



                             
                         


var startApplyTemplate = function(eventdata) {
                                              
                                              
                                              
    
          var sampletemplate = {'template' : {}};
  	sampletemplate.template["atemplate"] = {
                                        'Items'         : []
				       };
    	
    	sampletemplate.template["atemplate"].Items.push({
                                            'Type'    : 'Tasks',
                                            'Name'    : 'aTask1',
          				    'Description' : 'the first task'
              				    
                                         });
                    
                    
    	sampletemplate.template["atemplate"].Items.push({
                                            'Type'    : 'Tasks',
                                            'Name'    : 'aTask2',
          				    'Description' : 'the second task'
              				    
                                         });
    	sampletemplate.template["atemplate"].Items.push({
                                            'Type'    : 'Tasks',
                                            'Name'    : 'aTask3',
          				    'Description' : 'the third task'
              				   
                                         });
                    
                    
                    
    	sampletemplate.template["atemplate"].Items.push({
                                            'Type'    : 'TestCases',
                                            'Name'    : 'aTestCase1',
          				    'Steps'   : 'Steps',
              				    'Success' : 'Sucess'
                                         });            
     	sampletemplate.template["atemplate"].Items.push({
                                            'Type'    : 'TestCases',
                                            'Name'    : 'aTestCase2',
          				    'Steps'   : 'Steps',
              				    'Success' : 'Sucess'
                                         });                           
            
                                                   
	var id = eventdata.data.context.entity.id;
                   
            

   
        console.log(eventdata);    
	
	$element = eventdata.element;
	
    	//$element.find("#templateAddNewDiv").append('<ul id="menu" style="display:none"><li>Menu1</li><li>Menu2</li></ul>';
    
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
				                tr.append($('<td class="more"><a href = "#">Apply</a></td>').click(function() {
               
                				getTemplate(id, item.key);
          
               				}));
              				tr.append("<td>" + item.key + "</td>");
             			 	table.append(tr);
				        });    
                                        
				}
            });
              
        /* 
        $.each(templates.template, function(k,template) {
        	$element.find("#templateApplyTemplateDiv").append(k + '<BR>');
               
               //innerTable.append('<tr><td><a href = "/RestUI/TpView.aspx?#userstory/{0}">{0}</a></td><td>{1}</td><td>{2}</td></tr>'.f(item.Id, item.Name, item.Bugs));
        });
        */
		$element.find("#templateApplyTemplateDiv").append(table);
		$element.find('#templateAddNewButton').click(function( event ){ 
	       	
                $element.find("#templateAddNewDiv").show();
        	
              	samplejson = JSON.stringify(sampletemplate.template["atemplate"]);
              
        
        		$.ajax({
                    type: 'POST',
                    async: false,
                    url: appHostAndPath+'/storage/v1/ApplyTemplateMashup/test',
                    data: JSON.stringify({
                        'scope'     : 'Private',
                        'publicData': null,
                        'userData'  : samplejson
                    }),
                    contentType: 'application/json; charset=utf8',
                    success: function(){console.log("yay!");}, 
       		    error: function(){console.log("boo!");}
                });
        
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
