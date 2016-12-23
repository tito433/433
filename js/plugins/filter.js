function Filter(){
    Plugin.apply(this,arguments);

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

    var filter=this.addModel('Filter',{'input.type':'text'});
    filter.onchange=function(ev){
        var el=ev.target,val=el.value,data=this.data();
        if(data){
            data=data.filter(function(item){
                return hasValue(item,val)!=undefined;
            });
            window.dispatchEvent(new CustomEvent(this.settings.event,{'detail': data}));
        }
        
    }.bind(this);

}
Filter.prototype = Object.create(Plugin.prototype);
Filter.prototype.constructor = Filter;
