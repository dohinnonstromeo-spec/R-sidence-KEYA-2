const phoneNumber = "22996553311";

const testimonials = [
  {
    name: "Amadou K.",
    country: "Nigeria",
    text: "Un séjour parfait ! L'appartement était impeccable, spacieux et très bien situé. Je recommande vivement."
  },
  {
    name: "Claire D.",
    country: "France",
    text: "Exactement ce qu'il me fallait pour ma mission à Cotonou. Calme, propre, et le Wi-Fi fonctionne très bien."
  },
  {
    name: "Kofi M.",
    country: "Ghana",
    text: "La cuisine équipée a fait toute la différence. On se sentait vraiment comme chez nous. Merci KEYA !"
  },
  {
    name: "Fatima B.",
    country: "Bénin",
    text: "J'ai logé ma famille pendant deux semaines. Les enfants ont adoré l'espace. Rapport qualité-prix imbattable."
  },
  {
    name: "Jean-Pierre L.",
    country: "Belgique",
    text: "Accueil chaleureux, appartement moderne et confortable. Le garage sécurisé est un vrai plus. Bravo !"
  }
];

let currentTestimonial = 0;
let sliderTimer;

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const testimonialText = document.getElementById("testimonial-text");
const testimonialName = document.getElementById("testimonial-name");
const testimonialCountry = document.getElementById("testimonial-country");
const testimonialDots = document.getElementById("testimonial-dots");
const form = document.getElementById("booking-form");
const apartmentSelect = document.getElementById("apartment-select");

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 24);
}

function closeMenu() {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}

function renderTestimonial(index) {
  const item = testimonials[index];
  testimonialText.textContent = item.text;
  testimonialName.textContent = item.name;
  testimonialCountry.textContent = item.country;

  [...testimonialDots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
    dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
  });
}

function goToTestimonial(index) {
  currentTestimonial = (index + testimonials.length) % testimonials.length;
  renderTestimonial(currentTestimonial);
  restartSlider();
}

function restartSlider() {
  clearInterval(sliderTimer);
  sliderTimer = setInterval(() => {
    goToTestimonial(currentTestimonial + 1);
  }, 5000);
}

function initTestimonials() {
  testimonials.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Voir le témoignage ${index + 1}`);
    dot.addEventListener("click", () => goToTestimonial(index));
    testimonialDots.appendChild(dot);
  });

  document.querySelectorAll("[data-dir]").forEach((button) => {
    button.addEventListener("click", () => {
      goToTestimonial(currentTestimonial + Number(button.dataset.dir));
    });
  });

  renderTestimonial(currentTestimonial);
  restartSlider();
}

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

function buildWhatsAppMessage(data) {
  return [
    "Nouvelle demande de réservation - Résidence KEYA",
    "",
    `Nom : ${data.get("name")}`,
    `Email : ${data.get("email")}`,
    `WhatsApp : ${data.get("whatsapp")}`,
    `Arrivée : ${data.get("arrival")}`,
    `Départ : ${data.get("departure")}`,
    `Personnes : ${data.get("guests") || "Non précisé"}`,
    `Appartement : ${data.get("apartment") || "Non précisé"}`,
    `Message : ${data.get("message") || "Aucun"}`
  ].join("\n");
}

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.querySelectorAll("[data-apartment]").forEach((button) => {
  button.addEventListener("click", () => {
    apartmentSelect.value = button.dataset.apartment;
    document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const message = encodeURIComponent(buildWhatsAppMessage(data));
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank", "noopener");
});

window.addEventListener("scroll", updateHeader, { passive: true });

updateHeader();
initReveal();
initTestimonials();
