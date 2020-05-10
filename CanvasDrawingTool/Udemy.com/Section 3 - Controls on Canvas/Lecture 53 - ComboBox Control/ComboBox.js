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

//Combobox code starts here
var comboboxPropsArray = new Array();

function getComboboxPropsByTextAreaWindowId(canvasid, windowid) {
    for (var i = 0; i < comboboxPropsArray.length; i++) {
        if (comboboxPropsArray[i].CanvasID === canvasid &&
            comboboxPropsArray[i].TextAreaWindowID === windowid) {
            return comboboxPropsArray[i];
        }
    }
}

function getComboboxPropsByButtonWindowId(canvasid, windowid) {
    for (var i = 0; i < comboboxPropsArray.length; i++) {
        if (comboboxPropsArray[i].CanvasID === canvasid &&
            comboboxPropsArray[i].ButtonWindowID === windowid) {
            return comboboxPropsArray[i];
        }
    }
}

function getComboboxPropsByListAreaWindowId(canvasid, windowid) {
    for (var i = 0; i < comboboxPropsArray.length; i++) {
        if (comboboxPropsArray[i].CanvasID === canvasid &&
            comboboxPropsArray[i].ListAreaWindowID === windowid) {
            return comboboxPropsArray[i];
        }
    }
}

function getComboboxPropsByScrollBarWindowId(canvasid, windowid) {
    for (var i = 0; i < comboboxPropsArray.length; i++) {
        if (comboboxPropsArray[i].CanvasID === canvasid &&
            comboboxPropsArray[i].VScrollBarWindowID === windowid) {
            return comboboxPropsArray[i];
        }
    }
}

function Combobox() { }

Combobox.prototype = {
    CanvasID: null, TextAreaWindowID: null,
    ButtonWindowID: null, ListAreaWindowID: null,
    VScrollBarWindowID: null, X: null, Y: null, Width: null,
    Height: null, Data: null, SelectedID: null,
    TextAreaTextColor: null, TextAreaTextHeight: null,
    TextAreaFontString: null, ListAreaTextColor: null,
    ListAreaTextHeight: null, ListAreaFontString: null,
    OnSelectionChanged: null, Tag: null, DrawListAreaFunction: null,
    ListAreaClickFunction: null, ControlNameID: null,
    ButtonClickFunction: null, DrawButtonFunction: null,
    DrawTextAreaFunction: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createComboBox(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height, this.Depth,
            this.Data, this.DrawTextAreaFunction, this.DrawButtonFunction,
            this.DrawListAreaFunction, this.ButtonClickFunction,
            this.ListAreaClickFunction, this.TextAreaTextColor,
            this.TextAreaTextHeight, this.TextAreaFontString,
            this.ListAreaTextColor, this.ListAreaTextHeight,
            this.ListAreaFontString, this.OnSelectionChanged, this.Tag,
            this.TabStopIndex);
    }
};

function createComboBox(canvasid, controlNameId, x, y, width, height, depth,
    data, drawTextAreaFunction, drawButtonFunction, drawListAreaFunction,
    buttonClickFunction,
    listAreaClickFunction, textAreaTextColor, textAreaTextHeight, textAreaFontString,
    listAreaTextColor, listAreaTextHeight, listAreaFontString, onSelectionChanged, tag,
    tabstopindex) {
    var textareawindowid = createWindow(canvasid, x, y, width - height, height,
        depth, null, 'ComboBoxTextArea', controlNameId + 'ComboBoxTextArea',
        null, tabstopindex);
    var buttonwindowid = createWindow(canvasid, x + width - height, y, height,
        height, depth, null, 'ComboBoxButton', controlNameId + 'ComboBoxButton',
        textareawindowid, tabstopindex);
    var dropdownlistareawindowid = createWindow(canvasid, x, y + height, width - 15,
        100, depth, null, 'ComboBoxListArea', controlNameId + 'ComboBoxListArea',
        textareawindowid, tabstopindex);
    var vscrollBarComboboxWindowId = createScrollBar(canvasid, controlNameId +
        'VS', x + width - 15, y + height, 100, depth, data.length, 1,
        dropdownlistareawindowid,
        function () {
            drawComboboxScrollBar(canvasid, vscrollBarComboboxWindowId);
        }, null, textareawindowid, tabstopindex);
    comboboxPropsArray.push({
        CanvasID: canvasid, WindowID: textareawindowid, TextAreaWindowID: textareawindowid,
        ButtonWindowID: buttonwindowid, ListAreaWindowID: dropdownlistareawindowid,
        VScrollBarWindowID: vscrollBarComboboxWindowId, X: x, Y: y, Width: width,
        Height: height, Data: data, SelectedID: 0,
        TextAreaTextColor: textAreaTextColor, TextAreaTextHeight: textAreaTextHeight,
        TextAreaFontString: textAreaFontString, ListAreaTextColor: listAreaTextColor,
        ListAreaTextHeight: listAreaTextHeight, ListAreaFontString: listAreaFontString,
        OnSelectionChanged: onSelectionChanged, Tag: tag,
        DrawListAreaFunction: drawListAreaFunction,
        ListAreaClickFunction: listAreaClickFunction,
        ButtonClickFunction: buttonClickFunction,
        DrawButtonFunction: drawButtonFunction, DrawTextAreaFunction: drawTextAreaFunction
    });
    if (drawTextAreaFunction !== null && drawTextAreaFunction !== undefined) {
        registerWindowDrawFunction(textareawindowid, function () {
            drawTextAreaFunction(canvasid, textareawindowid);
        }, canvasid);
    } else {
        registerWindowDrawFunction(textareawindowid, function () {
            drawComboboxTextArea(canvasid, textareawindowid);
        }, canvasid);
    }
    if (drawButtonFunction !== null && drawButtonFunction !== undefined) {
        registerWindowDrawFunction(buttonwindowid, function () {
            drawButtonFunction(canvasid, buttonwindowid);
        }, canvasid);
    } else {
        registerWindowDrawFunction(buttonwindowid, function () {
            drawComboboxButton(canvasid, buttonwindowid);
        }, canvasid);
    }
    if (drawListAreaFunction !== null && drawListAreaFunction !== undefined) {
        registerWindowDrawFunction(dropdownlistareawindowid, function () {
            drawListAreaFunction(canvasid, dropdownlistareawindowid);
        }, canvasid);
    } else {
        registerWindowDrawFunction(dropdownlistareawindowid, function () {
            drawComboboxListArea(canvasid, dropdownlistareawindowid);
        }, canvasid);
    }
    if (buttonClickFunction !== null && buttonClickFunction !== undefined) {
        registerClickFunction(buttonwindowid, buttonClickFunction, canvasid);
    } else {
        registerClickFunction(buttonwindowid, comboboxButtonClick, canvasid);
    }
    if (listAreaClickFunction !== null && listAreaClickFunction !== undefined) {
        registerClickFunction(dropdownlistareawindowid, listAreaClickFunction, canvasid);
    } else {
        registerClickFunction(dropdownlistareawindowid, comboboxListAreaClick, canvasid);
    }
    registerModalWindow(canvasid, dropdownlistareawindowid);
    registerHiddenWindow(canvasid, dropdownlistareawindowid, 1);
    registerModalWindow(canvasid, vscrollBarComboboxWindowId);
    registerHiddenWindow(canvasid, vscrollBarComboboxWindowId, 1);
    registerLostFocusFunction(canvasid, dropdownlistareawindowid, function () {
        comboboxListAreaLostFocus(canvasid, dropdownlistareawindowid);
    });
    registerLostFocusFunction(canvasid, textareawindowid, function () {
        comboboxTextAreaLostFocus(canvasid, textareawindowid);
    });
    registerLostFocusFunction(canvasid, vscrollBarComboboxWindowId, function () {
        comboboxScrollBarLostFocus(canvasid, vscrollBarComboboxWindowId);
    });
    registerLostFocusFunction(canvasid, buttonwindowid, function () {
        comboboxButtonLostFocus(canvasid, buttonwindowid);
    });
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function (canvasid, windowid, e) {
            if (e.keyCode === 40) {
                var comboboxProps = getComboboxPropsByTextAreaWindowId(
                    canvasid, textareawindowid);
                if (checkIfHiddenWindow(canvasid, comboboxProps.ListAreaWindowID) === 1) {
                    setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 0);
                    setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 0);
                    invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
                        comboboxProps.Width + 1, comboboxProps.Height + 101);
                }
            } else if (e.keyCode === 38) {
                comboboxProps = getComboboxPropsByTextAreaWindowId(canvasid,
                    textareawindowid);
                if (checkIfHiddenWindow(canvasid, comboboxProps.ListAreaWindowID) !== 1) {
                    setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
                    setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
                    invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
                        comboboxProps.Width + 1, comboboxProps.Height + 101);
                }
            }
        }, textareawindowid);
    }
    return textareawindowid;
}

function drawComboboxScrollBar(canvasid, windowid) {
    drawScrollBar(canvasid, windowid);
}

function drawComboboxTextArea(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByTextAreaWindowId(canvasid, windowid);
    var ctx = getCtx(canvasid);
    ctx.clearRect(comboboxProps.X, comboboxProps.Y, comboboxProps.Width, comboboxProps.Height);
    ctx.fillStyle = comboboxProps.TextAreaTextColor;
    ctx.font = comboboxProps.TextAreaFontString;
    if (comboboxProps.SelectedID < comboboxProps.Data.length &&
        comboboxProps.SelectedID >= 0) {
        ctx.fillText(comboboxProps.Data[comboboxProps.SelectedID], comboboxProps.X + 5,
            comboboxProps.Y + comboboxProps.Height - comboboxProps.TextAreaTextHeight / 2);
    } else {
        ctx.fillText(comboboxProps.Data[0], comboboxProps.X + 5, comboboxProps.Y +
            comboboxProps.Height - comboboxProps.TextAreaTextHeight / 2);
    }
    ctx.strokeStyle = '#b7bfc8';
    ctx.beginPath();
    ctx.rect(comboboxProps.X, comboboxProps.Y, comboboxProps.Width - comboboxProps.Height,
        comboboxProps.Height);
    ctx.stroke();
}

function drawComboboxButton(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByButtonWindowId(canvasid, windowid);
    var ctx = getCtx(canvasid);
    ctx.lineCap = 'butt';
    ctx.strokeStyle = '#3c7fb1';
    ctx.beginPath();
    ctx.rect(comboboxProps.X + comboboxProps.Width - comboboxProps.Height,
        comboboxProps.Y, comboboxProps.Height, comboboxProps.Height);
    ctx.stroke();
    ctx.fillStyle = '#dcf0fb';
    ctx.beginPath();
    ctx.rect(comboboxProps.X + comboboxProps.Width - comboboxProps.Height + 1,
        comboboxProps.Y + 1, comboboxProps.Height / 2 - 2, comboboxProps.Height - 2);
    ctx.fill();
    ctx.strokeStyle = '#c0e4f8';
    ctx.moveTo(comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 + 1,
        comboboxProps.Y + 1);
    ctx.lineTo(comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 + 1,
        comboboxProps.Y + comboboxProps.Height - 1);
    ctx.stroke();
    ctx.fillStyle = '#a7d8f3';
    ctx.beginPath();
    ctx.rect(comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 + 1,
        comboboxProps.Y + 1,
        comboboxProps.Height / 2 - 2, comboboxProps.Height - 2);
    ctx.fill();
    var g = ctx.createLinearGradient(comboboxProps.X + comboboxProps.Width -
        comboboxProps.Height / 2 - 1, comboboxProps.Y + comboboxProps.Height / 2 - 1,
        comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 - 1,
        comboboxProps.Y + comboboxProps.Height / 2 + 3);
    g.addColorStop(0, '#0d2a3a');
    g.addColorStop(1, '#4e9ac4');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 - 4,
        comboboxProps.Y + comboboxProps.Height / 2 - 1);
    ctx.lineTo(comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 + 3,
        comboboxProps.Y + comboboxProps.Height / 2 - 1);
    ctx.lineTo(comboboxProps.X + comboboxProps.Width - comboboxProps.Height / 2 - 1,
        comboboxProps.Y + comboboxProps.Height / 2 + 3);
    ctx.closePath();
    ctx.fill();
}

function comboboxButtonClick(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByButtonWindowId(canvasid, windowid);
    if (checkIfHiddenWindow(canvasid, comboboxProps.ListAreaWindowID) === 1) {
        setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 0);
        setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 0);
    } else {
        setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
        setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
    }
    invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
        comboboxProps.Width + 1, comboboxProps.Height + 101);
}

function drawComboboxListArea(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByListAreaWindowId(canvasid, windowid);
    var vscrollBarProps = getScrollBarProps(canvasid, comboboxProps.VScrollBarWindowID);
    var ctx = getCtx(canvasid);
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.rect(comboboxProps.X, comboboxProps.Y + comboboxProps.Height,
        comboboxProps.Width - 15, 100);
    ctx.fill();
    ctx.fillStyle = comboboxProps.ListAreaTextColor;
    ctx.font = comboboxProps.ListAreaFontString;
    for (var i = vscrollBarProps.SelectedID; i < comboboxProps.Data.length &&
        (comboboxProps.ListAreaTextHeight + 6) *
        (i - vscrollBarProps.SelectedID + 1) < 100; i++) {
        ctx.fillText(comboboxProps.Data[i], comboboxProps.X + 5, comboboxProps.Y +
            comboboxProps.Height +
            (comboboxProps.ListAreaTextHeight + 6) * (i - vscrollBarProps.SelectedID + 1));
    }
    ctx.strokeStyle = '#b7bfc8';
    ctx.beginPath();
    ctx.rect(comboboxProps.X, comboboxProps.Y + comboboxProps.Height,
        comboboxProps.Width - 15, 100);
    ctx.stroke();
}

function comboboxListAreaClick(canvasid, windowid, e) {
    var comboboxProps = getComboboxPropsByListAreaWindowId(canvasid, windowid);
    var vscrollBarProps = getScrollBarProps(canvasid, comboboxProps.VScrollBarWindowID);
    var x = e.calcX;
    var y = e.calcY;
    for (var i = vscrollBarProps.SelectedID; i < comboboxProps.Data.length &&
        (comboboxProps.ListAreaTextHeight + 6) * (i - vscrollBarProps.SelectedID + 1)
        < 100; i++) {
        if (x > comboboxProps.X && y > comboboxProps.Y + comboboxProps.Height +
            (comboboxProps.ListAreaTextHeight + 6) * (i - vscrollBarProps.SelectedID) &&
            x < comboboxProps.X + comboboxProps.Width - 15 && y < comboboxProps.Y +
            comboboxProps.Height + (comboboxProps.ListAreaTextHeight + 6) *
                (i - vscrollBarProps.SelectedID + 1)) {
            if (comboboxProps.SelectedID !== i) {
                comboboxProps.SelectedID = i;
                setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
                setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
                var canvas = getCanvas(canvasid);
                invalidateRect(canvasid, null, 0, 0, canvas.width, canvas.height);
                if (comboboxProps.OnSelectionChanged !== null) {
                    comboboxProps.OnSelectionChanged(canvasid,
                        comboboxProps.TextAreaWindowID, i);
                }
            }
            return;
        }
    }
}

function comboboxListAreaLostFocus(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByListAreaWindowId(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, comboboxProps.VScrollBarWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.TextAreaWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.ButtonWindowID) === 0 &&
        doingEventForWindowID !== comboboxProps.ListAreaWindowID &&
        doingEventForWindowID !== comboboxProps.VScrollBarWindowID) {
        setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
        setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
        invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
            comboboxProps.Width + 1, comboboxProps.Height + 101);
    }
}

function comboboxTextAreaLostFocus(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByTextAreaWindowId(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, comboboxProps.VScrollBarWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.ListAreaWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.ButtonWindowID) === 0 &&
        doingEventForWindowID !== comboboxProps.ListAreaWindowID &&
        doingEventForWindowID !== comboboxProps.VScrollBarWindowID) {
        setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
        setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
        invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
            comboboxProps.Width + 1, comboboxProps.Height + 101);
    }
}

function comboboxButtonLostFocus(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByButtonWindowId(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, comboboxProps.VScrollBarWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.ListAreaWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.TextAreaWindowID) === 0 &&
        doingEventForWindowID !== comboboxProps.ListAreaWindowID &&
        doingEventForWindowID !== comboboxProps.VScrollBarWindowID) {
        setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
        setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
        invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
            comboboxProps.Width + 1, comboboxProps.Height + 101);
    }
}

function comboboxScrollBarLostFocus(canvasid, windowid) {
    var comboboxProps = getComboboxPropsByScrollBarWindowId(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, comboboxProps.TextAreaWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.ListAreaWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, comboboxProps.ButtonWindowID) === 0 &&
        doingEventForWindowID !== comboboxProps.ListAreaWindowID &&
        doingEventForWindowID !== comboboxProps.VScrollBarWindowID) {
        setHiddenWindowStatus(canvasid, comboboxProps.VScrollBarWindowID, 1);
        setHiddenWindowStatus(canvasid, comboboxProps.ListAreaWindowID, 1);
        invalidateRect(canvasid, null, comboboxProps.X, comboboxProps.Y,
            comboboxProps.Width + 1, comboboxProps.Height + 101);
    }
}

