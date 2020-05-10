/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Image slider code starts here

var imageSliderPropsArray = new Array();

function getImageSliderProps(canvasid, windowid) {
    for (var i = 0; i < imageSliderPropsArray.length; i++) {
        if (imageSliderPropsArray[i].CanvasID === canvasid &&
            imageSliderPropsArray[i].WindowID === windowid) {
            return imageSliderPropsArray[i];
        }
    }
}

var imageSliderImages = new Array();

function setImageSliderImage(imageSliderProps, imgurl, image) {
    var foundControl = 0;
    for (var i = 0; i < imageSliderImages.length; i++) {
        if (imageSliderImages[i].CanvasID === imageSliderProps.CanvasID &&
            imageSliderImages[i].WindowID === imageSliderProps.WindowID) {
            foundControl = 1;
            var foundImage = 0;
            for (var j = 0; j < imageSliderImages[i].Images.length; j++) {
                if (imageSliderImages[i].Images[j].ImgURL === imgurl) {
                    foundImage = 1;
                    imageSliderImages[i].Images[j].Image = image;
                }
            }
            if (foundImage === 0) {
                imageSliderImages[i].Images.push({ ImgURL: imgurl, Image: image });
            }
        }
    }
    if (foundControl === 0) {
        imageSliderImages.push({
            CanvasID: imageSliderProps.CanvasID, WindowID: imageSliderProps.WindowID,
            Images: [{ ImgURL: imgurl, Image: image }]
        });
    }
}

function getImageSliderImage(imageSliderProps, imgurl) {
    for (var i = 0; i < imageSliderImages.length; i++) {
        if (imageSliderImages[i].CanvasID === imageSliderProps.CanvasID &&
            imageSliderImages[i].WindowID === imageSliderProps.WindowID) {
            for (var j = 0; j < imageSliderImages[i].Images.length; j++) {
                if (imageSliderImages[i].Images[j].ImgURL === imgurl) {
                    return imageSliderImages[i].Images[j].Image;
                }
            }
        }
    }
}

function getImageSliderImageByIndex(imageSliderProps, index) {
    for (var i = 0; i < imageSliderImages.length; i++) {
        if (imageSliderImages[i].CanvasID === imageSliderProps.CanvasID &&
            imageSliderImages[i].WindowID === imageSliderProps.WindowID) {
            if (index >= 0 && index < imageSliderImages[i].Images.length) {
                return imageSliderImages[i].Images[index].Image;
            }
        }
    }
}

function ImageSlider() { }

ImageSlider.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, ImageURLs: null,
    Direction: null, StepIncrement: null, ClickFunction: null, HoldForTicks: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createImageSlider(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height,
            this.Depth, this.ImageURLs, this.Direction, this.StepIncrement,
            this.HoldForTicks, this.ClickFunction, this.TabStopIndex);
    }
};

function createImageSlider(canvasid, controlNameId, x, y, width, height, depth,
    imageURLs, direction, stepIncrement, holdForTicks, clickFunction,
    tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'ImageSlider');
    imageSliderPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, ImageURLs: imageURLs,
        Direction: direction, StepIncrement: stepIncrement,
        ClickFunction: clickFunction, HoldForTicks: holdForTicks,
        CurrentImageIndex: 0,
        Slide: 0, HoldCountDown: holdForTicks
    });
    for (var i = 0; i < imageURLs.length; i++) {
        var image = new Image();
        image.onload = function () {
            invalidateRect(canvasid, null, x, y, width, height);
        };
        image.src = imageURLs[i];
        setImageSliderImage(getImageSliderProps(canvasid, windowid), imageURLs[i], image);
    }
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var imageSliderProps = getImageSliderProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        if (imageSliderProps.HoldCountDown === 0) {
            imageSliderProps.Slide += imageSliderProps.StepIncrement;
            if (imageSliderProps.Direction === 1) {
                if (Math.abs(imageSliderProps.Slide) >= imageSliderProps.Width) {
                    imageSliderProps.HoldCountDown = imageSliderProps.HoldForTicks;
                    if (imageSliderProps.Slide > 0) {
                        if (imageSliderProps.CurrentImageIndex === 0) {
                            imageSliderProps.CurrentImageIndex =
                                imageSliderProps.ImageURLs.length - 1;
                        } else {
                            imageSliderProps.CurrentImageIndex--;
                        }
                    } else if (imageSliderProps.Slide < 0) {
                        if (imageSliderProps.CurrentImageIndex + 1 <
                            imageSliderProps.ImageURLs.length) {
                            imageSliderProps.CurrentImageIndex++;
                        } else {
                            imageSliderProps.CurrentImageIndex = 0;
                        }
                    }
                    imageSliderProps.Slide = 0;
                    imageSliderProps.HoldCountDown = imageSliderProps.HoldForTicks;
                    ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                        imageSliderProps.CurrentImageIndex), imageSliderProps.X,
                        imageSliderProps.Y);
                } else {
                    if (imageSliderProps.Slide > 0) {
                        var prevImageIndex;
                        if (imageSliderProps.CurrentImageIndex === 0) {
                            prevImageIndex = imageSliderProps.ImageURLs.length - 1;
                        } else {
                            prevImageIndex = imageSliderProps.CurrentImageIndex - 1;
                        }
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            prevImageIndex), imageSliderProps.X - imageSliderProps.Width +
                            imageSliderProps.Slide, imageSliderProps.Y);
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            imageSliderProps.CurrentImageIndex), imageSliderProps.X +
                            imageSliderProps.Slide, imageSliderProps.Y);
                    } else {
                        var nextImageIndex;
                        if (imageSliderProps.CurrentImageIndex + 1 <
                            imageSliderProps.ImageURLs.length) {
                            nextImageIndex = imageSliderProps.CurrentImageIndex + 1;
                        } else {
                            nextImageIndex = 0;
                        }
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            imageSliderProps.CurrentImageIndex), imageSliderProps.X +
                            imageSliderProps.Slide, imageSliderProps.Y);
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            nextImageIndex), imageSliderProps.X + imageSliderProps.Width +
                            imageSliderProps.Slide, imageSliderProps.Y);
                    }
                }
            } else {
                if (Math.abs(imageSliderProps.Slide) >= imageSliderProps.Height) {
                    imageSliderProps.HoldCountDown = imageSliderProps.HoldForTicks;
                    if (imageSliderProps.Slide > 0) {
                        if (imageSliderProps.CurrentImageIndex === 0) {
                            imageSliderProps.CurrentImageIndex =
                                imageSliderProps.ImageURLs.length - 1;
                        } else {
                            imageSliderProps.CurrentImageIndex--;
                        }
                    } else if (imageSliderProps.Slide < 0) {
                        if (imageSliderProps.CurrentImageIndex + 1 <
                            imageSliderProps.ImageURLs.length) {
                            imageSliderProps.CurrentImageIndex++;
                        } else {
                            imageSliderProps.CurrentImageIndex = 0;
                        }
                    }
                    imageSliderProps.Slide = 0;
                    imageSliderProps.HoldCountDown = imageSliderProps.HoldForTicks;
                    ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                        imageSliderProps.CurrentImageIndex), imageSliderProps.X,
                        imageSliderProps.Y);
                } else {
                    if (imageSliderProps.Slide > 0) {
                        var prevImageIndex2;
                        if (imageSliderProps.CurrentImageIndex === 0) {
                            prevImageIndex2 = imageSliderProps.ImageURLs.length - 1;
                        } else {
                            prevImageIndex2 = imageSliderProps.CurrentImageIndex - 1;
                        }
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            prevImageIndex2), imageSliderProps.X, imageSliderProps.Y -
                            imageSliderProps.Height + imageSliderProps.Slide);
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            imageSliderProps.CurrentImageIndex), imageSliderProps.X,
                            imageSliderProps.Y + imageSliderProps.Slide);
                    } else {
                        var nextImageIndex2;
                        if (imageSliderProps.CurrentImageIndex + 1 <
                            imageSliderProps.ImageURLs.length) {
                            nextImageIndex2 = imageSliderProps.CurrentImageIndex + 1;
                        } else {
                            nextImageIndex2 = 0;
                        }
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            imageSliderProps.CurrentImageIndex), imageSliderProps.X,
                            imageSliderProps.Y + imageSliderProps.Slide);
                        ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                            nextImageIndex2), imageSliderProps.X, imageSliderProps.Y +
                            imageSliderProps.Height + imageSliderProps.Slide);
                    }
                }
            }
        } else {
            imageSliderProps.HoldCountDown--;
            ctx.drawImage(getImageSliderImageByIndex(imageSliderProps,
                imageSliderProps.CurrentImageIndex), imageSliderProps.X,
                imageSliderProps.Y);
        }
    }, canvasid);
    if (clickFunction !== null && clickFunction !== undefined) {
        registerClickFunction(windowid, function (canvasid2, windowid2, e) {
            var imageSliderProps = getImageSliderProps(canvasid2, windowid2);
            imageSliderProps.ClickFunction(canvasid2, windowid2, e,
                imageSliderProps.CurrentImageIndex);
        }, canvasid);
    }
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

