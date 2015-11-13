;window.LiteSocial = function(el, options) {
  if(!el && !('classList' in document.createElement('a')))
    return;

  this.options = options || {};
  this.url = this.options.url || window.location.href;
  this.prefix = this.options.prefix || 'js-ls-';

  var prefix_length = this.prefix.length;

  var networks = {
    twitter: twitter,
    facebook: facebook,
    linkedin: linkedin,
    gplus: gplus,
    buffer: buffer
  };

  // Check if the element has a class with `this.prefix` at the start of it
  // Only check the elements in `classList` that are strings
  for(var key in el.classList) {
    if(typeof el.classList[key] === 'string') {
      if(el.classList[key].substr(0, prefix_length) === this.prefix) {
        // Run the function with the name that matches the rest of the class
        networks[el.classList[key].substr(prefix_length)]();
      }
    }
  }

  function twitter() {
    console.log('twitter');
  }

  function facebook() {
    console.log('facebook');
  }

  function linkedin() {
    console.log('linkedin');
  }

  function gplus() {
    console.log('gplus');
  }

  function buffer() {
    console.log('buffer');
  }
};

// E.g.
var spans = document.querySelectorAll('span');

for(var i = 0, ii = spans.length; i < ii; i++) {
  new LiteSocial(spans[i]);
}
