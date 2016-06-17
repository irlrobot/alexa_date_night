/*jslint node: true */
/*jshint multistr: true */
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
        var city = intent.slots.City.value,
            activity = intent.slots.Activity.value,
            speech,
            selection,
            speechOutput,
            repromptOutput = {
                speech: "You can try asking me where you should go for \
                  dinner in Chicago as an example.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            },
            cardTitle = "Date Night Suggestion";

        console.log('======Input Debugging:');
        console.log(city);
        console.log(activity);

        if (city && activity) {
          try {
              selection = activities[city.toLowerCase()][activity.toLowerCase()][
                  Math.floor(Math.random()*activities[
                      city.toLowerCase()][activity.toLowerCase()].length)];
          } catch (err) {} // TODO better error handling when looking up activities
        }

        console.log('=====Selection Debugging:');
        console.log(selection);
        if (selection) {
            console.log('Found a selection...');
            speechOutput = {
                speech: selection,
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.tellWithCard(speechOutput, cardTitle, selection);
        } else if (!selection && !city) {
            console.log('No city specified!');
            speechOutput = {
                speech: "Sorry, you must specify a city.  Try Chicago, for example.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        } else if (!selection && !activity) {
            console.log('No activity specified!');
            speechOutput = {
                speech: "Sorry, you must specify an activity.  Try saying dinner \
                    or indoor activity, for example.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        } else {
            console.log('Something weird happened.');
            speechOutput = {
                speech: "I'm sorry, please try asking me for a Date Night \
                  suggestion again.",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
            };
            response.ask(speechOutput, repromptOutput);
        }
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        console.log('StopIntent starting...');
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        console.log('CancelIntent starting...');
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        console.log('HelpIntent starting...');
        var speechText = "You can ask me for suggestions on activities in \
        your city. For example, try asking me, where should we go for a dive bar \
        in Chicago? ..., or, you can say exit... Now, what can I help you find?";
        var repromptText = "You can say things like, what activity in Chicago \
          should we do? ..., or, you can say exit... Now, what can I help you with?";
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
