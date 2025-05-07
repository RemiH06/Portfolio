async function renderTable(jsonPath, tableId, isMobile) {
  const resp = await fetch(jsonPath);
  const items = await resp.json();
  const table = document.getElementById(tableId);
  const tr = document.createElement("tr");

  items.forEach((item) => {
    const td = document.createElement("td");
    td.onclick = () => (window.location.href = item.link);
    td.style.backgroundImage = `url('${item.image}')`;

    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    const p = document.createElement("p");
    p.textContent = item.description;

    td.appendChild(h3);
    td.appendChild(p);

    // rows for mobile
    if (isMobile) {
      const newRow = document.createElement("tr");
      newRow.appendChild(td);
      table.appendChild(newRow);
    } else {
      tr.appendChild(td);
    }
  });

  if (!isMobile) {
    table.appendChild(tr);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderTable("./json/100desktop.json", "desktop-table", false);
  renderTable("./json/100mobile.json", "mobile-table", true);
});
