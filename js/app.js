"use strict";

function Application(input,output,sett){
  Canvas.call(this,output);

  this.dom={'input':input,'output':output};
  this._plugins=[];
  // this.dataFetcher=new DataFetcher();
  this.layout=new Layout(this.width,this.height);
  sett=sett||{};
  sett=sett.filter(function(nm,val){return nm.indexOf('dt.')!=-1;}).map(function(nm,val){
    var srch='dt.', n=nm.indexOf(srch);
    n=n!=-1?n+srch.length:0;
    return {name:nm.substring(n),val:val};
  });
  this._settings={size:50,font:16,dataKeyset:[ 'summary', 'start.dateTime' ]}.extend(sett);
  this._data=[];
  this.fn=[];

  this.addPlugin=function(pl){
    var PlClass=pl.capitalizeFirstLetter();
    if(typeof window[PlClass] === "function"){
      var pln=new window[PlClass](this);
      if(pln instanceof Plugin){
        pln.init.call(this);
        this._plugins.push(pln);
      }else{
        console.log('not plugin?',pln instanceof Plugin,typeof pln)
      }
    }
  }

  this.data=function(){
    if(arguments.length==1){
      var data=arguments[0];
      if(data && data.length){
        data=data.sort(function(a,b){
          var keyA = new Date(a.start.dateTime),keyB = new Date(b.start.dateTime);
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });
        this._data=data;
        for(var i in this._plugins){
          this._plugins[i].onData.call(this);
        }
        return this;
      }
    }else{
      return this._data;
    }
  }
  

  this.analyze=function(callback){
    if(this._data.length==0){
      return 'Not engough data.';
    }

    var response='',
        net = new brain.NeuralNetwork(), 
        input=this._box.map(function(obj){
          var d=obj.date;
          return {'input':{'year':d.getFullYear(),'month':d.getMonth(),'day':d.getDate(),'hour':d.getHours(),'minute':d.getMinutes()},'output':{'event':obj.marked?1:0}};
        });
      
      net.train(input,{
        errorThresh: 0.005,  // error threshold to reach
        iterations: 20000,   // maximum training iterations
        log: true,           // console.log() progress periodically
        logPeriod: 100,       // number of iterations between logging
        learningRate: 0.3    // learning rate
      });
      console.log('Training complete.<br/>');

      //predict?
      var counter=0,lastDay=this._box[this._box.length-1].date,
          startDate=new Date(lastDay.getFullYear(),lastDay.getMonth(),lastDay.getDate(),0,0), 
          endDate=new Date();
          endDate.setDate(startDate.getDate()+30);
          

      var timer=setInterval(function(){
        if(startDate>endDate){
          console.log('Analyze completed:'+counter+' days',response);
          clearInterval(timer);
          if(callback) callback(response);

        }else{
          var hour=0,min=0;
          counter++;
          while(hour<=23){
            var sample={'year':startDate.getFullYear(),'month':startDate.getMonth(),'day':startDate.getDate(),'hour':hour,'minute':min};
            var result=net.run(sample);
            if(result.event>0.95){
              response+=startDate+'<br/>';
              console.log('Found:'+startDate+'<br/>');
            }
            min++;
            if(min==60){  hour++; min=0; }
          }
          startDate.setDate(startDate.getDate()+1);

        }
      },1000);
      //sending incomplete data!!!
      return response;
  }
  

  this.fn.getRLE=function(){
    if(this._box.length<1) return "";

      var ev=this._box[0],y=ev.y,prev=ev.marked?'o':'b',run=1,yc=1,xc=1,result='';
      for(var i =1,lb=this._box.length;i<lb;i++){
          ev=this._box[i];
          var typ=ev.marked?'o':'b';
          if(y==ev.y){
            if(typ===prev){
                run++;
            }else{
              result+=(run==1)?prev:run+prev;
              run=1;
              prev=typ;
            }
            if(1===yc){xc++;}
          }else{
            result+=run+prev+'$';
            yc++;
            run=1;
            y=ev.y;
          }
          prev=typ;
      }

      var response='x = '+xc+', y = '+yc+', rule = B3/S23'+"\n"+result+'!';
      var txt=document.createElement('textarea');
      txt.innerHTML=app.getRLE();
      document.body.appendChild(txt);
      txt.focus();
      txt.setSelectionRange(0, txt.value.length);
      document.execCommand("copy");
      infoPanel.innerHTML='RLE data copied to clipboard.<br/>Hint: Use Ctrl+v to get';
      document.body.removeChild(txt);

  };
  // this.fn.reset=function(){
  //   this.clear();
  //   this.dataFetcher.clear();
  //   this.dataFetcher.getData(this.data.bind(this));
  // };
  this.setting=function(key,val){
    if(undefined==val){
      return this._settings[key];
    }else{
      var re = /([a-z0-9]+)/gi, match = key.match(re);
      if(match && match.length>1){
        if(match[0]=='dt'){
          this._settings[match[1]]=val;
        }else if (match[0]=='fn' && this.fn[match[1]]){
          return this.fn[match[1]].call(this,val);
        }
      }    
    }
  };
  
  // this.dataFetcher.getData(this.data.bind(this));
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