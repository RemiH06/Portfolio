let currentPanel = 1;
let isScrolling = false;

// icons by devicon
const iconMap = {
  // Lenguajes
  'C#':          'devicon-csharp-plain',
  'CBD':         'devicon-cbd-plain',
  'Kotlin':      'devicon-kotlin-plain',
  'PHP':         'devicon-php-plain',
  'MySQL':       'devicon-mysql-plain',
  'SQLite':      'devicon-sqlite-plain',
  'Python':      'devicon-python-plain',
  'R':           'devicon-r-plain',
  'JS':          'devicon-javascript-plain',
  // Herramientas
  'VS':           'devicon-visualstudio-plain',
  'Android Studio':'devicon-androidstudio-plain',
  'Gradle':       'devicon-gradle-plain',
  'XML':          'devicon-xml5-plain',
  'Riot Games API': 'devicon-json-plain',
  'Hexadecimal':   'devicon-hexadecimal-plain',
  'Jupyter':       'devicon-jupyter-plain',
  'Quarto':        'devicon-rstudio-plain',
  'playwright':    'devicon-playwright-plain',
  'selectolax':    null,
  'tidyverse':     null,
  'beautifulsoup': null,
  'requests':      null,
  'IDM':           null,
  'HTML/CSS':      'devicon-html5-plain',
  'Octokit':       'devicon-github-plain',
  'selenium':      'devicon-selenium-plain',
  'catboost':      'devicon-kaggle-plain'
};

async function loadProjects() {
  const response = await fetch("./json/sw.json");
  const projects = await response.json();
  const container = document.getElementById("scrollContainer");
  const sidebarList = document.getElementById("sidebar-list");

  projects.forEach((project, index) => {
    const panelNumber = index + 2;

    // 1) Crear paneles
    const panel = document.createElement("div");
    panel.classList.add("panel");
    panel.id = `panel${panelNumber}`;
    panel.innerHTML = `
      <a href="${project.github}" class="github-button" target="_blank">…</a>
      <h1>${project.nombre}</h1>
      <h2>
        Author(s): ${project.autor}
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        Status: ${project.status}
        &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
        Langs & Tools: ${project.lenguajes.join(
          ", "
        )} | ${project.herramientas.join(", ")}
      </h2>
      <p><strong>Description:</strong> ${project.descripcion}</p>
      <div class="imagenes-proyecto">
        ${project.imagenes
          .map(
            (img) => `
          <div class="image-item">
            <img src="${img.src}" alt="Project img">
            <h3 class="caption">${img.caption}</h3>
          </div>
        `
          )
          .join("")}
      </div>
      <button class="down" onclick="scrollToPanel(${
        panelNumber + 2
      })">&#x2193;</button>
    `;
    container.appendChild(panel);

    // 2) Crear ítems de la burger
    const li = document.createElement("li");
    li.classList.add("sidebar-item");
    li.dataset.panel = panelNumber;

    // íconos de hasta DOS lenguajes
    const langIcons = project.lenguajes
      .slice(0, 2)
      .map((lang) => {
        const cls = iconMap[lang];
        return cls ? `<i class="${cls} colored"></i>` : `<span>${lang}</span>`;
      })
      .join("");

    // icono de la PRIMERA herramienta
    const firstTool = project.herramientas[0] || "";
    const toolHtml = iconMap[firstTool]
      ? `<i class="${iconMap[firstTool]} colored"></i>`
      : `<span class="tool-name">${firstTool}</span>`;

    li.innerHTML = `
    <span class="sidebar-name">${project.nombre}</span>
    <div class="sidebar-icons">
      ${langIcons}
      ${toolHtml}
    </div>
  `;
    sidebarList.appendChild(li);
  });

  // 3) Click en ítems de la burger
  document.querySelectorAll(".sidebar-item").forEach((item) => {
    item.addEventListener("click", () => {
      const target = Number(item.dataset.panel);
      scrollToPanel(target);
      document.getElementById("sidebar").classList.remove("open");
    });
  });
}

// 4) Toggle sidebar
document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});

loadProjects();

function scrollToPanel(panelNumber) {
  const targetPanel = document.getElementById(`panel${panelNumber}`);
  if (targetPanel) {
    targetPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    currentPanel = panelNumber;
  }
}

document.addEventListener("wheel", (event) => {
  if (isScrolling) return;
  isScrolling = true;
  setTimeout(() => {
    isScrolling = false;
  }, 500);

  if (event.deltaY > 0 && currentPanel < Infinity) {
    currentPanel++;
  } else if (event.deltaY < 0 && currentPanel > 1) {
    currentPanel--;
  }
  scrollToPanel(currentPanel);
});
