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

        self.afterRender = function() {

            if (swiper && typeof swiper.update == 'function') {
                swiper.update();
            }

        }

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
            //swiper.update();
            $(window).scrollTop(0);
        };

        self.removeProduct = function(product) {

             arguments[3]();
             var succeed = arguments[4];

            var id = product._id;
            self.products.remove(product);


            if (id == '') {
                succeed();

                return;
            }

            $.ajax('./product/' + id, {
                success: function(data, status) {

                    succeed();

                },
                dataType: 'json',
                type: 'DELETE'

            });
            // swiper.update();


        };

        var products = null;
        self.searchProducts = function(data, event) {

            var keywords = $(event.target).val();
            if (products == null) {
                products = self.products();
            }


            if (keywords == '') {

                sortProducts(products);

                var searchedProducts = products;

            } else {
                var searchedProducts = products.filter(function(order) {

                    return order.client().indexOf(keywords) >= 0;
                });
            }


            self.products(searchedProducts);


            setTimeout(function() {
                swiper.update();
            }, 100)


        };

    }

    return Products;




});
