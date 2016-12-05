function Glcalevt(){

    Plugin.apply(this,arguments);

    this._storage=this._settings.data;
    
    this.setData=function(resp){
        localStorage.setItem(this._storage.key,JSON.stringify(resp.items));
        window.dispatchEvent(new CustomEvent(this._storage.event,{'detail': resp.items}));
    }
    //if no data then bring it...
    this.createButton=function(){
      var d=document,div = d.createElement('div'),p = d.createElement("p");
      div.id = 'authorize-div';
      d.body.appendChild(div);
      div.appendChild(p);
      p.appendChild(d.createTextNode("Authorize access to Google Calendar API"));
      

      var btn = d.createElement("button");        
      btn.appendChild(d.createTextNode("Authorize"));                               
      div.appendChild(btn); 
      btn.addEventListener("click", function(){
        gapi.auth.authorize({
          'client_id': '169881026239-62ks55c662hlrf6hnkui6uspmom0mj9i.apps.googleusercontent.com',
          'scope': "https://www.googleapis.com/auth/calendar.readonly",'immediate': false
        },function(authResult) {
            if (authResult && !authResult.error) {
              div.parentNode.removeChild(div);
              gapi.client.load('calendar', 'v3', function(){
                var date=new Date(),
                    date_from=new Date(date.getFullYear(),1,1),date_to=new Date();

                gapi.client.calendar.events.list({
                  'calendarId': 'primary','showDeleted': false, 'singleEvents': true,
                  'timeMin': date_from.toISOString(),'timeMax': date_to.toISOString(),
                  'maxResults': 999999,'orderBy': 'startTime'
                }).execute(this.setData.bind(this));
              }.bind(this));

            } else {
              div.appendChild(document.createElement('br'));
              div.appendChild(document.createTextNode("Error:"+authResult.error+","+authResult.error_subtype));
            }
          }.bind(this)
        );
      }.bind(this), true);
    }
    if(this._storage && null==this._data){
      var d = document, t = 'script', o = d.createElement(t),s = d.getElementsByTagName(t)[0];
      o.src = 'https://apis.google.com/js/client.js';
      o.addEventListener('load', this.createButton.bind(this), false);
      d.body.appendChild(o);
    }

}
Glcalevt.prototype = Object.create(Plugin.prototype);
Glcalevt.prototype.constructor = Glcalevt;
