// Written by Akshay Srinivasan 2018
// Demystifying the unlimited potential of HTML Canvas element
// Section 2 - CanvasDrawingTool
// Lecture 12 - Free form Drawing

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
}

function drawingCanvasOnMouseDown(e) {
    if (e.button === 0) {
        var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
        var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
        leftMouseButtonDown = true;
        currentSetOfPoints = new Array();
        var tmp = { 'x': pos_left, 'y': pos_top };
        currentSetOfPoints.push(tmp);
        allSetsOfPoints.push(currentSetOfPoints);
    }
}

function drawingCanvasOnMouseMove(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    if (leftMouseButtonDown && !drawingCanvasLostFocus && currentSetOfPoints &&
        currentSetOfPoints.length > 0) {
        var tmp = { 'x': pos_left, 'y': pos_top };
        currentSetOfPoints.push(tmp);
        Draw();
    }
}

function drawingCanvasOnMouseUp(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    if (e.button === 0 && leftMouseButtonDown) {
        leftMouseButtonDown = false;
        var tmp = { 'x': pos_left, 'y': pos_top };
        if (currentSetOfPoints.length > 0) {
            currentSetOfPoints.push(tmp);
            Draw();
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
    for (var i = 0; i < allSetsOfPoints.length; i++) {
        if (allSetsOfPoints[i].length > 1) {
            drawingCanvasCtx.beginPath();
            drawingCanvasCtx.moveTo(allSetsOfPoints[i][0].x, allSetsOfPoints[i][0].y);
            for (var j = 1; j < allSetsOfPoints[i].length; j++) {
                drawingCanvasCtx.lineTo(allSetsOfPoints[i][j].x, allSetsOfPoints[i][j].y);
            }
            drawingCanvasCtx.stroke();
        }
    }
}
