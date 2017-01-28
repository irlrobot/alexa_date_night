module.exports = function (userId, ddbClient, ddbTable) {
  return {
    'LaunchRequest': function () {
      console.log("LaunchRequest fired...");
      this.emit('DateNightIntent');
    },
    'DateNightIntent': function () {
      console.log("DateNightIntent fired...");

      var speech = getSpeech();

      // rocket keeps the scope of 'this' when passing the callback
      // read the last suggestions first and pass lastCuisine to next func
      readLastSuggestions(ddbClient, ddbTable, userId, (lastCuisine) => {
        // find a cuisine to recomment that is different than the last
        // and pass that cuisine to the next func
        getCuisine(lastCuisine, (cuisine) => {
          // update the last cuisine for the user
          writeNewSuggestions(ddbClient, ddbTable, userId, cuisine, () => {
            // finish up and send a response with card
            console.log('Callback fired, sending tellWithCard...');
            this.emit(':tellWithCard', speech + cuisine, SKILL_NAME, cuisine);
          });
        });
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

var getCuisine = function(lastCuisine, callback) {
  console.log('lastCuisine was:  ' + lastCuisine);
  if (lastCuisine) {
    var index = cuisines.indexOf(lastCuisine);
    cuisines.splice(index, 1);
    newCuisine = cuisines[Math.floor(Math.random()*cuisines.length)];

    console.log('cuisine choices are now:  ' + cuisines);
    console.log ('newCuisine choice is:  ' + newCuisine);
    callback(newCuisine);
  } else {
      var cuisine = cuisines[Math.floor(Math.random()*cuisines.length)];
      console.log('No previous cuisine for user.  New cuisine is:  ' + cuisine);
      callback(cuisine);
  }
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
      lastCuisine: {
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

var readLastSuggestions = function(ddbClient, ddbTable, userId, callback) {
  var payload = {
    TableName: ddbTable,
    Key:{
      userId: userId
    }
  };

  console.log("Reading last suggestions...");
  ddbClient.get(payload, function(err, data) {
    console.log("ddbClient.read fired...");
    if (err) {
      console.error("Unable to read. Error:  ", JSON.stringify(err));
      callback(false);
    } else {
      if (Object.keys(data).length === 0) {
        console.log("Read succeeded, but no user data found.");
        callback(false);
      } else {
        console.log("Read succeeded:  ", JSON.stringify(data));
        lastCuisine = data.Item.lastCuisine;
        callback(lastCuisine);
      }
    }
  });
};
