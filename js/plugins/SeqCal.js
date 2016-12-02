function SeqCal(){
    Plugin.apply(this,arguments);
    Canvas.call(this,this.dom.output);

    var size=45,fontSize=12;

    this.updateData=function(evt){
        if(arguments.length==1 && arguments[0] instanceof Event){
            this._data= arguments[0].detail?arguments[0].detail:this._data;
        }
        this.view();
    }
    
    this.view=function(){
        if(!this.dom.view.checked) return false;
        
        if(this._data && this._data.length){
            var i=0,ln=this._data.length,box=[];
            this.clear();//im canvas remember?
            var layout=new Layout(this.width,this.height),
                startDate=new Date(this._data[0].start.dateTime),
                eDate=new Date(this._data[ln-1].end.dateTime);
            
            startDate.setMinutes(0);
            startDate.setHours(0);

            while(i<ln){
                console.log(i)
                var date=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate());
                var evDate=new Date(this._data[i].start.dateTime);
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
                box.push(rect);
                this.add(rect);                
            }
            layout.flowLeft(box);
            this.draw();
      }
    }

    
    var ulModel=this.dom.input.querySelector('.model'),
        ulView=this.dom.input.querySelector('.view'),
        inpSize=Plugin.addModel(ulModel,'Size',{'input.type':'number','input.value':size,'input.addon':'px'}),
        inpFont=Plugin.addModel(ulModel,'Font Size',{'input.type':'number','input.value':fontSize,'input.addon':'px'});

    this.dom.view=Plugin.addView(ulView,{'text':'SeqCal'});

    inpSize.onchange=function(ev){
        size=parseInt(ev.target.value);
        this.view();
    }.bind(this);

    inpFont.onchange=function(ev){
        fontSize=parseInt(ev.target.value);
        this.view();
    }.bind(this);

    this.dom.view.onchange=this.view.bind(this);
    window.addEventListener(this._settings.data.event,this.updateData.bind(this),false);
    this.view();
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
