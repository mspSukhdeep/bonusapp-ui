/* Passbook & Activity Detail functions */

var modal = {
    "state": {},
    "params": {
        "$container": $(".js-tab-cntnr"),
        "pageViewMap": {
            "passbook": "/profile",
            "activity": "/profile/track",
            "claims": "/profile/claims",
            "how-it-works": "/profile/how-it-works",
            "faq": "/profile/faq",
            "contact": "/profile/contact",
            "redeem": "/profile/redeem"
        },
        "resourceURL": {
            "passbook": "https://www.bonusapp.in/me/page_info.php?function=passbook&format=2&page=1",
            "activity": "https://www.bonusapp.in/me/page_info.php?function=activity_details&format=2&page=1",
            "profile": "https://www.bonusapp.in/me/page_info.php?function=profile&format=2&page=1",
            "claims": "/profile/claims.html",
            "how-it-works": "/profile/how-it-works.html",
            "faq": "/profile/faq.html",
            "contact": "/profile/contact.html",
            "redeem": "/profile/redeem.html",
            "redemptionSlab": "https://www.bonusapp.in/me/page_info.php?function=redemption_slabs&format=2&page=1",
        },
        "defaultState": {
            "view": "passbook",
            "subView": "tracked_purchases",
            "require": [
                "profile"
            ]
        },
        "$loader": "<div class='ldr'>\
                        <img class='ldr__img' src='https://assets.mspcdn.net/bonus_in/icon/rolling_grn.svg' />\
                    <div>"
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
            }
        },
        "passbook": {
            "title": "Cashback Passbook",
            "data": [],
            "filters": {
                "className": "js-fltr",
                "data": ["all", "confirmed", "redeemed", "expired"],
                "active": ""
            },
            "columns": [{
                    "name": "date",
                    "className": "prfl-tbl__date"
                },
                {
                    "name": "entry",
                    "className": "prfl-tbl__entry"
                },
                {
                    "name": "cashback",
                    "className": "prfl-tbl__cb"
                },
                {
                    "name": "Expiry Date",
                    "className": "prfl-tbl__exp-date"
                }
            ]
        },
        "activity": {
            "title": "Purchase Tracking",
            "data": [],
            "filters": {
                "data": ["Tracked Purchases", "Click History"],
                "className": "js-chng-view",
                "active": ""
            },
            "columns": {
                "tracked_purchases": [{
                        "name": "Date",
                        "className": "prfl-tbl__date prfl-tbl__date--l"
                    },
                    {
                        "name": "Store",
                        "className": "prfl-tbl__entry prfl-tbl__entry--l"
                    },
                    {
                        "name": "Cashback",
                        "className": "prfl-tbl__cb"
                    }
                ],
                "click_history": [{
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
            }
        },
        "redemptionSlab":{

        }
    }
};

var renderRedeemPage = function(response){

    fetchPage(modal.params.resourceURL.redemptionSlab).done(function(response) {
        response = $.parseJSON(response);
        modal.store.redemptionSlab = response.redemption_slabs;
        console.log(modal.store);
    });

    modal.state.viewHTML = response;
}

var setProfileData = function(profile){
    modal.store.profile.name.value = profile.name || modal.store.profile.name.value;
    modal.store.profile.email.value = profile.email || modal.store.profile.email.value;
    modal.store.profile.mobile.value = profile.mobile || modal.store.profile.mobile.value;
    modal.store.profile.pending_cashback.value = profile.pending_cashback  || modal.store.profile.pending_cashback.value;
    modal.store.profile.verified_cashback.value = profile.verified_cashback || modal.store.profile.verified_cashback.value;
    modal.store.profile.image.value = profile.image || modal.store.profile.image.value;
}

var renderProfileSection = function(){
    var profile = modal.store.profile;

    for(key in profile){
        if(key==="image"){
            $(profile[key].className).attr("src", profile[key].value);
        }
        else{
            $(profile[key].className).text(profile[key].value);
        }
    }
}

var getFilters = function(filters, name) {
    var filterDOM = "";
    for (var i = 0; i < filters.data.length; i++) {
        var escapedName = name.toLowerCase().replace(" ", "_"),
            escapedValue = filters.data[i].toLowerCase().replace(" ", "_"),
            filterID = escapedName + '_' + i,
            checked = "",
            activeFilter = modal.store[modal.state.view].filters.active;

        if (activeFilter) {
            if (escapedValue == activeFilter) {
                checked = "checked"
            }
        } else {
            checked = (i == 0) ? "checked" : "";
        }

        filterDOM += '<div class="rdio-grp">\
							<input type="radio" class="rdio ' + filters.className + '" value="' + escapedValue + '" name="' + escapedName + '" id="' + filterID + '" ' + checked + '>\
							<label for="' + filterID + '">' + filters.data[i] + '</label>\
					</div>';
    }

    return filterDOM;
}

var getTableRows = function(storeData) {
    var rows = "",
        activeFilter = modal.store[modal.state.view].filters.active;

    if (modal.state.view === "passbook") {
        for (var i = 0; i < storeData.length; i++) {

            if (activeFilter && (storeData[i].type != activeFilter && "all" != activeFilter)) continue;

            var cashback = storeData[i].cashback > 0 ? ("₹" + storeData[i].cashback) : ("-₹" + Math.abs(storeData[i].cashback)),
                cashbackClass = storeData[i].cashback > 0 ? "prfl-tbl__cb txt--grn" : "prfl-tbl__cb txt--red",
                expiry = storeData[i].expiry_date || "<center>-</center>",
                entry = storeData[i].type,
                description = "";

            if (storeData[i].info) {
                entry = storeData[i].info.store || storeData[i].info.redeem || storeData[i].type;
                description = storeData[i].info.product_price ? "<div class='prfl-tbl__dscrptn'>Purchase Amount: <span class='txt--bold'>₹" + storeData[i].info.product_price + "</span></div>" : "";
            }

            rows += '<div class="prfl-tbl__row clearfix">\
                        <div class="prfl-tbl__date">' + storeData[i].date + '</div>\
                        <div class="prfl-tbl__entry">\
                            ' + entry + '\
                            ' + description + '\
                        </div>\
                        <div class="' + cashbackClass + '">' + cashback + '</div>\
                        <div class="prfl-tbl__exp-date">' + expiry + '</div>\
                    </div>';
        }
    } else if (modal.state.view === "activity") {
        if (modal.state.subView === "tracked_purchases") {
            for (var i = 0; i < storeData.length; i++) {

                var columns = modal.store.activity.columns[modal.state.subView],
                    cashback = storeData[i].cashback > 0 ? ("₹" + storeData[i].cashback) : ("-₹" + Math.abs(storeData[i].cashback)),
                    entry = storeData[i].info.store;

                rows += '<div class="prfl-tbl__row clearfix">\
                            <div class="' + columns[0].className + '">' + storeData[i].date + '</div>\
                            <div class="' + columns[1].className + '">\
                                ' + entry + '\
                            </div>\
                            <div class="' + columns[2].className + '">' + cashback + '</div>\
                        </div>';
            }
        } else if (modal.state.subView === "click_history") {
            for (var i = 0; i < storeData.length; i++) {

                var columns = modal.store.activity.columns[modal.state.subView],
                    entry = storeData[i].info.store,
                    clickCount = storeData[i].click_count > 1 ? (storeData[i].click_count + " Clicks") : (storeData[i].click_count + " Click");

                rows += '<div class="prfl-tbl__row clearfix">\
                            <div class="' + columns[0].className + '">' + storeData[i].date + '</div>\
                            <div class="' + columns[1].className + '">\
                                ' + entry + '\
                            </div>\
                            <div class="' + columns[2].className + '">' + clickCount + '</div>\
                        </div>';
            }
        }
    }
    return rows;
}

var getTableHeader = function(columns) {
    var header = "";

    for (var i = 0; i < columns.length; i++) {
        header += '<div class="' + columns[i].className + '">' + columns[i].name + '</div>';
    }

    return header;
}

var getTableTemplate = function(store) {
    var $radioGroup = getFilters(store.filters, store.title),
        rowData = [],
        columns = [];

    if (modal.state.view === "passbook") {
        rowData = store.data;
        columns = store.columns;
    } else if (modal.state.view === "activity") {
        rowData = store[modal.state.subView];
        columns = store.columns[modal.state.subView];
    }

    $tableHeader = getTableHeader(columns);
    $tableRows = getTableRows(rowData);

    return '<div class="prfl-sctn">\
                <div class="clearfix">\
    				<div class="prfl-sctn__ttl">' + store.title + '</div>\
    				<div class="prfl-sctn__fltrs clearfix">\
    					' + $radioGroup + '\
    				</div>\
    			</div>\
    			<div class="prfl-tbl">\
    				<div class="prfl-tbl__hd clearfix">\
    					' + $tableHeader + '\
    				</div>\
    				<div class="prfl-tbl__body">\
                    ' + $tableRows + '\
    				</div>\
    			</div>\
            </div>';
}

window.onpopstate = function(event) {

    if (event.state) {
        modal.state = event.state;
    } else {
        modal.state = modal.params.defaultState;
    }
    renderView();
}

var fetchPage = MSP.utils.memoize(function(resourceURL) {
    var dfd = $.Deferred(),
        _page = fetchPage;

    // if (_page.XHR) _page.XHR.abort();

    _page.XHR = $.ajax({
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
    "cacheLimit": 10
});

function renderView() {
    switch (modal.state.view) {
        case "passbook":
            var $tableData = getTableTemplate(modal.store[modal.state.view]);
            modal.params.$container.html($tableData);
            break;
        case "activity":
            var $tableData = getTableTemplate(modal.store[modal.state.view]);
            modal.params.$container.html($tableData);
            break;
        default:
            modal.params.$container.html(modal.state.viewHTML);
    }
}

function loadView() {
    modal.params.$container.html(modal.params.$loader);

    var viewsToLoad = modal.state.require.slice();
    viewsToLoad.push(modal.state.view);

    viewsToLoad.forEach(function(view) {
        fetchPage(modal.params.resourceURL[view]).done(function(response) {
            switch (view) {
                case "passbook":
                    response = $.parseJSON(response);
                    modal.store.passbook.data = response.passbook;
                    break;
                case "activity":
                    response = $.parseJSON(response);
                    modal.store.activity.tracked_purchases = response.tracked_purchases;
                    modal.store.activity.click_history = response.click_history;
                    break;
                case "profile":
                    response = $.parseJSON(response);
                    setProfileData(response);
                    renderProfileSection();

                    var requireIndex = modal.state.require.indexOf(view);
                    (requireIndex > -1) && modal.state.require.splice(requireIndex, 1);
                    break;
                case "redeem":
                    renderRedeemPage(response);
                default:
                    modal.state.viewHTML = response;
            }
            renderView();
        });
    });
}

function init() {
    modal.state = modal.params.defaultState;
    renderProfileSection();
    loadView();
}

init();

$doc.on("click", ".js-fltr", function() {
    modal.store[modal.state.view].filters.active = $(this).val();
    renderView();
});

$doc.on("click", ".js-chng-view", function() {
    modal.state.subView = $(this).val();
    modal.store[modal.state.view].filters.active = $(this).val();
    renderView();
});

$doc.on("click", ".js-link, .js-load-page", function() {
    var view = $(this).data("view");
    $(".list-item--actv").removeClass("list-item--actv");

    if (!$(this).hasClass("btn")) {
        $(this).addClass("list-item--actv");
    }

    modal.state.view = view;
    history.pushState(modal.state, "New Tab", modal.params.pageViewMap[view]);
    loadView();
});

$doc.on("click",".js-rdm-item", function(){
    var redemptionType = $(this).data("type");

    
});

/* Generic Functions - to be moved to common file */
$doc.on("click", ".js-acdrn", function() {
    $(this).find(".acrdn__answr").slideToggle("fast");
    $(this).find(".acrdn__qstn").toggleClass("acrdn__qstn--expnd");
});
