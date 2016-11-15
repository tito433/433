"use strict";

function Day(date){
    Drawable.call(this);

    this.date=date;
    this.fillStyle='#fff';
    this.fontColor='#888';
    this.evts=[];
    this.marked=false;

    var year=date.getFullYear(), month=date.getMonth(), day=date.getDate();
    this.label=[month,day];


    this.draw=function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle=this.fillStyle;
        ctx.rect(this.x,this.y,this.w,this.h);
        ctx.stroke();
        ctx.fill();
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

function Application(menu,display){
  Canvas.call(this,display);

  this.dataFetcher=new DataFetcher();
  this.dataKeyset=[ 'summary', 'start.dateTime' ];
  this.layout=new Layout(this.width,this.height);
  this._settings={size:50,font:16};
  this._data=[];
  
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
        this.list.draw(data,this.dataKeyset);
        this.data(data);
        setTimeout(this.analise.bind(this,data),100);
      }
  };
  this.analise=function(data){

      var net = new brain.NeuralNetwork();
      //filter O'Clock onlys
      var input=data.filter(function(evt){
        return evt.summary.toLowerCase().indexOf("o'clock")!=-1;
      });
      
      var rects=[],i=0,date=new Date(input[0].start.dateTime),
          eDate=new Date(input[input.length-1].end.dateTime);

      while(date<eDate){
        var evDate=new Date(input[i].start.dateTime);

        var year=date.getFullYear(),
            month=date.getMonth(),
            day=date.getDate(),
            hour=date.getHours(),
            min=date.getMinutes();

        if(evDate.getDate()>=date.getDate() && evDate.getDate()<date.getDate()+1){
          hour=evDate.getHours();
          min=evDate.getMinutes();
          rects.push({'input':{'year':year,'month':month,'day':day,'hour':hour,'minute':min},'output':{event:1}});
          i++;
        }else{
          rects.push({'input':{'year':year,'month':month,'day':day,'hour':hour,'minute':min},'output':{event:0}});
        }

        date.setDate(date.getDate() + 1);
      }


     
      console.log(rects)
      net.train(rects);

      var today=new Date(),
        year=today.getFullYear(),
        month=today.getMonth(),
        day=today.getDate(),
        hour=today.getHours(),
        min=today.setMinutes(11);

      console.log('Has today?',today,net.run({'year':year,'month':month,'day':day,'hour':hour,'minute':min}))

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

function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}