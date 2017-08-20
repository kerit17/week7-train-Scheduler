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
        console.log("Name: " + name);

     	destination = $('#destination-input').val().trim();
     	console.log("Destination: " + destination);

     	firstTrainTime = $('#first-train-time-input').val().trim();
   		console.log("First Train Time: " + firstTrainTime)

     	frequency = $('#frequency-input').val().trim();

          //convert to 24-hr time
        firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
        console.log("First Train to 24hr: " + firstTimeConverted);

        currentTime = moment();
        console.log("Current Time: " + currentTime)
          
        //convert to minutes
        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("Difference in time: " + diffTime);

        tRemainder = diffTime % frequency;
        console.log(tRemainder);

        minutesTillTrain = frequency - tRemainder;
 
        //convert to minutes
        nextTrain = moment().add(minutesTillTrain, "minutes");
 			
        //convert to 12-hr
        nextTrainFormatted = moment(nextTrain).format("hh:mm");
        console.log("Next Train Time: " + nextTrainFormatted);

     	// Push to Firebase
     	fireBase = dataRef.push({
     		name: name,
     		destination: destination,
     		firstTrainTime: firstTrainTime,  
     		frequency: frequency,
               nextTrainFormatted: nextTrainFormatted,
               minutesTillTrain: minutesTillTrain
     	});
     	console.log("fireBase: " + fireBase);
        //clear all form fields
        $('#name-input').val('');
     	$('#destination-input').val('');
     	$('#first-train-time-input').val('');
     	$('#frequency-input').val('');
     	return false;
    });
 
     //create Firebase event to add train to new row in html
     dataRef.on("child_added", function(childSnapshot) {
        //list of items to append to the schedule
		$('.train-schedule').append("<tr class='table-row' id=" + "'" + childSnapshot.key() + "'" + ">" +
               "<td>" + childSnapshot.val().name +
               "</td>" +
               "<td>" + childSnapshot.val().destination +
               "</td>" +
               "<td>" + childSnapshot.val().frequency +
               "</td>" +
               "<td>" + childSnapshot.val().nextTrainFormatted + 
               "</td>" +
               "<td>" + childSnapshot.val().minutesTillTrain + 
               "</td>" +
          "</tr>");
     });
}); 