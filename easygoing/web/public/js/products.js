define(['common'], function(util) {
            var $ = util.$;
            var ko = util.ko;
            ko.mapping = util.mapping;

            function Product(product){



            }

            function Products() {

                var swiper = swiper;

                var self = this;

                self.incomeList = ko.observableArray(incomeList);

                self.setIncomeList = function(incomeList) {
                    self.incomeList(incomeList)
                }

                self.formatPrice = function(price) {

                    if (price) {
                        return (+price).toFixed(1);
                    } else {
                        return '?'
                    }
                }

                self.toggleTotalView = function(data, parent, event) {

                    $(event.target).toggleClass('icon-eyeopen');


                    var $order = $(event.target).closest('.orderitem-cnt');

                    if ($(event.target).hasClass('icon-eyeopen')) {
                        $order.addClass("isShow");
                    } else {
                        $order.removeClass("isShow");
                    }

                }

                self.afterRender = function() {
                    if (swiper && typeof swiper.update == 'function') {
                        swiper.update();
                    }

                }

            }




        };
