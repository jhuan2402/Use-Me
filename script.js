const CONFIG = {
  whatsapp: "5531982036733"
};

const products = [
  { id: 1, name: "Conjunto Bella", category: "Conjuntos", price: 89.90, oldPrice: 119.90, tag: "NOVIDADE", tone: "sand" },
  { id: 2, name: "Vestido Luna", category: "Vestidos", price: 119.90, oldPrice: 149.90, tag: "DESTAQUE", tone: "rose" },
  { id: 3, name: "Calça Wide Leg", category: "Jeans", price: 99.90, oldPrice: 129.90, tag: "BEST-SELLER", tone: "blue" },
  { id: 4, name: "Blusa Serena", category: "Blusas", price: 69.90, oldPrice: 89.90, tag: "NOVIDADE", tone: "cream" },
  { id: 5, name: "Conjunto Maya", category: "Conjuntos", price: 109.90, oldPrice: 139.90, tag: "NOVIDADE", tone: "olive" },
  { id: 6, name: "Vestido Áurea", category: "Vestidos", price: 129.90, oldPrice: 169.90, tag: "DESTAQUE", tone: "wine" },
  { id: 7, name: "Short Jeans Clara", category: "Jeans", price: 79.90, oldPrice: 99.90, tag: "NOVIDADE", tone: "denim" },
  { id: 8, name: "Cropped Valentina", category: "Blusas", price: 59.90, oldPrice: 79.90, tag: "OFERTA", tone: "brown" }
];

const tones = {
  sand: ["#d5c4b1", "#b9a18b"], rose: ["#d9b8b0", "#a77d78"],
  blue: ["#b8c4cc", "#697985"], cream: ["#eee7dc", "#c9bba9"],
  olive: ["#aab29b", "#59604d"], wine: ["#9b5e68", "#5d3038"],
  denim: ["#8ea0ad", "#435767"], brown: ["#aa8d76", "#634d3d"]
};

const grid = document.getElementById("productsGrid");
const categoriesEl = document.getElementById("categories");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");
const toast = document.getElementById("toast");
const bagCount = document.getElementById("bagCount");
const bagItems = document.getElementById("bagItems");
const bagEmpty = document.getElementById("bagEmpty");
const bagSummary = document.getElementById("bagSummary");
const bagTotal = document.getElementById("bagTotal");
const menuDrawer = document.getElementById("menuDrawer");
const bagDrawer = document.getElementById("bagDrawer");
const backdrop = document.getElementById("drawerBackdrop");

let selectedCategory = "Todos";
let cart = JSON.parse(localStorage.getItem("useme-cart") || "[]");

const categories = ["Todos", ...new Set(products.map(p => p.category))];
categoriesEl.innerHTML = categories.map(category =>
  `<button class="category ${category === "Todos" ? "active" : ""}" data-category="${category}">${category}</button>`
).join("");

function money(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function saveCart() {
  localStorage.setItem("useme-cart", JSON.stringify(cart));
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existing = cart.find(item => item.id === productId);

  if (existing) existing.qty += 1;
  else cart.push({ id: productId, qty: 1 });

  saveCart();
  renderCart();
  showToast(`${product.name} foi adicionada à sacola ✨`);
  openDrawer("bag");
}

function changeQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
}

function removeItem(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  renderCart();
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(p => {
    const matchesCategory = selectedCategory === "Todos" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term);
    return matchesCategory && matchesSearch;
  });

  grid.innerHTML = filtered.map(p => {
    const [a, b] = tones[p.tone];
    return `
      <article class="product-card">
        <div class="product-image" style="background: linear-gradient(145deg, ${a}, ${b});">
          <span class="tag">${p.tag}</span>
        </div>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <div class="price-line">
            <span class="price">${money(p.price)}</span>
            <span class="old-price">${money(p.oldPrice)}</span>
          </div>
          <button class="buy-btn" data-product="${p.id}">ADICIONAR À SACOLA</button>
        </div>
      </article>
    `;
  }).join("");

  emptyState.style.display = filtered.length ? "none" : "block";
  resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "produto" : "produtos"}`;

  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", () => addToCart(Number(btn.dataset.product)));
  });
}

function renderCart() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  bagCount.textContent = totalQty;
  bagItems.innerHTML = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    const [a, b] = tones[product.tone];
    return `
      <div class="bag-item">
        <div class="bag-thumb" style="background: linear-gradient(145deg, ${a}, ${b});"></div>
        <div>
          <h4>${product.name}</h4>
          <p>${money(product.price)}</p>
          <div class="qty-control">
            <button data-minus="${product.id}" aria-label="Diminuir quantidade">−</button>
            <span>${item.qty}</span>
            <button data-plus="${product.id}" aria-label="Aumentar quantidade">+</button>
          </div>
          <button class="remove-item" data-remove="${product.id}">Remover</button>
        </div>
        <div class="bag-item-price">${money(product.price * item.qty)}</div>
      </div>
    `;
  }).join("");

  bagEmpty.classList.toggle("show", cart.length === 0);
  bagSummary.style.display = cart.length ? "block" : "none";
  bagTotal.textContent = money(total);

  document.querySelectorAll("[data-minus]").forEach(btn =>
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.minus), -1))
  );
  document.querySelectorAll("[data-plus]").forEach(btn =>
    btn.addEventListener("click", () => changeQty(Number(btn.dataset.plus), 1))
  );
  document.querySelectorAll("[data-remove]").forEach(btn =>
    btn.addEventListener("click", () => removeItem(Number(btn.dataset.remove)))
  );
}

function openDrawer(type) {
  const drawer = type === "menu" ? menuDrawer : bagDrawer;
  const other = type === "menu" ? bagDrawer : menuDrawer;
  other.classList.remove("open");
  other.setAttribute("aria-hidden", "true");
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  backdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawers() {
  menuDrawer.classList.remove("open");
  bagDrawer.classList.remove("open");
  menuDrawer.setAttribute("aria-hidden", "true");
  bagDrawer.setAttribute("aria-hidden", "true");
  backdrop.classList.remove("open");
  document.body.style.overflow = "";
}

categoriesEl.addEventListener("click", event => {
  const button = event.target.closest(".category");
  if (!button) return;
  selectedCategory = button.dataset.category;
  document.querySelectorAll(".category").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);

document.getElementById("menuBtn").addEventListener("click", () => openDrawer("menu"));
document.getElementById("bagBtn").addEventListener("click", () => openDrawer("bag"));
backdrop.addEventListener("click", closeDrawers);
document.querySelectorAll("[data-close-drawer]").forEach(btn => btn.addEventListener("click", closeDrawers));
document.querySelectorAll("[data-menu-link]").forEach(link => link.addEventListener("click", closeDrawers));
document.getElementById("continueShopping").addEventListener("click", () => {
  closeDrawers();
  document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
});

function whatsappUrl(message) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
}

document.getElementById("whatsappBtn").href =
  whatsappUrl("Olá! Vim pelo site da Use-Me e gostaria de saber mais sobre os produtos.");
document.getElementById("menuWhatsapp").href =
  whatsappUrl("Olá! Vim pelo site da Use-Me e gostaria de saber mais sobre a loja.");

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (!cart.length) return;

  const lines = cart.map(item => {
    const product = products.find(p => p.id === item.id);
    return `• ${product.name} x${item.qty} — ${money(product.price * item.qty)}`;
  });

  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.id);
    return sum + product.price * item.qty;
  }, 0);

  const message = [
    "Olá! Vim pelo site da Use-Me e gostaria de finalizar meu pedido:",
    "",
    ...lines,
    "",
    `Total: ${money(total)}`,
    "",
    "Gostaria de confirmar disponibilidade e combinar a forma de pagamento."
  ].join("\n");

  window.open(whatsappUrl(message), "_blank");
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2300);
}

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();
