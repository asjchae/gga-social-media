var twitterAPI = require('simple-twitter');
var twitter = new twitterAPI(
    process.env.TWITTER_KEY,
    process.env.TWITTER_SECRET,
    process.env.ACCESS_TOKEN,
    process.env.ACCESS_SECRET
);


/*
 * GET home page.
 */

exports.index = function(req, res){
	var tweetlist = [];
	twitter.get('statuses/user_timeline/grenzebachglier',
    function(error, data) {
    	tweets = JSON.parse(data);
        for (i=0; i<tweets.length; i++) {
        	tweetlist.push([tweets[i].created_at, tweets[i].text, tweets[i].id_str]);
        }
        
        var today = new Date();
        var weekPast = (today - 604800000)

        var weekTweets = [];

        for (i=0; i<tweetlist.length; i++) {
        	if (Date.parse(tweetlist[i][0]) > weekPast) {
        		weekTweets.push(tweetlist[i])
        	}
        };

        res.send(weekTweets);

    });
};