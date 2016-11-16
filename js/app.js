"use strict";

function Day(date){
    Drawable.call(this);

    this.date=date;
    this.fillStyle='#fff';
    this.fontColor='#000';
    this.evts=[];
    this.marked=false;

    var year=date.getFullYear(), month=date.getMonth(), day=date.getDate();
    this.label=[year,month,day];


    this.draw=function(ctx){
        //ctx.save();
        ctx.beginPath();
        // Drawable.prototype.draw.call(this,ctx);
        ctx.fillStyle=this.fillStyle;
        ctx.rect(this.x,this.y,this.w,this.h);
        ctx.closePath();
        ctx.stroke();
        if(this.marked) ctx.fill();
        
        //ctx.restore();
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
  this._settings={size:50,font:16,dataKeyset:[ 'summary', 'start.dateTime' ]}.extendEx(sett);
  this._data=[];
  console.log(this._settings)
  this.data=function(){
    if(arguments.length==0){
      if(this._data.length<1) return [];

      var y=this._data[0].y,prev='',run=0,
          yc=1,xc=false,result='',typ='',counter=0;
      
      for(var idx in this._data){
        counter++;
        var ev=this._data[idx];
        typ=ev.marked?'o':'b';

        if(y==ev.y){
          if(prev!='' && prev!=typ){
            result+=(run<2)?prev:run+prev;
            run=-1;
          }
          run++;
        }else{
          if(false===xc){xc=counter-1;}
          result+=run+prev+'$';
          yc++;run=0;y=ev.y;
        }
        prev=typ;
      }

      return 'x = '+xc+', y = '+yc+', rule = B3/S23'+"\n"+result+'!';
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
  this.analyze=function(output){
      if(this._data.length==0){
        output.innerHTML+='Not engough data.';
        return false;
      }

      var net = new brain.NeuralNetwork();
      var input=this._data;
      
      var rects=[],i=0,ln=input.length,
          date=new Date(input[0].start.dateTime),
          eDate=new Date(input[ln-1].end.dateTime);
        date.setHours(0);
        date.setMinutes(0);
        eDate.setHours(23);
        eDate.setMinutes(59);

      while(date<eDate){
        var evDate=new Date(input[i].start.dateTime);

        var year=date.getFullYear(),
            month=date.getMonth(),
            day=date.getDate(),
            hour=date.getHours(),
            min=date.getMinutes();

        if(evDate.getFullYear()==year && evDate.getMonth()==month && evDate.getDate()==day){
          hour=evDate.getHours();
          min=evDate.getMinutes();
          rects.push({'input':{'year':year,'month':month,'day':day,'hour':hour,'minute':min},'output':{event:1}});
          i++;
        }else{
          rects.push({'input':{'year':year,'month':month,'day':day,'hour':hour,'minute':min},'output':{event:0}});
        }

        date.setDate(date.getDate() + 1);
      }

      output.innerHTML+='Training data prepared.<br/>';

      net.train(rects);
      output.innerHTML+='Training complete.<br/>';

      //predict?
      output.innerHTML+='Lets predict some.<br/>';
      var startDate=new Date(),
          maxDate=new Date();

          startDate.setDate(eDate.getDate()-21);
          maxDate.setDate(startDate.getDate()+4);
      
      console.log(startDate,maxDate);
      var counter=0;

      var timer=setInterval(function(){
        if(startDate>maxDate){
          output.innerHTML+='Analyze completed:'+counter;
          clearInterval(timer);
        }else{
          var hour=0,min=0;
            counter++;
            while(hour<=23){
              var curDate=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),hour,min);
              var result=net.run({'year':curDate.getFullYear(),'month':curDate.getMonth(),'day':curDate.getDate(),'hour':hour,'minute':min});
              console.log(curDate,result.event);
              if(result.event>0.95){
                output.innerHTML+='Found:'+curDate+'<br/>';
              }
              min++;
              if(min==60){  hour++; min=0; }
            }
          startDate.setDate(startDate.getDate()+1);

        }
      },1000);
      

  }
  this.redraw=function(){
    var ln=this._data.length,i=0;

    if(ln){
      this.clear();
      var rects=[],
          date=new Date(this._data[0].start.dateTime),
          eDate=new Date(this._data[ln-1].end.dateTime);

      while(date<eDate){
        var size=parseInt(this._settings.size),
            evDate=new Date(this._data[i].start.dateTime);

        var rect=new Day(date).size(size,size);
            rect.fontSize=this._settings.font;

        if(evDate.getDate()>=date.getDate() && evDate.getDate()<date.getDate()+1){
          var hour=evDate.getHours(),mins=evDate.getMinutes();
          rect.events(hour+':'+mins);
          i++;
        }
            
        rects.push(rect);
        this.add(rect);
        date.setDate(date.getDate() + 1);
      }
      this.layout.flowLeft(rects);
      this.draw();
    }
  }
  this.list=new List(menu,{ filter:{input:'#filter',output:this.processData.bind(this)}});
  this.dataFetcher.getData(this.processData.bind(this));
  
  this.reset=function(){
    this.clear();
    this.list.reset();
    this.dataFetcher.clear();
    this.dataFetcher.getData(this.processData.bind(this));
  }
  this.setting=function(key,val){
    if(undefined==val){
      return this._settings[key];
    }else{
      this._settings[key]=val;
      this.redraw();
    }
  }

}

Object.prototype.extendEx=function(){
  var dst=this;
    for(var i=0; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                dst[key] = arguments[i][key];
    return dst;
}