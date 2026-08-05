const cellContainer = document.getElementById("cell-container");
// localStorage.removeItem("events");

// Upload ical
const uploadBtn = document.getElementById("upload-btn");
const uploadModal = document.getElementById("upload-modal");
const cancelUploadBtn = document.getElementById("cancel-upload-btn");
const icalInput = document.getElementById("ical-input");

// Hover text for month
const hoverMonthText = document.getElementById("hovering-month-text");

let events = [];
try {
    events = JSON.parse(localStorage.getItem("events") || "[]");
} catch (err) {
    console.log("Can't find or corrupted events, starting fresh");
    localStorage.setItem("events", JSON.stringify([]));
}

// get earlest and latest date from current date
const currentDate = new Date();
const startingEarilestDate = new Date();
const currentLatestDate = new Date();
startingEarilestDate.setDate(currentDate.getDate() - 182);
currentLatestDate.setDate(currentDate.getDate() + 183);

// Set iterator value
let date = new Date(startingEarilestDate);

let dayOfWeek = date.getDay();
if (dayOfWeek === 0) {
    dayOfWeek = 7;
}

// Add spacer cells at start
let emptyCellsAmount = Math.abs(1 - dayOfWeek);
for (let i = 0; i < emptyCellsAmount; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty-cell");

    cellContainer.appendChild(emptyCell);
}

createCellsWithinRange(startingEarilestDate, currentLatestDate);

function createCellsWithinRange(earliestDate, latestDate) {
    while (date >= earliestDate && date <= latestDate) {
        // Create new cell
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.id = dateToLocaleString(date);

        // Apply styling to every second month
        if ((date.getMonth() + 1) % 2 !== 1) {
            newCell.classList.add("alt");
        }

        if ((date.getDay() === 0 || date.getDay() === 6)) {
            newCell.classList.add("weekend");
        }

        // Add number to represent date in month
        const cellDate = document.createElement("p");
        cellDate.textContent = String(date.getDate());
        newCell.appendChild(cellDate);

        // get day of week
        const dayOfWeek = getDayOfWeek(date);

        // Find events for current date
        const eventsOnDate = events.filter(event => {
            if (event.startDate <= newCell.id && event.endDate >= newCell.id) {
                return true;
            }
            const diff = getDifferenceOfDates(event.startDate, event.endDate);
            if (event.repeat.every === "week" && (event.repeat[dayOfWeek] || addDaysToDate(event.lastDateOf, diff) >= newCell.id) && (event.repeat.forever || 
                    (event.repeat.until >= newCell.id && newCell.id > event.startDate))) {
                return true;
            }
        });

        eventsOnDate.forEach(event => {
            if (!event.repeat[dayOfWeek] && event.startDate !== newCell.id) return;

            event.lastDateOf = newCell.id;
            console.log(event.lastDateOf);
        });
        // Create container for banners
        const bannerContainer = document.createElement("div");
        bannerContainer.classList.add("banner-container");

        // Create banner(s) (Max 3) for each day with events
        if (eventsOnDate.length > 0) {
            // Max 3 event banners per cell
            if (eventsOnDate.length > 3) {
                for (let i = 0; i < 3; i++) {
                    createBanner(eventsOnDate[i], newCell, bannerContainer);
                }
            } else {
                for (let i = 0; i < eventsOnDate.length; i++) {
                    createBanner(eventsOnDate[i], newCell, bannerContainer);
                }
            } 
        }

        // Add to cell container
        cellContainer.appendChild(newCell);

        // Add click functionality to go to events for that date
        newCell.addEventListener("click", () => {
            localStorage.setItem("currentDate", newCell.id);

            window.location.href = "pages/date-page.html";
        });
        
        // iterate and loop back
        date.setDate(date.getDate() + 1);
    }
}

function checkLastEventOverlap(currDate, event) {
    // Loop back until a viable date for the start of the last event
        // on same day // before finish date
    // Add the difference to that date to discover when it ends
    // Compare if the current date is equal to or less than the new end
}

function getDifferenceOfDates(date1, date2) {
    const date1AsObj = new Date(date1);
    const date2AsObj = new Date(date2);
    return (date2AsObj - date1AsObj) / (1000 * 60 * 60 * 24);
}

function addDaysToDate(date, days) {
    const dateAsDateObj = new Date(date);
    dateAsDateObj.setDate(dateAsDateObj.getDate() + days);
    console.log("local: ", dateToLocaleString(dateAsDateObj));
    return dateToLocaleString(dateAsDateObj);
}

function getDayOfWeek(date) {
    switch (date.getDay()) {
        case 1:
            return "monday";
            break;
        case 2:
            return "tuesday";
            break;
        case 3:
            return "wednesday";
            break;
        case 4:
            return "thursday";
            break;
        case 5:
            return "friday";
            break;
        case 6:
            return "saturday";
            break;
        case 0:
            return "sunday";
            break;
    }
}

function splitDate(date) {
    const regex = /^(\d{4})-(\d{2})-(\d{2})$/;
    const match = date.match(regex);
    return [Number(match[1]), Number(match[2]), Number(match[3])];
}

function dateToLocaleString(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

dayOfWeek = date.getDay() - 1;
if (dayOfWeek === 0) {
    dayOfWeek = 7;
}

// emptyCellsAmount = 7 - dayOfWeek;
// for (let i = 0; i < emptyCellsAmount; i++) {
//     const emptyCell = document.createElement("div");
//     emptyCell.classList.add("empty-cell");

//     cellContainer.appendChild(emptyCell);
// }

function createBanner(event, cell, container) {
    const banner = document.createElement("div");
    banner.classList.add("banner");
    banner.classList.add(event.colour);

    const eventStartDate = new Date(event.startDate);
    if (isSameDate(eventStartDate, new Date(cell.id))) {
        const bannerTitle = document.createElement("p");
        bannerTitle.textContent = event.title;
        banner.appendChild(bannerTitle);

        banner.classList.add("head");
    }
    
    container.appendChild(banner);
    cell.appendChild(container);
}

function convertNumToMonth(num) {
    let month = "";
    switch (num) {
        case 1 :
            month = "January";
            break;
        case 2 :
            month = "Febuary";
            break;
        case 3 :
            month = "March";
            break;
        case 4 :
            month = "April";
            break;
        case 5 :
            month = "May";
            break;
        case 6 :
            month = "June";
            break;
        case 7 :
            month = "July";
            break;
        case 8 :
            month = "August";
            break;
        case 9 :
            month = "September";
            break;
        case 10 :
            month = "October";
            break;
        case 11 :
            month = "November";
            break;
        case 12 :
            month = "December";
            break;
    }

    return month;
}

function isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

const cells = document.querySelectorAll(".cell");
for (const cell of cells) {
    cell.classList.remove("current-date");
}

const currentDateId = dateToLocaleString(currentDate);
const currentDateCell = document.getElementById(currentDateId);
currentDateCell.classList.add("current-date");
currentDateCell.scrollIntoView({
    behavior: "smooth", // or "smooth"
    block: "center"      // "start", "center", "end", "nearest"
});

uploadBtn.addEventListener("click", ()=> {
    uploadModal.classList.add("show");
});

cancelUploadBtn.addEventListener("click", () => {
    uploadModal.classList.remove("show");
});

icalInput.addEventListener("change", async event => {
    const file = event.target.files[0];

    if (!file) return;
    console.log("name", file.name);

    if (!file.name.endsWith(".ics")) {
        console.log("Wrong file type");
        icalInput.value = "";
        return;
    }

    const content = await file.text();
    console.log(content);

    const titleRegex = /^SUMMARY;LANGUAGE=.*:(.+)/m;
    const title = content.match(titleRegex)[1];
    console.log(title);
});

setTimeout(() => {
    window.addEventListener("scroll", () => {
        checkForNewMonths();
    });
    checkForNewMonths();
}, 1500);


function monthsWithin(month1, month2, dist) {
    const diff = Math.abs(month1 - month2);
    const wrappedDiff = 12 - diff;

    return Math.min(diff, wrappedDiff) <= dist;
}

function checkForNewMonths() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const element = document.elementFromPoint(centerX, centerY)
        ?.closest(".cell");
    
    if (!element) return;

    // regex
    const monthRegex = /^\d{4}-(\d{2})-\d{2}/;
    const yearRegex = /^(\d{4})/;

    const monthNum = Number(element?.id.match(monthRegex)[1]);
    const month = convertNumToMonth(monthNum);

    const year = element?.id.match(yearRegex)[1];
    hoverMonthText.textContent = `${month}, ${year}`;

    if (monthsWithin(monthNum, date.getMonth() + 1 , 2)) {
        console.log("Adding Months");
        createCellsWithinRange(startingEarilestDate, 
            currentLatestDate.setMonth(currentLatestDate.getMonth() + 3));

        const allCells = document.querySelectorAll(".cell");
        console.log(allCells.length);
    }
}

checkForNewMonths();