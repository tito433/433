var Plugin=function (){
  this.init=function(){};
}

//http://stackoverflow.com/questions/12820953/asynchronous-script-loading-callback
Plugin.require=function(u,c){
  var d = document, t = 'script', o = d.createElement(t);
  o.src = '//' + u+'.js';
  if (c) { o.addEventListener('load', function (e) { c(null, e); }, false); }
  o.parentNode.insertBefore(o, d.body.nextSibling);
}
Plugin.addSettingsItem = function(settingsPanel,title,opt){
  var option={callBack:false,'igdiv':'input-group',
              'input.type':'input','input.value':'','input.class':'form-control','input.addon':false}.extend(opt),
      li=document.createElement('li'),
      para = document.createElement("P"),
      t = document.createTextNode(title),
      igdiv=document.createElement("DIV"),
      input=document.createElement("INPUT");


  input.className =option['input.class'];
  input.type=option['input.type'];
  input.value=option['input.value'];;
  if(option.callBack) input.onchange=callBack;

  para.appendChild(t);
  li.appendChild(para);
  settingsPanel.appendChild(li);
  igdiv.className=option.igdiv;
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