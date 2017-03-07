requirejs.config({

    baseUrl: './components',

    paths: {

        'jquery': './jquery/dist/jquery.min',
        'knockout': './knockout/dist/knockout',
        'knockout.mapping': '../js/knockout.mapping.2.4.1.min',
        'ReceivedOrders': '../js/received-orders',
        'ReckoningOrders': '../js/reckoning-orders',
        'IncomeList': '../js/income-list',
        'Addresses': '../js/addresses',
        'ItemsModel': '../js/purchase-items',
        'swiper': './swiper/dist/js/swiper.jquery.min',
        'colorbox': './jquery-colorbox/jquery.colorbox-min',
        'tag': '../js/jquery.tag',
        'angular': './angular/angular.min',
        'ngResource': './angular-resource/angular-resource.min',
        'ngAnimate': './angular-animate/angular-animate.min',
        //'settings.module': '../js/settings/settings.module',
        //'settings.component': '../js/settings/settings.component'
        'settings.component': '../js/settings/settings.min'
    },
    shim: {
        'swiper': ['jquery'],
        'knockout.mapping': ['knockout'],
        'colorbox': ['jquery'],
        'tag': ['jquery'],

        'angular': {
            exports: 'angular'
        },
        'ngResource': {
            deps: ['angular'],
            exports: 'angular'
        },
        'ngAnimate': {
            deps: ['angular'],
            exports: 'angular'
        },
    }

});


require(['ReceivedOrders', 'knockout', 'jquery', 'swiper'], function(OrdersModel, ko, $, Swiper) {

    var isTouch = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'click';
    var _on = $.fn.on;
    $.fn.on = function() {
        arguments[0] = (arguments[0] === 'click') ? isTouch : arguments[0];
        return _on.apply(this, arguments);
    }



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

    ko.bindingHandlers.tap = {

        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

            var handler = valueAccessor();

            $(element).on('click', function(event) {

                var $target = $(event.target);
                var $submitting = $('.prompt-submitting');
                var $succeed = $('.prompt-succeed');
                var $confirm = $('.confirm');

                if ($target.hasClass('action-delete') && $target.hasClass('action-submit')) {
                    var offset = $target.offset();

                    $('.confirm-submit').one('click', function() {

                        $confirm.fadeOut('slow');
                        handler(bindingContext.$data, bindingContext.$parent, event, function() {
                            $submitting.children('span').text(" 提交中...");
                            var offset = $target.offset();
                            $('.prompt').css('top', offset.top).show();

                        }, function(needRefreshRest) {

                            $submitting.addClass('disappeared')
                            $succeed.removeClass('disappeared')

                            $('.prompt').delay(600).fadeOut('slow', function() {
                                $submitting.removeClass('disappeared')
                                $succeed.addClass('disappeared')
                            });

                            setViewModelStatus(swiper.activeIndex);

                            if (needRefreshRest) {
                                updateAllData();
                            }

                        });

                    })

                    $('.confirm-cancel').one('click', function() {

                        $confirm.fadeOut('slow');

                    })

                    $('.confirm').css('top', offset.top).fadeIn('slow');


                } else if ($target.hasClass('action-submit')) {

                    var activeElement = $(document.activeElement);

                    if (!activeElement.hasClass('action-submit')) {
                        activeElement.blur();

                    }

                    setTimeout(function() {

                        handler(bindingContext.$data, bindingContext.$parent, event, function() {
                            $submitting.children('span').text(" 提交中...");
                            var offset = $target.offset();
                            $('.prompt').css('top', offset.top).show();

                        }, function(needRefreshRest, needRefreshCurrent) {

                            setViewModelStatus(swiper.activeIndex);

                            $submitting.addClass('disappeared')
                            $succeed.removeClass('disappeared')


                            $('.prompt').delay(1200).fadeOut('slow', function() {
                                $submitting.removeClass('disappeared')
                                $succeed.addClass('disappeared')

                            });


                            if (needRefreshCurrent) {
                                updateCurrentData();
                            }

                            if (needRefreshRest) {
                                updateAllData();
                            }


                        });



                    }, 100);



                } else if ($target.hasClass('action-load')) {

                    handler(bindingContext.$data, bindingContext.$parent, event, function() {
                        $submitting.children('span').text(" 加载中...");
                        var offset = $target.offset();
                        $('.prompt').css('top', offset.top).show();

                    }, function() {

                        $('.prompt').delay(600).fadeOut('slow');
                        swiper.update();

                    });

                } else {
                    handler(bindingContext.$data, bindingContext.$parent, event);


                }
                return false;
            });


        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

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
                    /* case 4:
                         bulletName = 'Delivery';
                         break;*/
            }
            return '<span class="' + className + '">' + bulletName + '</span>';
        }

    });
    var itemsModel, reckoningOrdersModel, incomeListModel, addressesModel;

    var ordersModel = new OrdersModel(orders);

    ko.applyBindings(ordersModel, $('#receivedOrders')[0]);

    ordersModel.setSwiper(swiper);


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


    require(['ItemsModel', 'ReckoningOrders', 'IncomeList', 'Addresses', 'knockout', 'jquery', 'tag'], function(ItemsModel, OrdersModel, IncomeListModel, AddressesModel, ko, $) {


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

        // $.getJSON('./addressesJson', function(addresses, status) {
        //     addressesModel = new AddressesModel(addresses, swiper);
        //     ko.applyBindings(addressesModel, $('#addresses')[0]);

        // });



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


    require(['jquery', 'angular', 'settings.component', 'colorbox'], function($, angular) {

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

                    /*                    var iframe = $('.cboxIframe')[0];

                                        if (iframe) {
                                            var doc = iframe.contentDocument || iframe.document;

                                            var height = Math.max(doc.body ? doc.body.clientHeight : 0, doc.documentElement.scrollHeight);

                                            height = height < 200 ? 200 : height;

                                            $.colorbox.resize({ height: height });
                                        }*/

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
