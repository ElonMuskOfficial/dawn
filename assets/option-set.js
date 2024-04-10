function observeSimpleBundles(callback, interval = 150) {
  let checksRemaining = 4;

  function checkSimpleBundles() {
    if (window.SimpleBundles !== undefined || checksRemaining === 0) {
      callback(window.SimpleBundles);
    } else {
      checksRemaining--;
      setTimeout(checkSimpleBundles, interval);
    }
  }

  checkSimpleBundles();
}
document.addEventListener('DOMContentLoaded', function () {
  observeSimpleBundles(function (SimpleBundles) {
    if (SimpleBundles !== undefined) {
      console.log('SimpleBundles is:', SimpleBundles);
      runCode(SimpleBundles);
    } else {
      console.log('SimpleBundles is not available after 4 attempts.');
    }
  });
});

window.addEventListener('pageshow', function (event) {
  document.querySelectorAll('form[action*="cart/Add" i]').forEach((form) => form.reset());
});

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function runCode(simpleBundles) {
  let variantID = document.querySelector('.product-variant-id');
  console.log(variantID);
  if (!variantID) return;

  let variant_options =
    simpleBundles && !isEmptyObject(simpleBundles.productVariants)
      ? simpleBundles.productVariants[variantID.value]
      : null;

  function updateSelectedSize() {
    let select = document.querySelector(`select[name="${this.name}"]`);
    let selectedSize = this.value;
    select.value = selectedSize;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function addEventListeners(selector, className, handler) {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 0) {
      elements.forEach((element) => {
        element.addEventListener('change', function (event) {
          if (event.target.classList.contains(className)) {
            handler.call(event.target);
          }
        });
      });
    }
  }
  addEventListeners('.size-buttons', 'size-radio', updateSelectedSize);
  addEventListeners('.color-swatch', 'color-radio', updateSelectedSize);
}

function createSwatches() {}

function createRadios() {}
