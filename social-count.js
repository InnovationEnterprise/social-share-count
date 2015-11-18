;window.SocialCounts = function(el, options) {
  if(!el || !('classList' in document.createElement('a')))
    return;

  this.options = options || {};
  this.url = this.options.url || window.location.href;
  this.prefix = this.options.prefix || 'liteSocial-';

  var prefix_length = this.prefix.length;

  var networks = {
    twitter: twitter,
    facebook: facebook,
    linkedin: linkedin,
    gplus: gplus,
    buffer: buffer
  };

  // Check if the element has a class with `this.prefix` at the start of it
  // Only check the props in `classList` that are strings
  for(var key in el.classList) {
    if(typeof el.classList[key] === 'string') {
      if(el.classList[key].substr(0, prefix_length) === this.prefix) {
        // Run the function with the name that matches the rest of the class
        networks[el.classList[key].substr(prefix_length)](this.url, function(count) {
          el.textContent = count;
        });
      }
    }
  }

  /********
   *
   * HANDLE THE RESPONSE FROM EACH NETWORK
   *
   ********/
  // Twitter
  function twitter(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://cdn.api.twitter.com/1/urls/count.json',
      data: {'url': url}
    })
    .done(function(data) { callback(data.count); })
    .fail(function(data) { callback(0); });
  }

  // Facebook
  // Has CORS enabled so can use XHR
  function facebook(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'https://graph.facebook.com/',
      data: {'id': url}
    })
    .done(function(data) { callback(data.shares); })
    .fail(function(data) { callback(0); });
  }

  // LinkedIn
  function linkedin(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://www.linkedin.com/countserv/count/share',
      data: {'url': url, 'format': 'jsonp'}
    })
    .done(function(data) { callback(data.count); })
    .fail(function(data) { callback(0); });
  }

  // Google Plus
  function gplus(url, callback) {
    jQuery.ajax({
      type: 'POST',
      url: 'https://clients6.google.com/rpc',
      processData: true,
      contentType: 'application/json',
      data: JSON.stringify({
        'method': 'pos.plusones.get',
        'id': location.href,
        'params': {
          'nolog': true,
          'id': url,
          'source': 'widget',
          'userId': '@viewer',
          'groupId': '@self'
        },
        'jsonrpc': '2.0',
        'key': 'p',
        'apiVersion': 'v1'
      })
    })
    .done(function(data) { callback(data.result.metadata.globalCounts.count); })
    .fail(function(data) { callback(0); });
  }

  // Buffer
  function buffer(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://api.bufferapp.com/1/links/shares.json',
      data: {'url': url}
    })
    .done(function(data) { callback(data.shares); })
    .fail(function(data) { callback(0); });
  }
};

// E.g.
var spans = document.querySelectorAll('span');

for(var i = 0, ii = spans.length; i < ii; i++) {
  new SocialCounts(spans[i], {url: 'https://channels.theinnovationenterprise.com/articles/4-crucial-qualities-of-effective-innovation'});
}
