function* g4() {
    yield * [1, 2, 3];
    return "foo";
}

var result;

function* g5() {
    result = yield * g4();
    return result + 1;
}

var iterator = g5();

console.log(iterator.next()); // { value: 1, done: false }
console.log(result);
console.log(iterator.next()); // { value: 2, done: false }
console.log(result);
console.log(iterator.next()); // { value: 3, done: false }
console.log(result);
console.log(iterator.next()); // { value: undefined, done: true },
// 此时 g4() 返回了 { value: "foo", done: true }

console.log(result); // "foo"

console.log('2--------------------------------------------');


var y = null;

function* gen(x) {
    y = yield x + 2;

    return 5;


}
var g = gen(1);
console.log(g.next());
console.log('y:' + y);
console.log(g.next());
console.log('y:' + y);
console.log('----------')
var y = null;
var g = gen(1);
console.log(g.next());
console.log('y:' + y);
console.log(g.next(2));
console.log('y:' + y);

console.log('3--------------------------------------------');
var y = null;

function* gen1(x) {
    var g = gen(1);
    yield g;
}

var g = gen1(1);
console.log(g.next());
console.log('y:' + y);
console.log(g.next());
console.log('y:' + y);

console.log('4--------------------------------------------');

function* gen3(x) {

    y = yield* gen(x);
    return 6;
}

var g = gen3(1);

console.log(g.next());
console.log('y:' + y);
console.log(g.next());
console.log('y:' + y);


