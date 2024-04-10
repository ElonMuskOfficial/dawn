class SimpleBundlesObserver {
  constructor(callback, interval = 150) {
    this.callback = callback;
    this.interval = interval;
    this.checksRemaining = 4;
  }

  checkSimpleBundles() {
    if (window.SimpleBundles !== undefined || this.checksRemaining === 0) {
      this.callback(window.SimpleBundles);
    } else {
      this.checksRemaining--;
      setTimeout(() => this.checkSimpleBundles(), this.interval);
    }
  }

  observe() {
    this.checkSimpleBundles();
  }
}

class FormResetter {
  resetCartForms() {
    document.querySelectorAll('form[action*="cart/Add" i]').forEach((form) => form.reset());
  }
}

class OptionSet {
  constructor(option) {
    this.option = option;
  }

  generateOptionHTML() {
    const values = this.option.optionValues.split(', ');
    let optionHTML = `
        <div class="option-set-label">${this.option.optionName}</div>
        <div class="option-set ${this.option.defaultOptionName.toLowerCase()}-option-set">`;

    values.forEach((value, index) => {
      optionHTML += `
          <label>
            <input 
              type="radio"
              class="${this.option.defaultOptionName.toLowerCase()}-radio" 
              name="properties[${this.option.optionName}]" 
              value="${value}" 
              ${index === 0 ? 'checked' : ''}
            >
            ${value}
          </label>`;
    });

    optionHTML += `</div>`;

    return optionHTML;
  }
}

class OptionSetGenerator {
  constructor(data) {
    this.data = data;
  }

  generateOptionSetsHTML() {
    let html = '';
    this.data.forEach((option) => {
      const optionSet = new OptionSet(option);
      html += optionSet.generateOptionHTML();
    });
    return html;
  }
}

class SimpleBundlesHandler {
  constructor(simpleBundles) {
    this.simpleBundles = simpleBundles;
    this.optionSetElement = document.getElementById('option-sets');
    this.variantID = document.querySelector('.product-variant-id');
  }

  runCode() {
    if (!this.variantID) return;

    const bundle =
      this.simpleBundles && !this.isEmptyObject(this.simpleBundles.productVariants)
        ? this.simpleBundles.productVariants[this.variantID.value]
        : null;

    if (bundle) {
      const generator = new OptionSetGenerator(bundle.variant_options);
      this.optionSetElement.innerHTML = generator.generateOptionSetsHTML();
      this.addEventListeners('.option-set.size', 'size-radio', this.updateSelectedSize);
      this.addEventListeners('.option-set.color', 'color-radio', this.updateSelectedSize);
    }
  }

  updateSelectedSize() {
    const select = document.querySelector(`select[name="${this.name}"]`);
    const selectedSize = this.value;
    select.value = selectedSize;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  addEventListeners(selector, className, handler) {
    const elements = this.optionSetElement.querySelectorAll(selector);
    elements.forEach((element) => {
      element.addEventListener('change', function (event) {
        console.log('CHANGED');
        if (event.target.classList.contains(className)) {
          handler.call(event.target);
        }
      });
    });
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0;
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const observer = new SimpleBundlesObserver(function (SimpleBundles) {
    if (SimpleBundles !== undefined) {
      console.log('SimpleBundles is:', SimpleBundles);
      const handler = new SimpleBundlesHandler(SimpleBundles);
      handler.runCode();
    } else {
      console.log('SimpleBundles is not available after 4 attempts.');
    }
  });
  observer.observe();
});

window.addEventListener('pageshow', function () {
  const formResetter = new FormResetter();
  formResetter.resetCartForms();
});
