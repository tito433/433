var DataFetcher=function(argument) {
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

	var self={getValue:getValue};

	if (!(this instanceof DataFetcher)){
         return self;
    }

	this._DataCallabk=false;

	this.addGoogleAPI=function(callBack){
		this._DataCallabk=callBack;

	 	var iDiv = document.createElement('div');
		iDiv.id = 'authorize-div';
		document.getElementsByTagName('body')[0].appendChild(iDiv);

		var span = document.createElement("span");
		var node = document.createTextNode("Authorize access to Google Calendar API");
		span.appendChild(node);
		iDiv.appendChild(span);

		var btn = document.createElement("button");        
		btn.appendChild(document.createTextNode("Authorize"));                               
		iDiv.appendChild(btn); 
		btn.addEventListener("click", this.glAuthorizeMe.bind(this), true);
		//script
		var script = document.createElement('script');
		script.src = "https://apis.google.com/js/client.js";
		document.getElementsByTagName('body')[0].appendChild(script);
 	}
 	this.glAuthorizeMe=function() {
 		var self=this;
	    gapi.auth.authorize({
	        'client_id': CLIENT_ID,
	        'scope': "https://www.googleapis.com/auth/calendar.readonly",
	        'immediate': true
	    }, function(authResult) {
	          var authorizeDiv = document.getElementById('authorize-div');
	          if (authResult && !authResult.error) {
	            authorizeDiv.style.display = 'none';
	            gapi.client.load('calendar', 'v3', self._getAllEvents.bind(self));
	          } else {
	            authorizeDiv.appendChild(document.createElement('br'));
	            authorizeDiv.appendChild(document.createTextNode("Error:"+authResult.error+","+authResult.error_subtype));
	          }
	        }
	    );
  	}
  	this._getAllEvents=function() {
	    var self=this,
	    	date_from=new Date("01 Jan 2014"),
	        date_to=new Date();
	        date_to.setDate(date_to.getDate() + 1); //till tomorrow?

	    gapi.client.calendar.events.list({
	      'calendarId': 'primary',
	      'timeMin': date_from.toISOString(),'timeMax': date_to.toISOString(),
	      'showDeleted': false, 'singleEvents': true,
	      'maxResults': 999999,'orderBy': 'startTime'
	    }).execute(function(resp) {
	      self.setData(resp.items);
	      if(self._DataCallabk)
	      	self._DataCallabk(resp.items);

	    });
	};
	this.getData=function(){
	    if (typeof(Storage) !== "undefined") {
	        var data=localStorage.getItem("events");
	        if(data){
	        	return JSON.parse(data);
	        }
	    }
	    return false;
	}

	this.setData=function(data){
	 	if (typeof(Storage) !== "undefined") {
	        localStorage.setItem("events", JSON.stringify(data));
	    }
	 }
}