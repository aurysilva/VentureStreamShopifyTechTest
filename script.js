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

// Cloning for Infinite Scroll Effect
function addInfiniteScroll() {
  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    scrollContainer.appendChild(clone);
  });
  items = Array.from(scrollContainer.children); // Update items array with new clones
  updateCarousel();
}

// Adjust items per view based on screen size
function getItemsPerView() {
  if (window.innerWidth >= 1420) return 5;
  if (window.innerWidth >= 1280) return 4;
  if (window.innerWidth >= 920) return 3;
  if (window.innerWidth >= 600) return 2;
  return 1;
}

// Update carousel layout on resize
function updateCarousel() {
  itemsPerView = getItemsPerView();
  itemWidth = scrollContainer.clientWidth / itemsPerView;
  items.forEach((item) => (item.style.width = `${itemWidth}px`));
  scrollContainer.scrollLeft = currentIndex * itemWidth;
}

// Snapping to the nearest item
function snapToItem() {
  const scrollPosition = scrollContainer.scrollLeft;
  const newIndex = Math.round(scrollPosition / itemWidth);
  currentIndex = newIndex % originalItems.length;
  scrollContainer.scrollTo({ left: currentIndex * itemWidth, behavior: 'smooth' });
}

// Dragging functionality
scrollContainer.addEventListener("mousedown", (e) => {
  isDragging = true;
  startPos = e.pageX - scrollContainer.offsetLeft;
  prevTranslate = scrollContainer.scrollLeft;
  animationID = requestAnimationFrame(animation);
});

scrollContainer.addEventListener("mousemove", (e) => {
  if (isDragging) {
    const currentPosition = e.pageX - scrollContainer.offsetLeft;
    const distance = startPos - currentPosition;
    scrollContainer.scrollLeft = prevTranslate + distance;
  }
});

scrollContainer.addEventListener("mouseup", () => {
  isDragging = false;
  cancelAnimationFrame(animationID);
  snapToItem();
});

scrollContainer.addEventListener("mouseleave", () => {
  if (isDragging) {
    isDragging = false;
    cancelAnimationFrame(animationID);
    snapToItem();
  }
});

// Prevents default image dragging behavior
scrollContainer.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

// Mobile touch events
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
  }
});

scrollContainer.addEventListener("touchend", () => {
  isDragging = false;
  cancelAnimationFrame(animationID);
  snapToItem();
});

window.addEventListener('resize', updateCarousel);

// Initial setup
addInfiniteScroll();
updateCarousel();

// Animation function to enable smoother dragging
function animation() {
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}
