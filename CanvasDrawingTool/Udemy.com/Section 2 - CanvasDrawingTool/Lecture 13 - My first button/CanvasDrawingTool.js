// Written by Akshay Srinivasan 2018
// Demystifying the unlimited potential of HTML Canvas element
// Section 2 - CanvasDrawingTool
// Lecture 13 - My first button

// This javascript code is provided as is with no warranty implied.
// Akshay Srinivasan is not liable or responsible for any consequence of 
// using this code in your applications.
// You are free to use it and/ or change it for both commercial and non- commercial
// applications as long as you give credit to Akshay Srinivasan the creator 
// of this code.

"use strict";

var drawingCanvas, drawingCanvasCtx, drawingCanvasLostFocus, currentSetOfPoints;
var leftMouseButtonDown = false;
var allSetsOfPoints = new Array();

var buttonCanvas, buttonCanvasCtx;
var actionType = 'Pencil';
var buttonCanvasLeftMouseButtonDown = false;
var buttons = new Array();

function AddButton(x, y, width, height, imgSrcURL, imgSrcPressedURL,
    imgSrcMouseOverURL, state, actiontype, onclick) {
    var tmp = {
        X: x, Y: y, Width: width, Height: height, State: state,
        ActionType: actiontype, OnClick: onclick
    };
    var imgSrc = new Image();
    imgSrc.onload = function () {
        tmp.ImgSrc = imgSrc;
        Draw();
    };
    imgSrc.src = imgSrcURL;
    tmp.ImgSrc = imgSrc;
    var imgSrcPressed = new Image();
    imgSrcPressed.onload = function () {
        tmp.ImgSrcPressed = imgSrcPressed;
        Draw();
    };
    imgSrcPressed.src = imgSrcPressedURL;
    tmp.ImgSrcPressed = imgSrcPressed;
    var imgSrcMouseOver = new Image();
    imgSrcMouseOver.onload = function () {
        tmp.ImgSrcMouseOver = imgSrcMouseOver;
        Draw();
    };
    imgSrcMouseOver.src = imgSrcMouseOverURL;
    tmp.ImgSrcMouseOver = imgSrcMouseOver;
    buttons.push(tmp);
}

function GetButtonImage(k) {
    if (buttons[k].State === 'Selected') {
        return buttons[k].ImgSrcPressed;
    } else if (buttons[k].State === 'MouseOver') {
        return buttons[k].ImgSrcMouseOver;
    } else {
        return buttons[k].ImgSrc;
    }
}

function GetTotalElementOffsetLeft(e) {
    var rect = e.getBoundingClientRect();
    return rect.left;
}

function GetTotalElementOffsetTop(e) {
    var rect = e.getBoundingClientRect();
    return rect.top;
}

function Setup() {
    drawingCanvas = document.getElementById('drawingCanvas');
    drawingCanvas.width = document.body.clientWidth - 230;
    drawingCanvas.height = document.body.clientHeight - 80;
    drawingCanvasCtx = drawingCanvas.getContext('2d');
    drawingCanvas.addEventListener('mousedown', drawingCanvasOnMouseDown, false);
    drawingCanvas.addEventListener('mouseup', drawingCanvasOnMouseUp, false);
    drawingCanvas.addEventListener('mousemove', drawingCanvasOnMouseMove, false);
    drawingCanvas.addEventListener('mouseenter', drawingCanvasOnMouseEnter, false);
    drawingCanvas.addEventListener('mouseleave', drawingCanvasOnMouseLeave, false);

    buttonCanvas = document.getElementById('buttonCanvas');
    buttonCanvas.width = document.body.clientWidth - 20;
    buttonCanvasCtx = buttonCanvas.getContext('2d');
    buttonCanvas.addEventListener('mousedown', buttonCanvasOnMouseDown, false);
    buttonCanvas.addEventListener('mouseup', buttonCanvasOnMouseUp, false);
    buttonCanvas.addEventListener('mousemove', buttonCanvasOnMouseMove, false);
    buttonCanvas.addEventListener('mouseleave', buttonCanvasOnMouseLeave, false);

    AddButton(5, 5, 50, 50, './Images/Pencil.png', './Images/PencilPressed.png', './Images/PencilMouseOver.png', 'Selected', 'Pencil');
}

function drawingCanvasOnMouseDown(e) {
    if (e.button === 0) {
        var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
        var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
        leftMouseButtonDown = true;
        if (actionType === 'Pencil') {
            currentSetOfPoints = new Array();
            var tmp = { 'x': pos_left, 'y': pos_top };
            currentSetOfPoints.push(tmp);
            allSetsOfPoints.push(currentSetOfPoints);
        }
    }
}

function drawingCanvasOnMouseMove(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    if (leftMouseButtonDown && !drawingCanvasLostFocus && currentSetOfPoints &&
        currentSetOfPoints.length > 0) {
        if (actionType === 'Pencil') {
            var tmp = { 'x': pos_left, 'y': pos_top };
            currentSetOfPoints.push(tmp);
            Draw();
        }
    }
}

function drawingCanvasOnMouseUp(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    if (e.button === 0 && leftMouseButtonDown) {
        leftMouseButtonDown = false;
        if (actionType === 'Pencil') {
            var tmp = { 'x': pos_left, 'y': pos_top };
            if (currentSetOfPoints.length > 0) {
                currentSetOfPoints.push(tmp);
                Draw();
            }
            currentSetOfPoints = null;
        }
    }
}

function drawingCanvasOnMouseEnter(e) {
    drawingCanvasLostFocus = false;
}

function drawingCanvasOnMouseLeave(e) {
    leftMouseButtonDown = false;
    drawingCanvasLostFocus = true;
    Draw();
}

function Draw() {
    drawingCanvasCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingCanvasCtx.strokeStyle = '#000000';
    drawingCanvasCtx.strokeRect(0, 0, drawingCanvas.width, drawingCanvas.height);

    buttonCanvasCtx.clearRect(0, 0, buttonCanvas.width, buttonCanvas.height);
    buttonCanvasCtx.strokeStyle = '#000000';
    buttonCanvasCtx.strokeRect(0, 0, buttonCanvas.width, buttonCanvas.height);

    for (var k = 0; k < buttons.length; k++) {
        var img = GetButtonImage(k);
        if (img !== undefined) {
            if (buttons[k].Width > 0 && buttons[k].Height > 0) {
                buttonCanvasCtx.drawImage(img, buttons[k].X, buttons[k].Y,
                    buttons[k].Width, buttons[k].Height);
            } else {
                buttonCanvasCtx.drawImage(img, buttons[k].X, buttons[k].Y);
            }
        }
    }

    for (var i = 0; i < allSetsOfPoints.length; i++) {
        if (allSetsOfPoints[i].length > 1) {
            drawingCanvasCtx.beginPath();
            drawingCanvasCtx.moveTo(allSetsOfPoints[i][0].x, allSetsOfPoints[i][0].y);
            for (var j = 1; j < allSetsOfPoints[i].length; j++) {
                drawingCanvasCtx.lineTo(allSetsOfPoints[i][j].x,
                    allSetsOfPoints[i][j].y);
            }
            drawingCanvasCtx.stroke();
        }
    }
}

function buttonCanvasOnMouseDown(e) {
    if (e.button === 0) {
        var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
        var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
        buttonCanvasLeftMouseButtonDown = true;
    }
}

function buttonCanvasOnMouseMove(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].State !== 'Selected') {
            if (pos_left >= buttons[i].X && pos_left < buttons[i].X +
                buttons[i].Width && pos_top >= buttons[i].Y &&
                pos_top <= buttons[i].Y + buttons[i].Height) {
                buttons[i].State = 'MouseOver';
            } else {
                buttons[i].State = 'UnSelected';
            }
            Draw();
        }
    }
}

function buttonCanvasOnMouseUp(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    if (e.button === 0 && buttonCanvasLeftMouseButtonDown) {
        buttonCanvasLeftMouseButtonDown = false;
        for (var i = 0; i < buttons.length; i++) {
            if (pos_left >= buttons[i].X && pos_left < buttons[i].X +
                buttons[i].Width && pos_top >= buttons[i].Y &&
                pos_top <= buttons[i].Y + buttons[i].Height) {
                if (actionType !== buttons[i].ActionType) {
                    if (!buttons[i].OnClick) {
                        buttons[i].State = 'Selected';
                        actionType = buttons[i].ActionType;
                        for (var p = 0; p < buttons.length; p++) {
                            if (p !== i) {
                                buttons[p].State = 'UnSelected';
                            }
                        }
                    } else {
                        buttons[i].OnClick();
                    }
                    Draw();
                }
            }
        }
    }
}

function buttonCanvasOnMouseLeave() {
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].State !== 'Selected') {
            buttons[i].State = 'UnSelected';
        }
    }
}

