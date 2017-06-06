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

class A{

    var s='ss';

    constructor(name){
        this.nameA='A';

    }

}

class B{
    constructor(name){
        this.nameB='B';

    }
}


//B.prototype =Object.create(A.prototype);
//B.prototype.__proto__ = A.prototype;
//console.log(b.__proto);

console.log(B.prototype );
console.log(A.prototype );

