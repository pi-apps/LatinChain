// 1. Definimos la función de callback de forma global para que Blogger pueda llamarla al cargar el script
  function procesarEntradasBlogger(data) {
    let container = document.getElementById('recent-posts-resume-list');
    if (!container) return;

    let entries = data.feed.entry || [];
    let html = '<h5 style="filter: contrast(100%) !important; background: white; color: black !important; font-size: 16px; margin: 20px 0 10px 0;">RECENT POSTS</h5>';
    container.innerHTML = html;

    for (let i = 0; i < entries.length; i++) {
      let entry = entries[i];
      let title = entry.title.$t;
      let link = '#';

      for (let j = 0; j < entry.link.length; j++) {
        if (entry.link[j].rel === 'alternate') {
          link = entry.link[j].href;
          break;
        }
      }

      let snippet = '';
      let contentHtml = '';
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

      let thumbUrl = '';
      if (entry.media$thumbnail && entry.media$thumbnail.url) {
        thumbUrl = entry.media$thumbnail.url;
      } else if (contentHtml) {
        var imgMatch = contentHtml.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch) {
          thumbUrl = imgMatch[1];
        }
      }

      // Función interna para el banner A-Ads
      function createAadsBanner() {
        let adWrapper = document.createElement('div');
        /*adWrapper.classList.add('frame');
        adWrapper.style.cssText = 'width: 100%; margin: auto; position: relative; z-index: 99998;';

        let iframe = document.createElement('iframe');
        iframe.setAttribute('data-aa', '2458109');
        iframe.src = '//acceptable.a-ads.com/2458109/?size=Adaptive';
        iframe.style.border = '0';
        iframe.style.padding = '0';
        iframe.style.width = '100%';
        iframe.style.height = 'auto';
        iframe.style.overflow = 'hidden';
        iframe.style.display = 'block';
        iframe.style.margin = 'auto';

        adWrapper.appendChild(iframe);*/
        return adWrapper;
      }

      // 1. Crear el elemento <article> principal
      let article = document.createElement('article');
      article.className = 'post';
      article.setAttribute('role', 'article');
      article.style.cssText = 'filter: contrast(100%) !important; background: white; margin-bottom: 16px; box-sizing: border-box; width: 100%; word-break: break-word;';

      // 2. Comentario: Ad before post
      article.appendChild(document.createComment(' Ad before post '));

      // 3. Contenedor de anuncios (Antes)
      /*let adBefore = document.createElement('div');
      adBefore.className = 'ads-antes-body';
      adBefore.style.cssText = 'filter: contrast(100%) !important; margin-bottom: 5px; text-align: center; width: 100%; box-sizing: border-box; min-height: 250px;';
      
      adBefore.appendChild(createAadsBanner());

      let ins1 = document.createElement('ins');
      ins1.className = 'adsbygoogle';
      ins1.setAttribute('data-ad-client', 'ca-pub-2334449220276386');
      ins1.setAttribute('data-ad-format', 'auto');
      ins1.setAttribute('data-ad-slot', '9525388880');
      ins1.setAttribute('data-full-width-responsive', 'true');
      ins1.style.display = 'block';
      adBefore.appendChild(ins1);

      article.appendChild(adBefore);*/

      // 4. Título del post (<h3>) con su enlace (<a>)
        let h3 = document.createElement('h3');
        h3.className = 'post-title';
        h3.style.cssText = 'filter: contrast(100%) !important; font: bold 20px Roboto, sans-serif; margin: 8px; float: none; width: 100%; clear: both; word-break: break-word;';

        let titleLink = document.createElement('a');
        titleLink.href = link;
        titleLink.style.cssText = 'filter: contrast(100%) !important; color: #212121 !important; text-decoration: none;';
        titleLink.textContent = title;
        h3.appendChild(titleLink);
        article.appendChild(h3);

        // 5. Miniatura (si thumbUrl existe)
        if (thumbUrl) {
            let thumbDiv = document.createElement('div');
            thumbDiv.className = 'snippet-thumbnail';
            thumbDiv.style.cssText = 'filter: contrast(100%) !important; float: left; margin: 8px; max-height: 128px; max-width: 128px;';

            let img = document.createElement('img');
            img.src = thumbUrl;
            img.style.cssText = 'filter: contrast(100%) !important; max-width: 100%; height: auto; display: block;';
            
            thumbDiv.appendChild(img);
            article.appendChild(thumbDiv);
        }

        // 6. Snippet del post
        let snippetDiv = document.createElement('div');
        snippetDiv.className = 'post-snippet';
        snippetDiv.style.cssText = 'filter: contrast(100%) !important; color: #757575; font-size: 15px; line-height: 1.6em; margin: 8px; clear: none; word-break: break-word;';
        snippetDiv.textContent = snippet;
        article.appendChild(snippetDiv);

        // 7. Enlace "READ MORE"
        let readMoreWrapper = document.createElement('div');
        readMoreWrapper.style.cssText = 'filter: contrast(100%) !important; margin: 8px; clear: both;';

        let readMoreLink = document.createElement('a');
        readMoreLink.href = link;
        readMoreLink.style.cssText = 'filter: contrast(100%) !important; color: #2196f3 !important; text-decoration: none; font-weight: bold;';
        readMoreLink.textContent = 'READ MORE';

      readMoreWrapper.appendChild(readMoreLink);
      article.appendChild(readMoreWrapper);

      // 8. Div limpiador (clear)
      let clearDiv1 = document.createElement('div');
      clearDiv1.style.cssText = 'filter: contrast(100%) !important; clear: both;';
      article.appendChild(clearDiv1);

      // 9. Comentario: Ad after post
      article.appendChild(document.createComment(' Ad after post '));

      // 10. Contenedor de anuncios (Después)
      /*let adAfter = document.createElement('div');
      adAfter.className = 'ads-despues-body';
      adAfter.style.cssText = 'filter: contrast(100%) !important; margin-bottom: 5px; text-align: center; width: 100%; box-sizing: border-box; min-height: 250px;';
      
      adAfter.appendChild(createAadsBanner());

      /*let ins2 = document.createElement('ins');
      ins2.className = 'adsbygoogle';
      ins2.setAttribute('data-ad-client', 'ca-pub-2334449220276386');
      ins2.setAttribute('data-ad-format', 'auto');
      ins2.setAttribute('data-ad-slot', '9525388880');
      ins2.setAttribute('data-full-width-responsive', 'true');
      ins2.style.display = 'block';
      adAfter.appendChild(ins2);

      article.appendChild(adAfter);*/

      // 11. Agregar artículo al contenedor principal
      container.appendChild(article);
    }

    // --- INICIALIZAR ADSENSE ---
    let insElements = container.querySelectorAll('.adsbygoogle');
    for (let k = 0; k < insElements.length; k++) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error(e);
      }
    }
  }

  // 2. Cargamos el feed dinámicamente mediante una etiqueta script utilizando `alt=json-in-script`
  document.addEventListener("DOMContentLoaded", function() {
    let script = document.createElement('script');
    script.src = 'https://news.latin-chain.com/feeds/posts/default?alt=json-in-script&max-results=10&callback=procesarEntradasBlogger';
    script.onerror = function() {
      console.error('Error al cargar los posts recientes desde el feed.');
    };
    document.body.appendChild(script);
  });
