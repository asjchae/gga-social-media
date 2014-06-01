var mongoose = require('mongoose');
var Quiz = require('../models/behaviorscenarios')

exports.index = function(req, res){
  res.render('quiz-generator', { title: 'Help A Friend' });
};

exports.postQuiz = function(req, res) {
	var behaviors = req.body.behaviors;
	var allScenarios = ["Annie is hanging out with her friend Tony when he notices that she keeps getting text messages from her boyfriend, George. Even when they are in the middle of a conversation, Annie gets distracted every time her phone buzzes. Annie apologizes and explains that she needs to respond right away to George so that he \"doesn’t get worried,\" especially since she is hanging out with another guy.",
						"Jamie used to go to her friend Patricia’s house everyday after school. Patricia starts to notice that Jamie is spending less and less time with her. Patricia shoots a text one day to Jamie and asks for Jamie to come over. Jamie replies that they can no longer hang out after school because that is \"designated boyfriend time.\"",
						"Carla is self-conscious about her body and has a hard time being confident when clothes shopping. One day, she and her girlfriend, Ruby, go to the mall with a few of their friends. While at the mall, Ruby keeps pointing out that every outfit makes Carla look fat and asking their friends whether or not they agree. Carla just laughs it off like it is a joke, because she doesn’t want her friends to think Ruby is mean.",
						"Dan and Gary go out on a date to a fancy restaurant. Because the dishes cost so much, they decide to pick one entree to split. Dan says he would be okay with anything on the menu except the shrimp dish, because he cares about protecting the ocean wildlife. Gary argues that shrimp is his favorite and orders the dish anyway, claiming that because he is paying, he should have the final say.",
						"Ben and Jenny have just started dating. They go back to Ben’s room after watching a movie, and they start to make out. Ben asks Jenny’s permission to take off her clothes. When she doesn’t answer right away, he says things like, \"But you’re so beautiful\" and \"I thought you were the type of girl who could have fun,\" until she agrees.",
						"Serena and Jess are seniors in high school. After a presentation at school about applying to colleges, Jess mentions that she would like to apply to a film school in Florida. Serena tells her that she shouldn’t, because she wants to go to school in New England and Florida is too far away. When Jess looks upset, Serena gives her a hug and tells her it is just because she cares so much about their relationship.",
						"Ally breaks up with her boyfriend Robert because they have been fighting a lot recently. That night, she gets a text from him saying that she is the only reason he is still around and that he thinks he is going to do something drastic if she doesn’t love him anymore. Afraid of what he is going to do, Ally agrees to stay with him.",
						"Jordan and Katherine are eating lunch with a group of friends when she makes a joke about how he has hat hair. Jordan gives her an angry look and raises his fist as though to hit her. When she looks scared and tries to defend herself, he stops and laughs it off, asking, \"Did you really think I was going to hurt you?\"",
						"Bobby is the ideal eye-candy. He has a stunning smile and a six-pack he likes to show off at all times, especially when around his girlfriend, Marsha. However, lately, even in the 90 degree summer weather, Bobby begins to wear long sweaters. When forced to take his shirt off in swim class Marsha tries to get him out of it and his friend, Trish, notices that he has cuts on his back. When asked about it, Bobby denies that there is anything there.",
						"Rachel and Tommy have a fight over video games. When Tommy loses to Rachel in a close game of Guitar Hero, Rachel tells Tommy that he is worthless because he can’t even win at a silly video game. Tommy challenges Rachel to a rematch, but loses again. Rachel then says, \"I don’t even know why I am dating you. You’re not good at anything.\""
						];

	var allResults = ["Although many people think jealousy is normal in a relationship, George is being overly clingy and distrustful of Annie. The fact that Annie feels the need to respond \"right away\" shows that George is exhibiting controlling behavior. How would George react if Annie didn’t text him back for a few hours? Annie should not have to account for every minute of her time.",
					"It is important for Jamie to spend time with her boyfriend. However, she is allowing him to take over her life. Her boyfriend should be adding happiness to her life, not taking away from it by cutting out the people she loved spending time with before she started dating him. Jamie needs to prioritize her friendships as well as her relationship.",
					"It’s always okay to have laughs with your significant other, but Ruby is going too far. Ruby knows that Carla is self-conscious about her body, but she still chooses to embarrass her in front of their friends. Carla should think about whether she is getting the respect she deserves from Ruby. Ruby is not being sensitive to Carla’s feelings.",
					"Although Gary is paying for the meal, he should still respect Dan’s opinion. There was only one item on the menu that Dan was opposed to - it wasn’t that Gary didn’t like anything else, he just chose to ignore Dan’s one request. If Dan wants to protect the ocean wildlife, Gary should try and be flexible with his food choices. ",
					"Although Ben makes it sound like he is respectful of Jenny’s feelings by asking her permission, he is manipulating her by making her feel like she should want to go farther. Ben should wait for Jenny to make a decision without trying to push her to agree.",
					"Serena makes it sound like she is the one putting their relationship first. However, she is actually telling Jess that she should not follow her dreams. Does Serena really care about what is best for Jess, or is she just trying to control what she does?",
					"Robert is manipulating Ally into staying with him. While he may be telling the truth about his emotions, the solution is to get outside help for him, not for her to get back together with him. No relationship should cause someone to threaten to hurt themselves or their significant other.",
					"Although Jordan is not physically hurting Katherine, he is using gestures to intimidate her. This could easily go the extra mile and lead to Jordan physically hurting Katherine. Playing around with threatening gestures makes Katherine feel insecure in their relationship, and does not build a trusting relationship.",
					"Marsha is hurting Bobby and preventing him from feeling like he can share what is going on with others. This kind of behavior should not be tolerated. Bobby deserves someone who actually cares about his well-being, not someone who abuses him. All forms of physical abuse, no matter how small, are signs of an unhealthy relationship.",
					"Rachel is being insensitive to Tommy’s feelings and putting him down by saying that he isn’t good at anything. By not respecting Tommy, she makes him feel trapped in the relationship, like he would be unable to find another girlfriend and that she is doing him a favor by being his girlfriend."
					];

	var scenarios = [];

	for (var i=0; i<behaviors.length; i++) {
		scenarios.push(allScenarios[behaviors[i]]);
	}

	var results = [];

	for (var i=0; i<behaviors.length; i++) {
		results.push(allResults[i]);
	}

	var newQuiz = new Quiz({behaviors: behaviors, stories: scenarios, results: results});
	newQuiz.save(function (err) {
		if (err) {
			console.log("Error saving new experience", err);
		}
		var id = newQuiz._id;
		res.redirect('/quiz/' + id)
	})
};

exports.survey = function(req, res) {
	var id = req.params._id;
	var quiz = Quiz.find({"_id": id}).exec(function (err, response) {
		if (err) {
			console.log("No Quiz Found"); // Generate error page
		}
		res.render('quiz', {scenarios: response[0].stories, id: id});
	})
};


exports.viewAll = function(req, res){
	var allQuiz = Quiz.find({}).sort({date: -1}).exec(function (err, response) {
		if (err) {
			console.log("Error finding experiences in database", err);
		} else {
			var exp = response;
			res.render('quiz', {title: "Experiences", scenarios: exp});
		}
	});
};

exports.postSurvey = function(req, res) {
	console.log(req.body);

	console.log(req.params._id);

	var choices = req.body.surveychoice;
	var results = [];
	for (var i=0; i<choices.length; i++) {
		if (choices[i] == "depends" || "unhealthy") {
			results.push();
		}
	}

};



exports.postSurvey = function (req, res) {
	var id = req.params._id;
	var results = [];
	var choices = req.body.surveychoice;

	var quiz = Quiz.find({"_id": id}).exec(function (err, response) {

		if (err) {
			console.log("No Quiz Found"); // Generate error page
		}

		for (var i=0; i<choices.length; i++) {
			// console.log(choices[i]);
			if (choices[i] == "depends") {
				console.log(choices[i]);
				results.push([response[0].stories[i], response[0].results[i]]);
			} else if (choices[i] == "healthy") {
				console.log(choices[i]);
				results.push([response[0].stories[i], response[0].results[i]]);
			}


		}

		res.render('results', {title: "Results", results: results});
		
	});


};