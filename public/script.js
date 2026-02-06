// Wedding Invitation - Main JavaScript
// Performance optimized with lazy loading and efficient DOM manipulation

'use strict';

// Prevent scrolling when modal is open
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // SLIDESHOW GENERATION
    // ============================================
    const slideshowContainer = document.querySelector('.slideshow-background');
    const totalImages = 20;
    
    // Create slides dynamically with lazy loading
    for (let i = 1; i <= totalImages; i++) {
        const slide = document.createElement('div');
        slide.className = 'slide';
        if (i === 1) slide.classList.add('active'); // First slide is active
        slide.style.backgroundImage = `url('./image (${i}).jpg')`;
        
        // Add loading attribute for better performance
        slide.setAttribute('data-loaded', i === 1 ? 'true' : 'false');
        
        // Insert before the overlay
        slideshowContainer.insertBefore(slide, slideshowContainer.querySelector('.overlay'));
    }
    
    // ============================================
    // MODAL & SCROLL LOCK
    // ============================================
    // Add modal-open class to body when page loads
    document.body.classList.add('modal-open');
    
    // Welcome Modal & Enter Button
    const welcomeModal = document.getElementById('welcomeModal');
    const enterBtn = document.getElementById('enterBtn');
    
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            // First, scroll to top instantly
            window.scrollTo({
                top: 0,
                behavior: 'instant'
            });
            
            // Then hide modal and remove scroll lock
            welcomeModal.classList.add('hidden');
            document.body.classList.remove('modal-open');
            
            // Optional: Start music when entering
            const music = document.getElementById('backgroundMusic');
            const musicIcon = document.querySelector('.music-icon');
            
            if (music) {
                music.play()
                    .then(() => {
                        // Update icon when music plays successfully
                        if (musicIcon) {
                            musicIcon.classList.add('playing');
                            musicIcon.classList.remove('paused');
                        }
                    })
                    .catch(e => {
                        console.log('Auto-play prevented by browser');
                        // If auto-play is blocked, ensure icon is in paused state
                        if (musicIcon) {
                            musicIcon.classList.remove('playing');
                            musicIcon.classList.add('paused');
                        }
                    });
            }
        });
        
        // Add keyboard support for accessibility
        enterBtn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                enterBtn.click();
            }
        });
    }
    
    // ============================================
    // BACKGROUND SLIDESHOW
    // ============================================
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    function showNextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
        
        // Preload next image for smooth transition
        const nextSlide = (currentSlide + 1) % slides.length;
        if (slides[nextSlide].getAttribute('data-loaded') === 'false') {
            slides[nextSlide].setAttribute('data-loaded', 'true');
        }
    }
    
    // Change slide every 5 seconds
    const slideshowInterval = setInterval(showNextSlide, 5000);
    
    // Pause slideshow when page is not visible (performance optimization)
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(slideshowInterval);
        }
    });
    
    // ============================================
    // MUSIC TOGGLE
    // ============================================
    const musicToggle = document.getElementById('musicToggle');
    const music = document.getElementById('backgroundMusic');
    const musicIcon = document.querySelector('.music-icon');
    
    // Sync icon state with music state on page load
    if (music && musicIcon) {
        // Listen to play and pause events from audio element
        music.addEventListener('play', function() {
            musicIcon.classList.add('playing');
            musicIcon.classList.remove('paused');
        });
        
        music.addEventListener('pause', function() {
            musicIcon.classList.remove('playing');
            musicIcon.classList.add('paused');
        });
        
        // Handle audio loading errors
        music.addEventListener('error', function() {
            console.error('Error loading audio file');
        });
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', function() {
            if (music.paused) {
                music.play()
                    .then(() => {
                        musicIcon.classList.add('playing');
                        musicIcon.classList.remove('paused');
                    })
                    .catch(e => {
                        console.error('Failed to play audio:', e);
                    });
            } else {
                music.pause();
                musicIcon.classList.remove('playing');
                musicIcon.classList.add('paused');
            }
        });
        
        // Keyboard support
        musicToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                musicToggle.click();
            }
        });
    }
    
    // ============================================
    // COUNTDOWN TIMER
    // ============================================
    const weddingDate = new Date('2026-02-11T10:00:00+07:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        if (distance < 0) {
            // Wedding day has passed
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
            document.getElementById('days').textContent = String(days).padStart(2, '0');
            document.getElementById('hours').textContent = String(hours).padStart(2, '0');
            document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
            document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
        });
    }
    
    // Update countdown immediately
    updateCountdown();
    
    // Then update every second
    const countdownInterval = setInterval(updateCountdown, 1000);
    
    // ============================================
    // GIFT SECTION TOGGLE
    // ============================================
    const groomBtn = document.getElementById('groomBtn');
    const brideBtn = document.getElementById('brideBtn');
    const groomGift = document.getElementById('groomGift');
    const brideGift = document.getElementById('brideGift');
    
    if (groomBtn && brideBtn) {
        groomBtn.addEventListener('click', function() {
            groomBtn.classList.add('active');
            brideBtn.classList.remove('active');
            groomBtn.setAttribute('aria-selected', 'true');
            brideBtn.setAttribute('aria-selected', 'false');
            
            if (groomGift && brideGift) {
                groomGift.classList.add('active');
                brideGift.classList.remove('active');
            }
        });
        
        brideBtn.addEventListener('click', function() {
            brideBtn.classList.add('active');
            groomBtn.classList.remove('active');
            brideBtn.setAttribute('aria-selected', 'true');
            groomBtn.setAttribute('aria-selected', 'false');
            
            if (brideGift && groomGift) {
                brideGift.classList.add('active');
                groomGift.classList.remove('active');
            }
        });
        
        // Keyboard support for tabs
        [groomBtn, brideBtn].forEach(btn => {
            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                }
            });
        });
    }
    
    // ============================================
    // SCROLL INDICATOR
    // ============================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
        
        // Keyboard support
        scrollIndicator.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollIndicator.click();
            }
        });
        
        // Hide scroll indicator after scrolling
        let lastScrollTop = 0;
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
            lastScrollTop = scrollTop;
        }, { passive: true });
    }
    
    // ============================================
    // LAZY LOADING FOR IMAGES (Performance)
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ============================================
    // SMOOTH SCROLL FOR ALL INTERNAL LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ============================================
    // PREVENT ZOOM ON DOUBLE TAP (Mobile)
    // ============================================
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function (event) {
        const now = (new Date()).getTime();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);
    
    // ============================================
    // PERFORMANCE MONITORING (Optional - for debugging)
    // ============================================
    if (window.performance && window.performance.timing) {
        window.addEventListener('load', function() {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Page load time:', pageLoadTime + 'ms');
        });
    }
    
    // ============================================
    // SERVICE WORKER REGISTRATION (Optional - for PWA)
    // ============================================
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(err => {
                    console.log('ServiceWorker registration failed:', err);
                });
        });
    }
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
    console.error('Global error:', e.message);
});

// ============================================
// RESIZE HANDLER (Debounced for performance)
// ============================================
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        // Handle resize events here if needed
        console.log('Window resized');
    }, 250);
}, { passive: true });