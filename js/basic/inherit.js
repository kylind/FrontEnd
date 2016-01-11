var console=require('console');

function Animal(name){
    this.name=name;

}

Animal.prototype.run=function(){
    console.log(this.name + ' is running');
}


function Person(name){
    Animal.call(this, name);

}
Person.prototype=new Animal();

var kylin = new Person('kylin');

kylin.run();

console.log("person's instance? " + (kylin instanceof Person));//
console.log("animal's instance? " + (kylin instanceof Animal));//kylin instanceof Animal
console.log("Kylin's constructor: " + kylin.constructor);