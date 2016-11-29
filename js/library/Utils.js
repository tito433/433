

  this.fn.getRLE=function(){
    if(this._box.length<1) return "";

      var ev=this._box[0],y=ev.y,prev=ev.marked?'o':'b',run=1,yc=1,xc=1,result='';
      for(var i =1,lb=this._box.length;i<lb;i++){
          ev=this._box[i];
          var typ=ev.marked?'o':'b';
          if(y==ev.y){
            if(typ===prev){
                run++;
            }else{
              result+=(run==1)?prev:run+prev;
              run=1;
              prev=typ;
            }
            if(1===yc){xc++;}
          }else{
            result+=run+prev+'$';
            yc++;
            run=1;
            y=ev.y;
          }
          prev=typ;
      }

      var response='x = '+xc+', y = '+yc+', rule = B3/S23'+"\n"+result+'!';
      var txt=document.createElement('textarea');
      txt.innerHTML=app.getRLE();
      document.body.appendChild(txt);
      txt.focus();
      txt.setSelectionRange(0, txt.value.length);
      document.execCommand("copy");
      infoPanel.innerHTML='RLE data copied to clipboard.<br/>Hint: Use Ctrl+v to get';
      document.body.removeChild(txt);
  };