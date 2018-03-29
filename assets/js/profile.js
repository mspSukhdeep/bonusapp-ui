/* Passbook & Activity Detail functions */

var modal = {
    "state": {},
    "params": {
        "$container": $(".js-tab-cntnr"),
        "pageViewMap": {
            "passbook": "/profile",
            "activity": "/profile/track",
            "claims": "/",
            "how-it-works": "/profile/how-it-works",
            "faq": "/profile/faq",
            "contact": "/profile/contact",
            "redeem": "/profile/redeem"
        },
        "resourceURL": {
            "passbook": "https://www.bonusapp.in/me/page_info.php?function=passbook&format=2&page=1",
            "activity": "https://www.bonusapp.in/me/page_info.php?function=activity_details&format=2&page=1",
            "profile": "https://www.bonusapp.in/me/page_info.php?function=profile&format=2&page=1",
            "claims": "claims.html",
            "how-it-works": "/profile/how-it-works.html",
            "faq": "/profile/faq.html",
            "contact": "/profile/contact.html",
            "redeem": "/profile/redeem.html",
            "redemptionSlab": "https://www.bonusapp.in/me/page_info.php?function=redemption_slabs&format=2&page=1",
            "AUTH_API": "https://www.bonusapp.in/users/mobile_number_auth.php",
            "REDEEM_API": "https://www.bonusapp.in/m/me/redeem_process.php"
        },
        "defaultState": {
            "view": "redeem",
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
        "redemption": {
            "slab": {

            },
            "meta": {
                "current": {
                    "type": "",
                    "offerID": "",
                    "offerTitle": ""
                },
                "stores": {
                    "paytm": {
                        "title": "Transfer cashback to Paytm account",
                        "description": "Paytm is one of the biggest recharge site in India that delivers instant online prepaid recharge & mobile bill payment solutions to end users."
                    },
                    "amazon": {
                        "title": "Redeem cashback as Amazon Gift Card",
                        "description": "Amazon is one of the biggest ecom site in India that delivers instant product. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    },
                    "flipkart": {
                        "title": "Redeem cashback as Flipkart Gift Voucher",
                        "description": "Flipkart is one of the biggest ecom site in India that delivers instant product. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                    },
                    "bank": {
                        "title": "Transfer cashback to your Bank account",
                        "description": "We will transfer money to your Bank account via NEFT/RTGS. It might take 2-4 working days for the amount to reflect in your account."
                    }
                },
                "identifiers": {
                    "widget": ".rdm-wdgt",
                    "itemWrapper": ".rdm-item-wrpr",
                    "item": ".rdm-item-wrpr .rdm-item",
                    "arrow": ".rdm-wdgt__arw",
                    "option": ".js-rdm-optn",
                    "optionWrapper": ".js-rdm-optn-wrpr",
                    "widgetTitle": ".js-wdgt-ttl",
                    "widgetDescription": ".js-wdgt-dscrptn",
                    "deductableCB": ".js-rdm-cb",
                    "proceedButton": ".js-rdm-prcd",
                    "submitOTPButton": ".js-rdm-submt-otp",
                    "firstView": ".js-rdm-stp-1",
                    "secondView": ".js-rdm-stp-2",
                    "thirdView": ".js-rdm-stp-3",
                    "OTPInput": ".js-otp-inpt",
                    "OTPFailMsg": ".js-otp-fail"
                },
                "arrowPosition": []
            }
        }
    }
};

var redeemCashback = function() {
    var dfd = $.Deferred(),
        params,
        meta = modal.store.redemption.meta;
        
    if(meta.current.type==="bank"){
        params = {
            "source": "mobile_pwa",
            "redeem": '50',
            "account_holders_name": meta.bankForm.name.val(),
            "account_number": meta.bankForm.ac_number.val(),
            "amount": meta.bankForm.amount.val(),
            "ifsc_code": meta.bankForm.ifsc.val()
        }
    }
    else{
        params = {
            "source": "mobile_pwa",
            "redeem": meta.current.offerID,
            "valid": "Y",
            "user_action": "1",
            "email": modal.store.profile.email.value
        }
    }

    $.ajax({
        url: modal.params.resourceURL.REDEEM_API,
        data: params
    }).done(function(response) {
        if (response == "success") {
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

var submitOTP = function(OTP) {
    var dfd = $.Deferred();

    $.ajax({
        url: modal.params.resourceURL.AUTH_API,
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

var sendOTP = function() {
    var dfd = $.Deferred();

    $.ajax({
        url: modal.params.resourceURL.AUTH_API,
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

var selectOffer = function(offerID) {
    var rStore = modal.store.redemption,
        slab = rStore.slab[rStore.meta.current.type],
        selector = rStore.meta.identifiers;

    var amount = "",
        offerTitle = "";

    for (var i = 0; i < slab.length; i++) {
        if (offerID == slab[i].id) {
            amount = slab[i].amount;
            offerTitle = slab[i].item;
            break;
        }
    }

    rStore.meta.current.offerID = offerID;
    rStore.meta.current.offerTitle = offerTitle;

    $(selector.deductableCB).text(amount);
}

var showError = function($node, message){
    $node.parents(".inpt-wrpr").addClass("inpt-wrpr--err").find(".inpt-err").text(message);
}

var validateFormData = function() {
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
    if (!(/^[A-Za-z]{4}\d{7}$/.test(bankForm.ifsc.val()))) {
        isValid = false;
        showError(bankForm.ifsc, "Invalid IFSC Code");
    }

    modal.store.redemption.meta.bankForm = bankForm;
    return isValid;
}
var renderRedeemOptions = function(slab, meta) {
    var options = "",
        verifiedCB = modal.store.profile.pending_cashback.value;

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

var renderRedeemWidget = function(view) {

    var rStore = modal.store.redemption,
        slab = rStore.slab[view],
        meta = rStore.meta.stores[view],
        selector = rStore.meta.identifiers;

    rStore.meta.current.type = view;
    $(selector.widgetTitle).text(meta.title);
    $(selector.widgetDescription).text(meta.description);

    if (view != "bank") {

        $(selector.optionWrapper).html(renderRedeemOptions(slab, meta));

        if (!rStore.meta.current.offerID) {
            $(selector.proceedButton).addClass("btn--dsbld");
        }
    } else {
        //Handle Bank Case Here

    }
}

var calculateArrowPositions = function() {
    var selector = modal.store.redemption.meta.identifiers,
        outerWidth = $(selector.itemWrapper).outerWidth(),
        itemCount = $(selector.item).length,
        itemSize = Math.round(outerWidth / itemCount),
        itemHalfSize = Math.round(itemSize / 2),
        arrowHalfSize = Math.round($(selector.arrow).outerWidth() / 2),
        arrowPosition = [itemHalfSize - arrowHalfSize];

    for (var i = 1; i < itemCount; i++) {
        arrowPosition.push(arrowPosition[i - 1] + itemSize);
    }

    modal.store.redemption.meta.arrowPosition = arrowPosition;
}

var renderRedeemPage = function(response) {

    fetchPage(modal.params.resourceURL.redemptionSlab).done(function(response) {
        response = $.parseJSON(response);
        modal.store.redemption.slab = response.redemption_slabs;
    });

    modal.state.viewHTML = response;
}

var setProfileData = function(profile) {
    var mProfile = modal.store.profile;
    mProfile.name.value = profile.name || modal.store.profile.name.value;
    mProfile.email.value = profile.email || modal.store.profile.email.value;
    mProfile.mobile.value = profile.mobile || modal.store.profile.mobile.value;
    mProfile.pending_cashback.value = profile.pending_cashback || modal.store.profile.pending_cashback.value;
    mProfile.verified_cashback.value = profile.verified_cashback || modal.store.profile.verified_cashback.value;
    mProfile.image.value = profile.image || modal.store.profile.image.value;
}

var renderProfileSection = function() {
    var profile = modal.store.profile;

    for (key in profile) {
        if (key === "image") {
            $(profile[key].className).attr("src", profile[key].value);
        } else {
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

(function redemptionEvents() {
    var selector = modal.store.redemption.meta.identifiers;

    $doc.on("click", selector.item, function() {
        var redemptionType = $(this).data("type"),
            index = $(this).index();
        rMeta = modal.store.redemption.meta;

        if (!$(rMeta.identifiers.widget).is(":visible")) {
            $(rMeta.identifiers.widget).slideDown();
            calculateArrowPositions();
        } else if (!$(selector.firstView).is(":visible")) {
            $(selector.secondView + ", " + selector.thirdView).fadeOut("fast", function() {
                $(selector.firstView).fadeIn("fast");
            });
        }

        renderRedeemWidget(redemptionType);

        $(rMeta.identifiers.arrow).css("left", rMeta.arrowPosition[index]);
    });

    $doc.on("click", selector.option, function() {
        if (!$(this).hasClass("rdm-wdgt__rwrd-item--dsbld")) {
            $(selector.option).removeClass("rdm-wdgt__rwrd-item--actv");
            $(this).addClass("rdm-wdgt__rwrd-item--actv");
            selectOffer($(this).data("offer-id"));
        }
    });

    $doc.on("click", selector.proceedButton, function() {
        if ($(this).hasClass("btn--dsbld") || (modal.store.redemption.meta.current.type === "bank" && !validateFormData())) {
            return;
        }

        $(this).addClass("btn--ldng");
        sendOTP().done(function(response) {
            $(selector.firstView).fadeOut("fast", function() {
                $(selector.secondView).fadeIn("fast");
                $(".js-user-mob").text(modal.store.profile.mobile.value);
            });
        }).fail(function(response) {
            $(selector.proceedButton).removeClass("btn--ldng");
        })
    });

    $doc.on("click", ".js-resend-otp", function() {
        sendOTP();
    });

    $doc.on("keyup", selector.OTPInput, function() {
        if ($(this).val().length>5) {
            $(this).blur();
            $(selector.submitOTPButton).removeClass("btn--dsbld");
        } else {
            $(selector.submitOTPButton).addClass("btn--dsbld");
        }
    });

    $doc.on("click", selector.submitOTPButton, function() {
        if ($(this).hasClass("btn--dsbld")) return;
        $(this).addClass("btn--ldng");

        submitOTP($(selector.OTPInput).val()).then(redeemCashback,
                function() {
                    throw new Error("OTP Verification Failed");
                })
            .then(function() {
                    console.log("All Success");
                    $(selector.secondView).fadeOut("fast", function() {
                        $(selector.thirdView).fadeIn();
                        $(".js-rdm-item-name").text(modal.store.redemption.meta.current.offerTitle);
                        $(".js-user-email").text(modal.store.profile.email.value);
                    });
                },
                function() {
                    console.log("Failure at last");
                    $(selector.OTPFailMsg).slideDown(function() {
                        setTimeout(function() {
                            $(selector.OTPFailMsg).slideUp();
                        }, 2000);
                    });
                    $(selector.submitOTPButton).removeClass("btn--ldng");
                });
    });

})();



/* Generic Functions - to be moved to common file */
$doc.on("click", ".js-acdrn", function() {
    $(this).find(".acrdn__answr").slideToggle("fast");
    $(this).find(".acrdn__qstn").toggleClass("acrdn__qstn--expnd");
});


$doc.on("focus", ".inpt", function() {
    $(this).parents(".inpt-wrpr").addClass("inpt-wrpr--focus").parents("form").find(".inpt-wrpr").removeClass("inpt-wrpr--err").find(".inpt-err").text("");
}).on("blur", ".inpt", function() {
    $(this).parents(".inpt-wrpr").removeClass("inpt-wrpr--focus");

    if ($(this).val()) {
        $(this).parents(".inpt-wrpr").find(".inpt-lbl").addClass("inpt-lbl--vsbl");
    }
});
