document.addEventListener('DOMContentLoaded', initHomeSection);

function initHomeSection() {
  const homeSection = document.querySelector('.background');
  if (!homeSection) return;

  homeSection.setAttribute('aria-label', 'Toko Mujur');
}
