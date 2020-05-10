/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Image fader code starts here

var imageFaderPropsArray = new Array();

function getImageFaderProps(canvasid, windowid) {
    for (var i = 0; i < imageFaderPropsArray.length; i++) {
        if (imageFaderPropsArray[i].CanvasID === canvasid &&
            imageFaderPropsArray[i].WindowID === windowid) {
            return imageFaderPropsArray[i];
        }
    }
}

var imageFaderImages = new Array();

function setImageFaderImage(imageFaderProps, imgurl, image) {
    var foundControl = 0;
    for (var i = 0; i < imageFaderImages.length; i++) {
        if (imageFaderImages[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderImages[i].WindowID === imageFaderProps.WindowID) {
            foundControl = 1;
            var foundImage = 0;
            for (var j = 0; j < imageFaderImages[i].Images.length; j++) {
                if (imageFaderImages[i].Images[j].ImgURL === imgurl) {
                    foundImage = 1;
                    imageFaderImages[i].Images[j].Image = image;
                }
            }
            if (foundImage === 0) {
                imageFaderImages[i].Images.push({ ImgURL: imgurl, Image: image });
            }
        }
    }
    if (foundControl === 0) {
        imageFaderImages.push({
            CanvasID: imageFaderProps.CanvasID, WindowID: imageFaderProps.WindowID,
            Images: [{ ImgURL: imgurl, Image: image }]
        });
    }
}

function getImageFaderImage(imageFaderProps, imgurl) {
    for (var i = 0; i < imageFaderImages.length; i++) {
        if (imageFaderImages[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderImages[i].WindowID === imageFaderProps.WindowID) {
            for (var j = 0; j < imageFaderImages[i].Images.length; j++) {
                if (imageFaderImages[i].Images[j].ImgURL === imgurl) {
                    return imageFaderImages[i].Images[j].Image;
                }
            }
        }
    }
}

function getImageFaderImageByIndex(imageFaderProps, j) {
    for (var i = 0; i < imageFaderImages.length; i++) {
        if (imageFaderImages[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderImages[i].WindowID === imageFaderProps.WindowID) {
            if (i >= 0 && i < imageFaderImages[i].Images.length) {
                return imageFaderImages[i].Images[j].Image;
            }
        }
    }
}

function getImageFaderImagesCount(imageFaderProps) {
    for (var i = 0; i < imageFaderImages.length; i++) {
        if (imageFaderImages[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderImages[i].WindowID === imageFaderProps.WindowID) {
            return imageFaderImages[i].Images.length;
        }
    }
}

var imageFaderDrawingCanvasAndCtxs = new Array();

function setImageFaderDrawingCanvasAndCtx(imageFaderProps, drawingCanvas,
    drawingCanvasCtx) {
    var found = 0;
    for (var i = 0; i < imageFaderDrawingCanvasAndCtxs.length; i++) {
        if (imageFaderDrawingCanvasAndCtxs[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderDrawingCanvasAndCtxs[i].WindowID === imageFaderProps.WindowID) {
            found = 1;
            imageFaderDrawingCanvasAndCtxs[i].DrawingCanvas = drawingCanvas;
            imageFaderDrawingCanvasAndCtxs[i].DrawingCanvasCtx = drawingCanvasCtx;
        }
    }
    if (found === 0) {
        imageFaderDrawingCanvasAndCtxs.push({
            CanvasID: imageFaderProps.CanvasID, WindowID: imageFaderProps.WindowID,
            DrawingCanvas: drawingCanvas,
            DrawingCanvasCtx: drawingCanvasCtx
        });
    }
}

function getImageFaderDrawingCanvas(imageFaderProps) {
    for (var i = 0; i < imageFaderDrawingCanvasAndCtxs.length; i++) {
        if (imageFaderDrawingCanvasAndCtxs[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderDrawingCanvasAndCtxs[i].WindowID === imageFaderProps.WindowID) {
            return imageFaderDrawingCanvasAndCtxs[i].DrawingCanvas;
        }
    }
}

function getImageFaderDrawingCanvasCtx(imageFaderProps) {
    for (var i = 0; i < imageFaderDrawingCanvasAndCtxs.length; i++) {
        if (imageFaderDrawingCanvasAndCtxs[i].CanvasID === imageFaderProps.CanvasID &&
            imageFaderDrawingCanvasAndCtxs[i].WindowID === imageFaderProps.WindowID) {
            return imageFaderDrawingCanvasAndCtxs[i].DrawingCanvasCtx;
        }
    }
}

function ImageFader() { }

ImageFader.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, ImageURLs: null,
    FadeStartValue: null, FadeEndValue: null, FadeStepValue: null, HoldForTicks: null,
    ClickFunction: null,
    OverlayImages: null, ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createImageFader(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.ImageURLs, this.FadeStartValue, this.FadeEndValue, this.FadeStepValue,
            this.HoldForTicks,
            this.ClickFunction, this.OverlayImages, this.TabStopIndex);
    }
};

function createImageFader(canvasid, controlNameId, x, y, width, height, depth,
    imageURLs, fadeStartValue, fadeEndValue, fadeStepValue, holdForTicks,
    clickFunction, overlayimages, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'ImageFader');
    var drawingCanvas = document.createElement('canvas');
    drawingCanvas.width = width;
    drawingCanvas.height = height;
    var drawingCanvasCtx = drawingCanvas.getContext('2d');
    imageFaderPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, ImageURLs: imageURLs,
        FadeStartValue: fadeStartValue, FadeEndValue: fadeEndValue,
        FadeStepValue: fadeStepValue, HoldForTicks: holdForTicks,
        ClickFunction: clickFunction,
        HoldCountDown: holdForTicks, CurrentImageIndex: 0,
        CurrentGlobalAlphaValue: fadeStartValue, OverlayImages: overlayimages
    });
    setImageFaderDrawingCanvasAndCtx(getImageFaderProps(canvasid, windowid),
        drawingCanvas, drawingCanvasCtx);
    for (var i = 0; i < imageURLs.length; i++) {
        var image = new Image();
        image.onload = function () {
            invalidateRect(canvasid, null, x, y, width, height);
        };
        image.src = imageURLs[i];
        setImageFaderImage(getImageFaderProps(canvasid, windowid), imageURLs[i], image);
    }
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var imageFaderProps = getImageFaderProps(canvasid1, windowid1);
        var ctx = getImageFaderDrawingCanvasCtx(imageFaderProps);
        var realCtx = getCtx(canvasid1);
        ctx.save();
        if (imageFaderProps.HoldCountDown === 0) {
            if (imageFaderProps.CurrentGlobalAlphaValue ===
                imageFaderProps.FadeStartValue) {
                if (imageFaderProps.CurrentImageIndex + 1 >=
                    getImageFaderImagesCount(imageFaderProps)) {
                    imageFaderProps.CurrentImageIndex = 0;
                } else {
                    imageFaderProps.CurrentImageIndex++;
                }
            }
            if (imageFaderProps.CurrentGlobalAlphaValue < imageFaderProps.FadeEndValue) {
                imageFaderProps.CurrentGlobalAlphaValue += imageFaderProps.FadeStepValue;
                if (imageFaderProps.CurrentGlobalAlphaValue > 1) {
                    imageFaderProps.CurrentGlobalAlphaValue = 1;
                }
                ctx.globalAlpha = imageFaderProps.CurrentGlobalAlphaValue;
            } else {
                imageFaderProps.CurrentGlobalAlphaValue = imageFaderProps.FadeStartValue;
                ctx.globalAlpha = imageFaderProps.CurrentGlobalAlphaValue;
                imageFaderProps.HoldCountDown = imageFaderProps.HoldForTicks;
            }
            if (imageFaderProps.OverlayImages === 1 &&
                imageFaderProps.CurrentGlobalAlphaValue !== imageFaderProps.FadeEndValue) {
                var prevImageIndex = 0;
                if (imageFaderProps.CurrentImageIndex - 1 < 0) {
                    prevImageIndex = getImageFaderImagesCount(imageFaderProps) - 1;
                } else {
                    prevImageIndex = imageFaderProps.CurrentImageIndex - 1;
                }
                if (imageFaderProps.FadeEndValue - ctx.globalAlpha > 0 &&
                    imageFaderProps.FadeEndValue - ctx.globalAlpha < 1) {
                    var saveAlpha = ctx.globalAlpha;
                    ctx.globalAlpha = imageFaderProps.FadeEndValue - saveAlpha;
                    ctx.drawImage(getImageFaderImageByIndex(imageFaderProps,
                        prevImageIndex), 0, 0);
                    ctx.globalAlpha = saveAlpha;
                }
            }
            ctx.drawImage(getImageFaderImageByIndex(imageFaderProps,
                imageFaderProps.CurrentImageIndex), 0, 0);
            realCtx.drawImage(getImageFaderDrawingCanvas(imageFaderProps),
                imageFaderProps.X, imageFaderProps.Y);
        } else {
            imageFaderProps.HoldCountDown--;
            ctx.globalAlpha = imageFaderProps.FadeEndValue;
            realCtx.drawImage(getImageFaderImageByIndex(imageFaderProps,
                imageFaderProps.CurrentImageIndex), imageFaderProps.X, imageFaderProps.Y);
        }
        ctx.restore();
    }, canvasid);
    if (clickFunction) {
        registerClickFunction(windowid, function (canvasid2, windowid2, e) {
            var imageFaderProps = getImageFaderProps(canvasid2, windowid2);
            imageFaderProps.ClickFunction(canvasid2, windowid2, e,
                imageFaderProps.CurrentImageIndex);
        }, canvasid);
    }
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

