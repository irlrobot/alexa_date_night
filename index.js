/*jslint node: true */

'use strict';

var AlexaSkill = require('./AlexaSkill'),
    activities = require('./activities');

var APP_ID = 'amzn1.echo-sdk-ams.app.24d90ad8-0518-4495-b96d-2a77833245b1';

/**
 * Alexa is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var Alexa = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
Alexa.prototype = Object.create(AlexaSkill.prototype);
Alexa.prototype.constructor = Alexa;

Alexa.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    /*jshint multistr: true */
    var speechText = "Hello, Date Night can you help find an activity or \
      restaurant. You can ask for a suggestion like, where should we go for \
      brunch in Chicago? or for an outdoor activity suggestion in Chicago? \
      ... Now, what can I help you with?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "For instructions on what you can say, please say help me.";
    response.ask(speechText, repromptText);
};

Alexa.prototype.intentHandlers = {
    "DateNightIntent": function (intent, session, response) {
        console.log('DateNightIntent starting...');
        var city = intent.slots.City.value.toLowerCase(),
            activity = intent.slots.Activity.value.toLowerCase();
        console.log('======Input Debugging:');
        console.log(city);
        console.log(activity);

        var cardTitle = "Date Night Suggestion",
            selection = activities[city][activity][
              Math.floor(Math.random()*activities[city][activity].length)],
            speechOutput,
            repromptOutput;
        console.log('=====Selection Debugging:');
        console.log(selection);
        if (selection) {
            speechOutput = {
                speech: selection,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, selection);
        } else {
            var speech;
            if (selection) {
                /*jshint multistr: true */
                speech = "I'm sorry, I can't find a Date Night suggestion for \
                  that activity or city. What can I help you find?";
            } else {
                /*jshint multistr: true */
                speech = "I'm sorry, please try asking me for a Date Night \
                  suggestion again.";
            }
            speechOutput = {
                speech: speech,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            repromptOutput = {
                speech: "What else can I help you find?",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
        console.log('DateNightIntent finished.');
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        console.log('StopIntent starting...');
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
        console.log('StopIntent finished.');
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        console.log('CancelIntent starting...');
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
        console.log('CancelIntent finished.');
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        console.log('HelpIntent starting...');
        /*jshint multistr: true */
        var speechText = "You can ask me for suggestions on activities in \
        your city. For example try asking me, where should we go for a dive bar \
        in Chicago? ..., or, you can say exit... Now, what can I help you find?";
        /*jshint multistr: true */
        var repromptText = "You can say things like, what activity in Chicago \
          should we do, or you can say exit... Now, what can I help you with?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
        console.log('HelpIntent finished.');
    }
};

exports.handler = function (event, context) {
    console.log('Lambda starting...');
    var dateNight = new Alexa();
    dateNight.execute(event, context);
};
