define(['common', 'ReceivedOrders', 'ItemsModel', 'ReckoningOrders', 'IncomeList', "ClientsModel", 'ProductsModel'], function(util, OrdersModel) {

    return run;

    function run() {

        var $ = util.$;
        var ko = util.ko;
        var mapping = util.mapping;
        var Swiper = util.Swiper;

        var viewModelStatus = {
            receivedOrders: false,
            purchaseItems: false,
            reckoningOrders: false,
            incomeList: false,
            clients: false,
            products: false
        };

        function applyProductPrice(products, orders, { buyComputing, sellComputing }) {

            if (typeof products == 'function') {

                products = ko.mapping.toJS(products());
            }

            if (typeof orders == 'function') {
                orders = ko.mapping.toJS(orders());

            }

            var productsWithPrice = products.filter(product => product.sellPrice || product.buyPrice);

            orders.forEach(order => {


                if (order.status == '1RECEIVED' || order.status == '2SENT') {
                    order.items.forEach(item => {

                        let productWithPrice = productsWithPrice.find(product => product.name == item.name);

                        if (productWithPrice) {

                            if (sellComputing && !item.sellPrice && productWithPrice.sellPrice) {

                                item.sellPrice = '?' + productWithPrice.sellPrice;
                                item.isDoubtSellPrice = true;
                                order.isChanged = true;

                            } else if (!sellComputing && item.isDoubtSellPrice) {

                                item.sellPrice = null;
                                item.isDoubtSellPrice = false;

                            }

                            if (buyComputing && !item.buyPrice && productWithPrice.buyPrice) {

                                item.buyPrice = '?' + productWithPrice.buyPrice;
                                item.isDoubtBuyPrice = true;
                                order.isChanged = true;

                            } else if (!buyComputing && item.isDoubtBuyPrice) {

                                item.buyPrice = null;
                                item.isDoubtBuyPrice = false;

                            }
                        }

                    })
                }


            })

            return orders;
        }



        function setViewModelStatus(activeIndex) {

            var id = $('.swiper-slide')[activeIndex].id;

            switch (id) {
                case 'receivedOrders':
                    viewModelStatus.purchaseItems = true;
                    viewModelStatus.reckoningOrders = true;
                    viewModelStatus.clients = true;
                    viewModelStatus.products = true;
                    break;
                case 'purchaseItems':
                    viewModelStatus.receivedOrders = true;
                    viewModelStatus.reckoningOrders = true;
                    break;
                case 'reckoningOrders':
                    viewModelStatus.receivedOrders = true;
                    viewModelStatus.purchaseItems = true;
                    viewModelStatus.incomeList = true;
                    viewModelStatus.clients = true;
                    viewModelStatus.products = true;
                    break;
                case 'products':
                    viewModelStatus.reckoningOrders = true;
                    break;
            }
        }

        function updateCurrentData() {

            var id = $('.swiper-slide')[swiper.activeIndex].id;

            if (id == 'receivedOrders') {

                $.getJSON('./receivedOrdersJson', function(orders, status) {
                    ordersModel.setOrders(orders, true);
                });
            }

            if (id == 'reckoningOrders') {

                $.getJSON('./reckoningOrdersJson', function(orders, status) {

                    var observableOrders = reckoningOrdersModel.getObservableOrders(orders);

                    reckoningOrdersModel.orders(observableOrders);

                })

            }

        }

        function updateAllData() {

            var id = $('.swiper-slide')[swiper.activeIndex].id;


            if (id == 'incomeList' || id == 'reckoningOrders') {
                $.getJSON('./receivedOrdersJson', function(orders, status) {
                    ordersModel.setOrders(orders, true);

                });

            }

            if (id == 'receivedOrders' || id == 'reckoningOrders') {

                $.getJSON('./purchaseItemsJson', function(rs, status) {
                    itemsModel.setItems(rs.items, true, true);

                });

            }


            if (id == 'receivedOrders' || id == 'incomeList') {

                $.getJSON('./reckoningOrdersJson', function(orders, status) {

                    var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                    reckoningOrdersModel.orders(observableOrders);


                })

            }

            if (id == 'reckoningOrders') {

                $.getJSON('./incomeListJson', function(incomeList, status) {
                    incomeListModel.setIncomeList(incomeList);
                })

            }
            if (id == 'reckoningOrders') {

                $.getJSON('./clientsJson', function(clients, status) {

                    clientsModel.setClients(clients);

                });

            }
        }

        var swiper = new Swiper('.swiper-container', {
            autoHeight: true,
            spaceBetween: 30,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            simulateTouch: false,
            shortSwipes: false,
            longSwipes: false,
            paginationBulletRender: function(index, className) {


                var bulletName = '';


                var id = $('.swiper-slide')[index].id


                switch (id) {
                    case 'receivedOrders':

                        bulletName = '接单';
                        break;

                    case 'purchaseItems':
                        bulletName = '采购';
                        break;

                    case 'reckoningOrders':
                        bulletName = '算账';
                        break;

                    case 'incomeList':
                        bulletName = '收益';
                        break;

                    case 'clients':
                        bulletName = '客户';
                        break;

                    case 'products':
                        bulletName = '产品';
                        break;

                }
                return '<span class="' + className + '">' + bulletName + '</span>';
            }

        });


        util.initTapEvent({
            updateAllData: updateAllData,
            updateCurrentData: updateCurrentData,
            setViewModelStatus: setViewModelStatus,
            swiper: swiper

        })

        var itemsModel, reckoningOrdersModel, incomeListModel, addressesModel, clientsModel, productsModel;

        var ordersModel = new OrdersModel(orders, swiper);
        //ordersModel.setSwiper(swiper);

        ko.applyBindings(ordersModel, $('#receivedOrders')[0]);

        function getUserSetting() {
            return new Promise(function(resolve, reject) {

                $.getJSON(`./user/${USER_ID}`, function(rs, status) {
                    resolve(rs);

                });
            });
        }

        var userPromise = getUserSetting();

        userPromise.catch(function(reason) {

        });


        require(['common', 'ItemsModel', 'ReckoningOrders', 'IncomeList', 'ClientsModel', 'ProductsModel'], function(util, ItemsModel, OrdersModel, IncomeListModel, ClientsModel, ProductsModel) {

            var $ = util.$;
            var ko = util.ko;

            var purchasePromise = new Promise(function(resolve, reject) {

                $.getJSON('./purchaseItemsJson', function(rs, status) {

                    itemsModel = new ItemsModel(rs.items, swiper);

                    ko.applyBindings(itemsModel, $('#purchaseItems')[0]);

                    resolve(itemsModel);

                });


            });



            Promise.all([userPromise, purchasePromise]).then(([user, itemsModel]) => {

                var tags = Array.isArray(user.tags) ? user.tags : [];


                $.fn.tag.setGlobalSettings({

                    tags,

                    updateTag(itemName, oldTag, newTag) {

                        if (oldTag == newTag) return;

                        if (Array.isArray(itemsModel.allItems) && itemsModel.allItems.length > 0) {
                            var item = itemsModel.allItems.find(function(item) {
                                return item._id == itemName;
                            });

                            if (item) {

                                item.tag = newTag;

                                var tags = [];

                                itemsModel.allItems.forEach(function(item) {

                                    if (tags.indexOf(item.tag) < 0 && item.tag) {
                                        tags.push(item.tag);
                                    }

                                })

                                itemsModel.tags(tags);
                            }

                        }

                        $.post('./itemtag', {
                                itemName: itemName,
                                oldTag: oldTag,
                                newTag: newTag

                            }, function(res, status) {

                                //updateAllData();
                                setViewModelStatus(swiper.activeIndex);


                            },
                            'json'
                        );

                    }

                });


            });




            var productPromise;

            if (access.products) {

                productPromise = new Promise(function(resolve, reject) {
                    $.getJSON('./productsJson', (products, status) => {

                        resolve(products);
                        productsModel = new ProductsModel(products, swiper);
                        ko.applyBindings(productsModel, $('#products')[0]);

                    });
                });
            }

            var reckoningPromise = new Promise(function(resolve, reject) {

                function applyReckoningBindings(orders) {
                    reckoningOrdersModel = new OrdersModel(orders, swiper);
                    resolve(reckoningOrdersModel);
                    ko.applyBindings(reckoningOrdersModel, $('#reckoningOrders')[0]);

                }

                $.getJSON('./reckoningOrdersJson', function(orders, status) {

                    if (access.products) {

                        Promise.all([userPromise, productPromise]).then(([user, products]) => {

                            let ordersWithPrice = applyProductPrice(products, orders, { buyComputing: user.buyComputing, sellComputing: user.sellComputing });

                            applyReckoningBindings(ordersWithPrice);

                        })

                    } else {

                        applyReckoningBindings(orders);

                    }


                });

            });

            $.getJSON('./incomeListJson', function(incomeList, status) {
                incomeListModel = new IncomeListModel(incomeList, swiper);
                ko.applyBindings(incomeListModel, $('#incomeList')[0]);

            });

            if (access.clients) {
                $.getJSON('./clientsJson', function(clients, status) {

                    clientsModel = new ClientsModel(clients, swiper);
                    ko.applyBindings(clientsModel, $('#clients')[0]);

                });

            }

            var productNamePromise = new Promise(function(resolve, reject) {
                $.getJSON('./allProductsDropdownJson', (products, status) => {
                    resolve(products);
                });
            });


            Promise.all([userPromise, productNamePromise]).then(([user, products]) => {

                $.fn.dropdown.settings.products = products;
                $.fn.dropdown.settings.productNames = products.map(product => product.name);
                $.fn.dropdown.settings.buyComputing = user.buyComputing;
                $.fn.dropdown.settings.sellComputing = user.sellComputing;


            })

            var clientNamePromise = new Promise(function(resolve, reject) {
                $.getJSON('./allClientNamesJson', (clientNames, status) => {
                    resolve(clientNames);
                });
            });

            clientNamePromise.then(clientNames => {
                $.fn.dropdown.settings.clients = clientNames;
            });

            $('.swiper-wrapper').on('keydown', function(event) {

                if (event.keyCode == 13) {

                    var id = $('.swiper-slide')[swiper.activeIndex].id

                    var $target = $('#' + id + ' .action-enter');

                    if ($target.length > 0) {
                        $(document.activeElement).blur();
                        setTimeout(function() {
                            $target.trigger('click')
                        }, 100);
                    }

                    return false;
                }

            });


            swiper.params.onSlideChangeStart = function(swiper) {


                var id = $('.swiper-slide')[swiper.activeIndex].id;

                switch (id) {
                    case 'receivedOrders':

                        if (viewModelStatus['receivedOrders']) {

                            $.getJSON('./receivedOrdersJson', function(orders, status) {

                                ordersModel.setOrders(orders, true);
                                viewModelStatus['receivedOrders'] = false;

                            });
                        }

                        break;

                    case 'purchaseItems':
                        if (viewModelStatus['purchaseItems']) {
                            $.getJSON('./purchaseItemsJson', function(rs, status) {
                                itemsModel.setItems(rs.items, true, true);
                                viewModelStatus['purchaseItems'] = false;

                            });
                        }
                        break;

                    case 'reckoningOrders':
                        if (viewModelStatus['reckoningOrders']) {

                            $.getJSON('./reckoningOrdersJson', function(orders, status) {


                                if (access.products) {

                                    userPromise.then(function(user) {

                                        let ordersWithPrice = applyProductPrice(productsModel.products, orders, { buyComputing: user.buyComputing, sellComputing: user.sellComputing });
                                        var observableOrders = reckoningOrdersModel.getObservableOrders(ordersWithPrice);
                                        reckoningOrdersModel.orders(observableOrders);
                                    })

                                } else {
                                    var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                                    reckoningOrdersModel.orders(observableOrders);
                                }

                                viewModelStatus['reckoningOrders'] = false;

                            })
                        }

                        break;

                    case 'incomeList':
                        if (viewModelStatus['incomeList']) {
                            $.getJSON('./incomeListJson', function(incomeList, status) {
                                incomeListModel.setIncomeList(incomeList);
                                viewModelStatus['incomeList'] = false;

                            })
                        }
                        break;
                    case 'clients':
                        if (viewModelStatus['clients']) {
                            $.getJSON('./clientsJson', function(clients, status) {

                                clientsModel.setClients(clients);

                                viewModelStatus['clients'] = false;

                            });
                        }
                        break;
                    case 'products':
                        if (viewModelStatus['products']) {
                            $.getJSON('./productsJson', function(products, status) {

                                productsModel.setProducts(products);

                                viewModelStatus['products'] = false;

                            });
                        }
                        break;
                }

                setTimeout(function() {
                    swiper.update();
                    $(window).scrollTop(0);
                }, 100);

            }

        });

        require(['angularApp'], function(angularApp) {

            var angular = angularApp();

            angular.bootstrap($('#settings')[0], ['settings']);

            $('.icon-cog').colorbox({
                inline: true,
                width: 335,
                height: 200,
                scrolling: false,
                close: '',
                top: 0,
                onComplete: function() {
                    setInterval(function() {
                        $.colorbox.resize();
                    }, 200)
                },
                onClosed: function() {

                    userPromise = getUserSetting();

                    var id = $('.swiper-slide')[swiper.activeIndex].id;

                    if (id == 'reckoningOrders' && access.products) {

                        userPromise.then(function(user) {

                            $.fn.dropdown.settings.buyComputing = user.buyComputing;
                            $.fn.dropdown.settings.sellComputing = user.sellComputing;

                            var ordersWithPrice = applyProductPrice(productsModel.products, reckoningOrdersModel.orders, { buyComputing: user.buyComputing, sellComputing: user.sellComputing });
                            var observableOrders = reckoningOrdersModel.getObservableOrders(ordersWithPrice);
                            reckoningOrdersModel.orders(observableOrders);

                        })

                    }

                    userPromise.then(function(user) {

                        $.fn.tag.setTags(user.tags);
                    })

                }
            });

            $(window).scroll(function() {
                var top = $(window).scrollTop();
                $(".searchbox").css("top", top);

            });

        })

        $('.icon-signout').bind('click', function() {

            $('.mask').addClass('isLoginShow');
            $.get('./logout', function(res, status) {
                    if (res.success) {

                        swiper.destroy(true, true);

                        $.get('./content', function(rs, status) {

                            setTimeout(function() {
                                $('#container').html(rs);
                                $('.mask').removeClass('isLoginShow');
                            }, 1000);

                        }, 'html');
                    }
                },
                'json'
            );

            return false;

        });



    }

});
