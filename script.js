const scrollContainer = document.getElementById("scrollContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const dotsContainer = document.getElementById("dotsContainer");

let currentIndex = 0;
let autoplayInterval;
let itemsPerView = getItemsPerView();
let itemWidth;

const items = Array.from(document.querySelectorAll('.carousel-item'));
const totalItems = items.length;

function getItemsPerView() {
  if (window.innerWidth >= 1200) return 4; // Large screens
  if (window.innerWidth >= 900) return 3; // Medium screens
  if (window.innerWidth >= 600) return 2; // Small screens
  return 1; // Extra small screens
}

// Update carousel layout on resize
function updateCarousel() {
  itemsPerView = getItemsPerView();
  itemWidth = scrollContainer.clientWidth / itemsPerView;
  scrollContainer.style.scrollSnapType = "x mandatory";
  scrollToIndex(currentIndex, false); // Reset scroll to current item
}

// Smooth scroll function with animation for each item
function scrollToIndex(index, smooth = true) {
  const scrollOptions = {
    left: index * itemWidth,
    behavior: smooth ? 'smooth' : 'auto'
  };
  scrollContainer.scrollTo(scrollOptions);
  updateVisibleItems();
}

// Navigation functionality
function moveToNext() {
  currentIndex = (currentIndex + 1) % totalItems;
  scrollToIndex(currentIndex);
  updateDots();
}

function moveToPrev() {
  currentIndex = (currentIndex - 1 + totalItems) % totalItems;
  scrollToIndex(currentIndex);
  updateDots();
}

// Update visible items to add "active" class
function updateVisibleItems() {
  items.forEach((item, index) => {
    item.classList.remove('active');
    if (index >= currentIndex && index < currentIndex + itemsPerView) {
      item.classList.add('active');
    }
  });
}

// Dots functionality
function createDots() {
  dotsContainer.innerHTML = '';
  for (let i = 0; i < totalItems; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    dot.addEventListener('click', () => {
      currentIndex = i;
      scrollToIndex(currentIndex);
      updateDots();
    });
    dotsContainer.appendChild(dot);
  }
  updateDots();
}

function updateDots() {
  Array.from(dotsContainer.children).forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

// Autoplay functionality
function startAutoplay() {
  autoplayInterval = setInterval(() => {
    moveToNext();
  }, 3000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Event Listeners
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

window.addEventListener('resize', updateCarousel);

// Initial setup
createDots();
updateCarousel();
updateVisibleItems();
startAutoplay();
