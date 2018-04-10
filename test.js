function redirectOldUsers(){
    var loc = window.location.pathname,
        newPath;

    if(loc.indexOf("tabOpen=activity_details") > -1){
        newpath = "/me/activity";
    }
    else if(loc.indexOf("tabOpen=redemption") > -1){
        newpath = "/me/redeem";
    }
    else if(loc.indexOf("tabOpen=claims_issues") > -1){
        newpath = "/me/claims";
    }
    else if(loc.indexOf("tabOpen=how_it_works") > -1){
        newpath = "/me/how-it-works";
    }
    else if(loc.indexOf("tabOpen=") > -1){
        newPath = "/me/";
    }

    history.pushState({}, "New Tab", newPath);
}
