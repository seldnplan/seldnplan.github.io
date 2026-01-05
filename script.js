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

   /* --- 2. Automated Dark Mode Logic --- */
    if (!document.querySelector('.theme-toggle')) {
        const themeBtn = document.createElement('button');
        themeBtn.classList.add('theme-toggle');
        themeBtn.setAttribute('aria-label', 'Toggle Dark Mode');
        document.body.appendChild(themeBtn);

        // Helper to set theme
        const setTheme = (isDark) => {
            document.body.classList.toggle('dark-mode', isDark);
            themeBtn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        };

        // 1. Check for saved preference OR system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
            setTheme(true);
        } else {
            setTheme(false);
        }

        // 2. Manual Toggle listener
        themeBtn.addEventListener('click', () => {
            const willBeDark = !document.body.classList.contains('dark-mode');
            setTheme(willBeDark);
        });

        // 3. Listen for System changes (Auto-switch if user hasn't set a manual preference)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) setTheme(e.matches);
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

/* --- 6. Active Section Highlighting --- */
    const observerOptions = { rootMargin: '-20% 0px -70% 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Update Nav links
                document.querySelectorAll('.nav-links a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
                // Update TOC links
                document.querySelectorAll('.toc-content a').forEach(a => {
                    a.style.fontWeight = a.getAttribute('href') === `#${id}` ? '800' : '500';
                });
            }
        });
    }, observerOptions);

    // Track every card and section with an ID
    document.querySelectorAll('section[id], .pub-card[id]').forEach(el => observer.observe(el));

/* --- Automatic 'New' vs 'Updated' Badge Logic --- */
// Updated selector to catch BOTH pub-cards and project-cards
const cards = document.querySelectorAll('.pub-card[data-date], .project-card[data-date]');
const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
const today = new Date(); // December 31, 2025

cards.forEach(card => {
    const dateValue = card.getAttribute('data-date');
    if (!dateValue) return;

    const updateDate = new Date(dateValue);
    const statusType = card.getAttribute('data-status'); 

    if (today - updateDate < thirtyDaysInMs) {
        const container = card.querySelector('.badge-container');
        // Ensure we don't duplicate the badge if it's already there
        if (container && !container.querySelector('.new-badge') && !container.querySelector('.updated-badge')) {
            const badge = document.createElement('span');
            
            if (statusType === 'updated') {
                // Using 'status-badge' as the base for alignment
                badge.className = 'status-badge updated-badge'; 
                badge.innerHTML = '<i class="fa-solid fa-pen-nib"></i> Updated';
            } else {
                // Matches the .new-badge class in your CSS
                badge.className = 'new-badge';     
                badge.innerHTML = '<i class="fa-solid fa-sparkles"></i> New';
            }
            
            container.appendChild(badge);
        }
    }
});

/* --- Deep Search Logic (Parsing Titles + Hidden Abstracts) --- */
document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('pageSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = searchInput.value.toLowerCase();
            const cards = document.querySelectorAll('.pub-card, .project-card');

            cards.forEach(card => {
                // 'textContent' grabs text from hidden abstracts/bibtex blocks
                const text = card.textContent.toLowerCase();
                
                if (text.includes(query)) {
                    card.classList.remove('card-hidden'); //
                } else {
                    card.classList.add('card-hidden'); //
                }
            });
        });
    }
});

/* --- Copy to Clipboard for Individual Cards --- */
document.addEventListener('click', function(e) {
    if (e.target.closest('.card-anchor')) {
        e.preventDefault();
        
        // Construct the full URL
        const anchor = e.target.closest('.card-anchor');
        const cardId = anchor.getAttribute('href');
        const fullUrl = window.location.origin + window.location.pathname + cardId;
        
        // Use the Clipboard API
        navigator.clipboard.writeText(fullUrl).then(() => {
            // Provide visual feedback
            const icon = anchor.querySelector('i');
            const originalClass = icon.className;
            
            icon.className = 'fa-solid fa-check'; // Temporary success icon
            setTimeout(() => {
                icon.className = originalClass; // Revert back
            }, 2000);
        });
    }
});