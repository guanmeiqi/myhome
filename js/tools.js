/*
 * DOM Library(v1.0)
 */
var Tool = function () {
    this.flag = "getElementsByClassName" in document;
}
Tool.prototype = {
    constructor: Tool,
    toJSON: function () {
        var jsonObj = null, jsonStr = arguments[0];
        try {
            jsonObj = JSON.parse(jsonStr);
        } catch (e) {
            jsonObj = eval("(" + jsonStr + ")");
        }
        return jsonObj;
    },
    isType: function () {
        var value = arguments[0], type = arguments[1] || "Object", reg = new RegExp("\\[object " + type + "\\]", "i");
        return reg.test({}.toString.call(value));
    },
    listToArray: function () {
        var ary = [], likeAry = arguments[0];
        if (this.flag) {
            ary = [].slice.call(likeAry, 0);
        } else {
            for (var i = 0; i < likeAry.length; i++) {
                ary.push(likeAry[i]);
            }
        }
        return ary;
    },
    getElementsByClass: function () {
        var cName = arguments[0], context = arguments[1] || document, ary = [];
        if (this.flag) {
            return this.listToArray(context.getElementsByClassName(cName));
        }
        var allNode = context.getElementsByTagName("*"), reg = new RegExp("(?:^| +)" + cName + "(?: +|$)");
        for (var i = 0; i < allNode.length; i++) {
            var cur = allNode[i];
            if (reg.test(cur.className)) {
                ary.push(cur);
            }
        }
        return ary;
    },
    getChildren: function () {
        var parent = arguments[0], tagName = arguments[1], allNode = parent.childNodes, ary = [], reg = new RegExp("^" + tagName + "$", "i");
        for (var i = 0; i < allNode.length; i++) {
            var cur = allNode[i];
            if (cur.nodeType === 1) {
                if (tagName) {
                    if (reg.test(cur.nodeName)) {
                        ary.push(cur);
                    }
                    continue;
                }
                ary.push(cur);
            }
        }
        return ary;
    },
    getFirst: function () {
        var curEle = arguments[0], children = this.getChildren(curEle);
        return children.length > 0 ? children[0] : null;
    },
    getLast: function () {
        var curEle = arguments[0], children = this.getChildren(curEle);
        return children.length > 0 ? children[children.length - 1] : null;
    },
    getPre: function () {
        var curEle = arguments[0];
        if (this.flag) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    },
    getPres: function () {
        var curEle = arguments[0], ary = [], attr = this.flag ? "previousElementSibling" : "previousSibling";
        var pre = curEle[attr];
        while (pre) {
            if (pre.nodeType === 1) {
                ary.unshift(pre);
            }
            pre = pre[attr];
        }
        return ary;
    },
    getNext: function () {
        var curEle = arguments[0];
        if (this.flag) {
            return curEle.nextElementSibling;
        }
        var next = curEle.nextSibling;
        while (next && next.nodeType !== 1) {
            next = next.nextSibling;
        }
        return next;
    },
    getNexts: function () {
        var curEle = arguments[0], ary = [], next = this.getNext(curEle);
        while (next) {
            ary.push(next);
            next = this.getNext(next);
        }
        return ary;
    },
    getSibling: function () {
        var curEle = arguments[0], ary = [], pre = this.getPre(curEle), next = this.getNext(curEle);
        pre ? ary.push(pre) : void 0;
        next ? ary.push(next) : void 0;
        return ary;
    },
    getSiblings: function () {
        var curEle = arguments[0], pres = this.getPres(curEle), nexts = this.getNexts(curEle);
        return pres.concat(nexts);
    },
    getIndex: function () {
        var curEle = arguments[0];
        return this.getPres(curEle).length;
    },
    getCss: function () {
        var attr = arguments[0], curEle = arguments[1], reg = /^(?:margin|padding|border|float|position|display|background|backgroundColor)$/;
        var value = this.flag ? window.getComputedStyle(curEle, null)[attr] : curEle.currentStyle[attr];
        return !reg.test(attr) ? parseFloat(value) : value;
    },
    setCss: function () {
        var curEle = arguments[0], attr = arguments[1], value = arguments[2];
        switch (attr) {
            case "opacity":
                curEle["style"][attr] = value;
                curEle["style"]["filter"] = "alpha(opacity=" + (value * 100) + ")";
                break;
            case "zIndex":
                curEle["style"][attr] = value;
                break;
            default:
                curEle["style"][attr] = !isNaN(value) ? value += "px" : value;
        }
    },
    setGroupCss: function () {
        var curEle = arguments[0], cssObj = arguments[1];
        for (var key in cssObj) {
            this.setCss(curEle, key, cssObj[key]);
        }
    },
    hasClass: function () {
        var cName = arguments[0], curEle = arguments[1], reg = new RegExp("(?:^| +)" + cName + "(?: +|$)");
        return reg.test(curEle.className);
    },
    addClass: function () {
        var cName = arguments[0], curEle = arguments[1];
        if (!this.hasClass(cName, curEle)) {
            curEle.className += " " + cName;
        }
    },
    removeClass: function () {
        var cName = arguments[0], curEle = arguments[1], reg = new RegExp("(?:^| +)" + cName + "(?: +|$)", "g");
        if (this.hasClass(cName, curEle)) {
            curEle.className = curEle.className.replace(reg, " ");
        }
    },
    offset: function () {
        var curEle = arguments[0], par = curEle.offsetParent, left = curEle.offsetLeft, top = curEle.offsetTop;
        while (par) {
            left += par.offsetLeft, top += par.offsetTop;
            if (navigator.userAgent.indexOf("MSIE 8.0") <= -1) {
                left += par.clientLeft, top += par.clientTop;
            }
            par = par.offsetParent;
        }
        return {left: left, top: top};
    },
    insertAfter: function () {
        var newEle = arguments[0], oldEle = arguments[1], next = this.getNext(oldEle), par = oldEle.parentNode;
        next ? par.insertBefore(newEle, next) : par.appendChild(newEle);
    },
    prependChild: function () {
        var curEle = arguments[0], par = arguments[1], first = this.getFirst(par);
        first ? par.insertBefore(curEle, first) : par.appendChild(curEle);
    },
    html: function () {
        var curEle = arguments[0], str = arguments[1] || "";
        if (!str) {
            return curEle.innerHTML;
        }
        curEle.innerHTML = str;
    }
};

~function () {
    var strPro = String.prototype, aryPro = Array.prototype, objPro = Object.prototype;
    aryPro.myDistinct = function () {
        var obj = {};
        for (var i = 0; i < this.length; i++) {
            var cur = this[i];
            if (obj[cur] == cur) {
                this.splice(i, 1);
                i--;
                continue;
            }
            obj[cur] = cur;
        }
        obj = null;
        return this;
    }
    aryPro.myForEach = function () {
        var fn = arguments[0], context = arguments[1] || window;
        if (this.forEach) {
            this.forEach(fn, context);
            return this;
        }
        for (var i = 0; i < this.length; i++) {
            fn.call(context, this[i], i, this);
        }
        return this;
    }
    objPro.myHasPubProperty = function () {
        var attr = arguments[0];
        return (attr in this) && !this.hasOwnProperty(attr);
    }
    strPro.myTrim = function () {
        return this.replace(/(^\s*|\s*$)/g, "");
    }
    strPro.mySub = function () {
        var len = arguments[0] || 10, isD = arguments[1] || false, str = "", n = 0;
        for (var i = 0; i < this.length; i++) {
            var s = this.charAt(i);
            /[\u4e00-\u9fa5]/.test(s) ? n += 2 : n++;
            if (n > len) {
                isD ? str += "..." : void 0;
                break;
            }
            str += s;
        }
        return str;
    }
    strPro.myFormatTime = function () {
        var reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g, ary = [];
        this.replace(reg, function () {
            ary = ([].slice.call(arguments)).slice(1, 7);
        });
        var format = arguments[0] || "{0}年{1}月{2}日 {3}:{4}:{5}";
        return format.replace(/{(\d+)}/g, function () {
            var val = ary[arguments[1]];
            return val.length === 1 ? "0" + val : val;
        });
    }
    strPro.myQueryURLParameter = function () {
        var reg = /([^?&=]+)=([^?&=]+)/g, obj = {};
        this.replace(reg, function () {
            obj[arguments[1]] = arguments[2];
        });
        return obj;
    }
}();




