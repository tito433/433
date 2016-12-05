function Filter(){
    Plugin.apply(this,arguments);

    this.updateData=function(){
        if(arguments.length==1 && arguments[0] instanceof Event){
              this._data= arguments[0].detail?arguments[0].detail:this._data;
              console.log('SeqCal',this._data.length)
        }
    }

    this._storage=this._settings.data;

    var hasValue=function(data,findValue,index){
        switch(typeof data) {
            case "object":
            case "array":
                for (var item in data) {
                    var r=hasValue(data[item],findValue,item);
                    if(r!=undefined)  return r;
                }
                break;
            default:
                var args=findValue.split(':'),key=false,value=args[0];

                if(args.length>1){
                    key=args[0];
                    value=args[1];
                }
                

                var regx=new RegExp(value,"i"),match = regx.exec(''+data);

                if(key!=false && key==index && match)
                    return data;
                if(!key && match)  
                    return data;
        }
    };

    var doOut=this._settings.dom && this._settings.dom.input;
    if(doOut){
        var filter=this.addModel('Filter',{'input.type':'text'});
        filter.onchange=function(ev){
            var el=ev.target,val=el.value;
            if(this._data!=null){
                var data=this._data.filter(function(item){
                    return hasValue(item,val)!=undefined;
                });

                localStorage.setItem(this._storage.key,JSON.stringify(data));
                window.dispatchEvent(new CustomEvent(this._storage.event,{'detail': data}));
            }
            
        }.bind(this);
    }

}
Filter.prototype = Object.create(Plugin.prototype);
Filter.prototype.constructor = Filter;
