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
              dimension = {width:800, height:600};
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
