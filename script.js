document.addEventListener('DOMContentLoaded', () => {
    
    const photoContainers = document.querySelectorAll('.photo-container');
    const imageDialog = document.getElementById('image-dialog');
    const dialogContent = document.querySelector('.dialog-content');
    const dialogImage = document.getElementById('dialog-image');
    const imageTitle = document.getElementById('image-title');
    const imageCounter = document.getElementById('image-counter');
    const originalSizeLink = document.getElementById('original-size-link');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');

    const allImageUrls = Array.from(photoContainers).map(container => 
        container.querySelector('.photo-image').src
    );
    
    let currentImageIndex = 0;
    const totalImages = allImageUrls.length;

    dialogContent.classList.add('hidden');

    function updateDialogImage() {
        if (totalImages === 0) return;

        const currentUrl = allImageUrls[currentImageIndex];
        
        const fileNameMatch = currentUrl.match(/[^/]+$/);
        const fileName = fileNameMatch ? fileNameMatch[0] : 'Bild';

        dialogImage.src = currentUrl;
        dialogImage.alt = fileName;
        imageTitle.textContent = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;
        imageCounter.textContent = `${currentImageIndex + 1}/${totalImages}`;
        originalSizeLink.href = currentUrl;

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
        imageDialog.style.display = 'flex';
        imageDialog.style.alignItems = 'center'; 
        imageDialog.style.justifyContent = 'center';
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => {
            dialogContent.classList.remove('hidden');
        })
    }

    function closeDialog() {
        dialogContent.classList.add('hidden');

        dialogContent.addEventListener('transitionend', function handler() {
            imageDialog.style.display = 'none'; 
            document.body.style.overflow = 'auto';
            
            dialogContent.removeEventListener('transitionend', handler);
        }, { once: true });
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % totalImages;
        updateDialogImage();
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + totalImages) % totalImages;
        updateDialogImage();
    }

    photoContainers.forEach((container, index) => {
        container.addEventListener('click', () => {
            openDialog(index);
        });
    });

    closeButton.addEventListener('click', closeDialog);
    
    imageDialog.addEventListener('click', (event) => {
        if (event.target === imageDialog) {
            closeDialog();
        }
    });

    function toggleMenu() {
        sideMenu.classList.toggle('open');
        document.body.classList.toggle('overlay-active');
    }

    menuToggle.addEventListener('click', toggleMenu);

    sideMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (sideMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && imageDialog.style.display === 'flex') {
            closeDialog();
        } else if (imageDialog.style.display === 'flex') {
            if (event.key === 'ArrowRight') {
                showNextImage();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            }
        }
    });

    prevButton.addEventListener('click', showPrevImage);
    nextButton.addEventListener('click', showNextImage);
});