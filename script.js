window.onload = function() {

    const hamburger = document.querySelector('.hamburger');
    const closeIcon = document.querySelector('.close-icon');

    hamburger.addEventListener('click', openMenu);
    closeIcon.addEventListener('click', closeMenu);

    function openMenu() {
        const mobileNav = document.getElementById('mobileNav');
        mobileNav.classList.add('open');
        console.log("Added 'open' class");
    }

    function closeMenu() {
        const mobileNav = document.getElementById('mobileNav');
        mobileNav.classList.remove('open');
        console.log("Removed 'open' class");
    }
};








