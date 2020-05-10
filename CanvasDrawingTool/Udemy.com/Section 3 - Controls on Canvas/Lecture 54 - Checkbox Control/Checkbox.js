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

//Checkbox code begins here

var checkboxPropsArray = new Array();

function getcheckboxProps(canvasid, windowid) {
    for (var i = 0; i < checkboxPropsArray.length; i++) {
        if (checkboxPropsArray[i].CanvasID === canvasid &&
            checkboxPropsArray[i].WindowID === windowid) {
            return checkboxPropsArray[i];
        }
    }
}

function drawCheckbox(canvasid, windowid) {
    var checkboxProps = getcheckboxProps(canvasid, windowid);
    var ctx = getCtx(canvasid);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(checkboxProps.X, checkboxProps.Y, 15, 15);
    ctx.save();
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#e3e3e3';
    ctx.strokeStyle = '#3c7fb1';
    ctx.beginPath();
    ctx.rect(checkboxProps.X, checkboxProps.Y, 15, 15);
    ctx.stroke();
    ctx.lineCap = 'round';
    if (checkboxProps.Status === 1) {
        ctx.lineWidth = 4;
        var g = ctx.createLinearGradient(checkboxProps.X, checkboxProps.Y,
            checkboxProps.X + 15, checkboxProps.Y + 15);
        g.addColorStop(0, '#abffaf');
        g.addColorStop(1, '#00ff0c');
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(checkboxProps.X + 3, checkboxProps.Y + 9);
        ctx.lineTo(checkboxProps.X + 6, checkboxProps.Y + 12);
        ctx.lineTo(checkboxProps.X + 18, checkboxProps.Y - 3);
        ctx.stroke();
    } else {
        ctx.lineWidth = 3;
        var g2 = ctx.createLinearGradient(checkboxProps.X, checkboxProps.Y,
            checkboxProps.X + 15, checkboxProps.Y + 15);
        g2.addColorStop(0, '#ff2a2a');
        g2.addColorStop(1, '#ff6b6b');
        ctx.strokeStyle = g2;
        ctx.beginPath();
        ctx.moveTo(checkboxProps.X + 4, checkboxProps.Y + 4);
        ctx.lineTo(checkboxProps.X + 11, checkboxProps.Y + 11);
        ctx.moveTo(checkboxProps.X + 11, checkboxProps.Y + 4);
        ctx.lineTo(checkboxProps.X + 4, checkboxProps.Y + 11);
        ctx.stroke();
    }
    ctx.restore();
}

function Checkbox() { }

Checkbox.prototype = {
    CanvasID: null, X: null, Y: null, Status: null, Tag: null, ControlNameID: null,
    Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createCheckbox(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Depth, this.Status, this.Tag, this.TabStopIndex);
    }
};

function createCheckbox(canvasid, controlNameId, x, y, depth, status, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, 15, 15, depth, null, 'CheckBox',
        controlNameId, null, tabstopindex);
    checkboxPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y,
        Status: status, Tag: tag
    });
    registerClickFunction(windowid, function () {
        var checkboxProps = getcheckboxProps(canvasid, windowid);
        if (checkboxProps.Status === 1) {
            checkboxProps.Status = 0;
        } else {
            checkboxProps.Status = 1;
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function () {
        drawCheckbox(canvasid, windowid);
    }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

