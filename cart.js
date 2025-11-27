// =====================================================
// =============== GLOBAL CART STATE ===================
// =====================================================
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let appliedCoupon = null;

const PACKAGING_CHARGE = 20;
const SHIPPING_CHARGE = 40;


// =====================================================
// =============== SHARED HELPERS ======================
// =====================================================
function formatPrice(num) {
  return "₹" + num.toFixed(2);
}

function parsePrice(str) {
  return Number(str.replace(/[₹,\s]/g, "")) || 0;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2000);
}

function updateCartCount() {
  const el = document.getElementById("cartCount");
  if (!el) return;

  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  el.textContent = count;
}


// =====================================================
// =============== PRODUCT PAGE LOGIC ==================
// =====================================================
function initProductPage() {
  const cards = document.querySelectorAll(".product-cards");
  if (!cards.length) return; // skip if not product page

  cards.forEach(card => {
    const btn = card.querySelector(".order-btn");
    if (!btn) return;

    btn.onclick = () => {
      const name = card.querySelector(".product-name")?.textContent.trim();
      const price = parsePrice(card.querySelector(".price")?.textContent);
      const img = card.querySelector("img")?.src;

      if (!name || !price) return;

      const existing = cart.find(i => i.name === name);
      if (existing) existing.qty++;
      else cart.push({ name, price, img, qty: 1 });

      saveCart();
      updateCartCount();
      showToast(`${name} added to cart`);
    };
  });

  const cartBtn = document.getElementById("cartBtn");
  if (cartBtn) cartBtn.onclick = () => (window.location.href = "cart.html");
}


// =====================================================
// =============== CART PAGE LOGIC =====================
// =====================================================
function initCartPage() {

  const itemsContainer = document.getElementById("cartItems");
  if (!itemsContainer) return; // skip if not cart page

  const emptyMsg = document.getElementById("emptyCartMsg");

  // RENDER ITEMS
  function renderCartItems() {
    itemsContainer.innerHTML = "";

    if (cart.length === 0) {
      emptyMsg.style.display = "block";
    } else {
      emptyMsg.style.display = "none";
    }

    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <div class="cart-item-img">
          <img src="${item.img}" alt="${item.name}">
        </div>

        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-base">Base price: ${formatPrice(item.price)}</div>
          <div class="cart-item-custom">Customizations: None</div>
        </div>

        <div class="cart-item-actions">
          <div class="qty-control">
            <button data-action="dec" data-index="${index}">−</button>
            <span>${item.qty}</span>
            <button data-action="inc" data-index="${index}">+</button>
          </div>
          <div class="cart-item-total">${formatPrice(item.price * item.qty)}</div>
          <button class="remove-item" data-action="remove" data-index="${index}">🗑️</button>
        </div>
      `;

      itemsContainer.appendChild(div);
    });

    attachItemEvents();
    updateSummary();
  }

  // +/- / REMOVE EVENTS
  function attachItemEvents() {
    itemsContainer.querySelectorAll("button[data-action]").forEach(btn => {
      btn.onclick = () => {
        const index = Number(btn.dataset.index);
        const action = btn.dataset.action;
        const item = cart[index];

        if (action === "inc") item.qty++;
        else if (action === "dec" && item.qty > 1) item.qty--;
        else if (action === "remove") cart.splice(index, 1);

        saveCart();
        renderCartItems();
        updateCartCount();
      };
    });
  }

    // SUMMARY CALCULATION
    function updateSummary() {
      const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const productDiscount = subtotal * 0.15;

      let couponDiscount = 0;
      if (appliedCoupon === "SAVE10") couponDiscount = subtotal * 0.10;
      else if (appliedCoupon === "SAVE50") couponDiscount = 50;
      else if (appliedCoupon === "SAVE100") couponDiscount = 100;

      const afterDiscounts = Math.max(subtotal - productDiscount - couponDiscount, 0);
      const taxes = afterDiscounts * 0.05;
      const packaging = cart.length ? PACKAGING_CHARGE : 0;
      const shipping = cart.length ? SHIPPING_CHARGE : 0;

      const total = afterDiscounts + taxes + packaging + shipping;

      // Write to UI
      document.getElementById("summarySubtotal").textContent = formatPrice(subtotal);
      document.getElementById("summaryProdDiscount").textContent = "- " + formatPrice(productDiscount);
      document.getElementById("summaryCoupon").textContent = "- " + formatPrice(couponDiscount);
      document.getElementById("summaryTaxes").textContent = formatPrice(taxes);
      document.getElementById("summaryPackaging").textContent = formatPrice(packaging);
      document.getElementById("summaryShipping").textContent = formatPrice(shipping);
      document.getElementById("summaryTotal").textContent = formatPrice(total);
    }

    // APPLY COUPON
    const couponBtn = document.getElementById("applyCouponBtn");
    if (couponBtn) {
      couponBtn.onclick = () => {
        const code = document.getElementById("couponInput").value.trim().toUpperCase();
        const msg = document.getElementById("couponMsg");

        const validCodes = ["SAVE10", "SAVE50", "SAVE100"];

        if (validCodes.includes(code)) {
          appliedCoupon = code;
          msg.textContent = `${code} applied successfully`;
          msg.style.color = "#008000";
        } else {
          appliedCoupon = null;
          msg.textContent = "Invalid coupon";
          msg.style.color = "red";
        }

        updateSummary();
      };
    }

    // CHECKOUT
    const checkoutBtn = document.getElementById("checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.onclick = () => {
        if (!cart.length) return showToast("Cart is empty");
        window.location.href = "Checkout.html";
      };
    }

    // INITIAL RENDER
    renderCartItems();
  }


// =====================================================
// ================= INITIALIZER =======================
// =====================================================
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  initProductPage();
  initCartPage();
});

// ===== SUMMARY CALCULATION =====
// function updateSummary() {
//   const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//   const productDiscount = subtotal * 0.15; // 15%
//   let couponDiscount = 0;

//   if (appliedCoupon === "SAVE10") {
//     couponDiscount = subtotal * 0.10;
//   } else if (appliedCoupon === "SAVE50") {
//     couponDiscount = 50;
//   } else if (appliedCoupon === "SAVE100") {
//     couponDiscount = 100;
//   }

//   const afterDiscounts = Math.max(subtotal - productDiscount - couponDiscount, 0);
//   const taxes = afterDiscounts * 0.05; // 5%
//   const packaging = cart.length > 0 ? PACKAGING_CHARGE : 0;
//   const shipping = cart.length > 0 ? SHIPPING_CHARGE : 0;
//   const total = afterDiscounts + taxes + packaging + shipping;

//   document.getElementById("summarySubtotal").textContent = formatPrice(subtotal);
//   document.getElementById("summaryProdDiscount").textContent = "- " + formatPrice(productDiscount);
//   document.getElementById("summaryCoupon").textContent = "- " + formatPrice(couponDiscount);
//   document.getElementById("summaryTaxes").textContent = formatPrice(taxes);
//   document.getElementById("summaryPackaging").textContent = formatPrice(packaging);
//   document.getElementById("summaryShipping").textContent = formatPrice(shipping);
//   document.getElementById("summaryTotal").textContent = formatPrice(total);
// }

// ===== APPLY COUPON =====
function applyCoupon() {
  const input = document.getElementById("couponInput");
  const msg = document.getElementById("couponMsg");
  const code = input.value.trim().toUpperCase();

  const validCodes = ["SAVE10", "SAVE50", "SAVE100"];

  if (!code) {
    appliedCoupon = null;
    msg.textContent = "No coupon applied.";
    msg.style.color = "#666";
  } else if (validCodes.includes(code)) {
    appliedCoupon = code;
    msg.textContent = `Coupon ${code} applied successfully.`;
    msg.style.color = "#008000";
    showToast("Coupon applied!");
  } else {
    appliedCoupon = null;
    msg.textContent = "Invalid coupon code.";
    msg.style.color = "#c00";
  }

  updateSummary();
}

// ===== OFFERS DROPDOWN TOGGLE =====
function initOffersToggle() {
  const offersBox = document.querySelector(".offers-box");
  const header = document.getElementById("offersToggle");
  if (!offersBox || !header) return;

  header.addEventListener("click", () => {
    offersBox.classList.toggle("open");
  });
}

// ===== MAIN INIT =====
document.addEventListener("DOMContentLoaded", () => {
  // Load cart from localStorage
  loadCart();

  // Coupon
  document.getElementById("applyCouponBtn").addEventListener("click", applyCoupon);

  // Offers accordion
  initOffersToggle();

  // Fake checkout
  document.getElementById("checkoutBtn").addEventListener("click", () => {
    if (!cart.length) {
      showToast("Cart is empty");
      return;
    }
    showToast("Checkout not implemented (demo)");
  });
});

//=================== Checkout  Button ================================//
document.getElementById("checkoutBtn").addEventListener("click", () => {
    window.location.href = "Checkout.html";
});


// =================== Customer Review =======================//
