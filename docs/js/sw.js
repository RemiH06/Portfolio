let currentPanel = 1;

// icons by devicon
const iconMap = {
  // Lenguajes
  "C#": "devicon-csharp-plain",
  "C++": "devicon-cplusplus-plain",
  CBD: "devicon-cbd-plain", // crearé la solicitud de íconos eventualmente para todos menos para este tipo
  Kotlin: "devicon-kotlin-plain",
  PHP: "devicon-php-plain",
  MySQL: "devicon-mysql-plain",
  SQLite: "devicon-sqlite-plain",
  Python: "devicon-python-plain",
  R: "devicon-r-plain",
  JS: "devicon-javascript-plain",
  Dart: "devicon-dart-plain",
  // Herramientas
  "HTML/CSS": "devicon-html5-plain",
  VS: "devicon-visualstudio-plain",
  "Android Studio": "devicon-androidstudio-plain",
  Gradle: "devicon-gradle-plain",
  XML: "devicon-xml-plain",
  YAML: "devicon-yaml-plain",
  Hexadecimal: "devicon-hex-plain",
  PyCharm: "devicon-pycharm-plain",
  Jupyter: "devicon-jupyter-plain",
  Quarto: "devicon-rstudio-plain",
  playwright: "devicon-playwright-plain",
  selectolax: "",
  tidyverse: "",
  beautifulsoup: "",
  requests: "",
  IDM: "",
  FastAPI: "devicon-fastapi-plain",
  selenium: "devicon-selenium-plain",
  Flutter: "devicon-flutter-plain",
  React: "devicon-react-original",
  "Node.js": "devicon-nodejs-plain",
  Airflow: "devicon-apacheairflow-plain",
  Kafka: "devicon-apachekafka-original",
  Docker: "devicon-docker-plain",
  NetworkX: "devicon-networkx-plain",
  Streamlit: "devicon-streamlit-plain",
  "Jetpack Compose": "devicon-jetpackcompose-plain-wordmark",
  Jira: "devicon-jira-plain",
  LaTeX: "devicon-latex-original",
  MatplotLib: "devicon-latex-original",
  Neo4j: "devicon-neo4j-plain",
  pandas: "devicon-pandas-plain",
  plotly: "devicon-plotly-plain",
  postman: "devicon-postman-plain",
  postgreSQL: "devicon-postgresql-plain",
  // API
  "Riot Games API": "devicon-openapi-plain",
  Octokit: "devicon-github-plain",
  "YouTube API": "devicon-openapi-plain",
  "Spotify API": "devicon-openapi-plain",
  "Discord API": "devicon-openapi-plain",
  "OpenAI API": "devicon-openapi-plain",
  "Overpass": "devicon-openapi-plain",
  "Open-Meteo API": "devicon-openapi-plain",
  "TomTom": "devicon-openapi-plain",
  "Nothing SDK": "",
  // Modelado
  catboost: "",
  Scikit: "devicon-scikitlearn-plain",
  PyTorch: "devicon-pytorch-original",
  TensorFlow: "devicon-tensorflow-original",
  Keras: "devicon-keras-plain",
  NumPy: "devicon-numpy-plain",
  "Ray RLib": "",
  Gymnasium: "",
  YOLO: "",
};

// devuelve las clases de devicon (sin duplicados) de todos los lenguajes y herramientas de un proyecto
function getProjectIconClasses(project) {
  const seen = new Set();
  return [...project.lenguajes, ...project.herramientas]
    .map((name) => iconMap[name])
    .filter((cls) => cls && !seen.has(cls) && seen.add(cls));
}

function getProjectIcons(project) {
  return getProjectIconClasses(project)
    .map((cls) => `<i class="${cls} colored"></i>`)
    .join("");
}

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
      <a href="${project.github}" class="github-button" target="_blank">
        <span>Go to</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.25 3.44 9.68 8.19 11.29.6.11.81-.26.81-.58v-2.06c-3.33.72-4.03-1.61-4.03-1.61-.54-1.36-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.46-1.34-5.46-5.97 0-1.32.47-2.4 1.25-3.24-.13-.31-.54-1.56.12-3.25 0 0 1.02-.32 3.34 1.24a11.51 11.51 0 0 1 3.03-.41c1.02 0 2.05.14 3.02.41 2.32-1.56 3.34-1.24 3.34-1.24.67 1.69.25 2.94.12 3.25.78.84 1.25 1.92 1.25 3.24 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22v3.28c0 .32.2.69.81.58 4.76-1.61 8.19-6.03 8.19-11.28 0-6.63-5.37-12-12-12z"></path></svg>
      </a>
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
      <div class="tech-icons-band">${getProjectIcons(project)}</div>
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
        panelNumber + 1
      })">&#x2193;</button>
    `;
    container.appendChild(panel);

    // 2) Crear ítems de la burger
    const li = document.createElement("li");
    li.classList.add("sidebar-item");
    li.dataset.panel = panelNumber;

    // hasta CUATRO devicon (sin duplicados); si algo no tiene ícono, se salta
    const sidebarIcons = getProjectIconClasses(project)
      .slice(0, 4)
      .map((cls) => `<i class="${cls} colored"></i>`)
      .join("");

    li.innerHTML = `
    <span class="sidebar-name">${project.nombre}</span>
    <div class="sidebar-icons">
      ${sidebarIcons}
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

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    scrollToPanel(currentPanel + 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    scrollToPanel(currentPanel - 1);
  }
});

// deja scrollear dentro del piso; bloquea el wheel solo cuando ya no hay más
// contenido para scrollear en esa dirección, para que no salte al siguiente piso
document.getElementById("scrollContainer").addEventListener(
  "wheel",
  (event) => {
    const panel = event.target.closest(".panel");
    if (!panel) return;

    const scrollingDown =
      event.deltaY > 0 &&
      panel.scrollTop + panel.clientHeight < panel.scrollHeight;
    const scrollingUp = event.deltaY < 0 && panel.scrollTop > 0;

    if (!scrollingDown && !scrollingUp) event.preventDefault();
  },
  { passive: false }
);