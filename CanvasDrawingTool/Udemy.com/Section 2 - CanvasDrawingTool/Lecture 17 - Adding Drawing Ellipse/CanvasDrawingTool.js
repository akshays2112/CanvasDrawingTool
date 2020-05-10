// Written by Akshay Srinivasan 2018
// Demystifying the unlimited potential of HTML Canvas element
// Section 2 - CanvasDrawingTool
// Lecture 17 - Adding Drawing Ellipse

// This javascript code is provided as is with no warranty implied.
// Akshay Srinivasan is not liable or responsible for any consequence of 
// using this code in your applications.
// You are free to use it and/ or change it for both commercial and non- commercial
// applications as long as you give credit to Akshay Srinivasan the creator 
// of this code.

"use strict";

var drawingCanvas, drawingCanvasCtx, drawingCanvasLostFocus, currentSetOfPoints,
    currentEllipse;
var leftMouseButtonDown = false;
var allSetsOfPoints = new Array();
var allEllipses = new Array();

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

    AddButton(5, 5, 50, 50, './Images/Pencil.png', './Images/PencilPressed.png',
        './Images/PencilMouseOver.png', 'Selected', 'Pencil');

    AddButton(65, 5, 50, 50, './Images/DrawLine.png', './Images/DrawLinePressed.png',
        './Images/DrawLineMouseOver.png', 'UnSelected', 'Line');

    AddButton(125, 5, 50, 50, './Images/VerticalLine.png',
        './Images/VerticalLinePressed.png', './Images/VerticalLineMouseOver.png',
        'UnSelected', 'VerticalLine');

    AddButton(185, 5, 50, 50, './Images/HorizontalLine.png',
        './Images/HorizontalLinePressed.png', './Images/HorizontalLineMouseOver.png',
        'UnSelected', 'HorizontalLine');

    AddButton(245, 5, 50, 50, './Images/Rectangle.png', './Images/RectanglePressed.png',
        './Images/RectangleMouseOver.png', 'UnSelected', 'Rectangle');

    AddButton(305, 5, 50, 50, './Images/Ellipse.png', './Images/EllipsePressed.png',
        './Images/EllipseMouseOver.png', 'UnSelected', 'Ellipse');
}

function drawingCanvasOnMouseDown(e) {
    if (e.button === 0) {
        var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
        var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
        leftMouseButtonDown = true;
        if (actionType === 'Pencil' || actionType === 'Line' ||
            actionType === 'VerticalLine' || actionType === 'HorizontalLine'
            || actionType === 'Rectangle') {
            currentSetOfPoints = new Array();
            var tmp = { 'x': pos_left, 'y': pos_top };
            currentSetOfPoints.push(tmp);
            allSetsOfPoints.push(currentSetOfPoints);
        } else if (actionType === 'Ellipse') {
            currentEllipse = {
                TopLeftX: pos_left, TopLeftY: pos_top, Angle: 0,
                StartAngle: 0, EndAngle: 2 * Math.PI
            };
            allEllipses.push(currentEllipse);
        }
    }
}

function drawingCanvasOnMouseMove(e) {
    var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
    var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
    if (leftMouseButtonDown && !drawingCanvasLostFocus && currentSetOfPoints &&
        currentSetOfPoints.length > 0) {
        if (actionType === 'Pencil' || (actionType === 'Line' &&
            currentSetOfPoints.length === 1)) {
            var tmp = { 'x': pos_left, 'y': pos_top };
            currentSetOfPoints.push(tmp);
            Draw();
        } else if (actionType === 'Line' && currentSetOfPoints.length === 2) {
            currentSetOfPoints[1].x = pos_left;
            currentSetOfPoints[1].y = pos_top;
            Draw();
        } else if (actionType === 'VerticalLine' &&
            currentSetOfPoints.length === 1) {
            var tmp2 = { 'x': currentSetOfPoints[0].x, 'y': pos_top };
            currentSetOfPoints.push(tmp2);
            Draw();
        } else if (actionType === 'VerticalLine' &&
            currentSetOfPoints.length === 2) {
            currentSetOfPoints[1].y = pos_top;
            Draw();
        } else if (actionType === 'HorizontalLine' &&
            currentSetOfPoints.length === 1) {
            var tmp3 = { 'x': pos_left, 'y': currentSetOfPoints[0].y };
            currentSetOfPoints.push(tmp3);
            Draw();
        } else if (actionType === 'HorizontalLine' &&
            currentSetOfPoints.length === 2) {
            currentSetOfPoints[1].x = pos_left;
            Draw();
        } else if (actionType === 'Rectangle' && currentSetOfPoints.length === 1) {
            currentSetOfPoints.push({ 'x': pos_left, 'y': currentSetOfPoints[0].y });
            currentSetOfPoints.push({ 'x': pos_left, 'y': pos_top });
            currentSetOfPoints.push({ 'x': currentSetOfPoints[0].x, 'y': pos_top });
            currentSetOfPoints.push({
                'x': currentSetOfPoints[0].x,
                'y': currentSetOfPoints[0].y
            });
            Draw();
        } else if (actionType === 'Rectangle' && currentSetOfPoints.length === 5) {
            currentSetOfPoints[1].x = pos_left;
            currentSetOfPoints[1].y = currentSetOfPoints[0].y;
            currentSetOfPoints[2].x = pos_left;
            currentSetOfPoints[2].y = pos_top;
            currentSetOfPoints[3].x = currentSetOfPoints[0].x;
            currentSetOfPoints[3].y = pos_top;
            currentSetOfPoints[4].x = currentSetOfPoints[0].x;
            currentSetOfPoints[4].y = currentSetOfPoints[0].y;
            Draw();
        }
    }

    if (leftMouseButtonDown && !drawingCanvasLostFocus && actionType === 'Ellipse'
        && currentEllipse) {
        currentEllipse.BottomRightX = pos_left;
        currentEllipse.BottomRightY = pos_top;
        currentEllipse.SemiMajorAxisLength = Math.abs(currentEllipse.TopLeftX -
            currentEllipse.BottomRightX) / 2;
        currentEllipse.SemiMinorAxisLength = Math.abs(currentEllipse.TopLeftY -
            currentEllipse.BottomRightY) / 2;
        currentEllipse.CenterX = currentEllipse.TopLeftX +
            (currentEllipse.BottomRightX - currentEllipse.TopLeftX) / 2;
        currentEllipse.CenterY = currentEllipse.TopLeftY +
            (currentEllipse.BottomRightY - currentEllipse.TopLeftY) / 2;
        Draw();
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
        } else if (actionType === 'Line' || actionType === 'VerticalLine'
            || actionType === 'HorizontalLine' || actionType === 'Rectangle') {
            var tmp1;
            if (actionType === 'Rectangle') {
                if (currentSetOfPoints.length === 1) {
                    currentSetOfPoints.push({
                        'x': pos_left,
                        'y': currentSetOfPoints[0].y
                    });
                    currentSetOfPoints.push({ 'x': pos_left, 'y': pos_top });
                    currentSetOfPoints.push({
                        'x': currentSetOfPoints[0].x,
                        'y': pos_top
                    });
                    currentSetOfPoints.push({
                        'x': currentSetOfPoints[0].x,
                        'y': currentSetOfPoints[0].y
                    });
                    currentSetOfPoints = null;
                    Draw();
                } else if (currentSetOfPoints.length === 5) {
                    currentSetOfPoints[1].x = pos_left;
                    currentSetOfPoints[1].y = currentSetOfPoints[0].y;
                    currentSetOfPoints[2].x = pos_left;
                    currentSetOfPoints[2].y = pos_top;
                    currentSetOfPoints[3].x = currentSetOfPoints[0].x;
                    currentSetOfPoints[3].y = pos_top;
                    currentSetOfPoints[4].x = currentSetOfPoints[0].x;
                    currentSetOfPoints[4].y = currentSetOfPoints[0].y;
                    currentSetOfPoints = null;
                    Draw();
                }
            } else if (currentSetOfPoints.length === 1) {
                if (actionType === 'Line') {
                    tmp1 = { 'x': pos_left, 'y': pos_top };
                    currentSetOfPoints.push(tmp1);
                    currentSetOfPoints = null;
                    Draw();
                } else if (actionType === 'VerticalLine') {
                    tmp1 = { 'x': currentSetOfPoints[0].x, 'y': pos_top };
                    currentSetOfPoints.push(tmp1);
                    currentSetOfPoints = null;
                    Draw();
                } else if (actionType === 'HorizontalLine') {
                    tmp1 = { 'x': pos_left, 'y': currentSetOfPoints[0].y };
                    currentSetOfPoints.push(tmp1);
                    currentSetOfPoints = null;
                    Draw();
                }
            } else if (currentSetOfPoints.length === 2) {
                if (actionType === 'Line') {
                    currentSetOfPoints[1].x = pos_left;
                    currentSetOfPoints[1].y = pos_top;
                    currentSetOfPoints = null;
                    Draw();
                } else if (actionType === 'VerticalLine') {
                    currentSetOfPoints[1].y = pos_top;
                    currentSetOfPoints = null;
                    Draw();
                } else if (actionType === 'HorizontalLine') {
                    currentSetOfPoints[1].x = pos_left;
                    currentSetOfPoints = null;
                    Draw();
                }
            }
        } else if (actionType === 'Ellipse' && currentEllipse) {
            currentEllipse.BottomRightX = pos_left;
            currentEllipse.BottomRightY = pos_top;
            currentEllipse.SemiMajorAxisLength =
                Math.abs(currentEllipse.TopLeftX - currentEllipse.BottomRightX) / 2;
            currentEllipse.SemiMinorAxisLength =
                Math.abs(currentEllipse.TopLeftY - currentEllipse.BottomRightY) / 2;
            currentEllipse.CenterX = currentEllipse.TopLeftX +
                (currentEllipse.BottomRightX - currentEllipse.TopLeftX) / 2;
            currentEllipse.CenterY = currentEllipse.TopLeftY +
                (currentEllipse.BottomRightY - currentEllipse.TopLeftY) / 2;
            currentEllipse = null;
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

    for (var i = 0; i < allSetsOfPoints.length - ((actionType === 'Line' ||
        actionType === 'VerticalLine' || actionType === 'HorizontalLine')
        && currentSetOfPoints && currentSetOfPoints.length === 2 ? 1 :
        (actionType === 'Rectangle' && currentSetOfPoints &&
            currentSetOfPoints.length === 5 ? 1 : 0)); i++) {
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

    if ((actionType === 'Line' || actionType === 'VerticalLine' ||
        actionType === 'HorizontalLine') && currentSetOfPoints &&
        currentSetOfPoints.length === 2) {
        drawingCanvasCtx.setLineDash([5, 5]);
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.moveTo(currentSetOfPoints[0].x, currentSetOfPoints[0].y);
        drawingCanvasCtx.lineTo(currentSetOfPoints[1].x, currentSetOfPoints[1].y);
        drawingCanvasCtx.stroke();
        drawingCanvasCtx.setLineDash([]);
    }

    if (actionType === 'Rectangle' && currentSetOfPoints &&
        currentSetOfPoints.length === 5) {
        drawingCanvasCtx.setLineDash([5, 5]);
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.moveTo(currentSetOfPoints[0].x, currentSetOfPoints[0].y);
        for (var g = 1; g < currentSetOfPoints.length; g++) {
            drawingCanvasCtx.lineTo(currentSetOfPoints[g].x,
                currentSetOfPoints[g].y);
        }
        drawingCanvasCtx.stroke();
        drawingCanvasCtx.setLineDash([]);
    }

    for (var t = 0; t < allEllipses.length - (currentEllipse &&
        currentEllipse.TopLeftX > 0 && currentEllipse.TopLeftY > 0
        && currentEllipse.BottomRightX > 0 && currentEllipse.BottomRightY > 0 ?
        1 : 0); t++) {
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.ellipse(allEllipses[t].CenterX, allEllipses[t].CenterY,
            allEllipses[t].SemiMajorAxisLength, allEllipses[t].SemiMinorAxisLength,
            allEllipses[t].Angle, allEllipses[t].StartAngle,
            allEllipses[t].EndAngle, 0);
        drawingCanvasCtx.stroke();
    }

    if (currentEllipse && currentEllipse.CenterX > 0 && currentEllipse.CenterY > 0
        && currentEllipse.SemiMajorAxisLength > 0 &&
        currentEllipse.SemiMinorAxisLength > 0) {
        drawingCanvasCtx.strokeStyle = '#00FF00';
        drawingCanvasCtx.setLineDash([5, 5]);
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.rect(currentEllipse.CenterX, currentEllipse.CenterY,
            currentEllipse.SemiMajorAxisLength, currentEllipse.SemiMinorAxisLength,
            currentEllipse.Angle, currentEllipse.StartAngle,
            currentEllipse.EndAngle,
            0);
        drawingCanvasCtx.stroke();
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.ellipse(currentEllipse.CenterX, currentEllipse.CenterY,
            currentEllipse.SemiMajorAxisLength, currentEllipse.SemiMinorAxisLength,
            currentEllipse.Angle, currentEllipse.StartAngle,
            currentEllipse.EndAngle, 0);
        drawingCanvasCtx.stroke();
        drawingCanvasCtx.setLineDash([]);
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

