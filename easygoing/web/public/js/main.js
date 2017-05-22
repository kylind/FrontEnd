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

        function applyProductPrice(products, orders) {

            var products = ko.mapping.toJS(products);

            var productsWithPrice = products.filter(product => product.sellPrice || product.buyPrice);

            orders.forEach(order => {

                order.items.forEach(item => {

                    let productWithPrice = productsWithPrice.find(product => product.name == item.name);

                    if (productWithPrice) {

                        if (!item.sellPrice && productWithPrice.sellPrice) {
                            item.sellPrice = '?' + productWithPrice.sellPrice;
                        }
                        if (!item.buyPrice  && productWithPrice.buyPrice) {
                            item.buyPrice = '?' + productWithPrice.buyPrice;
                        }
                    }

                })
            })
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

        var ordersModel = new OrdersModel(orders);
        ordersModel.setSwiper(swiper);

        ko.applyBindings(ordersModel, $('#receivedOrders')[0]);


        require(['common', 'ItemsModel', 'ReckoningOrders', 'IncomeList', 'ClientsModel', 'ProductsModel'], function(util, ItemsModel, OrdersModel, IncomeListModel, ClientsModel, ProductsModel) {


            var $ = util.$;
            var ko = util.ko;


            var purchasePromise = new Promise(function(resolve, reject) {

                $.getJSON('./purchaseItemsJson', function(rs, status) {

                    itemsModel = new ItemsModel(rs.items, swiper);


                    resolve(itemsModel);


                    ko.applyBindings(itemsModel, $('#purchaseItems')[0]);

                    var promise = new Promise(function(resolve, reject) {
                        $.getJSON(`./user/${USER_ID}`, function(rs, status) {
                            resolve(rs);
                        });
                    });

                    promise.catch(function(reason) {

                    })

                    promise.then(function(rs) {


                        var tags = Array.isArray(rs.tags) ? rs.tags : [];

                        $('.hidden-tag').tag({
                            tags: tags,
                            updateTag: function(itemName, oldTag, newTag) {

                                if (oldTag == newTag) return;

                                if (Array.isArray(itemsModel.allItems) && itemsModel.allItems.length > 0) {
                                    var item = itemsModel.allItems.find(function(item) {
                                        return item._id == itemName;

                                    });

                                    item.tag = newTag;

                                    if (item) {

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

                });

            });


            var reckoningPromise = new Promise(function(resolve, reject) {

                function applyReckoningBindings(orders) {
                    reckoningOrdersModel = new OrdersModel(orders, swiper);
                    resolve(reckoningOrdersModel);
                    ko.applyBindings(reckoningOrdersModel, $('#reckoningOrders')[0]);

                }

                $.getJSON('./reckoningOrdersJson', function(orders, status) {

                    if (access.products) {

                        productPromise.then(function(products) {
                            applyProductPrice(products, orders);
                            applyReckoningBindings(orders);

                        })

                    } else {

                        applyReckoningBindings(orders);

                    }



                });

            })

            Promise.all([purchasePromise, reckoningPromise]).then(function(rs) {

            })

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

            if (access.products) {
                var productPromise = new Promise(function(resolve, reject) {
                    $.getJSON('./productsJson', function(products, status) {

                        resolve(products);

                        productsModel = new ProductsModel(products, swiper);

                        ko.applyBindings(productsModel, $('#products')[0]);

                    });

                })

            }


            $(document).on('keydown', function(event) {


                var id = $('.swiper-slide')[swiper.activeIndex].id


                if (event.keyCode == 13) {
                    // && (swiper.activeIndex == 0 || swiper.activeIndex == 2)
                    //var $target = $(document.activeElement).closest('.enterArea').find('.action-enter');
                    $(document.activeElement).blur();

                    //var targetPage = swiper.activeIndex == 0 ? 'receivedOrders' : 'reckoningOrders'

                    var $target = $('#' + id + ' .action-enter');
                    setTimeout(function() {
                        $target.trigger('click')
                    }, 100);
                    return false;
                }

            });


            swiper.params.onSlideChangeStart = function(swiper) {


                var id = $('.swiper-slide')[swiper.activeIndex].id

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

                                    applyProductPrice(productsModel.products(), orders);

                                }

                                var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                                reckoningOrdersModel.orders(observableOrders);
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
                }
            });

            $(window).scroll(function() {
                var top = $(window).scrollTop();
                //$(".cogbox").css("top", top + 30);
                //$(".swiper-pagination").css('top', top);
                // $(".header-cnt").css('top', top);
                $(".searchbox").css("top", top);

            });

        })

        $('.icon-signout').bind('click', function() {

            $('.mask').addClass('isLoginShow');
            $.get('./logout', function(res, status) {
                    if (res.success) {

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
