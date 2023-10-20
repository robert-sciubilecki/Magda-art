const navbar = document.querySelector(".nav");
const header = document.querySelector(".main-header");

// Create an Intersection Observer
const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        navbar.classList.add("hidden");
        setTimeout(() => {
          navbar.classList.remove("hidden");
          navbar.classList.add("sticky");
        }, 200);
      } else {
        navbar.classList.add("hidden");
        setTimeout(() => {
          navbar.classList.remove("sticky");
          navbar.classList.remove("hidden");
        }, 200);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 0.0,
  }
);

// Observe the header element
observer.observe(header);

navbar.addEventListener("click", (e) => {
  e.preventDefault();
  const targetId = e.target.getAttribute("href").substring(1);
  if (!targetId) return;
  const targetSection = document.getElementById(targetId);
  targetSection.scrollIntoView({ behavior: "smooth" });
});
