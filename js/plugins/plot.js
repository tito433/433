function Plot(){
    Plugin.apply(this,arguments);
    
    var view=this.onData=function(){
        var data=this.data(),i=0,ln=data.length;
        if(ln){
            this.clear();
            this.add(new Axis(data,24).position(20,10).width(this.width-40));
            this.draw();
            
            return;
            

            while(date<eDate){
                var evDate=new Date(data[i].start.dateTime);

                var rect=new Day(new Date(date.getFullYear(),date.getMonth(),date.getDate())).size(size,size);
                    rect.fontSize=fontSize;

                if(evDate.getDate()>=date.getDate() && evDate.getDate()<date.getDate()+1){
                  var hour=evDate.getHours(),mins=evDate.getMinutes();
                  rect.date.setHours(hour);
                  rect.date.setMinutes(mins);
                  rect.events(hour+':'+mins);
                  i++;
                }
                this.add(rect);
                date.setDate(date.getDate() + 1);
            }
            this.draw();
      }
    }

    this.init=function(){
        var ulView=this.dom.input.querySelector('.view'),
            radioView=Plugin.addView(ulView,{'text':'Plot'});

        radioView.onchange=function(ev){ 
            if(ev.target.checked){
                this.view=view;
            }
        }.bind(this);
    }
    

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