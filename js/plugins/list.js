var List=function(domElem,opt) {
	if (!(this instanceof List)){
         return new List(domElem,opt);
     }
    if(undefined === domElem){	throw "Undefined domElem!!!! Nothing for display!!!"; }
    
    var options={ childTemplate:domElem.innerHTML };
    
    domElem.innerHTML='';
    this.opt=options.extend(opt==undefined?{}:opt);
    this.elem=domElem;

    this.data=false;

    this.draw=function(data,keyset){
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

    this.reset=function(){
        this.elem.innerHTML='';
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

