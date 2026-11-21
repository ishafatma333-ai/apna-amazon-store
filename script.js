const products = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", category: "Audio", price: 2499 },
  { id: 2, name: "Smart Fitness Watch Series", category: "Wearables", price: 1999 },
  { id: 3, name: "Mechanical Gaming Keyboard", category: "Accessories", price: 3299 },
  { id: 4, name: "USB-C Fast Charging Power Bank 20000mAh", category: "Accessories", price: 1599 },
  { id: 5, name: "Bluetooth True Wireless Earbuds", category: "Audio", price: 1299 },
  { id: 6, name: "AMOLED Smart Band Tracker", category: "Wearables", price: 1499 }
];

let cart = [];
let activeCategory = "All";

const grid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const catButtons = document.querySelectorAll(".cat-btn");

const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItemsContainer = document.getElementById("cartItems");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = "<p>No matching products found.</p>";
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div>
        <span class="tag">${item.category}</span>
        <h3>${item.name}</h3>
        <p>Fast delivery • 1 Year Warranty</p>
      </div>
      <div>
        <div class="price">₹${item.price.toLocaleString("en-IN")}</div>
        <button onclick="addToCart(${item.id})">Add to Cart</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  cart.push({ ...product, cartItemId: Date.now() + Math.random() });
  updateCartUI();
}

function removeFromCart(cartItemId) {
  cart = cart.filter((item) => item.cartItemId !== cartItemId);
  updateCartUI();
}

function updateCartUI() {
  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

  document.getElementById("cartCount").textContent = cart.length;
  document.getElementById("cartTotal").textContent = totalAmount.toLocaleString("en-IN");
  document.getElementById("drawerTotal").textContent = totalAmount.toLocaleString("en-IN");

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p class="empty-msg">Your cart is empty.</p>`;
    return;
  }

  cartItemsContainer.innerHTML = "";
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <span>₹${item.price.toLocaleString("en-IN")}</span>
      </div>
      <button class="remove-btn" onclick="removeFromCart(${item.cartItemId})">Remove</button>
    `;
    cartItemsContainer.appendChild(row);
  });
}

function toggleDrawer(isOpen) {
  cartDrawer.classList.toggle("open", isOpen);
  cartOverlay.classList.toggle("open", isOpen);
}

catButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    catButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeCategory = btn.dataset.category;
    renderProducts();
  });
});

searchBtn.addEventListener("click", renderProducts);
searchInput.addEventListener("input", renderProducts);

openCartBtn.addEventListener("click", () => toggleDrawer(true));
closeCartBtn.addEventListener("click", () => toggleDrawer(false));
cartOverlay.addEventListener("click", () => toggleDrawer(false));

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Add at least one item to your cart first!");
    return;
  }
  alert("Order placed successfully! Thank you for shopping with ShopZone.");
  cart = [];
  updateCartUI();
  toggleDrawer(false);
});

renderProducts();
