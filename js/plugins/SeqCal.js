function SeqCal(){
    Plugin.apply(this,arguments);
    //adapt drawing
    Canvas.call(this,this.output);

    var size=45,fontSize=12;
    var layout=new Layout(this.width,this.height);

    this.view=function(){
        var data=this.data();
        if(data){
            var i=0,ln=data.length;
            
            this.clear();
            layout.clear();
            var startDate=new Date(data[0].start.dateTime),
                eDate=new Date(data[ln-1].end.dateTime);
            
            startDate.setMinutes(0);
            startDate.setHours(0);

            while(i<ln){
                var date=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
                var evDate=new Date(data[i].start.dateTime);
                var rect=new Day(date).size(size,size);
                    rect.fontSize=fontSize;

                if( evDate.getFullYear()==date.getFullYear() && 
                    evDate.getMonth()==date.getMonth() &&
                    evDate.getDay()==date.getDay()){
                  var hour=evDate.getHours(),mins=evDate.getMinutes();
                  rect.setDate(evDate);
                  rect.events(hour+':'+mins);
                  i++;
                }else{
                    startDate.setDate(startDate.getDate() + 1);
                }
                layout.add(rect);
                this.add(rect);                
            }
            layout.flowLeft();
            this.draw();
        }else{
            console.log('SeqCal:view have not engough data!');
        }
    }

    this.addView('SeqCal',this.view.bind(this));
        
    var inpSize=this.addModel('Size',{'input.type':'number','input.value':size,'input.addon':'px'}),
        inpFont=this.addModel('Font Size',{'input.type':'number','input.value':fontSize,'input.addon':'px'});

    //we need to decouple 'em. too much bindings
    inpSize.onchange=function(ev){
        size=parseInt(ev.target.value);
        this.view();
    }.bind(this);

    inpFont.onchange=function(ev){
        fontSize=parseInt(ev.target.value);
        this.view();
    }.bind(this);

    
    
}
SeqCal.prototype = Object.create(Plugin.prototype);
SeqCal.prototype.constructor = SeqCal;


function Day(date){
    Drawable.call(this);

    this.date=date;
    this.fillStyle='#fff';
    this.fontColor='#888';
    this.evts=[];
    this.marked=false;

    var year=date.getFullYear(), month=date.getMonth(), day=date.getDate();
    this.label=[month+'-'+day,year];

    this.setDate=function(date){
        this.date=date;
    }

    this.draw=function(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle=this.fillStyle;
        ctx.rect(this.x,this.y,this.w,this.h);
        ctx.closePath();
        ctx.stroke();
        if(this.marked) ctx.fill();
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
}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;
