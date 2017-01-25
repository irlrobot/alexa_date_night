module.exports = {
  'LaunchRequest': function () {
    console.log("LaunchRequest fired...");
    this.emit('DateNightIntent');
  },
  'DateNightIntent': function () {
    console.log("DateNightIntent fired...");
    var cuisine = cuisines[Math.floor(Math.random()*cuisines.length)];
        speech = phrases[Math.floor(Math.random()*cuisines.length)];
    this.emit(':tellWithCard', speech + cuisine, SKILL_NAME, cuisine);
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
