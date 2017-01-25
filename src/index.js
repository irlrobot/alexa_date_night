var Alexa = require('alexa-sdk');
  APP_ID = "amzn1.echo-sdk-ams.app.24d90ad8-0518-4495-b96d-2a77833245b1";
  SKILL_NAME = "Date Night";
  enUsHandlers = require('./handlers/en-us.handler');
  lyrics = require('./modules/lyrics');

exports.handler = function(event, context, callback) {
  console.log("Starting Date Night...");
  console.log("Intent is:  " + event.request.intent);
  var alexa = Alexa.handler(event, context);
  var locale = event.request.locale;
  console.log("Locale is:  " + locale);
  alexa.appId = APP_ID;
  console.log("Registering en-us.handler...");
  alexa.registerHandlers(enUsHandlers);
  alexa.execute();
};
