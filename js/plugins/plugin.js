var Plugin=function (){
  
  if(typeof(Storage) === "undefined"){
      throw "Storage undefined! This app can't run without localStorage. Can you?";
  }
  
  this.input=arguments[0]||document.body;
  this.output=arguments[1]||document.body;

  this.settings={'key':'evt.cal.raw','event':'433.data.void'};
  var _data=null;
  var _evt_data_loaded=function(){};

  

  try{
    _data=JSON.parse(localStorage.getItem(this.settings.key));
  }catch(err){
    console.log('Error parsing localData',err);
  }
  
  this.view=function(){}

  this._updateData=function(){
    if(arguments.length==1 && arguments[0] instanceof Event){
          _data= arguments[0].detail && arguments[0].detail instanceof Array?arguments[0].detail:[];
          _evt_data_loaded();
    }
  }

  window.addEventListener(this.settings.event,this._updateData.bind(this),false);

  this.data=function(){
    if(arguments.length>0 && typeof arguments[0]===Array){
      _data=arguments[0];
      return this;
    }else{
      return _data;
    }
  }
  var fn_addUI=function(place,label,option){
    var d=document, parent=this.input.querySelector(place);

    if(parent){
      var btn=d.createElement(option.type);
      
      if("button"===option.type){
        btn.innerHTML=label;
      }  
    
      
      if(option['input.wrap']){
        var li=d.createElement(option['input.wrap']),
            p=d.createElement("P");

        p.appendChild(d.createTextNode(label));
        li.appendChild(p);
        parent.appendChild(li);
        parent=li;
      }
      //input prop
      btn.className =option['input.class']||'';
      btn.type=option['input.type']||'';
      btn.value=option['input.value']||'';
      
      //addon only for inputgroup!
      if(option['input.group']){
        var igdiv=d.createElement("DIV");
        igdiv.className=option['input.group'];
        parent.appendChild(igdiv);
        parent=igdiv;
      }
      parent.appendChild(btn);
      
      if(option['input.type']==='checkbox'){
        var id=new Date().getTime()+Math.random();
        btn.id=id;
        btn.className='tgl';
        btn.checked=true;
        var label=d.createElement('label');
        label.innerHTML=' ';
        label.htmlFor=id;
        parent.appendChild(label);
      }

      //has addon?
      if(option['input.addon']){
        var span=d.createElement('span');
        span.className='input-group-addon';
        span.innerHTML=option['input.addon'];
        parent.appendChild(span);
      }

      if(option.onchange && typeof option.onchange=='function'){
        if(btn instanceof HTMLButtonElement){
          btn.onclick=option.onchange;
        }else if(btn instanceof HTMLInputElement){
          btn.onchange=option.onchange;
        }
      } 
      return btn;
    }

  }
  this.addView=function(label,callBack){
    var options={'type':'button','onchange':callBack};
    return fn_addUI.call(this,'.view',label,options);
  }
  this.addModel=function(label,options){
    var option={'type':'input','input.wrap':'li','input.group':'input-group','input.type':'input','input.value':'','input.class':'form-control','input.addon':false,'onchange':false}.extend(options);
    return fn_addUI.call(this,'.model',label,option);
  }

  this.addControl=function(label,callBack){
    var options={'type':'button','onchange':callBack};
    return fn_addUI.call(this,'.controll',label,options);
  };
}




