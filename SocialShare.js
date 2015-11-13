/*
    SocialShare - jQuery plugin
*/
(function ($) {

    function get_class_list(elem){
        if(elem.classList){
            return elem.classList;
        }else{
            return $(elem).attr('class').match(/\S+/gi);
        }
    }


    $.fn.ShareCounter = function(options){
        var defaults = {
            url: window.location.href,
            class_prefix: 'c_',
            display_counter_from: 0
        };

        var options = $.extend({}, defaults, options);

        var class_prefix_length = options.class_prefix.length

        var social = {
            'twitter': twitter,
            'facebook': facebook,
            'linkedin': linkedin,
            'plus': plus,
            'buffer': buffer
        }

        this.each(function(i, elem){
            var classlist = get_class_list(elem);
            for(var i = 0; i < classlist.length; i++){
                var cls = classlist[i];
                // if the first 2 chars in the class are 'c_' and the rest of the class is in social
                if(cls.substr(0, class_prefix_length) == options.class_prefix && social[cls.substr(class_prefix_length)]){
                    // call the function with the same name as the network
                    social[cls.substr(class_prefix_length)](options.url, function(count){
                        if (count >= options.display_counter_from){
                            $(elem).text(count);
                        }
                    })
                }
            }
        });

        function twitter(url, callback){
            $.ajax({
                type : 'GET',
                dataType : 'jsonp',
                url : 'https://cdn.api.twitter.com/1/urls/count.json',
                data : {'url': url}
            })
            .done(function(data){callback(data.count);})
            .fail(function(data){callback(0);})
        }

        function facebook(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://api.facebook.com/restserver.php',
                data: {'method': 'links.getStats', 'urls': [url], 'format': 'json'}
            })
            .done(function (data){callback(data[0].share_count)})
            .fail(function(){callback(0);})
        }

        function linkedin(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://www.linkedin.com/countserv/count/share',
                data: {'url': url, 'format': 'jsonp'}
            })
            .done(function(data){callback(data.count)})
            .fail(function(){callback(0)})
        }

        function buffer(url, callback){
            $.ajax({
                type: 'GET',
                dataType: 'jsonp',
                url: 'https://api.bufferapp.com/1/links/shares.json',
                data: {'url': url}
            })
            .done(function(data){callback(data.shares);})
            .fail(function(data){callback(0);})
        }

        function plus(url, callback){
            $.ajax({
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
            .done(function(data){callback(data.result.metadata.globalCounts.count)})
            .fail(function(){callback(0)})

        }

    }

})(jQuery);
