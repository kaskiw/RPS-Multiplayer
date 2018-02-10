// Initialize Firebase Database for Game Logic
  var config = {
    apiKey: "AIzaSyDsR5ERs7in-_MWzR04ooA6bAQ4JBAJ3I4",
    authDomain: "rps-games.firebaseapp.com",
    databaseURL: "https://rps-games.firebaseio.com",
    projectId: "rps-games",
    storageBucket: "rps-games.appspot.com",
    messagingSenderId: "1051172867714"
  };
  firebase.initializeApp(config);


//Set Database equal to the firebase database that is in question.
 var database = firebase.database();

firebase.auth().signInAnonymously().catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
});

//Declares playerOne and playerTwo variables.
var playerOne = "";
var playerTwo = "";

//Sets playerOneChosen and playerTwoChosen to false. This boolean will be used to decide what player is logging in. 
database.ref('playerOneChosen').set(false);
database.ref('playerTwoChosen').set(false);

//Listens for any click events on the #submitButton then adds the name to the playerOne field. 
$('#submitName').on('click', function () {
    if (playerOneChosen == false) {
        playerOne = $('#playerName').val().trim();

        //Sets up the anonymous login upon a user entering their name, then pushes all relevant info to the database. 
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                console.log("User is logged in as " + uid);
                database.ref('playerOneID').set(uid);
                database.ref('playerOneName').set(playerOne);
                database.ref('playerOneChosen').set(true);
                console.log("playerOne has connected with userid: " + uid);
                // ...
            } else {
                database.ref('playerOneID').set(undefined);
                database.ref('playerOneName').set(undefined);
                console.log("Player One has left the game!");
            }
            // ...
        });

        //Clears Name Field
        $('#playerName').val("");
    }

    //PLayer Two Logic. Needs work still. 
    else if (database.val('playerOneChosen') == true && playerTwoChosen == false) {
        playerTwo = $('#playerName').val().trim();
        //Sets up the anonymous login upon a user connecting to the page. 
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                var uid = user.uid;
                console.log("User is logged in as " + uid);
                database.ref('playerTwoID').set(uid);
                database.ref('playerTwoName').set(playerTwo);
                console.log("playerTwo has connected with userid: " + uid);
                // ...
            } else {
                database.ref('playerOneID').set(undefined);
                database.ref('playerOneName').set(undefined);
                console.log("Player One has left the game!");
            }
            // ...
        });

        //Sets playerTwoChosen to true so that we know that playerTwo is taken care of. 
        $('#playerName').val("");
        $('.nameField').empty();
        playGame();
    }

    return false;
});

window.onunload = function () {
    database.ref(playerOneName).set(undefined);
    database.ref(playerOneID).set(undefined);
    database.ref(playerTwoName).set(undefined);
    database.ref(playerTwoID).set(undefined);
};

database.ref().on("value", function (snapshot) {
    $('.playerOne').html("<h1>" + snapshot.val().playerOneName + "</h1>");
    $('.playerTwo').html("<h1>" + snapshot.val().playerTwoName + "</h1>");
}, function (errorObject) {
    console.log("failure:" + errorObject.code);
});

function playGame() {
    $('.choiceArea').append("<div class = 'rock'><h2>Rock</h2></div>");
    $('.choiceArea').append("<div class = 'paper'><h2>Paper</h2></div>");
    $('.choiceArea').append("<div class = 'scissors'><h2>Scissors</h2></div>");
}