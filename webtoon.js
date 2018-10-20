/*!

 handlebars v4.0.5

Copyright (C) 2011-2015 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

@license
*/


export function _uploadFileForHTML5(oProp) {
    var oFile = oProp.file;
    var sKey = oProp.key;
    oFile.state = this._states.PROGRESS;
    this._uploading++;
    var oXHR = new XMLHttpRequest()
      , oUpload = oXHR.upload;
    oUpload.addEventListener("progress", $.proxy(function(e) {
        if (!e.lengthComputable) {
            return
        }
        if (!this._xhr[sKey]) {
            return
        }
        oFile.loaded = e.loaded;
        oFile.rate = e.loaded && (e.loaded / oFile.size);
        this.trigger("uploadProgress", {
            oFile: oFile,
            sKey: sKey
        })
    }, this), false);
    var proxyFunc = $.proxy(function() {
        // var that = this;
        // var func = arguments.callee;
        if (oXHR.readyState !== 4) {
            setTimeout(function() {
                proxyFunc();
            }, 0);
            return
        }
        if (oXHR.status === 200) {
            this._setDoneState(sKey, oFile, "uploadLoad", oFile.size, 1, this._states.LOAD, oXHR.responseText)
        } else {
            this._setDoneState(sKey, oFile, "uploadError", 0, 0, this._states.ERROR)
        }
    }, this);
    oUpload.addEventListener("load", proxyFunc, false);
    oUpload.addEventListener("error", $.proxy(function() {
        this._setDoneState(sKey, oFile, "uploadError", 0, 0, this._states.ERROR)
    }, this), false);
    oUpload.addEventListener("abort", $.proxy(function() {
        this._setDoneState(sKey, oFile, "uploadAbort", 0, 0, this._states.NONE)
    }, this), false);
    oXHR.open("POST", this.url());
    oXHR.setRequestHeader("Cache-Control", "no-cache");
    oXHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    this._xhr[sKey] = oXHR;
    this.trigger("uploadStart", {
        oFile: oFile,
        sKey: sKey
    });
    var oFormData = new FormData();
    oFormData.append(this.option("sParamName"), oFile, oFile.name);
    oXHR.send(oFormData);
    return true
}