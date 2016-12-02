function Plot(){
    Plugin.apply(this,arguments);
    Canvas.call(this,this.dom.output);

    this.updateData=function(evt){
        if(arguments.length==1 && arguments[0] instanceof Event){
            this._data= arguments[0].detail?arguments[0].detail:this._data;
        }
        this.view();
    }

    this.view=function(){
        console.log('view plot',this.dom.view.checked)
        if(!this.dom.view.checked) return false;
        
        if(this._data && this._data.length){
            this.clear();
            var axis=new Axis(this._data).size(this.width-40,this.height-40);
            axis.grid(this.dom.chkGridX.checked,this.dom.chkGridY.checked);
            this.add(axis);
            this.draw();
        }
    }

    var ulModel=this.dom.input.querySelector('.model'),
        ulView=this.dom.input.querySelector('.view');
        

    this.dom.view=Plugin.addView(ulView,{'text':'Plot'});
    this.dom.view.onchange=this.view.bind(this);
    
    this.dom.chkGridX=Plugin.addModel(ulModel,'Plot grid.x',{'input.type':'checkbox'});
    this.dom.chkGridX.onchange=this.view.bind(this);
    
    this.dom.chkGridY=Plugin.addModel(ulModel,'Plot grid.y',{'input.type':'checkbox'});
    this.dom.chkGridY.onchange=this.view.bind(this);

    window.addEventListener(this._settings.data.event,this.updateData.bind(this),false);
    this.view();
}
Plot.prototype = Object.create(Plugin.prototype);
Plot.prototype.constructor = Plot;


function Axis(data){
    Drawable.call(this);
   
    this.n=24;
    this.data=data;
    this.x=20;
    this.y=20;
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
        var lineX=new Line().position(this.x,this.y+this.h).size(this.w,this.y+this.h),
            lineY=new Line().position(this.x,this.y+this.h).size(this.x,this.y);

        lineX.draw(ctx);
        lineY.draw(ctx);
        var perY=this.h/this.n,y=this.y;
        for(var i=0,ln=this.n;i<ln;i++){
            if(i%3==0) this.label(ctx,this.x,y,24-i,1);
            if(this._grid.y) drawLine(ctx,this.x,y,this.width(),y);
            y+=perY;
        }
        if(this.data.length){
            var date=new Date(this.data[0].start.dateTime),
                preDate=new Date(date-86400000);
            
            preDate.setMinutes(0);
            preDate.setHours(0);
            
            var eDate=new Date(this.data[this.data.length-1].start.dateTime),
                samples=Math.round((eDate-preDate)/86400000)+3,
                xSeg=this.width()/samples;
            //draw x lables
            var x=this.x,y=this.y+this.h,xturn=0,curDate=new Date();
            curDate.setFullYear(preDate.getFullYear());
            curDate.setHours(0);
            curDate.setMinutes(0);

            while(curDate<=eDate){
                if(xturn%9==0){
                   this.label(ctx,x,y,curDate.getDate()+'/'+curDate.getMonth(),0);
                   if(this._grid.x) drawLine(ctx,x,y,x,0); 
                }  
                
                x+=xSeg;
                xturn++;
                curDate.setDate(curDate.getDate() + 1);
            }
            for(var i=0,ln=this.data.length;i<ln;i++){
                var cDate=new Date(this.data[i].start.dateTime),
                    offsetX=Math.round((cDate-preDate)/86400000),
                    offsetY=this.h-(cDate.getHours()*perY+((cDate.getMinutes()/60)*perY));

                x=this.x+(offsetX*xSeg),
                y=this.y+offsetY;
                ctx.beginPath();
                ctx.fillStyle='#000';
                ctx.arc(x,y,2,0,2*Math.PI);
                ctx.fill();
                
            }
        }
    }
    var drawLine=function(ctx,x,y,w,h){
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
        ctx.strokeStyle='#000';
        var w=h=0
     
        if(txt && dir==0){
            w=x;h=y+5;
            ctx.font='10px arial';
            ctx.fillStyle='#000';
            ctx.textBaseline="middle";
            ctx.textAlign="center";  
            ctx.fillText(txt, x, y+15);
        }else{
            w=x-5;h=y;
            ctx.font='10px arial';
            ctx.fillStyle='#000';
            ctx.textBaseline="middle";
            ctx.textAlign="center";  
            ctx.fillText(txt, x-15,y);
        }
        
        
        ctx.moveTo(x,y);
        ctx.lineTo(w,h);
        ctx.stroke();
        ctx.restore();
    }

}
Axis.prototype = Object.create(Drawable.prototype);
Axis.prototype.constructor = Axis;