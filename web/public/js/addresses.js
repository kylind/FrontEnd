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

    var AddressesModel = function(addresses, swiper) {

        function init(addresses) {
            var observableAddresses = [];

            addresses.forEach(function(address) {

                observableAddresses.push(new AddressModel(address));

            })
            return observableAddresses;

        }



        var self = this;

        var observableAddresses = init(addresses);

        self.addresses = ko.observableArray(observableAddresses);

        self.setAddresses = function(addresses) {
            self.addresses(init(addresses));

        }


        self.addAddress = function() {

            self.addresses.unshift(new AddressModel());
            swiper.update();
        };

        self.removeAddress = function(address) {
            arguments[3]();
            var succeed = arguments[4];
            var id = address._id();
            self.addresses.remove(address);

            if (id == '') {
                swiper.update();
                succeed();
                return;
            }



            $.ajax('./address/' + id, {
                success: function(data, status) {
                    succeed();
                },
                dataType: 'json',
                type: 'DELETE'

            });

            swiper.update();

        };

        self.submitAddress = function(address) {
            arguments[3]();
            var succeed = arguments[4];

            console.log('post request....');

            var addressData = ko.mapping.toJS(address); //$.parseJSON(ko.toJSON(address));

            $.post('/address', addressData, function(data, status) {

                    console.log('get post result');
                    ko.mapping.fromJS(data, {}, address);
                    swiper.update();
                    succeed();
                },
                'json'
            );

            return false;

        };
    };




    return AddressesModel;

})
