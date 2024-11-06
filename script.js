const scrollContainer = document.getElementById("scrollContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const dotsContainer = document.getElementById("dotsContainer");

let isDown = false;
let startX;
let scrollLeft;
let autoplayInterval;
let currentIndex = 0;
const items = Array.from(document.querySelectorAll('.carousel-item'));
const totalItems = items.length;

// Responsive breakpoints
const breakpoints = {
  0: 1,
  600: 2,
  900: 3,
  1200: 4,
};

function getVisibleItems() {
  const screenWidth = window.innerWidth;
  let itemsToShow = 1;

  for (const [breakpoint, items] of Object.entries(breakpoints)) {
    if (screenWidth >= breakpoint) {
      itemsToShow = items;
    }
  }

  return itemsToShow;
}

let visibleItems = getVisibleItems();
let itemWidth = scrollContainer.clientWidth / visibleItems;

window.addEventListener('resize', () => {
  visibleItems = getVisibleItems();
  itemWidth = scrollContainer.clientWidth / visibleItems;
  adjustScrollPosition();
});

// Cloning for Infinite Loop
items.forEach(item => {
  const cloneBefore = item.cloneNode(true);
  const cloneAfter = item.cloneNode(true);
  scrollContainer.insertBefore(cloneBefore, scrollContainer.firstChild);
  scrollContainer.appendChild(cloneAfter);
});

// Adjust initial scroll to the "real" first item
scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;

// Autoplay Functionality
function startAutoplay() {
  autoplayInterval = setInterval(() => {
    moveToNext();
  }, 3000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

function moveToNext() {
  if (currentIndex >= totalItems - visibleItems) {
    scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
    currentIndex = 0;
  } else {
    currentIndex++;
    scrollContainer.scrollLeft += itemWidth;
  }
  updateDots();
}

function moveToPrev() {
  if (currentIndex <= 0) {
    scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3 - itemWidth * totalItems;
    currentIndex = totalItems - visibleItems;
  } else {
    currentIndex--;
    scrollContainer.scrollLeft -= itemWidth;
  }
  updateDots();
}

function adjustScrollPosition() {
  scrollContainer.scrollLeft = currentIndex * itemWidth;
}

function createDots() {
  for (let i = 0; i < totalItems; i++) {
    const dot = document.createElement('div');
    dot.classList = 'dot w-3 h-3 bg-gray-400 rounded-full';
    dot.addEventListener('click', () => scrollToIndex(i));
    dotsContainer.appendChild(dot);
  }
  updateDots();
}

function updateDots() {
  Array.from(dotsContainer.children).forEach((dot, index) => {
    dot.classList.toggle('bg-gray-700', index === currentIndex);
  });
}

function scrollToIndex(index) {
  stopAutoplay();
  currentIndex = index;
  scrollContainer.scrollLeft = (scrollContainer.scrollWidth / 3) + index * itemWidth;
  updateDots();
  startAutoplay();
}

// Draggable Scroll
scrollContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  scrollContainer.classList.add("cursor-grabbing");
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
  stopAutoplay();
});

scrollContainer.addEventListener("mouseleave", () => {
  isDown = false;
  scrollContainer.classList.remove("cursor-grabbing");
  startAutoplay();
});

scrollContainer.addEventListener("mouseup", () => {
  isDown = false;
  scrollContainer.classList.remove("cursor-grabbing");
  startAutoplay();
});

scrollContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 1.5;
  scrollContainer.scrollLeft = scrollLeft - walk;
});

nextBtn.addEventListener("click", () => {
  stopAutoplay();
  moveToNext();
  startAutoplay();
});

prevBtn.addEventListener("click", () => {
  stopAutoplay();
  moveToPrev();
  startAutoplay();
});

createDots();
startAutoplay();
