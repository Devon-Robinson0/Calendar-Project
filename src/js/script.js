const cellContainer = document.getElementById("cell-container");

const year = new Date().getFullYear();
let date = new Date(year, 0, 1);

while (date.getFullYear() === year) {
    // console.log(date.toISOString());
    
    const newCell = document.createElement("div");
    newCell.classList.add("cell");
    newCell.id = date.toLocaleDateString("en-US");

    if ((date.getMonth() + 1) % 2 !== 1) {
        newCell.classList.add("alt");
        console.log(true);
    }

    const cellDate = document.createElement("p");

    cellDate.textContent = String(date.getDate());

    newCell.appendChild(cellDate);
    cellContainer.appendChild(newCell);

    newCell.addEventListener("click", () => {
        localStorage.setItem("currentDate", newCell.id);

        window.location.href = "pages/date-page.html";
    });
    
    date.setDate(date.getDate() + 1);
}