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


function SequenceCal(){
    Plugin.apply(this,arguments);

    this.input=function(inputElem){
        var sp=inputElem.querySelector('ul.settings'),
            inpsize=Plugin.prototype.addSettingsItem(sp,'Size',{'input.type':'number','input.value':36,'input.addon':'px'}),
            fontsize=Plugin.prototype.addSettingsItem(sp,'Font Size',{'input.type':'number','input.value':10,'input.addon':'px'}),
            filter=Plugin.prototype.addSettingsItem(sp,'Filter');

        
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
    }
}
SequenceCal.prototype = Object.create(Plugin.prototype);
SequenceCal.prototype.constructor = SequenceCal;
