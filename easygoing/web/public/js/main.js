require(['common', 'ReceivedOrders','ItemsModel', 'ReckoningOrders', 'IncomeList'], function(util, OrdersModel) {
    var $ = util.$;
    var ko = util.ko;
    var mapping = util.mapping;
    var Swiper = util.Swiper;

    var viewModelStatus = [false, false, false, false];

    function setViewModelStatus(activeIndex) {

        switch (activeIndex) {
            case 0:
                viewModelStatus[1] = true;
                viewModelStatus[2] = true;
                break;
            case 1:
                viewModelStatus[0] = true;
                viewModelStatus[2] = true;
                break;
            case 2:
                viewModelStatus[0] = true;
                viewModelStatus[1] = true;
                viewModelStatus[3] = true;
                break;
        }
    }

    function updateCurrentData() {

        if (swiper.activeIndex == 0) {

            $.getJSON('./receivedOrdersJson', function(orders, status) {
                ordersModel.setOrders(orders, true);
                setTimeout(function() {
                    swiper.update();
                }, 100);
            });

        }

        if (swiper.activeIndex == 2) {

            $.getJSON('./reckoningOrdersJson', function(orders, status) {

                var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                reckoningOrdersModel.orders(observableOrders);

                setTimeout(function() {
                    swiper.update();
                }, 100);

            })

        }

    }

    function updateAllData() {

        var activeIndex = swiper.activeIndex;


        if (activeIndex == 1 || activeIndex == 2) {
            $.getJSON('./receivedOrdersJson', function(orders, status) {
                ordersModel.setOrders(orders, true);
                setTimeout(function() {
                    swiper.update();
                }, 100);
            });

        }

        if (activeIndex == 0 || activeIndex == 2) {

            $.getJSON('./purchaseItemsJson', function(rs, status) {
                itemsModel.setItems(rs.items, true, true);
                setTimeout(function() {
                    swiper.update();
                }, 100);
            });

        }


        if (activeIndex == 0 || activeIndex == 1) {

            $.getJSON('./reckoningOrdersJson', function(orders, status) {

                var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                reckoningOrdersModel.orders(observableOrders);
                setTimeout(function() {
                    swiper.update();
                }, 100);

            })

        }

        if (activeIndex == 2) {

            $.getJSON('./incomeListJson', function(incomeList, status) {
                incomeListModel.setIncomeList(incomeList);
            })
            setTimeout(function() {
                swiper.update();
            }, 100);

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
            switch (index) {
                case 0:

                    bulletName = '接单';
                    break;

                case 1:
                    bulletName = '采购';
                    break;

                case 2:
                    bulletName = '算账';
                    break;

                case 3:
                    bulletName = '收益';
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

    var itemsModel, reckoningOrdersModel, incomeListModel, addressesModel;

    var ordersModel = new OrdersModel(orders);
    ordersModel.setSwiper(swiper);

    ko.applyBindings(ordersModel, $('#receivedOrders')[0]);

    require(['common', 'ItemsModel', 'ReckoningOrders', 'IncomeList'], function(util, ItemsModel, OrdersModel, IncomeListModel) {

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

            $.getJSON('./reckoningOrdersJson', function(orders, status) {
                reckoningOrdersModel = new OrdersModel(orders, swiper);
                resolve(reckoningOrdersModel);
                ko.applyBindings(reckoningOrdersModel, $('#reckoningOrders')[0]);


            });

        })

        Promise.all([purchasePromise, reckoningPromise]).then(function(rs) {

        })

        $.getJSON('./incomeListJson', function(incomeList, status) {
            incomeListModel = new IncomeListModel(incomeList, swiper);
            ko.applyBindings(incomeListModel, $('#incomeList')[0]);


        });

        $(document).on('keydown', function(event) {
            if (event.keyCode == 13 && (swiper.activeIndex == 0 || swiper.activeIndex == 2)) {
                //var $target = $(document.activeElement).closest('.enterArea').find('.action-enter');
                $(document.activeElement).blur();

                var targetPage = swiper.activeIndex == 0 ? 'receivedOrders' : 'reckoningOrders'

                var $target = $('#' + targetPage + ' .action-enter');
                setTimeout(function() {
                    $target.trigger('click')
                }, 100);
                return false;
            }

        });


        swiper.params.onSlideChangeStart = function(swiper) {

            var activeIndex = swiper.activeIndex;
            switch (swiper.activeIndex) {
                case 0:

                    if (viewModelStatus[activeIndex]) {

                        $.getJSON('./receivedOrdersJson', function(orders, status) {

                            ordersModel.setOrders(orders, true);
                            viewModelStatus[activeIndex] = false;

                        });
                    }

                    break;

                case 1:
                    if (viewModelStatus[activeIndex]) {
                        $.getJSON('./purchaseItemsJson', function(rs, status) {
                            itemsModel.setItems(rs.items, true, true);
                            viewModelStatus[activeIndex] = false;

                        });
                    }
                    break;

                case 2:
                    if (viewModelStatus[activeIndex]) {
                        $.getJSON('./reckoningOrdersJson', function(orders, status) {

                            var observableOrders = reckoningOrdersModel.getObservableOrders(orders);
                            reckoningOrdersModel.orders(observableOrders);
                            viewModelStatus[activeIndex] = false;

                        })
                    }

                    break;

                case 3:
                    if (viewModelStatus[activeIndex]) {
                        $.getJSON('./incomeListJson', function(incomeList, status) {
                            incomeListModel.setIncomeList(incomeList);
                            viewModelStatus[activeIndex] = false;

                        })
                    }
                    break;

            }

            setTimeout(function() {
                $(window).scrollTop(0);
            }, 100);

        }

    });

    require(['commonAngular', 'settings'], function(angular) {

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
            $(".cogbox").css("top", top + 10);
            $(".swiper-pagination").css('top', top);
            $(".searchbox").css("top", top);

        });

    })

});
