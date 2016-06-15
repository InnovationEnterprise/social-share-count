var SocialCountsId = 1;
window.SocialCounts = function(el, options) {
  if(!el) {
    return;
  }

  this.options = options || {};
  this.url = this.options.url || window.location.href;

  var thisName = this.url;
  var thisId = thisName.replace(/[^a-z0-9 ,.?!]/ig, '').replace(/\./g,'');
  if (options.total) {
    SocialCountsId = SocialCountsId + Math.floor((Math.random() * 100) + 1);
    thisId = thisId + 'total' + SocialCountsId;
  }
  if (!window[thisId]) {
    window[thisId] = {
      'total' : 0,
      'counted' : 0,
      'totalView' : false,
      'facebook': false,
      'gplus': false,
      'linkedin': false,
      'buffer': false
    };
  }

  if (options.total) {
    window[thisId].totalView = el;
  }

  function setShareCount(data, el, thisId) {
    window[thisId].total = window[thisId].total + data;
    window[thisId].counted = window[thisId].counted + 1;
    if (!options.total){
      el.classList.remove('is-hidden');
      el.textContent = data;
    }
    if (window[thisId].counted === 4 && window[thisId].totalView) {
      window[thisId].totalView.textContent = window[thisId].total;
      delete window[thisId];
    }
  }

  if (window[thisId].counted === 4) {
    setShareCount(0, el, thisName);
  }

  window[thisId].callAsyncCount = function(data) {
    var that = thisId;
    if (data.shares) {
      window[that].buffer = data.shares;
      window[that].total = window[that].total + data.shares;
      if (window[that].bufferContainer){
        window[that].bufferContainer.classList.remove('is-hidden');
        window[that].bufferContainer.textContent = data.shares;
      }
    } else if (data.count) {
      window[that].linkedin = data.count;
      window[that].total = window[that].total + data.count;
      if (window[that].linkedinContainer){
        window[that].linkedinContainer.classList.remove('is-hidden');
        window[that].linkedinContainer.textContent = data.count;
      }
    }
    window[that].counted = window[that].counted + 1;
    if (window[that].counted === 4 && window[that].totalView) {
      window[that].totalView.textContent = window[that].total;
      delete window[thisId];
    }
  };

  // Facebook
  // Has CORS enabled so can use XHR
  if ((el.classList.contains('socialCount-facebook') || options.total) && !window[thisId].facebook) {
    window[thisId].facebook = true;
    (function(url, thisId){
      var facebookRequest = new XMLHttpRequest();
      facebookRequest.open('GET', 'https://graph.facebook.com/?id=' + url, true);
      facebookRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.responseText);
            if (data.shares) {
              window[thisId].facebook = data.shares;
              setShareCount(data.shares, el, thisId);
            } else {
              window[thisId].facebook = 0;
              setShareCount(0, el, thisId);
            }
          } else {
            window[thisId].facebook = 0;
            setShareCount(0, el, thisId);
          }
        }
      };
      facebookRequest.send();
    })(thisName, thisId);
  }

  if ((el.classList.contains('socialCount-linkedin') || options.total) && !window[thisId].linkedin) {
    window[thisId].linkedin = 0;
    if (el.classList.contains('socialCount-linkedin')) {
      window[thisId].linkedinContainer = el;
    }
    (function(url, thisId){
      var scriptLinkedin = document.createElement('script');
      scriptLinkedin.src = 'https://www.linkedin.com/countserv/count/share?format=jsonp&callback=window.'+thisId+'.callAsyncCount&url=' + url;
      scriptLinkedin.onerror = function() {
        setShareCount(0, el, thisId);
      };
      document.getElementsByTagName('head')[0].appendChild(scriptLinkedin);
    })(thisName, thisId);
  }


  // Google Plus
  if ((el.classList.contains('socialCount-gplus') || options.total) && !window[thisId].gplus) {
    window[thisId].gplus = 0;
    (function(url, thisId){
      var requestGoogle = new XMLHttpRequest();
      requestGoogle.open('POST', 'https://clients6.google.com/rpc', true);
      requestGoogle.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      var thisDataGoogle = JSON.stringify({
        "method":"pos.plusones.get",
        "id":"p",
        "params":{
          "nolog":true,
          "id": url,
          "source":"widget",
          "userId":"@viewer",
          "groupId":"@self"
        },
        "jsonrpc":"2.0",
        "key":"p",
        "apiVersion":"v1"
      });
      requestGoogle.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.responseText);
            if (data.result.metadata.globalCounts.count) {
              window[thisId].gplus = data.result.metadata.globalCounts.count;
              setShareCount(data.result.metadata.globalCounts.count, el, thisId);
            } else {
              setShareCount(0, el, thisId);
            }
          } else {
            setShareCount(0, el, thisId);
          }
        }
      };
      requestGoogle.send(thisDataGoogle);
    })(thisName, thisId);
  }

  // Buffer
  if ((el.classList.contains('socialCount-buffer') || options.total) && !window[thisId].buffer) {
    window[thisId].buffer = 0;
    if (el.classList.contains('socialCount-buffer')) {
      window[thisId].bufferContainer = el;
    }
    (function(url, thisId){
      var scriptBuffer = document.createElement('script');
      scriptBuffer.src = 'https://api.bufferapp.com/1/links/shares.json?format=jsonp&callback=window.'+thisId+'.callAsyncCount&url=' + url;
      scriptBuffer.onerror = function() {
        setShareCount(0, el, thisId);
      };
      document.getElementsByTagName('head')[0].appendChild(scriptBuffer);
    })(thisName, thisId);
  }

};


/********
*
* Enhance each button so they open popups
*
********/
(function(win, doc, undefined) {
  'use strict';
  if('addEventListener' in window && 'querySelectorAll' in document && 'localStorage' in window) {
    var social = document.querySelectorAll('.m-social__item'),
        social_count = social.length;

    var popup = function(url, dimensions) {
      var left = (screen.width / 2) - (dimensions.width / 2);
      var top = (screen.height / 2) - (dimensions.height / 2);
      window.open(url, 'Social Share', 'menubar=no,location=yes,resizable=yes,scrollbars=yes,status=yes,width=' + dimensions.width + ',height=430,top=' + top + ',left=' + left);
    };

    for(var i = 0; i < social_count; i++) {
      social[i].addEventListener('click', function(e) {
        e.preventDefault();
        var target = e.target;
        var url = this.getElementsByTagName('a')[0].href;
        var dimensions = {width:800, height:600};
        popup(url, dimensions);
      }, false);
    }
  }

}(this, this.document));
