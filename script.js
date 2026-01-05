document.addEventListener("DOMContentLoaded", function() {
    
    /* --- 1. Mobile Menu Logic --- */
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('show');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-xmark');
        });
    }

    /* --- 2. Automated Dark Mode Logic --- */
    const themeBtn = document.querySelector('.theme-toggle') || (() => {
        const btn = document.createElement('button');
        btn.classList.add('theme-toggle');
        btn.setAttribute('aria-label', 'Toggle Dark Mode');
        document.body.appendChild(btn);
        return btn;
    })();

    const setTheme = (isDark) => {
        // Sync with root <html> element
        document.documentElement.classList.toggle('dark-mode', isDark);
        themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Initial check (Syncing button icon with current state)
    setTheme(document.documentElement.classList.contains('dark-mode'));

    themeBtn.addEventListener('click', () => {
        const isCurrentlyDark = document.documentElement.classList.contains('dark-mode');
        setTheme(!isCurrentlyDark);
    });

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
                    const offset = 140; 
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    tocContent.classList.remove('show');
                }
            });
        });
    }

    /* --- 4. Active Section Highlighting (Observer) --- */
    const observerOptions = { rootMargin: '-20% 0px -70% 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
                document.querySelectorAll('.toc-content a').forEach(a => {
                    a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '800' : '500';
                });
            }
        });
    }, observerOptions);

    document.querySelectorAll('section[id], .pub-card[id], .project-card[id]').forEach(el => observer.observe(el));

    /* --- 5. Automatic 'New'/'Updated' Badge Logic --- */
    const cards = document.querySelectorAll('.pub-card[data-date], .project-card[data-date]');
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const today = new Date(); 

    cards.forEach(card => {
        const dateValue = card.getAttribute('data-date');
        const updateDate = new Date(dateValue);
        const statusType = card.getAttribute('data-status'); 

        if (today - updateDate < thirtyDaysInMs) {
            const container = card.querySelector('.badge-container');
            if (container && !container.querySelector('.new-badge, .updated-badge')) {
                const badge = document.createElement('span');
                if (statusType === 'updated') {
                    badge.className = 'status-badge updated-badge'; 
                    badge.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Updated';
                } else {
                    badge.className = 'new-badge';     
                    badge.innerHTML = '<i class="fa-solid fa-sparkles"></i> New';
                }
                container.appendChild(badge);
            }
        }
    });

    /* --- 6. Search Logic --- */
    const searchInput = document.getElementById('pageSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            document.querySelectorAll('.pub-card, .project-card').forEach(card => {
                const isMatch = card.textContent.toLowerCase().includes(query);
                card.classList.toggle('card-hidden', !isMatch);
            });
        });
    }

    /* --- 7. Last Updated Footer --- */
    const footerText = document.querySelector('.site-footer p');
    if (footerText && !footerText.innerHTML.includes('Site last updated')) {
        const lastMod = new Date(document.lastModified).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
        footerText.innerHTML += ` <span class="footer-divider">|</span> Site last updated: ${lastMod}`;
    }
});

/* --- Global Functions (Keep outside DOMContentLoaded) --- */

function copyBibtex(id, btn) {
    const bibtexElement = document.getElementById(id);
    if (!bibtexElement) return;

    navigator.clipboard.writeText(bibtexElement.innerText).then(() => {
        const originalContent = btn.innerHTML;
        btn.classList.add('copied');
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.innerHTML = originalContent;
        }, 2000);
    });
}

// Card URL Copy Logic
document.addEventListener('click', function(e) {
    const anchor = e.target.closest('.card-anchor');
    if (anchor) {
        e.preventDefault();
        const cardId = anchor.getAttribute('href');
        const fullUrl = window.location.origin + window.location.pathname + cardId;
        
        navigator.clipboard.writeText(fullUrl).then(() => {
            const icon = anchor.querySelector('i');
            const originalClass = icon.className;
            icon.className = 'fa-solid fa-check';
            setTimeout(() => icon.className = originalClass, 2000);
        });
    }
});