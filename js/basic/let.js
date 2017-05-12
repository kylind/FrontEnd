var a = [];
for (let i = 0; i < 10; i++) {

    console.log(i);

    let s='s';

    console.log(s);

    if(i==0){
        i=3;
        s='ttt';
    }



  a[i] = function () {
    console.log(i);
  };
}
a[6]();

