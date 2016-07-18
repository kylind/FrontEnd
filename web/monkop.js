var db = require('monk')('mongodb://website:zombie.123@localhost:27017/orders');
var restaurants = db.get('restaurants');

var monkOperations = {
    add: function(){
        restaurants.insert(
        {
            "address": {
                "street": "2 Avenue",
                "zipcode": "10075",
                "building": "1480",
                "coord": [-73.9557413, 40.7720266]
            },
            "borough": "Manhattan",
            "cuisine": "Italian",
            "grades": [{
                "date": new Date("2014-10-01T00:00:00Z"),
                "grade": "A",
                "score": 11
            }, {
                "date": new Date("2014-01-16T00:00:00Z"),
                "grade": "B",
                "score": 17
            }],
            "name": "Vella",
            "restaurant_id": "41704620"
        }, function(err, result) {
            assert.equal(err, null);
            console.log("Inserted a document into the restaurants collection.");
        })
    },

    update: function(){
        restaurants.update( { "name": "Vella" },{ "cuisine": "Chinese" }, function(error, result){
             assert.equal(error, null);

        })
    },

    query: function(){
        restaurants.find( { "name": "Vella" },function(error, docs){
            assert.equal(error, null);
            docs.forEach(function(doc, error) {

                    console.log(doc.cuisine);

            })

        })

    },
    remove: function() {

        restaurants.remove({ "name": "Vella" }, function (err, result) {
          if (err) throw err;
        });

    }

}

monkOperations.add();

/*monkOperations.update();

monkOperations.query();

monkOperations.remove();*/