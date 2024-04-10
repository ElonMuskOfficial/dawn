!(function () {
  var e = document.querySelectorAll('form[action*="cart/Add" i]');
  console.log(window.SimpleBundles);
  function n(e, n) {
    var t = e.querySelector('input[name="properties[_bundle_selection]"]'),
      i = window.SimpleBundles.productVariants[n].variant_options_v2,
      r = window.SimpleBundles.productVariants[n].variant_options;
    if (i) {
      var a = i.map(function (n) {
        return n
          .map(function (n) {
            var t = e.querySelector('[name="properties[' + n.optionName + ']"]');
            return t ? t.value : '';
          })
          .join(' ++ ');
      });
      t.value = a.join(' <> ');
    } else if (r) {
      a = r.map(function (n) {
        var t = e.querySelector('[name="properties[' + n.optionName + ']"]');
        return t ? t.value : '';
      });
      t.value = a.join(' <> ');
    }
  }
  function t(t) {
    var i = t.querySelector('button[type="submit"], input[type="submit"]'),
      r = t.querySelector('input[name="id"], select[name="id"]'),
      a = r ? r.value : null;
    if (a && window.SimpleBundles.productVariants[a]) {
      var o = window.SimpleBundles.productVariants[a].bundle_options_selector_html,
        u = document.querySelector('[data-simple-bundles-options]');
      if (u) (u.innerHTML = ''), u.insertAdjacentHTML('afterbegin', o);
      else if (i) {
        var l = t.querySelector('[data-simple-bundles-options]');
        l && l.remove(),
          (u = document.createElement('div')).setAttribute('data-simple-bundles-options', ''),
          u.insertAdjacentHTML('afterbegin', o),
          t.insertAdjacentElement('afterbegin', u);
      }
      (u ? u.querySelectorAll('select') : []).forEach(function (t) {
        !(function (t, i) {
          e.forEach(function (e) {
            var r = e.querySelector('input[type="hidden"][name="' + t.name + '"]');
            r
              ? (r.value = t.value)
              : (((r = document.createElement('input')).type = 'hidden'),
                (r.name = t.name),
                (r.value = t.value),
                e.appendChild(r)),
              t.addEventListener('change', function () {
                (r.value = t.value), n(e, i);
              });
          });
        })(t, a);
      });
      var d = t.querySelector('input[name="properties[_bundle_selection]"]');
      d ||
        (((d = document.createElement('input')).type = 'hidden'),
        (d.name = 'properties[_bundle_selection]'),
        t.appendChild(d)),
        n(t, a);
    }
  }
  function i() {
    e.forEach(function (e) {
      t(e),
        setTimeout(() => {
          t(e);
        }, 500);
      var n = new MutationObserver(function () {
          t(e);
        }),
        i = e.querySelector('input[name="id"], select[name="id"]');
      i && n.observe(i, { attributes: !0 });
    });
  }
  document.addEventListener('DOMContentLoaded', i),
    window.addEventListener('pageshow', function (e) {
      e.persisted && i();
    });
})();
