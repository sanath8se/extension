
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    var focusWords = new FocusWords("");
    //var usSocialSecurityNumber = /\b\d{3}[ -.]\d{2}[ -.]\d{4}\b/g
    focusWords.remove();
    if (message.wordToHighlight) {
        focusWords.apply(message.wordToHighlight);

    }
    Promise.resolve("").then(result => callback(result));
return true;
});

function FocusWords(id, tag) {

    var focusNode = document.body;
    var focusTag = tag || "MARK";
    var skipTags = new RegExp("^(?:" + focusTag + "|SCRIPT|FORM|SPAN)$");
    var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
    var wordColor = [];
    var colorIdx = 0;
    var matchRegExp = "";
    var endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', "g");
    var breakRegExp = new RegExp('[^\\w\'-]+', "g");

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
    this.focusWords = function (node) {
        if (node === undefined || !node) return;
        if (!matchRegExp) return;
        if (skipTags.test(node.nodeName)) return;

        if (node.hasChildNodes()) {
            for (var i = 0; i < node.childNodes.length; i++)
                this.focusWords(node.childNodes[i]);
        }
        if (node.nodeType == 3) { // NODE_TEXT
            if ((nv = node.nodeValue) && (regs = matchRegExp.exec(nv))) {
                if (!wordColor[regs[0].toLowerCase()]) {
                    wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
                }

                var match = document.createElement(focusTag);
                match.appendChild(document.createTextNode(regs[0]));
                match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
                match.style.color = "#000";

                var after = node.splitText(regs.index);
                after.nodeValue = after.nodeValue.substring(regs[0].length);
                node.parentNode.insertBefore(match, after);
            }
        };
    };
    this.remove = function () {
        var arr = document.getElementsByTagName(focusTag);
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };
    this.apply = function (input) {
        //this.remove();
        if (input === undefined || !(input = input.replace(/(^\s+|\s+$)/g, ""))) {
            return;
        }
        if (this.setRegex(input)) {
            this.focusWords(focusNode);
        }
        return matchRegExp;
    };

}