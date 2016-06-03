self.port.on("bookmarks", function onBookmarks(payload) {
    /*window.alert("Received a message: " + payload["msg"]);*/
        
    var bookmarked = payload["bookmarked"];
    var prefs = payload["prefs"];
    
    /*
    var linkBackground = "rgba(0, 0, 255, 0.2)";
    var imgBorder = "1px dashed blue";
    */
    
    var linkBackground = prefs.highlightedLinkBackground;
    var imgBorder = prefs.highlightedImageBorder;
    
    /*
    console.log(payload["msg"]);    
    console.log("Prefs: " + linkBackground + " and " + imgBorder);
    */

    for(var i = 0, l=document.links.length; i<l; i++) {
        var link = document.links[i];
        
        if (bookmarked[link.href]) {
            if (linkBackground != null && linkBackground.trim().length > 0)
                link.style.background = linkBackground;

            link.className += " bmh-bookmarked-link";
            
            var child = document.links[i].firstChild;
            if (child.tagName == "IMG") {
                if (imgBorder != null && imgBorder.trim().length > 0)
                    child.style.border = imgBorder;
                
                child.className += " bmh-bookmarked-image";
            }
        }
    }
});
                 
var hrefs = [];

for(var i = 0, l=document.links.length; i<l; i++) {
    hrefs.push(document.links[i].href);
}

self.port.emit("hrefs", hrefs);
