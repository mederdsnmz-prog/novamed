// Tüm sayfalarda ortak kullanılan betikler.
// <head> içinde, Tailwind CDN betiğinden hemen sonra (defer/async olmadan) yüklenmelidir;
// böylece tema sayfa çizilmeden uygulanır ve açılışta renk "yanıp sönmez".

tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#0055A4", // Medical Blue from logo
                secondary: "#0F766E", // Trust-focused Teal for healthcare accents
                "background-light": "#F8FAFC",
                "background-dark": "#0F172A",
            },
            fontFamily: {
                display: ["Inter", "sans-serif"],
            },
            borderRadius: {
                DEFAULT: "0.5rem",
            },
        },
    },
};

// --- Karanlık / aydınlık mod ---
// Seçim localStorage'da saklanır; böylece sayfa değiştirince veya geri gelince korunur.
const THEME_KEY = 'evimdesaglik-theme';

function readSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch (e) {
        return null;
    }
}

function applyTheme(theme) {
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

function toggleDarkMode() {
    const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
    applyTheme(next);
    try {
        localStorage.setItem(THEME_KEY, next);
    } catch (e) {
        // Gizli sekme vb. durumlarda kaydedilemezse yalnızca bu sayfada geçerli olur.
    }
}

applyTheme(readSavedTheme());

// Tarayıcı "geri" ile sayfayı önbellekten (bfcache) getirdiğinde eski tema görünmesin.
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        applyTheme(readSavedTheme());
    }
});

// Başka sekmede tema değişirse bu sekme de uyum sağlasın.
window.addEventListener('storage', (event) => {
    if (event.key === THEME_KEY) {
        applyTheme(event.newValue);
    }
});

// --- Google Ads dönüşüm takibi ---
function trackContactConversion(action) {
    if (typeof gtag !== 'function') return true;
    gtag('event', 'conversion', {
        'send_to': 'AW-18244467256/4sQNCI-KvPUbEMzXrc1C',
        'value': 1.0,
        'currency': 'TRY'
    });
    gtag('event', action || 'contact_click', {
        'event_category': 'engagement'
    });
    return true;
}

// --- Mobil menü ---
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const button = document.getElementById('mobile-menu-button');
    const icon = document.getElementById('mobile-menu-icon');

    if (!menu || !button || !icon) {
        return;
    }

    menu.classList.toggle('hidden');
    const isOpen = !menu.classList.contains('hidden');
    button.setAttribute('aria-expanded', isOpen.toString());
    icon.textContent = isOpen ? 'close' : 'menu';
}

// --- Ana sayfa hizmet slider'ı ---
function initializeServiceSlider() {
    const slider = document.getElementById('service-slider');
    if (!slider) return;

    const track = slider.querySelector('[data-slider-track]');
    const slides = track ? Array.from(track.children) : [];
    const prevButton = slider.querySelector('[data-slider-prev]');
    const nextButton = slider.querySelector('[data-slider-next]');
    const dots = Array.from(slider.querySelectorAll('[data-slider-dot]'));

    if (!track || slides.length === 0 || !prevButton || !nextButton) return;

    let current = 0;
    let autoPlayTimer;
    let touchStartX = 0;
    let touchStartY = 0;
    const swipeThreshold = 50;

    function goTo(index) {
        current = (index + slides.length) % slides.length;
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => {
            dot.setAttribute('aria-current', i === current ? 'true' : 'false');
            dot.classList.toggle('bg-primary', i === current);
            dot.classList.toggle('bg-slate-300', i !== current);
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = window.setInterval(() => {
            goTo(current + 1);
        }, 2000);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            window.clearInterval(autoPlayTimer);
        }
    }

    prevButton.addEventListener('click', () => {
        goTo(current - 1);
        startAutoPlay();
    });

    nextButton.addEventListener('click', () => {
        goTo(current + 1);
        startAutoPlay();
    });

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goTo(i);
            startAutoPlay();
        });
    });

    slider.addEventListener('touchstart', (event) => {
        if (!event.touches.length) return;
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        stopAutoPlay();
    }, { passive: true });

    slider.addEventListener('touchend', (event) => {
        if (!event.changedTouches.length) {
            startAutoPlay();
            return;
        }

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;

        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
            goTo(deltaX < 0 ? current + 1 : current - 1);
        }

        startAutoPlay();
    }, { passive: true });

    const desktopMedia = window.matchMedia('(min-width: 768px)');
    const bindDesktopHoverPause = () => {
        if (desktopMedia.matches) {
            slider.addEventListener('mouseenter', stopAutoPlay);
            slider.addEventListener('mouseleave', startAutoPlay);
        } else {
            slider.removeEventListener('mouseenter', stopAutoPlay);
            slider.removeEventListener('mouseleave', startAutoPlay);
        }
    };

    bindDesktopHoverPause();
    desktopMedia.addEventListener('change', bindDesktopHoverPause);

    slider.addEventListener('focusin', stopAutoPlay);
    slider.addEventListener('focusout', startAutoPlay);

    goTo(0);
    startAutoPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    initializeServiceSlider();
}, { once: true });
