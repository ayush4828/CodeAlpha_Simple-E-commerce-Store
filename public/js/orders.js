/* ═══════════════════════════════════════════════════════════════
   NovaBuy — Checkout & Orders
   ═══════════════════════════════════════════════════════════════ */

// ─── CHECKOUT PAGE ───
async function renderCheckoutPage() {
  if (!requireAuth()) return;

  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  try {
    const cart = await api('/cart');

    if (cart.length === 0) {
      showToast('Your cart is empty!', 'info');
      navigateTo('products');
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    main.innerHTML = `
      <div class="container">
        <section class="checkout-page">
          <div class="page-header">
            <h1>Checkout</h1>
            <p>Complete your order</p>
          </div>

          <div class="checkout-layout">
            <!-- Shipping Form -->
            <div>
              <form id="checkoutForm" onsubmit="handlePlaceOrder(event)">
                <div class="form-section">
                  <h3>📍 Shipping Address</h3>
                  <div class="form-grid">
                    <div class="form-group full">
                      <label class="form-label" for="shipFullName">Full Name</label>
                      <input type="text" class="form-input" id="shipFullName" placeholder="John Doe" required value="${state.user?.name || ''}">
                    </div>
                    <div class="form-group full">
                      <label class="form-label" for="shipStreet">Street Address</label>
                      <input type="text" class="form-input" id="shipStreet" placeholder="123 Main St, Apt 4" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="shipCity">City</label>
                      <input type="text" class="form-input" id="shipCity" placeholder="New York" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="shipState">State</label>
                      <input type="text" class="form-input" id="shipState" placeholder="NY" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="shipZip">ZIP Code</label>
                      <input type="text" class="form-input" id="shipZip" placeholder="10001" required>
                    </div>
                    <div class="form-group">
                      <label class="form-label" for="shipPhone">Phone Number</label>
                      <input type="tel" class="form-input" id="shipPhone" placeholder="+1 234 567 8900" required>
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h3>💳 Payment Method</h3>
                  <div class="form-group">
                    <select class="form-input" id="paymentMethod" style="height:44px;cursor:pointer;">
                      <option value="Cash on Delivery">Cash on Delivery</option>
                      <option value="Credit Card">Credit Card (Demo)</option>
                      <option value="Debit Card">Debit Card (Demo)</option>
                      <option value="UPI">UPI (Demo)</option>
                    </select>
                  </div>
                </div>

                <button type="submit" class="btn btn-primary btn-lg" id="placeOrderBtn" style="width:100%;">
                  🛒 Place Order — ${formatPrice(total)}
                </button>
              </form>
            </div>

            <!-- Order Summary -->
            <div class="cart-summary">
              <h3>Order Summary</h3>
              
              ${cart.map(item => `
                <div style="display:flex;gap:12px;align-items:center;margin-bottom:14px;">
                  <div style="width:48px;height:48px;border-radius:8px;overflow:hidden;background:var(--bg-tertiary);flex-shrink:0;">
                    <img src="${item.product.image}" alt="" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">
                  </div>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:0.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.product.name}</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);">Qty: ${item.quantity}</div>
                  </div>
                  <div style="font-weight:600;font-size:0.88rem;flex-shrink:0;">${formatPrice(item.product.price * item.quantity)}</div>
                </div>
              `).join('')}

              <div style="border-top:1px solid var(--border-subtle);margin-top:8px;padding-top:16px;"></div>
              
              <div class="summary-row">
                <span class="label">Subtotal</span>
                <span class="value">${formatPrice(subtotal)}</span>
              </div>
              <div class="summary-row">
                <span class="label">Shipping</span>
                <span class="value" style="color:${shipping === 0 ? 'var(--accent-green)' : ''}">${shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div class="summary-row">
                <span class="label">Tax</span>
                <span class="value">${formatPrice(tax)}</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span class="value">${formatPrice(total)}</span>
              </div>
              <div class="secure-note" style="margin-top:16px;">
                <span>🔒</span> Your information is protected
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  } catch (error) {
    showToast(error.message, 'error');
    navigateTo('cart');
  }
}

async function handlePlaceOrder(e) {
  e.preventDefault();
  const btn = document.getElementById('placeOrderBtn');
  btn.disabled = true;
  btn.textContent = 'Processing order...';

  try {
    const shippingAddress = {
      fullName: document.getElementById('shipFullName').value,
      street: document.getElementById('shipStreet').value,
      city: document.getElementById('shipCity').value,
      state: document.getElementById('shipState').value,
      zip: document.getElementById('shipZip').value,
      phone: document.getElementById('shipPhone').value
    };

    const paymentMethod = document.getElementById('paymentMethod').value;

    const order = await api('/orders', {
      method: 'POST',
      body: { shippingAddress, paymentMethod }
    });

    updateCartBadge();
    showToast('Order placed successfully! 🎉', 'success');
    renderOrderConfirmation(order);
  } catch (error) {
    showToast(error.message, 'error');
    btn.disabled = false;
    btn.textContent = '🛒 Place Order';
  }
}

function renderOrderConfirmation(order) {
  const main = document.getElementById('mainContent');
  main.innerHTML = `
    <div class="container">
      <div class="auth-page" style="min-height:auto;padding:80px 20px;">
        <div class="auth-card" style="max-width:520px;text-align:center;">
          <div style="font-size:4rem;margin-bottom:20px;">🎉</div>
          <h2>Order Confirmed!</h2>
          <p class="auth-subtitle">Thank you for your purchase. Your order has been placed successfully.</p>
          
          <div style="background:var(--bg-tertiary);border-radius:var(--radius-md);padding:20px;margin:24px 0;text-align:left;">
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:var(--text-muted);font-size:0.85rem;">Order ID</span>
              <span style="font-family:var(--font-heading);font-size:0.85rem;">#${order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:var(--text-muted);font-size:0.85rem;">Total</span>
              <span style="font-weight:600;">${formatPrice(order.totalAmount)}</span>
            </div>
            <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
              <span style="color:var(--text-muted);font-size:0.85rem;">Status</span>
              <span class="order-status status-processing">${order.status}</span>
            </div>
            <div style="display:flex;justify-content:space-between;">
              <span style="color:var(--text-muted);font-size:0.85rem;">Payment</span>
              <span style="font-size:0.85rem;">${order.paymentMethod}</span>
            </div>
          </div>

          <div style="display:flex;gap:12px;">
            <button class="btn btn-primary" onclick="navigateTo('orders')" style="flex:1;">View Orders</button>
            <button class="btn btn-secondary" onclick="navigateTo('products')" style="flex:1;">Continue Shopping</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ─── ORDERS PAGE ───
async function renderOrdersPage() {
  if (!requireAuth()) return;

  const main = document.getElementById('mainContent');
  main.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;

  try {
    const orders = await api('/orders');

    if (orders.length === 0) {
      main.innerHTML = `
        <div class="container">
          <section class="orders-page">
            <div class="empty-state">
              <div class="icon">📋</div>
              <h3>No orders yet</h3>
              <p>When you place an order, it will appear here.</p>
              <button class="btn btn-primary" onclick="navigateTo('products')">Start Shopping</button>
            </div>
          </section>
        </div>
      `;
      return;
    }

    main.innerHTML = `
      <div class="container">
        <section class="orders-page">
          <div class="page-header">
            <h1>My Orders</h1>
            <p>${orders.length} order${orders.length > 1 ? 's' : ''}</p>
          </div>

          ${orders.map(order => {
            const statusClass = order.status.toLowerCase();
            const date = new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric', month: 'short', day: 'numeric'
            });

            return `
              <div class="order-card">
                <div class="order-header">
                  <div>
                    <div class="order-id">Order #${order._id.slice(-8).toUpperCase()}</div>
                    <div class="order-date">${date}</div>
                  </div>
                  <span class="order-status status-${statusClass}">${order.status}</span>
                </div>
                <div class="order-items">
                  ${order.items.map(item => `
                    <div class="order-item-thumb">
                      <img src="${item.image}" alt="${item.name}" onerror="this.style.display='none'">
                    </div>
                  `).join('')}
                  ${order.items.length > 5 ? `<div style="display:flex;align-items:center;color:var(--text-muted);font-size:0.85rem;">+${order.items.length - 5} more</div>` : ''}
                </div>
                <div class="order-footer">
                  <div>
                    <span style="color:var(--text-muted);font-size:0.82rem;">${order.items.length} item${order.items.length > 1 ? 's' : ''} • ${order.paymentMethod}</span>
                  </div>
                  <div class="order-total">${formatPrice(order.totalAmount)}</div>
                </div>
              </div>
            `;
          }).join('')}
        </section>
      </div>
    `;
  } catch (error) {
    main.innerHTML = `
      <div class="container">
        <div class="empty-state">
          <div class="icon">😔</div>
          <h3>Error loading orders</h3>
          <p>${error.message}</p>
          <button class="btn btn-primary" onclick="renderOrdersPage()">Try Again</button>
        </div>
      </div>
    `;
  }
}
