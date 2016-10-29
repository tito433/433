"use strict";

function Application(){
  Canvas.call(this,document.getElementById('output'));
  this.dataFetcher=new DataFetcher();
  this.dataKeyset=[ 'summary', 'start.dateTime' ];
  

  this.processData=function(data){
    if (data.length > 0) {
        this.list.draw(data,this.dataKeyset);
        //draw now
        this.display(data);
      }
  }
  this.display=function(data){
    if(data && data.length){
      data=data.sort(function(a,b){
        var keyA = new Date(a.start.dateTime),
            keyB = new Date(b.start.dateTime);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
      });
      var w=((this.width-70)/7),h=w,x=0,y=0;
      this.drawables=[];
      for(var i=0,ln=data.length;i<ln;i++){
        var evt=data[i];
        this.addDrawable(new CanvasDate(evt.start.dateTime).size(w,h).position(x,y));
        x+=w+10;
        if(x>this.width||x+w>this.width){
          x=0;y+=h+10;
        }
      }
      this.draw();
      console.log(data);
    }
  }

  this.list=new List(document.getElementById('list'),{
          filter:this.processData.bind(this),
          childTemplate:'<li><h3 class="summary">{summary}</h3><p class="dateTime">{start.dateTime}</p></li>'
  });
  this.dataFetcher.getData(this.processData.bind(this));
  

}
 
 

function CanvasDate(strDate){
  Drawable.call(this);
  this.w=50;
  this.h=50;
  this.fontSize=18;
  var date=new Date(strDate),
      year=date.getFullYear(),
      month=date.getMonth(),
      day=date.getDate(),
      hour=date.getHours(),
      mins=date.getMinutes();

  this.label=[month,day,hour+':'+mins];

  this.draw=function(ctx){
    ctx.save();
    Drawable.prototype.draw.call(this,ctx);

    ctx.beginPath();
    ctx.strokeRect(this.x,this.y,this.w,this.h);
    ctx.restore();
  }
  
}
CanvasDate.prototype = Object.create(Drawable.prototype);
CanvasDate.prototype.constructor = CanvasDate;