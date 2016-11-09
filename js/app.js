"use strict";
Rectangle.prototype.onClick=function(x,y){
  var x=this.fillStyle;
  this.fillStyle=this.fontColor;
  this.fontColor=x;
}

function Application(menu,display){
  Canvas.call(this,display);


  this.dataFetcher=new DataFetcher();
  this.dataKeyset=[ 'summary', 'start.dateTime' ];
  this.layout=new Layout(this.width,this.height);
  this._settings={size:100};
  this.data=[];
  

  this.processData=function(data){
    if (data.length > 0) {
        this.list.draw(data,this.dataKeyset);
        //draw now
        this.display(data);
      }
  };

  

  this.display=function(data){
    if(data && data.length){
      data=data.sort(function(a,b){
        var keyA = new Date(a.start.dateTime),
            keyB = new Date(b.start.dateTime);
        // Compare the 2 dates
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
      });
      this.data=data;
      this.redraw();
    }
  }
  

  this.redraw=function(){
    this.drawables=[];

      for(var i=0,ln=this.data.length;i<ln;i++){
        var date=new Date(this.data[i].start.dateTime),
            year=date.getFullYear(),
            month=date.getMonth(),
            day=date.getDate(),
            hour=date.getHours(),
            mins=date.getMinutes(),
            size=parseInt(this._settings.size);

        var rect=new Rectangle().size(size,size);
            rect.label=[month,day,hour+':'+mins];
            rect.fontSize=18;
            rect.fillStyle='#888';

        this.drawables.push(rect);
      }

      this.layout.flowLeft(this.drawables);
      this.draw();
  }
  this.list=new List(menu,{ filter:{input:'#filter',output:this.processData.bind(this)}});
  this.dataFetcher.getData(this.processData.bind(this));
  
  this.reset=function(){
    this.drawables=[];
    this.draw();
    this.list.reset();
    this.dataFetcher.clear();
    this.dataFetcher.getData(this.processData.bind(this));
  }
  this.setting=function(key,val){
    if(undefined==val){
      return this._settings[key];
    }else{
      this._settings[key]=val;
      this.redraw();
    }
    
  }
  

}

function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}