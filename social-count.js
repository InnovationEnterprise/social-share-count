var SocialCountsId = 1;
var SocialObjects = {};
window.SocialCounts = function(el, options) {
  if(!el) {
    return;
  }

  this.options = options || {};
  this.url = this.options.url || window.location.href;

  var thisName = this.url;
  var thisId = thisName.replace(/[^a-z0-9 ,.?!]/ig, '').replace(/\./g,'').replace('httpschannelstheinnovationenterprisecom', '');
  if (thisId.length > 20) {
    thisId = thisId.substring(0, 20);
  }
  thisId = 'a'+thisId;
  if (options.total) {
    SocialCountsId = SocialCountsId + Math.floor((Math.random() * 100) + 1);
    thisId = thisId + 'total' + SocialCountsId;
  }

  if (!SocialObjects[thisId]) {
    SocialObjects[thisId] = {
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
    SocialObjects[thisId].totalView = el;
  }

  function setShareCount(data, el, thisId) {
    SocialObjects[thisId].total = SocialObjects[thisId].total + data;
    SocialObjects[thisId].counted = SocialObjects[thisId].counted + 1;
    if (!options.total){
      el.classList.remove('is-hidden');
      el.textContent = data;
    }
    if (SocialObjects[thisId].counted === 4 && SocialObjects[thisId].totalView) {
      SocialObjects[thisId].totalView.textContent = SocialObjects[thisId].total;

    }
  }

  if (SocialObjects[thisId].counted === 4) {
    setShareCount(0, el, thisName);
  }

  SocialObjects[thisId].callAsyncCount = function(data) {
    var that = thisId;
    if (data.shares) {
      SocialObjects[that].buffer = data.shares;
      SocialObjects[that].total = SocialObjects[that].total + data.shares;
      if (SocialObjects[that].bufferContainer){
        SocialObjects[that].bufferContainer.classList.remove('is-hidden');
        SocialObjects[that].bufferContainer.textContent = data.shares;
      }
    } else if (data.count) {
      SocialObjects[that].linkedin = data.count;
      SocialObjects[that].total = SocialObjects[that].total + data.count;
      if (SocialObjects[that].linkedinContainer){
        SocialObjects[that].linkedinContainer.classList.remove('is-hidden');
        SocialObjects[that].linkedinContainer.textContent = data.count;
      }
    }
    SocialObjects[that].counted = SocialObjects[that].counted + 1;
    if (SocialObjects[that].counted === 4 && SocialObjects[that].totalView) {
      SocialObjects[that].totalView.textContent = SocialObjects[that].total;

    }
  };

  // Facebook
  // Has CORS enabled so can use XHR
  if ((el.classList.contains('socialCount-facebook') || options.total) && !SocialObjects[thisId].facebook) {
    SocialObjects[thisId].facebook = true;
    (function(url, thisId){
      var facebookRequest = new XMLHttpRequest();
      facebookRequest.open('GET', 'http://graph.facebook.com/?id=' + url, true);
      facebookRequest.onerror = function() {
        SocialObjects[thisId].facebook = 0;
        setShareCount(0, el, thisId);
      };
      facebookRequest.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.responseText);
            if(data && data.share) {
              SocialObjects[thisId].facebook = data.share.share_count;
              setShareCount(data.share.share_count, el, thisId);
            } else {
              SocialObjects[thisId].facebook = 0;
              setShareCount(0, el, thisId);
            }
          } else {
            SocialObjects[thisId].facebook = 0;
            setShareCount(0, el, thisId);
          }
        }
      };
      facebookRequest.send();
    })(thisName, thisId);
  }

  if ((el.classList.contains('socialCount-linkedin') || options.total) && !SocialObjects[thisId].linkedin) {
    SocialObjects[thisId].linkedin = 0;
    if (el.classList.contains('socialCount-linkedin')) {
      SocialObjects[thisId].linkedinContainer = el;
    }
    (function(url, thisId){
      var scriptLinkedin = document.createElement('script');
      scriptLinkedin.src = 'https://www.linkedin.com/countserv/count/share?format=jsonp&callback=SocialObjects.'+thisId+'.callAsyncCount&url=' + url;
      scriptLinkedin.onerror = function() {
        SocialObjects[thisId].linkedin = 0;
        setShareCount(0, el, thisId);
      };
      document.getElementsByTagName('head')[0].appendChild(scriptLinkedin);
    })(thisName, thisId);
  }


  // Google Plus
  if ((el.classList.contains('socialCount-gplus') || options.total) && !SocialObjects[thisId].gplus) {
    SocialObjects[thisId].gplus = 0;
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
      requestGoogle.onerror = function() {
        SocialObjects[thisId].gplus = 0;
        setShareCount(0, el, thisId);
      };
      requestGoogle.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status >= 200 && this.status < 400) {
            var data = JSON.parse(this.responseText);
            if (data.result.metadata.globalCounts.count) {
              SocialObjects[thisId].gplus = data.result.metadata.globalCounts.count;
              setShareCount(data.result.metadata.globalCounts.count, el, thisId);
            } else {
              SocialObjects[thisId].gplus = 0;
              setShareCount(0, el, thisId);
            }
          } else {
            SocialObjects[thisId].gplus = 0;
            setShareCount(0, el, thisId);
          }
        }
      };
      requestGoogle.send(thisDataGoogle);
    })(thisName, thisId);
  }

  // Buffer
  if ((el.classList.contains('socialCount-buffer') || options.total) && !SocialObjects[thisId].buffer) {
    SocialObjects[thisId].buffer = 0;
    if (el.classList.contains('socialCount-buffer')) {
      SocialObjects[thisId].bufferContainer = el;
    }
    (function(url, thisId){
      var scriptBuffer = document.createElement('script');
      scriptBuffer.src = 'https://api.bufferapp.com/1/links/shares.json?format=jsonp&callback=SocialObjects.'+thisId+'.callAsyncCount&url=' + url;
      scriptBuffer.onerror = function() {
        SocialObjects[thisId].bufferContainer = 0;
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
