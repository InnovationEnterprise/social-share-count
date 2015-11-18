var total_shares = {

  // Setup
  //url: window.location.href,
  url: 'https://www.google.com',
  dom_node: document.getElementById('test'),
  total: 0,
  incrementor: 0,
  networks: [],

  get_shares: function(count) {
    // Add all the network functions to the networks array
    this.networks.push(this.twitter);
    this.networks.push(this.facebook);
    this.networks.push(this.linkedin);
    this.networks.push(this.gplus);
    this.networks.push(this.buffer);

    // Reference total_shares
    var that = this;

    // Call the specific functions for each network
    for(var i = 0, ii = this.networks.length; i < ii; i++) {
      this.networks[i](this.url, function(count) {
        // Update the total of shares
        update_total(count, that.incrementor++);
      });
    }

    function update_total(count, increment) {
      that.total += count;

      if(that.incrementor === that.networks.length) {
        that.dom_node.textContent = that.total;
      }
    }

    //return totalAmountOfShares;
  },

  /********
   *
   * GET THE RESPONSE FROM EACH NETWORK
   *
   ********/
  // Twitter
  twitter: function(url, callback) {
    jQuery.ajax({

      type: 'GET',
      dataType: 'jsonp',
      url: 'https://cdn.api.twitter.com/1/urls/count.json',
      data: {'url': url}
    })
    .done(function(data) { callback(data.count); })
    .fail(function(data) { callback(0); });
  },

  // Facebook
  // Has CORS enabled so can use XHR
  facebook: function(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'json',
      url: 'https://graph.facebook.com/',
      data: {'id': url}
    })
    .done(function(data) { callback(data.shares); })
    .fail(function(data) { callback(0); });
  },

  // LinkedIn
  linkedin: function(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://www.linkedin.com/countserv/count/share',
      data: {'url': url, 'format': 'jsonp'}
    })
    .done(function(data) { callback(data.count); })
    .fail(function(data) { callback(0); });
  },

  // Google Plus
  gplus: function(url, callback) {
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
  },

  // Buffer
  buffer: function(url, callback) {
    jQuery.ajax({
      type: 'GET',
      dataType: 'jsonp',
      url: 'https://api.bufferapp.com/1/links/shares.json',
      data: {'url': url}
    })
    .done(function(data) { callback(data.shares); })
    .fail(function(data) { callback(0); });
  }
}

total_shares.get_shares();
