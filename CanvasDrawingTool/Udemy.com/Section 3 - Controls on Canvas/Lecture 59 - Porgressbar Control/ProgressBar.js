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

//ProgressBar Code starts here

var progressBarPropsArray = new Array();

function getProgressBarProps(canvasid, windowid) {
    for (var i = 0; i < progressBarPropsArray.length; i++) {
        if (progressBarPropsArray[i].CanvasID === canvasid &&
            progressBarPropsArray[i].WindowID === windowid) {
            return progressBarPropsArray[i];
        }
    }
}

function ProgressBar() { }

ProgressBar.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Color: null,
    MaxValue: null,
    MinValue: null, CurrentValue: null, Tag: null, ControlNameID: null, Depth: null,
    TabStopIndex: null,

    Initialize: function () {
        return createProgressBar(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth, this.Color,
            this.MaxValue, this.MinValue, this.CurrentValue, this.Tag, this.TabStopIndex);
    }
};

function createProgressBar(canvasid, controlNameId, x, y, width, height, depth, color,
    maxvalue, minvalue, currentvalue, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'ProgressBar', controlNameId, null, tabstopindex);
    progressBarPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Color: color, MaxValue: maxvalue,
        MinValue: minvalue, CurrentValue: currentvalue, Tag: tag
    });
    registerWindowDrawFunction(windowid, drawProgressBar, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function setProgressBarCurrentValue(canvasid, windowid, value) {
    var progressBarProps = getProgressBarProps(canvasid, windowid);
    progressBarProps.CurrentValue = value;
    invalidateRect(canvasid, null, progressBarProps.X, progressBarProps.Y,
        progressBarProps.Width, progressBarProps.Height);
}

function drawProgressBar(canvasid, windowid) {
    var progressBarProps = getProgressBarProps(canvasid, windowid);
    var ctx = getCtx(canvasid);
    var g = ctx.createLinearGradient(progressBarProps.X, progressBarProps.Y,
        progressBarProps.X, progressBarProps.Y + progressBarProps.Height);
    g.addColorStop(0, '#f4f5f6');
    g.addColorStop(1, '#eaeced');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(progressBarProps.X, progressBarProps.Y + 5);
    ctx.arc(progressBarProps.X + 5, progressBarProps.Y + 5, 5, Math.PI,
        Math.PI * 270 / 180, false);
    ctx.lineTo(progressBarProps.X + progressBarProps.Width - 5, progressBarProps.Y);
    ctx.arc(progressBarProps.X + progressBarProps.Width - 5,
        progressBarProps.Y + 5, 5, Math.PI * 270 / 180, Math.PI * 2, false);
    ctx.lineTo(progressBarProps.X + progressBarProps.Width,
        progressBarProps.Y + progressBarProps.Height - 5);
    ctx.arc(progressBarProps.X + progressBarProps.Width - 5,
        progressBarProps.Y + progressBarProps.Height - 5, 5, 0, Math.PI / 2, false);
    ctx.lineTo(progressBarProps.X + 5, progressBarProps.Y + progressBarProps.Height);
    ctx.arc(progressBarProps.X + 5, progressBarProps.Y +
        progressBarProps.Height - 5, 5, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#a9b2bb';
    ctx.beginPath();
    ctx.moveTo(progressBarProps.X, progressBarProps.Y + 5);
    ctx.arc(progressBarProps.X + 5, progressBarProps.Y + 5, 5,
        Math.PI, Math.PI * 270 / 180, false);
    ctx.lineTo(progressBarProps.X + progressBarProps.Width - 5, progressBarProps.Y);
    ctx.arc(progressBarProps.X + progressBarProps.Width - 5,
        progressBarProps.Y + 5, 5, Math.PI * 270 / 180, Math.PI * 2, false);
    ctx.stroke();
    ctx.strokeStyle = '#768694';
    ctx.beginPath();
    ctx.moveTo(progressBarProps.X + progressBarProps.Width, progressBarProps.Y + 5);
    ctx.lineTo(progressBarProps.X + progressBarProps.Width,
        progressBarProps.Y + progressBarProps.Height - 5);
    ctx.arc(progressBarProps.X + progressBarProps.Width - 5,
        progressBarProps.Y + progressBarProps.Height - 5, 5, 0, Math.PI / 2, false);
    ctx.moveTo(progressBarProps.X + 5, progressBarProps.Y + progressBarProps.Height);
    ctx.arc(progressBarProps.X + 5, progressBarProps.Y +
        progressBarProps.Height - 5, 5, Math.PI / 2, Math.PI, false);
    ctx.lineTo(progressBarProps.X, progressBarProps.Y + 5);
    ctx.stroke();
    ctx.strokeStyle = '#657582';
    ctx.beginPath();
    ctx.moveTo(progressBarProps.X + 5, progressBarProps.Y + progressBarProps.Height);
    ctx.lineTo(progressBarProps.X + progressBarProps.Width - 5,
        progressBarProps.Y + progressBarProps.Height);
    ctx.stroke();
    var pgwidth = (progressBarProps.CurrentValue - progressBarProps.MinValue) *
        progressBarProps.Width / (progressBarProps.MaxValue - progressBarProps.MinValue);
    var g2 = ctx.createLinearGradient(progressBarProps.X, progressBarProps.Y,
        progressBarProps.X, progressBarProps.Y + progressBarProps.Height);
    var redcomp = parseInt(progressBarProps.Color.substr(1, 2), 16);
    var greencomp = parseInt(progressBarProps.Color.substr(3, 2), 16);
    var bluecomp = parseInt(progressBarProps.Color.substr(5, 2), 16);
    g2.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
        getlowcomp(bluecomp));
    g2.addColorStop(0.5, progressBarProps.Color);
    g2.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
        gethighcomp(bluecomp));
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.moveTo(progressBarProps.X + 2, progressBarProps.Y + 7);
    ctx.arc(progressBarProps.X + 7, progressBarProps.Y + 7, 5, Math.PI,
        Math.PI * 270 / 180, false);
    ctx.lineTo(progressBarProps.X + pgwidth - 7, progressBarProps.Y + 2);
    ctx.arc(progressBarProps.X + pgwidth - 7, progressBarProps.Y + 7, 5,
        Math.PI * 270 / 180, Math.PI * 2, false);
    ctx.lineTo(progressBarProps.X + pgwidth - 2, progressBarProps.Y +
        progressBarProps.Height - 7);
    ctx.arc(progressBarProps.X + pgwidth - 7, progressBarProps.Y +
        progressBarProps.Height - 7, 5, 0, Math.PI / 2, false);
    ctx.lineTo(progressBarProps.X + 7, progressBarProps.Y + progressBarProps.Height - 2);
    ctx.arc(progressBarProps.X + 7, progressBarProps.Y + progressBarProps.Height -
        7, 5, Math.PI / 2, Math.PI, false);
    ctx.closePath();
    ctx.fill();
}

