module.exports = {
  'LaunchRequest': function () {
    console.log("LaunchRequest fired...");
    this.emit('PPAPIntent');
  },
  'PPAPIntent': function () {
    console.log("PPAPIntent fired...");
    this.emit(':tellWithCard', lyrics, SKILL_NAME, 'https://www.youtube.com/watch?v=HFlgNoUsr4k');
  },
  'AMAZON.CancelIntent': function () {
    console.log("CancelIntent fired...");
    this.emit(':tell', 'Pen Pineapple Apple Pen!');
  },
  'AMAZON.StopIntent': function () {
    console.log("StopIntent fired...");
    this.emit(':tell', 'Pen Pineapple Apple Pen!');
  }
};
