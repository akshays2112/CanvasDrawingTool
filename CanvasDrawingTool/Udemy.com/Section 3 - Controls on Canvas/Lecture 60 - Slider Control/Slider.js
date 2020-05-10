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

//Slider Control code starts here

var sliderPropsArray = new Array();

function getSliderProps(canvasid, windowid) {
    for (var i = 0; i < sliderPropsArray.length; i++) {
        if (sliderPropsArray[i].CanvasID === canvasid &&
            sliderPropsArray[i].WindowID === windowid) {
            return sliderPropsArray[i];
        }
    }
}

function drawSlider(canvasid, windowid) {
    var sliderProps = getSliderProps(canvasid, windowid);
    var ctx = getCtx(canvasid);
    ctx.strokeStyle = '#a3aeb9';
    ctx.beginPath();
    ctx.rect(sliderProps.X, sliderProps.Y + sliderProps.HandleHeight / 2 -
        1, sliderProps.Width, 3);
    ctx.stroke();
    ctx.strokeStyle = '#e6eff7';
    ctx.beginPath();
    ctx.moveTo(sliderProps.X + 1, sliderProps.Y + sliderProps.HandleHeight / 2);
    ctx.lineTo(sliderProps.X + sliderProps.Width - 1, sliderProps.Y +
        sliderProps.HandleHeight / 2);
    ctx.stroke();
    var pgwidth = (sliderProps.CurrentValue - sliderProps.MinValue) *
        sliderProps.Width / (sliderProps.MaxValue - sliderProps.MinValue) -
        sliderProps.HandleWidth / 2;
    var g = ctx.createLinearGradient(sliderProps.X + pgwidth, sliderProps.Y,
        sliderProps.X + pgwidth, sliderProps.Y + sliderProps.HandleHeight);
    g.addColorStop(0, '#fdfdfd');
    g.addColorStop(1, '#ced4d9');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.rect(sliderProps.X + pgwidth, sliderProps.Y, sliderProps.HandleWidth,
        sliderProps.HandleHeight);
    ctx.fill();
    ctx.strokeStyle = '#a0abb7';
    ctx.beginPath();
    ctx.moveTo(sliderProps.X + pgwidth + 1, sliderProps.Y);
    ctx.lineTo(sliderProps.X + pgwidth + sliderProps.HandleWidth - 1, sliderProps.Y);
    ctx.stroke();
    ctx.strokeStyle = '#8094a4';
    ctx.beginPath();
    ctx.moveTo(sliderProps.X + pgwidth, sliderProps.Y + 1);
    ctx.lineTo(sliderProps.X + pgwidth, sliderProps.Y + sliderProps.HandleHeight - 1);
    ctx.moveTo(sliderProps.X + pgwidth + sliderProps.HandleWidth, sliderProps.Y + 1);
    ctx.lineTo(sliderProps.X + pgwidth + sliderProps.HandleWidth, sliderProps.Y +
        sliderProps.HandleHeight - 1);
    ctx.stroke();
    ctx.strokeStyle = '#617584';
    ctx.beginPath();
    ctx.moveTo(sliderProps.X + pgwidth + 1, sliderProps.Y + sliderProps.HandleHeight);
    ctx.lineTo(sliderProps.X + pgwidth + sliderProps.HandleWidth - 1, sliderProps.Y +
        sliderProps.HandleHeight);
    ctx.stroke();
}

function sliderMouseDown(canvasid, windowid) {
    var sliderProps = getSliderProps(canvasid, windowid);
    sliderProps.MouseDownState = 1;
}

function sliderMouseMove(canvasid, windowid, e) {
    var sliderProps = getSliderProps(canvasid, windowid);
    if (sliderProps.MouseDownState === 1) {
        var x = e.calcX;
        if (x < sliderProps.X) {
            sliderProps.CurrentValue = sliderProps.MinValue;
        } else if (x > sliderProps.X + sliderProps.Width) {
            sliderProps.CurrentValue = sliderProps.MaxValue;
        } else {
            sliderProps.CurrentValue = sliderProps.MinValue + (x - sliderProps.X) *
                (sliderProps.MaxValue - sliderProps.MinValue) / sliderProps.Width;
        }
    }
}

function sliderMouseUp(canvasid, windowid) {
    var sliderProps = getSliderProps(canvasid, windowid);
    sliderProps.MouseDownState = 0;
}

function Slider() { }

Slider.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, HandleWidth: null,
    HandleHeight: null, MaxValue: null, MinValue: null, MouseDownState: null, Tag: null,
    ControlNameID: null, Depth: null, TabStopIndex: null, Value: null,

    Initialize: function () {
        return createSlider(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.HandleWidth, this.MaxValue, this.MinValue, this.Value, this.Tag,
            this.TabStopIndex);
    }
};

function createSlider(canvasid, controlNameId, x, y, width, height, depth,
    handlewidth, maxvalue, minvalue, value, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'Slider',
        controlNameId, null, tabstopindex);
    sliderPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, HandleWidth: handlewidth,
        HandleHeight: height, MaxValue: maxvalue, MinValue: minvalue,
        CurrentValue: value, MouseDownState: 0, Tag: tag
    });
    registerWindowDrawFunction(windowid, drawSlider, canvasid);
    registerMouseDownFunction(windowid, sliderMouseDown, canvasid);
    registerMouseUpFunction(windowid, sliderMouseUp, canvasid);
    registerMouseMoveFunction(windowid, sliderMouseMove, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

