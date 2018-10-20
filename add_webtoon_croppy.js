//javascript:(function(){var jsCode = document.createElement('script');jsCode.setAttribute('type','module');jsCode.setAttribute('src', 'https://knicknic.github.io/croppy/add_webtoon_croppy.js');document.body.appendChild(jsCode);}());

function receiveCroppyMessage(event) {
    // Do we trust the sender of this message?  (might be
    // different from what we originally opened, for example).
    if (event.origin !== "https://knicknic.github.io") {
        return;
    }

    let fileObjects = []
    for (let file of event.data['data']) {
        let fileItem = file['blob'];
        fileItem = fileItem.slice(0, fileItem.size, "image/jpeg");
        fileItem.name = file['name'];
        fileObjects.push(fileItem);
    }

    let fileNames = "files: "
    for(let file of fileObjects)
    {
        fileNames = fileNames + " " + file.name;
    }
    // alert("Got Call back " + fileNames);
    processFilePromise['resolve'](fileObjects);
}
window.addEventListener('message', receiveCroppyMessage, false);


var iframe = document.createElement('iframe');
// iframe.style.display = "none";
iframe.src = 'https://knicknic.github.io/croppy/webtoon_croppy.html';
document.body.appendChild(iframe);



function DoSend() {
    iframe.contentWindow.postMessage('host', '*')
}


function CreatePromiseEvent() {
    let resolver;
    let rejecter;
    let emptyPromise = new Promise((resolve, reject) => { resolver = resolve; rejecter = reject });
    emptyPromise['resolve'] = resolver;
    emptyPromise['reject'] = rejecter;
    return emptyPromise;
}

function ReadFile(file) {
    let readFile = CreatePromiseEvent();

    // read fileName & content
    let fr = new FileReader();
    fr.onload = function (txt) {
        let fileName = file.name

        let encoded_txt = txt.target.result;
        let content = new Uint8Array(encoded_txt);
        let sourceFilename = fileName

        readFile['resolve']([sourceFilename, content]);
    }
    fr.readAsArrayBuffer(file);

    return readFile;
};
// handle new images to process
var processFiles = async function (files) {
    // When the control has changed, there are new files

    let len = files.length;
    //if images
    let toProcess = []
    if (len > 0) {
        for (let fileIndex = 0; fileIndex < files.length; ++fileIndex) {
            let [fileName, content] = await ReadFile(files[fileIndex]);
            toProcess.push([fileName, content]);
        }
    }
    iframe.contentWindow.postMessage(toProcess, '*')
};

var browseButtonInstance = [];
BrowseButton.prototype._oldGetFiles = BrowseButton.prototype.getFiles
BrowseButton.prototype.getFiles = function (){
    browseButtonInstance = this;
    return this._oldGetFiles();
}

UploadQueue.prototype._oldQueue = UploadQueue.prototype._addQueue;
var processFilePromise = CreatePromiseEvent();

//update code such that only working if doing upload queue. look at elements in self
UploadQueue.prototype._addQueue = function(files) {
    var ret = true;
    var self = this;

    // do not want to convert thumbnail code
    if(this._episodeObject._episodeUploadQueue == this)
    {
        let arrayFiles = []
        for (var i = 0; i < files.length; i++) {
            arrayFiles.push(files[i]);
        }
        processFilePromise = CreatePromiseEvent();
        let process = processFiles(arrayFiles);
        processFilePromise.then(files => {
            ret = self._oldQueue(files);
            
            var fileSelect = browseButtonInstance.getFileSelect().get(0);
            fileSelect.value = "";
        });
    }
    else
    {
        ret = self._oldQueue(files);
    }
    return ret;
};


// import the webtoon code that was modified
// kept in another file due to licensing
import * as Webtoon from 'https://knicknic.github.io/croppy/webtoon.js';
UploadQueue.prototype._uploadFileForHTML5 = Webtoon._uploadFileForHTML5
