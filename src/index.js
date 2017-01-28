var ALEXA = require('alexa-sdk');
    AWS = require("aws-sdk");
    APP_ID = "amzn1.echo-sdk-ams.app.24d90ad8-0518-4495-b96d-2a77833245b1";
    SKILL_NAME = "Date Night";
    DDB_TABLE = 'date_night_prod';
    DDB_CLIENT = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
  var userId = event.session.user.userId;
      alexa = ALEXA.handler(event, context);
      enUsHandlers = require('./handlers/en-us.handler')(
        userId,
        DDB_CLIENT,
        DDB_TABLE
      );
      cuisines = require('./modules/cuisines');
      phrases = require('./modules/phrases');

  // Logging for debugging
  console.log("Starting Date Night...");
  console.log("UserID is:  " + userId);
  console.log("Intent is:  " + event.request.intent);
  console.log("Locale is:  " + event.request.locale);

  // Invoke skill
  alexa.appId = APP_ID;
  console.log("Registering en-us.handler...");
  alexa.registerHandlers(enUsHandlers);
  alexa.execute();
};
