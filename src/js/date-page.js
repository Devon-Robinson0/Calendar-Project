const currentDateText = document.getElementById("current-date");
const eventContainer = document.getElementById("event-container");
const addBtn = document.getElementById("add-btn");

// localStorage.removeItem("events");

// CREATE MODAL INPUTS
const createEventWindow = document.getElementById("create-event-modal");
const titleInput = document.getElementById("title-input");
const timeStartInput = document.getElementById("time-start-input");
// Date inputs
const startDate = document.getElementById("start-date");
const endDate = document.getElementById("end-date");

// all day checkbox
const allDayCheckbox = document.getElementById("all-day-checkbox");

// time options - duration
// const durationInput = document.getElementById("duration-input");
// durationInput.disabled = true;
// time options - to
const timeFinishType = document.getElementById("time-finish-type");
const timeEndInput = document.getElementById("time-end-input");
// time options - duration
const durationInput = document.getElementById("duration-input");
// rest
const locationInput = document.getElementById("location-input");
const descriptionInput = document.getElementById("description-input");
const confirmEventBtn = document.getElementById("confirm-event-btn");
const cancelEventBtn = document.getElementById("cancel-event-btn");

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

// Time options
const toContainer = document.getElementById("to-container");
const durationContainer = document.getElementById("duration-container");

// Repeating
const repeatOption = document.getElementById("repeat-dropdown");
const repeatUntilSelect = document.getElementById("repeat-until-select");
const repeatUntilDate = document.getElementById("repeat-until-date");

// DOW checkboxes
const mondayCheckbox = document.getElementById("monday-checkbox");
const tuesdayCheckbox = document.getElementById("tuesday-checkbox");
const wednesdayCheckbox = document.getElementById("wednesday-checkbox");
const thursdayCheckbox = document.getElementById("thursday-checkbox");
const fridayCheckbox = document.getElementById("friday-checkbox");
const saturdayCheckbox = document.getElementById("saturday-checkbox");
const sundayCheckbox = document.getElementById("sunday-checkbox");

// Alert box
const alertBox = document.getElementById("alert-box");
const alertText = alertBox.querySelector("#alert-text");

const currentDate = localStorage.getItem("currentDate");

let events = [];
let currentIdSelected = 0;
let isEditing = false;
let selectedEventColour = "green";

const errors = {
    title: null,
    startTime: null,
    endTime: null,
    startDate: null,
    endDate: null,
    duration: null,
};

timeFinishType.value = "to";
toContainer.hidden = false;
durationContainer.hidden = true;

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

    console.log(currentDate);
    const eventsOnDate = events.filter(event => { return event.startDate <= currentDate && event.endDate >= currentDate })
    console.log(eventsOnDate);
    eventContainer.innerHTML = "";

    for (const event of eventsOnDate) {
        const timeString = event.allDayCheckbox ? "All Day" : `${event.startDate}<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m560-240-56-58 142-142H160v-80h486L504-662l56-58 240 240-240 240Z"/></svg>${event.endDate}`;
        console.log(event.allDayCheckbox);

        const template = `
        <section id="event-${event.id}" class="event">
            <div class="urgency-status ${event.colour}">
            </div>
            <div class="event-information">
                ${event.id}
                <h2>${event.title}</h2>
                <div class="time-container">
                    <h3>${timeString}</h3>
                </div>
                <h3>location: ${event.location || "_"}</h3>
                <p class="event-description">${event.description || "_"}</p>
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
            startDate.value = event.startDate;
            endDate.value = event.endDate;
            allDayCheckbox.checked = event.allDayCheckbox;

            timeStartInput.disabled = event.allDayCheckbox;
            timeStartInput.disabled = event.allDayCheckbox;
            timeFinishType.disabled = event.allDayCheckbox;

            if (!event.allDayCheckbox) {
                timeStartInput.value = event.startTime;

                if (event.endTime === null) {
                    switchTimeInputType("duration");
                    durationInput.value = event.duration;
                    console.log(durationInput);
                } else if (event.duration === null) {
                    switchTimeInputType("to");
                    if (event.endTime) {
                        console.log(event.endTime);
                        timeEndInput.value = event.endTime;
                    }
                } else {
                    console.log("Not reconised time finish value");
                }
            }
            
            // Colour & swatches
            selectedEventColour = event.colour;
            selectedColour.className = event.colour;

            // Repeat
            if (event.repeat.every !== "never") {
                mondayCheckbox.checked = event.repeat.monday;
                tuesdayCheckbox.checked = event.repeat.tuesday;
                wednesdayCheckbox.checked = event.repeat.wednesday;
                thursdayCheckbox.checked = event.repeat.thursday;
                fridayCheckbox.checked = event.repeat.friday;
                saturdayCheckbox.checked = event.repeat.saturday;
                sundayCheckbox.checked = event.repeat.sunday;

                repeatOption.value = event.repeat.every;
                repeatUntilSelect.value = event.repeat.forever ? "forever" : "until";
                repeatUntilDate.hidden = false;
                repeatUntilDate.value = event.repeat.until;
            } else {
                repeatUntilDate.hidden = true;
            }

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

function getTime(string) {
    const regex = /^(\d{2}:\d{2})/;

    return string.match(regex)[1];
}

function resetModal() {
    titleInput.value = "New Event";

    allDayCheckbox.checked = false;
    timeStartInput.disabled = false;
    timeFinishType.disabled = false;
    timeEndInput.disabled = false;

    timeFinishType.value = "to";
    durationInput.value = "1:00";

    switchTimeInputType("to");

    startDate.value = currentDate;
    endDate.value = currentDate;
    timeStartInput.value = "";
    timeEndInput.value = "";
    locationInput.value = "";
    descriptionInput.value = "";

    selectedEventColour = "green";
    selectedColour.className = "green";

    // Checkboxes
    mondayCheckbox.checked = false;
    tuesdayCheckbox.checked = false;
    wednesdayCheckbox.checked = false;
    thursdayCheckbox.checked = false;
    fridayCheckbox.checked = false;
    saturdayCheckbox.checked = false;
    sundayCheckbox.checked = false;

    // Repeat dropdown
    repeatOption.value = "never";
    repeatUntilSelect.value = "forever";
    repeatUntilDate.hidden = true;
    repeatUntilDate.value = currentDate;
}

function dateToLocaleString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function changeColour(colour) {
    selectedEventColour = colour; 
    selectedColour.className = colour;
}

function updateAlert() {
    const activeErrors = Object.values(errors).filter(Boolean);

    if (activeErrors.length > 0) {
        alertBox.classList.add("show");
        alertText.textContent = activeErrors[activeErrors.length - 1];
        return;
    }

    alertBox.classList.remove("show");
    alertText.textContent = "";
}

function isLeapYear(year) {
    return ((year % 4 === 0) && !(year % 100 === 0)) || (year % 400 === 0);
}

function replaceSpaceWithColon(input) {
    // Replace with valid values
    if (!(/:/.test(input.value))) {
        input.value = input.value.replaceAll(" ", ":");
    }
    input.value = input.value.replace(/[^0-9:]/g, "");
}

function convertHoursToMins(hours) {
    return hours * 60;
}

addBtn.addEventListener("click", () => {
    resetModal();
    createEventWindow.classList.toggle("show");
});

confirmEventBtn.addEventListener("click", () => {
    const activeErrors = Object.values(errors).filter(Boolean);
    if (activeErrors.length > 0) {
        if (!alertBox.classList.contains("flash")) {
            alertBox.classList.toggle("flash");
            setTimeout(() => {
                alertBox.classList.toggle("flash");
            }, 500);
        }
        return;
    }

    // Create event / set event to one being edited
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
    }
    eventToChange.colour = selectedEventColour;

    eventToChange.title = titleInput.value;
    eventToChange.startDate = startDate.value;
    eventToChange.endDate = endDate.value;
    eventToChange.allDayCheckbox = allDayCheckbox.checked;
    eventToChange.startTime = null;
    eventToChange.endTime = null;
    if (!allDayCheckbox.checked) {
        eventToChange.startTime = timeStartInput.value;
        switch (timeFinishType.value) {
            case "to":
                eventToChange.duration = null;
                eventToChange.endTime = timeEndInput.value;
                break;
            case "duration":
                eventToChange.endTime = null;
                eventToChange.duration = durationInput.value;
                console.log("Duration value: ", durationInput.value);
                break;
        }
    }
    eventToChange.repeat = {
        every: repeatOption.value,
        forever: repeatUntilSelect.value === "forever" ? true : false,
        until: repeatUntilDate.value,
        monday: mondayCheckbox.checked,
        tuesday: tuesdayCheckbox.checked,
        wednesday: wednesdayCheckbox.checked,
        thursday: thursdayCheckbox.checked,
        friday: fridayCheckbox.checked,
        saturday: saturdayCheckbox.checked,
        sunday: sundayCheckbox.checked,
    }
    console.log("Repeat Obj: ", eventToChange.repeat);

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

cancelEventBtn.addEventListener("click", () => {
    for (const err in errors) {
        errors[err] = null;
    }
    isEditing = false;
    updateAlert();
    resetModal();
    createEventWindow.classList.remove("show");
});

titleInput.addEventListener("change", () => {
    try {
        if (titleInput.value.trim() === "") {
            throw new Error("Your title must not be empty");
        }

        errors.title = null;
        updateAlert();
    } catch (err) {
        errors.title = err;
        updateAlert();
    }
});

durationInput.addEventListener("input", e => {
    replaceSpaceWithColon(durationInput);
});

timeStartInput.addEventListener("change", () => {
    // validateTimeInput(timeStartInput, "startTime");

    try {
        checkFinishTime();

        errors.startTime = null;
        updateAlert();
    } catch (err) {
        errors.startTime = err;
        updateAlert();
    }
});

timeEndInput.addEventListener("change", () => {
    // validateTimeInput(timeEndInput, "endTime");

    try {
        checkFinishTime();

        errors.endTime = null;
        updateAlert();
    } catch (err) {
        errors.endTime = err;
        updateAlert();
    }
});

durationInput.addEventListener("change", () => {
    validateTimeInput(durationInput, "duration");
    console.log("Change");
});

function checkFinishTime() {
    if (timeEndInput.value === "" || timeStartInput.value === "") return;

    const startTimeInMins = convert24HourTimeToMins(timeStartInput.value);
    console.log(startTimeInMins);
    const endTimeInMins = convert24HourTimeToMins(timeEndInput.value);
    console.log(endTimeInMins);

    if (endTimeInMins < startTimeInMins) {
        throw new Error("End time must be after start time");
    }
}

function validateTimeInput(input, errorKey) {
    // Verify hours & mins
    if (!(input.value === "")) {
        try {
            const match = input.value.match(/^(\d{1,2}):(\d{2})$/);
            console.log(match);

            let hour = 0;
            let mins = 0;
            if (match) {
                hour = Number(match[1]);
                mins = Number(match[2]);
            }  else {
                throw new Error("Duration must match format XX:XX");
            }
            if (hour < 1 || hour > 24) {
                throw new Error("Hour must be between 1-24");
            }
            if (mins < 0 || mins > 59) {
                throw new Error("Minutes must be between 1-59");
            }

            const totalMins = convertHoursToMins(hour) + mins;
            const startTimeMins = convert24HourTimeToMins(timeStartInput.value);
            const remainingMins = 1440 - totalMins - startTimeMins;
            if (remainingMins < 0) {
                throw new Error("Duration must fit within day, hours left: " + convertMinsToHours(1440 - startTimeMins));
            }

            errors[errorKey] = null;
            updateAlert();
        } catch (err) {
            errors[errorKey] = err;
            updateAlert();
        }
    } else {
        errors[errorKey] = null;
        updateAlert();
    }
}

function convert24HourTimeToMins(time) {
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    const [hour, mins] = [Number(match[1]), Number(match[2])];
    return (hour * 60) + mins;
}

function convertMinsToHours(mins) {
    const hours = Math.floor(mins / 60);
    mins = mins % 60;
    return `${hours}:${mins}`;
}

confirmDelBtn.addEventListener("click", () => {
    events = events.filter(event => event.id !== currentIdSelected);

    updateEvents();

    confirmDelWindow.classList.remove("show");
});

cancelDelBtn.addEventListener("click", () => {
    confirmDelWindow.classList.remove("show");
});

startDate.addEventListener("change", () => {
    try {
        if (!startDate.checkValidity()) {
            throw new Error("Start date is not valid");
        }

        errors.startDate = null;
        updateAlert();
    } catch (err) {
        errors.startDate = err;
        updateAlert();
    }
});

endDate.addEventListener("change", () => {
    try {
        if (!endDate.checkValidity()) {
            throw new Error("End date is not valid");
        }
        const start = new Date(startDate.value);
        const end = new Date(endDate.value);
        if (end < start) {
            throw new Error("End date must be after start date");
        }

        errors.endDate = null;
        updateAlert();
    } catch (err) {
        errors.endDate = err;
        updateAlert();
    }
});

allDayCheckbox.addEventListener("click", () => {
    if (allDayCheckbox.checked) {
        timeStartInput.disabled = true;
        timeEndInput.disabled = true;
        timeFinishType.disabled = true;
    } else {
        timeStartInput.disabled = false;
        timeEndInput.disabled = false;
        timeFinishType.disabled = false;
    }
});

timeFinishType.addEventListener("change", () => {
    switchTimeInputType(timeFinishType.value);
});

function switchTimeInputType(type) {
    if (type === "to") {
        toContainer.hidden = false;
        durationContainer.hidden = true;
    } else if (type === "duration") {
        toContainer.hidden = true;
        durationContainer.hidden = false;
    } else {
        console.error("Could not find timeFinishType value of: ", timeFinishType.value);
        return;
    }

    timeFinishType.value = type;
}

repeatUntilSelect.addEventListener("change", () => {
    if (repeatUntilSelect.value === "forever") {
        repeatUntilDate.hidden = true;
    } else if (repeatUntilSelect.value === "until") {
        repeatUntilDate.hidden = false;
    }
});

startDate.value = currentDate;
endDate.value = currentDate;

swatchRed.addEventListener("click", () => { changeColour("red") });
swatchOrange.addEventListener("click", () => { changeColour("orange") });
swatchYellow.addEventListener("click", () => { changeColour("yellow") });
swatchGreen.addEventListener("click", () => { changeColour("green") });
swatchTeal.addEventListener("click", () => { changeColour("teal") });
swatchBlue.addEventListener("click", () => { changeColour("blue") });
swatchViolet.addEventListener("click", () => { changeColour("violet") });
swatchPink.addEventListener("click", () => { changeColour("pink") });

updateEvents();