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

// EDIT MODAL INPUTS
const editEventWindow = document.getElementById("edit-event-modal");
const titleEditValue = document.getElementById("title-edit-input");
const timeEditValue = document.getElementById("time-edit-input");
const meridiamEditValue = document.getElementById("meridiam-edit-input");
const locationEditValue = document.getElementById("location-edit-input");
const descriptionEditValue = document.getElementById("description-edit-input");
const confirmEditBtn = document.getElementById("confirm-edit-btn");

// DELETING EVENTS
const confirmDelWindow = document.getElementById("confirm-del-modal");
const confirmDelBtn = document.getElementById("confirm-del-btn");
const cancelDelBtn = document.getElementById("cancel-del-btn");

const currentDate = localStorage.getItem("currentDate");
console.log(currentDate);

currentDateText.textContent = (new Date(currentDate)).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric"
});

let events = [];
let currentIdSelected = 0;

try {
    events = JSON.parse(localStorage.getItem("events") || "[]");
} catch (error) {
    console.log("Invalid event storage, resetting");
    localStorage.setItem("events", JSON.stringify([]));
}

function updateEvents() {
    const eventsOnDate = events.filter(event => event.date === currentDate);

    eventContainer.innerHTML = "";

    for (const event of eventsOnDate) {
        const template = `
        <section id="event-${event.id}" class="event">
            <div class="urgency-status low">
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
        addListenerToEditBtn(btn);
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


addBtn.addEventListener("click", () => {
    createEventWindow.classList.toggle("show");
});

// localStorage.removeItem("events");
// localStorage.removeItem("nextEventId");


confirmEventBtn.addEventListener("click", () => {
    const newEvent = {}

    try {
        console.log(localStorage.getItem("nextEventId"));
        const nextId = Number(localStorage.getItem("nextEventId"));

        if (!Number.isNaN(nextId)) {
            newEvent.id = nextId;
        } else {
            newEvent.id = 1;
        }
    } catch (err) {
        newEvent.id = 1;
    }

    localStorage.setItem("nextEventId", ++newEvent.id);

    newEvent.date = currentDate;
    newEvent.title = titleInput.value;
    newEvent.time = `${timeInput.value}${meridiamInput.value}`;
    newEvent.location = locationInput.value;
    newEvent.description = descriptionInput.value;

    console.log(newEvent);

    events.push(newEvent);
    localStorage.setItem("events", JSON.stringify(events, "utf8"));

    updateEvents();

    createEventWindow.classList.remove("show");
});

timeInput.addEventListener("input", e => {
    const regex = /^[0-9:]{1,5}$/; // acceptable values;

    if ((timeInput.value[timeInput.value.length - 1]) === " ") {
        const before = timeInput.value.slice(0, timeInput.value.length - 1);
        timeInput.value = before + ":";
    }
});

// for (const btn of editEventBtns) {
//     addListenerToEditBtn(btn);
// }

function addListenerToEditBtn(editBtn) {
    editBtn.addEventListener("click", () => {
        const closestSection = editBtn.closest("section")
        const event = events.find(event => `event-${event.id}` === closestSection.id);

        currentIdSelected = event.id;

        const regex = /^(\d{1,2}:\d{2})/;

        titleEditValue.value = event.title;
        const match = event.time.match(regex);
        timeEditValue.value = match === null ? "" : match[0];
        meridiamEditValue.value = event.time.slice(event.time.length - 2) === "am" ? "am" : "pm";
        locationEditValue.value = event.location;
        descriptionEditValue.value = event.description;
        
        editEventWindow.classList.toggle("show");
    });
}


confirmEditBtn.addEventListener("click", () => {
    const event = events.find(e => e.id === currentIdSelected);

    event.title = titleEditValue.value;
    event.time = `${timeEditValue.value}${meridiamEditValue.value}`;
    event.location = locationEditValue.value;
    event.description = descriptionEditValue.value;

    updateEvents();

    editEventWindow.classList.remove("show");
});

confirmDelBtn.addEventListener("click", () => {
    events = events.filter(event => event.id !== currentIdSelected);

    updateEvents();

    confirmDelWindow.classList.remove("show");
});

cancelDelBtn.addEventListener("click", () => {
    confirmDelWindow.classList.remove("show");
});

updateEvents();