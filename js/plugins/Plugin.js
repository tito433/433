var Plugin=function (){
  this.init=function(inputPanel){};
  
}
Plugin.addView=function(domConUl,opt){
  var d=document,
      option={'labelClass':'checkbox-inline','text':''}.extend(opt),
      lbl=d.createElement("label"),
      input=d.createElement("input"),
      t = d.createTextNode(option.text);
  
  domConUl.appendChild(lbl);
  input.value=option['text'];
  input.type='checkbox';
  lbl.className=option['labelClass'];
  lbl.appendChild(input);
  lbl.appendChild(t);
  
  return input;
};

Plugin.addControl=function(domConUl,opt){
  var d=document,
      option={callBack:false,'input.value':'Submit','input.class':''}.extend(opt),
      btnGrp=domConUl.getElementsByTagName('buttongroup');
  
  if(btnGrp.length){
    btnGrp=btnGrp[btnGrp.length-1];
  }else{
    btnGrp=d.createElement('buttongroup');
    domConUl.appendChild(btnGrp);
  }
  var input=d.createElement("button");
  if(option['input.class']!==''){
    input.className =option['input.class'];
  }
  
  input.innerHTML=option['input.value'];

  if(option.callBack) input.onchange=callBack;
  btnGrp.appendChild(input);
  
  return input;
};
Plugin.addModel=function(settingsPanel,title,opt){
  var d = document,
      option={'input.group':'input-group','input.type':'input','input.value':'','input.class':'form-control','input.addon':false}.extend(opt),
      li=d.createElement('li'),
      para = d.createElement("P"),
      t = d.createTextNode(title),
      igdiv=d.createElement("DIV"),
      input=d.createElement("INPUT");


  input.className =option['input.class'];
  input.type=option['input.type'];
  input.value=option['input.value'];;
  if(option.callBack) input.onchange=callBack;

  para.appendChild(t);
  li.appendChild(para);
  settingsPanel.appendChild(li);
  igdiv.className=option['input.group'];
  li.appendChild(igdiv);
  igdiv.appendChild(input);
  if(option['input.addon']){
    var span=document.createElement('span');
    span.className='input-group-addon';
    span.innerHTML=option['input.addon'];
    igdiv.appendChild(span);
  }
  return input;
};

//http://stackoverflow.com/questions/12820953/asynchronous-script-loading-callback
Plugin.require=function(u,c){
  var d = document, t = 'script', o = d.createElement(t),s = d.getElementsByTagName(t)[0];
  o.src = u+'.js';
  if (c) { o.addEventListener('load', function (e) { c(null, e);}, false); }
  d.body.appendChild(o);
}