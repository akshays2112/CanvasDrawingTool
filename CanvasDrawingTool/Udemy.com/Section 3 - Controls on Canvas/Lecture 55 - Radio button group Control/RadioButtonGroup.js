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

//Radio button code starts here

var radiobuttonPropsArray = new Array();

function getRadioButtonProps(canvasid, windowid) {
    for (var i = 0; i < radiobuttonPropsArray.length; i++) {
        if (radiobuttonPropsArray[i].CanvasID === canvasid &&
            radiobuttonPropsArray[i].WindowID === windowid) {
            return radiobuttonPropsArray[i];
        }
    }
}

function RadioButtonGroup() { }

RadioButtonGroup.prototype = {
    CanvasID: null, WindowID: null, X: null, Y: null, Width: null, Height: null,
    Alignment: null, GroupName: null,
    Labels: null, SelectedID: null, LabelTextColor: null, LabelFontString: null,
    Radius: null,
    LabelTextHeight: null, Tag: null, ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createRadioButtonGroup(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Alignment, this.Depth,
            this.GroupName, this.Labels, this.SelectedID, this.LabelTextColor,
            this.LabelFontString, this.LabelTextHeight,
            this.Radius, this.Tag, this.TabStopIndex);
    }
};

function createRadioButtonGroup(canvasid, controlNameId, x, y, alignment, depth,
    groupname, labels, selectedid, labelTextColor,
    labelFontString, labelTextHeight, radius, tag, tabstopindex) {
    var canvas = document.getElementById(canvasid);
    var ctx = canvas.getContext('2d');
    ctx.font = labelFontString;
    var height = 0;
    if (2 * radius >= labelTextHeight + 8) {
        height = 2 * radius;
    } else {
        height = labelTextHeight + 8;
    }
    var width = 0;
    for (var i = 0; i < labels.length; i++) {
        var tw = ctx.measureText(labels[i]).width;
        width += tw + 8 + 2 * radius;
    }
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'RadioButtonGroup', controlNameId, null, tabstopindex);
    radiobuttonPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Alignment: alignment, GroupName: groupname,
        Labels: labels, SelectedID: selectedid, LabelTextColor: labelTextColor,
        LabelFontString: labelFontString, Radius: radius,
        ButtonExtents: new Array(), LabelTextHeight: labelTextHeight, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var radioButtonProps = getRadioButtonProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        var widthOffset = 0;
        ctx.font = radioButtonProps.LabelFontString;
        var buttonExtents = new Array();
        for (var i = 0; i < radioButtonProps.Labels.length; i++) {
            ctx.fillStyle = radioButtonProps.LabelTextColor;
            ctx.fillText(radioButtonProps.Labels[i], radioButtonProps.X + widthOffset,
                radioButtonProps.Y + radioButtonProps.Height -
                (radioButtonProps.Height - radioButtonProps.LabelTextHeight) / 2);
            var tw = ctx.measureText(radioButtonProps.Labels[i]).width;
            ctx.fillStyle = '#fcfcfc';
            ctx.beginPath();
            ctx.arc(radioButtonProps.X + widthOffset + tw + 4 + radioButtonProps.Radius,
                radioButtonProps.Y + radioButtonProps.Radius +
                (radioButtonProps.Height - radioButtonProps.Radius * 2) / 2,
                radioButtonProps.Radius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#c4c4c4';
            ctx.beginPath();
            ctx.arc(radioButtonProps.X + widthOffset + tw + 4 + radioButtonProps.Radius,
                radioButtonProps.Y + radioButtonProps.Radius +
                (radioButtonProps.Height - radioButtonProps.Radius * 2) / 2,
                radioButtonProps.Radius - 1, Math.PI / 180 * 315, Math.PI / 180
                * 135, false);
            ctx.stroke();
            ctx.strokeStyle = '#141414';
            ctx.beginPath();
            ctx.arc(radioButtonProps.X + widthOffset + tw + 4 + radioButtonProps.Radius,
                radioButtonProps.Y + radioButtonProps.Radius +
                (radioButtonProps.Height - radioButtonProps.Radius * 2) / 2,
                radioButtonProps.Radius - 1, Math.PI / 180 * 135, Math.PI / 180
                * 315, false);
            ctx.stroke();
            ctx.strokeStyle = '#808080';
            ctx.beginPath();
            ctx.arc(radioButtonProps.X + widthOffset + tw + 4 + radioButtonProps.Radius,
                radioButtonProps.Y + radioButtonProps.Radius +
                (radioButtonProps.Height - radioButtonProps.Radius * 2) / 2,
                radioButtonProps.Radius - 1, Math.PI / 180 * 135, Math.PI / 180
                * 315, false);
            ctx.stroke();
            if (i === radioButtonProps.SelectedID) {
                ctx.fillStyle = '#51852f';
                ctx.beginPath();
                ctx.arc(radioButtonProps.X + widthOffset + tw + 4 + radioButtonProps.Radius,
                    radioButtonProps.Y + radioButtonProps.Radius +
                    (radioButtonProps.Height - radioButtonProps.Radius * 2) / 2,
                    radioButtonProps.Radius - 4, 0, Math.PI * 2, false);
                ctx.fill();
            }
            buttonExtents.push({
                X: radioButtonProps.X + widthOffset + tw + 4,
                Y: radioButtonProps.Y, Width: radioButtonProps.Radius * 2,
                Height: radioButtonProps.Height
            });
            widthOffset += tw + 8 + 2 * radioButtonProps.Radius;
        }
        radioButtonProps.ButtonExtents = buttonExtents;
    }, canvasid);
    registerClickFunction(windowid, function (canvasid2, windowid2, e) {
        var radioButtonProps = getRadioButtonProps(canvasid2, windowid2);
        var clickx = e.calcX;
        var clicky = e.calcY;
        for (var i = 0; i < radioButtonProps.ButtonExtents.length; i++) {
            if (clickx > radioButtonProps.ButtonExtents[i].X &&
                clickx < radioButtonProps.ButtonExtents[i].X +
                radioButtonProps.ButtonExtents[i].Width &&
                clicky > radioButtonProps.ButtonExtents[i].Y &&
                clicky < radioButtonProps.ButtonExtents[i].Y +
                radioButtonProps.ButtonExtents[i].Height) {
                radioButtonProps.SelectedID = i;
                break;
            }
        }
    }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

