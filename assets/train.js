//initialize firebase
var url ="https://train-scheduler-wk07.firebaseio.com";
var dataRef = new Firebase(url);

//define variables
var name ='';
var destination = '';
var firstTrainTime = '';
var frequency = '';
var nextTrain = '';
var nextTrainFormatted = '';
var minutesAway = '';
var firstTimeConverted = '';
var currentTime = '';
var diffTime = '';
var tRemainder = '';
var minutesTillTrain = '';

$(document).ready(function() {

     //On Add-Train click function
     $("#add-train").on("click", function() {
     	//Grab user input
          name = $('#name-input').val().trim();
     	destination = $('#destination-input').val().trim();
     	firstTrainTime = $('#first-train-time-input').val().trim();
     	frequency = $('#frequency-input').val().trim();
          //convert to 24-hr time
          firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
          currentTime = moment();
          //convert to minutes
          diffTime = moment().diff(moment(firstTimeConverted), "minutes");
          tRemainder = diffTime % frequency;
          minutesTillTrain = frequency - tRemainder;
          //convert to minutes
          nextTrain = moment().add(minutesTillTrain, "minutes");
          //convert to 12-hr
          nextTrainFormatted = moment(nextTrain).format("hh:mm");

     	// Push to Firebase
     	keyHolder = dataRef.push({
     		name: name,
     		destination: destination,
     		firstTrainTime: firstTrainTime,  
     		frequency: frequency,
               nextTrainFormatted: nextTrainFormatted,
               minutesTillTrain: minutesTillTrain
     	});
          //clear all form fields
          $('#name-input').val('');
     	$('#destination-input').val('');
     	$('#first-train-time-input').val('');
     	$('#frequency-input').val('');
     	return false;
     });
 
     //create Firebase event to add train to new row in html
     dataRef.on("child_added", function(childSnapshot) {
          //list of items to append
		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
               "<td class='col-xs-3'>" + childSnapshot.val().name +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().destination +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().frequency +
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().nextTrainFormatted + 
               "</td>" +
               "<td class='col-xs-2'>" + childSnapshot.val().minutesTillTrain + 
               "</td>" +
          "</tr>");
     });
}); 