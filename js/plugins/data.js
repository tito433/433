var DataFetcher=function() {

	this._DataCallabk=false;

	this.addGoogleAPI=function(callBack){
		this._DataCallabk=callBack;

	 	var iDiv = document.createElement('div');
		iDiv.id = 'authorize-div';
		document.getElementsByTagName('body')[0].appendChild(iDiv);

		var p = document.createElement("p");
		var node = document.createTextNode("Authorize access to Google Calendar API");
		p.appendChild(node);
		iDiv.appendChild(p);

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
	        'client_id': '169881026239-62ks55c662hlrf6hnkui6uspmom0mj9i.apps.googleusercontent.com',
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
	this.getData=function(callBack){
	    if (store.enabled) {
	        var data=store.get("evt.cal.raw");
	        if(data){
	        	if(undefined!=callBack)
	        	return  callBack(data);
	        }
	    }
	    this.addGoogleAPI(callBack);
	    return false;
	}
	this.clear=function(){
		if (store.enabled) {
	        store.clear()
	    }
	}
	this.setData=function(data){
	 	if (store.enabled) {
	        store.set("evt.cal.raw", data);
	    }
	 }
}
DataFetcher.getValue=function(data,key){
	var args = key.split('.');
	for (var i = 0; i < args.length; i++) {
	    if (!data || !data.hasOwnProperty(args[i])) {
	      return data[args[i]];
	    }
	    data = data[args[i]];
	  }

	  return data;
}
DataFetcher.hasValue=function(data,findValue,index){
    switch(typeof data) {
        case "object":
        case "array":
            for (var item in data) {
                var r=DataFetcher.hasValue(data[item],findValue,item);
                if(r!=undefined)  return r;
            }
            break;
        default:
        	var args=findValue.split(':'),key=false,value=args[0];

			if(args.length>1){
				key=args[0];
				value=args[1];
			}
			

			var regx=new RegExp(value,"i"),match = regx.exec(''+data);

			if(key!=false && key==index && match)
				return data;
        	if(!key && match)  
        		return data;
    }
}