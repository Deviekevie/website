
// Dropdown on mouse hover (Vanilla JS)
document.addEventListener("DOMContentLoaded", function () {
    function toggleNavbarMethod() {
        const dropdowns = document.querySelectorAll(".navbar .dropdown");
        if (window.innerWidth > 992) {
            dropdowns.forEach(function (dropdown) {

                // mouseover
                dropdown._mouseoverHandler = function () {
                    const toggle = dropdown.querySelector(".dropdown-toggle");
                    if (toggle) toggle.click();
                };

                // mouseout
                dropdown._mouseoutHandler = function () {
                    const toggle = dropdown.querySelector(".dropdown-toggle");
                    if (toggle) {
                        toggle.click();
                        toggle.blur();
                    }
                };

                dropdown.addEventListener("mouseover", dropdown._mouseoverHandler);
                dropdown.addEventListener("mouseout", dropdown._mouseoutHandler);
            });

        } else {
            // remove events on small screens
            dropdowns.forEach(function (dropdown) {
                if (dropdown._mouseoverHandler) {
                    dropdown.removeEventListener("mouseover", dropdown._mouseoverHandler);
                    dropdown.removeEventListener("mouseout", dropdown._mouseoutHandler);
                }
            });
        }
    }

    toggleNavbarMethod();
    window.addEventListener("resize", toggleNavbarMethod);

});

document.addEventListener("DOMContentLoaded", function () {

    const backToTop = document.querySelector(".back-to-top");
    if (!backToTop) return;

    /* Show / hide button on scroll */
    window.addEventListener("scroll", function () {
        if (window.scrollY > 100) {
            backToTop.style.opacity = "1";
            backToTop.style.visibility = "visible";
            backToTop.style.transition = "opacity 0.6s ease";
        } else {
            backToTop.style.opacity = "0";
            backToTop.style.visibility = "hidden";
        }
    });

    /* Scroll to top with smooth animation */
    backToTop.addEventListener("click", function (e) {
        e.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

});

// Service carousel 
document.addEventListener("DOMContentLoaded", function () {
    const serviceCarousel = document.querySelector(".service-carousel");

    if (serviceCarousel && typeof jQuery !== "undefined") {
        jQuery(serviceCarousel).owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 3 },
                992: { items: 3 }
            }
        });
    }




    const serviceCarouselbottom = document.querySelector(".service-carousel-bottom");

    if (serviceCarouselbottom && typeof jQuery !== "undefined") {
        jQuery(serviceCarouselbottom).owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 3 },
                992: { items: 3 }
            }
        });
    }

       const serviceCarouselfooter = document.querySelector(".service-carousel-footer");

    if (serviceCarouselfooter && typeof jQuery !== "undefined") {
        jQuery(serviceCarouselfooter).owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 3 },
                992: { items: 3 }
            }
        });
    }

});
// Portfolio Isotope
document.addEventListener("DOMContentLoaded", function () {
    const portfolioContainer = document.querySelector('.portfolio-container');
    if (portfolioContainer && typeof Isotope !== "undefined") {
        const portfolioIsotope = new Isotope(portfolioContainer, {
            itemSelector: '.portfolio-item',
            layoutMode: 'fitRows'
        });

        const filterButtons = document.querySelectorAll('#portfolio-flters li');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const filterValue = this.getAttribute('data-filter');
                portfolioIsotope.arrange({ filter: filterValue });
            });
        });
    }
});

// Partners Carousel
document.addEventListener("DOMContentLoaded", function () {
    const partnersCarousel = document.querySelector('.partners-carousel');
    if (partnersCarousel && typeof jQuery !== "undefined") {
        jQuery(partnersCarousel).owlCarousel({
            autoplay: true,
            autoplayTimeout: 2000,
            autoplayHoverPause: true,
            smartSpeed: 1000,
            loop: true,
            margin: 30,
            dots: false,
            nav: false,
            responsive: {
                0: { items: 2 },
                576: { items: 3 },
                768: { items: 4 },
                992: { items: 5 }
            }
        });
    }
});

// Team Carousel
document.addEventListener("DOMContentLoaded", function () {
    const teamCarousel = document.querySelector('.team-carousel');
    if (teamCarousel && typeof jQuery !== "undefined") {
        jQuery(teamCarousel).owlCarousel({
            autoplay: true,
            smartSpeed: 1500,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ],
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }
});

// Testimonials Carousel
window.addEventListener('load', function () {
    const testimonialCarousel = document.querySelector('.testimonial-carousel');
    if (testimonialCarousel && typeof jQuery !== "undefined") {
        jQuery(testimonialCarousel).owlCarousel({
            autoplay: true,
            smartSpeed: 1000,
            items: 1,
            dots: false,
            loop: true,
            nav: true,
            navText: [
                '<i class="fa fa-angle-left"></i>',
                '<i class="fa fa-angle-right"></i>'
            ]
        });
    }
});

// Advertisement popup - show after 5 seconds or scroll, once per session
document.addEventListener("DOMContentLoaded", function () {
    const quickContact = document.getElementById("quickContact");
    if (!quickContact) return;

    // Check if popup was already shown in this session
    const popupShown = sessionStorage.getItem('quickContactPopupShown');

    if (popupShown) {
        // Hide popup if already shown
        quickContact.style.display = 'none';
        return;
    }

    let hasShown = false;
    const showPopup = () => {
        if (hasShown) return;
        hasShown = true;
        sessionStorage.setItem('quickContactPopupShown', 'true');
        quickContact.style.opacity = "1";
        quickContact.style.transform = "translateY(0)";
        quickContact.style.pointerEvents = "auto";
    };

    // Show after 5 seconds
    const timeOut = setTimeout(showPopup, 5000);

    // Show on scroll (after 300px)
    let scrollTimeout;
    window.addEventListener("scroll", function () {
        if (hasShown) return;

        if (window.scrollY > 300) {
            clearTimeout(timeOut);
            if (!hasShown) {
                showPopup();
            }
        }
    }, { once: false });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearTimeout(timeOut);
        clearTimeout(scrollTimeout);
    });
});

// Close form if click outside (integrated with popup timing)
document.addEventListener("DOMContentLoaded", function () {
    const container = document.getElementById("quickContact");
    const form = document.getElementById("qcForm");

    if (!container || !form) return;

    let closed = false;

    // Initial hidden state
    container.style.opacity = "0";
    container.style.transform = "translateY(40px)";
    container.style.transition = "opacity 0.4s ease, transform 0.4s ease";

    // Click outside closes permanently
    document.addEventListener("click", function (e) {
        if (closed) return;
        if (!container.contains(e.target)) {
            closeForm();
        }
    });

    // Prevent close on inside click
    form.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    function closeForm() {
        if (closed) return;
        closed = true;
        sessionStorage.setItem('quickContactPopupShown', 'true');
        container.style.opacity = "0";
        container.style.transform = "translateY(40px)";

        // Hide after animation
        setTimeout(() => {
            container.style.display = "none";
        }, 400);
    }

    // Make closeForm available globally
    window.closeQuickContact = closeForm;
});

// Form submit
document.addEventListener("DOMContentLoaded", function () {
    const quickContactForm = document.getElementById("quickContactForm");
    if (quickContactForm) {
        quickContactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Thank you! We will contact you soon.");
            this.reset();
        });
    }
});
document.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("waPopup");
    const button = document.querySelector(".whatsapp-float");

    // Toggle popup
    window.toggleWA = function () {
        popup.classList.toggle("show");
    };

    // Close popup when clicking outside
    document.addEventListener("click", function (e) {
        if (
            popup.classList.contains("show") &&
            !popup.contains(e.target) &&
            !button.contains(e.target)
        ) {
            popup.classList.remove("show");
        }
    });
});
