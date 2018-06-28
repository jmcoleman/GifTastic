
///////////////////////////////////////////
// Variables
///////////////////////////////////////////
var topics = ["clapping", "LOL", "The Incredibles", "cat", "Bob Ross", "summer", "minions", "Nike", "holiday", "mountains", "beaches", "hiking", "sking", "play", "sleep", "movies", "Yoda", "The Office", "Parks and Rec", "college football", "celebration", "Happy Dance", "Favorites"];
var favoriteGIFs = [];

///////////////////////////////////////////
// JavaScript
///////////////////////////////////////////
// function allowDrop(ev) {
//     ev.preventDefault();
// }

// function drag(ev) {
//     ev.dataTransfer.setData("text/plain", ev.target.id);
// }

// function drop(ev) {
//     ev.preventDefault();
//     var data = ev.dataTransfer.getData("text/plain");
//     ev.target.appendChild(document.getElementById(data));
// }


function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
};

function ProperCase(txt) {
    return txt.replace(/\w\S*/g, c => c.charAt(0).toUpperCase() + c.substr(1).toLowerCase());
};

function createTopicButtons()
{
    topics.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    });

    topics.forEach(element => {
        console.log(element);
        
        // add a button for each element in the array
        addTopicButton(element);
    });

};

function addTopicButton(item) {
    //p2.text(ProperCase(results[i].title));                          // Capitalize the first letter of every word
    var properCaseItem = ProperCase(item);

    // add a button
    var newBtn = $("<button>");
    newBtn.attr("id",`topic-${properCaseItem}`)
    newBtn.attr("data-topic",properCaseItem);
    // newBtn.attr("draggable",true);                              // make the button draggable
    // newBtn.attr("ondragstart","drag(event)");                   // make the button draggable
    newBtn.addClass("search-button btn btn-primary btn-md my-2 mx-2");
    newBtn.text(properCaseItem);

    if (item === "Favorites") {
        var attachTo = $("#search-types");
        // newBtn.removeClass("btn-dark");
        // newBtn.addClass("btn-outline-dark");

        //<i class="far fa-star" aria-hidden="true"></i>  fas for solid
        var star = $("<i>");
        star.addClass("fas fa-star text-warning mr-1");
        star.attr("aria-hidden","true");
// newBtn.prepend(star);

// attachTo.append(newBtn);
    } else {
        var attachTo = $("#topic-list");
        attachTo.append(newBtn);
    }
    
}

///////////////////////////////////////////
// JQuery
///////////////////////////////////////////
$(document).ready (function() {

    createTopicButtons();

    //onclick="$('#collapsed-chevron').toggleClass('fa-rotate-180')"
    $("#topic-section").on("click",function() {
        event.preventDefault();
        $('#collapsed-chevron').toggleClass('fa-rotate-180');
    })

    $("#add-topic").on("click", function() {
        event.preventDefault();

        console.log("add topic submit");

        var inputData = $("#topic-input").val().trim();
        $("#topic-input").val("");

        // if a value is given
        if (!isEmpty(inputData)) {

            // if topic is not already in the list
            if (topics.indexOf(inputData) === -1) {
                // adds to array
                topics.push(inputData);

                // add a new button for the topic
                //addTopicButton(inputData);

                // empty all the topics and reload them all
                var t = $("#topic-list");
                t.empty();
                var fav = $("#search-types");
                fav.empty();

                createTopicButtons();

                $("#message").text("");
            } else {
                $("#message").text("Duplicate Topic.");
            }
        }
    });

    $("#topic-list").delegate("button.search-button","click", function() {

        // prevent the page from reloading
        event.preventDefault();

        // clear any messges that remain from adding duplicate topics
        $("#message").text("");
        
        // set up query string
        var topic = $(this).attr("data-topic");
        var itemLimit = 10;
        const USER_API_KEY = "qE5VEI7m7vEyr5u78viHHZEPaPRIkgo8";

        var queryURL = "https://api.giphy.com/v1/gifs/search?" +
            "q=" + topic + 
            "&api_key=" + USER_API_KEY +
            "&limit=" + itemLimit;
        console.log(queryURL);

        // clear current results
        if (document.getElementById("clear-results").checked) {
            $("#gifs").empty();
        }

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
    
            var results = response.data;                                            // data returned from Giphy app
    
            for (var i = 0; i < results.length; i++) {

                /* sample for construction
                <div class="card" style="width:400px">                                               
                    <img class="card-img-top"/>
                    <div class="card-body">
                    <h4 class="card-title">John Doe</h4>
                    <p class="card-text">Some example text some example text. John Doe is an architect and engineer</p>
                    </div>
                </div>
                */

                // construct the HTML that will be added
                var cardDiv = $("<div>");
                cardDiv.addClass("card");

                var gifImageElem = $("<img>");
                gifImageElem.attr("src",results[i].images.fixed_height_still.url);
                if (!isEmpty(results[i].images.title)) {
                    gifImageElem.attr("alt", results[i].images.title.trim());
                } else {
                    gifImageElem.attr("alt", "GIF image");
                };
                gifImageElem.attr("data-static",results[i].images.fixed_height_still.url);
                gifImageElem.attr("data-animated",results[i].images.fixed_height.url);
                gifImageElem.addClass("card-img-top animate");                                      // img-gif

                var cardBodyDiv = $("<div>");
                cardBodyDiv.addClass("card-body");

                var titleElem =  $("<h5>");
                if (!isEmpty(results[i].title)) {
                    titleElem.text(ProperCase(results[i].title.trim()));                          // Capitalize the first letter of every word
                } else {
                    titleElem.text("NONE");
                };

                var ratingElem =  $("<p>");
                ratingElem.addClass("mb-0");
                if (!isEmpty(results[i].rating)) {
                    ratingElem.text("Rated " + results[i].rating.trim().toUpperCase());
                } else {
                    ratingElem.text("Not Rated");
                };

                cardBodyDiv.append(titleElem);
                cardBodyDiv.append(ratingElem);
                cardDiv.append(gifImageElem);
                cardDiv.append(cardBodyDiv);

                // add the elements to the DOM
                $("#gifs").prepend(cardDiv);
    
            };
    
        });

    });

    $("#gifs").delegate(".animate", "click", function() {
        // prevent the page from reloading
        event.preventDefault();

        console.log("GIF ready to animate");

        var currentSrc =  $(this).attr("src");
        var animatedGIF = $(this).attr("data-static");
        var staticGIF = $(this).attr("data-animated");

        console.log(currentSrc);
        console.log(animatedGIF);
        console.log(staticGIF);
        
        if (currentSrc === animatedGIF) {
            $(this).attr("src",staticGIF);    
        } else {
            $(this).attr("src",animatedGIF);
        }

    });

});
