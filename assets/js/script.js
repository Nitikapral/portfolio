
const cur  = document.getElementById('cur');
const ring = document.getElementById('ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animCur() {
    cur.style.left  = mx + 'px';
    cur.style.top   = my + 'px';
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCur);
}
animCur();

const loader = document.getElementById('loader');
const lbar   = document.getElementById('lbar');
const lpct   = document.getElementById('lpct');
let pct = 0;
const iv = setInterval(() => {
    pct += Math.random() * 15;
    if (pct >= 100) {
        pct = 100;
        clearInterval(iv);
        setTimeout(() => {
            loader.classList.add('gone');
            initPage();
        }, 350);
    }
    lbar.style.width       = Math.min(pct, 100) + '%';
    lpct.textContent       = Math.floor(pct) + '%';
}, 100);

const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
    hdr.classList.toggle('scrolled', window.scrollY > 40);
    updateNav();
});

function updateNav() {
    const secs   = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 120;
    let active = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop) active = s.id; });
    document.querySelectorAll('.nav-link[data-s]').forEach(l => {
        l.classList.toggle('active', l.dataset.s === active);
    });
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) {
            e.preventDefault();
            const top = t.offsetTop - hdr.offsetHeight;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

const mBtn = document.getElementById('mBtn');
const mNav = document.getElementById('mNav');
mBtn.addEventListener('click', () => {
    const isOpen = mBtn.classList.toggle('open');
    mNav.classList.toggle('open', isOpen);
    mBtn.setAttribute('aria-expanded', isOpen);
    mNav.setAttribute('aria-hidden',   !isOpen);
});
function closeMNav() {
    mBtn.classList.remove('open');
    mNav.classList.remove('open');
    mBtn.setAttribute('aria-expanded', 'false');
    mNav.setAttribute('aria-hidden',   'true');
}

const themeBtn = document.getElementById('themeBtn');
let isDark = localStorage.getItem('theme') !== 'light';
if (!isDark) {
    document.body.classList.add('light');
    themeBtn.innerHTML = '<i class="fas fa-moon"></i>';
}
themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.body.classList.toggle('light');
    themeBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

(function initTypewriter() {
    const words = document.querySelectorAll('.tw-word');
    if (!words.length) return;
    let current = 0;
    setInterval(() => {
        words[current].classList.remove('active');
        current = (current + 1) % words.length;
        words[current].classList.add('active');
    }, 2200);
})();

let projSwiper = null;
function initSwiper() {
    if (typeof Swiper === 'undefined') return;
    projSwiper = new Swiper('.proj-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: false,
        grabCursor: true,
        keyboard: { enabled: true },
        navigation: {
            nextEl: '.proj-next',
            prevEl: '.proj-prev',
        },
        pagination: {
            el: '.proj-pagination',
            clickable: true,
        },
        breakpoints: {
            640:  { slidesPerView: 1.5 },
            900:  { slidesPerView: 2 },
            1200: { slidesPerView: 3 },
        },
        a11y: {
            prevSlideMessage: 'Previous project',
            nextSlideMessage: 'Next project',
        },
    });
}

function initProjectFilters() {
    const filters = document.querySelectorAll('.proj-filter');
    const slides  = document.querySelectorAll('.swiper-slide');

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected','false'); });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            const filter = btn.dataset.filter;
            slides.forEach(slide => {
                const cat = slide.dataset.category || '';
                const show = filter === 'all' || cat.includes(filter);
                slide.style.display = show ? '' : 'none';
            });

            if (projSwiper) {
                projSwiper.update();
                projSwiper.slideTo(0, 0);
            }
        });
    });
}

function initPage() {

    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('in');
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

    const tlObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 150);
                tlObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2 });
    document.querySelectorAll('.tl-item').forEach(el => tlObs.observe(el));

    const projObs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 100);
                projObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.proj-card').forEach(el => projObs.observe(el));

    const skillObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('.sk-fill').forEach(bar => {
                    bar.style.width = bar.dataset.w + '%';
                });
                e.target.querySelectorAll('.sk-pct').forEach(pEl => {
                    const target = parseInt(pEl.dataset.pct);
                    let count = 0;
                    const step = () => {
                        count = Math.min(count + 2, target);
                        pEl.textContent = count + '%';
                        if (count < target) requestAnimationFrame(step);
                    };
                    step();
                });
                skillObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.skill-cat').forEach(el => skillObs.observe(el));

    const statObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.querySelectorAll('[data-count]').forEach(el => {
                    const target   = parseInt(el.dataset.count);
                    const suffix   = el.dataset.suffix || '';
                    let count = 0;
                    const step = () => {
                        count = Math.min(count + 1, target);
                        el.textContent = count + suffix;
                        if (count < target) requestAnimationFrame(step);
                    };
                    step();
                });
                statObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.about-stats').forEach(el => statObs.observe(el));

    initSwiper();
    initProjectFilters();

    if ('loading' in HTMLImageElement.prototype) {
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.dataset.src || img.src;
        });
    } else if ('IntersectionObserver' in window) {
        const lazyObs = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    const img = e.target;
                    if (img.dataset.src) img.src = img.dataset.src;
                    lazyObs.unobserve(img);
                }
            });
        });
        document.querySelectorAll('img[data-src]').forEach(img => lazyObs.observe(img));
    }
}


const form       = document.getElementById('cForm');
const submitBtn  = document.getElementById('submitBtn');
const successEl  = document.getElementById('form-success');
const errorEl    = document.getElementById('form-error');

const nameInput    = document.getElementById('cf-name');
const emailInput   = document.getElementById('cf-email');
const messageInput = document.getElementById('cf-message');
const errName      = document.getElementById('err-name');
const errEmail     = document.getElementById('err-email');
const errMessage   = document.getElementById('err-message');

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setError(input, errEl, msg) {
    input.classList.add('invalid');
    errEl.textContent = msg;
    return false;
}

function clearError(input, errEl) {
    input.classList.remove('invalid');
    errEl.textContent = '';
    return true;
}

nameInput.addEventListener('blur', () => {
    nameInput.value.trim()
        ? clearError(nameInput, errName)
        : setError(nameInput, errName, 'Name is required.');
});

emailInput.addEventListener('blur', () => {
    if (!emailInput.value.trim()) {
        setError(emailInput, errEmail, 'Email is required.');
    } else if (!isValidEmail(emailInput.value)) {
        setError(emailInput, errEmail, 'Please enter a valid email address.');
    } else {
        clearError(emailInput, errEmail);
    }
});

messageInput.addEventListener('blur', () => {
    messageInput.value.trim().length >= 10
        ? clearError(messageInput, errMessage)
        : setError(messageInput, errMessage, 'Message must be at least 10 characters.');
});


const counters = document.querySelectorAll('.stat-n');
counters.forEach(counter => {
    const target = +counter.getAttribute('data-count');
    const suffix = counter.getAttribute('data-suffix') || '';
    let count = 0;
    const update = () => {
        const increment = target / 60;
        if (count < target) {
            count += increment;
            counter.innerText = Math.ceil(count) + suffix;
            requestAnimationFrame(update);
        } else {
            counter.innerText = target + suffix;
        }
    };
    update();
});

document.getElementById("cForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("cf-name").value.trim();
    let email = document.getElementById("cf-email").value.trim();
    let subject = document.getElementById("cf-subject").value.trim();
    let message = document.getElementById("cf-message").value.trim();

    if (!name || !email || !message) {
        alert("Please fill all required fields ❌");
        return;
    }

    let phone = "919541614951";

    let text = encodeURIComponent(
`📩 New Contact Form Message

👤 Name: ${name}
📧 Email: ${email}
📌 Subject: ${subject || "N/A"}

💬 Message:
${message}`
    );

    let url = `https://wa.me/${phone}?text=${text}`;

    window.open(url, "_blank");

    document.getElementById("cForm").reset();
});

