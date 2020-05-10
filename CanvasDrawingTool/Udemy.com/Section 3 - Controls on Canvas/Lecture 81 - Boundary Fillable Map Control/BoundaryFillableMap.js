/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//BoundaryFillableMap control code starts here

var boundaryFillableMapPropsArray = new Array();

function getBoundaryFillableMapProps(canvasid, windowid) {
    for (var i = 0; i < boundaryFillableMapPropsArray.length; i++) {
        if (boundaryFillableMapPropsArray[i].CanvasID === canvasid &&
            boundaryFillableMapPropsArray[i].WindowID === windowid) {
            return boundaryFillableMapPropsArray[i];
        }
    }
}

function BoundaryFillableMap() { }

BoundaryFillableMap.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, FillPoints: null,
    ImgURL: null, Image: null, ImageWidth: null, ImageHeight: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createBoundaryFillableMap(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height,
            this.Depth, this.FillPoints, this.ImgURL, this.ImageWidth, this.ImageHeight,
            this.TabStopIndex);
    }
};

function createBoundaryFillableMap(canvasid, controlNameId, x, y, width, height,
    depth, fillpoints, imgurl, imgwidth, imgheight, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'BoundaryFillableMap', controlNameId, null, tabstopindex);
    var image = new Image();
    image.onload = function () {
        invalidateRect(canvasid, null, x, y, width, height);
    };
    image.src = imgurl;
    boundaryFillableMapPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, FillPoints: fillpoints, ImgURL: imgurl, Image: image,
        ImageWidth: imgwidth,
        ImageHeight: imgheight
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var boundaryFillableMapProps = getBoundaryFillableMapProps(canvasid1, windowid1);
        var ctxdest = getCtx(canvasid1);
        var canvas = document.createElement('canvas');
        canvas.width = boundaryFillableMapProps.ImageWidth;
        canvas.height = boundaryFillableMapProps.ImageHeight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(boundaryFillableMapProps.Image, 0, 0);
        var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < boundaryFillableMapProps.FillPoints.length; i++) {
            imgdata = fillImageData(boundaryFillableMapProps.FillPoints[i], imgdata);
        }
        ctxdest.putImageData(imgdata, boundaryFillableMapProps.X, boundaryFillableMapProps.Y);
    }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function fillImageData(fillpoints, imgdata) {
    var buff = new Array();
    buff.push([fillpoints[0], fillpoints[1]]);
    while (buff.length > 0) {
        var x = buff[buff.length - 1][0];
        var y = buff[buff.length - 1][1];
        buff.pop();
        if (imgdata.data[y * imgdata.width * 4 + x * 4] === fillpoints[6] &&
            imgdata.data[y * imgdata.width * 4 + x * 4 + 1] === fillpoints[7] &&
            imgdata.data[y * imgdata.width * 4 + x * 4 + 2] === fillpoints[8] &&
            imgdata.data[y * imgdata.width * 4 + x * 4 + 3] === fillpoints[9]) {
            imgdata.data[y * imgdata.width * 4 + x * 4] = fillpoints[10];
            imgdata.data[y * imgdata.width * 4 + x * 4 + 1] = fillpoints[11];
            imgdata.data[y * imgdata.width * 4 + x * 4 + 2] = fillpoints[12];
            imgdata.data[y * imgdata.width * 4 + x * 4 + 3] = fillpoints[13];
            if (fillpoints.length === 17 && fillpoints[14] === 0 ? x - 1 > fillpoints[15] :
                x - 1 > fillpoints[2]) {
                buff.push([x - 1, y]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 0 ? x + 1 < fillpoints[16] :
                x + 1 < fillpoints[4]) {
                buff.push([x + 1, y]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 1 ? y - 1 > fillpoints[15] :
                y - 1 > fillpoints[3]) {
                buff.push([x, y - 1]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 1 ? x - 1 > fillpoints[16] :
                y + 1 < fillpoints[5]) {
                buff.push([x, y + 1]);
            }
        }
    }
    return imgdata;
}

