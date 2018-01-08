$(document).ready(function() {
	// ===================================
	// Global Control Center
	// In Google We Trust
	// ===================================
	var client_api_key = "luo3sDsDhVIqhgWr6z8tMRQnBJ88bgkTV8V1Ek7Q";
	var client_secret = "IaG39HFW4xOvRCFpLJaoVImlxIn5epm9bEeNkoV8";
	var platform_type_id = 1;
	var shop_domain = "https://www.promarinesupplies.com/";
	var review_count = 100;

	// ===================================
	// Init Authentication to Yotpo API
	// ===================================
	// Reference:
	// http://apidocs.yotpo.com/reference#general-information
	// 
	// Go to the Yotpo app, on the top right, click on the user icon,
	// then click account settings, then the store tab. You will need the API
	// credentials to login first.
	// ===================================

	var yotpoAuthUrl = 'https://api.yotpo.com/oauth/token',
			credentials = {
				"client_id": client_api_key,
				"client_secret": client_secret,
				"grant_type": "client_credentials"
			},
			accessToken = '',
			initYotpoAuth = $.ajax({
				url: yotpoAuthUrl,
				type: 'POST',
				dataType: 'json',
				contentType: 'application/json',
				data: JSON.stringify(credentials),
				success: function(){
					console.log('Auth successful!');
				}
			});

	// Format Review Date
	function formatDate(date) {
    var month = date.getMonth(),
        day = date.getDate().toString(),
        year = date.getFullYear();

    year = year.toString().substr(-2);
    month = (month + 1).toString();  
    return month + "/" + day + "/" + year;
  }

  // Humanize Strings
  function humanize(str) {
  	var frags = str.split('_');
  	for (i=0; i<frags.length; i++) {
  		frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  	}
  	return frags.join(' ');
  }

  // Star Rating
  $.fn.stars = function () {

  	return $(this).each(function() {
  		var rating = $(this).data('rating'),
  				numStars = $(this).data('num-stars'),
  				fullStar = new Array(Math.floor(rating + 1)).join('<i class="fa fa-star"></i>'),
  				halfStar = ((rating%1) !== 0) ? '<i class="fa fa-star-half"></i>': '',
  				noStar = new Array(Math.floor(numStars + 1 - rating)).join('<i class="fa fa-star empty"></i>');

  		$(this).html(fullStar + halfStar + noStar);
  	});
  }

	// ==============================================
	// After auth, specify the platform_type_id youre using. 
	// Shopify is 1,
	// Bigcommerce is 3,
	// Magento is 5
	// ==============================================
	// You can find the shop domain above the API keys
	// in Yotpo's account settings.
	// ==============================================

	initYotpoAuth.done(function(data) {
		// Get access token. You will need this when accessing the API
		accessToken = data.access_token;

		// Data for AJAX request
		var data = {
			"account_platform": {
				"platform_type_id": platform_type_id,
				"shop_domain": shop_domain
			},
			"utoken": accessToken
		};

		// Ajax Calls For Voting
		function yotpoReviewVote(review_id, vote_type) {
			$.ajax({
				url: 'https://api.yotpo.com/reviews/'+review_id+'/vote/'+vote_type+'',
				type: 'POST',
				data: JSON.stringify(data),
				dataType: 'json',
				contentType: 'application/json',
				success: function() {
					console.log('Review id: '+review_id+', Voted: '+vote_type+'');
				}
			});
		}

		$.ajax({
			url: 'https://api.yotpo.com/v1/apps/'+client_api_key+'/reviews?utoken='+accessToken+'&count='+review_count+'',
			type: 'GET',
			data: JSON.stringify(data),
			dataType: 'json',
			contentType: 'application/json',
			success: function(response) {

				// See the json on your log!
				// console.log(response);

				// Do whatever else you want below!
				$.each( response.reviews, function(i, review) {
          // Review Variables
          var reviewTitle = review.title,
              reviewContent = review.content,
              reviewDate = new Date(review.created_at),
              reviewDate = formatDate(reviewDate),
              reviewScore = review.score,
              reviewTotalScore = 5,
              reviewVoteUp = review.votes_up,
              reviewVoteDown = review.votes_down,
              reviewTotalVote = (reviewVoteUp - reviewVoteDown);
              reviewName = review.name,
              reviewId = review.id,
              reviewType = review.reviewer_type,
              reviewType = humanize(reviewType),

              // Create Divs
              reviewAppend = $('.review-append'),
              reviewImg = $('.review-img'),
              reviewBody = $('.body'),
              reviewDateVotes = $('.date-votes'),
              divReviewScore = $('.review-score'),
              structure = '<div class="block" data-date="'+reviewDate+'">' +
		              			    '<div class="row">' +
		              			      '<div class="column l1 m2 s12">' +
		              			       	'<div class="review-img">' +
		              			        '<i class="fa fa-user-circle" aria-hidden="true"></i>' +
		              			        '<i class="fa fa-check-circle" aria-hidden="true"></i>' +
		              			        '</div>' +
		              			      '</div>' +
		              			      '<div class="column l9 m10 s12 body">' +

		              			        '<p class="name">'+reviewName+'</p>' +
		              			        '<p class="review-type">'+reviewType+'</p><br>' +
		              			        '<div class="review-score">' +
		              			        	'<span class= "stars" data-rating="'+reviewScore+'" data-num-stars="5"></span>' +
		              			        '</div>' +
		              			        '<p class="title">'+reviewTitle+'</p>' +
		              			        '<p class="content">'+reviewContent+'</p>' +

		              			      '</div>' +
		              			      '<div class="column l2 m12 s12 date-votes">' +

		              			        '<p class="date">'+reviewDate+'</p>' +
		              			        '<div class="votes">' +
		              			          '<p class="vote-num">'+reviewTotalVote+'</p>' +
		              			          '<i class="fa fa-thumbs-o-up" data-id="'+reviewId+'"></i>' +
		              			          '<i class="fa fa-thumbs-o-down" data-id="'+reviewId+'"></i>' +
		              			        '</div>' +

		              			      '</div>' +
		              			    '</div>' +
		              			  '</div>';
          // Create block
          reviewAppend.append(structure);

          // Sort Blocks
          $('.block').sort(function (a,b) {
          	return Date.parse($(a).attr("data-date")) > Date.parse($(b).attr("data-date")) ? 1 : -1;
          }).each(function() {
          	reviewAppend.prepend(this);
          });

          $('.stars').stars();

        });
        // Vote Buttons
				$('.votes .fa-thumbs-o-up').on('click', function() {
					voteReviewId = $(this).data('id');
					yotpoReviewVote(voteReviewId, 'up');
					$(this).addClass('voted-up');
					$('.votes .fa-thumbs-o-down').removeClass('voted-down');
				});

				$('.votes .fa-thumbs-o-down').on('click', function() {
					voteReviewId = $(this).data('id');
					yotpoReviewVote(voteReviewId, 'down');
					$(this).addClass('voted-down');
					$('.votes .fa-thumbs-o-up').removeClass('voted-up');
				});
      // ajax success
			}
		});
	// initYoptoAuth
	});
// document.ready
});