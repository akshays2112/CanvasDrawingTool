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

//Code for Buttons starts here
var buttonPropsArray = new Array();

function getButtonProps(canvasid, windowid) {
    for (var i = 0; i < buttonPropsArray.length; i++) {
        if (buttonPropsArray[i].CanvasID === canvasid &&
            buttonPropsArray[i].WindowID === windowid) {
            return buttonPropsArray[i];
        }
    }
}

function defaultButtonDrawFunction(canvasid, windowid) {
    var buttonOffsetX = 0;
    var buttonOffsetY = 0;
    var ctx = getCtx(canvasid);
    ctx.save();
    var buttonProps = getButtonProps(canvasid, windowid);
    //Toggle the button pressed property
    if (buttonProps.IsPressed === 1) {
        buttonProps.IsPressed = 0;
        buttonOffsetX = 5;
        buttonOffsetY = 5;
    }
    //Draw according to a theme
    if (buttonProps.Theme === 1) {
        ctx.beginPath();
        ctx.moveTo(buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + buttonProps.EdgeRadius);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius,
            buttonProps.EdgeRadius, Math.PI, Math.PI * 270 / 180, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius, buttonOffsetY + buttonProps.Y);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius, buttonProps.EdgeRadius, Math.PI / 180 *
            270, Math.PI * 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius, buttonOffsetY + buttonProps.Y +
            buttonProps.Height - buttonProps.EdgeRadius, buttonProps.EdgeRadius,
            0, Math.PI / 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius, buttonProps.EdgeRadius, Math.PI / 2, Math.PI, false);
        ctx.closePath();
        var g = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y, buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + buttonProps.Height);
        g.addColorStop(0, '#536fa0');
        g.addColorStop(1, '#274580');
        ctx.fillStyle = g;
        ctx.fill();
        ctx.strokeStyle = '#1f3a73';
        ctx.stroke();
        g = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + (buttonProps.Height -
                buttonProps.TextHeight) / 2, buttonOffsetX + buttonProps.X,
                buttonOffsetY + buttonProps.Y - (buttonProps.Height -
                    buttonProps.TextHeight) / 2 + buttonProps.Height);
        g.addColorStop(0, '#fafbfc');
        g.addColorStop(1, '#dde2ea');
        ctx.fillStyle = g;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#636e7f';
        ctx.font = buttonProps.TextFontString;
        ctx.fillText(buttonProps.Text, buttonOffsetX + buttonProps.X +
            (buttonProps.Width - ctx.measureText(buttonProps.Text).width) / 2,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            (buttonProps.Height - buttonProps.TextHeight) / 2);
    } else if (buttonProps.Theme === 2) {
        var g2 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y, buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + buttonProps.Height);
        g2.addColorStop(0, '#7888ff');
        g2.addColorStop(1, '#d0d3fe');
        ctx.shadowBlur = 5;
        ctx.shadowColor = g2;
        ctx.beginPath();
        ctx.moveTo(buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + buttonProps.EdgeRadius);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius,
            buttonProps.EdgeRadius, Math.PI, Math.PI / 180 * 270, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 5, buttonOffsetY + buttonProps.Y);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 5, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius, buttonProps.EdgeRadius, Math.PI / 180 *
            270, Math.PI * 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width - 5,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius - 5);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 5, buttonOffsetY + buttonProps.Y +
            buttonProps.Height - buttonProps.EdgeRadius - 5, buttonProps.EdgeRadius,
            0, Math.PI / 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height - 5);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius - 5, buttonProps.EdgeRadius, Math.PI /
            2, Math.PI, false);
        ctx.closePath();
        g2 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + 9, buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + buttonProps.Height - 9);
        g2.addColorStop(0, '#7a83c6');
        g2.addColorStop(1, '#5787dc');
        ctx.strokeStyle = g2;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(buttonOffsetX + buttonProps.X + 1, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius + 1);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 1,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius + 1,
            buttonProps.EdgeRadius, Math.PI, Math.PI / 180 * 270, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 6, buttonOffsetY + buttonProps.Y + 1);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 6, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius + 1, buttonProps.EdgeRadius, Math.PI / 180 *
            270, Math.PI * 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width - 6,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius - 6);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 6, buttonOffsetY + buttonProps.Y +
            buttonProps.Height - buttonProps.EdgeRadius - 6,
            buttonProps.EdgeRadius, 0, Math.PI / 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 1,
            buttonOffsetY + buttonProps.Y + buttonProps.Height - 6);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 1,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius - 6, buttonProps.EdgeRadius, Math.PI /
            2, Math.PI, false);
        ctx.closePath();
        g2 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + 1, buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + buttonProps.Height - 6);
        g2.addColorStop(0, '#a0abe9');
        g2.addColorStop(1, '#80b2fb');
        ctx.strokeStyle = g2;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(buttonOffsetX + buttonProps.X + 2, buttonOffsetY +
            buttonProps.Y + buttonProps.EdgeRadius + 2);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 2,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius + 2,
            buttonProps.EdgeRadius, Math.PI, Math.PI / 180 * 270, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 7, buttonOffsetY + buttonProps.Y + 2);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 7, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius + 2, buttonProps.EdgeRadius, Math.PI /
                180 * 270, Math.PI * 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width - 7,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius - 7);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 7, buttonOffsetY + buttonProps.Y +
            buttonProps.Height - buttonProps.EdgeRadius - 7,
            buttonProps.EdgeRadius, 0, Math.PI / 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius +
            2, buttonOffsetY + buttonProps.Y + buttonProps.Height - 7);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 2,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius - 7, buttonProps.EdgeRadius, Math.PI /
            2, Math.PI, false);
        ctx.closePath();
        g2 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + 2, buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + buttonProps.Height - 7);
        g2.addColorStop(0, '#99a4e4');
        g2.addColorStop(1, '#4c7ce2');
        ctx.fillStyle = g2;
        ctx.fill();
        g2 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X, buttonOffsetY +
            buttonProps.Y + (buttonProps.Height - buttonProps.TextHeight) / 2,
            buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y - (buttonProps.Height -
                buttonProps.TextHeight) / 2 + buttonProps.Height);
        g2.addColorStop(0, '#fafbfc');
        g2.addColorStop(1, '#dde2ea');
        ctx.fillStyle = g2;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#636e7f';
        ctx.font = buttonProps.TextFontString;
        ctx.fillText(buttonProps.Text, buttonOffsetX + buttonProps.X +
            (buttonProps.Width - ctx.measureText(buttonProps.Text).width
                - 5) / 2,
            buttonOffsetY + buttonProps.Y + buttonProps.Height - 5 -
            (buttonProps.Height - buttonProps.TextHeight - 5) / 2);
    } else {
        //Draw the background of the button according to the BorderColor property
        ctx.beginPath();
        ctx.moveTo(buttonOffsetX + buttonProps.X, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius,
            buttonProps.EdgeRadius, Math.PI, Math.PI / 180 * 270, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius, buttonOffsetY + buttonProps.Y);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius, buttonProps.EdgeRadius, Math.PI / 180 *
            270, Math.PI * 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width,
            buttonOffsetY + buttonProps.Y + buttonProps.Height - buttonProps.EdgeRadius);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius, buttonOffsetY + buttonProps.Y +
            buttonProps.Height - buttonProps.EdgeRadius, buttonProps.EdgeRadius,
            0, Math.PI / 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            buttonProps.EdgeRadius, buttonProps.EdgeRadius, Math.PI /
            2, Math.PI, false);
        ctx.closePath();
        ctx.fillStyle = buttonProps.BorderColor;
        ctx.fill();
        //Liner gradient for the background
        var g3 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y, buttonOffsetX +
            buttonProps.X, buttonOffsetY + buttonProps.Y + buttonProps.Height);
        g3.addColorStop(0, buttonProps.TopColorStart);
        g3.addColorStop(1, buttonProps.TopColorEnd);
        ctx.fillStyle = g3;
        ctx.beginPath();
        ctx.rect(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius,
            buttonProps.Width - 2 * buttonProps.EdgeRadius,
            buttonProps.Height / 2 - buttonProps.EdgeRadius);
        ctx.fill();
        //Liner gradient for the background
        g3 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y, buttonOffsetX +
            buttonProps.X, buttonOffsetY + buttonProps.Y + buttonProps.Height);
        g3.addColorStop(0, buttonProps.BottomColorStart);
        g3.addColorStop(1, buttonProps.BottomColorEnd);
        ctx.fillStyle = g3;
        ctx.beginPath();
        ctx.rect(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius,
            buttonOffsetY + buttonProps.Y + buttonProps.Height / 2,
            buttonProps.Width - 2 * buttonProps.EdgeRadius,
            buttonProps.Height / 2 - buttonProps.EdgeRadius);
        ctx.fill();
        //Draw the button text
        ctx.font = buttonProps.TextFontString;
        ctx.fillStyle = buttonProps.TextColor;
        ctx.fillText(buttonProps.Text, buttonOffsetX + buttonProps.X +
            (buttonProps.Width - ctx.measureText(buttonProps.Text).width) / 2,
            buttonOffsetY + buttonProps.Y + buttonProps.Height -
            (buttonProps.Height - buttonProps.TextHeight) / 2);
    }
    //Draw a gloss on top of the button
    if (buttonProps.HasGloss === 1) {
        ctx.beginPath();
        ctx.moveTo(buttonOffsetX + buttonProps.X + 2, buttonOffsetY +
            buttonProps.Y + buttonProps.EdgeRadius + 2);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 2,
            buttonOffsetY + buttonProps.Y + buttonProps.EdgeRadius + 2,
            buttonProps.EdgeRadius, Math.PI, Math.PI / 180 * 270, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 2, buttonOffsetY + buttonProps.Y + 2);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 2, buttonOffsetY + buttonProps.Y +
            buttonProps.EdgeRadius + 2, buttonProps.EdgeRadius, Math.PI /
                180 * 270, Math.PI * 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.Width - 2,
            buttonOffsetY + buttonProps.Y + (buttonProps.Height - 4) / 2
            - buttonProps.EdgeRadius + 2);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.Width -
            buttonProps.EdgeRadius - 2, buttonOffsetY + buttonProps.Y +
            (buttonProps.Height - 4) / 2 - buttonProps.EdgeRadius + 2,
            buttonProps.EdgeRadius, 0, Math.PI / 2, false);
        ctx.lineTo(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 2,
            buttonOffsetY + buttonProps.Y + (buttonProps.Height - 4) / 2 + 2);
        ctx.arc(buttonOffsetX + buttonProps.X + buttonProps.EdgeRadius + 2,
            buttonOffsetY + buttonProps.Y + (buttonProps.Height - 4) / 2 -
            buttonProps.EdgeRadius + 2, buttonProps.EdgeRadius, Math.PI / 2,
            Math.PI, false);
        ctx.closePath();
        var g4 = ctx.createLinearGradient(buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + 2, buttonOffsetX + buttonProps.X,
            buttonOffsetY + buttonProps.Y + (buttonProps.Height - 4) / 2 + 5);
        g4.addColorStop(0, 'rgba(255,255,255,0.4)');
        g4.addColorStop(1, 'rgba(255,255,255,0.05)');
        ctx.fillStyle = g4;
        ctx.fill();
    }
    ctx.restore();
}

function Button() { }

Button.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Text: null,
    EdgeRadius: null, BottomColorStart: null, BottomColorEnd: null,
    TopColorStart: null, TopColorEnd: null, TextHeight: null, TextFontString: null,
    TextColor: null, IsPressed: 0, BorderColor: null, IsHyperlink: null, URL: null,
    NoBrowserHistory: null, IsNewBrowserWindow: null,
    NameOfNewBrowserWindow: null, WidthOfNewBrowserWindow: null,
    HeightOfNewBrowserWindow: null, NewBrowserWindowIsResizable: null,
    NewBrowserWindowHasScrollBars: null, NewBrowserWindowHasToolbar: null,
    NewBrowserWindowHasLocationOrURLOrAddressBox: null,
    NewBrowserWindowHasDirectoriesOrExtraButtons: null,
    NewBrowserWindowHasStatusBar: null, NewBrowserWindowHasMenuBar: null,
    NewBrowserWindowCopyHistory: null, Tag: null, Theme: null, HasGloss: null,
    ControlNameID: null, Depth: null, ClickFunction: null, DrawFunction: null,
    TabStopIndex: null,

    Initialize: function () {
        return createButton(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Text, this.TextColor, this.TextHeight,
            this.TextFontString, this.EdgeRadius, this.Depth, this.Theme,
            this.HasGloss, this.ClickFunction,
            this.DrawFunction, this.BottomColorStart, this.BottomColorEnd,
            this.TopColorStart, this.TopColorEnd,
            this.BorderColor, this.Tag, this.IsHyperlink, this.URL,
            this.NoBrowserHistory, this.IsNewBrowserWindow,
            this.NameOfNewBrowserWindow, this.WidthOfNewBrowserWindow,
            this.HeightOfNewBrowserWindow, this.NewBrowserWindowIsResizable,
            this.NewBrowserWindowHasScrollBars, this.NewBrowserWindowHasToolbar,
            this.NewBrowserWindowHasLocationOrURLOrAddressBox,
            this.NewBrowserWindowHasDirectoriesOrExtraButtons,
            this.NewBrowserWindowHasStatusBar, this.NewBrowserWindowHasMenuBar,
            this.NewBrowserWindowCopyHistory, this.TabStopIndex);
    }
};

function createButton(canvasid, controlNameId, x, y, width, height, text,
    textColor, textHeight, textFontString, edgeRadius, depth, theme, hasgloss,
    clickFunction, drawFunction, bottomColorStart, bottomColorEnd, topColorStart,
    topColorEnd, borderColor, tag, isHyperlink, url, nobrowserhistory,
    isnewbrowserwindow, nameofnewbrowserwindow, widthofnewbrowserwindow,
    heightofnewbrowserwindow, newbrowserwindowisresizable, newbrowserwindowhasscrollbars,
    newbrowserwindowhastoolbar, newbrowserwindowhaslocationorurloraddressbox,
    newbrowserwindowhasdirectoriesorextrabuttons,
    newbrowserwindowhasstatusbar, newbrowserwindowhasmenubar,
    newbrowserwindowcopyhistory, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'Button', controlNameId, null, tabstopindex);
    buttonPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Text: text,
        EdgeRadius: edgeRadius, BottomColorStart: bottomColorStart,
        BottomColorEnd: bottomColorEnd,
        TopColorStart: topColorStart, TopColorEnd: topColorEnd, TextHeight: textHeight,
        TextFontString: textFontString,
        TextColor: textColor, IsPressed: 0, BorderColor: borderColor,
        IsHyperlink: isHyperlink, URL: url,
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
        Theme: theme, HasGloss: hasgloss
    });
    registerClickFunction(windowid, function () {
        if (isHyperlink === 1) {
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
                window.open(url, navigator.userAgent.toLowerCase().indexOf('msie')
                    === -1 ? nameofnewbrowserwindow : nameofnewbrowserwindow.replace
                        (/ /g, ''), str);
            } else {
                if (nobrowserhistory === 1) {
                    window.location.replace(url);
                } else {
                    window.location.href = url;
                }
            }
        } else {
            getButtonProps(canvasid, windowid).IsPressed = 0;
            clickFunction(canvasid, windowid);
        }
    }, canvasid);
    registerMouseDownFunction(windowid, function (canvasid, windowid) {
        getButtonProps(canvasid, windowid).IsPressed = 1;
    }, canvasid);
    registerMouseUpFunction(canvasid, function (canvasid, windowid) {
        getButtonProps(canvasid, windowid).IsPressed = 0;
    }, canvasid);
    if (drawFunction !== null && drawFunction !== undefined)
        registerWindowDrawFunction(windowid, function () {
            drawFunction(canvasid, windowid);
        }, canvasid);
    else
        registerWindowDrawFunction(windowid, function () {
            defaultButtonDrawFunction(canvasid, windowid);
        }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}
