const cellContainer = document.getElementById("cell-container");

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
        newCell.id = date.toISOString().split("T")[0];

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

        // Find events for current date
        const eventsOnDate = events.filter(event => event.date === date.toLocaleDateString("en-US"));

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

    const bannerTitle = document.createElement("p");
    bannerTitle.textContent = event.title;
    
    banner.appendChild(bannerTitle);
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

const cells = document.querySelectorAll(".cell");
for (const cell of cells) {
    cell.classList.remove("current-date");
}

const currentDateId = currentDate.toISOString().split("T")[0];
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
});

setTimeout(() => {
    window.addEventListener("scroll", () => {
        checkForNewMonths();
    });
}, 2000);


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
    const monthRegex = /^(\d{1,2})\//;
    const yearRegex = /(\d{4}$)/;

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