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

//Code for labels starts here
var labelPropsArray = new Array();

function getLabelProps(canvasid, windowid) {
    for (var i = 0; i < labelPropsArray.length; i++) {
        if (labelPropsArray[i].CanvasID === canvasid &&
            labelPropsArray[i].WindowID === windowid) {
            return labelPropsArray[i];
        }
    }
}

function Label() { }

Label.prototype = {
    CanvasID: '', ControlNameID: 'l1', X: 0, Y: 0, Width: 0, Height: 0,
    Depth: 0, Text: 'Label', TextHeight: 12, TextFontString: '12pt Ariel',
    TextColor: '#000000', AutoAdjustWidth: 1, IsHyperlink: 0,
    URL: null, NoBrowserHistory: null, IsNewBrowserWindow: null,
    NameOfNewBrowserWindow: null, WidthOfNewBrowserWindow: null,
    HeightOfNewBrowserWindow: null, NewBrowserWindowIsResizable: null,
    NewBrowserWindowHasScrollBars: null, NewBrowserWindowHasToolbar: null,
    NewBrowserWindowHasLocationOrURLOrAddressBox: null,
    NewBrowserWindowHasDirectoriesOrExtraButtons: null,
    NewBrowserWindowHasStatusBar: null,
    NewBrowserWindowHasMenuBar: null, NewBrowserWindowCopyHistory: null,
    DrawFunction: null, Alignment: null, ClickFunction: null,
    BackGroundColor: null, Tag: null, TabStopIndex: null,

    Initialize: function () {
        return createLabel(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height, this.Text, this.TextColor,
            this.TextHeight, this.TextFontString, this.DrawFunction,
            this.Depth, this.Alignment, this.ClickFunction,
            this.BackGroundColor, this.AutoAdjustWidth, this.Tag,
            this.IsHyperlink, this.URL, this.NoBrowserHistory,
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



function createLabel(canvasid, controlNameId, x, y, width, height, text,
    textColor, textHeight, textFontString, drawFunction, depth,
    alignment, clickFunction, backgroundColor, autoAdjustWidth, tag,
    isHyperlink, url, nobrowserhistory, isnewbrowserwindow,
    nameofnewbrowserwindow, widthofnewbrowserwindow, heightofnewbrowserwindow,
    newbrowserwindowisresizable, newbrowserwindowhasscrollbars,
    newbrowserwindowhastoolbar, newbrowserwindowhaslocationorurloraddressbox,
    newbroserwindowhasdirectoriesorextrabuttons,
    newbrowserwindowhasstatusbar, newbrowserwindowhasmenubar,
    newbrowserwindowcopyhistory, tabstopindex) {
    //Auto adjust the width of the label control
    if (autoAdjustWidth === 1) {
        var ctx = getCtx(canvasid);
        ctx.font = textFontString;
        width = ctx.measureText(text).width;
    }
    //Create a window for the label
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'Label', controlNameId, null, tabstopindex);
    labelPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Text: text,
        TextHeight: textHeight, TextFontString: textFontString,
        TextColor: textColor, IsHyperlink: isHyperlink, URL: url,
        NoBrowserHistory: nobrowserhistory, IsNewBrowserWindow: isnewbrowserwindow,
        NameOfNewBrowserWindow: nameofnewbrowserwindow,
        WidthOfNewBrowserWindow: widthofnewbrowserwindow,
        HeightOfNewBrowserWindow: heightofnewbrowserwindow,
        NewBrowserWindowIsResizable: newbrowserwindowisresizable,
        NewBrowserWindowHasScrollBars: newbrowserwindowhasscrollbars,
        NewBrowserWindowHasToolbar: newbrowserwindowhastoolbar,
        NewBrowserWindowHasLocationOrURLOrAddressBox: newbrowserwindowhaslocationorurloraddressbox,
        NewBrowserWindowHasDirectoriesOrExtraButtons: newbroserwindowhasdirectoriesorextrabuttons,
        NewBrowserWindowHasStatusBar: newbrowserwindowhasstatusbar,
        NewBrowserWindowHasMenuBar: newbrowserwindowhasmenubar,
        NewBrowserWindowCopyHistory: newbrowserwindowcopyhistory,
        DrawFunction: drawFunction, Alignment: alignment,
        ClickFunction: clickFunction, BackGroundColor: backgroundColor, Tag: tag
    });
    //Here register a drawing function that will draw the label
    if (drawFunction !== undefined && drawFunction !== null)
        registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
            var lp = getLabelProps(canvasid1, windowid1);
            lp.DrawFunction(canvasid1, windowid1);
        }, canvasid);
    else
        registerWindowDrawFunction(windowid, function () {
            var ctx = getCtx(canvasid);
            var labelProps = getLabelProps(canvasid, windowid);
            ctx.font = labelProps.TextFontString;
            //Draw the background color if any
            if (labelProps.BackGroundColor) {
                ctx.fillStyle = labelProps.BackGroundColor;
                ctx.beginPath();
                ctx.rect(labelProps.X, labelProps.Y, labelProps.Width, labelProps.Height);
                ctx.fill();
            }
            //Draw the text with alignment if any
            ctx.fillStyle = labelProps.TextColor;
            ctx.fillText(labelProps.Text, labelProps.X +
                (labelProps.Alignment === 'center' ?
                    (labelProps.Width - ctx.measureText(labelProps.Text).width)
                        / 2 : 0), labelProps.Y + labelProps.Height -
                (labelProps.Height - labelProps.TextHeight) / 2);
        }, canvasid);
    //Register the click function
    if (clickFunction !== null && clickFunction !== undefined) {
        registerClickFunction(windowid, clickFunction, canvasid);
    } else if (isHyperlink === 1) {
        registerClickFunction(windowid, function () {
            //This logic is URL's the label can point to a URL like a hyperlink HTML element
            if (isnewbrowserwindow === 1) {
                var str = '';
                var wroteone = 0;
                if (widthofnewbrowserwindow !== null) {
                    str += 'width=' + widthofnewbrowserwindow;
                    wroteone = 1;
                }
                if (heightofnewbrowserwindow !== null) {
                    str += (wroteone === 1 ? ',' : '') + 'height=' + heightofnewbrowserwindow;
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

