// static divs for the time with data id's

// day object that has a date, array of time objects = to data id's , each time object has an event
var dataArray = [];

var now = moment();
//time and date  from moment js
$("#date-time").css("font-weight", "bold");
function update() {
  $("#date-time").text(moment().format(" MMM Do, YYYY hh:mm:ss A"));
}
setInterval(update, 1000);

$("#date").text(now.format("MMM Do, YYYY"));

//load data from local storage
function loadData() {
  dataArray = JSON.parse(localStorage.getItem("data"));
  if (dataArray === null) {
    dataArray = [];
  }
  console.log(dataArray);
}

//this function sets up the page as intended for the view
function init() {
  loadData();
  for (var i = 0; i <= 8; i++) {    //9 time slots
    // appending div and spans and adding classes and attributes
    var textAreaItem = dataArray.find(function (item) {
      return item.id == i;
    });
    var row = $("<div>");
    row.addClass("row no-gutters");
        var timeCol = $("<div>");
        timeCol.addClass("col-md-2 col-4 time-slot mb-2");
            var timeSpan = $("<span>");
            timeSpan.text(formatTime(i + 9));
        timeCol.append(timeSpan);

    var eventCol = $("<div>");
    eventCol.addClass("col-md-9 col-8  event");
        var eventText = $("<textarea>");
        // eventText.addClass("textarea");
        eventText.attr("id", i);
        eventText.val(textAreaItem && textAreaItem.value);
    eventCol.append(eventText);

    var btnCol = $("<div>");
    btnCol.addClass("col-md-1 col-12");
        var button = $("<button>");
        button.addClass("btn btn-block");
        button.text("save");
        button.attr("data-id", i);
    btnCol.append(button);
    //check if it's past 6pm
    if(now.hour() > 17){
      //it's now the next day
      $("#date").text(moment().add(1,"days").format("MMM Do, YYYY"));
      eventText.addClass("future");
      
    }else{
      if (now.hour() > i + 9) {
        eventText.addClass("past");
        eventText.attr("disabled","disabled");
        // button.css("display","none")
      } else if (now.hour() == i + 9) {
        eventText.addClass("present");
      } else {
        eventText.addClass("future");
      }
    }
    //append all elements
    row.append(timeCol, eventCol, btnCol);
    $(".container").append(row);
  }
}

// formats time into am /pm formart
function formatTime(time) {
  var eveningTime = time - 12;
  if (time > 12) {
    return `${eveningTime}:00pm`;
  } else {
    return `${time}:00am`;
  }
}

function buttonClick() {
  var buttonId = $(this).attr("data-id");
  var textAreaId = $("textarea");
  for (var i = 0; i < textAreaId.length; i++) {
    if (textAreaId[i].id === buttonId) {
      if (typeof checkId(buttonId) === "undefined") {
        saveNewItem(buttonId, textAreaId[i].value);
      } else {
        replaceItem(checkId(buttonId), buttonId, textAreaId[i].value);
      }
      console.log(dataArray);
      localStorage.setItem("data", JSON.stringify(dataArray));
    }
  }
}

//check if in data function and returns the index if found
function checkId(id) {  
  // dataArray.find(function(item){
  // })
  for (var i = 0; i < dataArray.length; i++) {
    if (dataArray[i].id.includes(id)) {
      
      return i;
    }
  }
}

//save function
function saveNewItem(id, value) {
  dataArray.push({
    id: id,
    value: value,
  });
}

//replace function
function replaceItem(index, id, value) {
  dataArray.splice(index, 1);
  dataArray.push({
    id: id,
    value: value,
  });
}

init();

$(".btn").click(buttonClick);