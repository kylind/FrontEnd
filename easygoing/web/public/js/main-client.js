define(['common', 'ClientsModel'], function(util, ClientsModel) {

    return run;

    function run() {

        var $ = util.$;
        var ko = util.ko;
        var mapping = util.mapping;
        var Swiper = util.Swiper;


        util.initTapEvent({
            updateAllData: function(){},
            updateCurrentData: function(){},
            setViewModelStatus: function(){},
            swiper: {}

        })

        var clientsModel;

        var clientsModel = new ClientsModel(clients);
        // clientsModel.setSwiper(swiper);

        ko.applyBindings(clientsModel, $('#clients')[0]);


    }

});
