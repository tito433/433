"use strict";

function Day(date){
    Drawable.call(this);

    this.date=date;
    this.fillStyle='#fff';
    this.fontColor='#888';
    this.evts=[];
    this.marked=false;

    var year=date.getFullYear(), month=date.getMonth(), day=date.getDate();
    this.label=[year,month,day];


    this.draw=function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle=this.fillStyle;
        ctx.rect(this.x,this.y,this.w,this.h);
        ctx.closePath();
        ctx.stroke();
        if(this.marked) ctx.fill();
        Drawable.prototype.draw.call(this,ctx);
        ctx.restore();
    }
    this.events=function(){
      if(arguments.length==0){
        return this.evts;
      }else{
        this.evts=this.evts.concat(Array.prototype.slice.call(arguments));
        this.label.push(this.evts.join());
        this.fillStyle='#888';
        this.fontColor='#fff';
        this.marked=true;
        return this;
      }
    }
    this.onClick=function(x,y){
      var x=this.fillStyle;
      this.fillStyle=this.fontColor;
      this.fontColor=x;
      this.marked=!this.marked;
    }
}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;

function Application(menu,display,sett){
  Canvas.call(this,display);

  this.dataFetcher=new DataFetcher();
  this.layout=new Layout(this.width,this.height);
  sett=sett==undefined?{}:sett;
  this._settings=extendEx({size:50,font:16,dataKeyset:[ 'summary', 'start.dateTime' ]},sett);
  this._data=[];
  this._box=[];

  this.data=function(){
    if(arguments.length==0){
      return this.getRLE();
    }else{
        var data=arguments[0];
        if(data && data.length){
          data=data.sort(function(a,b){
            var keyA = new Date(a.start.dateTime),keyB = new Date(b.start.dateTime);
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
          });
          this._data=data;
          this.redraw();
        }
    }
  }

  this.processData=function(data){
    if (data.length > 0) {
        this.list.draw(data,this._settings.dataKeyset);
        this.data(data);
        
      }
  };
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
  this.redraw=function(){
    var ln=this._data.length,i=0;

    if(ln){
      this.clear();
      this._box=[];
      var date=new Date(this._data[0].start.dateTime),
          eDate=new Date(this._data[ln-1].end.dateTime);

      while(date<eDate){
        var size=parseInt(this._settings.size),
            evDate=new Date(this._data[i].start.dateTime);

        var rect=new Day(new Date(date.getFullYear(),date.getMonth(),date.getDate())).size(size,size);
            rect.fontSize=this._settings.font;

        if(evDate.getDate()>=date.getDate() && evDate.getDate()<date.getDate()+1){
          var hour=evDate.getHours(),mins=evDate.getMinutes();
          rect.date.setHours(hour);
          rect.date.setMinutes(mins);
          rect.events(hour+':'+mins);
          i++;
        }
            
        this._box.push(rect);
        this.add(rect);
        date.setDate(date.getDate() + 1);
      }
      this.layout.flowLeft(this._box);
      this.draw();
    }
  }
  this.list=new List(menu,{ filter:{input:'#filter',output:this.processData.bind(this)}});
  this.dataFetcher.getData(this.processData.bind(this));
  
  this.getRLE=function(){
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

      return 'x = '+xc+', y = '+yc+', rule = B3/S23'+"\n"+result+'!';
  };
  this.reset=function(){
    this.clear();
    this.list.reset();
    this.dataFetcher.clear();
    this.dataFetcher.getData(this.processData.bind(this));
  };
  this.setting=function(key,val){
    if(undefined==val){
      return this._settings[key];
    }else{
      this._settings[key]=val;
      this.redraw();
    }
  };

}

function extendEx(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}