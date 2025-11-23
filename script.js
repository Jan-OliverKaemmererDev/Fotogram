document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM-Elemente abrufen
    const photoContainers = document.querySelectorAll('.photo-container');
    const imageDialog = document.getElementById('image-dialog');
    const dialogImage = document.getElementById('dialog-image');
    const imageTitle = document.getElementById('image-title');
    const imageCounter = document.getElementById('image-counter');
    const originalSizeLink = document.getElementById('original-size-link');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    // Array aller Bilder-Quellen (URLs)
    const allImageUrls = Array.from(photoContainers).map(container => 
        container.querySelector('.photo-image').src
    );
    
    // Index des aktuell angezeigten Bildes
    let currentImageIndex = 0;
    const totalImages = allImageUrls.length;

    /**
     * Aktualisiert das Bild im Dialogfenster basierend auf dem aktuellen Index.
     */
    function updateDialogImage() {
        if (totalImages === 0) return;

        // Bild-URL und Alt-Text (Dateiname) abrufen
        const currentUrl = allImageUrls[currentImageIndex];
        
        // Den Dateinamen aus der URL extrahieren (z.B. "image-name.jpg" aus "http://.../img/pictures/image-name.jpg")
        const fileNameMatch = currentUrl.match(/[^/]+$/);
        const fileName = fileNameMatch ? fileNameMatch[0] : 'Bild';

        // Elemente aktualisieren
        dialogImage.src = currentUrl;
        dialogImage.alt = fileName;
        imageTitle.textContent = fileName.substring(0, fileName.lastIndexOf('.')) || fileName; // Dateiendung entfernen
        imageCounter.textContent = `${currentImageIndex + 1}/${totalImages}`;
        originalSizeLink.href = currentUrl; // Link zur Originalgröße setzen

        // Animation für Bildwechsel (optional, für sanfteren Übergang)
        dialogImage.style.opacity = '0';
        setTimeout(() => {
            dialogImage.style.opacity = '1';
        }, 50); 
    }

    /**
     * Öffnet das Dialogfenster und zeigt das angeklickte Bild an.
     * @param {number} index - Der Index des angeklickten Bildes.
     */
    function openDialog(index) {
        currentImageIndex = index;
        updateDialogImage();
        imageDialog.style.display = 'flex'; // Dialog anzeigen
        imageDialog.style.alignItems = 'center'; 
        imageDialog.style.justifyContent = 'center';
        document.body.style.overflow = 'hidden'; // Scrollen des Hintergrunds verhindern
    }

    /**
     * Schließt das Dialogfenster.
     */
    function closeDialog() {
        imageDialog.style.display = 'none'; // Dialog ausblenden
        document.body.style.overflow = 'auto'; // Scrollen des Hintergrunds wiederherstellen
    }

    /**
     * Wechselt zum nächsten Bild (mit Wrap-Around).
     */
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateDialogImage();
    }

    /**
     * Wechselt zum vorherigen Bild (mit Wrap-Around).
     */
    function showPrevImage() {
        // (currentImageIndex - 1 + totalImages) sorgt für den Wrap-Around zum letzten Bild
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateDialogImage();
    }

    // 2. Event-Listener für das Öffnen des Dialogs
    photoContainers.forEach((container, index) => {
        container.addEventListener('click', () => {
            openDialog(index);
        });
    });

    // 3. Event-Listener für das Schließen des Dialogs
    closeButton.addEventListener('click', closeDialog);
    
    // Schließen, wenn außerhalb des Dialogfensters geklickt wird
    imageDialog.addEventListener('click', (event) => {
        // Überprüft, ob das Event-Ziel das Overlay selbst ist (nicht der Dialog-Inhalt)
        if (event.target === imageDialog) {
            closeDialog();
        }
    });

    // Schließen bei Drücken der ESC-Taste
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && imageDialog.style.display === 'flex') {
            closeDialog();
        } else if (imageDialog.style.display === 'flex') {
            // Navigation mit Pfeiltasten
            if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    // 4. Event-Listener für die Navigation
    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);
});