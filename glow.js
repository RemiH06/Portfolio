document.addEventListener("DOMContentLoaded", () => {
    const colorMap = {
      "hex-image":      "209,209,209",   // blanco                  #D1D1D1
      "rants-image":    "140,0,18",      // rojo                    #8C0012
      "gallery-image":  "253,197,23",    // amarillo-anaranjado     #FDC517   
      "cv-image":       "93,230,84",     // verde                   #5DE654
      "projects-image": "100,209,253",   // celeste                 #64D1FD
      "t100-image":     "142,0,166",     // púrpura                 #8E00A6
      "lambda-image":   "253,142,237",   // rosa                    #FD8EED

      "about-image":    "237,150,19",    // rosa                    #ED9613
      "contact-image":  "28,201,155",    // cyan                    #1CC99B
      "weeb-image":     "159,23,227",    // morado                  #9F17E3

      "vgp-image":      "214,45,32",     // g-red                   #D62D20
      "mal-image":      "0,87,231",      // g-blue                  #0057E7
      "bg-image":       "255,167,0",     // g-yellow                #FFA700
      "cos-image":      "0,135,68",      // g-green                 #008744

      "sw-image":       "0,255,255",     // c                       #00FFFF
      "hw-image":       "255,0,255",     // m                       #FF00FF
      "cbg-image":      "255,255,0",     // y                       #FFFF00
      "misc-image":     "0,0,0"          // k                       #000000
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
  