;window.SocialCountsTotal = function(el, options) {
  if(!el || !('textContent' in document.createElement('a')) || !Object.keys({1:1}).length)
    return;

  this.options = options || {};
  this.url = this.options.url || window.location.href;

  var networks = {
    twitter: twitter,
    facebook: facebook,
    linkedin: linkedin,
    gplus: gplus,
    buffer: buffer
  };

  var incrementor = 0, // Counts the async calls
      total = 0; // Total shares

  for(var network in networks) {
    if(networks.hasOwnProperty(network)) {
      networks[network](this.url, function(count) {
        // Update the total of shares
        update_total(count, incrementor++);
      });
    }
  }

  function update_total(count, increment) {
    total += count;

    if(incrementor === Object.keys(networks).length) {
      el.textContent = total;
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
new SocialCountsTotal(document.querySelector('body'), {url: 'https://www.google.com'});
