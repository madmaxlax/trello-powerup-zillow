/* global TrelloPowerUp */

// we can access Bluebird Promises as follows
var Promise = TrelloPowerUp.Promise;

var HYPERDEV_ICON =
  "https://cdn.glitch.com/e9cc67bf-caf4-45ed-bf25-038b934ac87c%2Fzillowtransparentlogoonlyblue.png?1505252312559";
var GRAY_ICON =
  "https://cdn.glitch.com/e9cc67bf-caf4-45ed-bf25-038b934ac87c%2Fzillowtransparentlogoonlyblack.png?1505252312334";
var WHITE_ICON =
  "https://cdn.glitch.com/e9cc67bf-caf4-45ed-bf25-038b934ac87c%2Fzillowtransparentlogoonlywhite.png?1505252312148";

var getBadges = function(t, isFront) {
  //ToDo feature: pick which badges show up, for now show all of em
  var badgeSettings = {
    price: true,
    bedrooms: true,
    bathrooms: true,
    address: true,
    type: true
  };

  return Promise.all([
    t.get("card", "shared", "userInput"),
    t.get("card", "shared", "zillowInfo")
  ]).spread(function(userInput, zillowInfo) {
    if (userInput == null || zillowInfo == null) {
      return [
        {
          title: "Error",
          text: isFront?'Address needed':"Address needed, click Zillow power up button"
        }
      ];
    }
    if (zillowInfo["SearchResults:searchresults"].response != null) {
      var badges = [];
      if(!isFront && zillowInfo != null && zillowInfo['SearchResults:searchresults'] != null && zillowInfo['SearchResults:searchresults'].response.results.result.links != null){
        //link to house
        badges.push({
          title:'Full Zillow listing',
          text: 'Click Here ↗️',
          url: zillowInfo['SearchResults:searchresults'].response.results.result.links.homedetails,
          target:'_blank',
          color: null
        });
      }
      if (
        badgeSettings.price &&
        ((zillowInfo["SearchResults:searchresults"].response.results.result
          .zestimate != null &&
          zillowInfo["SearchResults:searchresults"].response.results.result
            .zestimate.amount["_"] != null) ||
          (zillowInfo["SearchResults:searchresults"].response.results.result
            .rentzestimate != null &&
            zillowInfo["SearchResults:searchresults"].response.results.result
              .rentzestimate.amount["_"]))
      ) {
        badges.push({
          // its best to use static badges unless you need your badges to refresh
          // you can mix and match between static and dynamic
          title: "Price (zestimate)", // for detail badges only
          text:
            (isFront ? "" : "$") +
            Number(
              userInput.rentOrBuy === "buy"
                ? zillowInfo["SearchResults:searchresults"].response.results
                    .result.zestimate.amount["_"]
                : zillowInfo["SearchResults:searchresults"].response.results
                    .result.rentzestimate.amount["_"]
            ).toLocaleString(undefined, { maximumFractionDigits: 0 }),
          icon:
            "https://cdn.glitch.com/e9cc67bf-caf4-45ed-bf25-038b934ac87c%2FDollar_Sign.svg?1505855035307", // for card front badges only
          url: "https://www.zillow.com/zestimate/",
          target:'_blank',
          color: null
          
        });
      }
      if (
        badgeSettings.address &&
        zillowInfo["SearchResults:searchresults"].response.results.result
          .address != null
      ) {
        badges.push({
          // its best to use static badges unless you need your badges to refresh
          // you can mix and match between static and dynamic
          title: "Address", // for detail badges only
          text:
            (isFront ? "" : "📫 ") +
            zillowInfo["SearchResults:searchresults"].response.results.result
              .address.street + (isFront ? "" : ', '+ zillowInfo["SearchResults:searchresults"].response.results.result
              .address.city+', '+zillowInfo["SearchResults:searchresults"].response.results.result
              .address.state),
          icon:
            "https://cdn.glitch.com/e9cc67bf-caf4-45ed-bf25-038b934ac87c%2Fmail-box.svg?1505855431798", // for card front badges only
          color: null,
          url: ("https://maps.google.com/?q="+encodeURIComponent(zillowInfo["SearchResults:searchresults"].response.results.result
              .address.street+','+zillowInfo["SearchResults:searchresults"].response.results.result
              .address.zipcode)),
          target:'_blank'
        });
      }

      if (
        badgeSettings.bathrooms &&
        zillowInfo["SearchResults:searchresults"].response.results.result
          .bathrooms != null
      ) {
        badges.push({
          // its best to use static badges unless you need your badges to refresh
          // you can mix and match between static and dynamic
          title: "Bathrooms", // for detail badges only
          text:
            "🛀 " +
            zillowInfo["SearchResults:searchresults"].response.results.result
              .bathrooms,
          color: null
        });
      }

      if (
        badgeSettings.bedrooms &&
        zillowInfo["SearchResults:searchresults"].response.results.result
          .bedrooms != null
      ) {
        badges.push({
          // its best to use static badges unless you need your badges to refresh
          // you can mix and match between static and dynamic
          title: "Bathrooms", // for detail badges only
          text:
            "🛌 " +
            zillowInfo["SearchResults:searchresults"].response.results.result
              .bedrooms,
          color: null
        });
      }
      if (
        badgeSettings.type &&
        zillowInfo["SearchResults:searchresults"].response.results.result
          .useCode != null
      ) {
        badges.push({
          // its best to use static badges unless you need your badges to refresh
          // you can mix and match between static and dynamic
          title: "Type", // for detail badges only
          text:
            "🏡 " +
            zillowInfo["SearchResults:searchresults"].response.results.result
              .useCode,
          color: null
        });
      }

      return badges;
    } else {
      return [
        {
          title: "Error",
          text: "Zillow Error, click Zillow power up button"
        }
      ];
    }
  });
};

var boardButtonCallback = function(t) {
  return t.popup({
    title: "Popup List Example",
    items: [
      {
        text: "Open Overlay",
        callback: function(t) {
          return t
            .overlay({
              url: "./overlay.html",
              args: { rand: (Math.random() * 100).toFixed(0) }
            })
            .then(function() {
              return t.closePopup();
            });
        }
      },
      {
        text: "Open Board Bar",
        callback: function(t) {
          return t
            .boardBar({
              url: "./board-bar.html",
              height: 200
            })
            .then(function() {
              return t.closePopup();
            });
        }
      }
    ]
  });
};

var cardButtonCallback = function(t) {
  // Trello Power-Up Popups are actually pretty powerful
  // Searching is a pretty common use case, so why reinvent the wheel
  // var items = ['acad', 'arch', 'badl', 'crla', 'grca', 'yell', 'yose'].map(function(parkCode){
  //   var urlForCode = 'http://www.nps.gov/' + parkCode + '/';
  //   var nameForCode = '🏞 ' + parkCode.toUpperCase();
  //   return {
  //     text: nameForCode,
  //     url: urlForCode,
  //     callback: function(t){
  //       // in this case we want to attach that park to the card as an attachment
  //       return t.attach({ url: urlForCode, name: nameForCode })
  //       .then(function(){
  //         // once that has completed we should tidy up and close the popup
  //         return t.closePopup();
  //       });
  //     }
  //   };
  // });
  // we could provide a standard iframe popup, but in this case we
  // will let Trello do the heavy lifting
  // return t.popup({
  //   title: 'Popup Search Example',
  //   items: items, // Trello will search client side based on the text property of the items
  //   search: {
  //     count: 5, // how many items to display at a time
  //     placeholder: 'Search National Parks',
  //     empty: 'No parks found'
  //   }
  // });
  // in the above case we let Trello do the searching client side
  // but what if we don't have all the information up front?
  // no worries, instead of giving Trello an array of `items` you can give it a function instead
  // return t.popup({
  //   title: "Zillow Lookup",
  //   url:'./card-popup.html'
  // });
  /*
  return t.popup({
    title: 'Popup Async Search',
    items: function(t, options) {
      // use options.search which is the search text entered so far
      // and return a Promise that resolves to an array of items
      // similar to the items you provided in the client side version above
    },
    search: {
      placeholder: 'Start typing your search',
      empty: 'Huh, nothing there',
      searching: 'Scouring the internet...'
    }
  });
  */
};

// We need to call initialize to get all of our capability handles set up and registered with Trello
TrelloPowerUp.initialize({
  // NOTE about asynchronous responses
  // If you need to make an asynchronous request or action before you can reply to Trello
  // you can return a Promise (bluebird promises are included at TrelloPowerUp.Promise)
  // The Promise should resolve to the object type that is expected to be returned
  //   'attachment-sections': function(t, options){
  //     // options.entries is a list of the attachments for this card
  //     // you can look through them and 'claim' any that you want to
  //     // include in your section.

  //     // we will just claim urls for Yellowstone
  //     var claimed = options.entries.filter(function(attachment){
  //       return attachment.url.indexOf('http://www.nps.gov/yell/') === 0;
  //     });

  //     // you can have more than one attachment section on a card
  //     // you can group items together into one section, have a section
  //     // per attachment, or anything in between.
  //     if(claimed && claimed.length > 0){
  //       // if the title for your section requires a network call or other
  //       // potentially length operation you can provide a function for the title
  //       // that returns the section title. If you do so, provide a unique id for
  //       // your section
  //       return [{
  //         id: 'Yellowstone', // optional if you aren't using a function for the title
  //         claimed: claimed,
  //         icon: HYPERDEV_ICON,
  //         title: 'Example Attachment Section: Yellowstone',
  //         content: {
  //           type: 'iframe',
  //           url: t.signUrl('./section.html', { arg: 'you can pass your section args here' }),
  //           height: 230
  //         }
  //       }];
  //     } else {
  //       return [];
  //     }
  //   },
  //   'attachment-thumbnail': function(t, options){
  //     // options.url has the url of the attachment for us
  //     // return an object (or a Promise that resolves to it) with some or all of these properties:
  //     // url, title, image, openText, modified (Date), created (Date), createdBy, modifiedBy

  //     // You should use this if you have useful information about an attached URL
  //     // however, it doesn't warrant pulling it out into a section
  //     // for example if you just want to show a preview image and give it a better name

  //     return {
  //       url: options.url,
  //       title: '👉 ' + options.url + ' 👈',
  //       image: {
  //         url: HYPERDEV_ICON,
  //         logo: true // false if you are using a thumbnail of the content
  //       },
  //       openText: 'Open Sesame'
  //     };

  //     // if we don't actually have any valuable information about the url
  //     // we can let Trello know like so:
  //     // throw t.NotHandled();
  //   },
  //   'authorization-status': function(t, options){
  //     // return a promise that resolves to the object with
  //     // a property 'authorized' being true/false
  //     // you can also return the object synchronously if you know the answer synchronously
  //     return new TrelloPowerUp.Promise((resolve) => resolve({ authorized: true }));
  //   },
  "board-buttons": function(t, options) {
    return [
      // {
      //   // we can either provide a button that has a callback function
      //   // that callback function should probably open a popup, overlay, or boardBar
      //   icon: WHITE_ICON,
      //   text: "Zillow Settings",
      //   callback: boardButtonCallback
      // }
      //         , {
      //   // or we can also have a button that is just a simple url
      //   // clicking it will open a new tab at the provided url
      //   icon: WHITE_ICON,
      //   text: 'URL',
      //   url: 'https://trello.com/inspiration',
      //   target: 'Inspiring Boards' // optional target for above url
      // }
    ];
  },
  "card-badges": function(t, options) {
    return getBadges(t, true);
  },
  "card-buttons": function(t, options) {
    return [
      {
        // usually you will provide a callback function to be run on button click
        // we recommend that you use a popup on click generally
        icon: GRAY_ICON, // don't use a colored icon here
        text: "Get Zillow Info",
        callback: function(t) {
          return t.popup({
            title: "Zillow Lookup",
            url: "./card-popup.html"
          });
        }
      }
      //         , {
      //   // but of course, you could also just kick off to a url if that's your thing
      //   icon: GRAY_ICON,
      //   text: 'Just a URL',
      //   url: 'https://developers.trello.com',
      //   target: 'Trello Developer Site' // optional target for above url
      // }
    ];
  },
  "card-detail-badges": function(t, options) {
    return getBadges(t, false);
  },
  //   'card-from-url': function(t, options) {
  //     // options.url has the url in question
  //     // if we know cool things about that url we can give Trello a name and desc
  //     // to use when creating a card. Trello will also automatically add that url
  //     // as an attachment to the created card
  //     // As always you can return a Promise that resolves to the card details

  //     return new Promise(function(resolve) {
  //       resolve({
  //         name: '💻 ' + options.url + ' 🤔',
  //         desc: 'This Power-Up knows cool things about the attached url'
  //       });
  //     });

  //     // if we don't actually have any valuable information about the url
  //     // we can let Trello know like so:
  //     // throw t.NotHandled();
  //   },
  //   'format-url': function(t, options) {
  //     // options.url has the url that we are being asked to format
  //     // in our response we can include an icon as well as the replacement text

  //     return {
  //       icon: GRAY_ICON, // don't use a colored icon here
  //       text: '👉 ' + options.url + ' 👈'
  //     };

  //     // if we don't actually have any valuable information about the url
  //     // we can let Trello know like so:
  //     // throw t.NotHandled();
  //   },
  //   'show-authorization': function(t, options){
  //     // return what to do when a user clicks the 'Authorize Account' link
  //     // from the Power-Up gear icon which shows when 'authorization-status'
  //     // returns { authorized: false }
  //     // in this case we would open a popup
  //     return t.popup({
  //       title: 'My Auth Popup',
  //       url: './authorize.html', // this page doesn't exist in this project but is just a normal page like settings.html
  //       height: 140,
  //     });
  //   },
  "show-settings": function(t, options) {
    // when a user clicks the gear icon by your Power-Up in the Power-Ups menu
    // what should Trello show. We highly recommend the popup in this case as
    // it is the least disruptive, and fits in well with the rest of Trello's UX
    return t.popup({
      title: "Settings",
      url: "./settings.html",
      height: 184 // we can always resize later, but if we know the size in advance, its good to tell Trello
    });
  }
});

console.log("Power Up Loaded by: " + document.referrer);
