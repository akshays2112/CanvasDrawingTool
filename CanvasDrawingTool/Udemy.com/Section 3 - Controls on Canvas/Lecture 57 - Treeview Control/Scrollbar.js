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

//Code for Scrollbar
var scrollBarPropsArray = new Array();

function getScrollBarProps(canvasid, windowid) {
    for (var i = 0; i < scrollBarPropsArray.length; i++) {
        if (scrollBarPropsArray[i].CanvasID === canvasid &&
            scrollBarPropsArray[i].WindowID === windowid) {
            return scrollBarPropsArray[i];
        }
    }
}

function drawScrollBar(canvasid, windowid) {
    var scrollBarProps = getScrollBarProps(canvasid, windowid);
    var x = scrollBarProps.X, y = scrollBarProps.Y, len = scrollBarProps.Len,
        maxitems = scrollBarProps.MaxItems === 0 ? 1 : scrollBarProps.MaxItems,
        selindex = scrollBarProps.SelectedID;
    var ctx = getCtx(canvasid);
    if (scrollBarProps.Alignment === 1) {
        ctx.clearRect(scrollBarProps.X, scrollBarProps.Y, 15, scrollBarProps.Len);
        var g = ctx.createLinearGradient(x, y, x + 15, y);
        g.addColorStop(0, '#e3e3e3');
        g.addColorStop(0.5, '#ededed');
        g.addColorStop(1, '#e5e5e5');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.rect(x, y, 15, len);
        ctx.fill();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = '#3c7fb1';
        ctx.beginPath();
        ctx.rect(x, y, 15, 15);
        ctx.stroke();
        ctx.fillStyle = '#dcf0fb';
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, 6, 13);
        ctx.fill();
        ctx.fillStyle = '#a7d8f3';
        ctx.beginPath();
        ctx.rect(x + 8, y + 1, 6, 13);
        ctx.fill();
        ctx.strokeStyle = '#c0e4f8';
        ctx.beginPath();
        ctx.moveTo(x + 7, y + 1);
        ctx.lineTo(x + 7, y + 14);
        ctx.stroke();
        var g2 = ctx.createLinearGradient(x + 7, y + 6, x + 7, y + 10);
        g2.addColorStop(0, '#4e9ac4');
        g2.addColorStop(1, '#0d2a3a');
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.moveTo(x + 8, y + 6);
        ctx.lineTo(x + 11, y + 10);
        ctx.lineTo(x + 4, y + 10);
        ctx.closePath();
        ctx.fill();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = '#3c7fb1';
        ctx.beginPath();
        ctx.rect(x, y + len - 15, 15, 15);
        ctx.stroke();
        ctx.fillStyle = '#dcf0fb';
        ctx.beginPath();
        ctx.rect(x + 1, y + len - 15 + 1, 6, 13);
        ctx.fill();
        ctx.fillStyle = '#a7d8f3';
        ctx.beginPath();
        ctx.rect(x + 8, y + len - 15 + 1, 6, 13);
        ctx.fill();
        ctx.strokeStyle = '#c0e4f8';
        ctx.beginPath();
        ctx.moveTo(x + 7, y + len - 15 + 1);
        ctx.lineTo(x + 7, y + len - 15 + 14);
        ctx.stroke();
        var g3 = ctx.createLinearGradient(x + 7, y + len - 15 + 6, x + 7, y + len - 15 + 10);
        g3.addColorStop(0, '#0d2a3a');
        g3.addColorStop(1, '#4e9ac4');
        ctx.fillStyle = g3;
        ctx.beginPath();
        ctx.moveTo(x + 4, y + len - 15 + 6);
        ctx.lineTo(x + 11, y + len - 15 + 6);
        ctx.lineTo(x + 7, y + len - 15 + 10);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#15598a';
        ctx.beginPath();
        ctx.rect(x, y + selindex * (len - 55) / maxitems + 16, 15, 25);
        ctx.stroke();
        ctx.fillStyle = '#6ac1e5';
        ctx.beginPath();
        ctx.rect(x + 8, y + selindex * (len - 55) / maxitems + 16 + 1, 6, 23);
        ctx.fill();
        ctx.fillStyle = '#b7e4f7';
        ctx.beginPath();
        ctx.rect(x + 1, y + selindex * (len - 55) / maxitems + 16 + 1, 6, 23);
        ctx.fill();
        ctx.strokeStyle = '#8fd5f3';
        ctx.beginPath();
        ctx.moveTo(x + 8, y + selindex * (len - 55) / maxitems + 16 + 1);
        ctx.lineTo(x + 8, y + selindex * (len - 55) / maxitems + 16 + 22);
        ctx.stroke();
        var g4 = ctx.createLinearGradient(x + 4, y + selindex * (len - 55) /
            maxitems + 16 + 8, x + 10, y + selindex * (len - 55) / maxitems +
            16 + 8);
        g4.addColorStop(0, '#2b404b');
        g4.addColorStop(1, '#5888a1');
        ctx.strokeStyle = g4;
        ctx.beginPath();
        ctx.moveTo(x + 4, y + selindex * (len - 55) / maxitems + 16 + 8);
        ctx.lineTo(x + 10, y + selindex * (len - 55) / maxitems + 16 + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 4, y + selindex * (len - 55) / maxitems + 16 + 11);
        ctx.lineTo(x + 10, y + selindex * (len - 55) / maxitems + 16 + 11);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 4, y + selindex * (len - 55) / maxitems + 16 + 14);
        ctx.lineTo(x + 10, y + selindex * (len - 55) / maxitems + 16 + 14);
        ctx.stroke();
        var g5 = ctx.createLinearGradient(x + 4, y + selindex * (len - 55) /
            maxitems + 16 + 8, x + 10, y + selindex * (len - 55) / maxitems +
            16 + 8);
        g5.addColorStop(0, '#447791');
        g5.addColorStop(1, '#96bed3');
        ctx.strokeStyle = g5;
        ctx.beginPath();
        ctx.moveTo(x + 4, y + selindex * (len - 55) / maxitems + 16 + 9);
        ctx.lineTo(x + 10, y + selindex * (len - 55) / maxitems + 16 + 9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 4, y + selindex * (len - 55) / maxitems + 16 + 12);
        ctx.lineTo(x + 10, y + selindex * (len - 55) / maxitems + 16 + 12);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 4, y + selindex * (len - 55) / maxitems + 16 + 15);
        ctx.lineTo(x + 10, y + selindex * (len - 55) / maxitems + 16 + 15);
        ctx.stroke();
    } else {
        ctx.clearRect(scrollBarProps.X, scrollBarProps.Y, scrollBarProps.Len, 15);
        var g6 = ctx.createLinearGradient(x, y, x, y + 15);
        g6.addColorStop(0, '#e3e3e3');
        g6.addColorStop(0.5, '#ededed');
        g6.addColorStop(1, '#e5e5e5');
        ctx.fillStyle = g6;
        ctx.beginPath();
        ctx.rect(x, y, len, 15);
        ctx.fill();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = '#3c7fb1';
        ctx.beginPath();
        ctx.rect(x, y, 15, 15);
        ctx.stroke();
        ctx.fillStyle = '#dcf0fb';
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, 13, 6);
        ctx.fill();
        ctx.fillStyle = '#a7d8f3';
        ctx.beginPath();
        ctx.rect(x + 1, y + 8, 13, 6);
        ctx.fill();
        ctx.strokeStyle = '#c0e4f8';
        ctx.beginPath();
        ctx.moveTo(x + 1, y + 7);
        ctx.lineTo(x + 14, y + 7);
        ctx.stroke();
        var g7 = ctx.createLinearGradient(x + 6, y + 7, x + 10, y + 7);
        g7.addColorStop(0, '#4e9ac4');
        g7.addColorStop(1, '#0d2a3a');
        ctx.fillStyle = g7;
        ctx.beginPath();
        ctx.moveTo(x + 6, y + 8);
        ctx.lineTo(x + 10, y + 11);
        ctx.lineTo(x + 10, y + 4);
        ctx.closePath();
        ctx.fill();
        ctx.lineCap = 'butt';
        ctx.strokeStyle = '#3c7fb1';
        ctx.beginPath();
        ctx.rect(x + len - 15, y, 15, 15);
        ctx.stroke();
        ctx.fillStyle = '#dcf0fb';
        ctx.beginPath();
        ctx.rect(x + len - 15 + 1, y, 13, 6);
        ctx.fill();
        ctx.fillStyle = '#a7d8f3';
        ctx.beginPath();
        ctx.rect(x + len - 15 + 1, y + 8, 13, 6);
        ctx.fill();
        ctx.strokeStyle = '#c0e4f8';
        ctx.beginPath();
        ctx.moveTo(x + len - 15 + 1, y + 7);
        ctx.lineTo(x + len - 1, y + 7);
        ctx.stroke();
        var g8 = ctx.createLinearGradient(x + len - 15 + 6, y + 7, x + len -
            15 + 10, y + 7);
        g8.addColorStop(0, '#0d2a3a');
        g8.addColorStop(1, '#4e9ac4');
        ctx.fillStyle = g8;
        ctx.beginPath();
        ctx.moveTo(x + len - 15 + 6, y + 4);
        ctx.lineTo(x + len - 15 + 10, y + 8);
        ctx.lineTo(x + len - 15 + 6, y + 11);
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#15598a';
        ctx.beginPath();
        ctx.rect(x + selindex * (len - 55) / maxitems + 16, y, 25, 15);
        ctx.stroke();
        ctx.fillStyle = '#6ac1e5';
        ctx.beginPath();
        ctx.rect(x + selindex * (len - 55) / maxitems + 16 + 1, y + 8, 23, 6);
        ctx.fill();
        ctx.fillStyle = '#b7e4f7';
        ctx.beginPath();
        ctx.rect(x + selindex * (len - 55) / maxitems + 16 + 1, y + 1, 23, 6);
        ctx.fill();
        ctx.strokeStyle = '#8fd5f3';
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 1, y + 8);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 22, y + 8);
        ctx.stroke();
        var g9 = ctx.createLinearGradient(x + selindex * (len - 55) / maxitems +
            16 + 8, y + 4, x + selindex * (len - 55) / maxitems + 16 + 8,
            y + 10);
        g9.addColorStop(0, '#2b404b');
        g9.addColorStop(1, '#5888a1');
        ctx.strokeStyle = g9;
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 8, y + 4);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 8, y + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 11, y + 4);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 11, y + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 14, y + 4);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 14, y + 10);
        ctx.stroke();
        var g10 = ctx.createLinearGradient(x + selindex * (len - 55) / maxitems +
            16 + 8, y + 4, x + selindex * (len - 55) / maxitems + 16 + 8,
            y + 10);
        g10.addColorStop(0, '#447791');
        g10.addColorStop(1, '#96bed3');
        ctx.strokeStyle = g10;
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 9, y + 4);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 9, y + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 12, y + 4);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 12, y + 10);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + selindex * (len - 55) / maxitems + 16 + 15, y + 4);
        ctx.lineTo(x + selindex * (len - 55) / maxitems + 16 + 15, y + 10);
        ctx.stroke();
    }
}

function scrollBarClick(canvasid, windowid, e) {
    var scrollBarProps = getScrollBarProps(canvasid, windowid);
    var xm = e.calcX;
    var ym = e.calcY;
    if (scrollBarProps.Alignment === 1) {
        if (xm > scrollBarProps.X && xm < scrollBarProps.X + 15 && ym >
            scrollBarProps.Y && ym < scrollBarProps.Y + 15 &&
            scrollBarProps.SelectedID - 1 >= 0) {
            if (scrollBarProps.CustomIncrementFunction) {
                scrollBarProps.CustomIncrementFunction(getSelectedTag(
                    scrollBarProps.CanvasID, scrollBarProps.WindowID),
                    scrollBarProps, 0);
            }
            --scrollBarProps.SelectedID;
        } else if (xm > scrollBarProps.X && xm < scrollBarProps.X + 15 &&
            ym > scrollBarProps.Y + scrollBarProps.Len - 15 &&
            ym < scrollBarProps.Y + scrollBarProps.Len &&
            scrollBarProps.SelectedID + 1 < scrollBarProps.MaxItems) {
            if (scrollBarProps.CustomIncrementFunction) {
                scrollBarProps.CustomIncrementFunction(getSelectedTag(
                    scrollBarProps.CanvasID, scrollBarProps.WindowID),
                    scrollBarProps, 1);
            }
            ++scrollBarProps.SelectedID;
        }
    } else {
        if (xm > scrollBarProps.X && xm < scrollBarProps.X + 15 &&
            ym > scrollBarProps.Y && ym < scrollBarProps.Y + 15 &&
            scrollBarProps.SelectedID - 1 >= 0) {
            if (scrollBarProps.CustomIncrementFunction) {
                scrollBarProps.CustomIncrementFunction(getSelectedTag(
                    scrollBarProps.CanvasID, scrollBarProps.WindowID),
                    scrollBarProps, 0);
            }
            --scrollBarProps.SelectedID;
        } else if (xm > scrollBarProps.X + scrollBarProps.Len - 15 &&
            xm < scrollBarProps.X + scrollBarProps.Len &&
            ym > scrollBarProps.Y && ym < scrollBarProps.Y + 15 &&
            scrollBarProps.SelectedID + 1 < scrollBarProps.MaxItems) {
            if (scrollBarProps.CustomIncrementFunction) {
                scrollBarProps.CustomIncrementFunction(getSelectedTag(
                    scrollBarProps.CanvasID, scrollBarProps.WindowID),
                    scrollBarProps, 1);
            }
            ++scrollBarProps.SelectedID;
        }
    }
    var wprops = getWindowProps(canvasid, scrollBarProps.OwnedByWindowID);
    if (wprops) {
        invalidateRect(canvasid, null, wprops.X, wprops.Y, wprops.Width, wprops.Height);
    }
}

function scrollBarMouseDown(canvasid, windowid, e) {
    var scrollBarProps = getScrollBarProps(canvasid, windowid);
    var x = e.calcX;
    var y = e.calcY;
    if (scrollBarProps.Alignment === 1) {
        if (x > scrollBarProps.X && x < scrollBarProps.X + 15 && y > scrollBarProps.Y +
            scrollBarProps.SelectedID * (scrollBarProps.Len - 55) /
            scrollBarProps.MaxItems + 16 &&
            y < scrollBarProps.Y + scrollBarProps.SelectedID *
            (scrollBarProps.Len - 55) / scrollBarProps.MaxItems + 16 + 25) {
            scrollBarProps.MouseDownState = 1;
        }
    } else {
        if (y > scrollBarProps.Y && y < scrollBarProps.Y + 15 && x > scrollBarProps.X +
            scrollBarProps.SelectedID * (scrollBarProps.Len - 55) /
            scrollBarProps.MaxItems + 16 &&
            x < scrollBarProps.X + scrollBarProps.SelectedID *
            (scrollBarProps.Len - 55) / scrollBarProps.MaxItems + 16 + 25) {
            scrollBarProps.MouseDownState = 1;
        }
    }
}

function scrollBarMouseMove(canvasid, windowid, e) {
    var scrollBarProps = getScrollBarProps(canvasid, windowid);
    var tmp = scrollBarProps.SelectedID;
    if (scrollBarProps.MouseDownState === 1) {
        if (scrollBarProps.Alignment === 1) {
            var y = e.calcY;
            if (y < scrollBarProps.Y) {
                scrollBarProps.SelectedID = 1;
            } else if (y > scrollBarProps.Y + scrollBarProps.Len) {
                scrollBarProps.SelectedID = scrollBarProps.MaxItems;
            } else {
                scrollBarProps.SelectedID = Math.floor((y - scrollBarProps.Y) *
                    scrollBarProps.MaxItems / scrollBarProps.Len);
            }
        } else {
            var x = e.calcX;
            if (x < scrollBarProps.X) {
                scrollBarProps.SelectedID = 1;
            } else if (x > scrollBarProps.X + scrollBarProps.Len) {
                scrollBarProps.SelectedID = scrollBarProps.MaxItems;
            } else {
                scrollBarProps.SelectedID = Math.floor((x - scrollBarProps.X) *
                    scrollBarProps.MaxItems / scrollBarProps.Len);
            }
        }
        if (scrollBarProps.CustomMouseMoveFunction !== null &&
            scrollBarProps.CustomMouseMoveFunction !== undefined) {
            scrollBarProps.CustomMouseMoveFunction(scrollBarProps,
                scrollBarProps.SelectedID);
        }
    }
    if (scrollBarProps.SelectedID !== tmp) {
        var wprops = getWindowProps(canvasid, scrollBarProps.OwnedByWindowID);
        if (wprops) {
            invalidateRect(canvasid, null, wprops.X, wprops.Y, wprops.Width,
                wprops.Height);
        }
    }
}

function scrollBarMouseUp(canvasid, windowid) {
    var scrollBarProps = getScrollBarProps(canvasid, windowid);
    scrollBarProps.MouseDownState = 0;
}

function scrollBarLostFocus(canvasid, windowid) {
    var scrollBarProps = getScrollBarProps(canvasid, windowid);
    scrollBarProps.MouseDownState = 0;
}

var scrollbarSelectedTags = new Array();

function setSelectedTag(canvasid, windowid, selectedTag) {
    var found = 0;
    for (var i = 0; i < scrollbarSelectedTags.length; i++) {
        if (scrollbarSelectedTags[i][0] === canvasid &&
            scrollbarSelectedTags[i][1] === windowid) {
            found = 1;
            scrollbarSelectedTags[i][2] = selectedTag;
            break;
        }
    }
    if (found === 0) {
        scrollbarSelectedTags.push([canvasid, windowid, selectedTag]);
    }
}

function getSelectedTag(canvasid, windowid) {
    for (var i = 0; i < scrollbarSelectedTags.length; i++) {
        if (scrollbarSelectedTags[i][0] === canvasid &&
            scrollbarSelectedTags[i][1] === windowid) {
            return scrollbarSelectedTags[i][2];
        }
    }
}

function Scrollbar() { }

Scrollbar.prototype = {
    CanvasID: null, WindowID: null, X: null, Y: null, Len: null, SelectedID: null,
    MaxItems: null, Alignment: null, MouseDownState: null, Tag: null,
    OwnedByWindowID: null, DrawFunction: null,
    CustomIncrementFunction: null, CustomMouseMoveFunction: null,
    ControlNameID: null, Depth: null,
    ClickFunction: null, SelectedTag: null,

    Initialize: function () {
        return createScrollBar(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Len, this.Depth, this.MaxItems,
            this.Alignment, this.OwnedByWindowID, this.DrawFunction,
            this.ClickFunction, this.Tag,
            this.CustomIncrementFunction, this.SelectedTag, this.CustomMouseMoveFunction);
    }
};

function createScrollBar(canvasid, controlNameId, x, y, len, depth, maxitems,
    alignment, ownedbywindowid, drawFunction, clickFunction, tag,
    customIncrementFunction, selectedTag, customMouseMoveFunction,
    multiWindowControlsMainWindowId) {
    var windowid;
    if (alignment === 1) {
        windowid = createWindow(canvasid, x, y, 15, len, depth, null, 'ScrollBar',
            controlNameId, multiWindowControlsMainWindowId);
    } else {
        windowid = createWindow(canvasid, x, y, len, 15, depth, null, 'ScrollBar',
            controlNameId, multiWindowControlsMainWindowId);
    }
    scrollBarPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Len: len, SelectedID: 0,
        MaxItems: maxitems, Alignment: alignment, MouseDownState: 0, Tag: tag,
        OwnedByWindowID: ownedbywindowid, DrawFunction: drawFunction,
        CustomIncrementFunction: customIncrementFunction,
        CustomMouseMoveFunction: customMouseMoveFunction
    });
    if (clickFunction === null || clickFunction === undefined) {
        registerClickFunction(windowid, scrollBarClick, canvasid);
    } else {
        registerClickFunction(windowid, clickFunction, canvasid);
    }
    if (drawFunction === null || drawFunction === undefined) {
        registerWindowDrawFunction(windowid, function () {
            drawScrollBar(canvasid, windowid);
        }, canvasid);
    } else {
        registerWindowDrawFunction(windowid, function () {
            drawFunction(canvasid, windowid);
        }, canvasid);
    }
    registerMouseDownFunction(windowid, scrollBarMouseDown, canvasid);
    registerMouseMoveFunction(windowid, scrollBarMouseMove, canvasid);
    registerMouseUpFunction(windowid, scrollBarMouseUp, canvasid);
    registerLostFocusFunction(canvasid, windowid, scrollBarLostFocus);
    return windowid;
}

