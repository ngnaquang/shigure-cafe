document.addEventListener('DOMContentLoaded', () => {

    // Sticky header behavior with hide/show on scroll
    const header = document.querySelector('.main-header');
    let headerHeight = header.offsetHeight;
    let lastScrollY = window.scrollY;
    let scrollThreshold = 50;
    let scrollTimeout;
    
    // Function to update body padding based on header height
    function updateHeaderPadding() {
        headerHeight = header.offsetHeight;
        // Don't add padding to body as it affects page-header sections
        // Instead, we'll use increased padding in the page-header CSS
        document.documentElement.style.setProperty('--header-height', headerHeight + 'px');
    }
    
    // Apply initial body padding to prevent content from being hidden under header
    updateHeaderPadding();
    
    // Handle scroll events with improved performance
    window.addEventListener('scroll', function() {
        // Detect scroll direction
        const currentScrollY = window.scrollY;
        
        // Clear the timeout if it's set
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        // Set a timeout to run after scrolling ends
        scrollTimeout = window.requestAnimationFrame(function() {
            if (currentScrollY > lastScrollY) {
                // Scrolling down - hide header after passing threshold
                if (currentScrollY > headerHeight + scrollThreshold) {
                    header.style.transform = 'translateY(-100%)';
                }
            } else {
                // Scrolling up - show header
                header.style.transform = 'translateY(0)';
            }
            
            // Compact header style when scrolled
            if (currentScrollY > scrollThreshold) {
                header.style.padding = '0.5rem 0';
                header.style.backgroundColor = 'rgba(245, 240, 230, 0.98)';
            } else {
                header.style.padding = '1rem 0';
                header.style.backgroundColor = 'rgba(245, 240, 230, 0.95)';
            }
            
            lastScrollY = currentScrollY;
        });
    });
    
    // Update header padding when window is resized
    window.addEventListener('resize', function() {
        updateHeaderPadding();
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Intersection Observer for scroll animations
    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // When the element is in view
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing it after animation
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    // Select all elements that should be animated
    const animatedElements = document.querySelectorAll('.anim-fade-in');
    animatedElements.forEach(el => animationObserver.observe(el));
    
    // Update current hours based on day of week
    function updateHours() {
        const hoursSnippet = document.querySelector('.hours-snippet p');
        if (!hoursSnippet) return;
        
        const now = new Date();
        const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const hours = now.getHours();
        
        let openUntil = '';
        
        // Set closing times based on day of week
        switch(day) {
            case 0: // Sunday
                openUntil = '5:00 PM';
                break;
            case 5: // Friday
            case 6: // Saturday
                openUntil = '8:00 PM';
                break;
            default: // Monday-Thursday
                openUntil = '6:00 PM';
        }
        
        // Check if we're closed today
        if (day === 0 && hours >= 17) { // Sunday after 5pm
            hoursSnippet.textContent = "We're Closed Today";
        } else if (day >= 1 && day <= 4 && hours >= 18) { // Mon-Thu after 6pm
            hoursSnippet.textContent = "We're Closed Today";
        } else if ((day === 5 || day === 6) && hours >= 20) { // Fri-Sat after 8pm
            hoursSnippet.textContent = "We're Closed Today";
        } else {
            hoursSnippet.textContent = `We're Open Until ${openUntil}`;
        }
    }
    
    updateHours();
});