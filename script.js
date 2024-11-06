const scrollContainer = document.getElementById("scrollContainer");

let currentIndex = 0;
let autoplayInterval;
let itemsPerView = getItemsPerView();
let itemWidth;
let isDragging = false;
let startX;
let scrollLeft;

let items = Array.from(document.querySelectorAll('.carousel-item'));
const originalItems = [...items];

// Cloning for Infinite Scroll Effect at both ends
function addInfiniteScroll() {
  originalItems.slice(-itemsPerView).forEach((item) => {
    const clone = item.cloneNode(true);
    scrollContainer.insertBefore(clone, scrollContainer.firstChild);
  });

  originalItems.forEach((item) => {
    const clone = item.cloneNode(true);
    scrollContainer.appendChild(clone);
  });

  items = Array.from(scrollContainer.children);
  updateCarousel();
  scrollContainer.scrollLeft = itemsPerView * itemWidth;
}

function getItemsPerView() {
  if (window.innerWidth >= 1420) return 4;
  if (window.innerWidth >= 900) return 3;
  if (window.innerWidth >= 600) return 2;
  return 1;
}

function updateCarousel() {
  itemsPerView = getItemsPerView();
  itemWidth = scrollContainer.clientWidth / itemsPerView;
  items.forEach((item) => (item.style.width = `${itemWidth}px`));
  scrollContainer.scrollLeft = (currentIndex + itemsPerView) * itemWidth;
}

function scrollToIndex(index, smooth = true) {
  const scrollOptions = {
    left: (index + itemsPerView) * itemWidth,
    behavior: smooth ? 'smooth' : 'auto',
  };
  scrollContainer.scrollTo(scrollOptions);

  if (index >= originalItems.length) {
    currentIndex = 0;
    scrollContainer.scrollLeft = itemsPerView * itemWidth;
  } else if (index < 0) {
    currentIndex = originalItems.length - 1;
    scrollContainer.scrollLeft = (currentIndex + itemsPerView) * itemWidth;
  }
}

function startAutoplay() {
  autoplayInterval = setInterval(() => {
    moveToNext();
  }, 3000);
}

function stopAutoplay() {
  clearInterval(autoplayInterval);
}

// Attach event listeners to each carousel item for click-and-drag functionality
items.forEach((item) => {
  item.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - scrollContainer.offsetLeft;
    scrollLeft = scrollContainer.scrollLeft;
    stopAutoplay();
  });
});

// Stop dragging when the mouse button is released
document.addEventListener('mouseup', () => {
  if (isDragging) {
    isDragging = false;
    snapToNearest();
    startAutoplay();
  }
});

// Stop dragging if the mouse leaves the scroll container
scrollContainer.addEventListener('mouseleave', () => {
  if (isDragging) {
    isDragging = false;
    snapToNearest();
    startAutoplay();
  }
});

// Drag functionality when the mouse moves
document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX); // Adjust to scroll left or right only
  scrollContainer.scrollLeft = scrollLeft - walk;
});

// Snap effect to the nearest item
function snapToNearest() {
  const closestIndex = Math.round(scrollContainer.scrollLeft / itemWidth) - itemsPerView;
  currentIndex = (closestIndex + originalItems.length) % originalItems.length;
  scrollToIndex(currentIndex);
}

// Event Listeners
window.addEventListener('resize', () => {
  updateCarousel();
  scrollToIndex(currentIndex, false);
});

// Initial setup
addInfiniteScroll();
updateCarousel();
startAutoplay();
