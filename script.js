document.addEventListener("DOMContentLoaded", function() {
    
    /* --- 1. Mobile Menu Logic --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    /* --- 2. Dark Mode Logic --- */
    const themeBtn = document.createElement('button');
    themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    themeBtn.classList.add('theme-toggle');
    document.body.appendChild(themeBtn);

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    /* --- 3. TOC & Smooth Scroll Logic --- */
    const tocBtn = document.querySelector('.toc-btn');
    const tocContent = document.querySelector('.toc-content');

    if (tocBtn && tocContent) {
        // Toggle dropdown on click
        tocBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tocContent.classList.toggle('show');
        });

        // Close dropdown when clicking away
        window.addEventListener('click', () => tocContent.classList.remove('show'));

        // Smooth Scroll for all anchor links
        document.querySelectorAll('.toc-content a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offset = 120; // Adjust based on your nav height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    tocContent.classList.remove('show');
                }
            });
        });
    }

    /* --- 4. Automatic Last Updated Footer --- */
    const footerText = document.querySelector('.site-footer p');
    if (footerText) {
        const lastMod = new Date(document.lastModified).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        footerText.innerHTML += ` <span class="footer-divider">|</span> Site last updated: ${lastMod}`;
    }
});

/* --- 5. BibTeX Copy Logic (Global Function) --- */
function copyBibtex(id, btn) {
    const bibtex = document.getElementById(id).innerText;
    navigator.clipboard.writeText(bibtex).then(() => {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => btn.innerHTML = original, 2000);
    });
}