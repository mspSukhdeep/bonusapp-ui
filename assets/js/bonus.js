var PARAMS = {
        "API": {
            "OFFERS": "https://www.bonusapp.in/cashback/offers.php",
            "STORES": "https://api.mysmartprice.com/v3/cashback/get_stores.php"
        },
        "data": {
            "stores": []
        },
        "meta": {
            "page": {
                "type": $(".wrpr").data("page-type"),
                "storeName": $(".wrpr").data("store-name"),
                "categoryName": $(".wrpr").data("category-name"),
                "subCategoryName": $(".wrpr").data("subcategory-name")
            }
        }
}

var fetchFilteredData = MSP.utils.memoize(function(resourceURL) {
    var dfd = $.Deferred();

    $.ajax({
        url: resourceURL,
    }).done(function(response) {
        dfd.resolve(response);
    }).fail(function(error) {
        dfd.reject(error);
    });

    return dfd.promise();

}, {
    "cacheLimit": 20
});

function copyText(text){
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed";
    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand("copy");
    }
    catch (ex) {
        console.warn("Copy to clipboard failed.", ex);
        return false;
    }
    finally{
        document.body.removeChild(textarea);
    }
    return true;
}

$doc.on("click", ".js-expnd-ofr", function() {
    $(this).data("expanded", !$(this).data("expanded"));
    var handlerText = $(this).data("expanded") ? "Hide offer details" : "Show offer details";

    $(this).text(handlerText);
    $(this).parents(".ofr-tile").find(".ofr-tile__dtls").slideToggle("fast");
});


$doc.on("click", ".js-cpn-code", function() {
    var code = $(this).text(),
        $copiedDiv = '<div class="ofr-tile__cpn--cpd">COPIED!</div>',
        _this = $(this);

    if(copyText(code)){
        _this.text("").append($copiedDiv);

        setTimeout(function(){
                _this.text(code).find("ofr-tile__cpn--cpd").remove();
        },3000);
    }

});


$(".js-img-sldr").each(function() {
    console.log("SLider Encoutnered");
});

function fetchDataAJAX(){

    var dfd = $.Deferred(),
        filterData = {},
        fetchURL;

    $(".js-fltr").each(function(){
        var filterType = $(this).data("filter-type");

        switch (filterType) {
            case "coupon":
                filterData.coupon = $(this).find(".ctgry-optns__item--actv").data("value");
                break;
            case "bank":
                filterData.bank = [];

                $(this).find(".ofr-fltrs__item--actv, .ofr-fltrs-drpdwn__item--actv").each(function() {
                    filterData.bank.push($(this).data("value"));
                });

                break;
            }
    });
    filterData.offset = $(".ofr-tile").length;
    filterData.pageInfo = PARAMS.meta.page;

    fetchURL = PARAMS.API.OFFERS+"?"+$.param(filterData);

    fetchFilteredData(fetchURL).done(function(response){
        dfd.resolve(response);
    });

    return dfd.promise();
}

$doc.on("click", ".js-fltr-item", function() {
    var $filterWrapper = $(this).parents(".js-fltr"),
        filterType = $filterWrapper.data("filter-type");

    switch (filterType) {
        case "coupon":
            $(".ctgry-optns__item--actv").removeClass("ctgry-optns__item--actv");
            $(this).addClass("ctgry-optns__item--actv");
            break;
        case "bank":
            var baseClass = $(this).attr("class").split(" ")[0];
            $(this).toggleClass(baseClass+"--actv");
            break;
    }

    fetchDataAJAX();
});

$doc.on("click", ".js-more-fltrs", function(e) {
    var handlerText = "",
        fewClass = "ofr-fltrs__less";

    if ($(this).data("expanded")) {
        handlerText = '<span class="ofr-fltrs__more-txt">MORE</span>';
        $(this).removeClass(fewClass);
    } else {
        handlerText = '<span class="ofr-fltrs__more-txt">LESS</span>';
        $(this).addClass(fewClass);
    }

    $(this).data("expanded", !$(this).data("expanded"));

    $(this).html(handlerText);
    $(this).parents(".ofr-fltrs").find(".ofr-fltrs-drpdwn").slideToggle("fast");

    e.stopPropagation();
});

$doc.on("click", "body", function(e) {
    // $(".js-more-fltrs").click();
});


$doc.on("focus",".js-srch-inpt", function(){
    fetchFilteredData(PARAMS.API.STORES);
});


$doc.on("keyup",".js-srch-inpt", function(){
    var searchWord = $(this).val().toLowerCase();

    if(!searchWord){
        $(".js-srch-drpdwn").slideUp("fast");
        $(".js-ovrly").fadeOut("fast");
    }
    else{
        fetchFilteredData(PARAMS.API.STORES).done(function(response){
            var filteredCount = 0;

            var searchResult = response.stores.filter(function(store){
                if(store.store_name.toLowerCase().indexOf(searchWord)>-1 && filteredCount<5){
                    filteredCount++;
                    return true;
                }
            }),
            $searchDom = "";

            searchResult.map(function(item, index){
                $searchDom += '<a class="hdr-srch__item clearfix" href="/store/'+item.store_name.toLowerCase()+'" target="_blank">\
                                    <img src="https://res.cloudinary.com/mspassets/w_48,h_48,c_pad,b_white,f_auto,q_auto/CB_Fav_Icons/'+item.store_name.toLowerCase()+'.png" class="hdr-srch__item-img" />\
                                    <div class="hdr-srch__item-txt">\
                                        '+item.store_name+'\
                                    </div>\
                                    <div class="hdr-srch__item-cb">\
                                        '+item.generic_text+'\
                                    </div>\
                                    <div class="hdr-srch__item-ofrs">\
                                        '+item.offers_count+' Offers\
                                    </div>\
                                </a>';
            });

            $(".js-srch-drpdwn").html($searchDom).slideDown("fast");

        });
    }
});


$doc.on("click", ".js-load-more", function(){
    var _this = $(this);
    _this.hide();

    fetchDataAJAX().done(function(response){
        $(".ofr-tile-wrpr").append(response);
        _this.show();
    });
})
