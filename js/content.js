
chrome.extension.onMessage.addListener(function (message, sender, callback) {
    console.log("couldn't find word4");
    if (message.wordToHighlight) {
        var myHilitor = new Wordhighlighter("");
        console.log("couldn't find word5");
        //focusWord("google", "#00ff00")
        myHilitor.apply("google is good");	
    }
});


// var focusWord = function (word, color) {


//     //window.getSelection().removeAllRanges(); this might already be done by new chrome
//     var scopeList = [];
//     if (window.find(word, false, false, false, false, false, false)) { //window.find(aString, aCaseSensitive, aBackwards, aWrapAround, aWholeWord, aSearchInFrames, aShowDialog);
//         do {
//             scopeList.push(window.getSelection().getRangeAt(0));
//         } while (window.find(word, false, false, false, false, false, false));
//         window.scrollTo(0, 0);
//     } else {
//         console.log("couldn't find word" + word);
//     }
//     scopeList.forEach(function (e) {
//         colorSelection(e, color);
//     });
// };

// var colorSelection = function (scope, color) {

//     var node = document.createElement("i");
//     var selectorName = node.className = "select".concat(color);
//     node.classList.add("select");

//     // // add highlight class style in CSS
//     // if (!ruleExistenceDict[color]) {
//     // 	sheet.insertRule([".", selectorName, " { background: #", color, " !important; }"].join(""), 0);
//     // 	ruleExistenceDict[color] = true;
//     // 	console.log(sheet);
//     // }
//     node.appendChild(scope.extractContents());
//     scope.insertNode(node);
// };

function Wordhighlighter(id, tag) {

    var focusNode = document.body;
    var focusTag = tag || "MARK";
    var skipTags = new RegExp("^(?:" + focusTag + "|SCRIPT|FORM|SPAN)$");
    var colors = ["#ff6", "#a0ffff", "#9f9", "#f99", "#f6f"];
    var wordColor = [];
    var colorIdx = 0;
    var matchRegExp = "";
    var openLeft = false;
    var openRight = false;

    var endRegExp = new RegExp('^[^\\w]+|[^\\w]+$', "g");

    var breakRegExp = new RegExp('[^\\w\'-]+', "g");

    this.setEndRegExp = function (regex) {
        endRegExp = regex;
        return endRegExp;
    };

    this.setBreakRegExp = function (regex) {
        breakRegExp = regex;
        return breakRegExp;
    };

    this.setMatchType = function (type) {
        switch (type) {
            case "left":
                this.openLeft = false;
                this.openRight = true;
                break;

            case "right":
                this.openLeft = true;
                this.openRight = false;
                break;

            case "open":
                this.openLeft = this.openRight = true;
                break;

            default:
                this.openLeft = this.openRight = false;

        }
    };

    this.setRegex = function (input) {
        input = input.replace(endRegExp, "");
        input = input.replace(breakRegExp, "|");
        input = input.replace(/^\||\|$/g, "");
        if (input) {
            var re = "(" + input + ")";
            if (!this.openLeft) {
                re = "\\b" + re;
            }
            if (!this.openRight) {
                re = re + "\\b";
            }
            matchRegExp = new RegExp(re, "i");
            return matchRegExp;
        }
        return false;
    };

    this.getRegex = function () {
        var retval = matchRegExp.toString();
        retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
        retval = retval.replace(/\|/g, " ");
        return retval;
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

    // highlighting remove 
    this.remove = function () {
        var arr = document.getElementsByTagName(focusTag);
        while (arr.length && (el = arr[0])) {
            var parent = el.parentNode;
            parent.replaceChild(el.firstChild, el);
            parent.normalize();
        }
    };

    //  highlighting start
    this.apply = function (input) {
        this.remove();
        if (input === undefined || !(input = input.replace(/(^\s+|\s+$)/g, ""))) {
            return;
        }
        if (this.setRegex(input)) {
            this.focusWords(focusNode);
        }
        return matchRegExp;
    };

}