let currentPanel = 1;
let isScrolling = false;
let totalPanels; 

// icons by devicon
const iconMap = {
  'Arduino':           'devicon-arduino-plain',
  'C++':           'devicon-cplusplus-plain',
  'Raspberry Pi':      'devicon-raspberrypi-plain',
  'Oscilloscope':      'devicon-gnuplot-plain',
  'Multimeter':        'devicon-amazonwebservices-original',
  'VS Code':           'devicon-vscode-plain',
  'KiCad':             'devicon-kicad-plain',
  'Eagle':             null,
  'PCB':               null,
  'ESP32':             'devicon-esp32-plain',
  'NRF24':             'devicon-esp32-plain'
};

async function loadProjects() {
  const response    = await fetch('./json/hw.json');
  const projects    = await response.json();
  const container   = document.getElementById('scrollContainer');
  const sidebarList = document.getElementById('sidebar-list');

  totalPanels = 1 + projects.length;

  projects.forEach((project, index) => {
    const panelNumber = index + 2;

    // 1) Crear paneles
    const panel = document.createElement('div');
    panel.classList.add('panel');
    panel.id = `panel${panelNumber}`;
    panel.innerHTML = `
      <a href="${project.github}" class="github-button" target="_blank">…</a>
      <h1>${project.nombre}</h1>
      <h2>
        Author(s): ${project.autor}
        &nbsp;|&nbsp; Status: ${project.status}
        &nbsp;|&nbsp; Comps & Tools: ${project.componentes.join(', ')} | ${project.herramientas.join(', ')}
      </h2>
      <p><strong>Description:</strong> ${project.descripcion}</p>
      <div class="imagenes-proyecto">
        ${project.imagenes.map(img => `
          <div class="image-item">
            <img src="${img.src}" alt="Project img">
            <h3 class="caption">${img.caption}</h3>
          </div>
        `).join('')}
      </div>
      <button class="down" onclick="scrollToPanel(${panelNumber + 1})">&#x2193;</button>
    `;
    container.appendChild(panel);

    // 2) Crear ítems de la burger
    const li = document.createElement('li');
    li.classList.add('sidebar-item');
    li.dataset.panel = panelNumber;

    // íconos de hasta DOS herramientas
    const compIcons = project.herramientas.slice(0, 2).map(comp => {
      const cls = iconMap[comp];
      return cls
        ? `<i class="${cls} colored"></i>`
        : `<span>${comp}</span>`;
    }).join('');

    // icono del PRIMER componente
    const firstTool = project.componentes[0] || '';
    const toolHtml = iconMap[firstTool]
      ? `<i class="${iconMap[firstTool]} colored"></i>`
      : `<span class="tool-name">${firstTool}</span>`;

    li.innerHTML = `
      <span class="sidebar-name">${project.nombre}</span>
      <div class="sidebar-icons">
        ${compIcons}
        ${toolHtml}
      </div>
    `;
    sidebarList.appendChild(li);
  });

  // 3) Click en ítems de la burger
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = Number(item.dataset.panel);
      scrollToPanel(target);
      document.getElementById('sidebar').classList.remove('open');
    });
  });
}

// 4) Toggle sidebar
document.getElementById('hamburger')
  .addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

loadProjects();

function scrollToPanel(panelNumber) {
  const targetPanel = document.getElementById(`panel${panelNumber}`);
  if (targetPanel) {
    targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    currentPanel = panelNumber;
  }
}

document.addEventListener('wheel', event => {
  if (isScrolling) return;
  isScrolling = true;
  setTimeout(() => { isScrolling = false; }, 500);

  if (event.deltaY > 0 && currentPanel < totalPanels) {
    currentPanel++;
  } else if (event.deltaY < 0 && currentPanel > 1) {
    currentPanel--;
  }
  scrollToPanel(currentPanel);
});
