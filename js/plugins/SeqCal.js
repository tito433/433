function Day(date){
    Drawable.call(this);

    this.date=date;
    this.fillStyle='#fff';
    this.fontColor='#888';
    this.evts=[];
    this.marked=false;

    var year=date.getFullYear(), month=date.getMonth(), day=date.getDate();
    this.label=[year,month,day];


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
    this.onClick=function(x,y){
      var x=this.fillStyle;
      this.fillStyle=this.fontColor;
      this.fontColor=x;
      this.marked=!this.marked;
    }
}

Day.prototype = Object.create(Drawable.prototype);
Day.prototype.constructor = Day;


function SeqCal(){
    var sp=this.dom.input.querySelector('.model'),
        ulView=this.dom.input.querySelector('.view'),
        inpsize=Plugin.addModel(sp,'Size',{'input.type':'number','input.value':36,'input.addon':'px'}),
        fontsize=Plugin.addModel(sp,'Font Size',{'input.type':'number','input.value':10,'input.addon':'px'}),
        filter=Plugin.addModel(sp,'Filter'),
        radioView=Plugin.addView(ulView,{'text':'SeqCal'});

    var view=function(){
        var layout=new Layout(this.width,this.height),
            data=this.data(),i=0,ln=data.length,box=[];
        console.log('view',this,data,data.length)
        if(ln){
            var date=new Date(data[0].start.dateTime),
                eDate=new Date(data[ln-1].end.dateTime);

            while(date<eDate){
                var size=parseInt(this._settings.size),
                    evDate=new Date(data[i].start.dateTime);

                var rect=new Day(new Date(date.getFullYear(),date.getMonth(),date.getDate())).size(size,size);
                    rect.fontSize=this._settings.font;

                if(evDate.getDate()>=date.getDate() && evDate.getDate()<date.getDate()+1){
                  var hour=evDate.getHours(),mins=evDate.getMinutes();
                  rect.date.setHours(hour);
                  rect.date.setMinutes(mins);
                  rect.events(hour+':'+mins);
                  i++;
                }
                box.push(rect);
                this.add(rect);
                date.setDate(date.getDate() + 1);
            }
        layout.flowLeft(box);
        this.draw();
      }
      
    }

    inpsize.onchange=function(ev){
        var el=ev.target,val=el.value;
        this.setting('dt.size',val);
    }.bind(this);
    fontsize.onchange=function(ev){
        var el=ev.target,val=el.value;
        this.setting('dt.font',val);
    }.bind(this);
    filter.onchange=function(ev){
        var el=ev.target,val=el.value;
        this.setting('fn.filter',val);
    }.bind(this);

    radioView.onchange=view.bind(this);

    
}
SeqCal.prototype = Object.create(Plugin.prototype);
SeqCal.prototype.constructor = SeqCal;
