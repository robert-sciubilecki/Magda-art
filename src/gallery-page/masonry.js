// ****************************************************
// ----------------MASONRY GRID LAYOUT-----------------
// ****************************************************
import { getImages } from "./paintings-data";

const images = getImages();

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
  //Last but not least adding images, each to the column that has lowest height during each iteration
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
    // image.setAttribute("data-src", img.fullRes);
    let overlay = document.createElement("div");
    overlay.classList.add("overlay");
    let title = document.createElement("h3");
    title.classList.add("gallery-title");
    title.textContent = img.title.split(".")[0];
    overlay.appendChild(title);
    imgDiv.appendChild(image);
    imgDiv.appendChild(overlay);
    console.log(imgDiv);

    // this step is super important We need it to know which column is the shortest
    columnHeights[lowestCol] += img.height;
    lowestColEL.appendChild(imgDiv);
  });
}

createMasonryGrid(4, images);

masonryGrid.addEventListener("mouseover", function (e) {
  if (
    e.target.classList.contains("overlay") ||
    e.target.classList.contains("gallery-title")
  ) {
    e.target.closest(".gallery-image").querySelector("img").style.transform =
      "scale(1.05)";
  }
});

masonryGrid.addEventListener("mouseout", function (e) {
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

// ****************************************************
// -------------MASONRY GRID LAYOUT END----------------
// ****************************************************
