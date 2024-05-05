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
