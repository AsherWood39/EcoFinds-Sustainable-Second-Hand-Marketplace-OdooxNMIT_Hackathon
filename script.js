import images from './utils/images.json';

// Sample products
const products = [
  { 
    id: 1, 
    name: "Organic Cotton T-Shirt", 
    category: "Clothing", 
    price: 15.99, 
    img: images.tshirt },
  { 
    id: 2, 
    name: "Reusable Water Bottle", 
    category: "Accessories", 
    price: 9.99, 
    img: images.bottle },
  { 
    id: 3, 
    name: "Bamboo Toothbrush", 
    category: "Personal Care", 
    price: 3.99, 
    img: images.toothbrush },
  { 
    id: 4, 
    name: "Upcycled Denim Jeans", 
    category: "Clothing", 
    price: 29.99, 
    img: images.jeans },
  { 
    id: 5, 
    name: "Solar Powered Charger", 
    category: "Electronics", 
    price: 24.99, 
    img: images.charger },
  { 
    id: 6, 
    name: "Handmade Tote Bag", 
    category: "Accessories", 
    price: 12.99, 
    img: images.tote },
];

const categories = ["All", ...new Set(products.map(p => p.category))];
let selectedCategory = "All";
let searchQuery = "";
let cart = [];

function renderCategories() {
  const catDiv = document.getElementById('categories');
  catDiv.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.className = cat === selectedCategory ? 'active' : '';
    btn.onclick = () => {
      selectedCategory = cat;
      renderProducts();
      renderCategories();
    };
    catDiv.appendChild(btn);
  });
}

function renderProducts() {
  const prodDiv = document.getElementById('products');
  prodDiv.innerHTML = '';
  let filtered = products.filter(p =>
    (selectedCategory === "All" || p.category === selectedCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (filtered.length === 0) {
    prodDiv.innerHTML = '<p>No products found.</p>';
    return;
  }
  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>Category: ${p.category}</p>
      <p>Price: $${p.price.toFixed(2)}</p>
      <button onclick="addToCart(${p.id})">Add to Cart</button>
    `;
    prodDiv.appendChild(card);
  });
}

window.addToCart = function(id) {
  const prod = products.find(p => p.id === id);
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty++;
  } else {
    cart.push({ ...prod, qty: 1 });
  }
  renderCart();
}

window.removeFromCart = function(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

function renderCart() {
  if (cart.length === 0) {
    document.getElementById('cartItemsContainer').style.display = 'none';
    document.getElementById('cartTotal').textContent = '0.00';
  }
  else {
    document.getElementById('cartItemsContainer').style.display = 'block';
    const cartList = document.getElementById('cartItems');
    cartList.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.qty;
      const li = document.createElement('li');
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.justifyContent = "space-between";
      li.style.marginBottom = "0.5rem";
      li.style.marginRight = "4rem";
      li.innerHTML = `
        <span style="max-width:70%;overflow:hidden;text-overflow:ellipsis;">
        ${item.name} x${item.qty} - $${(item.price * item.qty).toFixed(2)}
        </span>
        <button onclick="removeFromCart(${item.id})" style="background:#c62828;color:#fff;border:none;padding:0.4rem 1rem;border-radius:3px;cursor:pointer;">Remove</button>
      `;
      cartList.appendChild(li);
    });
    document.getElementById('cartTotal').textContent = total.toFixed(2);
  }
}

document.getElementById('checkoutBtn').onclick = function() {
  if (cart.length === 0) {
    document.getElementById('checkoutMessage').textContent = "Your cart is empty.";
    return;
  }
  document.getElementById('checkoutMessage').textContent = "Thank you for your purchase!";
  cart = [];
  renderCart();
  setTimeout(() => {
    document.getElementById('checkoutMessage').textContent = "";
  }, 3000);
};

document.getElementById('searchInput').oninput = function(e) {
  searchQuery = e.target.value;
  renderProducts();
};

renderCategories();
renderProducts();
renderCart();

let darkmode = localStorage.getItem("darkmode");
const themeToggle = document.getElementById("theme-toggle"); 

const setLogoBg = () => {
  Array.from(document.getElementsByClassName("logo")).forEach(logo => {
    logo.style.backgroundColor = localStorage.getItem("darkmode") === "active"
      ? "rgba(165, 214, 167, 0.7)"
      : "rgba(40, 104, 43, 0.2)";
  });
};

const enableDarkMode = () => {
  document.body.classList.add("darkmode");
  localStorage.setItem("darkmode", "active");
  setLogoBg();
};

const disableDarkMode = () => {
  document.body.classList.remove("darkmode");
  localStorage.setItem("darkmode", null);
  setLogoBg();
};

// Initialize theme on page load
if (darkmode === "active") enableDarkMode();

// Add click event only if toggle button exists
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    darkmode = localStorage.getItem('darkmode');
    if (darkmode !== "active") {
      enableDarkMode();
    } else {
      disableDarkMode();
    }
  });
}

// Call setLogoBg on page load
setLogoBg();