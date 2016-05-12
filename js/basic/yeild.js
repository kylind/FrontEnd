
function* g4() {
  yield* [1, 2, 3];
  return "foo";
}

var result;

function* g5() {
  result = yield* g4();
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

console.log(result);          // "foo"