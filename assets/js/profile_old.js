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
             "claimHistory": "https://www.bonusapp.in/me/page_info.php?function=claims_issues&format=2&page=1",
             "how-it-works": "/profile/how-it-works.html",
             "faq": "/profile/faq.html",
             "contact": "/profile/contact.html",
             "redeem": "/profile/redeem.html",
             "redemptionSlab": "https://www.bonusapp.in/me/page_info.php?function=redemption_slabs&format=2&page=1",
             "AUTH_API": "https://www.bonusapp.in/users/mobile_number_auth.php",
             "REDEEM_API": "https://www.bonusapp.in/m/me/redeem_process.php",
             "submitClaim": "https://www.bonusapp.in/me/claims_issues_help.php"
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
                     "bankWrapper": ".js-bnk-wrpr",
                     "rewardWrapper": ".js-rwrd-wrpr",
                     "optionWrapper": ".js-rdm-optn-wrpr",
                     "mobileVerification": ".js-mob-vrfy-wrpr",
                     "OTPVerification": ".js-otp-vrfy-wrpr",
                     "widgetTitle": ".js-wdgt-ttl",
                     "widgetDescription": ".js-wdgt-dscrptn",
                     "deductableCB": ".js-rdm-cb",
                     "proceedButton": ".js-rdm-prcd",
                     "submitOTPButton": ".js-rdm-submt-otp",
                     "firstView": ".js-rdm-stp-1",
                     "secondView": ".js-rdm-stp-2",
                     "thirdView": ".js-rdm-stp-3",
                     "OTPInput": ".js-otp-inpt",
                     "OTPFailMsg": ".js-otp-fail",
                     "mobInput": ".js-mob-inpt",
                     "sendOTPButton": ".js-rdm-send-otp"
                 },
                 "arrowPosition": []
             }
         },
         "claims": {
             "title": "Claims History",
             "data": [{
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
             "history": [],
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
             "meta": {
                 "identifiers": {
                     "item": ".clms__item-wrpr",
                     "form": ".js-clm-form",
                     "formWrapper": ".clms__item-form",
                     "submitButton": ".js-clm-sbmt",
                     "claimFormWrapper": ".js-clm-frm-wrpr",
                     "tableWrapper": ".js-clm-tbl-wrpr",
                     "messageWrapper": ".clms__item-scs"
                 },
                 "formData": {}
             }
         }
     }
 };

 var validateClaimForm = function() {
     return true;
 }

 var isImage = function(imageName) {
     return (imageName.match(/\.(jpeg|jpg|bmp|png)$/) != null);
 }

 var uploadImage = function(imageUrl) {

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
         url: 'https://loyality-invoice.s3.amazonaws.com/',
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

 var submitClaimsAjax = function(formData, contentTypeValue, processDataValue, dfd) {
     $.ajax({
         url: modal.params.resourceURL.submitClaim,
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

 var submitClaims = function(requestParam, requestType) {
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
 };

 (function() {
     //Claim Page Event Handlers
     var selector = modal.store.claims.meta.identifiers;

     $doc.on("click", selector.submitButton, function() {
         var params = [],
             $form = $(this).parents(selector.form),
             $itemWrapper = $form.parents(selector.item);

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

         if (validateClaimForm()) {
             submitClaims(request, request.formType).done(function(obj) {
                 $itemWrapper.find(selector.formWrapper).slideUp();
                 if (obj.Success == 1) {
                     $itemWrapper.find(".clms__item-scs").text(obj.Message).slideDown();
                 } else if (obj.Success == 0) {
                     $itemWrapper.find(".clms__item-scs").text(obj.Message).slideDown();
                 }
             });
         }
     });

     $doc.on("click", selector.item, function(e) {

         if ($(e.target).parents(selector.formWrapper).length > 0) {
             return;
         }

         var isActive = $(this).hasClass("clms__item-wrpr--actv"),
             _this = $(this);
         $(".clms__item-wrpr--actv").removeClass("clms__item-wrpr--actv");
         $(".js-date-picker").datepicker("destroy");

         $(selector.formWrapper + ', ' + selector.messageWrapper).slideUp("fast");
         if (!isActive) {
             $(".js-date-picker").datepicker({
                 autoHide: true,
                 format: 'dd-mm-yyyy'
             });

             _this.addClass("clms__item-wrpr--actv").find(selector.formWrapper).slideDown("fast");
         }
     });

 }());

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

 var renderClaimHistory = function() {
     var $tableData = getTableTemplate(modal.store[modal.state.view]);
     $(modal.store.claims.meta.identifiers.tableWrapper).html($tableData);
 }

 var renderClaimForm = function() {
     var data = modal.store.claims.data,
         form = '';

     for (var i = 0; i < data.length; i++) {
         form += '<div class="clms__item-wrpr ripple ripple--l" data-id="' + data[i].id + '">\
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
                    <div class="clms__item-scs">\
                        Your claim was sucessfully submitted. We’ll get back to you on this within 5 working days.\
                    </div>\
                </div>';
     }

     $(modal.store.claims.meta.identifiers.claimFormWrapper).html(form);
 }

 var renderClaimPage = function(response) {
     fetchPage(modal.params.resourceURL.claimHistory).done(function(response) {
         response = $.parseJSON(response);
         modal.store.claims.history = response.claims_history;

         renderClaimHistory();
     });

     modal.state.viewHTML = response;
 }

 var redeemCashback = function() {
     var dfd = $.Deferred(),
         params,
         meta = modal.store.redemption.meta;

     if (meta.current.type === "bank") {
         params = {
             "source": "mobile_pwa",
             "redeem": '50',
             "account_holders_name": meta.bankForm.name.val(),
             "account_number": meta.bankForm.ac_number.val(),
             "amount": meta.bankForm.amount.val(),
             "ifsc_code": meta.bankForm.ifsc.val()
         }
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
         url: modal.params.resourceURL.REDEEM_API,
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

 var sendOneTimePassword = function(mobile, successCallback, failureCallback) {
     if (!mobile) {
         mobile = modal.store.profile.mobile.value;
     }

     $.ajax({
         url: modal.params.resourceURL.AUTH_API,
         type: "POST",
         dataType: 'json',
         data: {
             "process": "send_otp",
             "mobile_number": mobile,
             "email": modal.store.profile.email.value
         }
     }).done(function(response) {
         if (response.otp_sent) {
             if (typeof(successCallback) === "function") {
                 successCallback(response);
             }
         } else {
             if (typeof(failureCallback) === "function") {
                 failureCallback({
                     error: 'OTP not sent'
                 });
             }
         }
     }).fail(function(xhr, status, error) {
         if (typeof(failureCallback) === "function") {
             failureCallback({
                 "error": error
             });
         }
     });

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

 var showError = function($node, message) {
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
         } else {
             $(selector.proceedButton).removeClass("btn--dsbld");
         }

         $(selector.rewardWrapper).show();
         $(selector.bankWrapper).hide();
     } else {
         //Handle Bank Case Here
         $(selector.rewardWrapper).hide();
         $(selector.bankWrapper).show();

         $(selector.proceedButton).removeClass("btn--dsbld");
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
     mProfile.pending_cashback.value = profile.pending_cashback;
     mProfile.verified_cashback.value = profile.verified_cashback;
     mProfile.image.value = profile.image || modal.store.profile.image.value;

     setCookie('msp_login_name', mProfile.name.value, 365);
     setCookie('msp_verified_cb', profile.verified_cashback, 365);
     setCookie('msp_pending_cb', profile.pending_cashback, 365);

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
     var rows = "";

     if (modal.state.view === "passbook") {
         for (var i = 0; i < storeData.length; i++) {
             var activeFilter = modal.store[modal.state.view].filters.active;

             if (activeFilter && (storeData[i].type != activeFilter && "all" != activeFilter)) continue;

             var cashback = storeData[i].cashback > 0 ? ("₹" + storeData[i].cashback) : ("-₹" + Math.abs(storeData[i].cashback)),
                 cashbackClass = storeData[i].cashback > 0 ? "prfl-tbl__cb txt--grn" : "prfl-tbl__cb txt--red",
                 expiry = storeData[i].expiry_date || "<center>-</center>",
                 entry = storeData[i].type,
                 description = "",
                 rowClass = "prfl-tbl__row clearfix";

             if (storeData[i].info) {
                 entry = storeData[i].info.store || storeData[i].info.redeem || storeData[i].type;
                 description = storeData[i].info.product_price ? "<div class='prfl-tbl__dscrptn'>Purchase Amount: <span class='txt--bold'>₹" + storeData[i].info.product_price + "</span></div>" : "";
             }

             if(storeData[i].type==="expired"){
                 rowClass += " prfl-tbl__row--cncld";
             }
             else if(storeData[i].type==="cancelled"){
                 rowClass += " prfl-tbl__row--cncld"
             }

             rows += '<div class="'+rowClass+'">\
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
                                <div class="prfl-tbl__entry-txt">' + entry + '</div>\
                                <div class="prfl-tbl__entry-info">' + storeData[i].title + '</div>\
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
     } else if (modal.state.view === "claims") {
         for (var i = 0; i < storeData.length; i++) {
             var columns = modal.store.claims.columns,
                 info = '',
                 status = '';


             for (key in storeData[i].info) {
                 if (storeData[i].info[key]) {
                     info += '<div class="prfl-tbl__info">\
                                <span class="txt--bold">' + key.replace("_", " ") + ': </span>\
                                <span class="">' + storeData[i].info[key] + '</span>\
                            </div>';
                 }
             }

             if (storeData[i].status) {
                 if (storeData[i].status.toLowerCase() === "pending") {
                     status = '<div class="prfl-tbl__sts prfl-tbl__sts--pndng">Pending</div>';
                 } else if (storeData[i].status.toLowerCase() === "closed") {
                     status = '<div class="prfl-tbl__sts prfl-tbl__sts--clsd">Closed</div>';
                 }
             }

             var entry = '<div class="' + columns[1].className + '-ttl">' + storeData[i].title + '</div>' + info + status;

             rows += '<div class="prfl-tbl__row clearfix">\
                        <div class="' + columns[0].className + '">' + storeData[i].date + '</div>\
                        <div class="' + columns[1].className + '">\
                            ' + entry + '\
                        </div>\
                        <div class="' + columns[2].className + '"><span class="' + columns[2].className + '--txt">' + storeData[i].description + '<span></div>\
                    </div>';

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
     var rowData = [],
         columns = [],
         $radioGroup = "";

     if (modal.state.view === "passbook") {
         $radioGroup = getFilters(store.filters, store.title);
         rowData = store.data;
         columns = store.columns;
     } else if (modal.state.view === "activity") {
         $radioGroup = getFilters(store.filters, store.title);
         rowData = store[modal.state.subView];
         columns = store.columns[modal.state.subView];
     } else if (modal.state.view === "claims") {
         rowData = store.history;
         columns = store.columns;
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
         case "claims":
             modal.params.$container.html(modal.state.viewHTML);
             renderClaimForm();
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
                     break;
                 case "claims":
                     renderClaimPage(response);
                     break;
                 default:
                     modal.state.viewHTML = response;
             }

             if (view != "profile") {
                 renderView();
             }
         });
     });
     highlightActiveLink();
 }

function highlightActiveLink(){
    $(".list-item--actv").removeClass("list-item--actv");

    $(".js-link, .js-load-page").each(function(){
      if(modal.state.view===$(this).data("view") && !$(this).hasClass("btn")){
            $(this).addClass("list-item--actv");
       }
   });
}

function readURLState(){
    var path = window.location.pathname,
        pageViewMap = modal.params.pageViewMap,
        modalView;

    for(var view in pageViewMap){
        modalView = (pageViewMap[view]===path)?view:modalView;
    }

    if(modalView){
        modal.state.view = modalView;
    }
}

 function init() {
     modal.state = modal.params.defaultState;
     readURLState();
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

     $doc.on("click", selector.sendOTPButton, function() {
         if ($(this).hasClass("btn--dsbld")) {
             return;
         }
         var mobile = $(selector.mobInput).val();
         $(this).addClass("btn--ldng");

         sendOneTimePassword(mobile, function(response) {
             $(selector.proceedButton).removeClass("btn--ldng");
             modal.store.profile.mobile.value = mobile;

             $(selector.mobileVerification).hide();
             $(selector.OTPVerification).show();
             $(".js-user-mob").text(mobile);

         }, function(response) {
             $(selector.proceedButton).removeClass("btn--ldng");
         });

     });

     $doc.on("click", selector.proceedButton, function() {
         if ($(this).hasClass("btn--dsbld") || (modal.store.redemption.meta.current.type === "bank" && !validateFormData())) {
             return;
         }
         var mobile = modal.store.profile.mobile.value;

         if (mobile) {
             $(this).addClass("btn--ldng");
             sendOTP().done(function(response) {
                 $(selector.proceedButton).removeClass("btn--ldng");
                 $(selector.firstView).fadeOut("fast", function() {
                     $(selector.secondView).fadeIn("fast");
                     $(selector.mobileVerification).hide();
                     $(selector.OTPVerification).show();

                     $(".js-user-mob").text(mobile);
                 });
             }).fail(function(response) {
                 $(selector.proceedButton).removeClass("btn--ldng");
             });
         } else {
             $(selector.firstView).fadeOut("fast", function() {
                 $(selector.secondView).fadeIn("fast");
                 $(selector.mobileVerification).show();
                 $(selector.OTPVerification).hide();
             });
         }
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

     $doc.on("keyup", selector.OTPInput, function() {
         if ($(this).val().length > 5) {
             $(this).blur();
             $(selector.submitOTPButton).removeClass("btn--dsbld");
         } else {
             $(selector.submitOTPButton).addClass("btn--dsbld");
         }
     });

     $doc.on("keyup", selector.mobInput, function() {
         if ($(this).val().length > 9) {
             $(this).blur();
             $(selector.sendOTPButton).removeClass("btn--dsbld");
         } else {
             $(selector.sendOTPButton).addClass("btn--dsbld");
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
                     $(selector.secondView).fadeOut("fast", function() {
                         $(selector.thirdView).fadeIn();
                         $(".js-rdm-item-name").text(modal.store.redemption.meta.current.offerTitle);
                         $(".js-user-email").text(modal.store.profile.email.value);
                     });
                 },
                 function() {
                     $(".js-otp-msg").text("OTP Verfification Failed").removeClass("txt--grn").addClass("txt--red").fadeIn("fast", function() {
                         setTimeout(function() {
                             $(".js-otp-msg").fadeOut();
                         }, 2000);
                     });

                     $(selector.submitOTPButton).removeClass("btn--ldng");
                 });
     });

 })();



 /* Generic Functions - to be moved to common file */

 $doc.on("click", ".js-acdrn", function() {
     $(this).siblings(".acrdn__answr").slideToggle("fast");
     $(this).toggleClass("acrdn__qstn--expnd");
 });


 $doc.on("focus", ".inpt", function() {
     $(this).parents(".inpt-wrpr").addClass("inpt-wrpr--focus").parents("form").find(".inpt-wrpr").removeClass("inpt-wrpr--err").find(".inpt-err").text("");
 }).on("blur", ".inpt", function() {
     $(this).parents(".inpt-wrpr").removeClass("inpt-wrpr--focus");

     if ($(this).val()) {
         $(this).parents(".inpt-wrpr").find(".inpt-lbl").addClass("inpt-lbl--vsbl");
     }
 });


$win.on("blur",function(){
    $(".dummy").focus();
});
