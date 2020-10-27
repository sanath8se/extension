
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    var focusWords = new FocusWords("");
    
    focusWords.remove();
    if (message.wordToHighlight) {
        focusWords.apply(message.wordToHighlight);
        focusWords.piiapply();

    }
    Promise.resolve("").then(result => callback(result));
return true;
});

function FocusWords(id, tag) {

    var focusNode = document.body;
    var tags = tag || "MARK";
    var skipTags = new RegExp("^(?:" + tags + "|SCRIPT|FORM)$");
    var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
    var wordColor = [];
    var colorIdx = 0;
    var matchRegExp = "";
    var endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', "g");
    var breakRegExp = new RegExp('[^\\w\'-]+', "g");

    //transform the input into regex for matching
    this.setRegex = function (input) {
        input = input.replace(endRegExp, "");
        input = input.replace(breakRegExp, "|");
        input = input.replace(/^\||\|$/g, "");
        if (input) {
            var re = "(" + input + ")";
            matchRegExp = new RegExp(re, "i");
            return matchRegExp;
        }
        return false;
    };

    //loop through document body and match with regex
    this.focus = function (node) {
        if (node === undefined || !node) return;
        if (!matchRegExp) return;
        if (skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.focus(node.childNodes[i]);
        }
        if (node.nodeType == 3) { // NODE_TEXT
            if ((nv = node.nodeValue) && (regs = matchRegExp.exec(nv))) {
                highlight(node);
            }
        };
    };

    //remove existing highlight
    this.remove = function () {
        var arr = document.getElementsByTagName(tags);
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };

    
    this.apply = function (input) {
        if (input === undefined || !(input = input.replace(/(^\s+|\s+$)/g, ""))) {
            return;
        }
        if (this.setRegex(input)) {
            this.focus(focusNode);
        }
        return matchRegExp;
    };

    this.piiapply = function () {
        this.pii(focusNode);
    };

    //to highlight pii data on screen. For prototype, only SSN will be highlighted
    this.pii = function (node) {
        if (node === undefined || !node) return;
        if (skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.pii(node.childNodes[i]);
        }
        if (node.nodeType == 3) { // NODE_TEXT
            var usSocialSecurityNumber = /\b\d{3}[ -.]\d{2}[ -.]\d{4}\b/g;
            if ((nv = node.nodeValue) && (regs = usSocialSecurityNumber.exec(nv))) {
                highlight(node);
            }
        };
    };


    //function which adds style to text on UI
    function highlight(node) {
        if (!wordColor[regs[0].toLowerCase()]) {
            wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
        }

        var match = document.createElement(tags);
        match.appendChild(document.createTextNode(regs[0]));
        match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
        match.style.color = "#000";

        var after = node.splitText(regs.index);
        after.nodeValue = after.nodeValue.substring(regs[0].length);
        node.parentNode.insertBefore(match, after);
    }
}