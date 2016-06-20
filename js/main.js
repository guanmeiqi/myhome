/**
 * Created by Administrator on 2015/8/12.
 */
var g = new Tool;
var d = document.getElementById("top-up"),hn=document.getElementById("hn");
window.onscroll = function () {
    var dBottom = (document.documentElement.clientHeight || document.body.clientHeight);
    var winBottom = (document.documentElement.clientHeight || document.body.clientHeight) + (document.documentElement.scrollTop || document.body.scrollTop);
    if (dBottom < winBottom) {
        g.setCss(d, "display", "block");
        g.setCss(hn,"background","brown");
    } else {
        g.setCss(d, "display", "none");
        g.setCss(hn,"background","transparent");
    }
};
d.onclick = fn;
var timer=null;
function fn() {
    window.clearTimeout(timer);
    document.body.scrollTop += -30;
    if((document.documentElement.scrollTop ||document.body.scrollTop)<=0){
        document.body.scrollTop=0;
        return;
    }
    timer=setInterval(fn, 10);
}


