window.onload =function(){
   var data=getData();
   if(!data){
   		addGoogleAPI();
   }else{
   		processData(data);
   }
}

function processData(data){
	document.open("text/html", "replace");
	if (data.length > 0) {
		console.log(data)
        document.write(JSON.stringify(data));
    } else {
        document.write("No events found!");
    }
    document.close();
}
function getData(){
    if (typeof(Storage) !== "undefined") {
        var data=localStorage.getItem("events");
        if(data){
        	return JSON.parse(data);
        }
    }
    return false;
 }

 function addGoogleAPI(){

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
	btn.onClick=glAuthorizeMe;
	//script
	var script = document.createElement('script');
	script.src = "https://apis.google.com/js/client.js?onload=glAuthorizeMe";
	document.getElementsByTagName('body')[0].appendChild(script);
 }
 function glAuthorizeMe() {
    gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES.join(' '),
        'immediate': true
      }, function(authResult) {
          var authorizeDiv = document.getElementById('authorize-div');
          if (authResult && !authResult.error) {
            // Hide auth UI, then load client library.
            authorizeDiv.style.display = 'none';
            gapi.client.load('calendar', 'v3', _getAllEvents);
          } else {
            authorizeDiv.appendChild(document.createElement('br'));
            authorizeDiv.appendChild(document.createTextNode("Error:"+authResult.error+","+authResult.error_subtype));
          }
        }
    );
  }
function _getAllEvents() {
    var date_from=new Date("01 Jan 2014"),
        date_to=new Date();
        date_to.setDate(date_to.getDate() + 1); //till tomorrow?

    gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': date_from.toISOString(),'timeMax': date_to.toISOString(),
      'showDeleted': false, 'singleEvents': true,
      'maxResults': 999999,'orderBy': 'startTime'
    }).execute(function(resp) {
      setData(resp.items);
      processData(resp.items);

    });
}
function setData(data){
 	if (typeof(Storage) !== "undefined") {
        localStorage.setItem("events", JSON.stringify(data));
    }
 }