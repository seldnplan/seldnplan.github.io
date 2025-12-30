/* --- Mobile Menu Logic --- */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('show');
        
        // Toggle the icon between 'bars' and 'xmark'
        const icon = this.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
}

/* --- BibTeX Copy Logic --- */
function copyBibtex(id, btn) {
    const bibtex = document.getElementById(id).innerText;
    navigator.clipboard.writeText(bibtex).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = original, 2000);
    });
}