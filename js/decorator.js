//What we're going to decorate
function MacBook() {
    this.cost = function () { return 997; };
    this.screenSize = function () { return 13.3; };
}
/*Decorator 1*/
function Memory(macbook) {
    var v = macbook.cost();
    macbook.cost = function() {
        return v + 75;
    }
}
 /*Decorator 2*/
function Engraving( macbook ){
   var v = macbook.cost();
   macbook.cost = function(){
     return  v + 200;
  };
}

/*Decorator 3*/
function Insurance( macbook ){
   var v = macbook.cost();
   macbook.cost = function(){
     return  v + 250;
  };
}
// var mb = new MacBook();
// Memory(mb);
// Engraving(mb);
// Insurance(mb);
// console.log(mb.cost()); //1522
// console.log(mb.screenSize()); //13.3


//duck typing test.
// function calculate(a, b, c) {
//   return (a + b)*c;
// } 

// var example1 = calculate(1, 2, 3);
// var example2 = calculate(1, [2, 3], [2,3]);
// var example3 = calculate('apples', 'and oranges,', 3);


// console.log(example1);
// console.log(example2);
// console.log(example3);


//method overloading
var point1 = new Point(100, 100);
var vector = new Point({ angle: 45, length: 100 });
var point2 = point1 + vector * 2;
console.log(point2);
debugger;