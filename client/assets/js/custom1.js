$(document).ready(function () {
    $('ul.tabs').tabs({
        // swipeable: true,
        // responsiveThreshold: 1920
    });
    createDownloadingList();
});
module.exports = {

    addFileToDownload: function () {
        var file_hash = document.getElementById('file_hash_input').value;
        var saved_file_hashes = localStorage.getItem('downloading');
        if (saved_file_hashes) {
            var old_saved = saved_file_hashes.split("#");
            if (saved_file_hashes.indexOf(file_hash) !== -1) {
                return false;
            }
        }
        var new_value_for_storage = saved_file_hashes + "#" + file_hash;
        localStorage.setItem("downloading", new_value_for_storage);
        createDownloadingList();
        return false;
    },

    createDownloadingList: function () {
        var saved_file_hashes = localStorage.getItem('downloading');
        if (saved_file_hashes) {
            var old_saved = saved_file_hashes.split("#");
            document.getElementById('dowing_div').innerHTML = '';
            old_saved.forEach(function (element) {
                if (element !== 'null') {
                    createDownloadingTemplate(element);
                    broadcastFileHash(element);
                }
            })
        }
    },

    createDownloadingTemplate: function (name) {
        var template = '<div class="pink">' +
            '' +
            '                        <div class="col s4">' +
            '                            <p>File Name</p>' +
            '                        </div>' +
            '                        <div class="col s8">' +
            '                            <p>{{filename}}</p>' +
            '                        </div>' +
            '                        <div class="progress">' +
            '                            <div class="determinate" style="width: 20%"></div>' +
            '                        </div>' +
            '' +
            '                    </div>';
        Mustache.parse(template);
        var rendered = Mustache.render(template, {filename: name});
        $('#dowing_div').append(rendered);
    },

    serachForDownloadedFile: function (filehash) {
        var downloaded_file_hashes = localStorage.getItem('downloaded');
        if (downloaded_file_hashes) {
            var old_downloaded = downloaded_file_hashes.split("#");
            old_downloaded.forEach(function (element) {
                if (element === filehash) {
                    broadcastFileHashFound(element);
                }
            })
        }
    },

    checkIfDownloadRequestWasSend: function (fileHash) {
        var downloading_file_hashes = localStorage.getItem('downloading');
        if (downloading_file_hashes) {
            var old_downloading = downloading_file_hashes.split("#");
            old_downloading.forEach(function (element) {
                if (element === filehash) {
                    return true;
                }
            })
        }
        return false;
    }
};