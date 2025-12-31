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

// Automatically update the "Last Updated" text in the footer
const footer = document.querySelector('.site-footer p');
if (footer) {
    const lastMod = new Date(document.lastModified).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    footer.innerHTML += ` • Last updated: ${lastMod}`;
}

/* --- Teaching Page: TOC Dropdown & Smooth Scroll --- */
const tocBtn = document.querySelector('.toc-btn');
const tocContent = document.querySelector('.toc-content');

if (tocBtn && tocContent) {
    // 1. Toggle dropdown on click (for mobile/tablet)
    tocBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        tocContent.classList.toggle('show');
    });

    // 2. Close dropdown if clicking elsewhere
    window.addEventListener('click', () => {
        tocContent.classList.remove('show');
    });

    // 3. Smooth Scroll with Offset
    document.querySelectorAll('.toc-content a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Calculate position: Element position - Height of sticky navs
                const offset = 160; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Hide dropdown after selection
                tocContent.classList.remove('show');
            }
        });
    });
}