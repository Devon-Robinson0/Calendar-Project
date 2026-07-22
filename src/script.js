const cellContainer = document.getElementById("cell-container");

const year = new Date().getFullYear();
let date = new Date(year, 0, 1);

while (date.getFullYear() === year) {
    // console.log(date.toISOString());
    
    const newCell = document.createElement("div");
    newCell.classList.add("cell");

    if ((date.getMonth() + 1) % 2 !== 1) {
        newCell.classList.add("alt");
        console.log(true);
    }

    const cellDate = document.createElement("p");

    cellDate.textContent = String(date.getDate());

    cellContainer.appendChild(newCell);
    newCell.appendChild(cellDate);
    
    date.setDate(date.getDate() + 1);
}