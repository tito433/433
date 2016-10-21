function Application(){
  Canvas.call(this,document.getElementById('output'));
  this.processData=function(data){
    if (data.length > 0) {
        var option={
          filter:this.output.bind(this),
          childTemplate:'<li><h3 class="summary">{summary}</h3><p class="dateTime">{start.dateTime}</p></li>'
        };

        new List(document.getElementById('list'),option)
                .draw(data,[ 'summary', 'start.dateTime' ]);
        //draw now
        this.output(data);
      }
  }
  this.output=function(data){
    if(data && data.length){
      console.log(data.length);
      var w=h=50,x=0,y=0;
      this.drawables.length=0;

      for(var i=0,ln=data.length;i<ln;i++){
        var evt=data[i];
        this.addDrawable(new CanvasRect(evt.summary).size(w,h).position(x,y));
        x+=w+10;
        if(x>this.width||x+w>this.width){
          x=0;y+=h+10;
        }
        
      }
      console.log(this)
      this.draw();
      
    }
  }

  new DataFetcher().getData(this.processData.bind(this));
  

}
 
 

function CanvasRect(label){
  Drawable.call(this);
  this.w=50;
  this.h=50;
  this.label=label||"";

  this.draw=function(ctx){
    ctx.beginPath();
    ctx.strokeRect(this.x,this.y,this.w,this.h);

    ctx.textAlign="center"; 
    ctx.fillText(this.label,this.x+this.w/2,this.y+this.h/2);
    
  }
}
CanvasRect.prototype = Object.create(Drawable.prototype);
CanvasRect.prototype.constructor = CanvasRect;