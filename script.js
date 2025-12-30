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

/* --- Dark Mode Logic --- */
const themeBtn = document.createElement('button');
themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
themeBtn.classList.add('theme-toggle');
document.body.appendChild(themeBtn);

// Check for saved preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
}

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    
    // Update Icon and Save preference
    themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});