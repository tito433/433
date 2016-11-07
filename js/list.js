var List=function(domElem,opt) {
	if (!(this instanceof List)){
         return new List(domElem,opt);
     }
    if(undefined === domElem){	throw "Undefined domElem!!!! Nothing for display!!!"; }
    
    var options={
        childTemplate:'<li><li>',
        filter:false
    };
    
    this.opt=extend(options,(opt||{}));
    this.elem=domElem;

    this._isInit=false;
    this.data=false;

    this.init=function(){
    	if(this._isInit) return false;

        if(this.opt['filter']){
            var elem=document.querySelector(this.opt.filter.input);
            if(elem){
                elem.placeholder = "Search";
                elem.addEventListener("keyup", this.filter.bind(this), true);
            }else{
                console.log('input filter not found! Search will not work');
            }
        }
    	this._isInit=true;

    }
    this.draw=function(data,keyset){
    	this.init();
        this.data=data;
        var output="";
    	keyset=keyset||[];
        for(var id=0,sz=data.length;id<sz;id++){
            var item=data[id],food=[];

            for(var i=0,ln=keyset.length;i<ln;i++){
                var cel=keyset[i];
                food[cel]=DataFetcher.getValue(item,cel);
            }
            if(Object.keys(food).length){
                output+=this.getChildTemplate(food);
            }
        }
        this.elem.innerHTML=output;
    }
    this.filter=function(event){
        if(event.code=='Enter'){
            var txt=event.target.value;
            if(txt.trim()!=''){
                var data=this.data.filter(function(item){
                    return DataFetcher.hasValue(item,txt)!=undefined;
                });
                if(this.opt.filter.output){
                    this.opt.filter.output(data);
                }
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

