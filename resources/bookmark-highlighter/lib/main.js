var {Cc, Ci} = require("chrome");

var bmsvc = Cc["@mozilla.org/browser/nav-bookmarks-service;1"]
    .getService(Ci.nsINavBookmarksService);

var ios = Cc["@mozilla.org/network/io-service;1"]
    .getService(Ci.nsIIOService);

var data = require("self").data;
var prefs = require("sdk/simple-prefs").prefs;

require("page-mod").PageMod({
    include: eval(prefs.include),
    contentScriptWhen: 'ready',
    contentScriptFile: data.url("highlighter.js"),
    onAttach: function onAttach(worker) {
        worker.port.on('hrefs', function(data) {
            var bookmarked = {};
            var countBookmarked = 0;
            var countStarted = 0;
            var countFinished = 0;

            for (idx in data) {
                try {
                    countStarted += 1;

                    var href = data[idx];

                    var uri = ios.newURI(href, null, null);

                    if (bmsvc.isBookmarked(uri)) {
                        bookmarked[href] = true;
                        countBookmarked += 1;
                    }
                    else {
                        bookmarked[href] = false;
                    }

                    countFinished += 1;
                }
                catch(err) {
                    bookmarked[href] = false;
                }
            }

            /*console.log("Link bg: " + prefs.highlightedLinkBackground);*/

            var msg = "countStarted=" + countStarted + ";"
                    + "countBookmarked=" + countBookmarked + ";"
                    + "countFinished=" + countFinished + ";"

            worker.port.emit("bookmarks", {"msg": msg, "bookmarked": bookmarked, "prefs": prefs});
        });
    }
});
