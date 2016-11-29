function Plot(){
    Plugin.apply(this,arguments);
    Canvas.call(this,arguments[1]);

    this._data=[];

    this.view=function(){
        this._data=arguments.length==1 && arguments[0] instanceof Array?arguments[0]:this._data;
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
            var line=new Line().position(this.x-3,y).size(this.x+3,y);
            line.lineWidth=1;
            line.draw(ctx);
            if(i%3==0){
                ctx.font='10px arial';
                ctx.fillStyle='#000';
                ctx.textBaseline="middle";
                ctx.textAlign="center";  

                ctx.fillText(24-i, this.x-10, y);
            }
            
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

            for(var i=0,ln=this.data.length;i<ln;i++){
                var cDate=new Date(this.data[i].start.dateTime),
                    offsetX=Math.round((cDate-preDate)/86400000),
                    offsetY=this.h-(cDate.getHours()*perY+((cDate.getMinutes()/60)*perY)),
                    x=this.x+(offsetX*xSeg),
                    y=this.y+offsetY;
                
                ctx.beginPath();
                ctx.fillStyle='#000';
                ctx.arc(x,y,2,0,2*Math.PI);
                ctx.fill();
                
                if(this._grid.x)
                    drawLine(ctx,x,20,x,this.y+this.h)
                if(this._grid.y)
                    drawLine(ctx,20,y,this.w,y);
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

}
Axis.prototype = Object.create(Drawable.prototype);
Axis.prototype.constructor = Axis;