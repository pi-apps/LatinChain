document.addEventListener("DOMContentLoaded", function() {
  fetch('/feeds/posts/default?alt=json&max-results=10')
    .then(function(response) { return response.json(); })
    .then(function(data) {
      var container = document.getElementById('recent-posts-resume-list');
      var entries = data.feed.entry || [];
      var html = '';

      html += '<h5 style="color: inherit; font-size: 16px; margin: 20px 0 10px 0;">RECENT POSTS</h5>';

      for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    var title = entry.title.$t;
    var link = '#';

    for (var j = 0; j < entry.link.length; j++) {
      if (entry.link[j].rel === 'alternate') {
        link = entry.link[j].href;
        break;
      }
    }

    var snippet = '';
    var contentHtml = '';
    if (entry.summary) {
      snippet = entry.summary.$t;
    } else if (entry.content) {
      contentHtml = entry.content.$t;
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = contentHtml;
      snippet = tempDiv.textContent || tempDiv.innerText || '';
      if (snippet.length > 160) {
        snippet = snippet.substring(0, 160) + '...';
      }
    }

    var thumbUrl = '';
    if (entry.media$thumbnail && entry.media$thumbnail.url) {
      thumbUrl = entry.media$thumbnail.url;
    } else if (contentHtml) {
      var imgMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
      if (imgMatch) {
        thumbUrl = imgMatch[1];
      }
    }

    html += '<article class="post" role="article" style="background: #fff; padding: 15px; margin-bottom: 16px; box-sizing: border-box; width: 100%; word-break: break-word;">' + 
    
          '<!-- Ad before post -->' +

          '<script>atOptions = {"key": "965f52969e90286ccd9b08a873f54c8a", "format": "iframe", "height": 250, "width": 300, "params": {}};</script>' +
          '<script src="https://www.highrevenueformat.com/965f52969e90286ccd9b08a873f54c8a/invoke.js"</script>' +
          
          //'<div class="hrf-ad-container" style="margin: 15px 0; text-align: center; width: 100%;"></div>' +

          '<div class="ads-antes-body" style="margin: 15px 0; text-align: center; width: 100%; box-sizing: border-box;">' +
            '<ins class="adsbygoogle" data-ad-client="ca-pub-2334449220276386" data-ad-format="auto" data-ad-slot="9525388880" data-full-width-responsive="true" style="display:block;"></ins>' +
          '</div>' +

          '<h3 class="post-title" style="font: bold 20px Roboto, sans-serif; margin: 0 0 8px 0; float: none; width: 100%; clear: both; word-break: break-word;">' +
            '<a href="' + link + '" style="color: #212121; text-decoration: none;">' + title + '</a>' +
          '</h3>' +

          (thumbUrl ? '<div class="snippet-thumbnail" style="float: left; margin: 0 15px 10px 0; max-height: 128px; max-width: 128px;"><img src="' + thumbUrl + '" style="max-width: 100%; height: auto; display: block;" /></div>' : '') +

          '<div class="post-snippet" style="color: #757575; font-size: 15px; line-height: 1.6em; margin: 10px 0; clear: none; word-break: break-word;">' + snippet + '</div>' +
          '<div style="clear: both; margin-bottom: 10px;">' +
            '<a href="' + link + '" style="color: #2196f3; text-decoration: none; font-weight: bold;">READ MORE</a>' +
          '</div>' +

          '<div style="clear: both;"></div>' +

          '<!-- Ad after post -->' +
          
          '<script>atOptions = {"key": "965f52969e90286ccd9b08a873f54c8a", "format": "iframe", "height": 250, "width": 300, "params": {}};</script>' +
          '<script src="https://www.highrevenueformat.com/965f52969e90286ccd9b08a873f54c8a/invoke.js"</script>' +
          
          //'<div class="hrf-ad-container" style="margin: 15px 0; text-align: center; width: 100%;"></div>' +
          
          '<div class="ads-despues-body" style="margin: 15px 0; text-align: center; width: 100%; box-sizing: border-box;">' +
            '<ins class="adsbygoogle" data-ad-client="ca-pub-2334449220276386" data-ad-format="auto" data-ad-slot="9525388880" data-full-width-responsive="true" style="display:block;"></ins>' +
          '</div>' +
        '</article>';
      }

      // Inyectar el HTML completo en el contenedor
      container.innerHTML = html;

      // --- INICIALIZAR ADSENSE ---
      var insElements = container.querySelectorAll('.adsbygoogle');
      for (var k = 0; k < insElements.length; k++) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.error(e);
        }
      }
      alert("1");
    }).catch(function(err) {
      console.error('Error al cargar los posts recientes:', err);
    });
});
