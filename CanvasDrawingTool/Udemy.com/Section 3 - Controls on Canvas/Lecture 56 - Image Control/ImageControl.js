/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

"use strict";

//Image Control Code Starts Here

var imageControlPropsArray = new Array();

function getImageControlProps(canvasid, windowid) {
    for (var i = 0; i < imageControlPropsArray.length; i++) {
        if (imageControlPropsArray[i].CanvasID === canvasid &&
            imageControlPropsArray[i].WindowID === windowid) {
            return imageControlPropsArray[i];
        }
    }
}

var imageControlImages = new Array();

function setImageControlImage(imageControlProps, image) {
    var found = 0;
    for (var i = 0; i < imageControlImages.length; i++) {
        if (imageControlImages[i].CanvasID === imageControlProps.CanvasID &&
            imageControlImages[i].WindowID === imageControlProps.WindowID) {
            found = 1;
            imageControlImages[i].Image = image;
        }
    }
    if (found === 0) {
        imageControlImages.push({
            CanvasID: imageControlProps.CanvasID,
            WindowID: imageControlProps.WindowID, Image: image
        });
    }
}

function getImageControlImage(imageControlProps) {
    for (var i = 0; i < imageControlImages.length; i++) {
        if (imageControlImages[i].CanvasID === imageControlProps.CanvasID &&
            imageControlImages[i].WindowID === imageControlProps.WindowID) {
            return imageControlImages[i].Image;
        }
    }
}

function ImageControl() { }

ImageControl.prototype = {
    CanvasID: null, X: null, Y: null, Width: null,
    Height: null, ImageURL: null, ClickFunction: null, AlreadyDrawnImage: null,
    IsHyperlink: null, URL: null,
    NoBrowserHistory: null, IsNewBrowserWindow: null,
    NameOfNewBrowserWindow: null, WidthOfNewBrowserWindow: null,
    HeightOfNewBrowserWindow: null, NewBrowserWindowIsResizable: null,
    NewBrowserWindowHasScrollBars: null, NewBrowserWindowHasToolbar: null,
    NewBrowserWindowHasLocationOrURLOrAddressBox: null,
    NewBrowserWindowHasDirectoriesOrExtraButtons: null,
    NewBrowserWindowHasStatusBar: null, NewBrowserWindowHasMenuBar: null,
    NewBrowserWindowCopyHistory: null, Tag: null, Tile: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createImage(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.ImageURL, this.ClickFunction, this.Tile, this.Tag, this.IsHyperlink,
            this.URL, this.NoBrowserHistory,
            this.IsNewBrowserWindow, this.NameOfNewBrowserWindow,
            this.WidthOfNewBrowserWindow, this.HeightOfNewBrowserWindow,
            this.NewBrowserWindowIsResizable, this.NewBrowserWindowHasScrollBars,
            this.NewBrowserWindowHasToolbar,
            this.NewBrowserWindowHasLocationOrURLOrAddressBox,
            this.NewBrowserWindowHasDirectoriesOrExtraButtons,
            this.NewBrowserWindowHasStatusBar, this.NewBrowserWindowHasMenuBar,
            this.NewBrowserWindowCopyHistory, this.TabStopIndex);
    }
};

function createImage(canvasid, controlNameId, x, y, width, height, depth, imgurl,
    clickFunction, tile, tag,
    isHyperlink, url, nobrowserhistory, isnewbrowserwindow,
    nameofnewbrowserwindow, widthofnewbrowserwindow, heightofnewbrowserwindow,
    newbrowserwindowisresizable, newbrowserwindowhasscrollbars,
    newbrowserwindowhastoolbar, newbrowserwindowhaslocationorurloraddressbox,
    newbrowserwindowhasdirectoriesorextrabuttons,
    newbrowserwindowhasstatusbar, newbrowserwindowhasmenubar, newbrowserwindowcopyhistory,
    tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'Image',
        controlNameId, null, tabstopindex);
    var image = new Image();
    image.onload = function () {
        invalidateRect(canvasid, null, x, y, width, height);
    };
    imageControlPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, ImageURL: imgurl, ClickFunction: clickFunction,
        AlreadyDrawnImage: 0, IsHyperlink: isHyperlink, URL: url,
        NoBrowserHistory: nobrowserhistory, IsNewBrowserWindow: isnewbrowserwindow,
        NameOfNewBrowserWindow: nameofnewbrowserwindow,
        WidthOfNewBrowserWindow: widthofnewbrowserwindow,
        HeightOfNewBrowserWindow: heightofnewbrowserwindow,
        NewBrowserWindowIsResizable: newbrowserwindowisresizable,
        NewBrowserWindowHasScrollBars: newbrowserwindowhasscrollbars,
        NewBrowserWindowHasToolbar: newbrowserwindowhastoolbar,
        NewBrowserWindowHasLocationOrURLOrAddressBox: newbrowserwindowhaslocationorurloraddressbox,
        NewBrowserWindowHasDirectoriesOrExtraButtons: newbrowserwindowhasdirectoriesorextrabuttons,
        NewBrowserWindowHasStatusBar: newbrowserwindowhasstatusbar,
        NewBrowserWindowHasMenuBar: newbrowserwindowhasmenubar,
        NewBrowserWindowCopyHistory: newbrowserwindowcopyhistory, Tag: tag,
        Tile: tile
    });
    image.src = imgurl;
    setImageControlImage(getImageControlProps(canvasid, windowid), image);
    registerWindowDrawFunction(windowid, function (canvasid, windowid) {
        var ctx = getCtx(canvasid);
        var imageProps = getImageControlProps(canvasid, windowid);
        var image = getImageControlImage(imageProps);
        if (image && image.complete === true) {
            if (imageProps.Tile === 1) {
                var windowProps = getWindowProps(canvasid, windowid);
                if (windowProps) {
                    var tilex = Math.ceil(windowProps.Width / image.width);
                    var tiley = Math.ceil(windowProps.Height / image.height);
                    for (var ytile = 0; ytile < tiley; ytile++) {
                        for (var xtile = 0; xtile < tilex; xtile++) {
                            ctx.drawImage(image, imageProps.X + xtile * image.width,
                                imageProps.Y + ytile * image.height);
                        }
                    }
                }
            } else {
                ctx.drawImage(image, imageProps.X, imageProps.Y);
            }
        }
    }, canvasid);
    if (clickFunction !== null && clickFunction !== undefined) {
        registerClickFunction(windowid, function () {
            clickFunction(canvasid, windowid);
        }, canvasid);
    } else if (isHyperlink === 1) {
        registerClickFunction(windowid, function () {
            if (isnewbrowserwindow === 1) {
                var str = '';
                var wroteone = 0;
                if (widthofnewbrowserwindow !== null) {
                    str += 'width=' + widthofnewbrowserwindow;
                    wroteone = 1;
                }
                if (heightofnewbrowserwindow !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'height=' +
                        heightofnewbrowserwindow;
                }
                if (newbrowserwindowisresizable !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'resizable=' +
                        newbrowserwindowisresizable;
                }
                if (newbrowserwindowhasscrollbars !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'scrollbars=' +
                        newbrowserwindowhasscrollbars;
                }
                if (newbrowserwindowhastoolbar !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'toolbar=' +
                        newbrowserwindowhastoolbar;
                }
                if (newbrowserwindowhaslocationorurloraddressbox !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'location=' +
                        newbrowserwindowhaslocationorurloraddressbox;
                }
                if (newbroserwindowhasdirectoriesorextrabuttons !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'directories=' +
                        newbroserwindowhasdirectoriesorextrabuttons;
                }
                if (newbrowserwindowhasstatusbar !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'status=' +
                        newbrowserwindowhasstatusbar;
                }
                if (newbrowserwindowhasmenubar !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'menubar=' +
                        newbrowserwindowhasmenubar;
                }
                if (newbrowserwindowcopyhistory !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'copyhistory=' +
                        newbrowserwindowcopyhistory;
                }
                window.open(url, nameofnewbrowserwindow, str);
            } else {
                if (nobrowserhistory === 1) {
                    window.location.replace(url);
                } else {
                    window.location.href = url;
                }
            }
        }, canvasid);
    }
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

