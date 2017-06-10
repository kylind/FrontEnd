
var a='a';
var b='b';

var a;

(function(rs){

    console.log(rs);

})(a||b)

var c=5;


var c = c||'b';

console.log(c);



var d='d';

function testd(){

    var d;

    console.log(d);

}

testd();