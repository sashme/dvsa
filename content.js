// this tool parses the slot search result page and tidy it up by removing all unnecessary "No tests found" garbage;
// when you are lucky enough and slots come up - it shows you only slots matching the criternions (see below);

// How To Create Extension:
// 1. create empty safari extension in XCode as described here:
// https://developer.apple.com/documentation/safariservices/safari_web_extensions/creating_a_safari_web_extension
// 2. replace <ExtensionName>/Resources/content.js with this file;
// 3. follow steps to enable it:
// https://developer.apple.com/documentation/safariservices/safari_web_extensions/running_your_safari_web_extension
// 4. replace manifest with provided one;
//
// How To Use:
// 1. navigate to the page of booking/changing the practice exam slot:
// https://www.gov.uk/book-driving-test
// 2. click start, the script will autofill next page for you or fill it yourself and proceed;
// 3. fill in postcode of area you are interested in;
// 4. click find;
// 5. if nothing comes up either repeat postcode search or click button in the bottom;
//
// Pulp:
// use at your own risk;
// no guarantees you find what you are looking for;
// essentially there are 2 ways to find slot:
// 1. enter postcode, click search. it always searches through only 4 nearest test centers;
// 2. repeatedly click the button in the bottom of the page (it has counter on it) which repeats search with given postcode, but increases the radius of search and picks 4 more centers each time; you still need to repeat postcode search from time to time when the counter reaches 50 or 100, so you do not hunt slots on the other side of the world;
// the website has numerious defenses: frequency of searches; pattern of clicking; number of searches per hour, etc;
// be patient and humble, do not over do, it takes 5-7 session for 10-15 minutes each with hour or too between them on avarage to catch something;
// when slot comes up - you have only couple of seconds or less to click on it and click any free date and time on next page to procced; any delay and bots will steal it from you;
// Mondays are in general more fruitful compared to other days;
// at 600am and around 1140pm it is more likely to pick something;
// weekends are usually dead;

var res_count = 0;

const changeColor = () => {
    var cs = document.querySelectorAll("li.clear");
    res_count = cs.length;
    cs.forEach(removeEmpty);

    var btn = document.querySelector("a.button");
    if( btn != null ) {
        changeBtnText(btn);
    }
    else {
        // start page autofill
        var un = document.getElementById("driving-licence-number");
        // replace XXX with provisional driver license number;
        // field 5 on the card (without issue number)
        un.value = "XXX"

        // replace YYY with existing application reference number
        // alternatively, there is a link on this page to use passed theory test
        // reference number
        var rn = document.getElementById("application-reference-number");
        rn.value = "YYY";
        
        // anyway, this page is filled only one, feel free to do it manually
    }
}

function removeEmpty(c){
    var h5 = c.querySelector("h5");
    var txt = h5.textContent;
    
    // replace MM with month number of interest;
    // e.g. '07' for July
    // copy this block and add more if need be;
    // e.g. for slots in July and August put 2 blocks
    // with 07 and 08;
    // if any slots in given month found they will be highlighted in red
    if( txt.search("/MM/") != -1 ) {
        h5.style.backgroundColor = "red";
        return;
    }
    
    // remove noise
    // "No tests found blah-blah" - tests center with no tests
    if( txt.search("No t") != -1 ) {
        c.remove();
        return;
    }
    
    // replace NN with month number too far away from today
    // add as many blocks as needed;
    // e.g. if you look for Jul and Aug slots, get rid of Sep, Oct, Nov and Dec
    if( txt.search("/NN/") != -1 ) {
        c.remove();
        return;
    }
}

function changeBtnText(b){
    var txt = b.textContent;
    if( txt === "Show more results" ){
        b.textContent = "Show more results " + res_count;
    }
}

changeColor();
