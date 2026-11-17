
// AMBIL ELEMEN
const cover = document.getElementById("cover");
const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");

// ANIMASI SEMUA TEKS DARI KANAN KE KIRI
function mulaiAnimasiSemuaTeks() {
    const semuaTeks = document.querySelectorAll(`
        section h1,
        section h2,
        section h3,
        section p,
        section a,
        section button,
        section strong,
        section span,
        footer h1,
        footer h2,
        footer h3,
        footer p,
        footer a,
        footer span,
        .count-box,
        .rekening
    `);

    if (!("IntersectionObserver" in window)) {
        semuaTeks.forEach(teks => {
            teks.classList.add("teks-scroll", "muncul-teks");
        });
        return;
    }

    const observerTeks = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("muncul-teks");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    semuaTeks.forEach(teks => {
        teks.classList.add("teks-scroll");
        observerTeks.observe(teks);
    });
}

// BUKA UNDANGAN
function openInvitation() {
    cover.classList.add("sembunyi");

    mulaiAnimasiSemuaTeks();

    setTimeout(() => {
        const currentTop =
            window.pageYOffset ||
            document.documentElement.scrollTop;

        if (currentTop > 0) {
            let pos = currentTop;
            const step = Math.max(12, Math.ceil(currentTop / 20));

            const scrollUp = setInterval(() => {
                pos = Math.max(0, pos - step);
                window.scrollTo(0, pos);

                if (pos === 0) {
                    clearInterval(scrollUp);
                }
            }, 12);
        }
    }, 450);

    music.play()
        .then(() => {
            musicButton.textContent = "❚❚";
        })
        .catch(() => {
            musicButton.textContent = "▶";
        });
}

// MUSIK
function toggleMusic() {
    if (music.paused) {
        music.play()
            .then(() => {
                musicButton.textContent = "❚❚";
            })
            .catch(() => {
                alert("Musik belum bisa diputar. Periksa file assets/lagu.mp4.");
            });
    } else {
        music.pause();
        musicButton.textContent = "▶";
    }
}

// COUNTDOWN
const weddingDate = new Date(
    "2027-06-20T08:00:00+08:00"
).getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
        ["days", "hours", "minutes", "seconds"].forEach(id => {
            document.getElementById(id).textContent = "0";
        });
        return;
    }

    document.getElementById("days").textContent =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    document.getElementById("hours").textContent =
        Math.floor(
            (distance % (1000 * 60 * 60 * 24)) /
            (1000 * 60 * 60)
        );

    document.getElementById("minutes").textContent =
        Math.floor(
            (distance % (1000 * 60 * 60)) /
            (1000 * 60)
        );

    document.getElementById("seconds").textContent =
        Math.floor((distance % (1000 * 60)) / 1000);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ANIMASI FOTO SAAT SCROLL
const fotoElements = document.querySelectorAll(".foto-scroll");

if ("IntersectionObserver" in window) {
    const observerFoto = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("muncul");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    fotoElements.forEach(foto => observerFoto.observe(foto));
} else {
    fotoElements.forEach(foto => foto.classList.add("muncul"));
}

// SALIN REKENING
function copyRekening() {
    const nomor = document
        .getElementById("nomorRekening")
        .textContent.trim();

    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(nomor)
            .then(() => {
                alert("Nomor rekening berhasil disalin!");
            })
            .catch(() => {
                fallbackCopy(nomor);
            });
    } else {
        fallbackCopy(nomor);
    }
}

function fallbackCopy(teks) {
    const temp = document.createElement("textarea");

    temp.value = teks;
    document.body.appendChild(temp);
    temp.select();

    try {
        document.execCommand("copy");
        alert("Nomor rekening berhasil disalin!");
    } catch (error) {
        alert("Salin nomor rekening: " + teks);
    }

    temp.remove();
}

// RSVP WHATSAPP
document.getElementById("rsvpForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const kehadiran = document.getElementById("kehadiran").value;
        const ucapan = document.getElementById("ucapan").value.trim();

        const nomorWhatsApp = "6287719253714";

        const pesan =
            "Assalamu'alaikum, saya ingin mengonfirmasi undangan Raro & Roro.\n\n" +
            "Nama: " + nama + "\n" +
            "Kehadiran: " + kehadiran + "\n" +
            "Ucapan: " + ucapan;

        window.open(
            "https://wa.me/" + nomorWhatsApp +
            "?text=" + encodeURIComponent(pesan),
            "_blank"
        );
    });
