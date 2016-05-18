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


var y = null;

function* gen(x) {
    console.log("access gen");
    y = yield x + 2;

    console.log("end gen");
    return 5;


}
var g = gen(1);
console.log(g.next());
console.log('y:' + y);
console.log(g.next());
console.log('y:' + y);
var y = null;
var g = gen(1);
console.log(g.next());
console.log('y:' + y);
console.log(g.next(2));
console.log('y:' + y);


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

console.log('test 3............................')

function* gen3(x) {
    console.log("access gen3");
    y = yield 5 + gen(x);
    console.log("end gen3");
    return 6;
}

var g = gen3(1);
console.log("access gen3 1");
console.log(g.next());
console.log("access gen3 2");
console.log(g.next());

