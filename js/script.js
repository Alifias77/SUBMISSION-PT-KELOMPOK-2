document.addEventListener('DOMContentLoaded', function () {
  const produkLink = document.getElementById('produkLink');
  const gallery = document.getElementById('product-gallery');
  if (!produkLink || !gallery) return;
  produkLink.addEventListener('click', function (e) {
    e.preventDefault();
    gallery.classList.toggle('hidden');
  });
});
