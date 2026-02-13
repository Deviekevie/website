let sliderImages = [];
let currentIndex = 0;

function openSlider(images) {
  sliderImages = images;
  currentIndex = 0;

  document.getElementById('sliderImage').src = sliderImages[currentIndex];
  document.getElementById('imageSliderModal').style.display = 'flex';
}

function closeSlider() {
  document.getElementById('imageSliderModal').style.display = 'none';
}

function changeSlide(step) {
  currentIndex += step;

  if (currentIndex < 0) {
    currentIndex = sliderImages.length - 1;
  }

  if (currentIndex >= sliderImages.length) {
    currentIndex = 0;
  }

  document.getElementById('sliderImage').src = sliderImages[currentIndex];
}
