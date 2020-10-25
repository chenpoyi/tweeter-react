$(document).ready(function() {
  //Character counter for tweet
  $('#tweet-text').keyup(
    function(event) {
      const currentLength = 140 - $(this).val().length;
      const counter = $(this).siblings("div").children(".counter");
      counter.val(currentLength);
      if (currentLength < 0) {
        counter.addClass("alert");
      } else {
        counter.removeClass("alert");
      }
    }
  );
});