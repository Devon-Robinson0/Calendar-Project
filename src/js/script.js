const cellContainer = document.getElementById("cell-container");
// localStorage.removeItem("events");

let events = [];
try {
    events = JSON.parse(localStorage.getItem("events") || "[]");
} catch (err) {
    console.log("Can't find or corrupted events, starting fresh");
    localStorage.setItem("events", JSON.stringify([]));
}

// Get date starting from jan 1st current year
const year = new Date().getFullYear();
let date = new Date(year, 0, 1);

while (date.getFullYear() === year) {
    // Create new cell
    const newCell = document.createElement("div");
    newCell.classList.add("cell");
    newCell.id = date.toLocaleDateString("en-US");

    // Apply styling to every second month
    if ((date.getMonth() + 1) % 2 !== 1) {
        newCell.classList.add("alt");
        console.log(true);
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

const cells = document.querySelectorAll(".cell");
for (const cell of cells) {
    cell.classList.remove("current-date");
}

const currentDate = (new Date()).toLocaleDateString("en-US");
const currentDateCell = document.getElementById(currentDate);
currentDateCell.classList.add("current-date");
currentDateCell.scrollIntoView({
    behavior: "smooth", // or "smooth"
    block: "center"      // "start", "center", "end", "nearest"
});