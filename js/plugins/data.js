function Data() {
	Plugin.apply(this,arguments);

	this.init=function(){
		var ulControl=this.dom.input.querySelector('.control'),
			btnDataLoad=Plugin.addControl(ulControl,{'input.value':'Load data'}),
			_DataCallabk=false;
			
	    btnDataLoad.onclick=function(ev){
	        this.data(getData(this.data.bind(this)));
	    }.bind(this);
	}
	
	var addGoogleAPI=function(callBack){
		_DataCallabk=callBack;
		var d=document,
			iDiv = d.createElement('div'),
			p = d.createElement("p");
		
		iDiv.id = 'authorize-div';
		d.body.appendChild(iDiv);

		p.appendChild(d.createTextNode("Authorize access to Google Calendar API"));
		iDiv.appendChild(p);

		var btn = d.createElement("button");        
		btn.appendChild(d.createTextNode("Authorize"));                               
		iDiv.appendChild(btn); 
		btn.addEventListener("click", glAuthorizeMe, true);
		//script
		var script = d.createElement('script');
		script.src = "https://apis.google.com/js/client.js";
		d.body.appendChild(script);
 	};
 	var glAuthorizeMe=function() {
 		
	    gapi.auth.authorize({
	        'client_id': '169881026239-62ks55c662hlrf6hnkui6uspmom0mj9i.apps.googleusercontent.com',
	        'scope': "https://www.googleapis.com/auth/calendar.readonly",
	        'immediate': true
	    }, function(authResult) {
	          var authorizeDiv = document.getElementById('authorize-div');
	          if (authResult && !authResult.error) {
	            authorizeDiv.style.display = 'none';
	            gapi.client.load('calendar', 'v3', _getAllEvents);
	          } else {
	            authorizeDiv.appendChild(document.createElement('br'));
	            authorizeDiv.appendChild(document.createTextNode("Error:"+authResult.error+","+authResult.error_subtype));
	          }
	        }
	    );
  	}
  	var _getAllEvents=function() {
	    var date_from=new Date("01 Jan 2014"),
	        date_to=new Date();
	        date_to.setDate(date_to.getDate() + 1); //till tomorrow?

	    gapi.client.calendar.events.list({
	      'calendarId': 'primary',
	      'timeMin': date_from.toISOString(),'timeMax': date_to.toISOString(),
	      'showDeleted': false, 'singleEvents': true,
	      'maxResults': 999999,'orderBy': 'startTime'
	    }).execute(function(resp) {
	    	console.log(resp);
	      setData(resp.items);
	      if(_DataCallabk) _DataCallabk(resp.items);

	    });
	};
	var getData=function(callBack){
	    if (typeof(Storage) !== "undefined") {
	        var data=localStorage.getItem("evt.cal.raw");
	        if(data && data!=''){
	        	return JSON.parse(data);
	        }
	    }else{
	    	alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
            return
	    }
	    addGoogleAPI(callBack);
	    return [];
	}
	var setData=function(data){
	 	if (typeof(Storage) !== "undefined") {
	        localStorage.setItem("evt.cal.raw", JSON.stringify(data));
	    }else{
	    	alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
            return;
	    }
	};
	var getValue=function(data,key){
		var args = key.split('.');
		for (var i = 0; i < args.length; i++) {
		    if (!data || !data.hasOwnProperty(args[i])) {
		      return data[args[i]];
		    }
		    data = data[args[i]];
		  }

		  return data;
	};
	

}



Data.prototype = Object.create(Plugin.prototype);
Data.prototype.constructor = Data;
