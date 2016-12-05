function Filter(){
    Plugin.apply(this,arguments);

    this._storage=this._settings.data;
    
    this.init=function(){
        var sp=this.dom.input.querySelector('.model'),
            filter=Plugin.addModel(sp,'Filter');

        filter.onchange=function(ev){
            var el=ev.target,val=el.value;
            var data=this.data().filter(function(item){
                return hasValue(item,val)!=undefined;
            });
            this.data(data);
        }.bind(this);
    }

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

}
Filter.prototype = Object.create(Plugin.prototype);
Filter.prototype.constructor = Filter;
