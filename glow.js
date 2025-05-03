document.addEventListener("DOMContentLoaded", () => {
    const colorMap = {
      "hex-image":      "209,209,209",   // blanco                  #D1D1D1
      "rants-image":    "140,0,18",      // rojo                    #8C0012
      "gallery-image":  "253,197,23",    // amarillo-anaranjado     #FDC517   
      "cv-image":       "93,230,84",     // verde                   #5DE654
      "projects-image": "100,209,253",   // celeste                 #64D1FD
      "t100-image":     "142,0,166",     // morado                  #8E00A6
      "lambda-image":   "253,142,237"    // rosa                    #FD8EED
    };
  
    const htmlEl = document.documentElement;
  
    Object.entries(colorMap).forEach(([imgId, rgb]) => {
      const img = document.getElementById(imgId);
      if (!img) return;
  
      img.addEventListener("mouseenter", () => {
        // actualiza la variable y añade la clase
        htmlEl.style.setProperty("--glow-color", rgb);
        htmlEl.classList.add("page-glow");
      });
  
      img.addEventListener("mouseleave", () => {
        // quita la clase (se mantendrá el valor de --glow-color, pero sin glow)
        htmlEl.classList.remove("page-glow");
      });
    });
  });
  