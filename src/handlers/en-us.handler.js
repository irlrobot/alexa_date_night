module.exports = function (userId, ddbClient, ddbTable) {
  return {
    'LaunchRequest': function () {
      console.log("LaunchRequest fired...");
      this.emit('DateNightIntent');
    },
    'DateNightIntent': function () {
      console.log("DateNightIntent fired...");

      var cuisine = getCuisine();
          speech = getSpeech();

      // rocket keeps the scope of 'this' when
      // passing the callback to writeNewSuggestions
      writeNewSuggestions(ddbClient, ddbTable, userId, cuisine, () => {
        console.log('Callback fired, sending tellWithCard...');
        this.emit(':tellWithCard', speech + cuisine, SKILL_NAME, cuisine);
      });
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

var getCuisine = function() {
  return cuisines[Math.floor(Math.random()*cuisines.length)];
};

var getSpeech = function() {
  return phrases[Math.floor(Math.random()*phrases.length)];
};

var writeNewSuggestions = function(ddbClient, ddbTable, userId, cuisine, callback) {
  var payload = {
    Key: {
      userId: userId
    },
    TableName : ddbTable,
    AttributeUpdates: {
      last_cuisine: {
        Action: 'PUT',
        Value: cuisine
      }
    },
    ReturnValues: 'UPDATED_NEW'
  };

  console.log("Adding new suggestions.  Payload:  " + JSON.stringify(payload));
  ddbClient.update(payload, function(err, data) {
    console.log("ddbClient.update fired...");
    if (err) {
      console.error("Unable to update. Error:  ", JSON.stringify(err));
      callback();
    } else {
      console.log("Update succeeded:  ", JSON.stringify(data));
      callback();
    }
  });
};
