const scrollContainer = document.getElementById("scrollContainer");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const dotsContainer = document.getElementById("dotsContainer");

let currentIndex = 0;
let autoplayInterval;
let itemsPerView = getItemsPerView();
let itemWidth;

let items = Array.from(document.querySelectorAll('.carousel-item'));
const originalItems = [...items]; // Keep a reference to the original items

// Cloning for Infinite Scroll Effect
function addInfiniteScroll() {
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    scrollContainer.appendChild(clone);
  });
  updateCarousel();
}

// Adjust items per view based on screen size
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
  scrollContainer.scrollLeft = currentIndex * itemWidth;
}

// Smooth scroll function
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
  currentIndex++;
  scrollToIndex(currentIndex);

  // Infinite loop: check if we've reached the end of the cloned items
  if (currentIndex >= items.length - itemsPerView) {
    // Append the original items again to maintain an infinite effect
    originalItems.forEach((item) => {
      const clone = item.cloneNode(true);
      scrollContainer.appendChild(clone);
      items.push(clone);
    });
  }
  updateDots();
}

function moveToPrev() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = items.length - itemsPerView;
    scrollToIndex(currentIndex, false); // Instantly scroll back to last real item
  }
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
  for (let i = 0; i < originalItems.length; i++) {
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
    dot.classList.toggle('active', index === currentIndex % originalItems.length);
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
addInfiniteScroll(); // Clone initial items to set up infinite scroll
createDots();
updateCarousel();
updateVisibleItems();
startAutoplay();
