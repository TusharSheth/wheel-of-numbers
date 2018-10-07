'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');


// a. the action name from the tell_number Dialogflow intent
const NAME_ACTION = 'tell_number';
// b. the parameters that are parsed from the tell_number intent
const NAME_ARGUMENT = 'Name';
//const NUMBER_ARGUMENT = 'number';

function convertLetterToNumber(str) {
    var out = 0, len = str.length;
    for (var pos = 0; pos < len; pos++) {
        out += (str.charCodeAt(pos) - 64);
    }
    return out;
}

function shuffle(nums) {
    ranNums = [],
        i = nums.length,
        j = 0;

    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        ranNums.push(nums[j]);
        nums.splice(j, 1);
    }
}
exports.wheel_of_numbers = functions.https.onRequest((request, response) => {
    console.log('Request headers: ' + JSON.stringify(request.headers));
    console.log('Request body: ' + JSON.stringify(request.body));
    const app = new App({ request, response });


    // c. The function that generates the silly name
    function getResult(app) {
        let no_of_players = 6;
        if (request.query.text) {
            no_of_players = request.query.text;
        }

        let shuffledArray = shuffle([...Array(no_of_players).keys()]);
        app.tell('Alright, new sequence of numbers is \n' + shuffledArray +
            '\nI hope you like it. See you next time.');
    }
    // d. build an action map, which maps intent names to functions
    let actionMap = new Map();
    actionMap.set(NAME_ACTION, getResult);

    app.handleRequest(actionMap);
});


exports.privacypolicy = functions.https.onRequest((request, response) => {
    response.status(200).send(`<!doctype html>
    <head>
      <title>Privacy Policy</title>
    </head>
    <body>
      <h1>
		Privacy Policy
	  </h1>
	  <ul>
		<li>
			<h4>What information do you collect?</h4>
			<div>This app is created for just fun purpose only. Nothing to ask, nothing to store. Easy!</div>
		</li>
		<li>
			<h4>How do you calculate answers?</h4>
			<div>Just by implementing non-repetative random number generation.</div>
		</li>
		<li>
			<h4>What information do you share?</h4>
			<div>The answer is very simple. <b>Nothing.</b></div>
		</li>
	  </ul>
    </body>
  </html>`);
});