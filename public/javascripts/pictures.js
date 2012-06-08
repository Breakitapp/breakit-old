pictures = [{url: 'images/_MG_3225.JPG'},{url: 'images/_MG_3247.JPG'},{url: 'images/_MG_3249.JPG'},{url: 'images/_MG_3254.JPG'},{url: 'images/_MG_3275.JPG'},{url: 'images/_MG_3295.JPG'},{url: 'images/_MG_3345.JPG'}];


module.exports.all = pictures;

module.exports.find = function(id) {
    id = parseInt(id, 10);
    var found = null;
    projectLoop: for (picture_index in pictures) {
        var project = pictures[picture_index];
        if (p.id === id) {
            found = project;
            break projectLoop;
        }
    };
    return found;
}
