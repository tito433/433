"use strict";

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
String.prototype.fistCapital = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

window.loadScript=function(u,c){
  if(!u && typeof u!=="String") throw "Invalid js["+Object.prototype.toString.call(u)+"] name to load.";

  var d = document, j = d.createElement('script');
  j.src =u.startsWith('http')?u:'js/'+u+'.js';

  if (c && typeof c==='function') { 
    j.addEventListener('load', function cb(e){
      e.currentTarget.removeEventListener(e.type, cb);
      return c.call(c);
    }, false); }
  d.body.appendChild(j);
}