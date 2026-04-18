/* ═══════════════════════════════════════════════════════════════
   NovaBuy — Cart Page
   ═══════════════════════════════════════════════════════════════ */

async function renderCartPage() {
  if (!requireAuth()) return;

  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  try {
    const cart = await api('/cart');

    if (cart.length === 0) {
      main.innerHTML = `
        <div class="container">
          <section class="cart-page">
            <div class="empty-state">
              <div class="icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet. Start shopping!</p>
              <button class="btn btn-primary" onclick="navigateTo('products')">Browse Products</button>
            </div>
          </section>
        </div>
      `;
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    main.innerHTML = `
      <div class="container">
        <section class="cart-page">
          <div class="page-header">
            <h1>Shopping Cart</h1>
            <p>${cart.length} item${cart.length > 1 ? 's' : ''} in your cart</p>
          </div>

          <div class="cart-layout">
            <!-- Cart Items -->
            <div class="cart-items">
              ${cart.map(item => `
                <div class="cart-item" id="cart-item-${item.product._id}">
                  <div class="cart-item-image" onclick="navigateTo('product', {id:'${item.product._id}'})">
                    <img src="${item.product.image}" alt="${item.product.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22 fill=%22%231a1a2e%22%3E%3Crect width=%22120%22 height=%22120%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%236b6b80%22 font-size=%2230%22%3E📦%3C/text%3E%3C/svg%3E'">
                  </div>
                  <div class="cart-item-info">
                    <div class="cart-item-name">${item.product.name}</div>
                    <div class="cart-item-category">${item.product.category}</div>
                    <div class="cart-item-bottom">
                      <div class="cart-item-price">${formatPrice(item.product.price * item.quantity)}</div>
                      <div class="cart-item-actions">
                        <div class="quantity-selector" style="margin:0">
                          <button class="quantity-btn" onclick="updateCartQty('${item.product._id}', ${item.quantity - 1})">−</button>
                          <input type="text" class="quantity-value" value="${item.quantity}" readonly>
                          <button class="quantity-btn" onclick="updateCartQty('${item.product._id}', ${item.quantity + 1})">+</button>
                        </div>
                        <span class="cart-item-remove" onclick="removeFromCart('${item.product._id}')">🗑️ Remove</span>
                      </div>
                    </div>
                  </div>
                </div>
              `).join('')}

              <div style="text-align:right;margin-top:8px;">
                <button class="btn btn-danger btn-sm" onclick="clearCart()">🗑️ Clear Cart</button>
              </div>
            </div>

            <!-- Summary -->
            <div class="cart-summary">
              <h3>Order Summary</h3>
              <div class="summary-row">
                <span class="label">Subtotal (${cart.reduce((s,i) => s + i.quantity, 0)} items)</span>
                <span class="value">${formatPrice(subtotal)}</span>
              </div>
              <div class="summary-row">
                <span class="label">Shipping</span>
                <span class="value" style="color:${shipping === 0 ? 'var(--accent-green)' : 'var(--text-primary)'}">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div class="summary-row">
                <span class="label">Estimated Tax</span>
                <span class="value">${formatPrice(tax)}</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span class="value">${formatPrice(total)}</span>
              </div>
              ${shipping > 0 ? `<p style="font-size:0.75rem;color:var(--accent-green);margin-top:8px;">Add ${formatPrice(50 - subtotal)} more for FREE shipping!</p>` : ''}
              <button class="btn btn-primary btn-lg" onclick="navigateTo('checkout')">
                Proceed to Checkout →
              </button>
              <div class="secure-note">
                <span>🔒</span> Secured by 256-bit SSL encryption
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
          <h3>Error loading cart</h3>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="renderCartPage()">Try Again</button>
        </div>
      </div>
    `;
  }
}

async function updateCartQty(productId, quantity) {
  try {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    await api(`/cart/${productId}`, {
      method: 'PUT',
      body: { quantity }
    });
    updateCartBadge();
    renderCartPage();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function removeFromCart(productId) {
  try {
    await api(`/cart/${productId}`, { method: 'DELETE' });
    showToast('Item removed from cart', 'info');
    updateCartBadge();
    renderCartPage();
  } catch (error) {
    showToast(error.message, 'error');
  }
}

async function clearCart() {
  if (!confirm('Clear all items from your cart?')) return;
  try {
    await api('/cart', { method: 'DELETE' });
    showToast('Cart cleared', 'info');
    updateCartBadge();
    renderCartPage();
  } catch (error) {
    showToast(error.message, 'error');
  }
}
