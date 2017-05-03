define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;

    var ClientModel = function(client) {
        var self = this;
        self._id = ko.observable(client ? client._id : '');
        self.client = ko.observable(client ? client.client : '');
        self.recipient = ko.observable(client ? client.recipient : '');
        self.client = ko.observable(client ? client.client : '');
        self.phone = ko.observable(client ? client.phone : '');
        self.isSend = ko.observable(client ? client.isSend : '');


        /*this.isChanged = ko.pureComputed(function() {

            return client && client.client == self.client() && client.recipient == self.recipient() && client.client == self.client() && client.phone == self.phone() ? false : true;

        }, this);*/
    };

    var ClientsModel = function(clients, swiper) {

        function init(clients) {
            var observableClients = [];

            clients.forEach(function(client) {

                observableClients.push(new ClientModel(client));

            })
            return observableClients;

        }



        var self = this;

        var observableClients = init(clients);

        self.clients = ko.observableArray(observableClients);

        self.setClients = function(clients) {
            self.clients(init(clients));

        }


        self.addClient = function() {

            self.clients.unshift(new ClientModel());
            swiper.update();
        };

        self.removeClient = function(client) {
            arguments[3]();
            var succeed = arguments[4];
            var id = client._id();
            self.clients.remove(client);

            if (id == '') {
                swiper.update();
                succeed();
                return;
            }



            $.ajax('./client/' + id, {
                success: function(data, status) {
                    succeed();
                },
                dataType: 'json',
                type: 'DELETE'

            });

            swiper.update();

        };

        self.submitClient = function(client) {
            arguments[3]();
            var succeed = arguments[4];

            console.log('post request....');

            var clientData = ko.mapping.toJS(client); //$.parseJSON(ko.toJSON(client));

            $.post('/client', clientData, function(data, status) {

                    console.log('get post result');
                    ko.mapping.fromJS(data, {}, client);
                    swiper.update();
                    succeed();
                },
                'json'
            );

            return false;

        };
    };




    return ClientsModel;

})
