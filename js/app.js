"use strict";

function Application(input,output){
  
  this.dom={'input':input,'output':output};
  this._plugins=[];
  this._storageEnabled=typeof(Storage) !== "undefined";

  this.addPlugin=function(pl){
    var PlClass=pl.capitalizeFirstLetter();
    if(typeof window[PlClass] === "function"){
      var pln=new window[PlClass](this.dom.input,this.dom.output);
      if(pln instanceof Plugin){
        this._plugins.push(pln);
        pln.view.call(pln,this._data);
      }
    }
  }

  this.data=function(){
    if(arguments.length==1){
      this._data=arguments[0];
      
      this._plugins.forEach(function(plugin){
        plugin.view.call(plugin,this._data);
      });
    }else{
      return this._data;
    }
  }
  

  this.getData=function(callBack){
      if (this._storageEnabled) {
          var data=localStorage.getItem("evt.cal.raw");
          if(data && data!=''){
            return JSON.parse(data);
          }
      }
      
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
              'scope': "https://www.googleapis.com/auth/calendar.readonly",'immediate': true
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
                    }).execute(function(resp) {  callBack(resp.items);});
                  });

                } else {
                  div.appendChild(document.createElement('br'));
                  div.appendChild(document.createTextNode("Error:"+authResult.error+","+authResult.error_subtype));
                }
              }
          );
        }, true);
      return [];
  }

  this.saveData=function(key,data){
    if (this._storageEnabled) {
        localStorage.setItem(key,JSON.stringify(data));
    }
  }
  this._data=this.getData(function(data){
    this.saveData("evt.cal.raw",data);
    this.data(data);
  }.bind(this));

}



Object.defineProperty(Object.prototype, 'extend', {
  value:function(){
    var target=this;
     for(var i=0; i<arguments.length; i++)
          for(var key in arguments[i])
              if(arguments[i].hasOwnProperty(key))
                  target[key] = arguments[i][key];
      return target;
  }
});
Object.defineProperty(Object.prototype, 'forEach', {
  value:function(callBack){
    for(var name in this){callBack(name,this[name]);}
  }
});
Object.defineProperty(Object.prototype, 'map', {
  value:function(predicateFunction){
    var results ={};
    this.forEach(function(name,val) {
      var resp=predicateFunction(name,val);
      if(resp && resp.name && resp.val) results[resp.name]=resp.val;
      });
      return results;
  }
});
Object.defineProperty(Object.prototype, 'filter', {
  value:function(predicateFunction){
    var results ={};
    this.forEach(function(name,val) {
      if(predicateFunction(name,val)) results[name]=val;
      });
      return results;
  }
});

//http://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}