const productsData = [
  {
    id: 's1',
    name: 'Bayam Segar',
    desc: 'Bayam hijau segar langsung dari petani lokal.',
    price: 5000,
    category: 'sayuran',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 's2',
    name: 'Wortel Impor',
    desc: 'Wortel manis dan renyah, kaya vitamin A.',
    price: 12000,
    category: 'sayuran',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 's3',
    name: 'Tomat Merah',
    desc: 'Tomat merah besar, cocok untuk sambal atau jus.',
    price: 8000,
    category: 'sayuran',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sm1',
    name: 'Beras Premium 5kg',
    desc: 'Beras putih pulen kualitas premium tanpa pemutih.',
    price: 75000,
    category: 'sembako',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sm2',
    name: 'Minyak Goreng 2L',
    desc: 'Minyak goreng kelapa sawit jernih, kemasan pouch.',
    price: 36000,
    category: 'sembako',
    image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'sm3',
    name: 'Gula Pasir 1kg',
    desc: 'Gula pasir kristal putih manis alami.',
    price: 16000,
    category: 'sembako',
    image: 'https://images.unsplash.com/photo-1622484211148-71eb2fb6b61d?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'm1',
    name: 'Air Mineral 600ml',
    desc: 'Air mineral pegunungan asli yang menyegarkan.',
    price: 3000,
    category: 'minuman',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=500&q=80'
  },
  {
    id: 'm2',
    name: 'Teh Kotak',
    desc: 'Teh melati manis dalam kemasan praktis.',
    price: 5000,
    category: 'minuman',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80'
  }
];

let cart = [];
let currentModalItem = null;

document.addEventListener('DOMContentLoaded', initProducts);

function initProducts() {
  if (!document.getElementById('sectionProducts')) return;

  renderProducts();
  updateCartUI();
}

function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

function renderProducts() {
  const grids = {
    sayuran: document.getElementById('gridSayuran'),
    sembako: document.getElementById('gridSembako'),
    minuman: document.getElementById('gridMinuman')
  };

  Object.values(grids).forEach(grid => {
    if (grid) grid.innerHTML = '';
  });

  productsData.forEach(product => {
    const grid = grids[product.category];
    if (!grid) return;

    grid.insertAdjacentHTML('beforeend', createProductCard(product));
  });
}

function createProductCard(product) {
  return `
    <div class="product-card">
      <div class="card-img-wrapper" onclick="openModal('${product.id}')">
        <img src="${product.image}" alt="${product.name}" class="card-img" />
      </div>
      <div class="card-body">
        <h3 class="card-title">${product.name}</h3>
        <p class="card-desc">${product.desc}</p>
        <div class="card-footer">
          <span class="card-price">${formatRupiah(product.price)}</span>
          <button class="btn-add" onclick="quickAdd('${product.id}')">+</button>
        </div>
      </div>
    </div>
  `;
}

function filterCategory(cat) {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.innerText.toLowerCase().includes(cat === 'semua' ? 'semua' : cat)) {
      btn.classList.add('active');
    }
  });

  document.querySelectorAll('.products-section').forEach(section => {
    section.style.display = cat === 'semua' || section.dataset.category === cat ? 'block' : 'none';
  });
}

function quickAdd(id) {
  const product = findProduct(id);
  if (!product) return;

  addToCart(product, 1);
  showToast(`${product.name} ditambahkan ke keranjang`);
}

function addToCart(product, qty) {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }

  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartItems || !cartFooter || !cartTotal) return;

  cartItems.innerHTML = '';

  if (cart.length === 0) {
    cartItems.innerHTML = '<div class="empty-state"><p>Keranjang masih kosong</p></div>';
    cartFooter.style.display = 'none';
    return;
  }

  let totalPrice = 0;
  cartFooter.style.display = 'block';

  cart.forEach(item => {
    totalPrice += item.price * item.qty;
    cartItems.insertAdjacentHTML('beforeend', createCartItem(item));
  });

  cartTotal.textContent = formatRupiah(totalPrice);
}

function createCartItem(item) {
  return `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item-img" />
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.name}</h4>
        <p class="cart-item-price">${formatRupiah(item.price)}</p>
        <div class="cart-item-qty">
          <button onclick="updateCartItemQty('${item.id}', -1)">&minus;</button>
          <span>${item.qty}</span>
          <button onclick="updateCartItemQty('${item.id}', 1)">+</button>
        </div>
      </div>
    </div>
  `;
}

function updateCartItemQty(id, delta) {
  const itemIndex = cart.findIndex(item => item.id === id);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }

  updateCartUI();
}

function toggleCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (!sidebar || !overlay) return;

  sidebar.classList.toggle('open');
  overlay.classList.toggle('show');
}

function openModal(id) {
  const product = findProduct(id);
  if (!product) return;

  currentModalItem = { ...product, tempQty: 1 };

  document.getElementById('modalImg').src = product.image;
  document.getElementById('modalName').textContent = product.name;
  document.getElementById('modalDesc').textContent = product.desc;
  document.getElementById('modalPrice').textContent = formatRupiah(product.price);
  document.getElementById('modalQty').textContent = '1';

  document.getElementById('modalOverlay').classList.add('show');
  document.getElementById('itemModal').classList.add('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  document.getElementById('itemModal').classList.remove('show');
  currentModalItem = null;
}

function changeModalQty(delta) {
  if (!currentModalItem) return;

  currentModalItem.tempQty += delta;
  if (currentModalItem.tempQty < 1) currentModalItem.tempQty = 1;

  document.getElementById('modalQty').textContent = currentModalItem.tempQty;
}

function addFromModal() {
  if (!currentModalItem) return;

  addToCart(currentModalItem, currentModalItem.tempQty);
  showToast(`${currentModalItem.tempQty}x ${currentModalItem.name} ditambahkan`);
  closeModal();
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function checkout() {
  if (cart.length === 0) return;

  const note = document.getElementById('orderNote').value;
  let message = 'Halo TOKO MUJUR, saya ingin memesan:\n\n';
  let total = 0;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.name} (${item.qty}x) - ${formatRupiah(item.price * item.qty)}\n`;
    total += item.price * item.qty;
  });

  message += `\n*Total: ${formatRupiah(total)}*`;

  if (note) {
    message += `\n\nCatatan: ${note}`;
  }

  window.open(`https://wa.me/6282194311111?text=${encodeURIComponent(message)}`, '_blank');
}

function findProduct(id) {
  return productsData.find(product => product.id === id);
}
