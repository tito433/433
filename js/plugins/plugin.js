var Plugin=function (settings){
  
  if(typeof(Storage) === "undefined"){
      throw "Storage undefined! This app can't run without localStorage. Can you?";
  }

  this._settings=settings;
  this._data=null;
  
  this.loadData=function(key){
    var dt=localStorage.getItem(key);
    if(dt!=null) {
      try{
        this._data=JSON.parse(dt);
      }catch(err){}
    }
  }
  var oData=settings && settings.data || false,
      key=oData && oData.key? oData.key:false,
      evName=oData && oData.event?oData.event:false;


  if(key) this.loadData(key);

  this.view=function(){}

  this.updateData=function(){}

  if(evName){
    window.addEventListener(evName,function(e){
      this.updateData(e)
    }.bind(this),false);
  } 
  
  this.addView=function(label,callBack){
    var d=document,
        settings=this._settings||{},
        dom=settings.dom||false,
        input=dom.input || false;

    if(settings && dom && input){
      var parent=input.querySelector('buttongroup.view');
      if(parent){
        var btn=d.createElement("button");
        btn.innerHTML=label;
        if(callBack) btn.onclick=callBack;
        parent.appendChild(btn);
        return btn;
      }
    }
    return false;
  }
  this.addModel=function(label,options){
    var d=document,
        settings=this._settings||{},
        dom=settings.dom||false,
        input=dom.input || false;
    
    if(settings && dom && input){
      var parent=input.querySelector('ul.model');
      if(parent){
        var btn=d.createElement("button"),
            option={'input.group':'input-group','input.type':'input','input.value':'','input.class':'form-control','input.addon':false,'onchange':false}.extend(options),
            li=d.createElement('li'),
            para = d.createElement("P"),
            t = d.createTextNode(label),
            btn=d.createElement("INPUT");

        para.appendChild(t);
        li.appendChild(para);

        //input
        btn.className =option['input.class'];
        btn.type=option['input.type'];
        btn.value=option['input.value'];;
        if(option.onchange && typeof option.onchange=='function') btn.onchange=option.onchange;


        var igdiv=d.createElement("DIV");
        igdiv.appendChild(btn);

        if(option['input.type']=='checkbox'){
          var id=new Date().getTime()+Math.random();
          btn.id=id;
          btn.className='tgl';
          btn.checked=true;
          var label=document.createElement('label');
          label.htmlFor=id;
          igdiv.appendChild(label);
        }

        //has addon?
        if(option['input.addon']){
          var span=document.createElement('span');
          span.className='input-group-addon';
          span.innerHTML=option['input.addon'];
          igdiv.className=option['input.group'];
        }
        
        li.appendChild(igdiv);
        parent.appendChild(li);
        return btn;
      }
    }
    return false;
  }

  this.addControl=this.addModel;
}




//http://stackoverflow.com/questions/12820953/asynchronous-script-loading-callback
Plugin.load=function(u,c){
  var d = document, t = 'script', o = d.createElement(t),s = d.getElementsByTagName(t)[0];
  o.src = 'js/plugins/'+u+'.js';
  if (c) { o.addEventListener('load', c.bind(c,u), false); }
  d.body.appendChild(o);
}