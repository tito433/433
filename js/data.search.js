Array.prototype.search=function(expression){
	var copy = expression;

	expression = expression.replace(/[a-zA-Z0-9]+/g, "#");
	var numbers = copy.split(/[^a-zA-Z0-9]+/).filter(function(n){return n});
	var operators = expression.split("#").filter(function(n){return n});
	var query = [],oi=0,ni=0;

	for(i = 0; i < expression.length; i++){
	    if('-'==expression[i] || expression[i]=='+'){
	        query.push(operators[oi++]);
	    }else{
	        query.push(numbers[ni++]);
	    }
	}

	

}
