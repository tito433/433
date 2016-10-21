var List=function(domElem,opt) {
	if (!(this instanceof List)){
         return new List(domElem,opt);
     }
    if(undefined === domElem){
    	throw "Undefined domElem!!!! Nothing for display!!!";
    }
    var options={
        elemClass:'list',
        filterClass:'search',
        childTemplate:'<li><li>',
        filter:false
    };
    var self={

    }
    this.opt=extend(options,(opt||{}));
    this.elem={'parent':domElem,'ul':false,'filter':false};
    this._isInit=false;
    this.data=false;

    this.init=function(){
    	if(this._isInit) return false;
        if(this.opt['filter']){
            this.elem['filter']=document.createElement('input');
            this.elem['parent'].appendChild(this.elem['filter']);
            this.elem['filter'].className = this.opt['filterClass'];
            this.elem['filter'].placeholder = "Search now";
            this.elem['filter'].addEventListener("keyup", this.filter.bind(this), true);
    
        }
    	this.elem['ul']=document.createElement('ul');
    	this.elem['ul'].className = this.opt['elemClass'];
    	this.elem['parent'].appendChild(this.elem['ul']);
    	this._isInit=true;

    }
    this.draw=function(data,keyset){
    	this.init();
        var isFilter=[].slice.call(arguments,2)[0]?true:false||false;
        if(!isFilter){
            this.data={raw:data,keys:keyset};
        }

        this.elem['ul'].innerHTML = "";

    	keyset=keyset||[];
    	for(var id=0,lnd=data.length;id<lnd;id++){
    		var item=data[id],
    			food=[];
    		for(var i=0,ln=keyset.length;i<ln;i++){
	    		var cel=keyset[i];

	    		food[cel]=DataFetcher().getValue(item,cel);
	    	}
	    	if(Object.keys(food).length){
                var template=this.getChildTemplate(food);
                this.elem['ul'].innerHTML+=template;
	    	}	
    	}
    	
    }
    this.filter=function(event){
        if(event.code=='Enter'){
            var txt=this.elem['filter'].value;
            if(txt.trim()!=''){
                var keyset=this.data.keys,
                    data=this.data.raw.filter(function(item){
                    for(var i=0,ln=keyset.length;i<ln;i++){
                        var cel=keyset[i];
                        var value=DataFetcher().getValue(item,cel);
                        var str=""+value;
                        if(str.toLowerCase().search(txt.toLowerCase())!=-1) return true;
                    }
                    return false;
                });
                this.draw(data,keyset,true);
                this.opt['filter'](data);
            }
        }
    }
    this.getChildTemplate=function(food){
    	var re =/\{(.+?(?=\}))\}/g;
    	var template=this.opt['childTemplate'],
    		varis=this.getAllMatches(template,re);
    	if(varis && varis.length>0){
    		for(var i=0,ln=varis.length;i<ln;i++){
	    		var m=varis[i];
	    		if(food.hasOwnProperty(m[1])){
	    			template=template.replace(m[0],food[m[1]]);
	    		}

	    	}	
    	}
    	return template;
    }

    
    this.getAllMatches=function(str,exp){
    	var re =exp||/\{(.+?(?=\}))\}/g,
    		result=[],
    		m=false;

		while (m = re.exec(str)) {
			result.push(m);
		}
		return result;
    }

}

function extend(){
    for(var i=1; i<arguments.length; i++)
        for(var key in arguments[i])
            if(arguments[i].hasOwnProperty(key))
                arguments[0][key] = arguments[i][key];
    return arguments[0];
}