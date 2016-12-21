var Plugin=function (){
  
  if(typeof(Storage) === "undefined"){
      throw "Storage undefined! This app can't run without localStorage. Can you?";
  }

  var oData={'key':'evt.cal.raw','event':'433.data.void'};

  this._settings=arguments[0]||{};
  this._settings.data=oData;
  this._data=null;
  this._hasIO=this._settings.dom && this._settings.dom.output && this._settings.dom.input;
  this._evt_data_loaded=function(){};

  

  try{
    this._data=JSON.parse(localStorage.getItem(oData.key));
  }catch(err){
    console.log('Error parsing localData',err);
  }
  
  this.view=function(){}

  this.updateData=function(){
    console.log('updateData ack')
    if(arguments.length==1 && arguments[0] instanceof Event){
          this._data= arguments[0].detail && arguments[0].detail instanceof Array?arguments[0].detail:[];
          this._evt_data_loaded();
    }
  }

  window.addEventListener(oData.event,this.updateData.bind(this),false);

  
  this._addUI=function(label,option){
    var d=document,
        dom=this._settings.dom||{},
        input=dom.input || document.body,
        parent=input.querySelector(option.parent);

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
    var options={'type':'button','parent':'buttongroup.view','onchange':callBack};
    return this._addUI(label,options);
  }
  this.addModel=function(label,options){
    var option={'type':'input','parent':'ul.model','input.wrap':'li','input.group':'input-group','input.type':'input','input.value':'','input.class':'form-control','input.addon':false,'onchange':false}.extend(options);
    return this._addUI(label,option);
  }

  this.addControl=function(label,callBack){
    var options={'type':'button','parent':'buttongroup.controll','onchange':callBack};
    return this._addUI(label,options);
  };
}




//http://stackoverflow.com/questions/12820953/asynchronous-script-loading-callback
Plugin.load=function(u,c){
  var d = document, t = 'script', o = d.createElement(t),s = d.getElementsByTagName(t)[0];
  o.src = 'js/plugins/'+u+'.js';
  if (c) { o.addEventListener('load', c.bind(c,u), false); }
  d.body.appendChild(o);
}