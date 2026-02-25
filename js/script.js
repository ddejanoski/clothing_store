const STORAGE_KEYS = {
  cart: 'outfit_cart_v1',
  selectedSizes: 'outfit_selected_sizes_v1',
  activeImage: 'outfit_active_image_v1',
  gallerySignature: 'outfit_gallery_signature_v1'
};

const outfit = {
  id: 'grenalux-wedding-outfit',
  title: 'Grenalux Solid Wedding Outfit',
  description: 'Dots with dots is easy to do, just change the scale and make sure not to repeat more than twice.',
  imageUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880169/hqdetailed_suit_wearing_xrylpk.png',
  gallery: [
    {
      id: 'look-1',
      label: 'Look 1',
      imageUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771890708/hqgrenalux_wedding_outfit_xirh7f.jpg'
    },
    {
      id: 'look-2',
      label: 'Look 2',
      imageUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880174/hqdetailed_suit_wearing_3_djgy25.png'
    },
    {
      id: 'look-3',
      label: 'Look 3',
      imageUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880220/hqdetailed_suit_wearing_2_xstpxv.png'
    },
    {
      id: 'look-4',
      label: 'Look 4',
      imageUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880169/hqdetailed_suit_wearing_xrylpk.png'
    }
  ],
  products: [
    {
      id: 'jacket-1',
      type: 'jacket',
      title: 'The Wool Miracle Donegal Light Grey Jacket',
      price: 195,
      color: 'Light Grey',
      imgUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880259/hqwool_miracle_coat_tep09h.png',
      sizes: [
        { label: '36 Regular', available: true },
        { label: '38 Regular', available: true },
        { label: '40 Regular', available: true },
        { label: '42 Regular', available: true },
        { label: '44 Regular', available: true },
        { label: '46 Regular', available: false },
        { label: '40 Long', available: true },
        { label: '42 Long', available: true },
        { label: '44 Long', available: true },
        { label: '46 Long', available: true }
      ]
    },
    {
      id: 'shirt-1',
      type: 'dress shirt',
      title: 'Modern Tattersall Turquoise Non-Iron Dress Shirt',
      price: 55,
      color: 'Turquoise',
      imgUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880233/hqnoniron_dress_shirt_vl7w1y.png',
      sizes: [
        { label: 'S', available: true },
        { label: 'M', available: true },
        { label: 'L', available: true },
        { label: 'XL', available: true }
      ]
    },
    {
      id: 'tie-1',
      type: 'tie',
      title: 'Bulletin Dot Light Cornflower Tie',
      price: 25,
      color: 'Light Cornflower',
      imgUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880171/hqlight_tie_pdiw11.png',
      sizes: []
    },
    {
      id: 'pocket-square-1',
      type: 'pocket square',
      title: 'Solid Twill White Pocket Square',
      price: 12,
      color: 'White',
      imgUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880232/hqwhite_square_kxjhkk.png',
      sizes: []
    },
    {
      id: 'cufflinks-1',
      type: 'cufflinks',
      title: 'Bricked Silver Cufflinks',
      price: 20,
      color: 'Silver',
      imgUrl: 'https://res.cloudinary.com/deoiye6is/image/upload/v1771880215/hqsilver_cufflinks_aelvva.png',
      sizes: []
    }
  ]
};

const state = {
  expandedProductId: null,
  cart: loadJson(STORAGE_KEYS.cart, {}),
  selectedSizes: loadJson(STORAGE_KEYS.selectedSizes, {}),
  activeImage: loadString(STORAGE_KEYS.activeImage, outfit.imageUrl)
};

const app = document.getElementById('app');

normalizeGalleryState();

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadString(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}

function persistState() {
  try {
    localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(state.cart));
    localStorage.setItem(STORAGE_KEYS.selectedSizes, JSON.stringify(state.selectedSizes));
    localStorage.setItem(STORAGE_KEYS.activeImage, state.activeImage);
    localStorage.setItem(STORAGE_KEYS.gallerySignature, getGallerySignature());
  } catch {
    // Ignore storage errors in private mode or restricted environments.
  }
}

function getGalleryUrls() {
  return (Array.isArray(outfit.gallery) ? outfit.gallery : [])
    .map((image) => image && image.imageUrl)
    .filter(Boolean);
}

function getDefaultGalleryImage() {
  const galleryUrls = getGalleryUrls();
  return outfit.imageUrl || galleryUrls[0] || '';
}

function getGallerySignature() {
  return JSON.stringify({
    imageUrl: outfit.imageUrl || '',
    gallery: getGalleryUrls()
  });
}

function normalizeGalleryState() {
  const galleryUrls = getGalleryUrls();
  const defaultImage = getDefaultGalleryImage();
  const savedSignature = loadString(STORAGE_KEYS.gallerySignature, '');
  const currentSignature = getGallerySignature();

  if (savedSignature && savedSignature !== currentSignature) {
    state.activeImage = defaultImage;
  }

  if (!state.activeImage) {
    state.activeImage = defaultImage;
  }

  const allowedUrls = new Set([defaultImage, ...galleryUrls].filter(Boolean));
  if (!allowedUrls.has(state.activeImage)) {
    state.activeImage = defaultImage;
  }

  persistState();
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

function getProductById(productId) {
  return outfit.products.find((product) => product.id === productId);
}

function isAdded(productId) {
  return Boolean(state.cart[productId]);
}

function hasSizes(product) {
  return Array.isArray(product.sizes) && product.sizes.length > 0;
}

function canAdd(product) {
  if (!hasSizes(product)) return true;
  const selected = state.selectedSizes[product.id];
  return product.sizes.some((size) => size.label === selected && size.available);
}

function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;
  if (!canAdd(product)) return;

  state.cart[productId] = {
    productId,
    selectedSize: hasSizes(product) ? state.selectedSizes[productId] : null,
    addedAt: Date.now()
  };
  state.expandedProductId = null;
  persistState();
  render();
}

function removeFromCart(productId) {
  delete state.cart[productId];
  persistState();
  render();
}

function toggleExpand(productId) {
  state.expandedProductId = state.expandedProductId === productId ? null : productId;
  render();
}

function selectSize(productId, sizeLabel) {
  state.selectedSizes[productId] = sizeLabel;
  persistState();
  render();
}

function setActiveImage(imageUrl) {
  state.activeImage = imageUrl;
  persistState();
  render();
}

function resetActiveImageToDefault() {
  const defaultImage = getDefaultGalleryImage();
  if (!defaultImage || state.activeImage === defaultImage) return;
  setActiveImage(defaultImage);
}

function getSummary() {
  const addedItems = Object.values(state.cart);
  const uniqueCount = addedItems.length;
  const totalAmount = addedItems.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price : 0);
  }, 0);

  let discountPercent = 0;
  if (uniqueCount >= 5) discountPercent = 15;
  else if (uniqueCount >= 4) discountPercent = 10;
  else if (uniqueCount >= 3) discountPercent = 5;

  const discountedTotal = totalAmount * (1 - discountPercent / 100);

  return {
    uniqueCount,
    totalAmount,
    discountPercent,
    discountedTotal
  };
}

function buildProgress(summary) {
  const steps = [1, 2, 3, 4, 5];
  const reached = Math.max(0, Math.min(summary.uniqueCount, 5));
  const fillPercent = ((Math.max(reached - 1, 0)) / 4) * 100;

  const labels = ['', '', '5% Off', '10% Off', '15% Off'];

  return {
    steps,
    reached,
    fillPercent,
    labels
  };
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTypeIconPath(type) {
  const normalized = String(type).toLowerCase();
  if (normalized.includes('jacket')) return 'images/jacket.png';
  if (normalized.includes('dress shirt') || normalized.includes('shirt')) return 'images/dress_shirt.png';
  if (normalized.includes('tie')) return 'images/tie.png';
  if (normalized.includes('pocket')) return 'images/pocket_square.png';
  if (normalized.includes('cuff')) return 'images/cufflinks.png';
  return '';
}

function render() {
  const summary = getSummary();
  const progress = buildProgress(summary);
  const [tileFlat, tileDetail, tileModel] = outfit.gallery;

  app.innerHTML = `
    <main class="app-shell">
      <section class="layout" aria-label="Outfit configurator">
        <aside class="gallery" aria-label="Outfit gallery">
          <div class="hero-card">
            <img class="hero-image" src="${escapeHtml(state.activeImage)}" alt="${escapeHtml(outfit.title)}" />
          </div>
          <div class="gallery-collage" role="list">
            ${[tileFlat, tileDetail, tileModel].filter(Boolean).map((image, index) => `
              <button
                class="thumb ${index === 0 ? 'tile-flat' : ''} ${index === 1 ? 'tile-detail' : ''} ${index === 2 ? 'tile-model' : ''} ${state.activeImage === image.imageUrl ? 'active' : ''}"
                type="button"
                data-action="set-image"
                data-image-url="${escapeHtml(image.imageUrl)}"
                aria-label="Show ${escapeHtml(image.label)}"
              >
                <img src="${escapeHtml(image.imageUrl)}" alt="${escapeHtml(image.label)}" />
              </button>
            `).join('')}
            <div class="palette-card" aria-label="Pantone Colors In This Outfit">
              <div class="palette-title">Pantone Colors In This Outfit</div>
              <div class="palette-row">
                <span>Light Grey</span>
                <span>PMS 431 C</span>
              </div>
            </div>
          </div>
        </aside>

        <section class="outfit-panel">
          <header class="header">
            <h1>${escapeHtml(outfit.title)}</h1>
            <p>${escapeHtml(outfit.description)}</p>
            <div class="badge" aria-label="Season collection">
              <span class="badge-icon" aria-hidden="true">
                <img src="images/snowflake.png" alt="" />
              </span>
              <span>Winter 2022 Style</span>
            </div>
          </header>

          <section class="progress-wrap" aria-label="Bundle discount progress">
            <div class="progress-copy">
              Build Your Outfit:
              <span>${summary.uniqueCount >= 3 ? `You unlocked ${summary.discountPercent}% off` : 'Add 3 or more items to unlock discounts'}</span>
            </div>
            <div class="progress">
              <div class="progress-line" aria-hidden="true"></div>
              <div class="progress-fill" aria-hidden="true" style="width: calc((100% - 28px) * ${progress.fillPercent / 100});"></div>
              <ol class="progress-steps">
                ${progress.steps.map((step, index) => `
                  <li class="${progress.reached >= step ? 'is-reached' : ''}">
                    <span class="step-dot">${step}</span>
                    <div class="step-label">${progress.labels[index] || ''}</div>
                  </li>
                `).join('')}
              </ol>
            </div>
          </section>

          <section class="product-list" aria-label="Products">
            ${outfit.products.map((product) => renderProductCard(product)).join('')}
          </section>

          <section class="summary" aria-label="Total">
            <h2 class="summary-title">Total</h2>
            <div class="summary-grid">
              <div class="summary-box">
                <div class="summary-label">Products Added</div>
                <div class="summary-value">${summary.uniqueCount}</div>
              </div>
              <div class="summary-box">
                <div class="summary-label">Subtotal</div>
                <div class="summary-value">${formatCurrency(summary.totalAmount)}</div>
              </div>
              <div class="summary-box">
                <div class="summary-label">Discounted Total</div>
                <div class="summary-value">${formatCurrency(summary.discountedTotal)}</div>
              </div>
            </div>
            <div class="summary-note">
              ${summary.discountPercent > 0
                ? `Bundle discount applied: ${summary.discountPercent}% off.`
                : 'No discount yet. Add at least 3 products to unlock 5% off.'}
            </div>
            ${summary.uniqueCount === 0 ? '<p class="empty-note">No products added yet.</p>' : ''}
          </section>
        </section>
      </section>
    </main>
  `;
}

function renderProductCard(product) {
  const expanded = state.expandedProductId === product.id;
  const added = isAdded(product.id);
  const cartItem = state.cart[product.id];
  const selectedSize = state.selectedSizes[product.id];
  const hasProductSizes = hasSizes(product);

  return `
    <article class="product-card ${expanded ? 'expanded' : ''} ${added ? 'added' : ''}" data-product-id="${escapeHtml(product.id)}">
      <div class="product-row">
        <div class="product-image-wrap">
          <img class="product-image" src="${escapeHtml(product.imgUrl)}" alt="${escapeHtml(product.title)}" />
        </div>

        <div>
          <div class="product-type">
            <span class="product-type-icon" aria-hidden="true">
              ${getTypeIconPath(product.type)
                ? `<img src="${escapeHtml(getTypeIconPath(product.type))}" alt="" />`
                : ''}
            </span>
            <span>${escapeHtml(product.type)}</span>
          </div>
          <h3 class="product-title">${escapeHtml(product.title)}</h3>
          <div class="product-price">${formatCurrency(product.price)}</div>
          <div class="meta"><strong>Color:</strong> ${escapeHtml(product.color)}</div>
          ${cartItem && cartItem.selectedSize ? `<div class="selection-note"><strong>Size:</strong> ${escapeHtml(cartItem.selectedSize)}</div>` : ''}
          ${added ? `<button type="button" class="edit-btn" data-action="toggle-expand" data-product-id="${escapeHtml(product.id)}">Edit Item</button>` : ''}
        </div>

        <div class="actions">
          <div class="action-stack">
            ${added ? `
              <div class="added-panel">
                <div class="checkmark" aria-hidden="true">&#10003;</div>
                <div class="added-text">Added!</div>
                <button type="button" class="remove-btn" data-action="remove" data-product-id="${escapeHtml(product.id)}">Remove Item</button>
              </div>
            ` : `
              <button type="button" class="configure-btn" data-action="toggle-expand" data-product-id="${escapeHtml(product.id)}" aria-expanded="${expanded}">
                <span class="plus" aria-hidden="true">+</span>
                <span class="label">Configure</span>
              </button>
            `}
          </div>
        </div>
      </div>

      ${expanded ? `
        <div class="config-panel" aria-label="Configure ${escapeHtml(product.title)}">
          <div class="config-header">
            <div class="config-title">${hasProductSizes ? 'Select Size' : 'Ready to Add'}</div>
            <button type="button" class="close-config" data-action="toggle-expand" data-product-id="${escapeHtml(product.id)}">Cancel</button>
          </div>

          ${hasProductSizes ? `
            <div class="size-grid" role="listbox" aria-label="Available sizes">
              ${product.sizes.map((size) => {
                const selected = selectedSize === size.label;
                return `
                  <button
                    type="button"
                    class="size-btn ${selected ? 'selected' : ''}"
                    data-action="select-size"
                    data-product-id="${escapeHtml(product.id)}"
                    data-size-label="${escapeHtml(size.label)}"
                    ${size.available ? '' : 'disabled'}
                    aria-selected="${selected}"
                  >
                    ${escapeHtml(size.label)}
                  </button>
                `;
              }).join('')}
            </div>
          ` : '<p class="helper">This item has no size options.</p>'}

          <div class="add-row">
            <button
              type="button"
              class="add-btn"
              data-action="add"
              data-product-id="${escapeHtml(product.id)}"
              ${canAdd(product) ? '' : 'disabled'}
            >
              ADD TO OUTFIT
            </button>
            ${hasProductSizes && !canAdd(product) ? '<p class="helper">Choose an available size to continue.</p>' : ''}
          </div>
        </div>
      ` : ''}
    </article>
  `;
}

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;

  const { action } = target.dataset;
  const productId = target.dataset.productId;

  if (action === 'toggle-expand' && productId) {
    toggleExpand(productId);
    return;
  }

  if (action === 'select-size' && productId) {
    selectSize(productId, target.dataset.sizeLabel);
    return;
  }

  if (action === 'add' && productId) {
    addToCart(productId);
    return;
  }

  if (action === 'remove' && productId) {
    removeFromCart(productId);
    return;
  }

  if (action === 'set-image') {
    const imageUrl = target.dataset.imageUrl;
    if (imageUrl) setActiveImage(imageUrl);
  }
});

document.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  // Keep current gallery selection when interacting with the gallery itself.
  if (target.closest('.gallery')) return;

  // Ignore clicks on interactive controls/content; only treat "background-ish" clicks as reset.
  if (target.closest('button, a, input, select, textarea, [data-action], .product-card, .summary, .progress-wrap, .header')) {
    return;
  }

  resetActiveImageToDefault();
});

render();
