function getNowFormatDate() {
    var myDate = new Date();
    var date = myDate.toLocaleDateString();
    var hours = myDate.getHours();
    var minutes = myDate.getMinutes();
    var seconds = myDate.getSeconds();
    return date+" "+hours+":"+minutes+":"+seconds;
}