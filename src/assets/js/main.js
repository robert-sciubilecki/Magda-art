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
    threshold: 0,
  }
);

// Observe the header element
observer.observe(header);

navbar.addEventListener("click", (e) => {
  if (e.target.classList.contains("external")) return;
  if (!e.target.closest("a")) return;
  e.preventDefault();
  console.log(e.target.closest("a").getAttribute("href").substring(1));

  const targetId = e.target.closest("a").getAttribute("href").substring(1);
  const targetSection = document.getElementById(targetId);
  const blockAlign = targetId === "section-contact" ? "center" : "start";
  console.log(blockAlign);

  targetSection.scrollIntoView({ behavior: "smooth", block: blockAlign });
});
