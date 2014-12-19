easy.controller('home',function ($scope, $rootScope) {

	$scope.name = "rishul";
	$scope.bookName = "OData";
	$scope.intro = [
		{
			text:"Good to be great! But it’s great when we share!!   Why not discuss over a topic in the university or assignment you have to share this weekend? ",
			class:"iImg1",
			title:"Discuss"
		},
		{
			text:"Tell us what you need to remember while you’re reading and we have you covered. A word, a paragraph or a whole topic we’ll remember it for you.",
			class:"iImg2",
			title:"Highlight"
		},
		{
			text:"We keep you updated with all posts, questions and answers.Your review counts, mark the answers to question with a thumps up so that your friends too can be benefitted.",
			class:"iImg3",
			title:"Organize"
		}

	];
});




easy.controller('profileCtrl',function ($scope , $stateParams,$rootScope) {

	$scope.name = "Ashwin";
	
});



easy.controller('navBar',function ($scope,$http,authenticate, $timeout , $rootScope) {

	
	var x = document.cookie;
	if (x) {
		$scope.authenticated = true;
		var arr = x.split (";");
		$scope.name = arr[0].substring(arr[0].indexOf("=")+1);
		$scope.role = arr[1].substring(arr[1].indexOf("=")+1);
		authenticate.currentUser = {
			userName:$scope.name,
			role:$scope.role
		};
		addPic();
		
	}
	else {
		$scope.authenticated = false;
		authenticate.currentUser =null;
	}
	
	function addPic () {
		$timeout(function () {

			var pic = document.getElementsByClassName('circular')[0];
			pic.classList.add($scope.name);
		} , 100);

	}

	$scope.logout = function () {
		 document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		 document.cookie = "role=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
		$scope.authenticated = false;

		$timeout(function () {

			var pic = document.getElementsByClassName('circular')[0];
			pic.classList.remove($scope.name);

		} , 100);
		
	}

	$scope.signIn = function (username , password) {

		console.log(username + password);
		$http.post('/login',{username:username , password:password}).
		then (function (res){
			if (res.data.success) {
				authenticate.currentUser = res.data.user;
				$scope.authenticated = true;
				$scope.name = username;
				document.cookie="username="+username+";";
				document.cookie = "role="+authenticate.currentUser.role+";";
				console.log('Success');
				addPic();
			}
			else
				console.log('Failure');	

		});
	}
});

easy.controller('bookCtrl',function ($scope , $http , $stateParams , $compile , authenticate , $rootScope) {
	var presentSelection , newlyAdded = [] , classHighlighted;
	$scope.editOptions = {};
	$scope.bookName = "OData";
	$scope.template = "questions";
	$scope.isVisible = false;
	$scope.response;
	$scope.editOptions.newQues = null;
	$scope.editOptions.newNote = null;	
	$scope.editOptions.newAns = null;
	var data;
	var bookName = $stateParams.bookName;
	var source = new EventSource('/notifications');




	function bgColorToSelected (className) {

		var selElements = document.getElementsByClassName('selected');
		for (var ii = 0; ii < selElements.length; ++ii) {
			selElements[ii].classList.remove('selected');
		}
		var current = document.getElementsByClassName(className)[0];
		current.classList.add('selected');
	}

	var previousScrollDist;
	$scope.scrollToSelected = function (className) {
		//called when clicked on a bordered text in document or the question in the list
	//	if (className.substring(0,className.indexOf("highlight")-1) != classHighlighted) {
		var presentScroll = $('#page-container').scrollTop();
		var  scrollDist = $("."+className.replace(/\s/g,".")).offset().top;

			if (className != classHighlighted || presentScroll != scrollDist) {			
				
					scrollDist += presentScroll;
					scrollDist -=100;


			$('#page-container').animate({
	  		  scrollTop: ( scrollDist)
			}, 1000);
		}

		bgColorToSelected(className);
		$scope.displayAnnotation(className);
	}

	$scope.resetAnnotations = function () {
		var selElements = document.getElementsByClassName('selected');
		for (var ii = 0; ii < selElements.length; ++ii) {
			selElements[ii].classList.remove('selected');
		}
		$scope.selectedText = null;
		$scope.questions = null;
		$scope.notes = null;
	}

	$scope.editOptions.add = function (type,index,aIndex) {

		var obj = fetchClassMeta (classHighlighted);
		user = authenticate.currentUser;
		if (!user ) {
			alert("please log in");
			return;
		}

		if (!obj) {

			var obj = {
						sBook:bookName,
						nStartOffset:2,
						nEndOffset:10,
						sStartParentClass:classHighlighted,
						sEndParentClass:classHighlighted,
						sText:$scope.selectedText,						
						nPageNo:1
					};
			}

	
		//things must be added in the DOM
		switch (type) {


			case 'questions' :
				if (obj.aQuestions) {
				
					obj.aQuestions.push({ sText:$scope.editOptions.newQues , dDate:new Date().toISOString() , sUser:user.userName, nVotes:"0"});
				}
				else {
					obj.aQuestions = [];
					obj.aQuestions.push({ sText:$scope.editOptions.newQues , dDate:new Date().toISOString() , sUser:user.userName, nVotes:"0"});
				}
				break;

			case 'answers':
				if (obj.aQuestions[0].aAnswers) {
				
					obj.aQuestions[0].aAnswers.push({ sText:$scope.editOptions.newAns , dDate:new Date().toISOString() , sUser:user.userName, nVotes:"0"});
				}
				else {
					obj.aQuestions[0].aAnswers = [];
					obj.aQuestions[0].aAnswers.push({ sText:$scope.editOptions.newAns , dDate:new Date().toISOString() , sUser:user.userName , nVotes:"0"});
				}
				break;
			

			case 'notes':
				if (obj.aNotes) {
				
					obj.aNotes.push({ sText:$scope.editOptions.newNote , dDate:new Date().toISOString() , sUser:user.userName});
				}
				else {
					obj.aNotes = [];
					obj.aNotes.push({sText:$scope.editOptions.newNote , dDate: new Date().toISOString() ,sUser:user.userName});
				}
					
					
				break;
		}

		if (obj._id) {

			$http.put(window.location.origin + '/book/' + bookName + '/annotations', 
					{
						responseType:"application/json",
						data:obj
					})
				.success(function (data,err) {
					console.log("update success");
					$scope.showAnnotations();
					
				})
				.error(function (data, err) {

						console.log("update fail");
				});
		}else {

				$http.post(window.location.origin + '/book/' + bookName + '/annotations', 
					{
						responseType:"application/json",
						data:obj
					})
				.success(function (data,err) {
					console.log("insert success");
					$scope.showAnnotations();
					
				})
				.error(function (data, err) {

						console.log(" insert fail");
				});
		}

		$scope.editOptions.newQues = null;
		$scope.editOptions.newAns = null;
		
	
		
	}

	function fetchClassMeta (className) {
		for (var ii = 0; ii < data.length; ++ii) {

			if (data[ii].sStartParentClass == className) {
				return data[ii];
			}
			
		}
	}

	function addAnnotationsToDOM () {
		for (var ii = 0; ii < data.length; ++ii) {

			highlight (data[ii].sStartParentClass , data[ii].sEndParentClass);
		}

	}

	$scope.displayAnnotation = function (className) {
		if (className.indexOf("highlight") > 0) {
			className = className.substring(0,className.indexOf("highlight")-1);
		}

		var meta = fetchClassMeta(className);
		classHighlighted = className;

		if (meta) {
			$scope.questions = meta.aQuestions;
			$scope.notes = meta.aNotes;
			$scope.selectedText = meta.sText;
		}
		else {
			$scope.questions = null;
			$scope.notes = null;
		}
	}




	$scope.showAnnotations = function () {
		$scope.isVisible = true;
		$http.get(window.location.origin + '/book/' + bookName + '/annotations', {responseType:"application/json"}).
		success(function (res,error) {

			for (var ii = 0 ; ii < res.length ; ++ii) {
				if(res[ii].aNotes && res[ii].aNotes.length == 0) {
					delete res[ii].aNotes;
				}

				if( res[ii].aQuestions && res[ii].aQuestions.length == 0) {
					delete res[ii].aQuestions;
				}
			}

			data = res;
			$scope.response = res;
			addAnnotationsToDOM();
			if (classHighlighted){
				$scope.scrollToSelected(classHighlighted);

			}
			
		}).
		error(function (data,error) {
			console.error("Annotations failed");
		});
	}

	$http.get(window.location.origin + '/book/' + bookName,{responseType:"text/html"}).
	success(function (data , error) {
		//var a = new Uint8Array(data);
			//var dataView = new DataView(data);
			//var blob = new Blob(dataView.buffer);
			//working code below
		/*	 var blob = new Blob([data], {
                                type: 'application/octet-stream'
                            });
		zip.useWebWorkers = true;
		zip.workerScriptsPath = '/js/app/';

		zip.createReader(new zip.BlobReader(blob), function(reader) {

		  // get all entries from the zip
		  reader.getEntries(function(entries) {
		    if (entries.length) {

		    	for (var ii = 0; ii < entries.length; ++ii) {
		    		console.log(entries[ii].filename);
		      // get first entry content as text
				      entries[ii].getData(new zip.TextWriter(), 
				      	function(text) {
				        // text contains the entry data as a String
					        console.log(text);

					        // close the zip reader
					        reader.close(function() {
					          // onclose callback
					          var a = 0;
					        });
		    	

		     			 },
					       function(current, total) {
					        // onprogress callback
					        var a = 0;
					      });
				 }
		    }
		  });
		},
		 function(error) {
		  // onerror callback
		  	console.log(error);
		});
		 */

	
		 var ele = document.getElementById("book");
		 ele.innerHTML = data;
		 $scope.showAnnotations()

	})
	.error( function (data , error) {
		var a = 0;

	});

	$scope.switchTemplate = function (template) {
		$scope.template = template;
	}


	function highlight (start , end) {

		var nextSibling , parentStartElement;
		parentStartElement = document.getElementsByClassName(start)[0];					
		if (!parentStartElement) {
			return;
		}
		parentStartElement.classList.add("highlight") ;

		$compile(parentStartElement)($scope);
		if (start == end) {
			return;
		}
		nextSibling = parentStartElement.nextSibling;
		if (nextSibling.className != end) {
			highlight(nextSibling.className , end);
		}
		else {
			parentStartElement = document.getElementsByClassName(end)[0];		
			parentStartElement.classList.add("highlight") ;
			$compile(parentStartElement)($scope);

		}
		
		return;

	}
	

	$scope.getSelection = function (event) {
			
			var selection = document.getSelection();
			if (!selection.isCollapsed) {
				var range = selection.getRangeAt(0);
				classHighlighted = range.startContainer.parentElement.className;
				highlight(range.startContainer.parentElement.className , range.endContainer.parentElement.className);
				presentSelection = {
					startClass: range.startContainer.parentElement.className , 
					endClass: range.endContainer.parentElement.className,
					text: range.startContainer.parentElement.innerText 
				}
				bgColorToSelected(classHighlighted);
				$scope.selectedText = range.startContainer.textContent;
				$scope.displayAnnotation (classHighlighted)
			}

	}





	function getQueIndex(classname , qIndex) {
		for (var ii = 0; ii < $scope.response.length; ++ii) {
			if ($scope.response[ii].sStartParentClass == classname) {
				return ii;
			}
		}
	}
	
	$scope.voteUp = function (className,qIndex, aIndex) {
		if (!className) {
			className = classHighlighted;
		}
		var index = getQueIndex(className,qIndex);
		if ($scope.response[index].aQuestions[qIndex].votedUp) {
		 	return;
		}
		if(typeof aIndex == "undefined") {
			$scope.response[index].aQuestions[qIndex].nVotes = parseInt($scope.response[index].aQuestions[qIndex].nVotes +1);
		
			$scope.response[index].aQuestions[qIndex].votedUp = true;
			$scope.response[index].aQuestions[qIndex].votedDown = false;
		}
		else {
			$scope.response[index].aQuestions[qIndex].aAnswers[aIndex].nVotes = parseInt($scope.response[index].aQuestions[qIndex].aAnswers[aIndex].nVotes +1);
			$scope.response[index].aQuestions[qIndex].aAnswers[aIndex].votedUp = true;			
			$scope.response[index].aQuestions[qIndex].aAnswers[aIndex].votedDown = false;	
		}
	}		

	$scope.voteDown = function (className,qIndex,aIndex) {
		if (!className) {
			className = classHighlighted;
		}
		var index = getQueIndex(className,qIndex);
		if ($scope.response[index].aQuestions[qIndex].votedDown) {
		 	return;
		}
		if(typeof aIndex == "undefined") {
			$scope.response[index].aQuestions[qIndex].nVotes = parseInt($scope.response[index].aQuestions[qIndex].nVotes - 1);
			$scope.response[index].aQuestions[qIndex].votedDown = true;
			$scope.response[index].aQuestions[qIndex].votedUp = false;
		}
		else {
			$scope.response[index].aQuestions[qIndex].aAnswers[aIndex].nVotes = parseInt($scope.response[index].aQuestions[qIndex].aAnswers[aIndex].nVotes -1);
			$scope.response[index].aQuestions[qIndex].aAnswers[aIndex].votedDown = true;
			$scope.response[index].aQuestions[qIndex].aAnswers[aIndex].votedUp = false;
		}
	}




});


easy.controller('libraryCtrl',function ($scope,$http,authenticate,$rootScope , $timeout) {

	$scope.name = "rishul";
	$scope.bookName = "OData";
	$scope.bookList;

	$scope.$watch(function () { return authenticate.currentUser }, function (newVal, oldVal) {
    if (typeof newVal !== 'undefined') {
        $scope.userRole = newVal.role;
    }



	});
	

	$scope.submitForm = function () {

		$timeout(function () {fetchDocuments();},500)
		fetchDocuments();
	}

	var fetchDocuments = function () {

		$http.get(window.location.origin + '/library',{responseType:"text/html"}).
		success(function (data , error) {
		
		 var a = 0;
		 for (var ii = 0; ii < data.length; ++ii) {
		 	data [ii] = data[ii].substring (0,data[ii].indexOf("."));
		 }
		 $scope.bookList = data;
		

		})
		.error( function (data , error) {
			var a = 0;

		});
	}

	fetchDocuments();



});
