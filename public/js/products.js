/* ═══════════════════════════════════════════════════════════════
   NovaBuy — Products (Home Page, Listings, Detail)
   ═══════════════════════════════════════════════════════════════ */

const categoryIcons = {
  'Electronics': '⚡',
  'Fashion': '👗',
  'Home & Kitchen': '🏠',
  'Beauty & Personal Care': '✨',
  'Sports & Outdoors': '🏋️',
  'Books': '📚',
  'Toys & Games': '🎮',
  'Automotive': '🚗',
  'Garden & Outdoor': '🌿',
  'Office Supplies': '📎',
  'All': '🔥'
};

// ─── HOME PAGE ───
async function renderHomePage() {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="loading-spinner"><div class="spinner"></div></div>
  `;

  try {
    const [featured, categories] = await Promise.all([
      api('/products/featured'),
      api('/products/categories')
    ]);

    main.innerHTML = `
      <!-- Hero -->
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-text">
              <div class="hero-badge">✨ New Season Collection</div>
              <h1>Discover<br><span class="gradient-text">Premium Products</span><br>Made for You</h1>
              <p>Shop thousands of handpicked products from trusted brands at unbeatable prices. Fast delivery, easy returns, happy you.</p>
              <div class="hero-actions">
                <button class="btn btn-primary btn-lg" onclick="navigateTo('products')">
                  Shop Now →
                </button>
                <button class="btn btn-secondary btn-lg" onclick="navigateTo('products', {category:'Electronics'})">
                  Trending
                </button>
              </div>
              <div class="hero-stats">
                <div class="hero-stat">
                  <div class="number">10K+</div>
                  <div class="label">Products</div>
                </div>
                <div class="hero-stat">
                  <div class="number">50K+</div>
                  <div class="label">Happy Customers</div>
                </div>
                <div class="hero-stat">
                  <div class="number">99%</div>
                  <div class="label">Satisfaction</div>
                </div>
              </div>
            </div>
            <div class="hero-visual">
              ${renderHeroCards(featured)}
            </div>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="categories-section">
        <div class="container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Browse Categories</h2>
              <p class="section-subtitle">Find exactly what you're looking for</p>
            </div>
          </div>
          <div class="categories-grid">
            ${['All', ...categories].map(cat => `
              <div class="category-card" onclick="navigateTo('products', {category:'${cat}'})">
                <div class="category-icon">${categoryIcons[cat] || '📦'}</div>
                <div class="category-name">${cat}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- Promo Banner -->
      <div class="container">
        <div class="promo-banner">
          <div>
            <h3>🔥 Flash Sale — Up to 60% Off</h3>
            <p>Limited time offers on electronics, fashion, and more!</p>
          </div>
          <button class="btn" onclick="navigateTo('products', {sort:'price_asc'})">
            Shop Deals →
          </button>
        </div>
      </div>

      <!-- Featured Products -->
      <section class="featured-section">
        <div class="container">
          <div class="section-header">
            <div>
              <h2 class="section-title">Featured Products</h2>
              <p class="section-subtitle">Handpicked by our team for you</p>
            </div>
            <button class="btn btn-secondary btn-sm" onclick="navigateTo('products')">
              View All →
            </button>
          </div>
          <div class="products-grid">
            ${featured.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </section>
    `;
  } catch (error) {
    main.innerHTML = `
      <div class="empty-state">
        <div class="icon">😔</div>
        <h3>Couldn't load the store</h3>
        <p>${error.message}</p>
        <button class="btn btn-primary" onclick="renderHomePage()">Try Again</button>
      </div>
    `;
  }
}

function renderHeroCards(featured) {
  const cards = featured.slice(0, 4);
  if (cards.length === 0) return '';

  return `
    <div class="hero-cards">
      ${cards.map(p => `
        <div class="hero-card" onclick="navigateTo('product', {id:'${p._id}'})">
          <div class="hero-card-img-wrapper">
            <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
          </div>
          <div class="card-price">${formatPrice(p.price)}</div>
          <div class="card-name">${p.name}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ─── PRODUCT CARD COMPONENT ───
function renderProductCard(product) {
  const discount = product.originalPrice ? calcDiscount(product.originalPrice, product.price) : 0;
  
  return `
    <div class="product-card" onclick="navigateTo('product', {id:'${product._id}'})">
      <div class="product-card-image">
        <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 fill=%22%231a1a2e%22%3E%3Crect width=%22400%22 height=%22400%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%236b6b80%22 font-size=%2240%22%3E📦%3C/text%3E%3C/svg%3E'">
        ${product.featured ? '<span class="product-badge badge-featured">Featured</span>' : ''}
        ${discount >= 30 ? '<span class="product-badge badge-sale">-' + discount + '%</span>' : ''}
        <button class="quick-add" onclick="event.stopPropagation();quickAddToCart('${product._id}')" title="Add to Cart">+</button>
      </div>
      <div class="product-card-body">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-rating">
          <span class="stars">${renderStars(product.rating)}</span>
          <span class="rating-count">(${product.reviewCount})</span>
        </div>
        <div class="product-price-row">
          <span class="product-price">${formatPrice(product.price)}</span>
          ${product.originalPrice ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>` : ''}
          ${discount > 0 ? `<span class="product-discount">-${discount}%</span>` : ''}
        </div>
      </div>
    </div>
  `;
}

// ─── PRODUCTS PAGE ───
async function renderProductsPage(params = {}) {
  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  const { category, search, sort = 'newest', page = 1 } = params;

  try {
    const [categories, productsData] = await Promise.all([
      api('/products/categories'),
      api(`/products?${new URLSearchParams({
        ...(category && category !== 'All' ? { category } : {}),
        ...(search ? { search } : {}),
        sort,
        page,
        limit: 12
      })}`)
    ]);

    main.innerHTML = `
      <div class="container">
        <section class="products-section">
          <!-- Categories filter tabs -->
          <div class="categories-grid" style="margin-bottom:32px;">
            ${['All', ...categories].map(cat => `
              <div class="category-card ${(!category || category === cat) && (cat === 'All' && !category || category === cat) ? 'active' : ''}" 
                   onclick="navigateTo('products', {category:'${cat}', sort:'${sort}'})">
                <div class="category-icon">${categoryIcons[cat] || '📦'}</div>
                <div class="category-name">${cat}</div>
              </div>
            `).join('')}
          </div>

          <!-- Toolbar -->
          <div class="products-toolbar">
            <div>
              <h1 class="section-title">${search ? `Results for "${search}"` : category && category !== 'All' ? category : 'All Products'}</h1>
              <p class="products-count">${productsData.totalProducts} products found</p>
            </div>
            <select class="sort-select" onchange="navigateTo('products', {category:'${category || ''}', search:'${search || ''}', sort: this.value})" id="sortSelect">
              <option value="newest" ${sort === 'newest' ? 'selected' : ''}>Newest First</option>
              <option value="price_asc" ${sort === 'price_asc' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price_desc" ${sort === 'price_desc' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${sort === 'rating' ? 'selected' : ''}>Top Rated</option>
              <option value="name_asc" ${sort === 'name_asc' ? 'selected' : ''}>Name: A-Z</option>
            </select>
          </div>

          <!-- Product Grid -->
          ${productsData.products.length > 0 ? `
            <div class="products-grid">
              ${productsData.products.map(p => renderProductCard(p)).join('')}
            </div>

            <!-- Pagination -->
            ${productsData.totalPages > 1 ? `
              <div class="pagination">
                <button class="page-btn" onclick="navigateTo('products', {category:'${category || ''}', search:'${search || ''}', sort:'${sort}', page:${Math.max(1, productsData.currentPage - 1)}})" ${productsData.currentPage <= 1 ? 'disabled' : ''}>←</button>
                ${Array.from({length: productsData.totalPages}, (_, i) => i + 1).map(p => `
                  <button class="page-btn ${p === productsData.currentPage ? 'active' : ''}" 
                          onclick="navigateTo('products', {category:'${category || ''}', search:'${search || ''}', sort:'${sort}', page:${p}})">${p}</button>
                `).join('')}
                <button class="page-btn" onclick="navigateTo('products', {category:'${category || ''}', search:'${search || ''}', sort:'${sort}', page:${Math.min(productsData.totalPages, productsData.currentPage + 1)}})" ${productsData.currentPage >= productsData.totalPages ? 'disabled' : ''}>→</button>
              </div>
            ` : ''}
          ` : `
            <div class="empty-state">
              <div class="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search or filters</p>
              <button class="btn btn-primary" onclick="navigateTo('products')">View All Products</button>
            </div>
          `}
        </section>
      </div>
    `;
  } catch (error) {
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="icon">😔</div>
          <h3>Error loading products</h3>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="renderProductsPage(${JSON.stringify(params)})">Try Again</button>
        </div>
      </div>
    `;
  }
}

// ─── PRODUCT DETAIL PAGE ───
async function renderProductDetailPage(productId) {
  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  try {
    const product = await api(`/products/${productId}`);
    const discount = product.originalPrice ? calcDiscount(product.originalPrice, product.price) : 0;

    main.innerHTML = `
      <div class="container">
        <section class="product-detail">
          <div class="product-detail-grid">
            <!-- Gallery -->
            <div class="product-gallery">
              <div class="product-main-image">
                <img src="${product.image}" alt="${product.name}" style="object-fit:contain;padding:20px;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22600%22 height=%22600%22 fill=%22%231a1a2e%22%3E%3Crect width=%22600%22 height=%22600%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%236b6b80%22 font-size=%2260%22%3E📦%3C/text%3E%3C/svg%3E'">
              </div>
            </div>

            <!-- Info -->
            <div class="product-info">
              <div class="breadcrumb">
                <a onclick="navigateTo('home')">Home</a> /
                <a onclick="navigateTo('products', {category:'${product.category}'})">${product.category}</a> /
                <span style="color:var(--text-primary)">${product.name.substring(0, 30)}...</span>
              </div>

              <h1>${product.name}</h1>

              <div class="rating-row">
                <span class="stars" style="font-size:1rem;color:var(--accent-orange)">${renderStars(product.rating)}</span>
                <span style="color:var(--text-secondary);font-size:0.9rem">${product.rating.toFixed(1)}</span>
                <span style="color:var(--text-muted);font-size:0.85rem">(${product.reviewCount} reviews)</span>
              </div>

              <div class="price-block">
                <span class="current-price">${formatPrice(product.price)}</span>
                ${product.originalPrice ? `
                  <span class="original-price">${formatPrice(product.originalPrice)}</span>
                  <span class="discount-tag">Save ${discount}%</span>
                ` : ''}
              </div>

              <p class="description">${product.description}</p>

              <div class="stock-indicator">
                <span class="stock-dot ${product.stock < 10 ? 'low' : product.stock === 0 ? 'out' : ''}"></span>
                <span style="color:${product.stock > 10 ? 'var(--accent-green)' : product.stock > 0 ? 'var(--accent-orange)' : 'var(--accent-red)'}">
                  ${product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                </span>
              </div>

              <div class="quantity-selector">
                <label>Quantity:</label>
                <button class="quantity-btn" onclick="changeDetailQty(-1)">−</button>
                <input type="text" class="quantity-value" id="detailQty" value="1" readonly>
                <button class="quantity-btn" onclick="changeDetailQty(1)">+</button>
              </div>

              <div class="detail-actions">
                <button class="btn btn-primary btn-lg" onclick="addToCartFromDetail('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
                  🛒 Add to Cart
                </button>
                <button class="btn btn-secondary btn-lg" onclick="buyNow('${product._id}')">
                  ⚡ Buy Now
                </button>
              </div>

              <div class="product-features">
                <div class="feature-item"><span class="icon">🚚</span> Free Shipping</div>
                <div class="feature-item"><span class="icon">🔄</span> 30-Day Returns</div>
                <div class="feature-item"><span class="icon">🛡️</span> 1-Year Warranty</div>
                <div class="feature-item"><span class="icon">💳</span> Secure Payment</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="icon">😔</div>
          <h3>Product not found</h3>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="navigateTo('products')">Browse Products</button>
        </div>
      </div>
    `;
  }
}

function changeDetailQty(delta) {
  const input = document.getElementById('detailQty');
  const newVal = Math.max(1, Math.min(10, parseInt(input.value) + delta));
  input.value = newVal;
}

async function addToCartFromDetail(productId) {
  if (!requireAuth()) return;
  const qty = parseInt(document.getElementById('detailQty').value);
  try {
    await api('/cart', {
      method: 'POST',
      body: { productId, quantity: qty }
    });
    showToast('Added to cart! 🎉', 'success');
    updateCartBadge();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function buyNow(productId) {
  if (!requireAuth()) return;
  const qty = parseInt(document.getElementById('detailQty')?.value || 1);
  try {
    await api('/cart', {
      method: 'POST',
      body: { productId, quantity: qty }
    });
    updateCartBadge();
    navigateTo('checkout');
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function quickAddToCart(productId) {
  if (!requireAuth()) return;
  try {
    await api('/cart', {
      method: 'POST',
      body: { productId, quantity: 1 }
    });
    showToast('Added to cart! 🎉', 'success');
    updateCartBadge();
  } catch (error) {
    showToast(error.message, 'error');
  }
}
