document.addEventListener('DOMContentLoaded', () => {

    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');

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
});