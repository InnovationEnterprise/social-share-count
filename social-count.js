;window.SocialCounts = function(el, options) {
  if(!el)
    return

  this.options = options || {};
  this.url = this.options.url || window.location.href;

  var networks = {
    twitter: twitter,
    facebook: facebook,
    linkedin: linkedin,
    gplus: gplus,
    buffer: buffer
  };

  /********
   *
   * Option 1. Display the total of all counts
   *
   ********/
  if(this.options.total) {
    if(!('textContent' in document.createElement('a')) || !Object.keys({1:1}).length)
      return;

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
  }

  /********
   *
   * Option 2. Put the count beside its respective button
   *
   ********/
  else {
    if(!('classList' in document.createElement('a')))
      return;

    this.prefix = this.options.prefix || 'socialCount-';

    var prefix_length = this.prefix.length;

    // Check if the element has a class with `this.prefix` at the start of it
    // Only check the props in `classList` that are strings
    for(var key in el.classList) {
      if(typeof el.classList[key] === 'string') {
        if(el.classList[key].substr(0, prefix_length) === this.prefix) {
          // Run the function with the name that matches the rest of the class
          networks[el.classList[key].substr(prefix_length)](this.url, function(count) {
            el.classList.remove('is-hidden');
            el.textContent = count;
          });
        }
      }
    }
  }

  /********
   *
   * Handle the response from each network
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
    .done(function(data) {
      if(data.shares) {
        callback(data.shares);
      } else {
        callback(0);
      }
    })
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

  /********
   *
   * Enhance each button so they open popups
   *
   ********/
(function(win, doc, undefined) {
  'use strict';

  if('addEventListener' in win && 'querySelectorAll' in doc && 'localStorage' in win) {
    var social = doc.querySelectorAll('.m-social'),
        social_count = social.length;

    for(var i = 0; i < social_count; i++) {
      social[i].addEventListener('click', function(e) {
        e.preventDefault();

        if(e.target) {
          var target = e.target;

          if(target.nodeName.toLowerCase() === 'img') {
            var url = target.parentNode.parentNode.href,
                dimensions;

            if(/twitter/i.test(url)) {
              dimensions = {width:550, height:430};
            } else {
              dimensions = {width:800, height:600};
            }
          }

          popup(url, dimensions);
        }
      }, false);
    }

    function popup(url, dimensions) {
      var left = (screen.width / 2) - (dimensions.width / 2);
      var top = (screen.height / 2) - (dimensions.height / 2);

      win.open(url, 'Social Share', 'menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=' + dimensions.width + ',height=430,top=' + top + ',left=' + left);
    }
  }
}(this, this.document));

  /********
   *
   * Example usage
   *
   ********/
var spans = document.querySelectorAll('span');

for(var i = 0, ii = spans.length; i < ii; i++) {
  new SocialCounts(spans[i], {url: 'https://channels.theinnovationenterprise.com/articles/4-crucial-qualities-of-effective-innovation'});
}
new SocialCounts(document.getElementById('total'), {url: 'https://channels.theinnovationenterprise.com/articles/4-crucial-qualities-of-effective-innovation', total: true});
