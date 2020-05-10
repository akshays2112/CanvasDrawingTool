/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Helper functions
function getlowcomp(value) {
    if (value > 0) {
        var x = Math.floor(value / 2), y = x.toString(16);
        if (y.length < 2) { return '0' + y; }
        return y;
    }
    return '00';
}

function gethighcomp(value) {
    if (value < 255) {
        var x = value + Math.floor(((255 - value) / 2));
        if (x <= 16) { return '0' + x.toString(16); }
        return x.toString(16);
    }
    return 'FF';
}

function canvasGetOffsetLeft(obj) {
    var curleft = 0;
    if (obj.offsetParent) {
        do {
            curleft += ((parseInt(obj.offsetLeft) >= 0 || parseInt(obj.offsetLeft) <
                0) && parseInt(obj.offsetLeft).toString() ==
                obj.offsetLeft.toString() ? obj.offsetLeft : 0);
        } while (obj = obj.offsetParent);
        return curleft;
    }
}

function canvasGetOffsetTop(obj) {
    var curtop = 0;
    if (obj.offsetParent) {
        do {
            curtop += ((parseInt(obj.offsetTop) >= 0 || parseInt(obj.offsetTop) <
                0) && parseInt(obj.offsetTop).toString() == obj.offsetTop.toString() ?
                obj.offsetTop : 0);
        } while (obj = obj.offsetParent);
        return curtop;
    }
}

function drawEllipse(ctx, x, y, w, h) {
    var kappa = 0.5522848;
    var ox = (w / 2) * kappa, // control point offset horizontal
    oy = (h / 2) * kappa, // control point offset vertical
    xe = x + w,           // x-end
    ye = y + h,           // y-end
    xm = x + w / 2,       // x-middle
    ym = y + h / 2;       // y-middle

    ctx.beginPath();
    ctx.moveTo(x, ym);
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
    ctx.closePath();
}

//Window Manager Code starts here
var canvases = new Array();
var ctxs = new Array();
var windows = new Array();
var windowCount = 0;
var highestDepth = 0;
var clickFunctions = new Array();
var doubleClickFunctions = new Array();
var dragFunctions = new Array();
var dragEndFunctions = new Array();
var dragEnterFunctions = new Array();
var dragLeaveFunctions = new Array();
var dragOverFunctions = new Array();
var dragStartFunctions = new Array();
var dropFunctions = new Array();
var mouseDownFunctions = new Array();
var mouseMoveFunctions = new Array();
var mouseOutFunctions = new Array();
var mouseOverFunctions = new Array();
var mouseUpFunctions = new Array();
var mouseWheelFunctions = new Array();
var scrollFunctions = new Array();
var windowDrawFunctions = new Array();
var windowIdWithFocus = new Array();
var modalWindows = new Array();
var hiddenWindows = new Array();
var gotFocusFunctions = new Array();
var lostFocusFunctions = new Array();
var keyPressFunctions = new Array();
var keyDownFunctions = new Array();
var doingClickEvent = 0;
var doingMouseUp = 0;
var doingMouseDown = 0;
var doingEventForWindowID = -1;
var intervalID = -1;
var windowWithAnimationCount = new Array();
var suspendDraw = 0;
var sessionID = null;
var donotredaw = null;

function animatedDraw() {
    for (var i = 0; i < windowWithAnimationCount.length; i++) {
        var wprops = getWindowProps(windowWithAnimationCount[i].CanvasID,
            windowWithAnimationCount[i].WindowID);
        if (wprops) {
            invalidateRect(windowWithAnimationCount[i].CanvasID, null, wprops.X,
                wprops.Y, wprops.Width, wprops.Height);
        }
    }
}

function registerAnimatedWindow(canvasid, windowid) {
    for (var i = 0; i < windowWithAnimationCount.length; i++) {
        if (windowWithAnimationCount[i].CanvasID == canvasid &&
            windowWithAnimationCount[i].WindowID == windowid) {
            if (intervalID == -1) {
                intervalID = setInterval(animatedDraw, 20);
            }
            return;
        }
    }
    windowWithAnimationCount.push({ CanvasID: canvasid, WindowID: windowid });
    intervalID = setInterval(animatedDraw, 20);
}

function unregisterAnimatedWindow(canvasid, windowid) {
    for (var i = 0; i < windowWithAnimationCount.length; i++) {
        if (windowWithAnimationCount[i].CanvasID == canvasid &&
            windowWithAnimationCount[i].WindowID == windowid) {
            windowWithAnimationCount.splice(i, 1);
            break;
        }
    }
    var found = 0;
    for (var i = 0; i < windowWithAnimationCount.length; i++) {
        if (windowWithAnimationCount[i].CanvasID == canvasid) {
            found = 1;
            break;
        }
    }
    if (!found) {
        clearInterval(intervalID);
    }
}

function doesWindowHaveFocus(canvasid, windowid) {
    for (var i = 0; i < windowIdWithFocus.length; i++) {
        if (windowIdWithFocus[i][0] == canvasid && windowIdWithFocus[i][1] == windowid) {
            return 1;
        }
    }
    return 0;
}

function correctEvent(canvasid, e) {
    e = e || window.event;
    var canvas = document.getElementById(canvasid);
    if (e.pageX || e.pageY) {
        e.calcX = e.pageX - canvasGetOffsetLeft(canvas);
        e.calcY = e.pageY - canvasGetOffsetTop(canvas);
    } else if (e.clientX || e.clientY) {
        e.calcX = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft - canvasGetOffsetLeft(canvas);
        e.calcY = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop - canvasGetOffsetTop(canvas);
    }
    return e;
}

function pointEvent(eventArray, canvasId, e, parentwindowid, suppressPreventDefault) {
    e = correctEvent(canvasId, e);
    var x = e.calcX;
    var y = e.calcY;
    var consumeevent = 0;
    var dodrawforwindowids = new Array();
    var dodraw = 0;
    for (var d = 0; d <= highestDepth; d++) {
        for (var i = 0; i < windows.length; i++) {
            if (windows[i].ParentWindowID == parentwindowid &&
                checkIfModalWindow(canvasId, windows[i].WindowCount) == 1 &&
                checkIfHiddenWindow(canvasId, windows[i].WindowCount) == 0 &&
                windows[i].CanvasID == canvasId && windows[i].Depth == d &&
                x >= windows[i].X && x <= windows[i].X + windows[i].Width && y >=
                windows[i].Y && y <= windows[i].Y + windows[i].Height) {
                doingEventForWindowID = windows[i].WindowCount;
                if (doingClickEvent == 1 || doingMouseUp == 1 || doingMouseDown == 1) {
                    var found = 0;
                    consumeevent = 1;
                    for (var k = 0; k < windowIdWithFocus.length; k++) {
                        if (windowIdWithFocus[k][0] == canvasId &&
                            windowIdWithFocus[k][1] != windows[i].WindowCount &&
                            windowIdWithFocus[k][1] != -1) {
                            found = 1;
                            for (var f = 0; f < lostFocusFunctions.length; f++) {
                                if (lostFocusFunctions[f][0] == canvasId &&
                                    lostFocusFunctions[f][1] == windowIdWithFocus[k][1] &&
                                    lostFocusFunctions[f][1] != windows[i].WindowCount) {
                                    lostFocusFunctions[f][2](canvasId, windowIdWithFocus[k][1]);
                                    if (!donotredaw) {
                                        dodrawforwindowids.push(lostFocusFunctions[f][1]);
                                    }
                                }
                            }
                            windowIdWithFocus[k][1] = windows[i].WindowCount;
                            for (var f = 0; f < gotFocusFunctions.length; f++) {
                                if (gotFocusFunctions[f][0] == canvasId &&
                                    gotFocusFunctions[f][1] == windowIdWithFocus[k][1]) {
                                    gotFocusFunctions[f][2](canvasId, windowIdWithFocus[k][1]);
                                    if (!donotredaw) {
                                        dodrawforwindowids.push(gotFocusFunctions[f][1]);
                                    }
                                }
                            }
                            dodraw = 1;
                        } else if (windowIdWithFocus[k][0] == canvasId &&
                            windowIdWithFocus[k][1] == windows[i].WindowCount) {
                            found = 1;
                        }
                    }
                    if (found == 0) {
                        setFocusToWindowID(canvasId, windows[i].WindowCount);
                        for (var f = 0; f < gotFocusFunctions.length; f++) {
                            if (gotFocusFunctions[f][0] == canvasId &&
                                gotFocusFunctions[f][1] == windows[i].WindowCount &&
                                windowIdWithFocus[k][1] != -1) {
                                gotFocusFunctions[f][2](canvasId, windows[i].WindowCount);
                                if (!donotredaw) {
                                    dodrawforwindowids.push(gotFocusFunctions[f][1]);
                                }
                            }
                        }
                        dodraw = 1;
                    }
                }
                for (var u = 0; u < eventArray.length; u++) {
                    if (eventArray[u][0] == windows[i].WindowCount) {
                        if (windows[i].ChildWindowIDs && windows[i].ChildWindowIDs.length
                            > 0) {
                            if (pointEvent(eventArray, canvasId, e, windows[i].WindowCount,
                                suppressPreventDefault) != 1) {
                                eventArray[u][1](canvasId, windows[i].WindowCount, e);
                            }
                        } else {
                            eventArray[u][1](canvasId, windows[i].WindowCount, e);
                        }
                        if (!donotredaw && windows[i]) {
                            invalidateRect(canvasId, null, windows[i].X, windows[i].Y,
                                windows[i].Width, windows[i].Height);
                            if (windows[i].ControlType == 'ScrollBar') {
                                var scrollbarprops = getScrollBarProps(canvasId,
                                    windows[i].WindowCount);
                                var parentofscrollbarwindowprops = getWindowProps(
                                    canvasId, scrollbarprops.OwnedByWindowID);
                                if (parentofscrollbarwindowprops) {
                                    invalidateRect(canvasId, null,
                                        parentofscrollbarwindowprops.X,
                                        parentofscrollbarwindowprops.Y,
                                        parentofscrollbarwindowprops.Width,
                                        parentofscrollbarwindowprops.Height);
                                    if (scrollbarprops.DrawFunction) {
                                        scrollbarprops.DrawFunction(canvasId,
                                            windows[i].WindowCount);
                                    } else {
                                        drawScrollBar(canvasId, windows[i].WindowCount);
                                    }
                                }
                            }
                        }
                        if (windows[i] && windows[i].ControlType != 'TextBox' &&
                            suppressPreventDefault != 1) {
                            if (e.preventDefault)
                                e.preventDefault();
                            e.returnValue = false;
                        }
                        /*
                        if (windows[i].ControlType != 'Splitter') {
                            return 1;
                        }*/
                    }
                }
                return 1;
            }
        }
    }
    for (var d = 0; d <= highestDepth; d++) {
        for (var i = 0; i < windows.length; i++) {
            if (windows[i].ParentWindowID == parentwindowid && checkIfModalWindow(
                canvasId, windows[i].WindowCount) == 0 && checkIfHiddenWindow(
                    canvasId, windows[i].WindowCount) == 0 &&
                windows[i].CanvasID == canvasId && windows[i].Depth == d &&
                x >= windows[i].X && x <= windows[i].X + windows[i].Width &&
                y >= windows[i].Y && y <= windows[i].Y + windows[i].Height) {
                doingEventForWindowID = windows[i].WindowCount;
                if (doingClickEvent == 1 || doingMouseUp == 1 || doingMouseDown == 1) {
                    var found = 0;
                    consumeevent = 1;
                    for (var k = 0; k < windowIdWithFocus.length; k++) {
                        if (windowIdWithFocus[k][0] == canvasId &&
                            windowIdWithFocus[k][1] != windows[i].WindowCount &&
                            windowIdWithFocus[k][1] != -1) {
                            found = 1;
                            for (var f = 0; f < lostFocusFunctions.length; f++) {
                                if (lostFocusFunctions[f][0] == canvasId &&
                                    lostFocusFunctions[f][1] == windowIdWithFocus[k][1] &&
                                    lostFocusFunctions[f][1] != windows[i].WindowCount) {
                                    lostFocusFunctions[f][2](canvasId, windowIdWithFocus[k][1]);
                                    if (!donotredaw) {
                                        dodrawforwindowids.push(lostFocusFunctions[f][1]);
                                    }
                                }
                            }
                            windowIdWithFocus[k][1] = windows[i].WindowCount;
                            for (var f = 0; f < gotFocusFunctions.length; f++) {
                                if (gotFocusFunctions[f][0] == canvasId &&
                                    gotFocusFunctions[f][1] == windowIdWithFocus[k][1]) {
                                    gotFocusFunctions[f][2](canvasId, windowIdWithFocus[k][1]);
                                    if (!donotredaw) {
                                        dodrawforwindowids.push(gotFocusFunctions[f][1]);
                                    }
                                }
                            }
                            dodraw = 1;
                        } else if (windowIdWithFocus[k][0] == canvasId &&
                            windowIdWithFocus[k][1] == windows[i].WindowCount &&
                            windowIdWithFocus[k][1] != -1) {
                            found = 1;
                        }
                    }
                    if (found == 0) {
                        setFocusToWindowID(canvasId, windows[i].WindowCount);
                        for (var f = 0; f < gotFocusFunctions.length; f++) {
                            if (gotFocusFunctions[f][0] == canvasId &&
                                gotFocusFunctions[f][1] == windows[i].WindowCount) {
                                gotFocusFunctions[f][2](canvasId, windows[i].WindowCount);
                                if (!donotredaw) {
                                    dodrawforwindowids.push(gotFocusFunctions[f][1]);
                                }
                            }
                        }
                        dodraw = 1;
                    }
                }
                for (var u = 0; u < eventArray.length; u++) {
                    if (eventArray[u][0] == windows[i].WindowCount) {
                        if (windows[i].ChildWindowIDs &&
                            windows[i].ChildWindowIDs.length > 0) {
                            doingEvent = 0;
                            if (pointEvent(eventArray, canvasId, e, windows[i].WindowCount,
                                suppressPreventDefault) != 1) {
                                eventArray[u][1](canvasId, windows[i].WindowCount, e);
                            }
                        } else {
                            eventArray[u][1](canvasId, windows[i].WindowCount, e);
                        }
                        if (!donotredaw && windows[i]) {
                            invalidateRect(canvasId, null, windows[i].X, windows[i].Y,
                                windows[i].Width, windows[i].Height);
                            if (windows[i].ControlType == 'ScrollBar') {
                                var scrollbarprops = getScrollBarProps(canvasId,
                                    windows[i].WindowCount);
                                var parentofscrollbarwindowprops = getWindowProps(
                                    canvasId, scrollbarprops.OwnedByWindowID);
                                if (parentofscrollbarwindowprops) {
                                    invalidateRect(canvasId, null,
                                        parentofscrollbarwindowprops.X,
                                        parentofscrollbarwindowprops.Y,
                                        parentofscrollbarwindowprops.Width,
                                        parentofscrollbarwindowprops.Height);
                                    if (scrollbarprops.DrawFunction) {
                                        scrollbarprops.DrawFunction(canvasId,
                                            windows[i].WindowCount);
                                    } else {
                                        drawScrollBar(canvasId, windows[i].WindowCount);
                                    }
                                }
                            }
                        }
                        if (windows[i] && windows[i].ControlType != 'TextBox' &&
                            suppressPreventDefault != 1) {
                            if (e.preventDefault)
                                e.preventDefault();
                            e.returnValue = false;
                        }
                        /*
                        if (windows[i].ControlType != 'Splitter') {
                            return 1;
                        }*/
                    }
                }
                return 1;
            }
        }
    }
    if (consumeevent == 1) {
        return 1;
    }
    if (doingClickEvent == 1 || doingMouseUp == 1 || doingMouseDown == 1) {
        for (var q = 0; q < windowIdWithFocus.length; q++) {
            if (windowIdWithFocus[q][0] == canvasId) {
                doingEventForWindowID = -1;
                for (var f = 0; f < lostFocusFunctions.length; f++) {
                    if (lostFocusFunctions[f][0] == canvasId &&
                        lostFocusFunctions[f][1] == windowIdWithFocus[q][1] &&
                        windowIdWithFocus[q][1] != -1) {
                        lostFocusFunctions[f][2](canvasId, windowIdWithFocus[q][1]);
                        if (!donotredaw) {
                            dodrawforwindowids.push(lostFocusFunctions[f][1]);
                        }
                    }
                }
                windowIdWithFocus[q][1] = -1;
                dodraw = 1;
            }
        }
    }
    if (dodraw == 1 && !donotredaw) {
        for (var i = 0; i < dodrawforwindowids.length; i++) {
            var wprops = getWindowProps(canvasId, dodrawforwindowids[i]);
            if (wprops) {
                invalidateRect(canvasId, null, wprops.X, wprops.Y,
                    wprops.Width, wprops.Height);
            }
        }
    }
    donotredaw = null;
    return 0;
}

function setFocusToWindowID(canvasId, windowid) {
    for (var i = 0; windowIdWithFocus.length; i++) {
        if (windowIdWithFocus[i][0] == canvasId) {
            windowIdWithFocus[i][1] = windowid;
            return;
        }
    }
    windowIdWithFocus.push([canvasId, windowid]);
}

function canvasOnClick(canvasId, e) {
    doingClickEvent = 1;
    pointEvent(clickFunctions, canvasId, e);
    doingClickEvent = 0;
}

function canvasOnDblClick(canvasId, e) {
    pointEvent(doubleClickFunctions, canvasId, e);
}

function canvasOnDrag(canvasId, e) {
    pointEvents(dragFunctions, canvasId, e);
}

function canvasOnDragEnd(canvasId, e) {
    pointEvent(dragEndFunctions, canvasId, e);
}

function canvasOnDragEnter(canvasId, e) {
    pointEvent(dragEnterFunctions, canvasId, e);
}

function canvasOnDragLeave(canvasId, e) {
    pointEvent(dragLeaveFunctions, canvasId, e);
}

function canvasOnDragOver(canvasId, e) {
    pointEvent(dragOverFunctions, canvasId, e);
}

function canvasOnDragStart(canvasId, e) {
    pointEvent(dragStartFunctions, canvasId, e);
}

function canvasOnDrop(canvasId, e) {
    pointEvent(dropFunctions, canvasId, e);
}

function canvasOnMouseDown(canvasId, e) {
    doingMouseDown = 1;
    pointEvent(mouseDownFunctions, canvasId, e);
    doingMouseDown = 0;
}

function canvasOnMouseMove(canvasId, e) {
    pointEvent(mouseMoveFunctions, canvasId, e);
}

function canvasOnMouseOut(canvasId, e) {
    pointEvent(mouseOutFunctions, canvasId, e);
}

function canvasOnMouseOver(canvasId, e) {
    pointEvent(mouseOverFunctions, canvasId, e);
}

function canvasOnMouseUp(canvasId, e) {
    doingMouseUp = 1;
    pointEvent(mouseUpFunctions, canvasId, e);
    doingMouseUp = 0;
}

function canvasOnMouseWheel(canvasId, e) {
    pointEvent(mouseWheelFunctions, canvasId, e);
}

function canvasOnScroll(canvasId, e) {
    pointEvent(scrollFunctions, canvasId, e);
}

function registerCanvasElementId(canvasId) {
    var canvas = document.getElementById(canvasId);
    canvases.push([canvasId, canvas]);
    ctxs.push([canvasId, canvas.getContext('2d')]);
    canvas.onclick = function (e) { canvasOnClick(canvasId, e); };
    canvas.ondblclick = function (e) { canvasOnDblClick(canvasId, e); };
    canvas.addEventListener('ondrag', function (e) { canvasOnDrag(canvasId, e); });
    canvas.addEventListener('ondragend', function (e) {
        canvasOnDragEnd(canvasId, e);
    });
    canvas.addEventListener('ondragenter', function (e) {
        canvasOnDragEnter(canvasId, e);
    });
    canvas.addEventListener('ondragleave', function (e) {
        canvasOnDragLeave(canvasId, e);
    });
    canvas.addEventListener('ondragover', function (e) {
        canvasOnDragOver(canvasId, e);
    });
    canvas.addEventListener('ondragstart', function (e) {
        e.dataTransfer.setData('text/plain', 'Dragging');
        canvasOnDragStart(canvasId, e);
    });
    canvas.addEventListener('ondrop', function (e) { canvasOnDrop(canvasId, e); });
    canvas.onkeypress = function (e) {
        for (var i = 0; i < keyPressFunctions.length; i++) {
            for (var j = 0; j < windowIdWithFocus.length; j++) {
                if (windowIdWithFocus[j][0] == keyPressFunctions[i].CanvasID &&
                    windowIdWithFocus[j][1] == keyPressFunctions[i].WindowID) {
                    keyPressFunctions[i].KeyPressFunction(
                        keyPressFunctions[i].CanvasID, keyPressFunctions[i].WindowID, e);
                    var wprops = getWindowProps(keyPressFunctions[i].CanvasID,
                        keyPressFunctions[i].WindowID);
                    if (wprops) {
                        invalidateRect(keyPressFunctions[i].CanvasID, null,
                            wprops.X, wprops.Y, wprops.Width, wprops.Height);
                    }
                    if (e.preventDefault)
                        e.preventDefault();
                    e.returnValue = false;
                }
            }
        }
        return false;
    };
    canvas.onkeydown = function (e) {
        for (var i = 0; i < keyDownFunctions.length; i++) {
            for (var j = 0; j < windowIdWithFocus.length; j++) {
                if (e.keyCode == 9) {
                    var wprops = getWindowProps(windowIdWithFocus[j][0],
                        windowIdWithFocus[j][1]);
                    if (wprops.CanvasID == keyDownFunctions[i].CanvasID &&
                        wprops.WindowCount == keyDownFunctions[i].WindowID) {
                        if (wprops.ControlType != 'WordProcessor') {
                            var found = 0;
                            for (var k = 0; k < windows.length; k++) {
                                if (windows[k].WindowCount != wprops.WindowCount &&
                                    wprops.TabStopIndex + 1 == windows[k].TabStopIndex) {
                                    found = 1;
                                    windowIdWithFocus[j][1] = windows[k].WindowCount;
                                    for (var f = 0; f < lostFocusFunctions.length; f++) {
                                        if (lostFocusFunctions[f][0] == wprops.CanvasID &&
                                            lostFocusFunctions[f][1] == wprops.WindowCount &&
                                            lostFocusFunctions[f][1] !=
                                            windows[k].WindowCount) {
                                            lostFocusFunctions[f][2](canvasId,
                                                wprops.WindowCount);
                                        }
                                    }
                                    for (var f = 0; f < gotFocusFunctions.length; f++) {
                                        if (gotFocusFunctions[f][0] == wprops.CanvasID &&
                                            gotFocusFunctions[f][1] ==
                                            windows[k].WindowCount) {
                                            gotFocusFunctions[f][2](canvasId,
                                                windows[k].WindowCount);
                                        }
                                    }
                                    var can = getCanvas(windows[k].CanvasID);
                                    invalidateRect(windows[k].CanvasID, null, 0, 0,
                                        can.width, can.height);
                                    if (e.preventDefault)
                                        e.preventDefault();
                                    e.returnValue = false;
                                    return false;
                                }
                            }
                            if (found == 0) {
                                if (wprops.TabStopIndex != 1) {
                                    for (var k = 0; k < windows.length; k++) {
                                        if (windows[k].WindowCount != wprops.WindowCount &&
                                            windows[k].TabStopIndex == 1) {
                                            found = 1;
                                            windowIdWithFocus[j][1] = windows[k].WindowCount;
                                            for (var f = 0; f < lostFocusFunctions.length;
                                                f++) {
                                                if (lostFocusFunctions[f][0] ==
                                                    wprops.CanvasID &&
                                                    lostFocusFunctions[f][1] ==
                                                    wprops.WindowCount &&
                                                    lostFocusFunctions[f][1] !=
                                                    windows[k].WindowCount) {
                                                    lostFocusFunctions[f][2](
                                                        wprops.CanvasID, wprops.WindowCount);
                                                }
                                            }
                                            for (var f = 0; f < gotFocusFunctions.length; f++) {
                                                if (gotFocusFunctions[f][0] ==
                                                    wprops.CanvasID &&
                                                    gotFocusFunctions[f][1] ==
                                                    windows[k].WindowCount) {
                                                    gotFocusFunctions[f][2](
                                                        canvasId, windows[k].WindowCount);
                                                }
                                            }
                                            var can = getCanvas(windows[k].CanvasID);
                                            invalidateRect(windows[k].CanvasID, null,
                                                0, 0, can.width, can.height);
                                            if (e.preventDefault)
                                                e.preventDefault();
                                            e.returnValue = false;
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    } else if (wprops.MultiWindowControlsMainWindowId != null &&
                        wprops.MultiWindowControlsMainWindowId >= 0) {
                        wprops = getWindowProps(wprops.CanvasID,
                            wprops.MultiWindowControlsMainWindowId);
                        if (wprops.CanvasID == keyDownFunctions[i].CanvasID &&
                            wprops.WindowCount == keyDownFunctions[i].WindowID) {
                            if (wprops.ControlType != 'WordProcessor') {
                                var found = 0;
                                for (var k = 0; k < windows.length; k++) {
                                    if (windows[k].WindowCount != wprops.WindowCount &&
                                        wprops.TabStopIndex + 1 == windows[k].TabStopIndex) {
                                        found = 1;
                                        windowIdWithFocus[j][1] = windows[k].WindowCount;
                                        for (var f = 0; f < lostFocusFunctions.length; f++) {
                                            if (lostFocusFunctions[f][0] ==
                                                wprops.CanvasID &&
                                                lostFocusFunctions[f][1] ==
                                                wprops.WindowCount &&
                                                lostFocusFunctions[f][1] !=
                                                windows[k].WindowCount) {
                                                lostFocusFunctions[f][2](
                                                    canvasId, wprops.WindowCount);
                                            }
                                        }
                                        for (var f = 0; f < gotFocusFunctions.length; f++) {
                                            if (gotFocusFunctions[f][0] ==
                                                wprops.CanvasID &&
                                                gotFocusFunctions[f][1] ==
                                                windows[k].WindowCount) {
                                                gotFocusFunctions[f][2](
                                                    canvasId, windows[k].WindowCount);
                                            }
                                        }
                                        var can = getCanvas(windows[k].CanvasID);
                                        invalidateRect(windows[k].CanvasID, null, 0, 0,
                                            can.width, can.height);
                                        if (e.preventDefault)
                                            e.preventDefault();
                                        e.returnValue = false;
                                        return false;
                                    }
                                }
                                if (found == 0) {
                                    if (wprops.TabStopIndex != 1) {
                                        for (var k = 0; k < windows.length; k++) {
                                            if (windows[k].WindowCount !=
                                                wprops.WindowCount &&
                                                windows[k].TabStopIndex == 1) {
                                                found = 1;
                                                windowIdWithFocus[j][1] =
                                                    windows[k].WindowCount;
                                                for (var f = 0; f < lostFocusFunctions.length;
                                                    f++) {
                                                    if (lostFocusFunctions[f][0] ==
                                                        wprops.CanvasID &&
                                                        lostFocusFunctions[f][1] ==
                                                        wprops.WindowCount &&
                                                        lostFocusFunctions[f][1] !=
                                                        windows[k].WindowCount) {
                                                        lostFocusFunctions[f][2](
                                                            wprops.CanvasID,
                                                            wprops.WindowCount);
                                                    }
                                                }
                                                for (var f = 0; f < gotFocusFunctions.length;
                                                    f++) {
                                                    if (gotFocusFunctions[f][0] ==
                                                        wprops.CanvasID &&
                                                        gotFocusFunctions[f][1] ==
                                                        windows[k].WindowCount) {
                                                        gotFocusFunctions[f][2](
                                                            canvasId, windows[k].WindowCount);
                                                    }
                                                }
                                                var can = getCanvas(windows[k].CanvasID);
                                                invalidateRect(windows[k].CanvasID, null,
                                                    0, 0, can.width, can.height);
                                                if (e.preventDefault)
                                                    e.preventDefault();
                                                e.returnValue = false;
                                                return false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                if (windowIdWithFocus[j][0] == keyDownFunctions[i].CanvasID &&
                    windowIdWithFocus[j][1] == keyDownFunctions[i].WindowID) {
                    keyDownFunctions[i].KeyDownFunction(keyDownFunctions[i].CanvasID,
                        keyDownFunctions[i].WindowID, e);
                    var wprops = getWindowProps(keyDownFunctions[i].CanvasID,
                        keyDownFunctions[i].WindowID);
                    if (wprops) {
                        invalidateRect(keyDownFunctions[i].CanvasID, null, wprops.X,
                            wprops.Y, wprops.Width, wprops.Height);
                    }
                    if (e.preventDefault)
                        e.preventDefault();
                    e.returnValue = false;
                }
            }
        }
        return false;
    };
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipod') > -1) {
        canvas.addEventListener("touchstart", function (e) {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
            pointEvent(mouseDownFunctions, canvasId, e, null);
        }, false);
        canvas.addEventListener("touchmove", function (e) {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
            pointEvent(mouseMoveFunctions, canvasId, e, null);
        }, false);
        canvas.addEventListener("touchend", function (e) {
            e.pageX = e.touches[0].pageX;
            e.pageY = e.touches[0].pageY;
            pointEvent(mouseUpFunctions, canvasId, e, null, 1);
        }, false);
    } else {
        canvas.onmousedown = function (e) { canvasOnMouseDown(canvasId, e); };
        canvas.onmousemove = function (e) { canvasOnMouseMove(canvasId, e); };
        canvas.onmouseup = function (e) { canvasOnMouseUp(canvasId, e); };
        canvas.onmouseout = function (e) { canvasOnMouseOut(canvasId, e); };
        canvas.onmouseover = function (e) { canvasOnMouseOver(canvasId, e); };
        canvas.onmousewheel = function (e) { canvasOnMouseWheel(canvasId, e); };
        canvas.onscroll = function (e) { canvasOnScroll(canvasId, e); };
    }
}

function createWindow(canvasId, x, y, width, height, depth, parentwindowid,
    controlTypeNameString, controlNameId, multiWindowControlsMainWindowId, tabstopindex) {
    ++windowCount;
    windows.push({
        WindowCount: windowCount, X: x, Y: y, Width: width, Height: height,
        Depth: depth, CanvasID: canvasId, ParentWindowID: parentwindowid,
        ChildWindowIDs: new Array(),
        ControlType: controlTypeNameString, ControlNameID: controlNameId,
        MultiWindowControlsMainWindowId: multiWindowControlsMainWindowId,
        TabStopIndex: tabstopindex
    });
    return windowCount;
}

function getWindowControlPropsByWindowProps(windowProps) {
    switch (windowProps.ControlType) {
        case 'Panel':
            return getPanelProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Label":
            return getLabelProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Button":
            return getButtonProps(windowProps.CanvasID, windowProps.WindowCount);
        case "ScrollBar":
            return getScrollBarProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Grid":
            return getGridProps(windowProps.CanvasID, windowProps.WindowCount);
        case "ComboBoxTextArea":
            return getComboboxPropsByTextAreaWindowId(windowProps.CanvasID,
                windowProps.WindowCount);
        case "CheckBox":
            return getcheckboxProps(windowProps.CanvasID, windowProps.WindowCount);
        case "RadioButtonGroup":
            return getRadioButtonProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Image":
            return getImageControlProps(windowProps.CanvasID, windowProps.WindowCount);
        case "TreeView":
            return getTreeViewProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Calender":
            return getCalenderProps(windowProps.CanvasID, windowProps.WindowCount);
        case "ProgressBar":
            return getProgressBarProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Slider":
            return getSliderProps(windowProps.CanvasID, windowProps.WindowCount);
        case "DatePickerTextArea":
            return getDatePickerPropsByTextBoxAreaWindowID(windowProps.CanvasID,
                windowProps.WindowCount);
        case "BarGraph":
            return getBarGraphProps(windowProps.CanvasID, windowProps.WindowCount);
        case "PieChart":
            return getPieChartProps(windowProps.CanvasID, windowProps.WindowCount);
        case "LineGraph":
            return getLineGraphProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Gauge":
            return getGaugeChartProps(windowProps.CanvasID, windowProps.WindowCount);
        case "RadarGraph":
            return getRadarGraphProps(windowProps.CanvasID, windowProps.WindowCount);
        case "LineAreaGraph":
            return getLineAreaGraphProps(windowProps.CanvasID, windowProps.WindowCount);
        case "CandlesticksGraph":
            return getCandlesticksGraphProps(windowProps.CanvasID, windowProps.WindowCount);
        case "DoughnutChart":
            return getDoughnutChartProps(windowProps.CanvasID, windowProps.WindowCount);
        case "BarsMixedWithLabeledLineGraph":
            return getBarsMixedWithLabledLineGraphProps(windowProps.CanvasID,
                windowProps.WindowCount);
        case "StackedBarGraph":
            return getstackedBarGraphProps(windowProps.CanvasID, windowProps.WindowCount);
        case "Tab":
            return getTabProps(windowProps.CanvasID, windowProps.WindowCount);
        case "ImageMap":
            return getImageMapProps(windowProps.CanvasID, windowProps.WindowCount);
        case "SubMenu":
            return getSubMenuBarProps(windowProps.CanvasID, windowProps.WindowCount);
        case "MenuBar":
            return getMenuBarProps(windowProps.CanvasID, windowProps.WindowCount);
        case "TextBox":
            return getTextBoxProps(windowProps.CanvasID, windowProps.WindowCount);
        case "ImageFader":
            return getImageFaderProps(windowProps.CanvasID, windowProps.WindowCount);
        case "ImageSlider":
            return getImageSliderProps(windowProps.CanvasID, windowProps.WindowCount);
        case "MultiLineLabel":
            return getMultiLineLabelProps(windowProps.CanvasID, windowProps.WindowCount);
        case "WordProcessor":
            return getWordProcessorProps(windowProps.CanvasID, windowProps.WindowCount);
    }
}

function registerChildWindow(canvasid, windowid, parentwindowid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].WindowCount == parentwindowid) {
            windows[i].ChildWindowIDs.push(windowid);
            var wprops = getWindowProps(canvasid, windowid);
            if (wprops) {
                wprops.ParentWindowID = parentwindowid;
            }
        }
    }
}

function registerKeyPressFunction(canvasid, func, windowid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].CanvasID == canvasid && windows[i].WindowCount == windowid) {
            keyPressFunctions.push({
                CanvasID: canvasid, KeyPressFunction: func,
                WindowID: windowid
            });
        }
    }
}

function registerKeyDownFunction(canvasid, func, windowid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].CanvasID == canvasid && windows[i].WindowCount == windowid) {
            keyDownFunctions.push({
                CanvasID: canvasid, KeyDownFunction: func,
                WindowID: windowid
            });
        }
    }
}

function registerEvent(windowid, eventfunction, canvasId, eventfunctionarray) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].CanvasID == canvasId && windows[i].WindowCount == windowid) {
            eventfunctionarray.push([windowid, eventfunction, canvasId]);
        }
    }
}

function registerClickFunction(windowid, clickFunction, canvasId) {
    registerEvent(windowid, clickFunction, canvasId, clickFunctions);
}

function registerDoubleClickFunction(windowid, doubleClickFunction, canvasId) {
    registerEvent(windowid, doubleClickFunction, canvasId, doubleClickFunctions);
}

function registerDragFunction(windowid, dragFunction, canvasId) {
    registerEvent(windowid, dragFunction, canvasId, dragFunctions);
}

function registerDragEndFunction(windowid, dragEndFunction, canvasId) {
    registerEvent(windowid, dragEndFunction, canvasId, dragEndFunctions);
}

function registerDragEnterFunction(windowid, dragEnterFunction, canvasId) {
    registerEvent(windowid, dragEnterFunction, canvasId, dragEnterFunctions);
}

function registerDragLeaveFunction(windowid, dragLeaveFunction, canvasId) {
    registerEvent(windowid, dragLeaveFunction, canvasId, dragLeaveFunctions);
}

function registerDragOverFunction(windowid, dragOverFunction, canvasId) {
    registerEvent(windowid, dragOverFunction, canvasId, dragOverFunctions);
}

function registerDragStartFunction(windowid, dragStartFunction, canvasId) {
    registerEvent(windowid, dragStartFunction, canvasId, dragStartFunctions);
}

function registerDropFunction(windowid, dropFunction, canvasId) {
    registerEvent(windowid, dropFunction, canvasId, dropFunctions);
}

function registerMouseDownFunction(windowid, mouseDownFunction, canvasId) {
    registerEvent(windowid, mouseDownFunction, canvasId, mouseDownFunctions);
}

function registerMouseMoveFunction(windowid, mouseMoveFunction, canvasId) {
    registerEvent(windowid, mouseMoveFunction, canvasId, mouseMoveFunctions);
}

function registerMouseOutFunction(windowid, mouseOutFunction, canvasId) {
    registerEvent(windowid, mouseOutFunction, canvasId, mouseOutFunctions);
}

function registerMouseOverFunction(windowid, mouseOverFunction, canvasId) {
    registerEvent(windowid, mouseOverFunction, canvasId, mouseOverFunctions);
}

function registerMouseUpFunction(windowid, mouseUpFunction, canvasId) {
    registerEvent(windowid, mouseUpFunction, canvasId, mouseUpFunctions);
}

function registerMouseWheelFunction(windowid, mouseWheelFunction, canvasId) {
    registerEvent(windowid, mouseWheelFunction, canvasId, mouseWheelFunctions);
}

function registerScrollFunction(windowid, scrollFunction, canvasId) {
    registerEvent(windowid, scrollFunction, canvasId, scrollFunctions);
}

function registerWindowDrawFunction(windowid, windowDrawFunction, canvasId) {
    registerEvent(windowid, windowDrawFunction, canvasId, windowDrawFunctions);
}

function getWindowDepth(windowid, canvasid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].WindowCount == windowid && windows[i].CanvasID == canvasid) {
            return windows[i].Depth;
        }
    }
}

function setWindowDepth(canvasid, windowid, depth) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].WindowCount == windowid && windows[i].CanvasID == canvasid) {
            windows[i].Depth = depth;
            if (depth > highestDepth)
                highestDepth = depth;
            return;
        }
    }
}

function checkIfModalWindow(canvasid, windowid) {
    for (var i = 0; i < modalWindows.length; i++) {
        if (modalWindows[i].CanvasID == canvasid && modalWindows[i].WindowID == windowid) {
            return 1;
        }
    }
    return 0;
}

function registerModalWindow(canvasid, windowid) {
    modalWindows.push({ CanvasID: canvasid, WindowID: windowid });
}

function checkIfHiddenWindow(canvasid, windowid) {
    for (var i = 0; i < hiddenWindows.length; i++) {
        if (hiddenWindows[i].CanvasID == canvasid && hiddenWindows[i].WindowID == windowid) {
            return hiddenWindows[i].HiddenStatus;
        }
    }
    return 0;
}

function registerHiddenWindow(canvasid, windowid, status) {
    hiddenWindows.push({ CanvasID: canvasid, WindowID: windowid, HiddenStatus: status });
}

function setHiddenWindowStatus(canvasid, windowid, status) {
    for (var i = 0; i < hiddenWindows.length; i++) {
        if (hiddenWindows[i].HiddenStatus != status && hiddenWindows[i].CanvasID ==
            canvasid && hiddenWindows[i].WindowID == windowid) {
            hiddenWindows[i].HiddenStatus = status;
        }
    }
}

function registerLostFocusFunction(canvasid, windowid, func) {
    lostFocusFunctions.push([canvasid, windowid, func]);
}

function registerGotFocusFunction(canvasid, windowid, func) {
    gotFocusFunctions.push([canvasid, windowid, func]);
}

function getWindowProps(canvasid, windowid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].CanvasID == canvasid && windows[i].WindowCount == windowid) {
            return windows[i];
        }
    }
}

function invalidateRect(canvasId, parentwindowid, x, y, width, height) {
    if (suspendDraw == 0) {
        var canvas = getCanvas(canvasId);
        if (parentwindowid == null) {
            getCtx(canvasId).clearRect(x, y, width, height);
        }
        for (var d = 0; d <= highestDepth; d++) {
            for (var i = 0; i < windowDrawFunctions.length; i++) {
                var windowProps = getWindowProps(canvasId, windowDrawFunctions[i][0]);
                if (windowProps && windowProps.ParentWindowID == parentwindowid &&
                    checkIfHiddenWindow(canvasId, windowDrawFunctions[i][0]) == 0 &&
                    checkIfModalWindow(canvasId, windowDrawFunctions[i][0]) == 0 &&
                    getWindowDepth(windowDrawFunctions[i][0], windowDrawFunctions[i][2])
                    == d && windowDrawFunctions[i][2] == canvasId &&
                    x < windowProps.X + windowProps.Width && x + width > windowProps.X
                    && y < windowProps.Y + windowProps.Height && y +
                    height > windowProps.Y) {
                    var ctx = getCtx(canvasId);
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(windowProps.X, windowProps.Y, windowProps.Width,
                        windowProps.Height);
                    ctx.clip();
                    windowDrawFunctions[i][1](canvasId, windowDrawFunctions[i][0]);
                    if (windowProps.ChildWindowIDs &&
                        windowProps.ChildWindowIDs.length > 0) {
                        invalidateRect(canvasId, windowDrawFunctions[i][0], x, y,
                            width, height);
                    }
                    ctx.restore();
                }
            }
        }
        for (var d = 0; d <= highestDepth; d++) {
            for (var i = 0; i < windowDrawFunctions.length; i++) {
                var windowProps = getWindowProps(canvasId, windowDrawFunctions[i][0]);
                if (windowProps && windowProps.ParentWindowID == parentwindowid &&
                    checkIfHiddenWindow(canvasId, windowDrawFunctions[i][0]) == 0 &&
                    checkIfModalWindow(canvasId, windowDrawFunctions[i][0]) == 1 &&
                    getWindowDepth(windowDrawFunctions[i][0],
                        windowDrawFunctions[i][2]) == d && windowDrawFunctions[i][2] ==
                    canvasId &&
                    x < windowProps.X + windowProps.Width && x + width >
                    windowProps.X && y < windowProps.Y + windowProps.Height &&
                    y + height > windowProps.Y) {
                    var ctx = getCtx(canvasId);
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(windowProps.X, windowProps.Y, windowProps.Width,
                        windowProps.Height);
                    ctx.clip();
                    windowDrawFunctions[i][1](canvasId, windowDrawFunctions[i][0]);
                    if (windowProps.ChildWindowIDs && windowProps.ChildWindowIDs.length > 0) {
                        invalidateRect(canvasId, windowDrawFunctions[i][0], x, y,
                            width, height);
                    }
                    ctx.restore();
                }
            }
        }
    }
}

function getCtx(canvasId) {
    for (var i = 0; i < ctxs.length; i++) {
        if (ctxs[i][0] == canvasId) {
            return ctxs[i][1];
        }
    }
}

function getCanvas(canvasId) {
    for (var i = 0; i < canvases.length; i++) {
        if (canvases[i][0] == canvasId) {
            return canvases[i][1];
        }
    }
}

function destroyControl(canvasid, windowid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].CanvasID == canvasid && windows[i].WindowCount == windowid) {
            destroyControlByWindowObj(windows[i]);
        }
    }
}

function destroyControlByNameID(controlNameID) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].ControlNameID == controlNameID) {
            destroyControlByWindowObj(windows[i]);
        }
    }
}

function destroyWindow(canvasid, windowid) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].CanvasID == canvasid && windows[i].WindowCount == windowid) {
            removeEventHooks(windows[i]);
            windows.splice(i, 1);
            unregisterAnimatedWindow(canvasid, windowid);
        }
    }
}

function removeEventFunctions(eventarr, canvasid, windowid) {
    for (var i = eventarr.length - 1; i >= 0; i--) {
        if (eventarr[i][2] == canvasid && eventarr[i][0] == windowid) {
            eventarr.splice(i, 1);
        }
    }
}

function removeEventHooks(w) {
    removeEventFunctions(clickFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(doubleClickFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dragFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dragEndFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dragEnterFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dragLeaveFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dragOverFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dragStartFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(dropFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(mouseDownFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(mouseMoveFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(mouseOutFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(mouseOverFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(mouseUpFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(mouseWheelFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(scrollFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(windowDrawFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(gotFocusFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(lostFocusFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(keyPressFunctions, w.CanvasID, w.WindowCount);
    removeEventFunctions(keyDownFunctions, w.CanvasID, w.WindowCount);
}

function destroyControlByWindowObj(w) {
    for (var i = 0; w.ChildWindowIDs && i < w.ChildWindowIDs.length; i++) {
        for (var x = 0; x < windows.length; x++) {
            if (windows[x].CanvasID == w.CanvasID && windows[x].WindowID ==
                w.ChildWindowIDs[i]) {
                destroyControlByWindowObj(windows[x]);
            }
        }
    }
    switch (w.ControlType) {
        case "Label":
            for (var i = labelPropsArray.length - 1; i >= 0 ; i--) {
                if (labelPropsArray[i].CanvasID == w.CanvasID &&
                    labelPropsArray[i].WindowID == w.WindowCount) {
                    labelPropsArray.splice(i, 1);
                }
            }
            break;
        case "Button":
            for (var i = buttonPropsArray.length - 1; i >= 0 ; i--) {
                if (buttonPropsArray[i].CanvasID == w.CanvasID &&
                    buttonPropsArray[i].WindowID == w.WindowCount) {
                    buttonPropsArray.splice(i, 1);
                }
            }
            break;
        case "ScrollBar":
            for (var i = scrollBarPropsArray.length - 1; i >= 0 ; i--) {
                if (scrollBarPropsArray[i].CanvasID == w.CanvasID &&
                    scrollBarPropsArray[i].WindowID == w.WindowCount) {
                    scrollBarPropsArray.splice(i, 1);
                }
            }
            break;
        case "Grid":
            for (var i = gridPropsArray.length - 1; i >= 0 ; i--) {
                if (gridPropsArray[i].CanvasID == w.CanvasID &&
                    gridPropsArray[i].WindowID == w.WindowCount) {
                    gridPropsArray.splice(i, 1);
                }
            }
            break;
        case "ComboBoxTextArea":
            for (var i = comboboxPropsArray.length - 1; i >= 0 ; i--) {
                if (comboboxPropsArray[i].CanvasID == w.CanvasID &&
                    comboboxPropsArray[i].WindowID == w.WindowCount) {
                    destroyWindow(w.CanvasID, comboboxPropsArray[i].ButtonWindowID);
                    destroyWindow(w.CanvasID, comboboxPropsArray[i].ListAreaWindowID);
                    comboboxPropsArray.splice(i, 1);
                }
            }
            break;
        case "CheckBox":
            for (var i = checkboxPropsArray.length - 1; i >= 0 ; i--) {
                if (checkboxPropsArray[i].CanvasID == w.CanvasID &&
                    checkboxPropsArray[i].WindowID == w.WindowCount) {
                    checkboxPropsArray.splice(i, 1);
                }
            }
            break;
        case "RadioButtonGroup":
            for (var i = radiobuttonPropsArray.length - 1; i >= 0 ; i--) {
                if (radiobuttonPropsArray[i].CanvasID == w.CanvasID &&
                    radiobuttonPropsArray[i].WindowID == w.WindowCount) {
                    radiobuttonPropsArray.splice(i, 1);
                }
            }
            break;
        case "Image":
            for (var i = imageControlPropsArray.length - 1; i >= 0 ; i--) {
                if (imageControlPropsArray[i].CanvasID == w.CanvasID &&
                    imageControlPropsArray[i].WindowID == w.WindowCount) {
                    imageControlPropsArray.splice(i, 1);
                }
            }
            break;
        case "TreeView":
            for (var i = treeViewPropsArray.length - 1; i >= 0 ; i--) {
                if (treeViewPropsArray[i].CanvasID == w.CanvasID &&
                    treeViewPropsArray[i].WindowID == w.WindowCount) {
                    treeViewPropsArray.splice(i, 1);
                }
            }
            break;
        case "Calender":
            for (var i = calenderPropsArray.length - 1; i >= 0 ; i--) {
                if (calenderPropsArray[i].CanvasID == w.CanvasID &&
                    calenderPropsArray[i].WindowID == w.WindowCount) {
                    calenderPropsArray.splice(i, 1);
                }
            }
            break;
        case "ProgressBar":
            for (var i = progressBarPropsArray.length - 1; i >= 0 ; i--) {
                if (progressBarPropsArray[i].CanvasID == w.CanvasID &&
                    progressBarPropsArray[i].WindowID == w.WindowCount) {
                    progressBarPropsArray.splice(i, 1);
                }
            }
            break;
        case "Slider":
            for (var i = sliderPropsArray.length - 1; i >= 0 ; i--) {
                if (sliderPropsArray[i].CanvasID == w.CanvasID &&
                    sliderPropsArray[i].WindowID == w.WindowCount) {
                    sliderPropsArray.splice(i, 1);
                }
            }
            break;
        case "DatePickerTextArea":
            for (var i = datePickerPropsArray.length - 1; i >= 0 ; i--) {
                if (datePickerPropsArray[i].CanvasID == w.CanvasID &&
                    datePickerPropsArray[i].WindowID == w.WindowCount) {
                    destroyWindow(w.CanvasID, datePickerPropsArray[i].ButtonWindowID);
                    destroyControl(w.CanvasID, datePickerPropsArray[i].CalenderWindowID);
                    datePickerPropsArray.splice(i, 1);
                }
            }
            break;
        case "Panel":
            for (var i = panelPropsArray.length - 1; i >= 0 ; i--) {
                if (panelPropsArray[i].CanvasID == w.CanvasID &&
                    panelPropsArray[i].WindowID == w.WindowCount) {
                    panelPropsArray.splice(i, 1);
                }
            }
            break;
        case "BarGraph":
            for (var i = barGraphsPropsArray.length - 1; i >= 0 ; i--) {
                if (barGraphsPropsArray[i].CanvasID == w.CanvasID &&
                    barGraphsPropsArray[i].WindowID == w.WindowCount) {
                    barGraphsPropsArray.splice(i, 1);
                }
            }
            break;
        case "PieChart":
            for (var i = pieChartsPropsArray.length - 1; i >= 0 ; i--) {
                if (pieChartsPropsArray[i].CanvasID == w.CanvasID &&
                    pieChartsPropsArray[i].WindowID == w.WindowCount) {
                    pieChartsPropsArray.splice(i, 1);
                }
            }
            break;
        case "LineGraph":
            for (var i = lineGraphsPropsArray.length - 1; i >= 0 ; i--) {
                if (lineGraphsPropsArray[i].CanvasID == w.CanvasID &&
                    lineGraphsPropsArray[i].WindowID == w.WindowCount) {
                    lineGraphsPropsArray.splice(i, 1);
                }
            }
            break;
        case "Gauge":
            for (var i = gaugeChartPropsArray.length - 1; i >= 0 ; i--) {
                if (gaugeChartPropsArray[i].CanvasID == w.CanvasID &&
                    gaugeChartPropsArray[i].WindowID == w.WindowCount) {
                    gaugeChartPropsArray.splice(i, 1);
                }
            }
            break;
        case "RadarGraph":
            for (var i = radarGraphPropsArray.length - 1; i >= 0 ; i--) {
                if (radarGraphPropsArray[i].CanvasID == w.CanvasID &&
                    radarGraphPropsArray[i].WindowID == w.WindowCount) {
                    radarGraphPropsArray.splice(i, 1);
                }
            }
            break;
        case "LineAreaGraph":
            for (var i = lineAreaGraphPropsArray.length - 1; i >= 0 ; i--) {
                if (lineAreaGraphPropsArray[i].CanvasID == w.CanvasID &&
                    lineAreaGraphPropsArray[i].WindowID == w.WindowCount) {
                    lineAreaGraphPropsArray.splice(i, 1);
                }
            }
            break;
        case "CandlesticksGraph":
            for (var i = candlesticksGraphPropsArray.length - 1; i >= 0 ; i--) {
                if (candlesticksGraphPropsArray[i].CanvasID == w.CanvasID &&
                    candlesticksGraphPropsArray[i].WindowID == w.WindowCount) {
                    candlesticksGraphPropsArray.splice(i, 1);
                }
            }
            break;
        case "DoughnutChart":
            for (var i = doughnutChartPropsArray.length - 1; i >= 0 ; i--) {
                if (doughnutChartPropsArray[i].CanvasID == w.CanvasID &&
                    doughnutChartPropsArray[i].WindowID == w.WindowCount) {
                    doughnutChartPropsArray.splice(i, 1);
                }
            }
            break;
        case "BarsMixedWithLabeledLineGraph":
            for (var i = barsMixedWithLabledLineGraphsPropsArray.length - 1;
                i >= 0; i--) {
                if (barsMixedWithLabledLineGraphsPropsArray[i].CanvasID ==
                    w.CanvasID && barsMixedWithLabledLineGraphsPropsArray[i].WindowID
                    == w.WindowCount) {
                    barsMixedWithLabledLineGraphsPropsArray.splice(i, 1);
                }
            }
            break;
        case "StackedBarGraph":
            for (var i = stackedBarGraphPropsArray.length - 1; i >= 0 ; i--) {
                if (stackedBarGraphPropsArray[i].CanvasID == w.CanvasID &&
                    stackedBarGraphPropsArray[i].WindowID == w.WindowCount) {
                    stackedBarGraphPropsArray.splice(i, 1);
                }
            }
            break;
        case "Tab":
            for (var i = tabPropsArray.length - 1; i >= 0 ; i--) {
                if (tabPropsArray[i].CanvasID == w.CanvasID &&
                    tabPropsArray[i].WindowID == w.WindowCount) {
                    tabPropsArray.splice(i, 1);
                }
            }
            break;
        case "ImageMap":
            for (var i = imageMapPropsArray.length - 1; i >= 0 ; i--) {
                if (imageMapPropsArray[i].CanvasID == w.CanvasID &&
                    imageMapPropsArray[i].WindowID == w.WindowCount) {
                    imageMapPropsArray.splice(i, 1);
                }
            }
            break;
        case "SubMenu":
            for (var i = subMenuBarPropsArray.length - 1; i >= 0 ; i--) {
                if (subMenuBarPropsArray[i].CanvasID == w.CanvasID &&
                    subMenuBarPropsArray[i].WindowID == w.WindowCount) {
                    for (var y = 0; y < subMenuBarPropsArray[i].ChildMenuWindowIDs.length;
                        y++) {
                        destroyControl(w.CanvasID,
                            subMenuBarPropsArray[i].ChildMenuWindowIDs[y]);
                    }
                    subMenuBarPropsArray.splice(i, 1);
                }
            }
            break;
        case "MenuBar":
            for (var i = menuBarPropsArray.length - 1; i >= 0 ; i--) {
                if (menuBarPropsArray[i].CanvasID == w.CanvasID &&
                    menuBarPropsArray[i].WindowID == w.WindowCount) {
                    for (var y = 0; y < menuBarPropsArray[i].ChildMenuWindowIDs.length;
                        y++) {
                        destroyControl(w.CanvasID,
                            menuBarPropsArray[i].ChildMenuWindowIDs[y]);
                    }
                    menuBarPropsArray.splice(i, 1);
                }
            }
            break;
        case "TextBox":
            for (var i = textBoxPropsArray.length - 1; i >= 0 ; i--) {
                if (textBoxPropsArray[i].CanvasID == w.CanvasID &&
                    textBoxPropsArray[i].WindowID == w.WindowCount) {
                    textBoxPropsArray.splice(i, 1);
                }
            }
            break;
        case "ImageFader":
            for (var i = imageFaderPropsArray.length - 1; i >= 0 ; i--) {
                if (imageFaderPropsArray[i].CanvasID == w.CanvasID &&
                    imageFaderPropsArray[i].WindowID == w.WindowCount) {
                    imageFaderPropsArray.splice(i, 1);
                }
            }
            break;
        case "ImageSlider":
            for (var i = imageSliderPropsArray.length - 1; i >= 0 ; i--) {
                if (imageSliderPropsArray[i].CanvasID == w.CanvasID &&
                    imageSliderPropsArray[i].WindowID == w.WindowCount) {
                    imageSliderPropsArray.splice(i, 1);
                }
            }
            break;
        case "MultiLineLabel":
            for (var i = multiLineLabelPropsArray.length - 1; i >= 0 ; i--) {
                if (multiLineLabelPropsArray[i].CanvasID == w.CanvasID &&
                    multiLineLabelPropsArray[i].WindowID == w.WindowCount) {
                    multiLineLabelPropsArray.splice(i, 1);
                }
            }
            break;
        case "WordProcessor":
            for (var i = wordProcessorPropsArray.length - 1; i >= 0 ; i--) {
                if (wordProcessorPropsArray[i].CanvasID == w.CanvasID &&
                    wordProcessorPropsArray[i].WindowID == w.WindowCount) {
                    wordProcessorPropsArray.splice(i, 1);
                }
            }
            break;
        case "VirtualKeyboard":
            for (var i = virtualKeyboardPropsArray.length - 1; i >= 0 ; i--) {
                if (virtualKeyboardPropsArray[i].CanvasID == w.CanvasID &&
                    virtualKeyboardPropsArray[i].WindowID == w.WindowCount) {
                    virtualKeyboardPropsArray.splice(i, 1);
                }
            }
            break;
        case "Splitter":
            for (var i = splitterPropsArray.length - 1; i >= 0 ; i--) {
                if (splitterPropsArray[i].CanvasID == w.CanvasID &&
                    splitterPropsArray[i].WindowID == w.WindowCount) {
                    splitterPropsArray.splice(i, 1);
                }
            }
            break;
    }
    destroyWindow(w.CanvasID, w.WindowCount);
}

function getWindowByControlNameID(controlNameID) {
    for (var i = 0; i < windows.length; i++) {
        if (windows[i].ControlNameID == controlNameID) {
            return windows[i];
        }
    }
}

