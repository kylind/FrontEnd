define(['common'], function(util) {

    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;

    var AddressModel = function(address) {
        var self=this;

        self.recipient = ko.observable(address ? address.recipient : '');
        self.address = ko.observable(address ? address.address : '');
        self.phone = ko.observable(address ? address.phone : '');
        self.isActive = ko.observable(client ? client.isActive : '');

        self.isChanged = false;

        self.recipient.subscribe(function(newValue) {
            self.isChanged = true;
        })
        self.address.subscribe(function(newValue) {
            self.isChanged = true;
        })
        self.phone.subscribe(function(newVal) {
            self.isChanged = true;
        })
        self.isActive.subscribe(function(newVal) {
            self.isChanged = true;
        })

    }

    var ClientModel = function(client) {


        var self = this;
        self._id = ko.observable(client ? client._id : '');
        self.client = ko.observable(client ? client.client : '');


        self.isChanged = false;

        self.client.subscribe(function(newValue) {

            self.isChanged = true;

        })

        self.isActive = ko.observable(client ? client.isActive : '');

        self.addresses=client.addresses.map(function(address){

            return new AddressModel(address);

        });

        self.addItem = function() {

            self.addresses.unshift(new AddressModel());
            //swiper.update();
        };

        self.removeItem = function(address) {
            self.addresses.remove(address);
            //swiper.update();
        };

    };

    var ClientsModel = function(clients, swiper) {

        swiper={
            function update(){

            }
        }

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
            //swiper.update();
        };

        self.removeClient = function(client) {
            arguments[3]();
            var succeed = arguments[4];
            var id = client._id();
            self.clients.remove(client);

            if (id == '') {
                //swiper.update();
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

            //swiper.update();

        };

        self.submitClients = function(client) {


            arguments[3]();
            var succeed = arguments[4];

            var clients = self.clients();
            //var clientsData = $.parseJSON(ko.toJSON(clients)); //$.parseJSON(ko.toJSON(order));

            if (Array.isArray(clients) && clients.length > 0) {

                var changedIndexs = [];

                var changedClients = clients.filter(function(client, index) {

                    var isChanged = false;

                    if (client.isChanged) {
                        isChanged = true;
                    } else {
                        for (var i = 0; i < client.addresses.length; i++) {
                            if (client.addresses[i].isChanged) {
                                isChanged = true;
                                break;
                            }
                        }
                    }

                    if (isChanged) {
                        changedIndexs.push(index);
                    }

                    return isChanged;

                })


                if (changedClients.length > 0) {

                    var clientsData=$.parseJSON(ko.toJSON(changedClients));

                    $.post('./clients', {
                            clients: clientsData
                        }, function(rs, status) {

                            rs.forEach(function(newClient, index) {
                                var orderIndex = changedIndexs[index];

                                if ($.isArray(newClient.addresses) && newClient.addresses.length == 0) {
                                    newClient.addresses = [{}];
                                }


                                ko.mapping.fromJS(newClient, {
                                    addresses: {
                                        create: function(option) {
                                            return new AddressModel(option.data);

                                        }
                                    }
                                }, clients[orderIndex]);

                                clients[orderIndex].isChanged = false;

                            })

                            succeed();

                        },
                        'json'
                    );
                } else {
                    succeed();
                }


            }


            return false;

        };
    };




    return ClientsModel;

})
