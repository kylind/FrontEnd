define(['jquery'], function($) {

    return {
        getUser: function() {

            var promise = new Promise(function(resolve, reject) {
                $.getJSON('./user', { id: USER_ID }, function(rs, status) {

                    resolve(rs);

                });

            });

            promise.catch(function(reason) {

            })

            return promise;

        },


        updateTags: function(tags) {


            $.post('/userTags', { tags: tags }, function(data, status) {

                },
                'json'
            );

        }


    }






});
