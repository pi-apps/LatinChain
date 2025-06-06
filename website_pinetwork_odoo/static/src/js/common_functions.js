function validateYouTubeUrl(url)
{
    if (url) {
        var regExp = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|shorts\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        var match = url.match(regExp);
        if(match) {
            return match;
        }
    }
    return false;
}

function startLatinChainSports(show_content_div)
{
    $(show_content_div).html('<iframe src="https://www.scorebat.com/embed/livescore/" frameborder="0" width="600" height="760" allowfullscreen="true" allow="autoplay; fullscreen" style="width:100%;height:760px;overflow:hidden;display:block;" class="_scorebatEmbeddedPlayer_"></iframe>');
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://www.scorebat.com/embed/embed.js?v=arrv';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'scorebat-jssdk'));
}

function startLatinChainAcademy(show_content_div)
{
    $(show_content_div).html('<iframe src="https://drive.google.com/embeddedfolderview?id=1jhETR4rv-YCA1QDApX2lhTMvo8PMQnVR#list" style="width:100%; height:600px; border:0;"></iframe>');
}

function getGeminiImage()
{
    var img_array = ["/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Buenos_Aires.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Caracas.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Los_Angeles.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Mexico_City.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Seoul.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Shanghai.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Tokyo.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Vietnam.png",
                    "/website_pinetwork_odoo/static/src/ai-images/Gemini_Generated_Image_Honduras.png"];
    
    var random_integer = Math.floor(Math.random() * 9);
    
    return img_array[random_integer];
}
