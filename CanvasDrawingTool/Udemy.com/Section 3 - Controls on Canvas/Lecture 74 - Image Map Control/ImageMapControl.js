/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//ImageMap Control code starts here

var imageMapPropsArray = new Array();

function getImageMapProps(canvasid, windowid) {
    for (var i = 0; i < imageMapPropsArray.length; i++) {
        if (imageMapPropsArray[i].CanvasID === canvasid &&
            imageMapPropsArray[i].WindowID === windowid) {
            return imageMapPropsArray[i];
        }
    }
}

var imageMapImages = new Array();

function setImageMapImage(imageMapProps, image) {
    var found = 0;
    for (var i = 0; i < imageMapImages.length; i++) {
        if (imageMapImages[i].CanvasID === imageMapProps.CanvasID &&
            imageMapImages[i].WindowID === imageMapProps.WindowID) {
            found = 1;
            imageMapImages[i].Image = image;
        }
    }
    if (found === 0) {
        imageMapImages.push({
            CanvasID: imageMapProps.CanvasID, WindowID:
                imageMapProps.WindowID, Image: image
        });
    }
}

function getImageMapImage(imageMapProps) {
    for (var i = 0; i < imageMapImages.length; i++) {
        if (imageMapImages[i].CanvasID === imageMapProps.CanvasID &&
            imageMapImages[i].WindowID === imageMapProps.WindowID) {
            return imageMapImages[i].Image;
        }
    }
}

function ImageMapControl() { }

ImageMapControl.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null,
    ImgUrl: null, PinXYs: null, PinClickFunction: null, HasZoom: null,
    ImageTopLeftXOffset: null, ImageTopLeftYOffset: null, MovingMap: null,
    LastMovingX: null, LastMovingY: null, Scale: null, ScaleIncrementFactor: null, Tag: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createImageMapControl(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width,
            this.Height, this.Depth, this.ImgUrl, this.PinXYs, this.PinClickFunction,
            this.HasZoom,
            this.ImageTopLeftXOffset, this.ImageTopLeftYOffset, this.Scale,
            this.ScaleIncrementFactor, this.Tag, this.TabStopIndex);
    }
};

function createImageMapControl(canvasid, controlNameId, x, y, width, height, depth,
    imgurl, pinxys, pinClickFunction, hasZoom,
    imagetopleftxoffset, imagetopleftyoffset, scale, scaleincrementfactor, tag,
    tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'ImageMap',
        controlNameId, null, tabstopindex);
    var image = new Image();
    image.src = imgurl;
    image.onload = function () {
        invalidateRect(canvasid, null, x, y, width, height);
    };
    imageMapPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width, Height: height,
        ImgUrl: imgurl, PinXYs: pinxys, PinClickFunction: pinClickFunction,
        HasZoom: hasZoom,
        ImageTopLeftXOffset: imagetopleftxoffset, ImageTopLeftYOffset: imagetopleftyoffset,
        MovingMap: 0,
        LastMovingX: 0, LastMovingY: 0, Scale: scale,
        ScaleIncrementFactor: scaleincrementfactor, Tag: tag
    });
    setImageMapImage(getImageMapProps(canvasid, windowid), image);
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var imageMapProps = getImageMapProps(canvasid1, windowid1);
        var image = getImageMapImage(imageMapProps);
        var ctx = getCtx(canvasid1);
        ctx.save();
        ctx.drawImage(image, imageMapProps.ImageTopLeftXOffset,
            imageMapProps.ImageTopLeftYOffset,
            imageMapProps.Width / imageMapProps.Scale,
            imageMapProps.Height / imageMapProps.Scale,
            imageMapProps.X, imageMapProps.Y, imageMapProps.Width, imageMapProps.Height);
        for (var i = 0; i < imageMapProps.PinXYs.length; i++) {
            if (imageMapProps.PinXYs[i][0] * imageMapProps.Scale >
                imageMapProps.ImageTopLeftXOffset * imageMapProps.Scale &&
                imageMapProps.PinXYs[i][0] * imageMapProps.Scale <
                imageMapProps.ImageTopLeftXOffset * imageMapProps.Scale +
                imageMapProps.Width * imageMapProps.Scale && imageMapProps.PinXYs[i][1] *
                imageMapProps.Scale >
                imageMapProps.ImageTopLeftYOffset * imageMapProps.Scale &&
                imageMapProps.PinXYs[i][1] * imageMapProps.Scale <
                imageMapProps.ImageTopLeftYOffset * imageMapProps.Scale +
                imageMapProps.Height * imageMapProps.Scale) {
                var g = ctx.createRadialGradient(imageMapProps.X +
                    imageMapProps.PinXYs[i][0] * imageMapProps.Scale -
                    imageMapProps.ImageTopLeftXOffset * imageMapProps.Scale,
                    imageMapProps.Y + imageMapProps.PinXYs[i][1] * imageMapProps.Scale -
                    imageMapProps.ImageTopLeftYOffset * imageMapProps.Scale, 0,
                    imageMapProps.X + imageMapProps.PinXYs[i][0] * imageMapProps.Scale -
                    imageMapProps.ImageTopLeftXOffset * imageMapProps.Scale,
                    imageMapProps.Y + imageMapProps.PinXYs[i][1] * imageMapProps.Scale -
                    imageMapProps.ImageTopLeftYOffset * imageMapProps.Scale,
                    imageMapProps.PinXYs[i][2]);
                var redcomp = parseInt(imageMapProps.PinXYs[i][3].substr(1, 2), 16);
                var greencomp = parseInt(imageMapProps.PinXYs[i][3].substr(3, 2), 16);
                var bluecomp = parseInt(imageMapProps.PinXYs[i][3].substr(5, 2), 16);
                g.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
                    getlowcomp(bluecomp));
                g.addColorStop(0.5, imageMapProps.PinXYs[i][3]);
                g.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
                    gethighcomp(bluecomp));
                ctx.fillStyle = g;
                ctx.beginPath();
                ctx.arc(imageMapProps.X + imageMapProps.PinXYs[i][0] *
                    imageMapProps.Scale - imageMapProps.ImageTopLeftXOffset *
                        imageMapProps.Scale,
                    imageMapProps.Y + imageMapProps.PinXYs[i][1] * imageMapProps.Scale -
                    imageMapProps.ImageTopLeftYOffset * imageMapProps.Scale,
                    imageMapProps.PinXYs[i][2], 0, Math.PI * 2, false);
                ctx.fill();
            }
        }
        ctx.restore();
    }, canvasid);
    registerMouseDownFunction(windowid, function (canvasid2, windowid2) {
        var imageMapProps = getImageMapProps(canvasid2, windowid2);
        imageMapProps.MovingMap = 1;
    }, canvasid);
    registerLostFocusFunction(canvasid, windowid, function (canvasid3, windowid3) {
        var imageMapProps = getImageMapProps(canvasid3, windowid3);
        imageMapProps.MovingMap = 0;
    });
    registerMouseUpFunction(windowid, function (canvasid4, windowid4) {
        var imageMapProps = getImageMapProps(canvasid4, windowid4);
        imageMapProps.MovingMap = 0;
    }, canvasid);
    registerClickFunction(windowid, function (canvasid5, windowid5, e) {
        var imageMapProps = getImageMapProps(canvasid5, windowid5);
        var clickx = e.calcX;
        var clicky = e.calcY;
        for (var i = 0; i < imageMapProps.PinXYs.length; i++) {
            if (clickx > imageMapProps.X + imageMapProps.PinXYs[i][0] *
                imageMapProps.Scale - imageMapProps.ImageTopLeftXOffset *
                    imageMapProps.Scale - imageMapProps.PinXYs[i][2] &&
                clickx < imageMapProps.X + imageMapProps.PinXYs[i][0] *
                    imageMapProps.Scale - imageMapProps.ImageTopLeftXOffset *
                        imageMapProps.Scale + imageMapProps.PinXYs[i][2] &&
                clicky > imageMapProps.Y + imageMapProps.PinXYs[i][1] *
                    imageMapProps.Scale - imageMapProps.ImageTopLeftYOffset *
                        imageMapProps.Scale - imageMapProps.PinXYs[i][2] &&
                clicky < imageMapProps.Y + imageMapProps.PinXYs[i][1] *
                    imageMapProps.Scale - imageMapProps.ImageTopLeftYOffset *
                        imageMapProps.Scale + imageMapProps.PinXYs[i][2]) {
                if (imageMapProps.PinClickFunction !== null) {
                    imageMapProps.PinClickFunction(canvasid5, windowid5, i);
                }
            }
        }
    }, canvasid);
    registerMouseMoveFunction(windowid, function (canvasid6, windowid6, e) {
        var imageMapProps = getImageMapProps(canvasid6, windowid6);
        var x = e.calcX;
        var y = e.calcY;
        var image = getImageMapImage(imageMapProps);
        if (imageMapProps.MovingMap === 0) {
            imageMapProps.LastMovingX = x;
            imageMapProps.LastMovingY = y;
        } else if (imageMapProps.MovingMap === 1) {
            var deltax = x - imageMapProps.LastMovingX;
            var deltay = y - imageMapProps.LastMovingY;
            if (deltax !== 0 && imageMapProps.ImageTopLeftXOffset + deltax > 0 &&
                imageMapProps.ImageTopLeftXOffset + deltax +
                imageMapProps.Width / imageMapProps.Scale < image.width &&
                deltay !== 0 && imageMapProps.ImageTopLeftYOffset + deltay > 0 &&
                imageMapProps.ImageTopLeftYOffset + deltay + imageMapProps.Height
                    / imageMapProps.Scale < image.height) {
                imageMapProps.ImageTopLeftXOffset += deltax;
                imageMapProps.ImageTopLeftYOffset += deltay;
            }
        }
    }, canvasid);
    if (hasZoom === 1) {
        registerMouseWheelFunction(windowid, function (canvasid7, windowid7, e) {
            var imageMapProps = getImageMapProps(canvasid7, windowid7);
            var lastscale = imageMapProps.Scale;
            imageMapProps.Scale += e.wheelDelta / 120 *
                imageMapProps.ScaleIncrementFactor;
            if (imageMapProps.ImageTopLeftXOffset + imageMapProps.Width /
                imageMapProps.Scale >= image.width ||
                imageMapProps.ImageTopLeftYOffset + imageMapProps.Height /
                    imageMapProps.Scale >= image.height) {
                imageMapProps.Scale = lastscale;
            }
        }, canvasid);
    }
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

