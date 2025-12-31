document.addEventListener("DOMContentLoaded", function() {
    
    /* --- 1. Mobile Menu Logic --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.replace('fa-bars', 'fa-xmark');
            } else {
                icon.classList.replace('fa-xmark', 'fa-bars');
            }
        });
    }

    /* --- 2. Dark Mode Logic --- */
    // Creates the button if it doesn't exist in HTML
    if (!document.querySelector('.theme-toggle')) {
        const themeBtn = document.createElement('button');
        themeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
        themeBtn.classList.add('theme-toggle');
        themeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
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
    }

    /* --- 3. TOC & Smooth Scroll Logic --- */
    const tocBtn = document.querySelector('.toc-btn');
    const tocContent = document.querySelector('.toc-content');

    if (tocBtn && tocContent) {
        tocBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            tocContent.classList.toggle('show');
        });

        window.addEventListener('click', () => tocContent.classList.remove('show'));

        document.querySelectorAll('.toc-content a').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offset = 140; // Nav + TOC height offset
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
        // Check if the text already contains the update string to avoid duplicates
        if (!footerText.innerHTML.includes('Site last updated')) {
            footerText.innerHTML += ` <span class="footer-divider">|</span> Site last updated: ${lastMod}`;
        }
    }
});

/* --- 5. Unified BibTeX Copy Logic --- */
// This remains a global function so it can be called by 'onclick' in the HTML
function copyBibtex(id, btn) {
    const bibtexElement = document.getElementById(id);
    if (!bibtexElement) return;

    const bibtexText = bibtexElement.innerText;
    
    navigator.clipboard.writeText(bibtexText).then(() => {
        const originalContent = btn.innerHTML;
        
        // Temporarily change button state while maintaining dimensions
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalContent;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy BibTeX: ', err);
    });
}
/* --- Automatic 'New' vs 'Updated' Badge Logic --- */
const cards = document.querySelectorAll('.project-card[data-date]');
const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
const today = new Date(); // Current date: Dec 31, 2025

cards.forEach(card => {
    const updateDate = new Date(card.getAttribute('data-date'));
    const statusType = card.getAttribute('data-status'); // Check for the switch

    if (today - updateDate < thirtyDaysInMs) {
        const container = card.querySelector('.badge-container');
        if (container && !container.querySelector('.status-badge')) {
            const badge = document.createElement('span');
            
            /* --- Corrected Badge Injection --- */
            if (statusType === 'updated') {
                badge.className = 'status-badge updated-badge'; // Inherits 22px height
                badge.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Updated';
            } else {
                badge.className = 'status-badge new-badge';     // Now also 22px height
                badge.innerHTML = '<i class="fa-solid fa-sparkles"></i> New';
            }
            
            container.appendChild(badge);
        }
    }
});