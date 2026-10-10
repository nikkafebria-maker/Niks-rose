const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// Reveal elements on scroll.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

// Gallery filters.
const filterButtons = document.querySelectorAll(".filter-btn");
const galleryItems = document.querySelectorAll(".gallery-item");

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    galleryItems.forEach(item => {
      const category = item.dataset.category;
      item.classList.toggle("hidden", filter !== "all" && category !== filter);
    });
  });
});

// Image lightbox with previous/next navigation.
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalClose = document.querySelector(".modal-close");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");

const mediaButtons = Array.from(document.querySelectorAll(".media-button"));
let currentImageIndex = 0;

function openModal(button) {
  currentImageIndex = mediaButtons.indexOf(button);
  if (currentImageIndex < 0) currentImageIndex = 0;
  updateModal();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function updateModal() {
  const button = mediaButtons[currentImageIndex];
  if (!button) return;

  modalImage.src = button.dataset.image;
  modalImage.alt = button.dataset.title || "Portfolio image";
  modalTitle.textContent = button.dataset.title || "";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

mediaButtons.forEach(button => {
  button.addEventListener("click", () => openModal(button));
});

modalClose.addEventListener("click", closeModal);

modal.addEventListener("click", event => {
  if (event.target === modal) closeModal();
});

modalPrev.addEventListener("click", event => {
  event.stopPropagation();
  currentImageIndex = (currentImageIndex - 1 + mediaButtons.length) % mediaButtons.length;
  updateModal();
});

modalNext.addEventListener("click", event => {
  event.stopPropagation();
  currentImageIndex = (currentImageIndex + 1) % mediaButtons.length;
  updateModal();
});

document.addEventListener("keydown", event => {
  if (!modal.classList.contains("open")) return;

  if (event.key === "Escape") closeModal();
  if (event.key === "ArrowLeft") {
    currentImageIndex = (currentImageIndex - 1 + mediaButtons.length) % mediaButtons.length;
    updateModal();
  }
  if (event.key === "ArrowRight") {
    currentImageIndex = (currentImageIndex + 1) % mediaButtons.length;
    updateModal();
  }
});

// Basic image error fallback so a missing asset does not break the layout.
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("error", () => {
    img.classList.add("image-missing");
    img.alt = "Image unavailable";
  });
});
