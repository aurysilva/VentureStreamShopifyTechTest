const scrollContainer = document.getElementById("scrollContainer");

let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  scrollContainer.classList.add("cursor-grabbing");
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener("mouseleave", () => {
  if (isDown) {
    isDown = false;
    scrollContainer.classList.remove("cursor-grabbing");
  }
});

scrollContainer.addEventListener("mouseup", () => {
  if (isDown) {
    isDown = false;
    scrollContainer.classList.remove("cursor-grabbing");
  }
});

scrollContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 1.5; // Adjust scroll speed if necessary
  scrollContainer.scrollLeft = scrollLeft - walk;
});
