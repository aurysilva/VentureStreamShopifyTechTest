const scrollContainer = document.getElementById("scrollContainer");

let currentIndex = 0;
let itemsPerView = getItemsPerView();
let itemWidth;
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID;

let items = Array.from(document.querySelectorAll('.carousel-item'));
const originalItems = [...items];

function addInfiniteScroll() {
  // Clone items on both ends initially
  cloneItems();
  updateCarousel();
  scrollContainer.scrollLeft = itemsPerView * itemWidth; // Start at the center
}

// Clone items at the start and end
function cloneItems() {
  originalItems.slice(-itemsPerView).forEach((item) => {
    const clone = item.cloneNode(true);
    scrollContainer.insertBefore(clone, scrollContainer.firstChild);
  });

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    scrollContainer.appendChild(clone);
  });

  // Update items array and container width
  items = Array.from(scrollContainer.children);
  scrollContainer.style.width = `${items.length * itemWidth}px`; // Set width dynamically
}

function getItemsPerView() {
  if (window.innerWidth >= 1420) return 5;
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 920) return 3;
  if (window.innerWidth >= 600) return 2;
  return 1;
}

function updateCarousel() {
  itemsPerView = getItemsPerView();
  itemWidth = scrollContainer.clientWidth / itemsPerView;
  items.forEach((item) => (item.style.width = `${itemWidth}px`));
}

function checkAndLoop() {
  if (scrollContainer.scrollLeft >= (items.length - itemsPerView) * itemWidth) {
    // Add clones at the end
    cloneItems();
  } else if (scrollContainer.scrollLeft <= 0) {
    // Add clones at the start and adjust scroll position
    const previousScrollLeft = scrollContainer.scrollLeft;
    cloneItems();
    scrollContainer.scrollLeft = previousScrollLeft + itemsPerView * itemWidth;
  }
}

function snapToItem() {
  const newIndex = Math.round(scrollContainer.scrollLeft / itemWidth) % originalItems.length;
  currentIndex = newIndex;
  scrollContainer.scrollTo({ left: currentIndex * itemWidth, behavior: 'smooth' });
}

// Event listeners for dragging
scrollContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startPos = e.pageX - scrollContainer.offsetLeft;
  prevTranslate = scrollContainer.scrollLeft;
  animationID = requestAnimationFrame(animation);
});

window.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const currentPosition = e.pageX - scrollContainer.offsetLeft;
    const distance = startPos - currentPosition;
    scrollContainer.scrollLeft = prevTranslate + distance;
    checkAndLoop();
  }
});

window.addEventListener("mouseup", () => {
  if (isDragging) {
    isDragging = false;
    cancelAnimationFrame(animationID);
    snapToItem();
  }
});

scrollContainer.addEventListener("mouseleave", () => {
  if (isDragging) {
    isDragging = false;
    cancelAnimationFrame(animationID);
    snapToItem();
  }
});

scrollContainer.addEventListener("dragstart", (e) => e.preventDefault());

scrollContainer.addEventListener("touchstart", (e) => {
  isDragging = true;
  startPos = e.touches[0].clientX - scrollContainer.offsetLeft;
  prevTranslate = scrollContainer.scrollLeft;
  animationID = requestAnimationFrame(animation);
});

scrollContainer.addEventListener("touchmove", (e) => {
  if (isDragging) {
    const currentPosition = e.touches[0].clientX - scrollContainer.offsetLeft;
    const distance = startPos - currentPosition;
    scrollContainer.scrollLeft = prevTranslate + distance;
    checkAndLoop();
  }
});

scrollContainer.addEventListener("touchend", () => {
  isDragging = false;
  cancelAnimationFrame(animationID);
  snapToItem();
});

window.addEventListener("resize", updateCarousel);

addInfiniteScroll();
updateCarousel();

function animation() {
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}
