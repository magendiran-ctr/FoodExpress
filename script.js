// Image Card  scroll 
document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("foodSection");
    const cards = section.querySelectorAll(".food-card");

    // If browser supports IntersectionObserver, use it
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              cards.forEach((card) => card.classList.add("smash"));
              observer.disconnect(); // run only once
            }
          });
        },
        { threshold: 0.25 }
      );

      observer.observe(section);
    } else {
      // Fallback: just smash instantly
      cards.forEach((card) => card.classList.add("smash"));
    }
  });
  
// ================== SERVICE CARD INTERACTIONS ==================
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
  card.addEventListener('click', () => {
    const service = card.dataset.service;
    console.log(`Clicked service: ${service}`);
  });

  const cardImage = card.querySelector('.card-image img');
  if (cardImage) {
    card.addEventListener('mouseenter', () => {
      cardImage.style.transform = 'scale(1.1) rotate(5deg)';
    });
    card.addEventListener('mouseleave', () => { 
      cardImage.style.transform = 'scale(1) rotate(0deg)';
    });
  }
});

// ================== BUTTON CLICK ANIMATION ==================
document.querySelectorAll('button').forEach(button => {
  button.addEventListener('click', function () {
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.style.transform = 'scale(1)';
    }, 150);
  });
});

// ================== CARD-ARROW NAVIGATION ==================
document.querySelectorAll('.card-arrow').forEach(button => {
  button.addEventListener('click', () => {
    const url = button.getAttribute('data-url');
    if (url) window.open(url, '_blank');
  });
});

// //===================== More Products =======================//
const btn = document.getElementById("seeAllBtn");
const moreBox = document.getElementById("moreProducts");
const wrapper = document.querySelector(".see-all-wrapper");
const container = document.querySelector(".items-container");

btn.addEventListener("click", () => {

    // If currently collapsed
    if (!moreBox.classList.contains("show")) {

        // Expand the dropdown
        moreBox.classList.add("show");

        // Move button to the END of extra products
        moreBox.after(wrapper);

        // Update text
        btn.textContent = "Show Less  ˄ ";

    } else {

        // Collapse dropdown
        moreBox.classList.remove("show");

        // Move button back under main products
        container.after(wrapper);

        // Update text
        btn.textContent = "See All Products ↓";
    }
});
   
// Add to Cart Functionality//
// ===== CART STATE =====
let cart = [];

// ===== SHOW POPUP TOAST =====
function showToast(productName) {
  const toast = document.getElementById("toast");
  toast.textContent = `${productName} added to cart`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 2000);
}

// ===== CONVERT ₹ PRICE TO NUMBER =====
function parsePrice(str) {
  return Number(str.replace(/[₹,\s]/g, "")) || 0;
}

// ===== LOAD CART FROM LOCAL STORAGE =====
function loadCart() {
  const saved = localStorage.getItem("cart");
  if (saved) {
    cart = JSON.parse(saved);
  }
  updateCartCount();
}

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== UPDATE CART HEADER COUNT =====
function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  document.getElementById("cartCount").textContent = totalQty;
}

// ===== OPEN CART PAGE =====
function openCartPage() {
  window.open("cart.html", "_blank");
}

// ===== INIT ADD TO CART BUTTONS =====
function initProducts() {
  const productCards = document.querySelectorAll(".product-cards");

  productCards.forEach(card => {
    const btn = card.querySelector(".order-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {

      const name = card.querySelector(".product-name")?.textContent.trim();
      const price = parsePrice(card.querySelector(".price")?.textContent);
      const img = card.querySelector(".product-imgs img")?.getAttribute("src");

      if (!name || !price || !img) return;

      // already exists?
      const existing = cart.find(item => item.name === name);
      if (existing) {
        existing.qty++;
      } else {
        cart.push({ name, price, img, qty: 1 });
      }

      saveCart();
      updateCartCount();
      showToast(name);   // 🔥  SHOW PRODUCT NAME HERE
    });
  });
}

// ===== MAIN INIT =====
document.addEventListener("DOMContentLoaded", () => {
  loadCart();
  initProducts();

  document.getElementById("cartBtn")
    .addEventListener("click", openCartPage);
});

// =============== Review Section ================//
 let currentIndex = 0;
    const track = document.getElementById('reviewsTrack');
    const cards = document.querySelectorAll('.review-card');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    // Calculate cards per view based on screen width
    function getCardsPerView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function updateCarousel() {
      const cardsPerView = getCardsPerView();
      const cardWidth = cards[0].offsetWidth;
      const gap = 24;
      const offset = currentIndex * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;
      
      // Update button states
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
      
      prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
      nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    }

    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarousel();
      }
    });

    nextBtn.addEventListener('click', () => {
      const cardsPerView = getCardsPerView();
      if (currentIndex < cards.length - cardsPerView) {
        currentIndex++;
        updateCarousel();
      }
    });

    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filter = btn.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all') {
            card.style.display = 'block';
          } else if (filter === 'recent') {
            card.style.display = 'block';
          } else {
            const rating = card.dataset.rating;
            card.style.display = rating === filter ? 'block' : 'none';
          }
        });
        
        currentIndex = 0;
        updateCarousel();
      });
    });

    // Like functionality
    function likeReview(btn) {
      btn.classList.toggle('active');
      const countSpan = btn.querySelector('.count');
      let count = parseInt(countSpan.textContent);
      countSpan.textContent = btn.classList.contains('active') ? count + 1 : count - 1;
    }

    // Responsive handling
    window.addEventListener('resize', () => {
      currentIndex = 0;
      updateCarousel();
    });

    // Initialize
    updateCarousel();


    //  Restuarants Food Items And Menu //
    const restaurants = [
            {
                id: 1,
                name: 'Taco Bell',
                rating: '3.7',
                cuisine: 'Mexican, Tex Mex',
                location: 'MG Road, Pondicherry',
                distance: '1.7 km',
                price: 'Pondicherry',
                image: '/Images/Tacobell.jpg',
                menu: {
                    'Tacos': [
                        { name: 'Crunchy Taco', price: 89, desc: 'Crispy taco shell with seasoned beef, lettuce, cheese, and tangy sauce', veg: false, img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300', prepTime: '8-10 mins', calories: 320, spiceLevel: 'Medium', customizations: ['Extra Cheese', 'No Onions', 'Extra Sauce', 'Add Jalapenos'], nutrition: { protein: '12g', carbs: '28g', fat: '18g', fiber: '3g' } },
                        { name: 'Soft Taco Supreme', price: 129, desc: 'Soft flour tortilla with premium fillings, sour cream, and fresh veggies', veg: false, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300', prepTime: '10-12 mins', calories: 380, spiceLevel: 'Mild', customizations: ['Extra Meat', 'No Sour Cream', 'Extra Lettuce', 'Grilled'], nutrition: { protein: '16g', carbs: '32g', fat: '22g', fiber: '4g' } },
                        { name: 'Veggie Taco', price: 99, desc: 'Fresh vegetables with Mexican spices, beans, and guacamole', veg: true, img: 'https://images.unsplash.com/photo-1599974579688-8dbdd335eee3?w=300', prepTime: '7-9 mins', calories: 280, spiceLevel: 'Medium', customizations: ['Extra Guac', 'No Beans', 'Add Corn', 'Extra Spice'], nutrition: { protein: '8g', carbs: '35g', fat: '12g', fiber: '6g' } },
                        { name: 'Fish Taco', price: 149, desc: 'Battered fish with cabbage slaw and chipotle mayo', veg: false, img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=300', prepTime: '12-14 mins', calories: 340, spiceLevel: 'Mild', customizations: ['Extra Fish', 'No Mayo', 'Extra Slaw', 'Grilled Fish'], nutrition: { protein: '18g', carbs: '30g', fat: '16g', fiber: '3g' } },
                        { name: 'Spicy Chicken Taco', price: 119, desc: 'Spicy marinated chicken with pepper jack cheese and hot sauce', veg: false, img: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300', prepTime: '10-12 mins', calories: 360, spiceLevel: 'Hot', customizations: ['Extra Spicy', 'Mild Version', 'No Cheese', 'Add Avocado'], nutrition: { protein: '20g', carbs: '28g', fat: '19g', fiber: '2g' } }
                    ],
                    'Burritos': [
                        { name: 'Bean Burrito', price: 149, desc: 'Refried beans, rice, cheese in soft tortilla with mild sauce', veg: true, img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300', prepTime: '10-12 mins', calories: 420, spiceLevel: 'Mild', customizations: ['Extra Beans', 'No Rice', 'Add Cheese', 'Grilled'], nutrition: { protein: '14g', carbs: '58g', fat: '15g', fiber: '8g' } },
                        { name: 'Chicken Burrito', price: 199, desc: 'Grilled chicken with Mexican rice, beans, and fresh salsa', veg: false, img: 'https://images.unsplash.com/photo-1599974579688-8dbdd335eee3?w=300', prepTime: '12-15 mins', calories: 520, spiceLevel: 'Medium', customizations: ['Extra Chicken', 'No Beans', 'Add Guac', 'Extra Cheese'], nutrition: { protein: '28g', carbs: '55g', fat: '22g', fiber: '6g' } },
                        { name: 'Beef Burrito Supreme', price: 219, desc: 'Seasoned beef with all the fixings and sour cream', veg: false, img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300', prepTime: '12-15 mins', calories: 580, spiceLevel: 'Medium', customizations: ['Extra Beef', 'No Sour Cream', 'Add Jalapenos', 'Light Cheese'], nutrition: { protein: '26g', carbs: '60g', fat: '28g', fiber: '7g' } }
                    ],
                    'Drinks': [
                        { name: 'Mountain Dew', price: 49, desc: 'Chilled citrus soft drink', veg: true, img: 'https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=300', prepTime: '2 mins', calories: 150, spiceLevel: 'None', customizations: ['No Ice', 'Extra Ice', 'Large Size'], nutrition: { protein: '0g', carbs: '39g', fat: '0g', fiber: '0g' } }
                    ]
                }
            },
            {
                id: 2,
                name: 'Villa Shanti',
                rating: '4.3',
                cuisine: 'Continental, Beverages',
                location: 'White Town',
                distance: '0.3 km',
                price: '₹1500 for two',
                image: '/Images/villasanthi.avif',
                menu: {
                    'Appetizers': [
                        { name: 'Bruschetta', price: 249, desc: 'Toasted bread with tomatoes, garlic, basil, and olive oil', veg: true, img: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300', prepTime: '10-12 mins', calories: 180, spiceLevel: 'Mild', customizations: ['Extra Garlic', 'No Onions', 'Add Cheese', 'Extra Basil'], nutrition: { protein: '6g', carbs: '24g', fat: '8g', fiber: '3g' } },
                        { name: 'Caesar Salad', price: 299, desc: 'Crisp romaine with parmesan, croutons, and Caesar dressing', veg: true, img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300', prepTime: '8-10 mins', calories: 220, spiceLevel: 'None', customizations: ['Add Chicken', 'Extra Cheese', 'No Croutons', 'Light Dressing'], nutrition: { protein: '8g', carbs: '18g', fat: '14g', fiber: '4g' } }
                    ],
                    'Main Course': [
                        { name: 'Grilled Salmon', price: 899, desc: 'Atlantic salmon with herbs, lemon butter, and vegetables', veg: false, img: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=300', prepTime: '20-25 mins', calories: 480, spiceLevel: 'Mild', customizations: ['Well Done', 'Medium Rare', 'Extra Lemon', 'Garlic Butter'], nutrition: { protein: '42g', carbs: '8g', fat: '28g', fiber: '2g' } },
                        { name: 'Mushroom Risotto', price: 549, desc: 'Creamy Italian rice with wild mushrooms and parmesan', veg: true, img: 'https://images.unsplash.com/photo-1476124369491-f1a2c8f4b8e8?w=300', prepTime: '25-30 mins', calories: 520, spiceLevel: 'Mild', customizations: ['Extra Mushrooms', 'Extra Cheese', 'Truffle Oil', 'Creamy'], nutrition: { protein: '14g', carbs: '68g', fat: '22g', fiber: '4g' } }
                    ]
                }
            },
            {
                id: 3,
                name: 'The Pasta Bar Veneto',
                rating: '4.2',
                cuisine: 'Italian',
                location: 'Heritage Town',
                distance: '0.7 km',
                price: '₹1600 for two',
                image: '/Images/vento.png',
                menu: {
                    'Pasta': [
                        { name: 'Spaghetti Carbonara', price: 399, desc: 'Classic Italian pasta with cream sauce, bacon, and parmesan', veg: false, img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300', prepTime: '15-18 mins', calories: 580, spiceLevel: 'Mild', customizations: ['Extra Bacon', 'No Egg', 'Extra Cheese', 'Black Pepper'], nutrition: { protein: '24g', carbs: '64g', fat: '28g', fiber: '4g' } },
                        { name: 'Penne Arrabbiata', price: 349, desc: 'Spicy tomato sauce pasta with garlic and chili', veg: true, img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=300', prepTime: '12-15 mins', calories: 420, spiceLevel: 'Hot', customizations: ['Extra Spicy', 'Mild Version', 'Add Cheese', 'Garlic Bread'], nutrition: { protein: '14g', carbs: '72g', fat: '12g', fiber: '6g' } }
                    ],
                    'Pizza': [
                        { name: 'Margherita', price: 299, desc: 'Classic tomato, fresh mozzarella, and basil', veg: true, img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300', prepTime: '15-18 mins', calories: 680, spiceLevel: 'None', customizations: ['Extra Cheese', 'Thin Crust', 'Thick Crust', 'Extra Basil'], nutrition: { protein: '28g', carbs: '86g', fat: '24g', fiber: '6g' } },
                        { name: 'Pepperoni', price: 449, desc: 'Loaded with pepperoni and mozzarella cheese', veg: false, img: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300', prepTime: '15-18 mins', calories: 780, spiceLevel: 'Mild', customizations: ['Extra Pepperoni', 'Extra Cheese', 'Thin Crust', 'Oregano'], nutrition: { protein: '32g', carbs: '88g', fat: '34g', fiber: '5g' } }
                    ]
                }
            },
            {
    id: 4,
    name: 'Café des Arts',
    rating: '4.4',
    cuisine: 'French, Café',
    location: 'White Town',
    distance: '0.5 km',
    price: '₹900 for two',
    image: '/Images/cafextasi.avif',
    menu: {
        'Starters': [
            { name: 'Veg Quiche', price: 199, desc: 'Classic French quiche with spinach and cheese', veg: true,
              img: 'https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=300', prepTime: '12-15 mins',
              calories: 260, spiceLevel: 'None', customizations: ['Extra Cheese', 'No Spinach'],
              nutrition: { protein: '9g', carbs: '22g', fat: '14g', fiber: '2g' } },
            { name: 'Chicken Croquettes', price: 249, desc: 'Crispy fried chicken croquettes served with dip', veg: false,
              img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300', prepTime: '10-12 mins',
              calories: 310, spiceLevel: 'Mild', customizations: ['Extra Dip', 'No Garlic'],
              nutrition: { protein: '16g', carbs: '18g', fat: '20g', fiber: '1g' } }
        ],
        'Main Course': [
            { name: 'Ratatouille', price: 349, desc: 'French vegetable stew with herbs', veg: true,
              img: 'https://images.unsplash.com/photo-1622288432169-78dcae76f50f?w=300', prepTime: '18-20 mins',
              calories: 240, spiceLevel: 'Mild', customizations: ['Extra Veggies', 'Less Oil'],
              nutrition: { protein: '5g', carbs: '18g', fat: '12g', fiber: '5g' } },
            { name: 'Chicken Stroganoff', price: 449, desc: 'Creamy chicken with mushrooms and herbs', veg: false,
              img: 'https://images.unsplash.com/photo-1606755962773-d324f6b8046e?w=300', prepTime: '20-22 mins',
              calories: 520, spiceLevel: 'Mild', customizations: ['Extra Chicken', 'Extra Cream', 'Less Salt'],
              nutrition: { protein: '32g', carbs: '24g', fat: '32g', fiber: '3g' } }
        ]
    }
},
{
    id: 5,
    name: 'Surguru',
    rating: '4.1',
    cuisine: 'South Indian',
    location: 'Mission Street',
    distance: '1.2 km',
    price: '₹400 for two',
    image: '/Images/surguru.avif',
    menu: {
        'Starters': [
            { name: 'Gobi 65', price: 129, desc: 'Crispy fried cauliflower tossed in spices', veg: true,
              img: 'https://images.unsplash.com/photo-1617191513807-8d888fffbe35?w=300', prepTime: '10 mins',
              calories: 210, spiceLevel: 'Hot', customizations: ['Extra Spicy', 'Less Oil'],
              nutrition: { protein: '6g', carbs: '28g', fat: '10g', fiber: '4g' } },
            { name: 'Chicken 65', price: 179, desc: 'Deep-fried spicy chicken bites', veg: false,
              img: 'https://images.unsplash.com/photo-1625246333195-198b4564a317?w=300', prepTime: '12 mins',
              calories: 330, spiceLevel: 'Hot', customizations: ['Extra Crisp', 'Less Spicy'],
              nutrition: { protein: '22g', carbs: '18g', fat: '20g', fiber: '1g' } }
        ],
        'Main Course': [
            { name: 'Masala Dosa', price: 99, desc: 'Classic dosa with potato masala', veg: true,
              img: 'https://images.unsplash.com/photo-1601050690597-df7b7f71a3df?w=300', prepTime: '8 mins',
              calories: 350, spiceLevel: 'Mild', customizations: ['Extra Masala', 'Crispy', 'Less Oil'],
              nutrition: { protein: '8g', carbs: '54g', fat: '12g', fiber: '4g' } },
            { name: 'Mini Meals', price: 149, desc: 'Rice, sambar, poriyal, curd and papad', veg: true,
              img: 'https://images.unsplash.com/photo-1589307000180-e506d4c300a5?w=300', prepTime: '10 mins',
              calories: 480, spiceLevel: 'Mild', customizations: ['Extra Rice', 'Extra Sambar'],
              nutrition: { protein: '10g', carbs: '72g', fat: '16g', fiber: '8g' } }
        ]
    }
},
{
    id: 6,
    name: 'Bay of Buddha',
    rating: '4.4',
    cuisine: 'Asian Fusion',
    location: 'The Promenade',
    distance: '0.1 km',
    price: '₹2000 for two',
    image: '/Images/Bay of Buddha.avif',
    menu: {
        'Starters': [
            { name: 'Thai Spring Rolls', price: 299, veg: true,
              desc: 'Crispy rolls with vegetables and sweet chili sauce',
              img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300',
              prepTime: '10 mins', calories: 180, spiceLevel: 'Mild',
              customizations: ['Extra Sauce', 'No Onions'],
              nutrition: { protein: '4g', carbs: '22g', fat: '10g', fiber: '3g' } },
            { name: 'Teriyaki Chicken Skewers', price: 349, veg: false,
              desc: 'Glazed grilled chicken skewers',
              img: 'https://images.unsplash.com/photo-1588167056547-c9a3a0b0c1ad?w=300',
              prepTime: '12 mins', calories: 260, spiceLevel: 'Mild',
              customizations: ['Extra Glaze', 'Well Done'],
              nutrition: { protein: '20g', carbs: '14g', fat: '12g', fiber: '1g' } }
        ],
        'Main Course': [
            { name: 'Pad Thai', price: 499, veg: true,
              desc: 'Stir-fried rice noodles with tofu, peanuts, and tamarind',
              img: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=300',
              prepTime: '15-18 mins', calories: 520, spiceLevel: 'Medium',
              customizations: ['Extra Tofu', 'Extra Peanuts'],
              nutrition: { protein: '16g', carbs: '78g', fat: '14g', fiber: '6g' } },
            { name: 'Korean BBQ Chicken Bowl', price: 549, veg: false,
              desc: 'Grilled chicken with Korean spices and rice',
              img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=300',
              prepTime: '18 mins', calories: 610, spiceLevel: 'Hot',
              customizations: ['Extra Chicken', 'Spicy Sauce'],
              nutrition: { protein: '30g', carbs: '68g', fat: '20g', fiber: '3g' } }
        ]
    }
},
{
    id: 7,
    name: 'Le Dupleix',
    rating: '4.3',
    cuisine: 'French, Seafood',
    location: 'White Town',
    distance: '0.4 km',
    price: '₹1800 for two',
    image: '/Images/ledupleix.webp',
    menu: {
        'Starters': [
            {
                name: 'Garlic Butter Prawns',
                price: 399,
                desc: 'Pan-seared prawns with garlic, herbs and butter',
                veg: false,
                img: 'https://images.unsplash.com/photo-1601315379733-42576c16cd32?w=300',
                prepTime: '10-12 mins',
                calories: 260,
                spiceLevel: 'Mild',
                customizations: ['Extra Garlic', 'No Butter', 'Add Lemon'],
                nutrition: { protein: '22g', carbs: '4g', fat: '16g', fiber: '0g' }
            },
            {
                name: 'Cheese Soufflé',
                price: 299,
                desc: 'Light baked French cheese soufflé',
                veg: true,
                img: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=300',
                prepTime: '12-15 mins',
                calories: 220,
                spiceLevel: 'None',
                customizations: ['Extra Cheese', 'No Salt'],
                nutrition: { protein: '9g', carbs: '14g', fat: '14g', fiber: '1g' }
            }
        ],
        'Main Course': [
            {
                name: 'Grilled Seabass',
                price: 699,
                desc: 'Seabass grilled with herbs and lemon butter',
                veg: false,
                img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300',
                prepTime: '18-22 mins',
                calories: 480,
                spiceLevel: 'Mild',
                customizations: ['Extra Lemon', 'Garlic Butter', 'No Herbs'],
                nutrition: { protein: '38g', carbs: '6g', fat: '28g', fiber: '0g' }
            },
            {
                name: 'Veg Ratatouille',
                price: 349,
                desc: 'French-style stewed veggies with herbs',
                veg: true,
                img: 'https://images.unsplash.com/photo-1622288432169-78dcae76f50f?w=300',
                prepTime: '15-18 mins',
                calories: 240,
                spiceLevel: 'Mild',
                customizations: ['Extra Veggies', 'Less Oil'],
                nutrition: { protein: '4g', carbs: '20g', fat: '12g', fiber: '5g' }
            }
        ]
    }
},
{
    id: 5,
    name: 'Theevu Plage',
    rating: '4.2',
    cuisine: 'Seafood, Continental',
    location: 'Serenity Beach',
    distance: '3.5 km',
    price: '₹1300 for two',
    image: '/Images/theevu-plage.jpg',
    menu: {
        'Starters': [
            {
                name: 'Crispy Calamari',
                price: 349,
                desc: 'Deep-fried calamari with spicy mayo',
                veg: false,
                img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=300',
                prepTime: '10 mins',
                calories: 310,
                spiceLevel: 'Medium',
                customizations: ['Extra Mayo', 'Less Spice'],
                nutrition: { protein: '18g', carbs: '22g', fat: '16g', fiber: '1g' }
            },
            {
                name: 'Herb Grilled Paneer',
                price: 249,
                desc: 'Paneer grilled with herbs, olive oil and pepper',
                veg: true,
                img: 'https://images.unsplash.com/photo-1627834377411-fd562a3e02aa?w=300',
                prepTime: '12 mins',
                calories: 260,
                spiceLevel: 'Mild',
                customizations: ['Extra Herbs', 'Less Oil'],
                nutrition: { protein: '16g', carbs: '10g', fat: '18g', fiber: '2g' }
            }
        ],
        'Main Course': [
            {
                name: 'Butter Garlic Squid Rice Bowl',
                price: 449,
                desc: 'Squid tossed in garlic butter with rice',
                veg: false,
                img: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=300',
                prepTime: '15-18 mins',
                calories: 580,
                spiceLevel: 'Mild',
                customizations: ['Extra Garlic', 'Extra Squid'],
                nutrition: { protein: '30g', carbs: '60g', fat: '20g', fiber: '2g' }
            },
            {
                name: 'Mediterranean Veg Bowl',
                price: 329,
                desc: 'Grilled veggies with hummus, couscous and olives',
                veg: true,
                img: 'https://images.unsplash.com/photo-1627834377535-38d2fc90d1c1?w=300',
                prepTime: '14 mins',
                calories: 420,
                spiceLevel: 'None',
                customizations: ['Extra Hummus', 'Less Olives'],
                nutrition: { protein: '12g', carbs: '58g', fat: '12g', fiber: '8g' }
            }
        ]
    }
},
{
    id: 6,
    name: 'Zaitoon',
    rating: '4.0',
    cuisine: 'South Indian, Chinese',
    location: 'SV Patel Road',
    distance: '1.1 km',
    price: '₹700 for two',
    image: '/Images/zaitoon.webp  ',
    menu: {
        'Starters': [
            {
                name: 'Paneer Manchurian',
                price: 199,
                desc: 'Indo-Chinese paneer tossed in spicy sauce',
                veg: true,
                img: 'https://images.unsplash.com/photo-1625246333195-198b4564a317?w=300',
                prepTime: '12 mins',
                calories: 290,
                spiceLevel: 'Medium',
                customizations: ['Extra Spicy', 'Saucy Version'],
                nutrition: { protein: '14g', carbs: '20g', fat: '16g', fiber: '2g' }
            },
            {
                name: 'Dragon Chicken',
                price: 249,
                desc: 'Crispy fried chicken tossed in dragon sauce',
                veg: false,
                img: 'https://images.unsplash.com/photo-1625246333195-198b4564a317?w=300',
                prepTime: '10 mins',
                calories: 380,
                spiceLevel: 'Hot',
                customizations: ['Extra Spicy', 'Less Sweet'],
                nutrition: { protein: '22g', carbs: '28g', fat: '22g', fiber: '1g' }
            }
        ],
        'Main Course': [
            {
                name: 'Veg Fried Rice',
                price: 179,
                desc: 'Rice stir-fried with vegetables and sauces',
                veg: true,
                img: 'https://images.unsplash.com/photo-1617196034796-9e8f12f39939?w=300',
                prepTime: '10-12 mins',
                calories: 430,
                spiceLevel: 'Mild',
                customizations: ['Extra Veggies', 'No Onion'],
                nutrition: { protein: '10g', carbs: '68g', fat: '12g', fiber: '5g' }
            },
            {
                name: 'Chicken Schezwa Rice ',
                price: 229,
                desc: 'Spicy rice with chicken and schezwan sauce ',
                veg: false,
                img: 'https://images.unsplash.com/photo-1601050690597-df7b7f71a3df?w=300',
                prepTime: '12 mins',
                calories: 520,
                spiceLevel: 'Hot',
                customizations: ['Extra Spicy', 'Less Oil'],
                nutrition: { protein: '26g', carbs: '70g', fat: '18g', fiber: '4g' }
            }
        ]
    }
},
// {
//     id: 7,
//     name: 'A2B (Adyar Ananda Bhavan)',
//     rating: '4.1',
//     cuisine: 'South Indian, Sweets',
//     location: 'Muthialpet',
//     distance: '2.1 km',
//     price: '₹450 for two',
//     image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
//     menu: {
//         'Starters': [
//             {
//                 name: 'Medu Vada',
//                 price: 49,
//                 desc: 'Crispy urad dal vada with sambar & chutney',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1589307000180-e506d4c300a5?w=300',
//                 prepTime: '5-7 mins',
//                 calories: 150,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra Crispy', 'Less Oil'],
//                 nutrition: { protein: '4g', carbs: '18g', fat: '6g', fiber: '2g' }
//             },
//             {
//                 name: 'Mini Sambar Idlis',
//                 price: 79,
//                 desc: 'Soft mini idlis dipped in hot sambar',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1601050690597-df7b7f71a3df?w=300',
//                 prepTime: '6 mins',
//                 calories: 210,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra Sambar', 'Less Salt'],
//                 nutrition: { protein: '6g', carbs: '30g', fat: '4g', fiber: '3g' }
//             }
//         ],
//         'Main Course': [
//             {
//                 name: 'Ghee Pongal',
//                 price: 89,
//                 desc: 'Rice dal combo cooked with ghee & pepper',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1589307000180-e506d4c300a5?w=300',
//                 prepTime: '8 mins',
//                 calories: 350,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra Ghee', 'Less Pepper'],
//                 nutrition: { protein: '8g', carbs: '44g', fat: '14g', fiber: '4g' }
//             },
//             {
//                 name: 'Rava Dosa',
//                 price: 99,
//                 desc: 'Crispy rava dosa with chutney & sambar',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1601050690597-df7b7f71a3df?w=300',
//                 prepTime: '10-12 mins',
//                 calories: 320,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra Crispy', 'Less Oil'],
//                 nutrition: { protein: '7g', carbs: '55g', fat: '10g', fiber: '4g' }
//             }
//         ]
//     }
// },
// {
//     id: 8,
//     name: 'Junior Kuppanna',
//     rating: '4.2',
//     cuisine: 'South Indian, Chettinad',
//     location: 'Kottupalayam',
//     distance: '2.8 km',
//     price: '₹900 for two',
//     image: 'https://images.unsplash.com/photo-1604908554160-6d4e985cbb13?w=400',
//     menu: {
//         'Starters': [
//             {
//                 name: 'Mutton Sukka',
//                 price: 349,
//                 desc: 'Dry-fried mutton with Chettinad spices',
//                 veg: false,
//                 img: 'https://images.unsplash.com/photo-1625246333195-198b4564a317?w=300',
//                 prepTime: '15 mins',
//                 calories: 420,
//                 spiceLevel: 'Hot',
//                 customizations: ['Extra Spicy', 'Less Oil'],
//                 nutrition: { protein: '26g', carbs: '8g', fat: '32g', fiber: '2g' }
//             },
//             {
//                 name: 'Podi Idli',
//                 price: 129,
//                 desc: 'Mini idlis tossed in spicy podi and ghee',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1589307000180-e506d4c300a5?w=300',
//                 prepTime: '8 mins',
//                 calories: 280,
//                 spiceLevel: 'Hot',
//                 customizations: ['Extra Podi', 'Less Ghee'],
//                 nutrition: { protein: '7g', carbs: '36g', fat: '10g', fiber: '4g' }
//             }
//         ],
//         'Main Course': [
//             {
//                 name: 'Chicken Biryani',
//                 price: 249,
//                 desc: 'Chettinad style spicy biryani',
//                 veg: false,
//                 img: 'https://images.unsplash.com/photo-1604908554160-6d4e985cbb13?w=300',
//                 prepTime: '15-18 mins',
//                 calories: 690,
//                 spiceLevel: 'Hot',
//                 customizations: ['Extra Chicken', 'Extra Spicy'],
//                 nutrition: { protein: '28g', carbs: '78g', fat: '28g', fiber: '5g' }
//             },
//             {
//                 name: 'Veg Meals',
//                 price: 179,
//                 desc: 'Rice, sambar, rasam, poriyal, kootu, curd, papad',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1589307000180-e506d4c300a5?w=300',
//                 prepTime: '10 mins',
//                 calories: 520,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra Sambar', 'Extra Rice'],
//                 nutrition: { protein: '12g', carbs: '74g', fat: '16g', fiber: '10g' }
//             }
//         ]
//     }
// },
// {
//     id: 9,
//     name: 'Café Xtasi',
//     rating: '4.4',
//     cuisine: 'Italian, Pizza',
//     location: 'Mission Street',
//     distance: '1.0 km',
//     price: '₹1200 for two',
//     image: 'https://images.unsplash.com/photo-1601924582971-df3b0f4dff98?w=400',
//     menu: {
//         'Starters': [
//             {
//                 name: 'Garlic Bread Supreme',
//                 price: 179,
//                 desc: 'Wood-fired garlic bread with herbs and cheese',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1548365328-8608aeb2f17c?w=300',
//                 prepTime: '8-10 mins',
//                 calories: 260,
//                 spiceLevel: 'None',
//                 customizations: ['Extra Cheese', 'No Garlic'],
//                 nutrition: { protein: '8g', carbs: '32g', fat: '10g', fiber: '2g' }
//             },
//             {
//                 name: 'BBQ Chicken Bites',
//                 price: 249,
//                 desc: 'Grilled chicken tossed in smoky BBQ sauce',
//                 veg: false,
//                 img: 'https://images.unsplash.com/photo-1600891963922-07f4e8a90344?w=300',
//                 prepTime: '10-12 mins',
//                 calories: 330,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra BBQ Sauce', 'Crispy Version'],
//                 nutrition: { protein: '22g', carbs: '24g', fat: '16g', fiber: '1g' }
//             }
//         ],
//         'Pizza': [
//             {
//                 name: 'Xtasi Special Veg',
//                 price: 449,
//                 desc: 'Wood-fired veg pizza with olives, jalapenos, mushrooms and cheese',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1618213837799-94d46e4e09e4?w=300',
//                 prepTime: '12-15 mins',
//                 calories: 720,
//                 spiceLevel: 'Medium',
//                 customizations: ['Extra Cheese', 'Thin Crust', 'Extra Jalapenos'],
//                 nutrition: { protein: '26g', carbs: '88g', fat: '28g', fiber: '6g' }
//             },
//             {
//                 name: 'Xtasi Chicken Feast',
//                 price: 499,
//                 desc: 'Loaded chicken pizza with pepperoni, grilled chicken and cheese',
//                 veg: false,
//                 img: 'https://images.unsplash.com/photo-1601924582971-df3b0f4dff98?w=300',
//                 prepTime: '12-15 mins',
//                 calories: 820,
//                 spiceLevel: 'Mild',
//                 customizations: ['Extra Chicken', 'Extra Cheese', 'Thin Crust'],
//                 nutrition: { protein: '36g', carbs: '92g', fat: '34g', fiber: '5g' }
//             }
//         ],
//         'Pasta': [
//             {
//                 name: 'Creamy Alfredo Pasta',
//                 price: 329,
//                 desc: 'Rich cream sauce pasta with herbs and parmesan',
//                 veg: true,
//                 img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300',
//                 prepTime: '15 mins',
//                 calories: 590,
//                 spiceLevel: 'None',
//                 customizations: ['Extra Cheese', 'Add Mushrooms', 'Less Cream'],
//                 nutrition: { protein: '14g', carbs: '70g', fat: '26g', fiber: '3g' }
//             },
//             {
//                 name: 'Chicken Arrabbiata Pasta',
//                 price: 369,
//                 desc: 'Spicy tomato-based pasta with grilled chicken',
//                 veg: false,
//                 img: 'https://images.unsplash.com/photo-1604908177173-9da8b9f81fb8?w=300',
//                 prepTime: '15 mins',
//                 calories: 640,
//                 spiceLevel: 'Hot',
//                 customizations: ['Extra Spicy', 'Extra Chicken', 'Less Garlic'],
//                 nutrition: { protein: '26g', carbs: '76g', fat: '22g', fiber: '4g' }
//             }
//         ]
//     }
// }

        ];

        // Store restaurant data in localStorage
        function openRestaurant(restaurantId) {
            const restaurant = restaurants.find(r => r.id === restaurantId);
            if (restaurant) {
                localStorage.setItem('selectedRestaurant', JSON.stringify(restaurant));
                window.open('mahi.html', '_blank');
            }
        }

        function renderRestaurants() {
            const container = document.getElementById('restaurantScroll');
            container.innerHTML = restaurants.map(restaurant => `
                <div class="restaurant-card" onclick="openRestaurant(${restaurant.id})">
                    <img src="${restaurant.image}" alt="${restaurant.name}">
                    <div class="restaurant-info">
                        <h3>${restaurant.name} <span class="rating">${restaurant.rating}★</span></h3>
                        <p>${restaurant.cuisine}</p>
                        <p class="details">${restaurant.location} • ${restaurant.distance}</p>
                        <p class="price">${restaurant.price}</p>
                        <span class="tag">View Full Menu →</span>
                        <div class="offers">Up to 15% off with bank offers</div>
                    </div>
                </div>
            `).join('');
        }

        renderRestaurants();
    
        





        