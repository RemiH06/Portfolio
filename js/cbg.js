let currentPanel = 1;
const totalPanels = 10;
let isScrolling = false;

async function loadProjects() {
    const response = await fetch('./json/sw.json');
    const projects = await response.json();
    const container = document.getElementById('scrollContainer');

    projects.forEach((project, index) => {
        const panel = document.createElement('div');
        panel.classList.add('panel');
        panel.id = `panel${index + 2}`;
        panel.innerHTML = `
            <a href="${project.github}" class="github-button" target="_blank">
                <span>Go to</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.25 3.44 9.68 8.19 11.29.6.11.81-.26.81-.58v-2.06c-3.33.72-4.03-1.61-4.03-1.61-.54-1.36-1.33-1.73-1.33-1.73-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.77.42-1.3.76-1.6-2.67-.3-5.46-1.34-5.46-5.97 0-1.32.47-2.4 1.25-3.24-.13-.31-.54-1.56.12-3.25 0 0 1.02-.32 3.34 1.24a11.51 11.51 0 0 1 3.03-.41c1.02 0 2.05.14 3.02.41 2.32-1.56 3.34-1.24 3.34-1.24.67 1.69.25 2.94.12 3.25.78.84 1.25 1.92 1.25 3.24 0 4.64-2.8 5.66-5.48 5.96.43.37.82 1.1.82 2.22v3.28c0 .32.2.69.81.58 4.76-1.61 8.19-6.03 8.19-11.28 0-6.63-5.37-12-12-12z"></path></svg>
            </a>
            <h1>${project.nombre}</h1>
            <h2>Author(s): ${project.autor} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Status: ${project.status} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Genre: ${project.genero.join(', ')} &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp; Players: ${project.njugadores.join(', ')}</h2>
            <p><strong>Description:</strong> ${project.descripcion}</p>
            <p><strong>Rules:</strong> ${project.reglas}</p>
            <div class="imagenes-proyecto">
                ${project.imagenes.map(img => `
                    <div class="image-item">
                        <img src="${img.src}" alt="Project img">
                        <h3 class="caption">${img.caption}</h3>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(panel);
    });
}

loadProjects();

function scrollToPanel(panelNumber) {
    const targetPanel = document.getElementById(`panel${panelNumber}`);
    if (targetPanel) {
        targetPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        currentPanel = panelNumber;
    }
}

document.addEventListener('wheel', (event) => {
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
