/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  
  // Submitting form for new tweet:
  // Checks tweet length (Must have between 1-140 characters)
  // Posts tweet if passes

  $("#tweet-form").submit(function(event) { 
    event.preventDefault();
    const text = $(this).serialize();
    if ($('#tweet-text').val().length > 140) {
      $('#new-tweet-error').text("❗❗ Your tweet exceeds 140 characters! ❗❗");
      $('#new-tweet-error').slideDown();
    } else if ($('#tweet-text').val().length === 0) {
      $('#new-tweet-error').text("❗❗ Your tweet is empty! ❗❗");
      $('#new-tweet-error').slideDown();
    } else {
      $.ajax('/tweets', { method: 'POST', data: text}).
        done(function() {
          $('#new-tweet-error').slideUp();
          loadTweets();
          $('#tweet-text').val('');
        })
        .catch(function(err) {
        });
    } 
  });
  //Toggle new tweet button
  $("nav > button").click(function(event) {
    $('.new-tweet').slideToggle();
    $('#tweet-text').focus();
  });

  //Back to top button
  $(window).scroll(function(event) {
    if ($(window).scrollTop() > 50) {
      $('#back-to-top-button').show();
    } else {
      $('#back-to-top-button').hide();
    }
  });

  $('#back-to-top-button').click(function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });
  

  loadTweets();

});



const renderTweets = function(tweets) {
  // loops through tweets
  // calls createTweetElement for each tweet
  // takes return value and appends it to the tweets container
  $('#tweets-container').empty();

  for (let tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('#tweets-container').prepend($tweet); // to add it to the page so we can make sure it's got all the right elements, classes, etc.
  }
};

//Escape function to sanitize tweets
const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//Creates tweet template
const createTweetElement = function(tweet) {
  const user = tweet.user;
  const content = tweet.content;
  const days = timeAgo(tweet.created_at);
  const template = `
  <article class='tweet'>
        <header>
          <div class = "tweet-profile">
            <img class = "avatar-pic" src=${escape(user.avatars)} > 
            <p>${escape(user.name)}</p>
          </div>
          <p class='handle'>${escape(user.handle)}</p>
        </header>
        <p>${escape(content.text)}</p>
        <footer>
          <p class='date'>${escape(days)} days ago</p>
          <div>
            <img class = "footer-icons" src="/images/flag.png" > 
            <img class = "footer-icons" src="/images/retweet.png" > 
            <img class = "footer-icons" src="/images/heart.png" > 
          </div>
        </footer>
      </article>
  `;

  return template;


};

//Helper function: Return # of days ago tweet was created
const timeAgo = function(dateTime) {
  const now = new Date();
  const time = new Date(dateTime);
  const diff = now - time;
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return diffDays;
};

//Show all tweets on page
const loadTweets = function() {
  $.ajax('/tweets', { method: 'GET'})
    .done(
      function(data) {
        $('#new-tweet-error').hide();
        $('.new-tweet').hide();
        $('#back-to-top-button').hide();
        renderTweets(data);
      
      }
    );


};