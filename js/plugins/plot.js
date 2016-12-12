function Plot(){
    Plugin.apply(this,arguments);
    this.dom={}
    this._chart=[];
    this._layout=false;

    this.view=function(){
        if(this._data){
            this.clear();
            for(var i in this._chart){
                this.add(this._chart[i]);
                this._chart[i].grid(this.dom.chkGridX.checked,this.dom.chkGridY.checked);
            }
            this.draw();
        }else{
            console.log('Plot:Not enough data');
        }
    }

    var doOut=this._settings.dom && this._settings.dom.output && this._settings.dom.input;
    if(doOut){
        Canvas.call(this,this._settings.dom.output);
        this.addView('Plot',this.view.bind(this));
        this.dom.chkGridX=this.addModel('Plot grid.x',{'input.type':'checkbox','onchange':this.view.bind(this)});
        this.dom.chkGridY=this.addModel('Plot grid.y',{'input.type':'checkbox','onchange':this.view.bind(this)});
        this._layout=new Layout(this.width,this.height);
        this._layout.padding=20;

    }
    this.addChart=function(chart){
        if(chart instanceof Chart){
            this._chart.push(chart);
            chart.size(this.width/2-60,this.height/2-40);
            if(this._layout){
                this._layout.add(chart);
                this._layout.flowLeft();
            }
        }
    }
    
    this.addChart(new Chart(this._data).title('Original'))
    this.addChart(new Chart(this._data).title('Gap'))
}
Plot.prototype = Object.create(Plugin.prototype);
Plot.prototype.constructor = Plot;


function Chart(data){
    Drawable.call(this);
   
    this.n=24;
    this._grid={'x':true,'y':true};
    this._data=data;
    this._title=false;

    this.grid=function(){
        if(arguments.length){
            this._grid.x=arguments[0];
            this._grid.y=arguments[1]||false;
        }else{
            return this._grid;
        }
    }
    this.draw=function(ctx){
        var x=this.x,y=this.y, w=this.width(),h=this.height();

        if(this._title){
            ctx.font='bold 16pt Courier';
            ctx.fillStyle='#444';
            ctx.textBaseline="middle";
            ctx.textAlign="center"
            ctx.fillText(this._title, this.x+this.width()/2,this.y+8);
            y+=25;
            h-=25;

        }
        if(this._grid.y){x+=20;w-=20;}

        if(this._grid.x){
            h-=20;
            new Line().position(x,y+h).size(x+w,y+h).draw(ctx);
        }
        var perY=h/this.n;

        if(this._grid.y){
            var curY=y+h;
            new Line().position(x,y).size(x,y+h).draw(ctx);

            for(var i=1;i<=this.n;i++){
                curY-=perY;
                if(i%2==0) this.label(ctx,x,curY,i,4);
                this.drawLine(ctx,x,curY,x+w,curY);
            }

        }
        

        if(this._data.length){
            var date=new Date(this._data[0].start.dateTime),
                startDate=new Date(date-86400000),
                endDate=new Date(this._data[this._data.length-1].end.dateTime);
            
            startDate.setMinutes(0);
            startDate.setHours(0);
            var samples=Math.round((endDate-startDate)/86400000),
                xSeg=w/samples;
            //draw x lables
            var xturn=0,currX=x,curDate=new Date();
            curDate.setFullYear(startDate.getFullYear());
            curDate.setHours(0);
            curDate.setMinutes(0);

            while(xturn<samples){
                if(this._grid.x && xturn%9==0){
                   this.label(ctx,currX,y+h,curDate.getDate(),3);
                   this.drawLine(ctx,currX,y,currX,y+h); 
                }  
                
                currX+=xSeg;
                xturn++;
                curDate.setDate(curDate.getDate() + 1);
            }
            //draw data
            for(var i=0,ln=this._data.length;i<ln;i++){
                var cDate=new Date(this._data[i].start.dateTime),
                    offsetX=Math.round((cDate-startDate)/86400000),
                    offsetY=h-(cDate.getHours()*perY+((cDate.getMinutes()/60)*perY));

                ctx.beginPath();
                ctx.fillStyle='#000';
                var dx=x+(offsetX*xSeg);
                
                ctx.arc(dx,y+offsetY,2,0,2*Math.PI);
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
    this.title=function(){
        if(arguments.length){
            this._title=arguments[0];
            return this;
        }else{
            return this._title;
        }
    }
}
Chart.prototype = Object.create(Drawable.prototype);
Chart.prototype.constructor = Chart;