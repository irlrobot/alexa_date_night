module.exports = function (userId, ddbClient, ddbTable) {
  return {
    'LaunchRequest': function () {
      console.log("LaunchRequest fired...");
      this.emit('DateNightIntent');
    },
    'DateNightIntent': function () {
      console.log("DateNightIntent fired...");
      var cuisine = cuisines[Math.floor(Math.random()*cuisines.length)];
          speech = phrases[Math.floor(Math.random()*phrases.length)] + cuisine;
      this.emit(':tellWithCard', speech, SKILL_NAME, cuisine);
      writeNewSuggestions(ddbClient, ddbTable, userId, cuisine);
    },
    'AMAZON.CancelIntent': function () {
      console.log("CancelIntent fired...");
      this.emit(':tell', 'Goodbye.');
    },
    'AMAZON.StopIntent': function () {
      console.log("StopIntent fired...");
      this.emit(':tell', 'Goodbye.');
    }
  };
};

var writeNewSuggestions = function(ddbClient, ddbTable, userId, cuisine) {
  var payload = {
    TableName:ddbTable,
    Key:{
      "user_id": userId
    },
    UpdateExpression: "set last_suggestion.cuisine = :cuisine",
    ExpressionAttributeValues:{
      ":cuisine":cuisine,
    },
    ReturnValues:"UPDATED_NEW"
  };

  console.log("Adding new suggestions.  Payload:  " + JSON.stringify(payload));
  ddbClient.update(payload, function(err, data) {
    if (err) {
      console.error("Unable to update. Error:", JSON.stringify(err, null, 2));
    } else {
      console.log("Update succeeded:", JSON.stringify(data, null, 2));
    }
  });
};
