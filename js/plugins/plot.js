function Plot(){
    Plugin.apply(this,arguments);
    this.dom={}
    this.view=function(){
        if(this._data){
            this.clear();
            var axis=new Axis(this._data).position(20,20).size(this.width-40,this.height-60);
            axis.grid(this.dom.chkGridX.checked,this.dom.chkGridY.checked);
            this.add(axis);
            this.draw();
        }else{
            console.log('Plot:view not engough data!');
        }
    }
    this.updateData=function(){
        if(arguments.length==1 && arguments[0] instanceof Event){
              this._data= arguments[0].detail?arguments[0].detail:this._data;
        }
    }
    var doOut=this._settings.dom && this._settings.dom.output && this._settings.dom.input;
    if(doOut){
        Canvas.call(this,this._settings.dom.output);
        this.addView('Plot',this.view.bind(this));
        this.dom.chkGridX=this.addModel('Plot grid.x',{'input.type':'checkbox','onchange':this.view.bind(this)});
        this.dom.chkGridY=this.addModel('Plot grid.y',{'input.type':'checkbox','onchange':this.view.bind(this)});
    }

    
}
Plot.prototype = Object.create(Plugin.prototype);
Plot.prototype.constructor = Plot;


function Axis(data){
    Drawable.call(this);
   
    this.n=24;
    this.data=data;
    this._grid={'x':true,'y':true};

    this.grid=function(){
        if(arguments.length){
            this._grid.x=arguments[0];
            this._grid.y=arguments[1]||false;
        }else{
            return this._grid;
        }
    }
    this.draw=function(ctx){
        var x=this.x,y=this.y, w=x+this.width(),h=y+this.height();

        new Line().position(x,h).size(w,h).draw(ctx);
        new Line().position(x,y).size(x,h).draw(ctx);

        var perY=this.height()/this.n,curY=h;
        for(var i=1;i<=this.n;i++){
            curY-=perY;
            if(i%2==0) this.label(ctx,x,curY,i,4);
            if(this._grid.y) this.drawLine(ctx,x,curY,w,curY);
        }

        if(this.data.length){
            var date=new Date(this.data[0].start.dateTime),
                startDate=new Date(date-86400000),
                endDate=new Date(this.data[this.data.length-1].end.dateTime);
            
            startDate.setMinutes(0);
            startDate.setHours(0);
            
            var samples=Math.round((endDate-startDate)/86400000),
                xSeg=this.width()/samples;
            //draw x lables
            var xturn=0,currX=x,curDate=new Date();
            curDate.setFullYear(startDate.getFullYear());
            curDate.setHours(0);
            curDate.setMinutes(0);

            while(xturn<samples){
                if(xturn%9==0){
                   this.label(ctx,currX,h,curDate.getDate()+'/'+curDate.getMonth(),3);
                   if(this._grid.x) this.drawLine(ctx,currX,y,currX,h); 
                }  
                
                currX+=xSeg;
                xturn++;
                curDate.setDate(curDate.getDate() + 1);
            }
            //draw data
            for(var i=0,ln=this.data.length;i<ln;i++){
                var cDate=new Date(this.data[i].start.dateTime),
                    offsetX=Math.round((cDate-startDate)/86400000),
                    offsetY=h-(cDate.getHours()*perY+((cDate.getMinutes()/60)*perY));

                ctx.beginPath();
                ctx.fillStyle='#000';
                var dx=x+(offsetX*xSeg);
                
                ctx.arc(dx,offsetY,2,0,2*Math.PI);
                ctx.fill();
                
            }
        }
    }
    this.drawLine=function(ctx,x,y,w,h){
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle='#ccc';
        ctx.lineWidth=0.5;
        ctx.moveTo(x,y);
        ctx.lineTo(w,h);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    this.label=function(ctx,x,y,txt,dir){
        ctx.save();
        ctx.beginPath();
        var lx=x,ly=y,lx2=x,ly2=y;
        switch (dir) {
            case 4:
                lx-=4;
                x-=15;
                break;
            case 3:
                ly2+=4;
                y+=15 
            default:
                break;
        }
        ctx.font='10px arial';
        ctx.fillStyle=ctx.strokeStyle='#000';
        ctx.textBaseline="middle";
        ctx.textAlign="center";
        ctx.fillText(txt, x,y);
        ctx.moveTo(lx,ly);
        ctx.lineTo(lx2,ly2);
        ctx.stroke();
        ctx.restore();
    }

}
Axis.prototype = Object.create(Drawable.prototype);
Axis.prototype.constructor = Axis;