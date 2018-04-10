var modal = {
    "state": {},
    "params": {
        "API": {
            "BASE_URI": "https://www.bonusapp.in/",
            "AUTH_API": "users/mobile_number_auth.php",
            "REDEEM_API": "m/me/redeem_process.php",
            "CLAIM_SUBMIT_API": "me/claims_issues_help.php",
            "INVOICE_UPLOAD": "https://loyality-invoice.s3.amazonaws.com/"
        }
    },
    "route": [{
            "view": "passbook",
            "component": null,
            "path": "/me/",
            "require": [
                "passbook",
                "profile"
            ]
        },
        {
            "view": "activity",
            "component": null,
            "path": "/me/activity",
            "require": [
                "activity",
                "profile"
            ]
        },
        {
            "view": "redeem",
            "component": "redeem.html",
            "path": "/me/redeem",
            "require": [
                "redeem",
                "profile"
            ]
        },
        {
            "view": "claims",
            "component": "claims.html",
            "path": "/me/claims",
            "require": [
                "claims",
                "profile"
            ]
        },
        {
            "view": "how-it-works",
            "component": "how-it-works.html",
            "path": "/me/how-it-works",
            "require": [
                "profile"
            ]
        },
        {
            "view": "faq",
            "component": "faq.html",
            "path": "/me/faq",
            "require": [
                "profile"
            ]
        },
        {
            "view": "contact",
            "component": "contact.html",
            "path": "/me/contact",
            "require": [
                "profile"
            ]
        }
    ],
    "resource": {
        "profile": "me/page_info.php?function=profile&format=2&page=1",
        "passbook": "me/page_info.php?function=passbook&format=2&page=1",
        "activity": "me/page_info.php?function=activity_details&format=2&page=1",
        "redeem": "me/page_info.php?function=redemption_slabs&format=2&page=1",
        "claims": "me/page_info.php?function=claims_issues&format=2&page=1"
    },
    "store": {
        "profile": {
            "name": {
                "value": getCookie('msp_login_name'),
                "className": ".js-user-name"
            },
            "email": {
                "value": getCookie('msp_login_email'),
                "className": ".js-user-email"
            },
            "mobile": {
                "value": getCookie('msp_login_mobile'),
                "className": ".js-user-mob"
            },
            "pending_cashback": {
                "value": getCookie('msp_pending_cb'),
                "className": ".js-pndng-cb"
            },
            "verified_cashback": {
                "value": getCookie('msp_verified_cb'),
                "className": ".js-vrfd-cb"
            },
            "image": {
                "value": getCookie('msp_user_image'),
                "className": ".js-user-img"
            },
            "total_cashback": {
		        	"value": getCookie('msp_loyalty_points'),
		        	"className": ".js-lylty-pnts"
            }
        },
        "passbook": {
            "title": "Cashback Passbook",
            "filter": {
                "name": "psbk-fltr",
                "className": "js-fltr",
                "active": null,
                "data": [{
                        "label": "All",
                        "value": "all"
                    },
                    {
                        "label": "Confirmed",
                        "value": "confirmed"
                    },
                    {
                        "label": "Redeemed",
                        "value": "redeemed"
                    },
                    {
                        "label": "Expired",
                        "value": "expired"
                    }
                ]
            },
            "columns": [{
                    "name": "Date",
                    "className": "prfl-tbl__date"
                },
                {
                    "name": "Entry",
                    "className": "prfl-tbl__entry"
                },
                {
                    "name": "Cashback",
                    "subText": "Confirmed",
                    "className": "prfl-tbl__cb"
                },
                {
                    "name": "Expiry Date",
                    "className": "prfl-tbl__exp-date"
                }
            ],
            data: []
        },
        "activity": {
            "title": "Purchase Tracking",
            "filter": {
                "name": "actvty-fltr",
                "className": "js-fltr",
                "active": null,
                "data": [{
                        "label": "Tracked Purchases",
                        "value": "tracked"
                    },
                    {
                        "label": "Click History",
                        "value": "history"
                    }
                ]
            },
            "columns": {
                "tracked": [{
                        "name": "Date",
                        "className": "prfl-tbl__date prfl-tbl__date--l"
                    },
                    {
                        "name": "Store",
                        "className": "prfl-tbl__entry prfl-tbl__entry--l"
                    },
                    {
                        "name": "Cashback",
                        "subText": "Pending",
                        "className": "prfl-tbl__cb"
                    }
                ],
                "history": [{
                        "name": "Date",
                        "className": "prfl-tbl__date prfl-tbl__date--l"
                    },
                    {
                        "name": "Store",
                        "className": "prfl-tbl__entry prfl-tbl__entry--l"
                    },
                    {
                        "name": "Clicks",
                        "className": "prfl-tbl__clicks"
                    }
                ]
            },
            "data": {}
        },
        "redeem": {
            "data": {},
            "offers": {
                "paytm": {
                    "title": "Transfer cashback to Paytm account",
                    "description": "Paytm is one of the biggest recharge site in India that delivers instant online prepaid recharge & mobile bill payment solutions to end users."
                },
                "amazon": {
                    "title": "Redeem cashback as Amazon Gift Card",
                    "description": "Amazon is one of the biggest ecommerce  website in India."
                },
                "flipkart": {
                    "title": "Redeem cashback as Flipkart Gift Voucher",
                    "description": "Flipkart is one of the biggest ecommerce  website in India."
                },
                "bank": {
                    "title": "Transfer cashback to your Bank account",
                    "description": "We will transfer money to your Bank account via NEFT/RTGS. It might take 2-4 working days for the amount to reflect in your account."
                }
            },
            "meta": {
                "arrowPosition": [],
                "current": {}
            }
        },
        "claims": {
            "title": "Claims History",
            "type": [{
                    "id": "1",
                    "formType": "signUp",
                    "title": "Did not get signup bonus",
                    "description": "Sign up bonus of Rs 25 not credited.",
                    "required": [{
                        "type": "email",
                        "label": "Email",
                        "placeholder": "example@domain.com"
                    }],
                    "info": "Please fill the details. Your sign up bonus of Rs 25 will be credited in 1-2 days."
                },
                {
                    "id": "2",
                    "title": "Did not get Cashback",
                    "formType": "MSPCoins",
                    "description": "Purchased an item more than 5 days ago and did not receive Cashback.",
                    "required": [{
                            "type": "email",
                            "label": "Email",
                            "placeholder": "example@domain.com"
                        },
                        {
                            "type": "date",
                            "label": "Date",
                            "placeholder": "01-01-2018"
                        },
                        {
                            "type": "number",
                            "label": "Price",
                            "placeholder": ""
                        },
                        {
                            "type": "select",
                            "label": "Store",
                            "placeholder": "Select a Store",
                            "list": ["amazon", "dominos", "myntra", "mobikwik", "foodpanda", "jabong", "swiggy", "travelguru", "zoomcar", "paytm", "fabhotels", "shopclues", "tatacliq", "pizzahut", "Musafir", "Adidas", "Shoppersstop", "Clovia", "JetAirways", "Voonik", "Amazon", "ajio", "1mg", "bigbasket", "airtel", "aliexpress", "gadgetsnow", "koovs", "zivame", "netmeds", "littleapp", "nearbuy", "bluestone", "fnp", "housejoy", "Igp", "pepperfry", "printvenue", "exclusivelane", "metroshoes", "mojopizza", "myflowertree", "stalkbuylove",
                                "voxpop", "treebohotels", "prettysecrets", "faasos", "emirates", "hotels", "qatarairways", "telenor", "bewakoof", "biba", "practo", "thyrocare", "zopnow", "droom", "floweraura", "giftease", "moglix", "rediff", "teabox", "thatspersonal", "urbanclap", "abof", "freshmenu", "flipkart", "ixigo", "healthkart", "Makemytrip", "yatra", "Cleartrip", "Expedia", "bookMyShow", "bata", "confirmtkt", "akbartravels", "beardo", "voylla", "booking", "croma", "puma", "flintobox", "ebay", "homeshop18", "nykaa", "limeroad",
                                "goair", "goomo", "oyorooms", "decathlon", "faballey", "footprint360", "chumbak", "dunkinindia", "foodcloud", "thebodyshop", "agoda", "ticketgoose", "kidzee", "medlife", "flaberry", "reliance-trends", "mcdonalds", "happilyunmarried", "nnnow", "easemytrip", "cheapticket", "bajajelectricals", "wyo", "20dresses", "ejohri", "zoomin", "ticketnew", "bankbazaar1", "dailyobjects", "shyaway", "KFC", "coolwinks",
                                "DroomHelmet", "StandardChartered", "AmericanExpress", "CitibankIndianoil", "ezoneonline", "firstcry", "udyantea", "canon", "bro4u", "medicinesmall", "harmanaudio", "samsungindiaestore", "industrybuying", "chaipoint", "sporto", "StarQuik", "meraevents", "mrvoonik", "cuirally", "morphyrichardsindia", "airvistara", "Cashify", "Furnspace", "triptaptoe", "eventshigh", "naturesbasket", "amarchitrakatha", "rentomojo", "pokerbaazi", "ace2three", "magzter", "home-town", "wildcraft", "freecharge",
                                "lovzme", "behrouz", "maxfashion", "olacabs", "soch", "myvishal", "testbook", "zoylo", "paragonfootwear", "macmerise", "gofynd", "teafloor", "bombayshavingcompany", "ihopharmacy", "panasonic", "purplle", "redwolf", "oneplusstore", "lurap", "winni", "rangriti", "vlccpersonalcare", "luluandsky", "livpure", "uber", "reebok", "Redbusapp", "melorra", "tjori", "lemall"
                            ]
                        },
                        {
                            "type": "file",
                            "label": "Invoice Attachment",
                            "placeholder": "01/01/2018"
                        },
                    ],
                    "info": "Please fill the details below. We will verify & credit your Cashback in 3-4 days."
                },
                {
                    "id": "3",
                    "formType": "paytmCash",
                    "title": "Did not get Paytm cash",
                    "description": "Redeemed Paytm cash using a valid mobile number more than 5 days ago but did not receive Paytm cash.",
                    "required": [{
                            "type": "email",
                            "label": "Email",
                            "placeholder": "example@domain.com"
                        },
                        {
                            "type": "text",
                            "label": "Redemption ID",
                            "placeholder": ""
                        }
                    ],
                    "info": "Share your redemption details. Your Paytm cash will be credited as soon as possible."
                },
                {
                    "id": "4",
                    "formType": "gift",
                    "title": "Amazon/Flipkart voucher not delivered",
                    "description": "Redeemed a Amazon/Flipkart voucher more than 20 days ago but did not receive it.",
                    "required": [{
                            "type": "email",
                            "label": "Email",
                            "placeholder": "example@domain.com"
                        },
                        {
                            "type": "text",
                            "label": "Redemption ID",
                            "placeholder": ""
                        }
                    ],
                    "info": "Share your redemption details. Your Amazon/Flipkart voucher will be delivered as soon as possible."
                },
                {
                    "id": "5",
                    "title": "My Issue is not listed here",
                    "description": "I have a problem which is not listed above.",
                    "required": [{
                        "type": "none"
                    }],
                    "info": "Please mention your issue & write to <a href='mailto:hi@bonusapp.in' class='txt--bold'>hi@bonusapp.in</a>"
                }
            ],
            "columns": [{
                    "name": "date",
                    "className": "prfl-tbl__date prfl-tbl__date--l"
                },
                {
                    "name": "claims/Issues",
                    "className": "prfl-tbl__issue"
                },
                {
                    "name": "description",
                    "className": "prfl-tbl__lng-dsc"
                }
            ],
            "data": [],
            "meta": {
                "formData": {}
            }
        }
    },
    "dom": {
        "$viewWrapper": $(".js-tab-cntnr"),
        "$loader": "<div class='ldr'>\
                       <img class='ldr__img' src='https://assets.mspcdn.net/bonus_in/icon/rolling_grn.svg' />\
                   <div>"
    }
}

var fetchPage = MSP.utils.memoize(function(resourceURL) {
    var dfd = $.Deferred();

    if (resourceURL) {
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
    } else {
        setTimeout(function() {
            dfd.resolve("");
        }, 0);
    }

    return dfd.promise();

}, {
    "cacheLimit": 20
});

function highlightActiveLink() {
    $(".list-item--actv").removeClass("list-item--actv");

    $(".js-link, .js-load-page").each(function() {
        if (modal.state.view === $(this).data("view") && $(this).hasClass("list-item")) {
            $(this).addClass("list-item--actv");
        }
    });
}

function numberFormat(x){
	  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getNumber(param){
	if (typeof(param)==="string"){
		param = param.replace(",","");
	}
	return parseInt(param);
}

function setProfileData(profile) {
    var mProfile = modal.store.profile;
    mProfile.name.value = profile.name || modal.store.profile.name.value;
    mProfile.email.value = profile.email || modal.store.profile.email.value;
    mProfile.mobile.value = profile.mobile || modal.store.profile.mobile.value || "";
    mProfile.pending_cashback.value = profile.pending_cashback || 0;
    mProfile.verified_cashback.value = profile.verified_cashback || 0;
    mProfile.image.value = profile.image || modal.store.profile.image.value;
    mProfile.total_cashback.value = mProfile.pending_cashback.value+mProfile.verified_cashback.value;

    setCookie('msp_login_name', mProfile.name.value, 365);
    setCookie('msp_verified_cb', profile.verified_cashback, 365);
    setCookie('msp_pending_cb', profile.pending_cashback, 365);
    setCookie('msp_loyalty_points', mProfile.total_cashback.value, 365);
}

var renderProfileSection = function() {
    var profile = modal.store.profile;
    $(".prfl").removeClass("prfl--ldng").addClass("clearfix").find(".prfl__inr").show();

    for (key in profile) {
        if (key === "image") {
            $(profile[key].className).attr("src", profile[key].value);
        }
        if(key === "verified_cashback" || key === "pending_cashback" || key === "total_cashback")
        	{
        		$(profile[key].className).text(numberFormat(profile[key].value));
        	}
        else {
            $(profile[key].className).text(profile[key].value || "");
        }
    }

}

function getTableRows(store, format) {
    var rows = "",
        data = store.data;
    if(!data) return "";

    switch (format) {
        case "passbook":
            for (var i = 0; i < data.length; i++) {
                if (store.filter.active && store.filter.active != "all" && data[i].type != store.filter.active) continue;

                var cashback = data[i].cashback > 0 ? ("₹" + numberFormat(data[i].cashback)) : ("-₹" + numberFormat(Math.abs(data[i].cashback))),
                    cashbackClass = data[i].cashback > 0 ? ("prfl-tbl__cb txt--grn") : ("prfl-tbl__cb txt--red"),
                    expiry = data[i].expiry_date || "<center>-</center>",
                    entry = data[i].type,
                    description = "",
                    rowClass = "prfl-tbl__row clearfix";

                if (data[i].info) {
                    entry = data[i].info.store || data[i].info.redeem || data[i].type;
                    if(entry==="Banktransfer"){
                    		entry = "Bank Transfer";
                    }
                    if(data[i].info.product_price){
                    		description += "<div class='prfl-tbl__dscrptn'>Amount: <span class='txt--bold'>₹" + data[i].info.product_price + "</span></div>";
                    }
                    else if(data[i].cashback){
                    		description += "<div class='prfl-tbl__dscrptn'>Amount: <span class='txt--bold'>₹" + Math.abs(data[i].cashback) + "</span></div>";
                    }
                }

                switch (data[i].type) {
                    case "expired":
                        rowClass += " prfl-tbl__row--cncld";
                        break;
                    case "cancelled":
                        rowClass += " prfl-tbl__row--cncld";
                        break;
                    case "redeemed":

                    		if(data[i].status==="success")
                    			description += '<div class="prfl-tbl__sts prfl-tbl__sts--clsd">Redeemed</div>';
                    		else if(data[i].status==="valid")
                    			description += '<div class="prfl-tbl__sts prfl-tbl__sts--pndng">Pending</div>';
                    		else if(data[i].status==="failure")
                    			{
                    				description += '<div class="prfl-tbl__sts prfl-tbl__sts--fld">Failed</div>';
                    				cashback = '<span class="txt--red">-₹0</span>';
                    			}
                }

                rows += '<div class="' + rowClass + '">\
                           <div class="prfl-tbl__date">' + data[i].date + '</div>\
                           <div class="prfl-tbl__entry">\
                               ' + entry + '\
                               ' + description + '\
                           </div>\
                           <div class="' + cashbackClass + '">' + cashback + '</div>\
                           <div class="prfl-tbl__exp-date">' + expiry + '</div>\
                        </div>';
            }
            break;
        case "tracked":
            for (var i = 0; i < data.length; i++) {
                var columns = store.columns,
                    cashback = "₹" + Math.abs(data[i].cashback),
                    entry = data[i].info.store,
                    rowClass = "prfl-tbl__row clearfix",
                    subText = "",
                    confirmation_date = '<div class="prfl-tbl__info prfl-tbl__info--cnfrm-cshbck">\
                        						<span class="txt--bold">Confirmation Date: </span>\
                        						<span class="">' + data[i].info.confirmation_date + '</span>\
                        					</div>';

                if(data[i].type==="Cancelled"){
                    rowClass += " prfl-tbl__row--cncld";
                    cashback = '<span class="prfl-tbl__txt-cncld">'+cashback+'</span><span class="txt--red">₹0</span>';
                    subText = data[i].info.reason;
                }

                rows += '<div class="'+rowClass+'">\
                           <div class="' + columns[0].className + '">' + data[i].date + '</div>\
                           <div class="' + columns[1].className + '">\
                               <div class="prfl-tbl__entry-txt">' + entry + '</div>\
                               <div class="prfl-tbl__entry-info">' + subText + '</div>\
                               '+confirmation_date+'\
                           </div>\
                           <div class="' + columns[2].className + '">' + cashback + '</div>\
                       </div>';
            }
            break;
        case "history":
            for (var i = 0; i < data.length; i++) {

                var columns = store.columns,
                    entry = data[i].info.store,
                    clickCount = data[i].click_count > 1 ? (data[i].click_count + " Clicks") : (data[i].click_count + " Click");

                rows += '<div class="prfl-tbl__row clearfix">\
                       <div class="' + columns[0].className + '">' + data[i].date + '</div>\
                       <div class="' + columns[1].className + '">\
                           ' + entry + '\
                       </div>\
                       <div class="' + columns[2].className + '">' + clickCount + '</div>\
                   </div>';
            }
            break;
        case "claims":
            for (var i = 0; i < data.length; i++) {

                var columns = store.columns,
                    info = '',
                    status = '';


                for (key in data[i].info) {
                    if (data[i].info[key]) {
                        info += '<div class="prfl-tbl__info">\
                                    <span class="txt--bold">' + key.replace("_", " ") + ': </span>\
                                    <span class="">' + data[i].info[key] + '</span>\
                                </div>';
                    }
                }

                if (data[i].status) {
                    if (data[i].status.toLowerCase() === "pending") {
                        status = '<div class="prfl-tbl__sts prfl-tbl__sts--pndng">Pending</div>';
                    } else if (data[i].status.toLowerCase() === "closed") {
                        status = '<div class="prfl-tbl__sts prfl-tbl__sts--clsd">Closed</div>';
                    }
                }

                var entry = '<div class="' + columns[1].className + '-ttl">' + data[i].title + '</div>' + info + status;

                rows += '<div class="prfl-tbl__row clearfix">\
                           <div class="' + columns[0].className + '">' + data[i].date + '</div>\
                           <div class="' + columns[1].className + '">\
                               ' + entry + '\
                           </div>\
                           <div class="' + columns[2].className + '"><span class="' + columns[2].className + '--txt">' + data[i].description + '<span></div>\
                       </div>';
            }
            break;
        default:

    }
    return rows;
}

function getTableHeader(columns) {
    var header = "";

    for (var i = 0; i < columns.length; i++) {
    		var subText = "";
    		if(columns[i].subText){
    			subText = '<div class="'+columns[i].className+'--sub">('+columns[i].subText+')</div>';
    		}
        header += '<div class="' + columns[i].className + '">' + columns[i].name + '\
        			'+subText+'\
        </div>';
    }

    return header;
}

function getTableFilters(filters) {
    var filterDOM = "";

    if (!filters) return "";

    for (var i = 0; i < filters.data.length; i++) {
        var checked = "";

        if (filters.data[i].value === filters.active) {
            checked = "checked";
        }

        filterDOM += '<div class="rdio-grp">\
                            <input type="radio" class="rdio ' + filters.className + '" value="' + filters.data[i].value + '" name="' + filters.name + '" id="' + filters.data[i].value + '" ' + checked + '>\
                            <label for="' + filters.data[i].value + '">' + filters.data[i].label + '</label>\
                    </div>';
    }

    return filterDOM;
}

function getTableTemplate(store, format) {
    var $filters = getTableFilters(store.filter),
        $header = getTableHeader(store.columns),
        $rows = getTableRows(store, format);

    return '<div class="prfl-sctn">\
                   <div class="clearfix">\
                       <div class="prfl-sctn__ttl">' + store.title + '</div>\
                       <div class="prfl-sctn__fltrs clearfix">\
                           ' + $filters + '\
                       </div>\
                   </div>\
                   <div class="prfl-tbl">\
                       <div class="prfl-tbl__hd clearfix">\
                           ' + $header + '\
                       </div>\
                       <div class="prfl-tbl__body">\
                       ' + $rows + '\
                       </div>\
                   </div>\
               </div>';

}

function renderDataToView() {
    var data = modal.state.data || "";
    modal.dom.$viewWrapper.html(data);
}

function getPassbook(store) {
    if (!store.filter.active) {
        store.filter.active = store.filter.data[0].value;
    }

    modal.state.data = getTableTemplate(store, "passbook");
    renderDataToView();
}

function getActivityDetails(activityStore) {
    if (!activityStore.filter.active) {
        activityStore.filter.active = activityStore.filter.data[0].value;
    }

    var store = {
        title: activityStore.title,
        data: activityStore[activityStore.filter.active],
        filter: activityStore.filter,
        columns: activityStore.columns[activityStore.filter.active]
    }

    modal.state.data = getTableTemplate(store, activityStore.filter.active);
    renderDataToView();
}

function renderDependencyView(view) {

    if (!view) {
        view = modal.state.view;
    }

    switch (view) {
        case "profile":
            renderProfileSection();
            break;
        case "passbook":
            getPassbook(modal.store.passbook);
            break;
        case "activity":
            getActivityDetails(modal.store.activity);
            break;
        case "claims":
            getClaimsHistory(modal.store.claims);
            break;
        default:

    }
}

function appendLoader(dependency, isUpdate){
    var $loadingArea;

    switch (dependency) {
        case "passbook":
            $loadingArea = modal.dom.$viewWrapper;
            break;
        case "activity":
            $loadingArea = modal.dom.$viewWrapper;
            break;
        case "claims":
            $loadingArea = $(".js-clm-tbl-wrpr");
            break;
        case "profile":
            !isUpdate && $(".prfl").addClass("prfl--ldng").removeClass("clearfix").find(".prfl__inr").hide();
            break;
        default:
    }

    if($loadingArea instanceof jQuery){
        $loadingArea.html(modal.dom.$loader);
    }
}

function loadDependencies(dependencyArray, isUpdate) {
    var version = isUpdate?("?v="+Date.now()):"";

    dependencyArray.map(function(dependency) {
        appendLoader(dependency, isUpdate);
        fetchPage(modal.params.API.BASE_URI + modal.resource[dependency] + version).done(function(response) {

            response = tryParse(response);

            switch (dependency) {
                case "profile":
                    response.error?login():setProfileData(response);
                    break;
                case "passbook":
                    modal.store.passbook.data = response.passbook;
                    break;
                case "activity":
                    modal.store.activity.tracked = response.tracked_purchases;
                    modal.store.activity.history = response.click_history;
                    break;
                case "redeem":
                    modal.store.redeem.data = response.redemption_slabs;
                    break;
                case "claims":
                		response && (modal.store.claims.data = response.claims_history);
                    break;
                default:
                    console.warn("Unknown Dependency Loaded");
            }
            renderDependencyView(dependency);
        });
    });
}

function redeemInit(){
	if(!getCookie("gmail_access")){
		$(".js-gmail-req").show();
	}
}

function renderView(viewDOM) {
    modal.dom.$viewWrapper.html(viewDOM);

    switch (modal.state.view) {
        case "claims":
            renderClaimForm();
            break;
        case "redeem":
    		redeemInit();
    		break;
        default:

    }
}


function loadView() {
    modal.dom.$viewWrapper.html(modal.dom.$loader);
    highlightActiveLink();

    fetchPage(modal.state.component).done(function(viewDOM) {
        renderView(viewDOM);
        loadDependencies(modal.state.require);
    });
}

function readURLState() {
    var path = window.location.pathname,
        view;

    for (var i = 0; i < modal.route.length; i++) {
        if (path === modal.route[i].path) {
            view = modal.route[i];
        }
    }

    modal.state = view ? view : modal.route[0];
}

function redirectOldUsers(){
    var loc = window.location.hash,
        newPath;

    if(loc.indexOf("tabOpen=activity_details") > -1){
        newPath = "/me/activity";
    }
    else if(loc.indexOf("tabOpen=redemption") > -1){
        newPath = "/me/redeem";
    }
    else if(loc.indexOf("tabOpen=claims_issues") > -1){
        newPath = "/me/claims";
    }
    else if(loc.indexOf("tabOpen=how_it_works") > -1){
        newPath = "/me/how-it-works";
    }
    else if(loc.indexOf("tabOpen=") > -1){
        newPath = "/me/";
    }

    history.pushState({}, "New Tab", newPath);
}


function init() {
    redirectOldUsers();
    readURLState();
    loadView();
}

init();

/* Claim Page */

function getClaimsHistory() {
    var $tableData = getTableTemplate(modal.store.claims, "claims");
    $(".js-clm-tbl-wrpr").html($tableData);
}

function renderClaimForm() {
    var data = modal.store.claims.type,
        form = '';

    for (var i = 0; i < data.length; i++) {
        form += '<div class="clms__item-wrpr ripple ripple--l js-clm-item-wrpr" data-id="' + data[i].id + '">\
                   <div class="clms__item-ttl">\
                       ' + data[i].title + '\
                   </div>\
                   <div class="clms__item-dscrptn">\
                       ' + data[i].description + '\
                   </div>\
                   <div class="clms__item-form">\
                       <div class="clms__item-form--ttl">\
                           ' + data[i].info + '\
                       </div>\
                       <form class="form__cntnr js-clm-form" data-form-type="' + data[i].formType + '">\
                           ' + renderClaimFormFields(data[i].required) + '\
                       </form>\
                   </div>\
                   <div class="clms__item-msg">\
                       Your claim was sucessfully submitted. We’ll get back to you on this within 5 working days.\
                   </div>\
               </div>';
    }

    $(".js-clm-frm-wrpr").html(form);
}

var renderClaimFormFields = function(fields) {
    var fieldHTML = '';

    for (var i = 0; i < fields.length; i++) {
        if (fields[i].type === "none") continue;
        var fieldName = fields[i].label.toLowerCase().replace(" ", "_");

        switch (fields[i].type) {
            case "email":
                fieldHTML += '<div class="form__inpt-wrpr form__inpt-wrpr--cmplsry">\
                                       <div class="form__inpt-lbl">' + fields[i].label + '</div>\
                                       <div class="form__inpt-err"></div>\
                                       <input class="form__inpt" name="' + fieldName + '" type="email" placeholder="' + fields[i].placeholder + '">\
                                   </div>';
                break;
            case "date":
                fieldHTML += '<div class="form__inpt-wrpr form__inpt-wrpr--cmplsry form__inpt-date">\
                                       <div class="form__inpt-lbl">' + fields[i].label + '</div>\
                                       <div class="form__inpt-err"></div>\
                                       <input class="form__inpt js-date-picker" name="' + fieldName + '" type="text" placeholder="' + fields[i].placeholder + '">\
                               </div>';
                break;
            case "select":
                fieldHTML += '<div class="form__inpt-wrpr form__inpt-wrpr--cmplsry">\
                                       <div class="form__inpt-lbl">' + fields[i].label + '</div>\
                                       <div class="form__inpt-err"></div>\
                                       <select class="form__slct" name="' + fieldName + '">';

                fieldHTML += '<option value="">Select a Store</option>';

                for (var j = 0; j < fields[i].list.length; j++) {
                    fieldHTML += '<option value="' + fields[i].list[j] + '">' + fields[i].list[j] + '</option>';
                }

                fieldHTML += '</select>\
                           </div>';
                break;
            case "file":
                fieldHTML += '<div class="form__inpt-wrpr form__inpt-wrpr--cmplsry form__inpt-file">\
                                       <div class="form__inpt-lbl">' + fields[i].label + '</div>\
                                       <div class="form__inpt-err"></div>\
                                       <input class="form__inpt js-clm-file" name="' + fieldName + '" type="file" placeholder="' + fields[i].placeholder + '">\
                               </div>';
                break;
            default:
                fieldHTML += '<div class="form__inpt-wrpr form__inpt-wrpr--cmplsry">\
                                       <div class="form__inpt-lbl">' + fields[i].label + '</div>\
                                       <div class="form__inpt-err"></div>\
                                       <input class="form__inpt" name="' + fieldName + '" type="text" placeholder="' + fields[i].placeholder + '">\
                               </div>';
        }

    }

    if (fields[0].type != "none") {
        fieldHTML += '<div class="btn btn--l clms__btn js-clm-sbmt">\
                           SUBMIT CLAIM\
                   </div>';
    }

    return fieldHTML;
}

$doc.on("click", ".js-clm-item-wrpr", function(e) {

    if ($(e.target).parents(".clms__item-form").length > 0) {
        return;
    }

    var isActive = $(this).hasClass("clms__item-wrpr--actv"),
        _this = $(this);
    $(".clms__item-wrpr--actv").removeClass("clms__item-wrpr--actv");
    $(".js-date-picker").datepicker("destroy");

    $(".clms__item-form, .clms__item-msg").slideUp("fast");

    if (!isActive) {
        $(".js-date-picker").datepicker({
            autoHide: true,
            format: 'dd-mm-yyyy'
        });

        _this.addClass("clms__item-wrpr--actv").find(".clms__item-form").slideDown("fast");
    }
});

$doc.on("click", ".js-clm-sbmt", function() {
    var params = [],
        $form = $(this).parents(".js-clm-form"),
        $itemWrapper = $form.parents(".js-clm-item-wrpr");

    $form.find('input,textarea,select').each(function() {
        params[$(this).attr("name")] = $(this).val();
    });

    var request = {
        formType: $form.data("form-type"),
        email: modal.store.profile.email.value,
        redemptionId: params.redemption_id,
        purchaseDate: params.date,
        productPrice: params.price,
        store: params.store
    }

    if (params.hasOwnProperty("invoice_attachment")) {
        request.file = params.invoice_attachment
    }

    if (validateClaimForm(params)) {
        submitClaims(request, request.formType).done(function(obj) {
            $itemWrapper.find(".clms__item-form").slideUp();
            if (obj.Success == 1) {
                $itemWrapper.find(".clms__item-msg").removeClass("clms__item-msg--err").text(obj.Message).slideDown();
            } else if (obj.Success == 0) {
                $itemWrapper.find(".clms__item-msg").addClass("clms__item-msg--err").text(obj.Message).slideDown();
            }
            loadDependencies([modal.state.view], true);
        });
    }
});

$doc.on("focus",".form__inpt", function(){
    $(".form__inpt-wrpr").removeClass("form__inpt-wrpr--err");
});

function validateClaimForm(params) {
    var isValid = true,
        errorMessages = {};

    for(key in params){
        switch (key) {
            case "redemption_id":
                if(!params[key]){
                    errorMessages.redemption_id="Redemption ID is required";
                    isValid = false;
                }
                break;
            case "date":
                    if(!params[key]){
                        errorMessages.date="Purchase date is required";
                        isValid = false;
                    }
                break;
            case "email":
                    if(!params[key]){
                        errorMessages.email="Email id is required";
                        isValid = false;
                    }
                    else if(!MSP.utils.validate.email(params[key])){
                        errorMessages.email="Invalid Email ID";
                        isValid = false;
                    }
                break;
            case "price":
                    if(!params[key]){
                        errorMessages.price="Price is required";
                        isValid = false;
                    }
                    else if(!MSP.utils.validate.number(params[key])){
                        errorMessages.price="Invalid amount";
                        isValid = false;
                    }
                break;
            case "store":
                    if(!params[key]){
                        errorMessages.store="Please select a store";
                        isValid = false;
                    }
                break;
            default:
        }
    }

    //Keeping this for loop seperate so we can esily decouple, these two functions
    for(key in errorMessages){
        $(".form__inpt[name="+key+"]").parents(".form__inpt-wrpr").addClass("form__inpt-wrpr--err").find(".form__inpt-err").text(errorMessages[key]);
    }

    return isValid;
}

function submitClaims(requestParam, requestType) {
    var dfd = $.Deferred(),
        currentDate = new Date(),
        imageUrl = "invoice-" + getCookie("msp_uid") + "-" + currentDate.getTime() + ".png";

    if (requestParam.formType == "MSPCoins" && false) {
        var processDataValue = false,
            contentTypeValue = false;
    } else {
        var processDataValue = true,
            contentTypeValue = 'application/x-www-form-urlencoded; charset=UTF-8';
    }

    if (requestParam.hasOwnProperty("file")) {
        if (!requestParam.file) {
            dfd.resolve({
                "Success": "0",
                "Message": "Please upload invoice!"
            });
        } else {
            uploadImage(imageUrl).done(function(res) {
                requestParam.invoice_url = "https://s3-ap-southeast-1.amazonaws.com/loyality-invoice/" + imageUrl;
                if (res === "success") {
                    submitClaimsAjax(requestParam, contentTypeValue, processDataValue, dfd)
                }
            });
        }
    } else {
        submitClaimsAjax(requestParam, contentTypeValue, processDataValue, dfd)
    }

    return dfd.promise();
}

function isImage(imageName) {
    return (imageName.match(/\.(jpeg|jpg|bmp|png)$/) != null);
}

function uploadImage(imageUrl) {

    var dfd = $.Deferred();

    var formData = new FormData();

    formData.append('key', imageUrl);

    jQuery.each($(".js-clm-file")[0].files, function(i, file) {

        if (file.size > 2 * 1024 * 1024 || !isImage($(".js-clm-file")[0].value)) {
            setTimeout(function() {
                dfd.resolve("failure");
            }, 10);
            alert("Please upload the invoice that is of the format .jpeg or .jpg or .png or .bmp and is less than 2MB in size.");
            return;
        }
        formData.append('file', file);
    });

    if (!formData.has("file")) {
        return;
    }

    formData.append('acl', 'public-read');
    formData.append('Content-Type', 'image/png');
    formData.append('success_action_redirect', 'https://loyality-invoice.s3.amazonaws.com/successful_upload.html');
    formData.append('x-amz-meta-uuid', '14365123651274');
    formData.append('x-amz-server-side-encryption', 'AES256');
    formData.append('X-Amz-Credential', 'AKIAITKQG5QG6CAEFJYA/20201212/ap-southeast-1/s3/aws4_request');
    formData.append('X-Amz-Algorithm', 'AWS4-HMAC-SHA256');
    formData.append('X-Amz-Date', '20201212T000000Z');
    formData.append('x-amz-meta-tag', '');
    formData.append('Policy', 'eyJleHBpcmF0aW9uIjoiMjAyMC0xMi0xMlQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoibG95YWxpdHktaW52b2ljZSJ9LFsic3RhcnRzLXdpdGgiLCIka2V5IiwiaW52b2ljZSJdLHsiYWNsIjoicHVibGljLXJlYWQifSx7InN1Y2Nlc3NfYWN0aW9uX3JlZGlyZWN0IjoiaHR0cDovL2xveWFsaXR5LWludm9pY2UuczMuYW1hem9uYXdzLmNvbS9zdWNjZXNzZnVsX3VwbG9hZC5odG1sIn0sWyJzdGFydHMtd2l0aCIsIiRDb250ZW50LVR5cGUiLCJpbWFnZS9wbmciXSx7IngtYW16LW1ldGEtdXVpZCI6IjE0MzY1MTIzNjUxMjc0In0seyJ4LWFtei1zZXJ2ZXItc2lkZS1lbmNyeXB0aW9uIjoiQUVTMjU2In0sWyJzdGFydHMtd2l0aCIsIiR4LWFtei1tZXRhLXRhZyIsIiJdLHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFJVEtRRzVRRzZDQUVGSllBLzIwMjAxMjEyL2FwLXNvdXRoZWFzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMjAxMjEyVDAwMDAwMFoifV19');
    formData.append('X-Amz-Signature', '35658c6171827e3eda357ec130727af6a6ff3189f76f26743eefe3d598002c81');

    $.ajax({
        url: modal.params.API.INVOICE_UPLOAD,
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: false,
        processData: false,
        complete: function(xhr) {
            if (xhr.status >= 200 && xhr.status < 300)
                dfd.resolve("success");
            else
                dfd.resolve("failure");
        },
        error: function(xhr) {
            dfd.resolve("failure");
        }
    });

    return dfd.promise();
}

function submitClaimsAjax(formData, contentTypeValue, processDataValue, dfd) {
    var API_URL = modal.params.API;

    $.ajax({
        url: API_URL.BASE_URI + API_URL.CLAIM_SUBMIT_API,
        type: 'POST',
        data: formData,
        async: false,
        cache: false,
        contentType: contentTypeValue,
        processData: processDataValue,
        dataType: 'json'
    }).done(function(response) {
        dfd.resolve(response);
    });
}

/* Passbook & Activity Event Handlers */

$doc.on("click", ".js-fltr", function() {
    var currentView = modal.state.view;
    modal.store[currentView].filter.active = $(this).val();
    renderDependencyView();
});

$doc.on("click", ".js-link, .js-load-page", function() {
    var view = $(this).data("view"),
        newView;

    if(modal.state.view==="claims"){
    		try{
    			$(".js-date-picker").datepicker("destroy");
    		}
    		catch(ex){
    			console.warn("Failed to destroy datepicker.")
    		}
    }

    for (var i = 0; i < modal.route.length; i++) {
        if (view === modal.route[i].view) {
            newView = modal.route[i];
        }
    }

    modal.state = newView ? newView : modal.route[0];

    history.pushState(modal.state, "New Tab", modal.state.path);
    loadView();
});

/* Redeem Page */

function calculateArrowPositions() {
    var outerWidth = $(".rdm-item-wrpr").outerWidth(),
        itemCount = $(".rdm-item-wrpr .js-rdm-item").length,
        itemSize = Math.round(outerWidth / itemCount),
        itemHalfSize = Math.round(itemSize / 2),
        arrowHalfSize = Math.round($(".rdm-wdgt__arw").outerWidth() / 2),
        arrowPosition = [itemHalfSize - arrowHalfSize];

    for (var i = 1; i < itemCount; i++) {
        arrowPosition.push(arrowPosition[i - 1] + itemSize);
    }

    modal.store.redeem.meta.arrowPosition = arrowPosition;
}

function selectOffer(offerID) {
    var store = modal.store.redeem,
        slab = store.data[store.meta.current.type];

    var amount = "",
        offerTitle = "";

    for (var i = 0; i < slab.length; i++) {
        if (offerID == slab[i].id) {
            amount = slab[i].amount;
            offerTitle = slab[i].item;
            break;
        }
    }

    store.meta.current.offerID = offerID;
    store.meta.current.offerTitle = offerTitle;
    store.meta.current.offerAmount = amount;

    $(".js-rdm-cb").text(amount);
}

function renderRedeemOptions(slab) {
    var options = "",
        verifiedCB = modal.store.profile.verified_cashback.value;

    for (var i = 0; i < slab.length; i++) {
        var propClass = "";

        if (verifiedCB < slab[i].amount) {
            propClass = "rdm-wdgt__rwrd-item--dsbld";
        } else if (i == 0) {
            propClass = "rdm-wdgt__rwrd-item--actv";
            selectOffer(slab[i].id);
        }

        options += '<div class="rdm-wdgt__rwrd-item js-rdm-optn ' + propClass + '" data-offer-id="' + slab[i].id + '">\
                       <span class="rdm-wdgt__rwrd-val">₹' + slab[i].amount + '</span>\
                       <span class="rdm-wdgt__rwrd-txt">' + slab[i].item.slice(0, slab[i].item.indexOf(" worth")) + '</span>\
                   </div>';
    }

    return options;
}

function renderRedeemWidget(view) {

    var store = modal.store.redeem,
        data = store.data[view],
        offer = store.offers[view];

    store.meta.current.type = view;
    $(".js-wdgt-ttl").text(offer.title);
    $(".js-wdgt-dscrptn").text(offer.description);

    if (view != "bank") {

        $(".js-rdm-optn-wrpr").html(renderRedeemOptions(data));

        if (!store.meta.current.offerID) {
            $(".js-rdm-prcd").addClass("btn--dsbld");
        } else {
            $(".js-rdm-prcd").removeClass("btn--dsbld");
        }

        $(".js-rwrd-wrpr").show();
        $(".js-bnk-wrpr").hide();
    } else {
        //Handle Bank Case Here
    		store.meta.current.offerID = "50";
        store.meta.current.offerTitle = "Bank Transfer";

        $(".js-rwrd-wrpr").hide();
        $(".js-bnk-wrpr").show();

        $(".js-rdm-prcd").removeClass("btn--dsbld");
    }
}

function sendOTP() {
    var dfd = $.Deferred(),
        API_URL = modal.params.API;

    $.ajax({
        url: API_URL.BASE_URI + API_URL.AUTH_API,
        type: "POST",
        dataType: 'json',
        data: {
            "process": "send_otp",
            "mobile_number": modal.store.profile.mobile.value,
            "email": modal.store.profile.email.value
        }
    }).done(function(response) {
        if (response.otp_sent) {
            dfd.resolve(response);
        } else {
            dfd.reject({
                error: 'OTP not sent'
            });
        }
    }).fail(function(xhr, status, error) {
        dfd.reject({
            error: error
        });
    });

    return dfd.promise();
}

function submitOTP(OTP) {
    var dfd = $.Deferred(),
        API_URL = modal.params.API;

    $.ajax({
        url: API_URL.BASE_URI + API_URL.AUTH_API,
        type: "POST",
        dataType: 'json',
        data: {
            "process": "verify_otp",
            "otp": OTP,
            "email": modal.store.profile.email.value
        }
    }).done(function(response) {
        if (!response.error) {
            dfd.resolve(response);
        } else {
            dfd.reject({
                error: 'OTP did not match'
            });
        }
    }).fail(function(xhr, status, error) {
        dfd.reject({
            error: error
        });
    });

    return dfd.promise();
}

function redeemCashback() {
    var dfd = $.Deferred(),
        API_URL = modal.params.API,
        params,
        meta = modal.store.redeem.meta;

    if (meta.current.type === "bank") {
        params = {
            "source": "mobile_pwa",
            "redeem": '50',
            "account_holders_name": meta.bankForm.name.val(),
            "account_number": meta.bankForm.ac_number.val(),
            "amount": meta.bankForm.amount.val(),
            "ifsc_code": meta.bankForm.ifsc.val()
        }
        modal.store.redeem.meta.current.offerAmount = meta.bankForm.amount.val();
    } else {
        params = {
            "source": "mobile_pwa",
            "redeem": meta.current.offerID,
            "valid": "Y",
            "user_action": "1",
            "email": modal.store.profile.email.value
        }
    }

    $.ajax({
        url: API_URL.BASE_URI + API_URL.REDEEM_API,
        data: params,
        dataType: 'json'
    }).done(function(response) {
        if (response.response === "success") {
            dfd.resolve(response);
        } else {
            dfd.reject({
                error: 'OTP did not match'
            });
        }
    }).fail(function(xhr, status, error) {
        dfd.reject({
            error: error
        });
    });

    return dfd.promise();
}

var showError = function($node, message) {
    $node.parents(".inpt-wrpr").addClass("inpt-wrpr--err").find(".inpt-err").text(message);
}

function validateFormData() {
    var bankForm = {
            "ac_number": $(".js-bnk-num"),
            "name": $(".js-bnk-name"),
            "ifsc": $(".js-bnk-ifsc"),
            "amount": $(".js-bnk-amt")
        },
        isValid = true;

    if (!bankForm.name.val()) {
        isValid = false;
        showError(bankForm.name, "Account holder's name is required");
    }
    if (!bankForm.ac_number.val()) {
        isValid = false;
        showError(bankForm.ac_number, "Account Number is required");
    }
    if (!bankForm.amount.val()) {
        isValid = false;
        showError(bankForm.amount, "Withdrawl amount is required");
    }
    else if (bankForm.amount.val()<200) {
    		isValid = false;
        showError(bankForm.amount, "Minimum withdrawl amount is Rs.200");
    }
    else if(bankForm.amount.val()>modal.store.profile.verified_cashback.value){
    		isValid = false;
        showError(bankForm.amount, "Insufficient Cashback");
    }
    if (!(/^[A-Za-z]{4}\d{7}$/.test(bankForm.ifsc.val()))) {
        isValid = false;
        showError(bankForm.ifsc, "Invalid IFSC Code");
    }

    modal.store.redeem.meta.bankForm = bankForm;
    return isValid;
}

$doc.on("click", ".js-rdm-optn", function() {
    if (!$(this).hasClass("rdm-wdgt__rwrd-item--dsbld")) {
        $(".js-rdm-optn").removeClass("rdm-wdgt__rwrd-item--actv");
        $(this).addClass("rdm-wdgt__rwrd-item--actv");
        selectOffer($(this).data("offer-id"));
    }
});

$doc.on("click", ".js-rdm-item", function() {
    var redemptionType = $(this).data("type"),
        index = $(this).index();

    if (!$(".rdm-wdgt").is(":visible")) {
        $(".rdm-wdgt").slideDown();
        calculateArrowPositions();
    } else if (!$(".js-rdm-stp-1").is(":visible")) {
        $(".js-rdm-stp-2, .js-rdm-stp-3").fadeOut("fast", function() {
            $(".js-rdm-stp-1").fadeIn("fast");
        });
    }

    renderRedeemWidget(redemptionType);

    $(".rdm-wdgt__arw").css("left", modal.store.redeem.meta.arrowPosition[index]);
});

$doc.on("click", ".js-rdm-prcd", function() {
    if ($(this).hasClass("btn--dsbld") || (modal.store.redeem.meta.current.type === "bank" && !validateFormData())) {
        return;
    }
    var mobile = modal.store.profile.mobile.value;

    if (mobile) {
        $(this).addClass("btn--ldng");
        sendOTP().done(function(response) {
            $(".js-rdm-prcd").removeClass("btn--ldng");
            $(".js-rdm-stp-1").fadeOut("fast", function() {
                $(".js-rdm-stp-2").fadeIn("fast");
                $(".js-mob-vrfy-wrpr").hide();
                $(".js-otp-vrfy-wrpr").show();

                $(".js-user-mob").text(mobile);
            });
        }).fail(function(response) {
            $(".js-rdm-prcd").removeClass("btn--ldng");
        });
    } else {
        $(".js-rdm-stp-1").fadeOut("fast", function() {
            $(".js-rdm-stp-2").fadeIn("fast");
            $(".js-mob-vrfy-wrpr").show();
            $(".js-mob-vrfy-wrpr").hide();
        });
    }
});

$doc.on("click", ".js-rdm-submt-otp", function() {
    if ($(this).hasClass("btn--dsbld")) return;
    $(this).addClass("btn--ldng");

    submitOTP($(".js-otp-inpt").val()).then(redeemCashback,
            function() {
    				return $.Deferred().reject(new Error("OTP Verification Failed"));
            })
        .then(function() {
                $(".js-rdm-stp-2").fadeOut("fast", function() {
                    $(".js-rdm-stp-3").fadeIn();
                    $(".js-rdm-item-name").text(modal.store.redeem.meta.current.offerTitle);
                    $(".js-user-email").text(modal.store.profile.email.value);
                    $(".rdm-wdgt .btn--ldng").removeClass("btn--ldng");
                    $(".rdm-wdgt input").val("");
                    loadDependencies(["profile"], true);
                });
            },
            function() {
                $(".js-otp-msg").text("OTP Verfification Failed").addClass("txt--red").fadeIn("fast", function() {
                    setTimeout(function() {
                        $(".js-otp-msg").fadeOut();
                    }, 2000);
                });

                $(".js-rdm-submt-otp").removeClass("btn--ldng");
            });
});

$doc.on("click", ".js-resend-otp", function() {
    $(".js-otp-msg").removeClass("txt--grn txt--red").text("Sending OTP Again").fadeIn();

    sendOTP().done(function(response) {
        $(".js-otp-msg").fadeOut("fast", function() {
            $(".js-otp-msg").addClass("txt--grn").text("OTP Sent!").fadeIn("fast");
        });

        setTimeout(function() {
            $(".js-otp-msg").fadeOut();
        }, 3000);
    });
});

$doc.on("keyup", ".js-otp-inpt", function() {
    if ($(this).val().length > 5) {
        $(this).blur();
        $(".js-rdm-submt-otp").removeClass("btn--dsbld");
    } else {
        $(".js-rdm-submt-otp").addClass("btn--dsbld");
    }
});

$doc.on("keyup", ".js-mob-inpt", function() {
    if ($(this).val().length > 9) {
        $(this).blur();
        $(".js-rdm-send-otp").removeClass("btn--dsbld");
    } else {
        $(".js-rdm-send-otp").addClass("btn--dsbld");
    }
});


window.onpopstate = function(event) {
	if(!$.isEmptyObject(event.state)){
		modal.state = event.state;
	}
	else{
		modal.state = modal.route[0];
	}
	console.log("Pop State Called");
	loadView();
}

/* Some Hacks */

$win.on("blur",function(){
    $(".dummy").focus();
});

/* Generic */
$doc.on("focus", ".inpt", function() {
    $(this).parents(".inpt-wrpr").addClass("inpt-wrpr--focus").parents("form").find(".inpt-wrpr").removeClass("inpt-wrpr--err").find(".inpt-err").text("");
}).on("blur", ".inpt", function() {
    $(this).parents(".inpt-wrpr").removeClass("inpt-wrpr--focus");

    if ($(this).val()) {
        $(this).parents(".inpt-wrpr").find(".inpt-lbl").addClass("inpt-lbl--vsbl");
    }
});

$doc.on("click", ".js-acdrn", function() {
    $(this).siblings(".acrdn__answr").slideToggle("fast");
    $(this).toggleClass("acrdn__qstn--expnd");
});


function tryParse(JSONString){
    try{
        return JSON.parse(JSONString);
    }
    catch (ex){
        return {
            "error": "Invalid JSON String"
        }
    }
}

function login(){
    var signupPage = "https://www.mysmartprice.com/users/",
        windowParams = "?ref=bonusapp&destUrl=" + encodeURIComponent(window.location.href);

    window.location.href = signupPage + windowParams;
}

$doc.on("click",".js-intrnl-link", function(){
	var hashObj = {};
	hashObj.scrollTo = $(this).data("href");

    if (generateHash(hashObj) != window.location.hash) {
//        window.location.hash = generateHash(hashObj);
    }

    scrollToLink(hashObj);
    return false;
});

function generateHash(params) {
    var hash = "#",
        index = 0;
    $.each(params, function(key) {
        var value, prefix;
        if (params[key]) {
            prefix = index ? "&" : "";
            value = key === "property" && $.isArray(params[key]) ? params[key].join("|") : params[key];
            hash += prefix + key + "=" + value;
        }
        index++;
    });
    return hash;
}

function scrollToLink(hashObj, onLoad) {
    var finalScrollPos = Math.ceil($('[data-id="' + hashObj.scrollTo + '"]').offset().top);

    if (onLoad) {
        $("body").scrollTop(finalScrollPos);
        return;
    }

    if (hashObj && hashObj.scrollTo && $('[data-id="' + hashObj.scrollTo + '"]').length) {
        var $roots = $("html, body");

        $roots.on("scroll.inpageLink mousedown.inpageLink wheel.inpageLink DOMMouseScroll.inpageLink mousewheel.inpageLink keyup.inpageLink touchmove.inpageLink", function() {
            $roots.stop();
        });

        $roots.animate({ "scrollTop": finalScrollPos }, "slow", function() {
            $roots.off("scroll.inpageLink mousedown.inpageLink wheel.inpageLink DOMMouseScroll.inpageLink mousewheel.inpageLink keyup.inpageLink touchmove.inpageLink");
        });
    }
};
