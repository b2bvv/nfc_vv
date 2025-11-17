// Configure your Google Apps Script Web App URL here
const GOOGLE_APPS_SCRIPT_URL = 'https://denislialinlialin1998.app.n8n.cloud/webhook-test/802a9236-4875-4aa3-903a-f1aaea2e8770';

// Product data loading and rendering
let productsData = null;
let currentProduct = null;

async function loadProductsData() {
  try {
    const response = await fetch('products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    productsData = await response.json();
    return productsData;
  } catch (error) {
    console.error('Error loading products data:', error);
    return null;
  }
}

function getProductById(productId) {
  if (!productsData || !productsData.products) {
    return null;
  }
  return productsData.products.find(p => p.id === productId) || productsData.products[0];
}

function getCurrentProductId() {
  // Try to get product ID from URL path (e.g., /pu-erh-tea)
  const path = window.location.pathname;
  const pathParts = path.split('/').filter(part => part && part !== 'index.html');
  
  if (pathParts.length > 0) {
    const productIdFromPath = pathParts[pathParts.length - 1];
    // Check if it's a valid product ID (not a file extension)
    if (productIdFromPath && !productIdFromPath.includes('.')) {
      return productIdFromPath;
    }
  }
  
  // Try to get product ID from URL parameter (e.g., ?product=pu-erh-tea)
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('product');
  if (productId) {
    return productId;
  }
  
  // Default to first product
  return productsData?.products?.[0]?.id || 'pu-erh-tea';
}

function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

function populateProductData(product) {
  if (!product) {
    console.error('No product data provided');
    return;
  }

  // Find all elements with data-product-field attribute
  const elements = document.querySelectorAll('[data-product-field]');
  
  elements.forEach(element => {
    const fieldName = element.getAttribute('data-product-field');
    const fieldType = element.getAttribute('data-product-field-type');
    
    if (!fieldName) return;

    let value;
    
    // Handle nested fields (e.g., nutrition.proteins)
    if (fieldName.includes('.')) {
      value = getNestedValue(product, fieldName);
    } else {
      value = product[fieldName];
    }

    if (value === undefined || value === null) {
      return;
    }

    // Handle different field types
    if (fieldType === 'src') {
      // For images and videos, set src attribute
      if (element.tagName === 'IMG' || element.tagName === 'VIDEO') {
        element.src = value;
        // Also update alt for images if specified
        const altField = element.getAttribute('data-product-field-alt');
        if (altField && element.tagName === 'IMG') {
          const altValue = product[altField] || product.name || element.alt;
          element.alt = altValue;
        }
      }
    } else if (fieldType === 'href') {
      // For links, set href attribute
      if (element.tagName === 'A') {
        if (value && value.trim() !== '') {
          element.href = value;
        } else {
          // If link is empty, remove href or make it non-clickable
          element.href = '#';
          element.style.pointerEvents = 'none';
          element.style.cursor = 'default';
        }
      }
    } else if (fieldName === 'allergens') {
      // Special handling for allergens list
      if (Array.isArray(value)) {
        element.innerHTML = value.map(allergen => `<li>${allergen}</li>`).join('');
      }
    } else if (fieldName === 'composition') {
      // Special handling for composition - split by comma but preserve commas inside parentheses
      if (typeof value === 'string') {
        const ingredients = [];
        let currentIngredient = '';
        let parenLevel = 0;
        
        for (let i = 0; i < value.length; i++) {
          const char = value[i];
          
          if (char === '(') {
            parenLevel++;
            currentIngredient += char;
          } else if (char === ')') {
            parenLevel--;
            currentIngredient += char;
          } else if (char === ',' && parenLevel === 0) {
            // Only split on comma if we're not inside parentheses
            const trimmed = currentIngredient.trim();
            if (trimmed.length > 0) {
              ingredients.push(trimmed);
            }
            currentIngredient = '';
          } else {
            currentIngredient += char;
          }
        }
        
        // Add the last ingredient
        const trimmed = currentIngredient.trim();
        if (trimmed.length > 0) {
          ingredients.push(trimmed);
        }
        
        element.innerHTML = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
      }
    } else {
      // For text content
      element.textContent = value;
    }
  });

  // Handle hero video/image - show video if available, otherwise show image
  const heroImage = document.querySelector('.hero-image');
  const heroVideo = document.querySelector('.hero-video');
  
  if (product.video && heroVideo && heroImage) {
    // Show video, hide image
    heroVideo.src = product.video;
    heroVideo.style.display = 'block';
    heroImage.style.display = 'none';
    heroVideo.setAttribute('aria-label', `Видео о ${product.name}`);
    // Ensure video plays automatically
    heroVideo.play().catch(err => {
      console.log('Autoplay prevented:', err);
    });
  } else if (heroVideo && heroImage) {
    // Show image, hide video
    heroVideo.style.display = 'none';
    heroImage.style.display = 'block';
  }

}

async function initProductData() {
  const data = await loadProductsData();
  if (!data) {
    console.error('Failed to load products data');
    return;
  }

  const productId = getCurrentProductId();
  currentProduct = getProductById(productId);
  
  if (currentProduct) {
    populateProductData(currentProduct);
  } else {
    console.error(`Product with id "${productId}" not found`);
  }
}

function initFeedbackForm() {
  const form = document.getElementById('feedback-form');
  if (!form) return;

  let selectedStars = 0;
  let selectedInfo = '';
  let selectedLanding = '';

  // Star rating handlers
  const starsContainer = document.getElementById('rating-stars');
  if (starsContainer) {
    const starButtons = Array.from(starsContainer.querySelectorAll('.star-button'));
    starButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = Number(btn.getAttribute('data-value')) || 0;
        selectedStars = value;
        starButtons.forEach((b) => {
          const bVal = Number(b.getAttribute('data-value')) || 0;
          const isSelected = bVal <= value;
          b.classList.toggle('is-selected', isSelected);
          b.setAttribute('aria-pressed', String(isSelected && bVal === value));
        });
      });
    });
  }

  // Single-choice groups
  function wireChoice(groupId, onChoice) {
    const container = document.getElementById(groupId);
    if (!container) return;
    const buttons = Array.from(container.querySelectorAll('.choice-button'));
    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.getAttribute('data-value') || '';
        buttons.forEach((b) => {
          const active = b === btn;
          b.classList.toggle('is-selected', active);
          b.setAttribute('aria-pressed', String(active));
        });
        onChoice(value);
      });
    });
  }

  wireChoice('choice-info', (v) => (selectedInfo = v));
  wireChoice('choice-landing', (v) => (selectedLanding = v));

  // Submit handler
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = document.getElementById('feedback-text')?.value || '';

    // Compose payload for Google Sheets
    const payload = {
      user: String(selectedStars || ''),
      'Хватило ли тебе информации обо мне и моём составе?': selectedInfo,
      'Хотел(а) бы ты, чтобы у каждого продукта был такой лендинг?': selectedLanding,
      'Есть что-то, что ты хотел(а) бы добавить или улучшить?': text,
    };

    // Basic validation
    if (!selectedStars) {
      alert('Пожалуйста, выбери оценку от 1 до 5 звёзд.');
      return;
    }
    if (!selectedInfo || !selectedLanding) {
      alert('Пожалуйста, выбери варианты ответов.');
      return;
    }
    if (!GOOGLE_APPS_SCRIPT_URL) {
      alert('Не настроен URL Google Apps Script. Сообщи ссылку, и я подключу её.');
      return;
    }

    const submitButton = document.getElementById('feedback-submit');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Отправка...';
    }

    try {
      const res = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        mode: 'no-cors',
      });
      // With no-cors we can't read status; assume success
      alert('Спасибо! Ответ отправлен.');
      form.reset();
      // clear visual selections
      document.querySelectorAll('.is-selected').forEach((el) => el.classList.remove('is-selected'));
      document.querySelectorAll('[aria-pressed]')
        .forEach((el) => el.setAttribute('aria-pressed', 'false'));
      selectedStars = 0;
      selectedInfo = '';
      selectedLanding = '';
    } catch (err) {
      console.error(err);
      alert('Не удалось отправить. Попробуй позже.');
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Отправить';
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initFeedbackForm();
  initProductData();
});