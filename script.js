// Sticky Navbar & Scroll Spy
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Sticky Class
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Scroll Spy
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Typewriter Effect
const textSpan = document.querySelector('.typing-text');
const words = ["a Data & AI Engineer", "a Vocalist"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
        textSpan.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        textSpan.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
        isDeleting = true;
        setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        setTimeout(type, 500);
    } else {
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

document.addEventListener('DOMContentLoaded', type);

// Smooth Scrolling for Anchors
// Smooth Scrolling for Anchors (excluding project buttons)
document.querySelectorAll('a[href^="#"]:not(.view-project-btn):not(#modalGithubBtn)').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        // Close mobile menu if open
        const navLinks = document.querySelector('.nav-links');
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll Animations (Intersection Observer)
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.section-title, .about-text, .stat-item, .timeline-item, .project-card, .cert-card, .contact-wrapper, .gallery-slide').forEach(el => {
    el.classList.add('fade-in-section');
    observer.observe(el);
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navClose = document.querySelector('.nav-close');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.add('active');
});

navClose.addEventListener('click', () => {
    navLinks.classList.remove('active');
});

// Project Modal Logic
const modal = document.getElementById('projectModal');
const modalContent = modal ? modal.querySelector('.modal-content') : null;
const closeModalBtn = document.getElementById('closeModalBtn');
const projectBtns = document.querySelectorAll('.view-project-btn');

// Intra-Modal Scroll Reveal Observer
const modalObserverOptions = {
    root: modalContent,
    threshold: 0.1
};

const modalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, modalObserverOptions);

// Elements to update in modal
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech = document.getElementById('modalTech');

const modalGithubBtn = document.getElementById('modalGithubBtn');
const modalImg = document.getElementById('modalImg');

projectBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Reset Modal Scroll & Animations
        if (modalContent) {
            modalContent.scrollTop = 0;
            modalContent.querySelectorAll('.modal-reveal-item').forEach(el => {
                el.classList.remove('revealed');
                modalObserver.observe(el);
            });
        }

        // Get data from attributes
        const title = btn.getAttribute('data-title');
        const desc = btn.getAttribute('data-desc');
        const tech = btn.getAttribute('data-tech').split(',');

        const githubLink = btn.getAttribute('data-github');

        // Populate Modal
        modalTitle.textContent = title;
        modalDesc.innerHTML = desc.replace(/\n/g, '<br>');

        // Update Modal Image
        const card = btn.closest('.project-card');
        const cardImg = card.querySelector('.project-image');
        if (cardImg) {
            modalImg.innerHTML = `<img src="${cardImg.src}" style="width:100%; height:100%; object-fit:contain; transition: var(--transition);">`;
        } else {
            modalImg.textContent = title;
        }

        // Clear and add tags
        modalTech.innerHTML = '';
        tech.forEach(t => {
            const span = document.createElement('span');
            span.textContent = t.trim();
            modalTech.appendChild(span);
        });

        // Update links

        modalGithubBtn.href = githubLink;

        // Show Modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
});

// LinkedIn Button Popup Handler
if (modalGithubBtn) {
    modalGithubBtn.addEventListener('click', (e) => {
        const href = modalGithubBtn.getAttribute('href');
        if (href === 'none' || href === '#' || !href) {
            e.preventDefault();
            alert('The project is currently not available on LinkedIn!');
        }
    });
}

// Download CV Handler
const downloadCVBtn = document.getElementById('downloadCV');
if (downloadCVBtn) {
    downloadCVBtn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('CV has not been uploaded yet!');
    });
}

// Close Modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
        // Cleanup observer on close
        modalContent.querySelectorAll('.modal-reveal-item').forEach(el => {
            modalObserver.unobserve(el);
        });
    });
}

// Close on Overlay Click
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
            modalContent.querySelectorAll('.modal-reveal-item').forEach(el => {
                modalObserver.unobserve(el);
            });
        }
    });
}

// Certificate Modal Logic
const certModal = document.getElementById('certModal');
const closeCertModalBtn = document.getElementById('closeCertModalBtn');
const viewCertBtns = document.querySelectorAll('.view-cert-btn');
const certModalTitle = document.getElementById('certModalTitle');
const certModalImg = document.getElementById('certModalImg');

viewCertBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.getAttribute('data-title');
        const imgSrc = btn.getAttribute('href');

        certModalTitle.textContent = title;
        certModalImg.src = imgSrc;

        certModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

closeCertModalBtn.addEventListener('click', () => {
    certModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

certModal.addEventListener('click', (e) => {
    if (e.target === certModal) {
        certModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close on Escape Key
// Close on Escape Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (modal && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
        if (lightbox && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

// Image Lightbox Logic
const lightbox = document.getElementById('imageLightbox');
const closeLightboxBtn = document.getElementById('closeLightboxBtn');
const lightboxImgPlaceholder = document.getElementById('lightboxImgPlaceholder');

// Reusable Lightbox Logic
function attachLightboxEvents() {
    const galleryItems = document.querySelectorAll('.gallery-slide:not(.lightbox-attached)');

    if (galleryItems) {
        galleryItems.forEach(item => {
            item.classList.add('lightbox-attached'); // Mark as attached
            item.style.cursor = 'pointer'; // Ensure it's clickable

            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const imgSrc = img ? img.src : '';

                // Clear previous content
                lightboxImgPlaceholder.innerHTML = '';

                if (imgSrc) {
                    const newImg = document.createElement('img');
                    newImg.src = imgSrc;
                    newImg.classList.add('lightbox-img');
                    lightboxImgPlaceholder.appendChild(newImg);

                    // Reset placeholder styles
                    lightboxImgPlaceholder.style.padding = '0';
                    lightboxImgPlaceholder.style.background = 'transparent';
                } else {
                    lightboxImgPlaceholder.textContent = "No Image Found";
                }

                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
}

// Initial attachment
attachLightboxEvents();


// Load More Button Logic
const loadMoreBtns = document.querySelectorAll('.load-more-btn');

if (loadMoreBtns) {
    loadMoreBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetGrid = document.getElementById(targetId);
            const hiddenItems = targetGrid.querySelectorAll('.gallery-item.hidden');

            // Show next 4 hidden items
            let count = 0;
            hiddenItems.forEach(item => {
                if (count < 4) { // Show 4 at a time
                    item.classList.remove('hidden');
                    // Small timeout to allow display:block to apply before opacity transition if needed, 
                    // but keyframes handle it well with 'visible' class
                    requestAnimationFrame(() => {
                        item.classList.add('visible');
                    });
                    count++;
                }
            });

            // Re-attach lightbox events for newly visible items
            attachLightboxEvents();

            // If no more hidden items, hide button
            if (targetGrid.querySelectorAll('.gallery-item.hidden').length === 0) {
                btn.style.display = 'none';
            }
        });
    });
}

if (closeLightboxBtn) {
    closeLightboxBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
}

if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Click outside the content
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}
// Carousel Logic
function initCarousel(trackId, prevId, nextId, autoScroll = false, interval = 5000) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const container = track ? track.parentElement : null;

    if (!track || !prevBtn || !nextBtn) return;

    let currentIndex = 0;
    let autoScrollInterval;

    function updateCarousel() {
        if (track.children.length === 0) return;
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.columnGap) || parseInt(style.gap) || 0;
        const itemWidth = track.firstElementChild.offsetWidth + gap;
        const visibleItems = Math.floor(track.parentElement.offsetWidth / itemWidth);
        const maxIndex = Math.max(0, track.children.length - visibleItems);

        // Boundaries
        if (currentIndex > maxIndex) currentIndex = 0; // Reset to start if autoscrolling past end
        currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));

        // Translate
        track.style.transform = `translateX(-${currentIndex * itemWidth}px)`;

        // Update Buttons
        prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
        prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

        nextBtn.style.opacity = currentIndex >= maxIndex ? '0.3' : '1';
        nextBtn.style.pointerEvents = currentIndex >= maxIndex ? 'none' : 'auto';
    }

    function startAutoScroll() {
        if (!autoScroll) return;
        autoScrollInterval = setInterval(() => {
            const style = window.getComputedStyle(track);
            const gap = parseInt(style.columnGap) || parseInt(style.gap) || 0;
            const itemWidth = track.firstElementChild.offsetWidth + gap;
            const visibleItems = Math.floor(track.parentElement.offsetWidth / itemWidth);
            const maxIndex = Math.max(0, track.children.length - visibleItems);

            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateCarousel();
        }, interval);
    }

    function stopAutoScroll() {
        if (autoScrollInterval) clearInterval(autoScrollInterval);
    }

    nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        currentIndex++;
        updateCarousel();
        startAutoScroll();
    });

    prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        currentIndex--;
        updateCarousel();
        startAutoScroll();
    });

    // Pause on hover
    if (autoScroll && container) {
        container.addEventListener('mouseenter', stopAutoScroll);
        container.addEventListener('mouseleave', startAutoScroll);
    }

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 250);
    });

    // Initial check
    setTimeout(() => {
        updateCarousel();
        startAutoScroll();
    }, 100);
}

// Initialize Carousels
document.addEventListener('DOMContentLoaded', () => {
    // Truncate tags in project cards to max 3 items
    document.querySelectorAll('.project-card .tags').forEach(tagsContainer => {
        const tags = Array.from(tagsContainer.querySelectorAll('span'));
        if (tags.length > 3) {
            for (let i = 3; i < tags.length; i++) {
                tags[i].style.display = 'none';
            }
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            tagsContainer.appendChild(ellipsis);
        }
    });

    initCarousel('projectTrack', 'projectPrev', 'projectNext', false, 10000); // Disabled Auto-scroll
    initCarousel('certTrack', 'certPrev', 'certNext', false, 10000);
    initCarousel('gradGalleryTrack', 'gradPrev', 'gradNext', false, 10000);
    initCarousel('persGalleryTrack', 'persPrev', 'persNext', false, 10000);
    initCarousel('recTrack', 'recPrev', 'recNext', false, 10000);
});