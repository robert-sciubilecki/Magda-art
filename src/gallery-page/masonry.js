// ****************************************************
// ----------------MASONRY GRID LAYOUT-----------------
// ****************************************************
import { getImages } from "./paintings-data";
import { markups } from "./markups";
import { getMarkupForDetailsView } from "./markups";
import { titleFormatter } from "./markups";

const images = getImages();

const masonryGrid = document.querySelector(".masonry-grid");

const lowercaseWords = [
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "down",
  "for",
  "from",
  "if",
  "in",
  "into",
  "like",
  "near",
  "nor",
  "of",
  "off",
  "on",
  "once",
  "onto",
  "or",
  "over",
  "past",
  "so",
  "than",
  "that",
  "the",
  "to",
  "upon",
  "when",
  "with",
  "yet",
];

// function titleFormatter(title) {
//   const titleToArr = title.split(" ").map((word, index) => {
//     if (
//       index === 0 ||
//       index === title.length - 1 ||
//       !lowercaseWords.includes(word.toLowerCase())
//     ) {
//       return word.charAt(0).toUpperCase() + word.slice(1);
//     }
//     return word.toLowerCase();
//   });
//   return titleToArr.join(" ");
// }

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
    // this is obvious
    let imgDiv = document.createElement("div");
    imgDiv.classList.add("gallery-image");
    let image = document.createElement("img");
    image.src = img.fullRes;
    image.dataset.id = img.id;
    // image.setAttribute("data-src", img.fullRes);
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    let title = document.createElement("span");
    title.classList.add("gallery-title");
    title.textContent = titleFormatter(img.title);
    overlay.appendChild(title);
    imgDiv.appendChild(image);
    imgDiv.appendChild(overlay);

    // this step is super important We need it to know which column is the shortest
    columnHeights[lowestCol] += img.height;
    lowestColEL.appendChild(imgDiv);
  });
  fillTheRemainingSpace(columnHeights);
}

masonryGrid.addEventListener("load", function (e) {
  console.log(e);
});

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

createMasonryGrid(4, images);

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
  } else if (window.innerWidth >= 1000 && previousScreenSize < 1000) {
    createMasonryGrid(4, images);
  }
  previousScreenSize = window.innerWidth;
});

// ******************************************************
// -----DETAILS VIEW WITH LOADING SPINNER---------------
// ******************************************************

const masonryGallery = document.querySelector(".masonry-gallery");
const paintingDetailsModal = document.querySelector(".painting-details-modal");

masonryGallery.addEventListener("click", function (e) {
  const galleryImg = e.target.closest(".gallery-image");
  if (!galleryImg) return;
  paintingDetailsModal.innerHTML = "";

  const id = Number(galleryImg.querySelector("img").dataset.id);
  const img = images.find((img) => img.id === id);
  const markup = getMarkupForDetailsView(img);
  paintingDetailsModal.insertAdjacentHTML("afterbegin", markup);
  paintingDetailsModal.classList.remove("hidden");
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

  window.addEventListener("click", function (e) {
    if (
      e.target.classList.contains("painting-details-close-icon") ||
      e.target.classList.contains("painting-details-container") ||
      e.target.closest(".nav")
    ) {
      paintingDetailsModal.classList.add("hidden");
      navbar.classList.remove("sticky-permanent");
    }
  });
});

// ****************************************************
// -------------------DETAILS VIEW END-----------------
// ****************************************************

// ****************************************************
// -------------MASONRY GRID LAYOUT END----------------
// ****************************************************

const contactLink = document.querySelector(".contact-link");
const navbar = document.querySelector(".nav");
const header = document.querySelector(".main-header");

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
