const tempBtn = document.getElementById("temp-back-btn");

const eventContainer = document.getElementById("event-container");

const currentDate = localStorage.getItem("currentDate");

const tempObj = [
    {
        date: "02/01/2026",
        title: "Title",
        time: "Time",
        location: "location",
        description: "description"
    },
    {
        date: "01/01/2026",
        title: "Title2",
        time: "Time2",
        location: "location2",
        description: "description2"
    },
]
localStorage.setItem("events", JSON.stringify(tempObj));

const events = JSON.parse(localStorage.getItem("events"));
const eventsOnDate = events.filter(event => event.date === currentDate);

for (const event of eventsOnDate) {
    const template = `
    <section class="event">
        <h3>${event.title}</h3>
        <h4>Time: ${event.time || "_"}</h4>
        <h4>location: ${event.location || "_"}</h4>
        <p>${event.description || "_"}</p>
    </section>`

    eventContainer.innerHTML += template;
}

tempBtn.addEventListener("click", () => {
    console.log(window.location.pathname);
    window.location.href = "../index.html";
})