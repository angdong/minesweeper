$(document).ready(function() {
  $("#lv1").on("click", function() {
    // setting of level1
    sessionStorage.setItem("size", "9");
    sessionStorage.setItem("mine", "10");
    $(location).attr('href', './main.html');
  })
  $("#lv2").on("click", function() {
    // setting of level2
    sessionStorage.setItem("size", "15");
    sessionStorage.setItem("mine", "35");
    $(location).attr('href', './main.html');
  })
  $("#lv3").on("click", function() {
    // setting of level3
    sessionStorage.setItem("size", "24");
    sessionStorage.setItem("mine", "99");
    $(location).attr('href', './main.html');
  })
});
