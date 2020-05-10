// Written by Akshay Srinivasan 2018
// Demystifying the unlimited potential of HTML Canvas element
// Section 2 - CanvasDrawingTool
// Lecture 20 - Adding Drawing Text

// This javascript code is provided as is with no warranty implied.
// Akshay Srinivasan is not liable or responsible for any consequence of 
// using this code in your applications.
// You are free to use it and/ or change it for both commercial and non- commercial
// applications as long as you give credit to Akshay Srinivasan the creator 
// of this code.

"use strict";

var drawingCanvas, drawingCanvasCtx, drawingCanvasLostFocus, currentSetOfPoints,
    currentEllipse, currentCurve, currentBezierCurve, currentText;
var leftMouseButtonDown = false;
var rightMouseButtonDown = false;
var allSetsOfPoints = new Array();
var allEllipses = new Array();
var allCurves = new Array();
var allBezierCurves = new Array();
var allText = new Array();

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

function TestApproximateHitOfPointOnPoint(x1, y1, x2, y2) {
    if (Math.abs(x1 - x2) <= 5 && Math.abs(y1 - y2) <= 5) {
        return true;
    }
    return false;
}

function drawingCanvasOnContextMenu(e) {
    if (currentCurve || currentBezierCurve) {
        e.preventDefault();
        return false;
    }
    return true;
}

function drawingCanvasOnKeyPress(e) {
    if (actionType === 'Text' && currentText) {
        currentText.Value += e.key;
        drawingCanvasCtx.fontStyle = currentText.FontSize + 'px ' + currentText.FontName;
        var mt = drawingCanvasCtx.measureText(currentText.Value);
        currentText.Width = mt.width;
        Draw();
    }
}

function drawingCanvasOnKeyUp(e) {
    if (actionType === 'Text' && currentText && currentText.Value && currentText.Value.length > 0) {
        if (e.keyCode === 8) {
            currentText.Value = currentText.Value.substring(0, currentText.Value.length - 1);
            drawingCanvasCtx.fontStyle = currentText.FontSize + 'px ' + currentText.FontName;
            var mt = drawingCanvasCtx.measureText(currentText.Value);
            currentText.Width = mt.width;
            Draw();
        }
    }
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
    drawingCanvas.addEventListener('contextmenu', drawingCanvasOnContextMenu, false);
    drawingCanvas.addEventListener('keypress', drawingCanvasOnKeyPress, false);
    drawingCanvas.addEventListener('keyup', drawingCanvasOnKeyUp, false);

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

    AddButton(365, 5, 50, 50, './Images/Curve.png', './Images/CurvePressed.png',
        './Images/CurveMouseOver.png', 'UnSelected', 'Curve');

    AddButton(425, 5, 50, 50, './Images/BezierCurve.png',
        './Images/BezierCurvePressed.png', './Images/BezierCurveMouseOver.png',
        'UnSelected', 'BezierCurve');

    AddButton(485, 5, 50, 50, './Images/Text.png', './Images/TextPressed.png',
        './Images/TextMouseOver.png', 'UnSelected', 'Text');
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
        } else if (actionType === 'Curve') {
            if (currentCurve) {
                currentCurve.Editing = -1;
            }
            currentCurve = {
                StartX: pos_left, StartY: pos_top,
                ControlPointX: pos_left + 50, ControlPointY: pos_top - 50,
                EndX: pos_left + 100, EndY: pos_top, Editing: -1
            };
            allCurves.push(currentCurve);
            Draw();
        } else if (actionType === 'BezierCurve') {
            if (currentBezierCurve) {
                currentBezierCurve.Editing = -1;
            }
            currentBezierCurve = {
                StartX: pos_left, StartY: pos_top, ControlPoint1X: pos_left,
                ControlPoint1Y: pos_top - 50, ControlPoint2X: pos_left + 100,
                ControlPoint2Y: pos_top - 50, EndX: pos_left + 100,
                EndY: pos_top, Editing: -1
            };
            allBezierCurves.push(currentBezierCurve);
            Draw();
        }
    } else if (e.button === 2) {
        var pos_left = e.pageX - GetTotalElementOffsetLeft(e.currentTarget);
        var pos_top = e.pageY - GetTotalElementOffsetTop(e.currentTarget);
        rightMouseButtonDown = true;
        if (actionType === 'Curve' && currentCurve) {
            if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentCurve.StartX, currentCurve.StartY)) {
                currentCurve.Editing = 0;
            } else if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentCurve.ControlPointX, currentCurve.ControlPointY)) {
                currentCurve.Editing = 1;
            } else if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentCurve.EndX, currentCurve.EndY)) {
                currentCurve.Editing = 2;
            } else {
                currentCurve.Editing = -1;
            }
        } else if (actionType === 'BezierCurve' && currentBezierCurve) {
            if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentBezierCurve.StartX,
                currentBezierCurve.StartY)) {
                currentBezierCurve.Editing = 0;
            } else if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentBezierCurve.ControlPoint1X,
                currentBezierCurve.ControlPoint1Y)) {
                currentBezierCurve.Editing = 1;
            } else if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentBezierCurve.ControlPoint2X,
                currentBezierCurve.ControlPoint2Y)) {
                currentBezierCurve.Editing = 2;
            } else if (TestApproximateHitOfPointOnPoint(pos_left, pos_top,
                currentBezierCurve.EndX, currentBezierCurve.EndY)) {
                currentBezierCurve.Editing = 3;
            } else {
                currentBezierCurve.Editing = -1;
            }
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

    if (rightMouseButtonDown && !drawingCanvasLostFocus && actionType ===
        'Curve' && currentCurve) {
        if (currentCurve.Editing === 0) {
            currentCurve.StartX = pos_left;
            currentCurve.StartY = pos_top;
            Draw();
        } else if (currentCurve.Editing === 1) {
            currentCurve.ControlPointX = pos_left;
            currentCurve.ControlPointY = pos_top;
            Draw();
        } else if (currentCurve.Editing === 2) {
            currentCurve.EndX = pos_left;
            currentCurve.EndY = pos_top;
            Draw();
        }
    }

    if (rightMouseButtonDown && !drawingCanvasLostFocus &&
        actionType === 'BezierCurve' && currentBezierCurve) {
        if (currentBezierCurve.Editing === 0) {
            currentBezierCurve.StartX = pos_left;
            currentBezierCurve.StartY = pos_top;
            Draw();
        } else if (currentBezierCurve.Editing === 1) {
            currentBezierCurve.ControlPoint1X = pos_left;
            currentBezierCurve.ControlPoint1Y = pos_top;
            Draw();
        } else if (currentBezierCurve.Editing === 2) {
            currentBezierCurve.ControlPoint2X = pos_left;
            currentBezierCurve.ControlPoint2Y = pos_top;
            Draw();
        } else if (currentBezierCurve.Editing === 3) {
            currentBezierCurve.EndX = pos_left;
            currentBezierCurve.EndY = pos_top;
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
        } else if (actionType === 'Text') {
            currentText = {
                X: pos_left, Y: pos_top, Value: '',
                FontSize: 12, FontName: 'Tahoma', Angle: 0
            };
            allText.push(currentText);
        }
    } else if (e.button === 2 && rightMouseButtonDown) {
        rightMouseButtonDown = false;
        if (actionType === 'Curve' && currentCurve) {
            if (currentCurve.Editing === 0) {
                currentCurve.StartX = pos_left;
                currentCurve.StartY = pos_top;
            } else if (currentCurve.Editing === 1) {
                currentCurve.ControlPointX = pos_left;
                currentCurve.ControlPointY = pos_top;
            } else if (currentCurve.Editing === 2) {
                currentCurve.EndX = pos_left;
                currentCurve.EndY = pos_top;
            }
            Draw();
        } else if (actionType === 'BezierCurve' && currentBezierCurve) {
            if (currentBezierCurve.Editing === 0) {
                currentBezierCurve.StartX = pos_left;
                currentBezierCurve.StartY = pos_top;
            } else if (currentBezierCurve.Editing === 1) {
                currentBezierCurve.ControlPoint1X = pos_left;
                currentBezierCurve.ControlPoint1Y = pos_top;
            } else if (currentBezierCurve.Editing === 2) {
                currentBezierCurve.ControlPoint2X = pos_left;
                currentBezierCurve.ControlPoint2Y = pos_top;
            } else if (currentBezierCurve.Editing === 3) {
                currentBezierCurve.EndX = pos_left;
                currentBezierCurve.EndY = pos_top;
            }
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

    for (var a = 0; a < allCurves.length - (currentCurve ? 1 : 0); a++) {
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.moveTo(allCurves[a].StartX, allCurves[a].StartY);
        drawingCanvasCtx.quadraticCurveTo(allCurves[a].ControlPointX,
            allCurves[a].ControlPointY, allCurves[a].EndX, allCurves[a].EndY);
        drawingCanvasCtx.stroke();
    }

    if (actionType === 'Curve' && currentCurve) {
        drawingCanvasCtx.strokeStyle = '#0000FF';
        drawingCanvasCtx.setLineDash([5, 5]);
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.moveTo(currentCurve.StartX, currentCurve.StartY);
        drawingCanvasCtx.quadraticCurveTo(currentCurve.ControlPointX,
            currentCurve.ControlPointY, currentCurve.EndX, currentCurve.EndY);
        drawingCanvasCtx.stroke();
        drawingCanvasCtx.setLineDash([]);
        drawingCanvasCtx.fillStyle = currentCurve.Editing === 0 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentCurve.StartX - 2,
            currentCurve.StartY - 2, 5, 5);
        drawingCanvasCtx.fillStyle = currentCurve.Editing === 1 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentCurve.ControlPointX - 2,
            currentCurve.ControlPointY - 2, 5, 5);
        drawingCanvasCtx.fillStyle = currentCurve.Editing === 2 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentCurve.EndX - 2,
            currentCurve.EndY - 2, 5, 5);
    }

    for (var a = 0; a < allBezierCurves.length - (currentBezierCurve ? 1 : 0); a++) {
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.moveTo(allBezierCurves[a].StartX, allBezierCurves[a].StartY);
        drawingCanvasCtx.bezierCurveTo(allBezierCurves[a].ControlPoint1X,
            allBezierCurves[a].ControlPoint1Y, allBezierCurves[a].ControlPoint2X,
            allBezierCurves[a].ControlPoint2Y, allBezierCurves[a].EndX,
            allBezierCurves[a].EndY);
        drawingCanvasCtx.stroke();
    }

    if (actionType === 'BezierCurve' && currentBezierCurve) {
        drawingCanvasCtx.strokeStyle = '#0000FF';
        drawingCanvasCtx.setLineDash([5, 5]);
        drawingCanvasCtx.beginPath();
        drawingCanvasCtx.moveTo(currentBezierCurve.StartX, currentBezierCurve.StartY);
        drawingCanvasCtx.bezierCurveTo(currentBezierCurve.ControlPoint1X,
            currentBezierCurve.ControlPoint1Y, currentBezierCurve.ControlPoint2X,
            currentBezierCurve.ControlPoint2Y, currentBezierCurve.EndX,
            currentBezierCurve.EndY);
        drawingCanvasCtx.stroke();
        drawingCanvasCtx.setLineDash([]);
        drawingCanvasCtx.fillStyle = currentBezierCurve.Editing === 0 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentBezierCurve.StartX - 2,
            currentBezierCurve.StartY - 2, 5, 5);
        drawingCanvasCtx.fillStyle = currentBezierCurve.Editing === 1 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentBezierCurve.ControlPoint1X - 2,
            currentBezierCurve.ControlPoint1Y - 2, 5, 5);
        drawingCanvasCtx.fillStyle = currentBezierCurve.Editing === 2 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentBezierCurve.ControlPoint2X - 2,
            currentBezierCurve.ControlPoint2Y - 2, 5, 5);
        drawingCanvasCtx.fillStyle = currentBezierCurve.Editing === 3 ?
            '#008000' : '#000080';
        drawingCanvasCtx.fillRect(currentBezierCurve.EndX - 2,
            currentBezierCurve.EndY - 2, 5, 5);
    }

    for (var d = 0; d < allText.length - (actionType === 'Text' &&
        currentText ? 1 : 0); d++) {
        drawingCanvasCtx.save();
        drawingCanvasCtx.font = allText[d].FontSize + 'px ' + allText[d].FontName;
        drawingCanvasCtx.fillStyle = '#000000';
        drawingCanvasCtx.translate(allText[d].X + allText[d].Width / 2,
            allText[d].Y + allText[d].FontSize / 2);
        drawingCanvasCtx.fillText(allText[d].Value, -allText[d].Width / 2,
            -allText[d].FontSize / 2);
        drawingCanvasCtx.restore();
    }

    if (actionType === 'Text' && currentText && currentText.Value &&
        currentText.Value.length > 0) {
        drawingCanvasCtx.fillStyle = '#0000FF';
        drawingCanvasCtx.font = currentText.FontSize + 'px ' + currentText.FontName;
        drawingCanvasCtx.fillText(currentText.Value, currentText.X, currentText.Y);
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
                    if (buttons[i].ActionType !== 'Curve') {
                        currentCurve = null;
                    }
                    if (buttons[i].ActionType !== 'BezierCurve') {
                        currentBezierCurve = null;
                    }
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

