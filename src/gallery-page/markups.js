export const markups = {
  0: `
    <div class='filler-link'>
      <a class='back-to-home-filler' href='index.html'>Home Page</a>
    </div>
  `,
  1: `
    <div class="social-container">
      <ul class="social-list">
        <li>
          <a href="https://www.instagram.com"
            ><img
              class="social-icon"
              src="../icons/logo-instagram.svg"
              alt=""
          /></a>
        </li>
        <li>
          <a href="https://www.facebook.com"
            ><img
              class="social-icon"
              src="../icons/logo-facebook.svg"
              alt=""
          /></a>
        </li>
      </ul>
    </div>
  `,

  2: `
    <div class='filler-link'>
      <a class='buy-painting-filler' href='index.html'>Buy a Painting</a>
    </div>
  `,
};

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

export function titleFormatter(title) {
  const titleToArr = title.split(" ").map((word, index) => {
    if (
      index === 0 ||
      index === title.length - 1 ||
      !lowercaseWords.includes(word.toLowerCase())
    ) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word.toLowerCase();
  });
  return titleToArr.join(" ");
}

export function getMarkupForDetailsView(image) {
  // console.log(image);
  // const imgSrc = `../paintings/fullRes/${image.fileName}`;
  // const imgName = titleFormatter(image.title);
  // console.log(imgName);
  // console.log(imgSrc);

  const markup = `
    <div class="painting-details-container">
      <div class="painting-details-background">
        <div class="painting-details-close">
          <img class='painting-details-close-icon' src="../icons/close-outline.svg">
        </div>
        
        <div class="loading-spinner">
          <img src="../icons/reload-circle-outline.svg" alt="Loading spinner" />
        </div>
      </div>
    </div>
  `;
  return markup;
}

`<div class="painting-details">
          <h3 class="painting-details-name"></h3>
          <img
            class="painting-details-img"
            src=""
            alt=" closeup"
          />
          <p class="painting-details-size">Size = 120cm x 80cm</p>
        </div>`;
