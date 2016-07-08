define(['jquery', 'knockout', 'knockout.mapping'], function($, ko, mapping) {

    ko.mapping = mapping;

    var AddressModel = function(address) {
        var self = this;
        self._id = ko.observable(address ? address._id : '');
        self.client = ko.observable(address ? address.client : '');
        self.recipient = ko.observable(address ? address.recipient : '');
        self.address = ko.observable(address ? address.address : '');
        self.phone = ko.observable(address ? address.phone : '');
        self.isSend = ko.observable(address ? address.isSend : '');


        /*this.isChanged = ko.pureComputed(function() {

            return address && address.client == self.client() && address.recipient == self.recipient() && address.address == self.address() && address.phone == self.phone() ? false : true;

        }, this);*/
    };

    var AddressesModel = function(addresses) {

        var observableAddresses = [];

        addresses.forEach(function(address) {

            observableAddresses.push(new AddressModel(address));

        })

        var self = this;

        self.addresses = ko.observableArray(observableAddresses);

        self.addresses.subscribe(function(changes) {

            console.log(changes);

        }, null, "arrayChange");



        self.addAddress = function() {

            self.addresses.unshift(new AddressModel());
        };

        self.removeAddress = function(address) {

            var id = address._id();
            self.addresses.remove(address);
            if (id == '') return;

            $.ajax('./address/' + id, {
                success: function(data, status) {

                    console.log(data);

                },
                dataType: 'json',
                type: 'DELETE'

            });

        };

        self.submitAddress = function(address) {

            console.log('post request....');

            var addressData = ko.mapping.toJS(address); //$.parseJSON(ko.toJSON(address));

            $.post('/address', addressData, function(data, status) {

                    console.log('get post result');
                    ko.mapping.fromJS(data, {}, address);
                },
                'json'
            );

            return false;

        };
    };




    return AddressesModel;

})
