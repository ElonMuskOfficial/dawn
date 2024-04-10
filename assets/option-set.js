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
  let optionSetElement = document.getElementById('option-sets');
  let variantID = document.querySelector('.product-variant-id');
  console.log(variantID);
  if (!variantID) return;

  let bundle =
    simpleBundles && !isEmptyObject(simpleBundles.productVariants)
      ? simpleBundles.productVariants[variantID.value]
      : null;
  console.log(bundle);
  generateHTML(bundle.variant_options);

  function updateSelectedSize() {
    let select = document.querySelector(`select[name="${this.name}"]`);
    let selectedSize = this.value;
    select.value = selectedSize;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function addEventListeners(selector, className, handler) {
    const elements = optionSetElement.querySelectorAll(selector);
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
  addEventListeners('.option-set.size', 'size-radio', updateSelectedSize);
  addEventListeners('.option-set.color', 'color-radio', updateSelectedSize);
}

function generateOptionHTML(option) {
  const values = option.optionValues.split(', ');

  let optionHTML = `
      <div class="option-set-label">${option.optionName}</div>
      <div class="option-set ${option.defaultOptionName.toLowerCase()}-option-set">`;

  values.forEach((value, index) => {
    optionHTML += `
        <label>
            <input 
                type="radio"
                class="${option.defaultOptionName.toLowerCase()}-radio" 
                name="properties[${option.optionName}]" 
                value="${value}" 
                ${index === 0 ? 'checked' : ''}
            >
          ${value}
        </label>`;
  });

  optionHTML += `
      </div>`;

  return optionHTML;
}

function generateHTML(data) {
  const optionSetsDiv = document.getElementById('option-sets');
  let html = '';
  data.forEach((option) => {
    html += generateOptionHTML(option);
  });

  optionSetsDiv.innerHTML = html;
}
