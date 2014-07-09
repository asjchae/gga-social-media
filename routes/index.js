var twitterAPI = require('simple-twitter');
var twitter = new twitterAPI(
    process.env.TWITTER_KEY,
    process.env.TWITTER_SECRET,
    process.env.ACCESS_TOKEN,
    process.env.ACCESS_SECRET
);
var nodemailer = require("nodemailer");
var mail = require("nodemailer").mail;
var transport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: process.env.gmailaddress,
        password: process.env.gmailpassword
    }
});

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', {title:'GG+A Social Media'});
};

exports.compile = function(req, res) {
	var tweetlist = [];
	twitter.get('statuses/user_timeline/grenzebachglier',
    function(error, data) {
    	tweets = JSON.parse(data);
        for (i=0; i<tweets.length; i++) {
        	var tweetdate = String(tweets[i].created_at).substr(0,19)
        	tweetlist.push([tweets[i].created_at,tweetdate, tweets[i].text, tweets[i].id_str, "https://twitter.com/GrenzebachGlier/status/"+tweets[i].id_str, "https://twitter.com/intent/retweet?tweet_id="+tweets[i].id_str]);
        }
        
        var today = new Date();
        var weekPast = (today - 604800000)

        var weekTweets = [];

        for (i=0; i<tweetlist.length; i++) {
        	if (Date.parse(tweetlist[i][0]) > weekPast) {
        		weekTweets.push(tweetlist[i])
        	}
        };

        var emailTweets = ""

        for (i=0; i<weekTweets.length; i++) {
        	var tweetbody = "<p style=\"font-size:18px; font-family:Arial;\">" + weekTweets[i][2] + "<br></p>"
        	var tweetdate = "<p style=\"font-size:14px; font-family:Arial;\">" + weekTweets[i][1] +
        		"—" + "<a href=\"" + weekTweets[i][4] + "\">View Tweet</a> — <a href=\"" + weekTweets[i][5] + "\">Retweet<br><br></a>"
        	emailTweets = emailTweets + tweetbody + tweetdate
        }


// Stuff for Nodemailer that isn't working reliably.

        // var subject = "Social Media - Week of " + today.getMonth() + "/" + (today.getUTCDate()-7) + "/" + today.getFullYear()

		// mail({
		//     from: "", // sender address
		//     to: "", // list of receivers
		//     subject: subject, // Subject line
		//     html: emailTweets, // html body
		//     generateTextFromHTML: true
		// });

		res.send(emailTweets)

		// res.send("Email Sent!")

    });	
}