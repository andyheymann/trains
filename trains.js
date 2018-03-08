

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCwrnJEta04bqCjh5fsuxdvH-B7aOD9Vio",
    authDomain: "trains-dbdec.firebaseapp.com",
    databaseURL: "https://trains-dbdec.firebaseio.com",
    projectId: "trains-dbdec",
    storageBucket: "trains-dbdec.firebaseio.com",
    messagingSenderId: "754201814553"
  };
  firebase.initializeApp(config);

   var trainData = firebase.database();

  //button for adding trains
$('#submitButton').on('click', function(){
  event.preventDefault();
  //gets user input
  var trainName = $('#trainNameInput').val().trim();
  var destination = $('#destinationInput').val().trim();
  var firstTime = moment($('#timeInput').val().trim(), "HH:mm").format("");
  var frequency = $('#frequencyInput').val().trim();

   console.log(trainName);


  //creates local holder for train times
  var newTrains = {
    name: trainName,
    tdestination: destination,
    tFirst: firstTime,
    tfreq: frequency,
  }

  //uploads data to the database
  trainData.ref().push(newTrains);

  //logs everything to the console
   // console.log(newTrains.name);
  // console.log(newTrains.tdestination);
  // console.log(newTrains.tFirst);
  // console.log(newTrains.tfreq);

  //alert
  alert("Train successfully added!");

  //clears all of the text boxes
  $('#trainNameInput').val("");
  $('#destinationInput').val("");
  $('#timeInput').val("");
  $('#frequencyInput').val("");

  return false;
});

//when a new item is added (child) do this function
trainData.ref().on("child_added", function(childSnapshot, prevChildKey){

  // console.log(childSnapshot.val());

  //store everything into a variable
  var trainName = childSnapshot.val().name;
  var destination = childSnapshot.val().tdestination;
  var firstTime = childSnapshot.val().tFirst;
  var frequency = childSnapshot.val().tfreq;

  //train info
   console.log(trainName);
   console.log(destination);
  // console.log(firstTime);
  // console.log(frequency);

  //convert first time (push back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  // console.log(firstTimeConverted);

  //current time
  var currentTime = moment();
  // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  //difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  // console.log("DIFFERENCE IN TIME: " + diffTime);

  //time apart (remainder)
  var tRemainder = diffTime % frequency;
  // console.log(tRemainder);

  //minute until train
  var tMinutesTillTrain = frequency - tRemainder;
  // console.log("MINUTES TIL TRAIN: " + tMinutesTillTrain);

  //next train
  var nextTrain = moment().add(tMinutesTillTrain, "minutes");
  var nextTrainConverted = moment(nextTrain).format("hh:mm a");
  // console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  //add each trains data into the table
  $("#trainTable > tbody").append("<tr><td>" + trainName + "</td><td id='darkrow'>" + destination + "</td><td>" + "Every " + frequency + " minutes" + "</td><td id='darkrow'>" + nextTrainConverted + "</td><td>" + tMinutesTillTrain + "</td></tr>");

});

