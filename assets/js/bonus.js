var PARAMS = {
        "API": {
            "OFFERS": "https://www.bonusapp.in/cashback/offers.php"
        }
}

var fetchFilteredData = MSP.utils.memoize(function(resourceURL) {
    var dfd = $.Deferred();

    $.ajax({
        url: resourceURL,
        xhrFields: {
            withCredentials: true
        }
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
    var filterData = {},
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

    fetchURL = PARAMS.API.OFFERS+"?"+$.param(filterData);
    fetchFilteredData(fetchURL);
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

});


$doc.on("focus",".js-srch-inpt", function(){

});
