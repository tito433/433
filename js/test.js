/*
var values=['a','b',false];


var s =values.slice(2)[0]?true:false||false;


console.log(values);
console.log(s);


function getStr(val){
	var str=""+val;
	return str.replace(".","");
}
function getSum(str){
	
	str=getStr(str);
	var arr=str.split('');
	var sum=0;
	for(var i=0,ln=arr.length;i<ln;i++){
		sum+=parseInt(arr[i]);
	}
	
	while(sum>9){
		sum=getSum(sum);
	}
	return sum;
}

var LIMIT=0.000000001; //Number.MIN_VALUE
var degree=360,count=0;
while(degree>LIMIT){
	degree=degree/2;
	var s=getSum(degree);
	if(s!=9){
		console.log(degree+' is '+s);
		break
	}
	count++;
}

console.log('IM DONE AFTER ITERATION:'+count);


var str=["OPS!","Hello tito","How","Are","You?"];

var largest=str.reduce(function(p,c){
	return p.length>c.length?p:c;
});

console.log(largest)

//25 OCT 2016

//  9.5367431640625e-7

Number.prototype.toActual = function() {
    var str =''+this,
    	regx=new RegExp(/(\.|\d+)(e)(\+|\-)(\d+)/i),
    	match=false;

    if (match = regx.exec(str)){
    	console.log(match)
    	
    	var pow=str.substring(match.index+2);
    	str=str.substring(0,match.index);
    	var zeros=new Array(pow+1).join('0');
    	console.log('pow:'+pow);
    	console.log(zeros)

    }
    return str;

    // // if number is in scientific notation, pick (b)ase and (p)ower
    // return str.replace('.', '').split('e+').reduce(function(p, b) {
    //     return p + Array(b - p.length + 2).join(0);
    // }) + '.' + Array(n + 1).join(0);
};


var sum=0.0,
	cur=1.0,
	loop=100;


do{

	sum+=cur;
	cur=cur/2;
	console.log(''+cur);
	// if(cur>Number.MIN_VALUE) {
	// 	console.log('boundary breatch');
	// 	break;
	// }
	// ++loop;
}while(--loop);
// }while(cur>= Number.MIN_VALUE);

console.log('Counter:'+loop,sum,cur);
console.log(''+cur.toActual());


var hasValue=function(data,findValue){
    var regx=new RegExp(findValue,"i");

    switch(typeof data) {
        case "boolean":
        case "number":
        case "string":
            if(match = regx.exec(''+data))  return data;
            break;
        case "object":
        case "array":
            for (var item in data) {
                var r=hasValue(data[item],findValue);
                if(r!=undefined)  return r;
            }
    }

}

var data=[
    {
        name:'oclock',oneDay:false,
        date:{start:'2016-04-03 17:11',end:'2016-04-03 17:11'}
    },
    {
        name:'shorna',
        date:{start:'2016-03-03 17:11',end:'2016-03-03 09:11'}
    }
];

var f=hasValue(data,'09');
console.log(f);


var expression = "clock+2016";
var copy = expression;

expression = expression.replace(/[a-zA-Z0-9]+/g, "#");
var numbers = copy.split(/[^a-zA-Z0-9]+/).filter(function(n){return n});
var operators = expression.split("#").filter(function(n){return n});
var result = [],oi=0,ni=0;

for(i = 0; i < expression.length; i++){
    if('-'==expression[i] || expression[i]=='+'){
        result.push(operators[oi++]);
    }else{
        result.push(numbers[ni++]);
    }
}

console.log(result);



// 29 Oct 2016

var input=[
	{sumery:'Me','date':'2016-10-29 08:41',title:'Event'},
	{sumery:'clock 2','date':'2016-10-29 08:42',title:'Event 2'},
	{sumery:'clock 3','date':'2016-10-29 08:43',title:'Event 3'},
	{sumery:'clock 3','date':'2016-10-29 08:43',title:'Event 3'},
	{sumery:'clock 3','date':'2016-10-29 08:43',title:'Event 4'},
	{sumery:'clock 3','date':'2016-10-29 08:43'},
	{sumery:'clock 3','date':'2016-10-29 08:43',title:'Event 31'},
	{sumery:'clock 4','date':'2016-10-29 08:44',title:'Event 4'}
];

var input=['orange','banana','apple','barry'];

var txt="clock";

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
        	var args=findValue.split(':'),
				key=false,
				value=args[0];

			if(args.length>1){
				key=args[0];
				value=args[1];
			}


			var regx=new RegExp(value,"i"),
				match = regx.exec(''+data);

			if(key!=false && key==index && match)
				return data;
        	if(!key && match)  
        		return data;
    }
}

var data=input.filter(function(item){
           return hasValue(item,txt)!=undefined;
        });

console.log(data)

txt="43";

data=data.filter(function(item){
           return hasValue(item,txt)!=undefined;
        });

console.log(data)

//only 4th clock?

txt="title:4";

data=data.filter(function(item){
           return hasValue(item,txt)!=undefined;
        });

console.log(data)

only null title?
txt="p";

data=input.filter(function(item){
           return hasValue(item,txt)!=undefined;
        });

console.log('null',data)

*/


// 04-Nov-16 9:35AM

// function devideHalf(strNum){

//     var result='',
//         idx=strNum.length-1,
//         backup=1,inhand=0,dot=0;


//         var idot=strNum.indexOf('.');
//         if(idot!=-1){
//             strNum=strNum.replace('.','');
//             dot=strNum.length-idot;
//         }
        

//     while(idx>=0){
//         var chr=strNum[idx],
//             n=parseInt(chr);

//         n*=backup;
        
//         if(n==0){
//             backup=10;
//         }else if(n%2==0){

//             var n1=n/2;
//             if(n1>9){
//                 var fd=(''+n1).split('');
//                 var fn0=parseInt(fd[0]),
//                     fn1=parseInt(fd[1]);
//                 result=''+(fn1+inhand)+result;
//                 inhand=fn0;
//             }else{
//                 result=''+(n1+inhand)+result;
//                 inhand=0;
//             }
//             backup=1;
//         }else{
//             n*=10;

//             var n1=n/2;
//             if(idx==strNum.length-1){
//                 result=''+n1;
//                 dot++;

//             }else{
//                 n1=parseInt(result[0])+n1;
//                 if(n1>9){
//                     var fd=(''+n1).split('');
//                     var fn0=parseInt(fd[0]),
//                         fn1=parseInt(fd[1]);
//                     result=''+(fn1+inhand)+result;
//                     inhand=fn0;
//                 }else{
//                     result=''+(n1+inhand)+result;
//                     inhand=0;
//                 }  
//             } 
            
//         }
            
        
//         idx--;
//     }
//     if(inhand>0){
//         result=''+inhand+result;
//     }

//     // if(dot>0){
//     //     var pos=result.length-dot;
//     //     var pr=result.substring(0,pos),
//     //         af=result.substring(pos);
//     //     result=pr+'.'+af;
//     // }
//     return result;
// }

// var num='10';
// var loop=10;
// while(loop--){
//     var x=devideHalf(num);
//     console.log(x,num/2);
//     num=x;

// }

// console.log(devideHalf('1.25'));

//14 nov 2016

// var v=new String("body .canvas");
// var w=new String("body .canvas");

// var v1="body .canvas";
// var w1="body .canvas";

// console.log(Object.prototype.toString.call(v1),typeof v1,v1 instanceof String,v1 instanceof Date,v1 instanceof Object)
// alert('attach')
// window.onload=function(){

//     console.log('loaded')
//     var bd='body #canvas';
//     var parent = document.querySelector(bd);

//     if(!parent){
//         parent=document.body;
//     }

//     if(parent instanceof HTMLCanvasElement){

//     }else{
        
//     }

//     console.log(parent,typeof parent,Object.prototype.toString.call(parent),parent instanceof HTMLBodyElement);

//     console.log('HTMLUListElement',parent instanceof HTMLUListElement)
//     console.log('HTMLElement',parent instanceof HTMLElement)
//     console.log('Element',parent instanceof Element)
//     console.log('HTMLCanvasElement',parent instanceof HTMLCanvasElement)
    

// }

