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
      var w=50,h=50,x=0,y=0;
      this.drawables=[];
      for(var i=0,ln=data.length;i<ln;i++){
        var evt=data[i],
            st=new Date(evt.start.dateTime);

        var label=st.getDate()+'-'+st.getMonth()+':'+st.getHours();

        this.addDrawable(new CanvasRect(label).size(w,h).position(x,y));
        x+=w+10;
        if(x>this.width||x+w>this.width){
          x=0;y+=h+10;
        }
        
      }
      this.draw();
      
    }
  }

  this.list=new List(document.getElementById('list'),{
          filter:this.processData.bind(this),
          childTemplate:'<li><h3 class="summary">{summary}</h3><p class="dateTime">{start.dateTime}</p></li>'
  });
  this.dataFetcher.getData(this.processData.bind(this));
  

}
 
 

function CanvasRect(label){
  Drawable.call(this);
  this.w=50;
  this.h=50;
  this.label=label||"";

  this.draw=function(ctx){
    ctx.save();
    Drawable.prototype.draw.call(this,ctx);

    ctx.beginPath();
    ctx.strokeRect(this.x,this.y,this.w,this.h);
    if(""!=this.label){
      this._centerLabel(ctx);
    }
    ctx.restore();
  }
  this._centerLabel=function(ctx){
    
    var lines = function(ctx) {
        // We give a little "padding"
        var mw = this.w - 5;
        ctx.font = this.fontSize+'px '+this.fontName;
        var words = this.label.split(' ');
        var new_line = words[0];
        var lines = [];
        for(var i = 1; i < words.length; ++i) {
          var size=ctx.measureText(new_line + " " + words[i]);
           if (size.width< mw) {
               new_line += " " + words[i];
           } else {
               lines.push(new_line);
               new_line = words[i];
           }
        }
        lines.push(new_line);
        return lines;
    }.call(this,ctx);

    var width = ctx.measureText(lines.reduce(function(p,c){
                  return p.length>c.length?p:c;})).width,
        eh=ctx.measureText('M').width,
        height=eh*(lines.length+1);

    if (width>=this.w || height>= this.h) {
        this.fontSize-=1;
        this._centerLabel(ctx);
    } else {
        var ly =  this.y+(this.h - height)/2,
            lx = 0;
        for (var j = 0; j < lines.length; ++j, ly+=eh) {
            lx = this.x+this.w/2-ctx.measureText(lines[j]).width/2;
            ctx.fillText(lines[j], lx, ly);
        }
    }
  }
}
CanvasRect.prototype = Object.create(Drawable.prototype);
CanvasRect.prototype.constructor = CanvasRect;