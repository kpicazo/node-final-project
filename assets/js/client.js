const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.close');

// Event handler for close button on the home page modal
closeBtn.addEventListener('click', function() {
  modal.style.display = 'none';
});