const currentDateText = document.getElementById("current-date");
const eventContainer = document.getElementById("event-container");
const addBtn = document.getElementById("add-btn");

// CREATE MODAL INPUTS
const createEventWindow = document.getElementById("create-event-modal");
const titleInput = document.getElementById("title-input");
const timeInput = document.getElementById("time-input");
const meridiamInput = document.getElementById("meridiam-input");
const locationInput = document.getElementById("location-input");
const descriptionInput = document.getElementById("description-input");
const confirmEventBtn = document.getElementById("confirm-event-btn");

// DELETING EVENTS
const confirmDelWindow = document.getElementById("confirm-del-modal");
const confirmDelBtn = document.getElementById("confirm-del-btn");
const cancelDelBtn = document.getElementById("cancel-del-btn");

// Swatch colours
const swatchRed = document.getElementById("swatch-red");
const swatchOrange = document.getElementById("swatch-orange");
const swatchYellow = document.getElementById("swatch-yellow");
const swatchGreen = document.getElementById("swatch-green");
const swatchTeal = document.getElementById("swatch-teal");
const swatchBlue = document.getElementById("swatch-blue");
const swatchViolet = document.getElementById("swatch-violet");
const swatchPink = document.getElementById("swatch-pink");
// Currently selected colour
const selectedColour = document.getElementById("selected-colour");

// Alert box
const alertBox = document.getElementById("alert-box");
const alertText = alertBox.querySelector("#alert-text");

const currentDate = localStorage.getItem("currentDate");

let events = [];
let currentIdSelected = 0;
let isEditing = false;
let selectedEventColour = "green";

currentDateText.textContent = (new Date(currentDate)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

try {
    events = JSON.parse(localStorage.getItem("events") || "[]");
} catch (error) {
    console.log("Invalid event storage, resetting");
    localStorage.setItem("events", JSON.stringify([]));
}

function updateEvents() {
    localStorage.setItem("events", JSON.stringify(events));

    const eventsOnDate = events.filter(event => event.date === currentDate);
    console.log(eventsOnDate);
    eventContainer.innerHTML = "";

    for (const event of eventsOnDate) {
        const template = `
        <section id="event-${event.id}" class="event">
            <div class="urgency-status ${event.colour}">
            </div>
            <div>
                ${event.id}
                <h2>${event.title}</h2>
                <h3>Time: ${event.time || "_"}</h3>
                <h3>location: ${event.location || "_"}</h3>
                <p>${event.description || "_"}</p>
            </div>

            <div class="event-btn-container">
                <button class="edit-event-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg></button>
                <button class="del-event-btn"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg></button>
            </div
        </section>`

        eventContainer.innerHTML += template;
    }

    const editEventBtns = document.querySelectorAll(".edit-event-btn");
    for (const btn of editEventBtns) {
        btn.addEventListener("click", () => {
            isEditing = true;

            const closestSection = btn.closest("section")
            const event = events.find(event => `event-${event.id}` === closestSection.id);

            currentIdSelected = event.id;

            const regex = /^(\d{1,2}:\d{2})/;

            titleInput.value = event.title;
            const match = event.time.match(regex);
            timeInput.value = match === null ? "" : match[0];
            // Colour & swatches
            selectedEventColour = event.colour;
            selectedColour.className = event.colour;
            

            meridiamInput.value = event.time.slice(event.time.length - 2) === "am" ? "am" : "pm";
            locationInput.value = event.location;
            descriptionInput.value = event.description;
            
            createEventWindow.classList.toggle("show");
    });
    }

    const delEventBtns = document.querySelectorAll(".del-event-btn");
    for (const btn of delEventBtns) {
        btn.addEventListener("click", () => {
            const idToDel = Number(btn.closest("section").id.slice(6));
            currentIdSelected = idToDel;

            confirmDelWindow.classList.add("show");
        });
    }

    if (eventsOnDate.length === 0) {
        eventContainer.innerHTML += `
        <div id="no-events">
            <h2><i>~No Events~<i></h2>
        </div>`
    }
}

function resetModal() {
    titleInput.value = "New Event";
    timeInput.value = "";
    meridiamInput.value = "am";
    locationInput.value = "";
    descriptionInput.value = "";
}

function changeColour(colour) {
    selectedEventColour = colour; 
    selectedColour.className = colour;
}

addBtn.addEventListener("click", () => {
    resetModal();
    createEventWindow.classList.toggle("show");

    selectedEventColour = "green";
    selectedColour.className = "green";
});

confirmEventBtn.addEventListener("click", () => {
    let eventToChange = {};
    if (isEditing) {
        eventToChange = events.find(event => event.id === currentIdSelected);
        console.log("Event im changing: ", eventToChange);
    } else {

        // If not editing do things exclusive to creating new booking
        try {
            const nextId = Number(localStorage.getItem("nextEventId"));
            console.log(nextId);

            if (Number.isNaN(nextId)) {
                nextId = 1;
            }
            eventToChange.id = nextId;
        } catch (err) {
            eventToChange.id = 1;
        }
        localStorage.setItem("nextEventId", String(eventToChange.id + 1));

        eventToChange.date = currentDate;
        
    }
    eventToChange.colour = selectedEventColour;

    eventToChange.title = titleInput.value;
    eventToChange.time = `${timeInput.value}${meridiamInput.value}`;
    eventToChange.location = locationInput.value;
    eventToChange.description = descriptionInput.value;

    console.log("Event after being changed", eventToChange);

    if (!isEditing) {
        events.push(eventToChange);
    }

    updateEvents();

    createEventWindow.classList.remove("show");
    isEditing = false;
});

timeInput.addEventListener("input", e => {
    // Replace with valid values
    if (!(/:/.test(timeInput.value))) {
        timeInput.value = timeInput.value.replaceAll(" ", ":");
    }
    timeInput.value = timeInput.value.replace(/[^0-9:]/g, "");
});

timeInput.addEventListener("change", () => {
    // Verify time
    const match = timeInput.value.match(/(\d*):(\d*)/);

    let hour = 0;
    let mins = 0;
    if (match) {
        hour = Number(match[1]);
        mins = Number(match[2]);
        // console.log(hour);
        // console.log(min);
    } 
    
    // Verify hours & mins
    try {
        if (Number.isNaN(hour) || hour === undefined || hour === null) {
            throw new Error("Hour and minutes must be numbers on either side of ':'");
        }

        if (hour < 1 || hour > 12) {
            throw new Error("Hour must be between 1-12");
        }

        if (Number.isNaN(mins) || mins === undefined || mins === null) {
            throw new Error("Hour and minutes must be numbers on either side of ':'");
        }

        if (mins < 1 || mins > 59) {
            throw new Error("Minutes must be between 1-59");
        }

        alertBox.classList.remove("show");
        alertText.textContent = "";
    } catch (err) {
        alertBox.classList.add("show");
        alertText.textContent = err;
    }
});

confirmDelBtn.addEventListener("click", () => {
    events = events.filter(event => event.id !== currentIdSelected);

    updateEvents();

    confirmDelWindow.classList.remove("show");
});

cancelDelBtn.addEventListener("click", () => {
    confirmDelWindow.classList.remove("show");
});

swatchRed.addEventListener("click", () => { changeColour("red") });
swatchOrange.addEventListener("click", () => { changeColour("orange") });
swatchYellow.addEventListener("click", () => { changeColour("yellow") });
swatchGreen.addEventListener("click", () => { changeColour("green") });
swatchTeal.addEventListener("click", () => { changeColour("teal") });
swatchBlue.addEventListener("click", () => { changeColour("blue") });
swatchViolet.addEventListener("click", () => { changeColour("violet") });
swatchPink.addEventListener("click", () => { changeColour("pink") });

updateEvents();