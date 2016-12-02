"use strict";

function Application(input,output){
  if(typeof(Storage) === "undefined"){
    throw "Storage undefined! This app can't run without localStorage. Can you?";
  }

  this._settings={
    'dom':{'input':input,'output':output},
    'data':{'key':'evt.cal.raw','event':'433.data.changed'}
  };

  this.addPlugin=function(pl){
    var PlClass=pl.capitalizeFirstLetter();
    if(typeof window[PlClass] === "function"){
      new window[PlClass](this._settings);
    }
  }
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