const PDFUrl = "../documents/sample.pdf";

const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const currentPage = document.getElementById("current");
const totalPages = document.getElementById("total");
const viewer = document.getElementById("viewer");

let Document = null,
  current = 1,
  total = 1,
  isRendering = false,
  currentIsPending = false;

const options = {
  scale: 1.25,
  viewer,
  context: viewer.getContext("2d"),
};

const RenderPage = (page) => {
  isRendering = true;
  Document.getPage(page).then((retrieved) => {
    const viewport = retrieved.getViewport({ scale: options.scale });
    viewer.height = viewport.height;
    viewer.width = viewport.width;
    retrieved
      .render({
        canvasContext: options.context,
        viewport,
      })
      .promise.then(() => {
        isRendering = false;

        if (currentIsPending) {
          RenderPage(currentIsPending);
          currentIsPending = false;
        }
      });
    currentPage.textContent = page;
  });
};

const QueuePage = (page) => {
  if (isRendering) {
    currentIsPending = page;
  } else {
    RenderPage(page);
  }
};

const NextPage = () => {
  if (current >= total) {
    return;
  } else {
    current++;
    QueuePage(current);
  }
};

const PreviousPage = () => {
  if (current <= 1) {
    return;
  } else {
    current--;
    QueuePage(current);
  }
};

pdfjsLib
  .getDocument(PDFUrl)
  .promise.then((document) => {
    Document = document;
    total = totalPages.textContent = document.numPages;

    RenderPage(current);
  })
  .catch((error) => {
    //Catch error and show error message here
    console.log(error);
  });

previousButton.addEventListener("click", PreviousPage);
nextButton.addEventListener("click", NextPage);
