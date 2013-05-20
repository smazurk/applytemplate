var renderContent = function ($contentElement, context) {
    //$contentElement is jquery content element for my red control and context contains entity type and entity id
	var html = '';
  	html += '<div id="templateAddNewDiv">';
    	html += '<div id ="templateInputDiv" style="display: none;">';
	html += '<input type = "text" id = "newTemplateName"><BR><button id="doadd">Add!</button><button id="dohide">Hide</button></div>';
        html += '<button id="templateAddNewButton">Add New Template</button></div>';
	html += '<div id="templatesDiv"><div id="templateTableDiv"></div></div>';
	html += '<div id="templateModifyDiv" style="display: none;">';
        html += '<div id="templateModifyTitleDiv"></div>';
        
	html += '<div id="templateModifyTableDiv">';
        html += '<div id="templateAddButtons">';
        html += '<button id = "showAddTask">Add Task</button>';
        html += '<button id = "showAddTestCase">Add TestCase</button>';
        html += '</div>';
        
        html += '<div id="templateAddTask" style="display: none;">Add task<br>';
        html += 'Name: <input type = "text" id = "newTaskName"><BR>';
        html += 'Description: <input type = "text" id = "newTaskDescription"><BR>';
        html += '<button id="doSaveTask">Save</button>';
        html += '<button id="doCancelTask">Cancel</button>';
        html += '</div>';
        
        
        html += '<div id="templateAddTestCase" style="display: none;">';
        html += 'Name: <input type = "text" id = "newTestCaseName"><BR>';
        html += 'Steps: <input type = "text" id = "newTestCaseSteps"><BR>';
        html += 'Success: <input type = "text" id = "newTestCaseSuccess"><BR>';
        html += '<button id="doSaveTestCase">Save</button>';
        html += '<button id="doCancelTestCase">Cancel</button>';
        html += '</div>';
        
        
        html += '<div id="templateModifyContents">';
        html += '</div>';
        
	html += '</div>';
        html += '<button id = "modTemplateDone">Done</button>';
        html += '</div>';

        $contentElement.append(html);
        
}

tau.mashups.addDependency('tp/userStory/view')
    
    .addMashup(function (view) {
        view.addTab('Template', renderContent)
          
    });
    
    tau.mashups 
    .addDependency('app.bus') 
    .addDependency('tau/configurator')
    .addMashup(function ($deferred, configurator) { 
 	
               
   var applyTemplate = function() {       
      console.log('hello');         
      
        
      
      	this.init = function() { 
      
          this._userstoryid = 0;
          $deferred.then(function (bus) { 

                      bus.on('afterRenderAll', function (evt, data) {
   
                          
			
                                                                                                                               
		  	  if (typeof evt.data.data !== 'undefined'){
                          
          		  if(evt.data.data.name.indexOf("main entity container") !== -1){
                                  console.log('gtg'); 
			          startApplyTemplate(data);
                          }
                        
                        }
               
                                         
/*                  bus.on('afterRender', function (evt, data) {
                                                         
                          //console.log(evt);
                          if(evt.caller.name.indexOf("custom control:tab:Template") !== -1 && data.data.type == 'container'){
                                  console.log('gtg'); 
                                  
			          startApplyTemplate(data);
                          }
*/                  
                  return;      
                  
                  }); 
          })
        
	};        

        
        function buildTemplateDetails(templatename){
    	$('#templateModifyTitleDiv').html(templatename);
	
  	 

        var table = $('<table class="" width= 500></table>');
        table.append($('<tr><th colspan = 2; width= 400>Tasks</th></tr>'));
                  
          
             	$.ajax({
                type: 'GET',
                url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + templatename,
                contentType: 'application/json; charset=utf8',
				success: function(data) {
                                        console.log('template data');
                                        console.log(data);
                      
                      
                      				

                                        $.each(data.userData, function(k,item) {
                                                                                
                				var tr = $('<tr></tr>');
                          			tr.append($('<td class="more" width = 75><a href = "#">Delete</a></td>').click(function() {
          	      					console.log(item);	
                                                }));
                            		
              				tr.append("<td>" + k + "</td>");
	                                tr.append("<td>" + item + "</td>");
             			 	table.append(tr);
				        });
                                  
                                         
				}
            });
            
            console.log('table data');
            console.log(table);  

        
        
	$("#templateModifyContents").html('');
	$("#templateModifyContents").append(table);                        
                                       
}
                         
        function modifyTemplate(templatename){
        
          $('#templateAddNewDiv').hide();
          $('#templatesDiv').hide(); 
          $('#templateModifyDiv').show(); 
          buildTemplateDetails(templatename);
          
          console.log('modify template ' + templatename);
        
        }


        
        startApplyTemplate = function(eventdata){
        
    		var id = eventdata.data.context.entity.id;
    	
		this._userstoryid = id;
        
        	$element = eventdata.element;
		$element.find('#modTemplateDone').click(function(){
                                console.log('done');
  				$('#templateAddNewDiv').show();
  				$('#templatesDiv').show();
            			$('#templateModifyDiv').hide(); 
                       		return false;                        
                        });
                	
               

		
		 $element.find('#showAddTask').click(function(){
                        	
                                console.log('show add task');
                  		$element.find('#templateModifyContents').hide();
                		$element.find('#templateAddTask').show();
                
                       		return false;
                        }); 
                  
                 $element.find('#doCancelTask').click(function(){
                        	
                                $element.find('#newTaskDescription').val('');
                            	$element.find('#newTaskName').val('')
                		$element.find('#templateAddTask').hide();
                      		$element.find('#templateModifyContents').show();
                
                       		return false;
                        }); 
                  
                  
                  
                 $element.find('#doSaveTask').click(function(){
               
               		console.log('lets save some tasks');  
                  
                  	console.log($('#templateModifyTitleDiv').html());
                    	
                    	
                        
        		//var savedata = { };                
  			var savedata = {  };
                        savedata[$('#newTaskName').val()] = '["Tasks", "' + $('#newTaskDescription').val() + '"]';
    	
    			
                    
    	
                      	
         		//savedata = JSON.stringify(savedata);
            		console.log(savedata);
        			$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + $('#templateModifyTitleDiv').html(),
		                        data: JSON.stringify({
                        		'scope'     : 'Private',
                        		'publicData': null,
                        		'userData'  : savedata
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        console.log("yay!");
                            		buildTemplateDetails($('#templateModifyTitleDiv').html());
                          		$element.find('#newTaskDescription').val('');
                            		$element.find('#newTaskName').val('');
                        		
                      		}, 
       		    		error: function(){
                                        console.log("boo!");}
                		});
        
        		$element.find('#templateAddTask').hide();
          		$element.find('#templateModifyContents').show();
	        	return false;
        	});  
                  
                  
		
          
		$element.find('#templateAddNewButton').click(function( event ){ 
		       	$element.find('#templateAddNewButton').hide();
        	        $element.find("#templateInputDiv").show();
	               
                        $('#doadd').click(function(){
                		if($('#newTemplateName').val() == ''){
                                return false;
                                }
                		$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + $('#newTemplateName').val(),
		                        data: JSON.stringify({
                        		'scope'     : 'Private',
                        		'publicData': null,
                        		'userData'  : ''
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        console.log("yay!");
                        		$('#newTemplateName').val('')
                                        rebuildTemplateTable();
                      		}, 
       		    		error: function(){
                                        console.log("boo!");}
                		});
			                                                                     
				return false;
			});
                	
                        $('#dohide').click(function(){
                        
                        	$element.find('#templateAddNewButton').show();
	        	        $element.find("#templateInputDiv").hide();
                          	
                        	return false;
                                                                                      
			});
                        
			
        	
            		return false;
        		});
 
                  	/*
                    		This section is for the test cases
                    	*/
                  
              		$element.find('#showAddTestCase').click(function(){
                        	
                                
                  		$element.find('#templateModifyContents').hide();
                		$element.find('#templateAddTestCase').show();
                
                       		return false;
                        }); 
                  
                 	$element.find('#doCancelTestCase').click(function(){
                        	
                                $element.find('#newTestCaseDescription').val('');
                            	$element.find('#newTestCaseName').val('')
                		$element.find('#templateAddTestCase').hide();
                      		$element.find('#templateModifyContents').show();
                
                       		return false;
                        });
                
                
                        $element.find('#doSaveTestCase').click(function(){
               
               		console.log('lets save some testcases');  
                  
                  	console.log($('#templateModifyTitleDiv').html());
                    	
                    	
                        
        		//var savedata = { };                
  			var savedata = {  };
                        savedata[$('#newTestCaseName').val()] = '["TestCases", "","' + $('#newTestCaseSteps').val() + '","' + $('#newTestCaseSuccess').val()+'"]';
    	
    			
                    
    	
                      	
         		//savedata = JSON.stringify(savedata);
            		console.log(savedata);
        			$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + $('#templateModifyTitleDiv').html(),
		                        data: JSON.stringify({
                        		'scope'     : 'Private',
                        		'publicData': null,
                        		'userData'  : savedata
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        console.log("yay!");
                            		buildTemplateDetails($('#templateModifyTitleDiv').html());
                          		$element.find('#newTestCaseSteps').val('');
                            		$element.find('#newTestCaseSuccess').val('');
                              		$element.find('#newTestCaseName').val('');
                        		
                      		}, 
       		    		error: function(){
                                        console.log("boo!");}
                		});
        
        		$element.find('#templateAddTestCase').hide();
          		$element.find('#templateModifyContents').show();
	        	return false;
        	});
           
        
            addTemplateTable();
        };
        
        
        /*
This is used for the first build of the available templates.
*/
function addTemplateTable(){
                                    
	$("#templateTableDiv").html('');
	
	$("#templateTableDiv").append(buildTemplateTable());
 
};

/*
This can be used to refresh the table displaying the avaiable templates
*/
function rebuildTemplateTable(){
	$("#templateTableDiv").html('');
	$("#templateTableDiv").append(buildTemplateTable()); 
};

/*
Actually build the templatetable - 
*/
function buildTemplateTable(){
        
	
	//$("#templateTableDiv").html('');
    	
    
        var table = $('<table class="" width= 500></table>');
        table.append($('<tr><th colspan = 2; width= 400>Template</th></tr>'));
                  
          
             	$.ajax({
                type: 'GET',
                url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup',
                async: false,
                contentType: 'application/json; charset=utf8',
				success: function(data) {
                                        console.log(data);                 
                                        $.each(data.items, function(k,item) {
                				var tr = $('<tr></tr>');
				                tr.append($('<td width = 75><a href = "#">Apply</a></td>').click(function() {
          	      					getTemplate(item.key);
                                                }));
                          			tr.append($('<td width = 75><a href = "#">Delete</a></td>').click(function() {
          	      					removeTemplate(item.key);
                                                }));
                            			tr.append($('<td width = 75><a href = "#">Modify</a></td>').click(function() {
          	      					modifyTemplate(item.key);
                                                }));
              				tr.append("<td>" + item.key + "</td>");
             			 	table.append(tr);
				        });    
                                        
				}
            });
              
     	
	return table;                            
                                       
	}
        
/*
Get the project Id for the userstory we are looking at.                                                
*/                                  
        
function getProjectID(handleData) {


console.log('us id :' + this._userstoryid);
	$.ajax({
		type: 'GET',
                url: configurator.getApplicationPath() + '/api/v1/UserStories?where=Id%20eq%20' + this._userstoryid + '&format=json',
                contentType: 'application/json',
                dataType: 'json',
                success: function(resp) {
                     handleData(resp); 
            	}
			   
        });
}

   
        
/*
Apply the template to the userstory
*/
function applyTemplate(templatename, templatedetails){
    var conf = confirm("Are you sure you want to apply the template " + templatename);

    if(conf == true){
                     
		getProjectID(function(output){
                	console.log('apply details');
                   	console.log(templatedetails);
  		
		      	
      			
        		$.each(templatedetails.Items, function(k, item) {
                                console.log('building item to post');
                                console.log(item);                                
                                                                 
			        var postdata = {};
                                postdata.Name = item.Name;
			        postdata.Project = {'Id' : output.Items[0].Project.Id};
              			postdata.UserStory = { 'Id' : _userstoryid }
                		postdata.Description  = item.Description;
                  		console.log(postdata);              
                  
                		if(item.Type == 'TestCases'){
	                                postdata.Steps = item.Steps;
		                 	postdata.Success = item.Success;
                                }
                        	
                		$.ajax({ 
                                        async: false,
                                	type: 'POST', 
                                  	url: configurator.getApplicationPath() + '/api/v1/' + item.Type + '/&format=json', 
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
                         //until I figure out how to reload the other tabs...
               location.reload();
            	});
               
            	
    }

}

/*
Load the template (ie tasks and testcases)
*/
function getTemplate(templatename){
                console.log('the id');
                console.log(this._userstoryid);            
		var templatedetails = {
                                       'Items' : []
                                       };
  		
    		

             	$.ajax({
                type: 'GET',
                url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + templatename,
                contentType: 'application/json; charset=utf8',
				success: function(data) {
                                       
                                        $.each(data.userData, function(k,item) {
						
                                               
              					
						
                      				var itemarray = eval(item);
                        			
						
                        			templatedetails.Items.push({'Type'  : itemarray[0],
                                                                      'Name'        : k,
                                                                      'Description' : itemarray[1],
                                  				      'Steps'       : itemarray[2],
                                      				      'Success'     : itemarray[3]
                                                                      });
                      
                      		
				        });
                                  
                                  console.log('templatedetials');
				  console.log(templatedetails);                    
                    
  				applyTemplate(templatename, templatedetails);       
				}
            });
                            
	
  
}



/*
Remove the template from storage
*/
function removeTemplate(templatename){

                                      
                                      
  console.log('remove template' + templatename);
	
  	$.ajax({
                    type: 'DELETE',
                    url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + templatename,
                    contentType: 'application/json; charset=utf8',
                    success: function(){console.log("yay!");
                                        rebuildTemplateTable();
                                        }, 
       		    error: function(){console.log("boo!");}
                });
  
}        
        
        
        
        };
        
        
        
        
        new applyTemplate().init();
 
    });