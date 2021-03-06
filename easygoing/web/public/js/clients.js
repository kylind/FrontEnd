define(['common', 'clipboard'], function(util, Clipboard) {

    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;

    var AddressModel = function(address) {
        var self = this;

        self.recipient = ko.observable(address && address.recipient ? address.recipient : '');
        self.address = ko.observable(address && address.address ? address.address : '');
        self.phone = ko.observable(address && address.phone ? address.phone : '');
        self.isActive = ko.observable((address && address.isActive) ? true : false);


        self.defaultAddressMarkCss = ko.pureComputed(function() {

            return self.isActive() ? 'icon-radio-selected' : 'icon-radio';

        });

        self.defaultAddressCss = ko.pureComputed(function() {

            return self.isActive() ? 'isActive' : '';

        });


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

    var ClientModel = function(client, swiper) {

        var self = this;
        self._id = ko.observable(client ? client._id : '');
        self.name = ko.observable(client ? client.name : '');

        self.createDate = client && client.createDate ? client.createDate : '';


        self.isActive = ko.observable((client && client.isActive) ? true : false);

        self.mailType = (client && client.mailType) ? client.mailType : '';

        self.mailDisplayType = function(mailType) {
            if (mailType == 'sf') {
                return '顺丰';
            } else if (mailType == 'common') {
                return '韵达';
            }

        }

        self.displayPrintName = function(recipient) {

            recipient = recipient();

            var mail = '';


            if (recipient == '') return '';

            if (self.mailType == 'sf') {
                mail = '顺丰';
                return `${recipient} - ${mail}`;
            } else if (self.mailType == 'common') {
                mail = '韵达';
                return `${recipient} - ${mail}`;
            } else {
                return recipient;
            }



        }


        if (client && Array.isArray(client.addresses) && client.addresses.length > 0) {

            self.addresses = ko.observableArray(client.addresses.map(address => new AddressModel(address)));

        } else {
            self.addresses = ko.observableArray([new AddressModel({ isActive: true })]);

        }

        self.isChanged = false;

        self.name.subscribe(function(newValue) {

            self.isChanged = true;

        })

        self.addresses.subscribe(function(newValue) {
            self.isChanged = true;
        })


        self.addAddress = function() {

            if (self.addresses().length > 0) {
                self.addresses.unshift(new AddressModel());
            } else {
                self.addresses.unshift(new AddressModel({ isActive: true }));
            }


            swiper.update();
        };

        self.removeAddress = function(address) {
            self.addresses.remove(address);
            swiper.update();
        };


        self.markDefault = function(address, parent) {

            parent.addresses().forEach(address => address.isActive(false));
            address.isActive(true);

        }

    };

    var ClientsModel = function(clients, swiper) {


        function classifyClients() {

            var clients = self.clients();

            var activeClients = clients.filter(client => {

                let name = client.name();

                return client.isActive() && client.mailType == 'common';
            });


            var agentClients = activeClients.filter(client => {

                let name = client.name();

                return name.indexOf('-') >= 0 || name.indexOf('－') >= 0
            });

            var agents = [];

            agentClients.forEach(client => {

                let name = client.name();

                var sep_e = name.indexOf('-');
                var sep_c = name.indexOf('－');

                var sep = -1;

                if (sep_e > -1 && sep_c > -1) {
                    sep = Math.min(sep_e, sep_c)

                } else if (sep_e > -1) {
                    sep = sep_e;

                } else {
                    sep = sep_c;
                }

                var agent = name.slice(0, sep);

                var existing = agents.find(_agent => _agent == agent)
                if (!existing) {
                    agents.push(agent);
                }
            });


            var senders = [];
            agents.forEach(agent => {

                let specificAgentClients = agentClients.filter(client => client.name().startsWith(agent));

                let rs = aggregateClients(agent, specificAgentClients)
                senders.push(rs);

            });


            var commonClients = activeClients.filter(client => {

                let name = client.name();

                return name.indexOf('-') == -1 && name.indexOf('－') == -1;
            });

            if (Array.isArray(commonClients) && commonClients.length > 0) {
                var rs = aggregateClients('自己的', commonClients)

                senders.push(rs);

            }

            return senders;

        }


        function aggregateClients(agent, clients) {
            var addresses = '';
            clients.forEach(client => {

                let address = client.addresses().find(address => address.isActive());

                let recipient = address.recipient();
                let phone = address.phone();
                let addressDetail = address.address();


                if (recipient  && phone && addressDetail) {

                    addresses += `${address.recipient()}，${address.phone()}，${address.address()}；`;
                }

            });

            return { name: agent + "：", receives: addresses };
        }


        function init(clients) {
            var observableClients = [];

            clients.forEach(function(client) {

                observableClients.push(new ClientModel(client, swiper));

            })
            return observableClients;

        }

        var self = this;


        self.clients = ko.observableArray(init(clients));
        self.senders = ko.observableArray(classifyClients());



        self.setClients = function(clients) {
            self.clients(init(clients));
            self.senders(classifyClients());
            //updateSwiper();

        }

        self.setClientViews = function(clients) {
            self.clients(clients);

        }

        self.setSenders = function() {

            self.senders(classifyClients());
        }


        self.addClient = function() {

            self.clients.unshift(new ClientModel(null, swiper));
            updateSwiper();
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
                    updateSwiper();
                },
                dataType: 'json',
                type: 'DELETE'

            });

            needRefresh = isSearchStatus ? true : false;



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


                    if (client.name != '') {
                        if (client.isChanged) {
                            isChanged = true;
                        } else {

                            let addresses = client.addresses();

                            var changedAddress = addresses.find(address => address.isChanged);

                            if (changedAddress) {
                                isChanged = true;

                            }
                        }

                    }

                    if (isChanged) {
                        changedIndexs.push(index);
                    }

                    return isChanged;

                })


                if (changedClients.length > 0) {


                    needRefresh = isSearchStatus ? true : false;


                    var clientsData = $.parseJSON(ko.toJSON(changedClients));

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

                            });

                            if (!isSearchStatus) {
                                self.setSenders();
                            }

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

        function updateSwiper() {
            setTimeout(function() {
                swiper.update();
            }, 100);
        }

        self.afterRender = function() {

            updateSwiper();



        }

        self.afterSenderRender = function() {
            if ($('.senders').children().length === self.senders().length) {
                var clipboard = new Clipboard('.sender-copy', {

                    text: function(trigger) {
                        return $(trigger).siblings('.sender-receives').val();
                    }
                });
                updateSwiper();
            }

        }

        self.afterClientRender = function() {

            if ($('.allclients').children().length === self.clients().length) {
                var clipboard = new Clipboard('.sender-singleCopy', {

                    text: function(trigger) {
                        var $activeAddress = $(trigger).closest('.client').find('.client-address.isActive');
                        var recipient = $activeAddress.find('.recipient>input').val();
                        var phone = $activeAddress.find('.phone>input').val();
                        var addressDetail = $activeAddress.find('.addressDetail>input').val();

                        return `${recipient}，${phone}，${addressDetail}；`;
                    }
                });
                updateSwiper();
            }
        }

        var activeClients, needRefresh, isSearchStatus, newKeywords, isDoing;



        self.searchClients = function(data, event) {

            var keywords = $(event.target).val();

            var regex = /(\s*)([\u4E00-\u9FA5\uF900-\uFA2D\w]+[\u4E00-\u9FA5\uF900-\uFA2D\w ]*)/;


            var matchedRes = keywords.match(regex);

            if (!activeClients) {

                activeClients = self.clients();

            }


            if (matchedRes != null) {

                isSearchStatus = true;

                newKeywords = matchedRes[2];

                if (matchedRes[1] == "") {
                    searchActiveClients()

                } else {

                    searchGlobalClients(newKeywords)
                }

            } else if (/^\s?$/.test(keywords)) {

                newKeywords = '';
                isSearchStatus = false;
                isDoing = false;

                if (needRefresh && !isDoing) {

                    isDoing = true;

                    $.getJSON('./clientsJson', function(clients, status) {

                        needRefresh = false;
                        isDoing = false;

                        self.setClients(clients);
                        activeClients = self.clients();


                    });


                } else {
                    self.clients(activeClients);

                }



            }

        }

        function searchActiveClients() {

            var searchedClients = activeClients.filter(function(client) {
                return client.name().indexOf(newKeywords) >= 0;
            });

            self.clients(searchedClients);
            //updateSwiper();

        }

        var timeoutIds = [];

        function searchGlobalClients() {

            var id = setTimeout(function() {

                for (var i = 1; i < timeoutIds.length; i++) {
                    clearTimeout(timeoutIds[i]);
                }

                timeoutIds = [];

                if (newKeywords != '') {

                    $.ajax('./clientsByKeywords', {
                        data: {
                            keywords: newKeywords
                        },
                        type: 'GET',
                        success: function(data, status) {
                            if (!/^\s?$/.test(newKeywords)) {
                                self.clients(init(data));
                            }
                        },

                        dataType: 'json'

                    });
                    console.log('i am searching ' + newKeywords);
                }


            }, 1000);

            timeoutIds.push(id);

        }
    };




    return ClientsModel;

})
