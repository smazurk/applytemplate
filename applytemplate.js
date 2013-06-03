var renderContent = function ($contentElement, context) {
    //$contentElement is jquery content element for my red control and context contains entity type and entity id
	var html = '';
  	html += '<div id="templateAddNewDiv">';

	html += '<div id="templatesDiv"><div id="templateTableDiv"></div></div>';
	html += '<div id="templateModifyDiv" style="display: none;">';
        html += '<div id="templateModifyTitleDiv" style="font-size: 2em"></div>';
        
	html += '<div id="templateModifyTableDiv">';
       
        html += '<div id="templateAddTask" style="display: none;">Add task<br>';
        html += '<table><tr><td>Name: </td><td><input type = "text" id = "newTaskName"></td></tr>';
        html += '<tr><td>Description:</td><td><textarea rows="4" cols="50" id="newTaskDescription" style="resize: none;"></textarea><td></tr></table>';
        html += '<button id="doSaveTask">Save</button>';
        html += '<button id="doCancelTask">Cancel</button>';
        html += '</div>';
        
        
        html += '<div id="templateAddTestCase" style="display: none;">';
        html += '<table><tr><td>Name:</td><td><input type = "text" id = "newTestCaseName"></td></tr>';
        html += '<tr><td>Steps:</td><td><textarea rows="4" cols="50" id="newTestCaseSteps" style="resize: none;"></textarea></td></tr>';
        html += '<tr><td>Success:</td><td><textarea rows="4" cols="50" id="newTestCaseSuccess" style="resize: none;"></textarea></td></tr></table>';
        html += '<button id="doSaveTestCase">Save</button>';
        html += '<button id="doCancelTestCase">Cancel</button>';
        html += '</div>';
        
        
        html += '<div id="templateModifyContents">';
        html += '</div>';
        
	html += '</div>';
        
        
        html += '<div class="additemheaderfooter"><button id = "showAddTask">Add Task</button><button id = "showAddTestCase">Add TestCase</button><button id = "modTemplateDone">Done</button></div>';
       
        html += '</div>';
        html += '<div id ="templateInputDiv" style="display: none;">';
	html += '<input type = "text" id = "newTemplateName"><BR><button id="doadd">Add!</button><button id="dohide">Hide</button></div>';
        html += '</div>';
	html += '<div id="addtemplate"><button id="templateAddNewButton">Add New Template</button></div>';
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
		//TODO: Need to use a better event, or do something when this is not the default tab
          		bus.on('afterRenderAll', function (evt, data) {
                       
                        
            		
          			if(evt.caller.name == "container"){
                               	 if (typeof data.data.context.entity !== 'undefined'){	
		               
                    			startApplyTemplate(data);
                		 }
            			}
            
            		});             
          
          		/*
            		bus.on('afterRenderAll', function (evt, data) {
                         if (typeof evt.data.data !== 'undefined'){
                          
          		  if(evt.data.data.name.indexOf("main entity container") !== -1){
                                  console.log('gtg'); 
			          startApplyTemplate(data);
                          }
                        }
                  	return;      
             	     	});
                    
                    */ 
          })
        
	};        

        
        function buildTemplateDetails(templatename){
        templatename = fixInput(templatename);                                            
        console.log('building the templates details');
    	$('#templateModifyTitleDiv').html(templatename);
	
  	
	 var tasksTable = $('<BR><table width= 500></table>');
         tasksTable.append($('<tr><th colspan = 4; width= 400 align = "left">Tasks</th></tr>'));
          
          
         var testCasesTable = $('<table width= 500></table>');
         testCasesTable.append($('<tr><th colspan = 4; width= 400 align = "left">Test Cases</th></tr>')); 
          
          
          //Get all of the items for this 
             	$.ajax({
                type: 'GET',
                async: false,       
                url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + templatename,
                contentType: 'application/json; charset=utf8',
				success: function(data) {
                                       
                                        console.log(data);
                      
                      
                      			
                                        $.each(data.publicData, function(k,item) {
                                                
                                                var itemarray = eval(item);
                              			var tr = $('<tr></tr>');
                          			tr.append($('<td class="more" width = 75><a href = "#">Delete</a></td>').click(function() {
                                                        deleteTaskTestCase(k);
                                                        return false;                                                                      
                                                }));
                            		
                                		if(itemarray[0] == 'Tasks'){
                                                                            
                                		
                                                    console.log('task');
                                                    tr.append("<td>" + k + "</td>");
                                                    tr.append("<td>" + itemarray[1] + "</td>");
                                                    tasksTable.append(tr);
                                                
                                  		}else{
						                                              	
                                                    console.log('testcase');
                                                    tr.append("<td>" + k + "</td>");
                                                    tr.append("<td>" + itemarray[2] + "</td>");
                                                    tr.append("<td>" + itemarray[3] + "</td>");
                                                    testCasesTable.append(tr);
                                            
                                                }
				        });
                                  
                                         
				}
            });
          

        tasksTable.append('<BR>'); 
	testCasesTable.append('<BR>');        
        
	$("#templateModifyContents").html('');
	$("#templateModifyContents").append(tasksTable);
        $("#templateModifyContents").append(testCasesTable);
                                       
}


        
  	function deleteTaskTestCase(key){
    	
    	console.log("lets go ahead and remove " + key);
      		var postdata = {  };
        
      		postdata[key] = null;
      		
      		
              $.ajax({
                      type: 'POST',
                      async: false,
                      url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + $('#templateModifyTitleDiv').html(),
                      data: JSON.stringify({
                      'scope'     : 'Public',
                      'publicData': postdata,
                      'userData'  : null
              }),
              contentType: 'application/json; charset=utf8',
              success: function(){
                      console.log("yay!");
                      buildTemplateDetails($('#templateModifyTitleDiv').html());
                      /*
                      $element.find('#newTaskDescription').val('');
                      $element.find('#newTaskName').val('');
                      $element.find('.additemheaderfooter').show(); 
            	      */
                      
              }, 
              error: function(){
                      console.log("boo!");}
              });    

    	
    
                                      
        }
  
  
  
        function modifyTemplate(templatename){
        
          $('#addtemplate').hide();
          $('#templatesDiv').hide(); 
          $('#templateModifyDiv').show();
          $('#templateInputDiv').hide(); 
          
          
          buildTemplateDetails(templatename);
          
          console.log('modify template ' + templatename);
        
        }


        
        startApplyTemplate = function(eventdata){
        
    		var id = eventdata.data.context.entity.id;
		this._userstoryid = id;
        	
        	$element = eventdata.element;
		$element.find('#modTemplateDone').click(function(){
                                console.log('done');
  				
  				$('#templatesDiv').show();
              			$('#addtemplate').show();
            			$('#templateModifyDiv').hide();
                		$('.additemheaderfooter').show();
                        	$('#templateAddNewButton').show();
                       		return false;                        
                        });
                	
               

		
		 $element.find('#showAddTask').click(function(){
                        	
                                console.log('show add task');
                  		$element.find('#templateModifyContents').hide();
                    		$element.find('.additemheaderfooter').hide();
                		$element.find('#templateAddTask').show();
                
                       		return false;
                        }); 
                  
                 $element.find('#doCancelTask').click(function(){
                        	
                                $element.find('#newTaskDescription').val('');
                            	$element.find('#newTaskName').val('')
                		$element.find('#templateAddTask').hide();
                      		$element.find('#templateModifyContents').show();
                    		$element.find('.additemheaderfooter').show();                
                       		return false;
                        }); 
                  
                  
                  
                 $element.find('#doSaveTask').click(function(){
               
               		console.log('lets save some tasks');  
                  
                  	console.log($('#templateModifyTitleDiv').html());
                    	
                    	
                        
        		//var savedata = { };                
  			var savedata = {  };
                        savedata[fixInput($('#newTaskName').val())] = '["Tasks", "' + fixInput($('#newTaskDescription').val()) + '"]';
    	
    			
                    
    	
                      	
         		//savedata = JSON.stringify(savedata);
            		console.log(savedata);
        			$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + fixInput($('#templateModifyTitleDiv').html()),
		                        data: JSON.stringify({
                        		'scope'     : 'Public',
                        		'publicData': savedata,
                        		'userData'  : null
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        console.log("yay!");
                            		buildTemplateDetails($('#templateModifyTitleDiv').html());
                          		$element.find('#newTaskDescription').val('');
                            		$element.find('#newTaskName').val('');
                                        $element.find('.additemheaderfooter').show(); 
                              
                        		
                      		}, 
       		    		error: function(){
                                        console.log("boo!");}
                		});
        
        		$element.find('#templateAddTask').hide();
          		$element.find('#templateModifyContents').show();
            		
	        	return false;
        	});  
                  
                  
		
          
		$element.find('#templateAddNewButton').click(function( event ){
                        //$element.find('#templateTableDiv').hide();                                                       
		       	$element.find('#templateAddNewButton').hide();
        	        $element.find("#templateInputDiv").show();
	               
                        $('#doadd').click(function(){
                		if($('#newTemplateName').val() == ''){
                                return false;
                                }
                		$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + fixInput($('#newTemplateName').val()),
		                        data: JSON.stringify({
                        		'scope'     : 'Public',
                        		'publicData': '',
                        		'userData'  : null
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
                          	//$element.find('#templateTableDiv').show();  
                        	return false;
                                                                                      
			});
                        
			
        	
            		return false;
        		});
 
                  	/*
                    		This section is for the test cases
                    	*/
                  
              		$element.find('#showAddTestCase').click(function(){
                        	
                  		$element.find('#templateModifyContents').hide();
                      		$element.find('.additemheaderfooter').hide();
                		$element.find('#templateAddTestCase').show();
                
                       		return false;
                        }); 
                  
                 	$element.find('#doCancelTestCase').click(function(){
                        	//clear the test cases
                                $element.find('#newTestCaseSteps').val('');
                                $element.find('#newTestCaseSuccess').val('');
	                        $element.find('#newTestCaseName').val('')
                		$element.find('#templateAddTestCase').hide();
                      		$element.find('#templateModifyContents').show();
	                        $element.find('.additemheaderfooter').show();  
                
                       		return false;
                        });
                
                
                        $element.find('#doSaveTestCase').click(function(){

			console.log('lets save some testcases');  
                  	console.log($('#templateModifyTitleDiv').html());
                    	
  			var savedata = {  };
                        savedata[fixInput($('#newTestCaseName').val())] = '["TestCases", "","' + fixInput($('#newTestCaseSteps').val()) + '","' + fixInput($('#newTestCaseSuccess').val()) +'"]';
   
            		console.log(savedata);
        			$.ajax({
                    			type: 'POST',
		                        async: false,
                    			url: configurator.getApplicationPath()+'/storage/v1/ApplyTemplateMashup/' + fixInput($('#templateModifyTitleDiv').html()),
		                        data: JSON.stringify({
                        		'scope'     : 'Public',
                        		'publicData': savedata,
                        		'userData'  : null
                    		}),
                    		contentType: 'application/json; charset=utf8',
		                success: function(){
                                        console.log("yay!");
                            		buildTemplateDetails($('#templateModifyTitleDiv').html());
                          		$element.find('#newTestCaseSteps').val('');
                            		$element.find('#newTestCaseSuccess').val('');
                              		$element.find('#newTestCaseName').val('');
                                	$element.find('.additemheaderfooter').show(); 
                        		
                      		}, 
       		    		error: function(){
                                        console.log("boo!");}
                		});
        
        		$element.find('#templateAddTestCase').hide();
          		$element.find('#templateModifyContents').show();
	        	return false;
        	});
           
        
            addTemplateTable($element);
        };
        
       
        /*
        fix the input from the text boxes
        */
        function fixInput(s){

          	s = s.replace(/"/gm, '"');
                s = s.replace(/>/gm, '>');
                s = s.replace(/</gm, '<');
                //s = s.replace(/'/gm, ''');
            	s = s.replace(/(\r\n|\n|\r)/gm, '\n');
        	s = s.replace(/(\r\n|\n|\r)/gm, '<br />');
       		return s;
	}
        
        
        
        /*
        This is used for the first build of the available templates.
        */
        function addTemplateTable($element){
                                            
                $element.find("#templateTableDiv").html('');
                $element.find("#templateTableDiv").append(buildTemplateTable());
         
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
    	
    
        var table = $('<table width= 500></table>');
        table.append($('<tr><th colspan = 4 align="left">Templates</th></tr>'));
                  
          
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
                                       
                                        $.each(data.publicData, function(k,item) {
						
                                               
              					
						
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
        Remove the template
        */
        function removeTemplate(templatename){
        
                                              
                                              
          //console.log('remove template' + templatename);
                
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