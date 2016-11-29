function Plot(){
    Plugin.apply(this,arguments);
    Canvas.call(this,arguments[1]);

    this._data=[];

    this.view=function(){
        if(!this.dom.view.checked) return false;
        this._data=arguments.length==1 && arguments[0] instanceof Array?arguments[0]:this._data;
        
        if(this._data && this._data.length){
            this.clear();
            this.add(new Axis(this._data,24).position(20,10).width(this.width-40));
            this.draw();
        }
    }

    this.dom.view=Plugin.addView(this.dom.input.querySelector('.view'),{'text':'Plot'});
    this.dom.view.onchange=this.view.bind(this);

}
Plot.prototype = Object.create(Plugin.prototype);
Plot.prototype.constructor = Plot;


function Axis(data,n){
    Drawable.call(this);
    var yGap=10;
    
    this.n=n;
    this.h=n*yGap+10;
    this.data=data;

    this.draw=function(ctx){
        var lineX=new Line().position(this.x,this.y+this.h).size(this.w,this.y+this.h),
            lineY=new Line().position(this.x,this.y+this.h).size(this.x,this.y);

        lineX.draw(ctx);
        lineY.draw(ctx);
        var y=this.y+10;
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
            
            y+=yGap;
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
                    offsetY=this.h-(cDate.getHours()*yGap+((cDate.getMinutes()/60)*yGap)),
                    x=this.x+(offsetX*xSeg),
                    y=this.y+offsetY;
                
                ctx.beginPath();
                ctx.fillStyle='#000';
                ctx.arc(x,y,2,0,2*Math.PI);
                ctx.fill();
            }
        }
    }
    

}
Axis.prototype = Object.create(Drawable.prototype);
Axis.prototype.constructor = Axis;