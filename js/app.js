"use strict";
Rectangle.prototype.onClick=function(x,y){
  var x=this.bgColor;
  this.bgColor=this.fontColor;
  this.fontColor=x;
}

function Application(){
  Canvas.call(this,document.getElementById('output'));
  this.dataFetcher=new DataFetcher();
  this.dataKeyset=[ 'summary', 'start.dateTime' ];
  this.layout=new Layout(this.width,this.height);

  this.processData=function(data){
    if (data.length > 0) {
        this.list.draw(data,this.dataKeyset);
        //draw now
        this.display(data);
      }
  }
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

      this.drawables=[];

      for(var i=0,ln=data.length;i<ln;i++){
        var date=new Date(data[i].start.dateTime),
            year=date.getFullYear(),
            month=date.getMonth(),
            day=date.getDate(),
            hour=date.getHours(),
            mins=date.getMinutes();

        var rect=new Rectangle().size(500,500);
            rect.label=[month,day,hour+':'+mins];
            rect.fontSize=18;

        this.drawables.push(rect);
      }

      this.layout.flowLeft(this.drawables);
      this.draw();
    }
  }

  this.list=new List(document.getElementById('list'),{
          filter:this.processData.bind(this),
          childTemplate:'<li><h3 class="summary">{summary}</h3><p class="dateTime">{start.dateTime}</p></li>'
  });
  this.dataFetcher.getData(this.processData.bind(this));

}
