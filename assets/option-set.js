function observeSimpleBundles(callback, interval = 150) {
  let checksRemaining = 4;

  function checkSimpleBundles() {
    if (window.SimpleBundles !== undefined || checksRemaining === 0) {
      console.log(checksRemaining);
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

function runCode(simpleBundles) {
  let variantID = document.querySelector('.product-variant-id');
  console.log(variantID);
  if (!variantID) return;
  let variant_options =
    simpleBundles && simpleBundles?.productVariants ? simpleBundles?.productVariants[variantID.value] : null;

  function updateSelectedSize() {
    let select = document.querySelector(`select[name="${this.name}"]`);
    let selectedSize = this.value;
    select.value = selectedSize;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  let sizeRadiosContainer = document.querySelectorAll('.size-buttons');
  if (sizeRadiosContainer) {
    sizeRadiosContainer.forEach((sizeRadio) => {
      sizeRadio.addEventListener('change', function (event) {
        if (event.target.classList.contains('size-radio')) {
          updateSelectedSize.call(event.target);
        }
      });
    });
  }
  let colorRadios = document.querySelectorAll('.color-swatch');
  if (colorRadios) {
    colorRadios.forEach((colorRadio) => {
      colorRadio.addEventListener('change', function (event) {
        if (event.target.classList.contains('color-radio')) {
          updateSelectedSize.call(event.target);
        }
      });
    });
  }
}
