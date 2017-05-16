define(['common'], function(util) {
    var $ = util.$;
    var ko = util.ko;
    ko.mapping = util.mapping;

    function Product(product) {

        var self = this;

        self._id = ko.observable(product && product._id ? product._id : '');

        self.name = ko.observable(product && product.name ? product.name : '');

        self.status = ko.observable(product && product.status ? product.status : '');
        self.buyPrice = ko.observable(product && !isNaN(product.buyPrice) ? product.buyPrice : '');
        self.sellPrice = ko.observable(product && !isNaN(product.sellPrice) ? product.sellPrice : '');

        self.modifiedDate = ko.observable(product ? product.modifiedDate : '');

        self.displayDate = ko.observable(product ? product.displayDate : '');


        self.isChanged = false;
        self.name.subscribe(function(newValue) {
            self.isChanged = true;
        });
        self.buyPrice.subscribe(function(newValue) {
            self.isChanged = true;
        })

        self.sellPrice.subscribe(function(newValue) {
            self.isChanged = true;
        })

    }

    function Products(products, swiper) {

        var swiper = swiper;

        var self = this;


        function init(products) {


            var productModels = [];
            if (Array.isArray(products)) {

                var productModels = products.map(function(product) {

                    return new Product(product);

                });
            }

            return productModels;

        }

        self.setProducts = function(products) {
            self.products(init(products));
        }

        self.products = ko.observableArray(init(products));


        self.submitProducts = function() {
            arguments[3]();
            var succeed = arguments[4];

            var products = self.products();
            //var productsData = ko.mapping.toJS(products); //$.parseJSON(ko.toJSON(order));
            var productsData = $.parseJSON(ko.toJSON(products))

            if (Array.isArray(productsData) && productsData.length > 0) {

                var changedIndexs = [];

                var changedProducts = productsData.filter(function(product, index) {

                    var isChanged = false;
                    var isReal = product.name == '' ? false : true;

                    if (isReal && product.isChanged) {
                        isChanged = true;
                    }

                    if (isChanged) {
                        changedIndexs.push(index);
                    }

                    return isChanged;

                });

                if (changedProducts.length > 0) {

                    needRefresh = isSearchStatus ? true : false;

                    $.post('./products', { products: changedProducts }, function(rs, status) {

                            rs.forEach(function(newProduct, index) {
                                var orderIndex = changedIndexs[index];

                                ko.mapping.fromJS(newProduct, null, products[orderIndex]);

                                products[orderIndex].isChanged = false;

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

        self.addProduct = function() {

            var product = new Product();

            self.products.unshift(product);
            updateSwiper();
            $(window).scrollTop(0);
        };

        self.removeProduct = function(product) {

            arguments[3]();
            var succeed = arguments[4];

            var id = product._id();
            self.products.remove(product);


            if (id == '') {
                succeed();

                return;
            }

            $.ajax('./product/' + id, {
                success: function(data, status) {

                    succeed();
                    updateSwiper();
                },
                dataType: 'json',
                type: 'DELETE'

            });

            needRefresh = isSearchStatus ? true : false;

        };

        function updateSwiper() {
            setTimeout(function() {
                swiper.update();
            }, 100);
        }

        self.afterRender = function() {

            updateSwiper();

        }

        self.afterProductRender = function() {

            if ($('#productsbody').children().length === self.products().length) {

                updateSwiper();
            }
        }

        var activeProducts, needRefresh, isSearchStatus, newKeywords, isDoing;
        self.searchProducts = function(data, event) {

            var keywords = $(event.target).val();

            var regex = /(\s*)([\u4E00-\u9FA5\uF900-\uFA2D\w]+[\u4E00-\u9FA5\uF900-\uFA2D\w ]*)/;


            var matchedRes = keywords.match(regex);

            if (!activeProducts) {

                activeProducts = self.products();

            }
            if (matchedRes != null) {

                isSearchStatus = true;

                newKeywords = matchedRes[2];

                if (matchedRes[1] == "") {
                    searchActiveProducts()

                } else {

                    searchGlobalProducts()
                }

            } else if (/^\s?$/.test(keywords)) {

                newKeywords = '';

                isSearchStatus = false;
                isDoing=false;

                if (needRefresh && !isDoing) {

                    isDoing=true;

                    $.getJSON('./productsJson', function(products, status) {

                        needRefresh = false;
                        isDoing=false;
                        self.setProducts(products);
                        activeProducts = self.products();

                    });
                } else {

                    self.products(activeProducts);

                }
            }
        }

        function searchActiveProducts() {

            var searchedProducts = activeProducts.filter(function(client) {
                return client.name().indexOf(newKeywords) >= 0;
            });

            self.products(searchedProducts);
            //updateSwiper();

        }

        var timeoutIds = [];

        function searchGlobalProducts() {

            var id = setTimeout(function() {

                for (var i = 1; i < timeoutIds.length; i++) {
                    clearTimeout(timeoutIds[i]);
                }

                timeoutIds = [];

                if (newKeywords != '') {

                    $.ajax('./productsByKeywords', {
                        data: {
                            keywords: newKeywords
                        },
                        type: 'GET',
                        success: function(data, status) {

                            if (!/^\s?$/.test(newKeywords)) {
                                self.setProducts(products);
                            }

                            //updateSwiper();

                        },

                        dataType: 'json'

                    });
                    console.log('i am searching ' + newKeywords);
                }




            }, 1000);

            timeoutIds.push(id);

        }

    }

    return Products;




});
