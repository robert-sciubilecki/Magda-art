// ****************************************************
// ----------------MASONRY GRID LAYOUT-----------------
// ****************************************************
import { getImages } from "./paintings-data";
import { markups } from "./markups";
import { getMarkupForDetailsView } from "./markups";
import { titleFormatter } from "./markups";

const images = getImages();

const contactLink = document.querySelector(".contact-link");
const navbar = document.querySelector(".nav");
const header = document.querySelector(".main-header");
const mobileOpenBtn = document.querySelector(".btn-mobile-open");
const mobileCloseBtn = document.querySelector(".btn-mobile-close");
const mainMenu = document.querySelector(".main-menu");
const masonryGrid = document.querySelector(".masonry-grid");

function createMasonryGrid(columns, images) {
  // this element is cleared and then populated with div.columns with div.images
  masonryGrid.innerHTML = "";

  // this is and array of column heights, each starting at 0 as they're all empty at this point
  let columnHeights = {};
  //creating keys in column heights array depending on number passed into columns parameter
  for (let i = 0; i < columns; i++) {
    columnHeights[`column${i}`] = 0;
  }

  // creating div elements in html doc for each of the column and appending them to masonry grid
  // this step is necessary at this point to be able to appendChildren to column elements
  Object.keys(columnHeights).forEach((col) => {
    let columnDiv = document.createElement("div");
    columnDiv.classList.add("column-gallery");
    columnDiv.classList.add(`${col}`);
    masonryGrid.appendChild(columnDiv);
  });

  //Lastly adding images, each to the column that has lowest height during each iteration
  images.forEach(function (img) {
    // checking which of the columns in columnHeights object is the shortest
    const heights = Object.values(columnHeights);
    const minValue = Math.min(...heights);
    const lowestCol = Object.keys(columnHeights).find(
      (key) => columnHeights[key] === minValue
    );

    // selecting html element based on the lowestCol variable.
    // it is possible because columnHeights key names === column classes names
    const lowestColEL = document.querySelector(`.${lowestCol}`);

    const spinnerImg = document.createElement("img");
    spinnerImg.src = "../icons/reload-circle-outline.svg";
    // this is obvious
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("gallery-image");

    const spinner = document.createElement("div");
    spinner.classList.add("loading-spinner");
    spinner.classList.add("gallery-spinner");
    spinner.classList.add("hidden");
    setTimeout(() => {
      spinner.classList.remove("hidden");
    }, 2000);
    spinner.appendChild(spinnerImg);

    imgDiv.appendChild(spinner);

    const overlay = document.createElement("div");
    overlay.classList.add("overlay");
    const title = document.createElement("span");
    title.classList.add("gallery-title");
    title.textContent = titleFormatter(img.title);

    lowestColEL.appendChild(imgDiv);

    const image = document.createElement("img");
    image.classList.add("hidden");
    image.dataset.id = img.id;
    image.src = img.fullRes;

    image.onload = function () {
      overlay.appendChild(title);
      imgDiv.appendChild(image);
      imgDiv.appendChild(overlay);
      spinner.remove();
      setTimeout(() => {
        image.classList.remove("hidden");
      }, 300);
    };

    // image.setAttribute("data-src", img.fullRes);

    // this step is super important We need it to know which column is the shortest
    columnHeights[lowestCol] += img.height;
  });

  fillTheRemainingSpace(columnHeights);
}

function fillTheRemainingSpace(columnHeights) {
  const fillingDivsMarkpups = [1, 2, 3];
  if (Object.entries(columnHeights).length === 1) return;
  const highestCol = Math.max(...Object.values(columnHeights));
  const remainigCols = Object.keys(columnHeights)
    .filter((column) => columnHeights[column] < highestCol)
    .reduce((obj, key) => {
      obj[key] = columnHeights[key];
      return obj;
    }, {});
  Object.keys(remainigCols).forEach((col, index) => {
    const colEL = document.querySelector(`.${col}`);
    const divEl = document.createElement("div");
    divEl.classList.add("column-gallery-filler");
    divEl.innerHTML = markups[index];
    colEL.appendChild(divEl);
  });
}

if (window.innerWidth < 600) {
  createMasonryGrid(1, images);
} else if (window.innerWidth >= 600 && window.innerWidth < 1000) {
  createMasonryGrid(2, images);
} else {
  createMasonryGrid(4, images);
}

let previousScreenSize = window.innerWidth;
window.addEventListener("resize", function (e) {
  // imgIndex = 0;

  if (window.innerWidth < 600 && previousScreenSize >= 600) {
    createMasonryGrid(1, images);
  } else if (
    window.innerWidth >= 600 &&
    window.innerWidth < 1000 &&
    (previousScreenSize < 600 || previousScreenSize >= 1000)
  ) {
    createMasonryGrid(2, images);
  } else if (
    window.innerWidth >= 1000 &&
    window.innerWidth < 1400 &&
    (previousScreenSize < 1000 || previousScreenSize >= 1400)
  ) {
    createMasonryGrid(3, images);
  } else if (window.innerWidth >= 1400 && previousScreenSize < 1400) {
    createMasonryGrid(4, images);
  }
  previousScreenSize = window.innerWidth;
});

masonryGrid.addEventListener("mouseover", function (e) {
  if (
    e.target.classList.contains("overlay") ||
    e.target.classList.contains("gallery-title")
  ) {
    e.target.closest(".gallery-image").querySelector("img").style.transform =
      "scale(1.03)";
  }
});

masonryGrid.addEventListener("mouseout", function (e) {
  if (!e.target.parentElement.querySelector("img")) return;
  e.target.parentElement.querySelector("img").style.transform = "scale(1)";
});

// FOR RESPONSIVENESS, NOT SURE ABOUT THE FUTURE OF IT

// ******************************************************
// -----DETAILS VIEW WITH LOADING SPINNER---------------
// ******************************************************

const masonryGallery = document.querySelector(".masonry-gallery");
const paintingDetailsModal = document.querySelector(".painting-details-modal");

masonryGallery.addEventListener("click", function (e) {
  const galleryImg = e.target.closest(".gallery-image");
  if (!galleryImg) return;
  // paintingDetailsModal.innerHTML = "";

  const id = Number(galleryImg.querySelector("img").dataset.id);
  const img = images.find((img) => img.id === id);
  const markup = getMarkupForDetailsView(img);
  paintingDetailsModal.insertAdjacentHTML("afterbegin", markup);
  paintingDetailsModal.classList.remove("hidden");
  paintingDetailsModal.classList.remove("behind");
  navbar.classList.add("sticky-permanent");

  const paintingDetailsBackground = document.querySelector(
    ".painting-details-background"
  );

  const spinner = document.querySelector(".loading-spinner");

  const paintingImgEl = document.createElement("img");
  paintingImgEl.classList.add("painting-details-img");
  paintingImgEl.src = `../paintings/fullRes/${img.fileName}`;

  const paintingDetailsEl = document.createElement("div");
  paintingDetailsEl.classList.add("painting-details");
  paintingDetailsEl.classList.add("hidden");
  const paintingNameEl = document.createElement("h3");
  paintingNameEl.classList.add("painting-details-name");
  paintingNameEl.textContent = titleFormatter(img.title);
  const paintingSizeEl = document.createElement("p");
  paintingSizeEl.classList.add("painting-details-size");
  paintingSizeEl.textContent = "Size = 120cm x 80cm";

  paintingImgEl.onload = function () {
    paintingDetailsEl.appendChild(paintingNameEl);
    paintingDetailsEl.appendChild(paintingImgEl);
    paintingDetailsEl.appendChild(paintingSizeEl);
    spinner.remove();
    paintingDetailsBackground.appendChild(paintingDetailsEl);
    setTimeout(() => {
      paintingDetailsEl.classList.remove("hidden");
    }, 100);
  };

  mobileOpenBtn.style.display = "none";

  window.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("painting-details-close-icon") ||
      e.target.classList.contains("painting-details-container") ||
      e.target.closest(".nav")
    ) {
      const paintingDetailsContainer = document.querySelector(
        ".painting-details-container"
      );
      paintingDetailsModal.classList.add("hidden");
      navbar.classList.remove("sticky-permanent");
      this.setTimeout(() => {
        paintingDetailsModal.classList.add("behind");
      }, 300);
      mobileOpenBtn.style.display = "block";
    }
  });
});

// ****************************************************
// -------------------DETAILS VIEW END-----------------
// ****************************************************

// ****************************************************
// -------------MASONRY GRID LAYOUT END----------------
// ****************************************************

contactLink.addEventListener("click", (e) => {
  e.preventDefault();
  const targetId = e.target.getAttribute("href").substring(1);
  const targetSection = document.getElementById(targetId);
  targetSection.scrollIntoView({ behavior: "smooth", block: "center" });
});

const observer = new IntersectionObserver(
  (entries, observer) => {
    console.log(entries);

    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        setTimeout(() => {
          navbar.classList.add("sticky");
        }, 200);
      } else {
        setTimeout(() => {
          navbar.classList.remove("sticky");
        }, 200);
      }
    });
  },
  {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  }
);

observer.observe(header);

mobileOpenBtn.addEventListener("click", function () {
  mainMenu.classList.add("show-mobile-menu");
  mobileOpenBtn.style.display = "none";
});

mainMenu.addEventListener("click", (e) => {
  if (!mainMenu.classList.contains("show-mobile-menu")) return;
  if (
    e.target.classList.contains("nav-link") ||
    e.target.closest(".btn-mobile-close")
  ) {
    mainMenu.classList.remove("show-mobile-menu");
    mobileOpenBtn.style.display = "block";
  }
});

window.addEventListener("resize", function (e) {
  if (window.innerWidth <= 832) {
    mobileOpenBtn.style.display = "block";
    mainMenu.style.display = "none";
    this.setTimeout(() => {
      mainMenu.style.display = "flex";
    }, 500);
  } else if (window.innerWidth > 832) {
    mobileOpenBtn.style.display = "none";
  }
});
