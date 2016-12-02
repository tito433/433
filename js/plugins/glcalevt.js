function Glcalevt(){
    Plugin.apply(this,arguments);

    this._storage=this._settings.data;
    
    this.setData=function(resp){
        localStorage.setItem(this._storage.key,JSON.stringify(resp.items));
        this.notifyAll(resp.items);
    }
    this.notifyAll=function(pd){
        window.dispatchEvent(new CustomEvent(this._storage.event,{'detail': pd}));
    }

    if(this._data && this._data.length){
        this.notifyAll(this._data);        
    }else{
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
                    var date_from=new Date(),date_to=new Date();
                    date_from.setFullYear(date_to.getFullYear()-1);

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

}
Glcalevt.prototype = Object.create(Plugin.prototype);
Glcalevt.prototype.constructor = Glcalevt;
