/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Tablet, Smartphone Keyboard code starts here

var virtualKeyboardPropsArray = new Array();

function getVirtualKeyboardProps(canvasid, windowid) {
    for (var i = 0; i < virtualKeyboardPropsArray.length; i++) {
        if (virtualKeyboardPropsArray[i].CanvasID === canvasid &&
            virtualKeyboardPropsArray[i].WindowID === windowid) {
            return virtualKeyboardPropsArray[i];
        }
    }
}

function VirtualKeyboard() { }

VirtualKeyboard.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Keys: null,
    KeyPressFunction: null, GapBetweenButtons: null, GapBetweenRows: null,
    TextHeight: null, TextFontString: null, CustomDrawLetterFunction: null, HasGloss: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createVirtualKeyboard(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height,
            this.Depth, this.Keys, this.KeyPressFunction, this.GapBetweenButtons,
            this.GapBetweenRows, this.HasGloss,
            this.TextHeight, this.TextFontString, this.CustomDrawLetterFunction,
            this.TabStopIndex);
    }
};

function createVirtualKeyboard(canvasid, controlNameId, x, y, width, height,
    depth, keys, keypressFunc, gapbetweenbuttons,
    gapbetweenrows, hasgloss, textheight, textfontstring, customDrawLetterFunc,
    tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'VirtualKeyboard', controlNameId, null, tabstopindex);
    var customkeys = keys === null ? 0 : 1;
    if (!keys) {
        keys = [[[['Q', 30, 30], ['W', 30, 30], ['E', 30, 30], ['R', 30, 30],
        ['T', 30, 30], ['Y', 30, 30], ['U', 30, 30], ['I', 30, 30],
        ['O', 30, 30], ['P', 30, 30]], [['A', 30, 30], ['S', 30, 30], ['D', 30, 30],
        ['F', 30, 30], ['G', 30, 30],
        ['H', 30, 30], ['J', 30, 30], ['K', 30, 30], ['L', 30, 30]],
        [['shiftKey', 30, 30], ['Z', 30, 30], ['X', 30, 30],
        ['C', 30, 30], ['V', 30, 30], ['B', 30, 30], ['N', 30, 30], ['M', 30, 30],
        ['backspaceKey', 30, 30]],
        [['keyboardOff', 30, 30], [',', 30, 30], ['spacebarKey', 60, 30],
        ['.', 30, 30], ['12#', 30, 30, 1],
        ['carriageReturnKey', 30, 30]], [['up', 30, 30], ['down', 30, 30],
        ['left', 30, 30], ['right', 30, 30]]], [[['1', 30, 30], ['2', 30, 30],
        ['3', 30, 30], ['4', 30, 30],
        ['5', 30, 30], ['6', 30, 30], ['7', 30, 30], ['8', 30, 30], ['9', 30, 30],
        ['0', 30, 30]], [['!', 30, 30], ['@', 30, 30],
        ['#', 30, 30], ['$', 30, 30], ['%', 30, 30], ['&', 30, 30], ['*', 30, 30],
        ['?', 30, 30], ['/', 30, 30]], [['_', 30, 30],
        ['"', 30, 30], ['\'', 30, 30], ['(', 30, 30], [')', 30, 30], ['-', 30, 30],
        ['+', 30, 30], [';', 30, 30],
        ['backspaceKey', 30, 30]], [['keyboardOff', 30, 30], [':', 30, 30], [',', 30, 30],
        ['spacebarKey', 45, 30], ['.', 30, 30], ['ABC', 40, 30, 0],
        ['carriageReturnKey', 30, 30]], [['up', 30, 30],
        ['down', 30, 30], ['left', 30, 30], ['right', 30, 30]]]];
    }
    virtualKeyboardPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Keys: keys, KeyPressFunction: keypressFunc,
        GapBetweenButtons: gapbetweenbuttons,
        GapBetweenRows: gapbetweenrows, CurrentKeyboardIndex: 0, KeyExtents: null,
        TextHeight: textheight, TextFontString: textfontstring, CustomKeys: customkeys,
        CustomDrawLetterFunction: customDrawLetterFunc, HasGloss: hasgloss,
        ShiftKeyPressed: 0
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var virtualKeyboardProps = getVirtualKeyboardProps(canvasid1, windowid1);
        virtualKeyboardProps.KeyExtents = new Array();
        var ctx = getCtx(canvasid1);
        ctx.fillStyle = '#3c4243';
        ctx.beginPath();
        ctx.rect(virtualKeyboardProps.X, virtualKeyboardProps.Y,
            virtualKeyboardProps.Width, virtualKeyboardProps.Height);
        ctx.fill();
        ctx.strokeStyle = '#353a3b';
        var extraWidth = virtualKeyboardProps.Height / Math.tan(Math.PI / 4);
        for (var i = 0; i < (virtualKeyboardProps.Width + extraWidth) / 10; i++) {
            ctx.beginPath();
            ctx.moveTo(virtualKeyboardProps.X - extraWidth + i * 10, virtualKeyboardProps.Y);
            ctx.lineTo(virtualKeyboardProps.X + i * 10, virtualKeyboardProps.Y +
                virtualKeyboardProps.Height);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(virtualKeyboardProps.X - extraWidth + i * 10,
                virtualKeyboardProps.Y + virtualKeyboardProps.Height);
            ctx.lineTo(virtualKeyboardProps.X + i * 10, virtualKeyboardProps.Y);
            ctx.stroke();
        }
        var offsetY = virtualKeyboardProps.GapBetweenRows;
        for (var row = 0; row < virtualKeyboardProps.Keys[
            virtualKeyboardProps.CurrentKeyboardIndex].length; row++) {
            var rowWidth = 0;
            for (var c = 0; c < virtualKeyboardProps.Keys[
                virtualKeyboardProps.CurrentKeyboardIndex][row].length; c++) {
                rowWidth += virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] +
                    virtualKeyboardProps.GapBetweenButtons;
            }
            var offsetX = virtualKeyboardProps.GapBetweenButtons +
                (virtualKeyboardProps.Width -
                    virtualKeyboardProps.GapBetweenButtons - rowWidth) / 2;
            for (c = 0; c < virtualKeyboardProps.Keys[
                virtualKeyboardProps.CurrentKeyboardIndex][row].length; c++) {
                ctx.beginPath();
                ctx.moveTo(offsetX + virtualKeyboardProps.X, offsetY +
                    virtualKeyboardProps.Y + 5);
                ctx.arc(offsetX + virtualKeyboardProps.X + 5, offsetY +
                    virtualKeyboardProps.Y + 5, 5, Math.PI, Math.PI / 180 * 270, false);
                ctx.lineTo(offsetX + virtualKeyboardProps.X +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                    offsetY + virtualKeyboardProps.Y);
                ctx.arc(offsetX + virtualKeyboardProps.X +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                    offsetY + virtualKeyboardProps.Y + 5, 5,
                    Math.PI / 180 * 270, Math.PI * 2, false);
                ctx.lineTo(offsetX + virtualKeyboardProps.X +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1], offsetY +
                    virtualKeyboardProps.Y +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5);
                ctx.arc(offsetX + virtualKeyboardProps.X +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                    offsetY + virtualKeyboardProps.Y +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5, 5, 0,
                    Math.PI / 2, false);
                ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                    virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2]);
                ctx.arc(offsetX + virtualKeyboardProps.X + 5, offsetY +
                    virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5,
                    5, Math.PI / 2, Math.PI, false);
                ctx.closePath();
                virtualKeyboardProps.KeyExtents.push([offsetX +
                    virtualKeyboardProps.X, offsetY + virtualKeyboardProps.Y,
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1],
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2],
                    virtualKeyboardProps.ShiftKeyPressed === 1 ?
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][0] :
                        virtualKeyboardProps.Keys[
                            virtualKeyboardProps.CurrentKeyboardIndex][
                            row][c][0].toLowerCase(),
                    row, c]);
                var g = ctx.createLinearGradient(offsetX +
                    virtualKeyboardProps.X, offsetY + virtualKeyboardProps.Y,
                    offsetX + virtualKeyboardProps.X, offsetY + virtualKeyboardProps.Y +
                    virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2]);
                g.addColorStop(0, '#536fa0');
                g.addColorStop(1, '#274580');
                ctx.fillStyle = g;
                ctx.fill();
                ctx.strokeStyle = '#1f3a73';
                ctx.stroke();
                if (virtualKeyboardProps.CustomKeys === 0) {
                    g = ctx.createLinearGradient(offsetX +
                        virtualKeyboardProps.X, offsetY +
                        virtualKeyboardProps.Y + (virtualKeyboardProps.Keys[
                            virtualKeyboardProps.CurrentKeyboardIndex][row][c][2]
                            - virtualKeyboardProps.TextHeight) / 2, offsetX +
                        virtualKeyboardProps.X,
                        offsetY + virtualKeyboardProps.Y -
                        (virtualKeyboardProps.Keys[
                            virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] -
                            virtualKeyboardProps.TextHeight) / 2 +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][2]);
                    g.addColorStop(0, '#fafbfc');
                    g.addColorStop(1, '#dde2ea');
                    ctx.fillStyle = g;
                    ctx.strokeStyle = g;
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = '#636e7f';
                    ctx.font = virtualKeyboardProps.TextFontString;
                    switch (virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][0]) {
                        case 'shiftKey':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] / 2,
                                offsetY + virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 15);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][1] / 2 - 3,
                                offsetY + virtualKeyboardProps.Y + 15);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][1] / 2 - 3,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][1] / 2 + 3,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][1] / 2 + 3,
                                offsetY + virtualKeyboardProps.Y + 15);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                                offsetY + virtualKeyboardProps.Y + 15);
                            ctx.closePath();
                            if (virtualKeyboardProps.ShiftKeyPressed === 1) {
                                ctx.save();
                                var g2 = ctx.createLinearGradient(offsetX +
                                    virtualKeyboardProps.X, offsetY + virtualKeyboardProps.Y,
                                    offsetX + virtualKeyboardProps.X, offsetY +
                                    virtualKeyboardProps.Y +
                                    virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2]);
                                g2.addColorStop(0, '#00FF00');
                                g2.addColorStop(1, '#FFFFFF');
                                ctx.fillStyle = g2;
                                ctx.fill();
                                ctx.restore();
                            } else {
                                ctx.fill();
                            }
                            break;
                        case 'backspaceKey':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] / 2);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14, offsetY +
                                virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][2] / 2 - 3);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                                offsetY + virtualKeyboardProps.Y + 
                                    virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][2] / 2 - 3);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                                offsetY + virtualKeyboardProps.Y + 
                                    virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][2] / 2 + 3);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][2] / 2 + 3);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5);
                            ctx.closePath();
                            ctx.fill();
                            break;
                        case 'keyboardOff':
                            ctx.beginPath();
                            ctx.rect(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 5, virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 10,
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 10);
                            ctx.stroke();
                            for (var w = 0; w < (virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] -
                                10) / 4; w++) {
                                for (var f = 0; f < (virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] -
                                    10) / 4; f++) {
                                    ctx.beginPath();
                                    ctx.rect(offsetX + virtualKeyboardProps.X + 5 +
                                        w * 4, offsetY + virtualKeyboardProps.Y + 5 +
                                        f * 4, 3, 3);
                                    ctx.stroke();
                                }
                            }
                            break;
                        case 'spacebarKey':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 10);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 10);
                            ctx.stroke();
                            break;
                        case 'carriageReturnKey':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 22);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14, offsetY +
                                virtualKeyboardProps.Y + 15);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14, offsetY +
                                virtualKeyboardProps.Y + 19);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 19, offsetY +
                                virtualKeyboardProps.Y + 19);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 19, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 14, offsetY +
                                virtualKeyboardProps.Y + 29);
                            ctx.closePath();
                            ctx.fill();
                            break;
                        case 'up':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 15, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.closePath();
                            ctx.fill();
                            break;
                        case 'down':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 15, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.closePath();
                            ctx.fill();
                            break;
                        case 'left':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 15);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.closePath();
                            ctx.fill();
                            break;
                        case 'right':
                            ctx.beginPath();
                            ctx.moveTo(offsetX + virtualKeyboardProps.X + 25, offsetY +
                                virtualKeyboardProps.Y + 15);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 25);
                            ctx.lineTo(offsetX + virtualKeyboardProps.X + 5, offsetY +
                                virtualKeyboardProps.Y + 5);
                            ctx.closePath();
                            ctx.fill();
                            break;
                        case '12#':
                        case 'ABC':
                            ctx.fillText(virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][
                                row][c][0], offsetX + virtualKeyboardProps.X +
                                (virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] -
                                    ctx.measureText(virtualKeyboardProps.Keys[
                                        virtualKeyboardProps.CurrentKeyboardIndex][
                                        row][c][0]).width) / 2,
                                offsetY + virtualKeyboardProps.Y +
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] -
                                (virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][2] - virtualKeyboardProps.TextHeight) / 2);
                            break;
                        default:
                            ctx.fillText(virtualKeyboardProps.ShiftKeyPressed === 1 ?
                                virtualKeyboardProps.Keys[
                                virtualKeyboardProps.CurrentKeyboardIndex][row][c][0] :
                                virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][
                                    row][c][0].toLowerCase(), offsetX +
                                    virtualKeyboardProps.X +
                                (virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] -
                                    ctx.measureText(
                                    virtualKeyboardProps.ShiftKeyPressed === 1 ?
                                        virtualKeyboardProps.Keys[
                                        virtualKeyboardProps.CurrentKeyboardIndex][
                                        row][c][0] :
                                            virtualKeyboardProps.Keys[
                                                virtualKeyboardProps.CurrentKeyboardIndex][
                                                row][c][0].toLowerCase()).width) / 2,
                                    offsetY + virtualKeyboardProps.Y +
                                    virtualKeyboardProps.Keys[
                                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] -
                                    (virtualKeyboardProps.Keys[
                                        virtualKeyboardProps.CurrentKeyboardIndex][
                                        row][c][2] - virtualKeyboardProps.TextHeight) / 2);
                            break;
                    }
                } else {
                    virtualKeyboardProps.CustomDrawLetterFunction(ctx,
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][0],
                        offsetX + virtualKeyboardProps.X, offsetY +
                        virtualKeyboardProps.Y, virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][1],
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][2]);
                }
                if (virtualKeyboardProps.HasGloss === 1) {
                    ctx.beginPath();
                    ctx.moveTo(offsetX + virtualKeyboardProps.X + 2, offsetY +
                        virtualKeyboardProps.Y + 5 + 2);
                    ctx.arc(offsetX + virtualKeyboardProps.X + 5 + 2, offsetY +
                        virtualKeyboardProps.Y + 5 + 2, 5, Math.PI, Math.PI / 180 *
                        270, false);
                    ctx.lineTo(offsetX + virtualKeyboardProps.X +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5 - 2,
                        offsetY + virtualKeyboardProps.Y + 2);
                    ctx.arc(offsetX + virtualKeyboardProps.X +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5 - 2,
                        offsetY + virtualKeyboardProps.Y + 5 + 2, 5,
                        Math.PI / 180 * 270, Math.PI * 2, false);
                    ctx.lineTo(offsetX + virtualKeyboardProps.X +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 2,
                        offsetY + virtualKeyboardProps.Y +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5 + 2);
                    ctx.arc(offsetX + virtualKeyboardProps.X +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] - 5 - 2,
                        offsetY + virtualKeyboardProps.Y +
                        virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5 + 2,
                        5, 0, Math.PI / 2, false);
                    ctx.lineTo(offsetX + virtualKeyboardProps.X + 5 + 2, offsetY +
                        virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] + 2);
                    ctx.arc(offsetX + virtualKeyboardProps.X + 5 + 2, offsetY +
                        virtualKeyboardProps.Y + virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] - 5 + 2,
                        5, Math.PI / 2, Math.PI, false);
                    ctx.closePath();
                    var g3 = ctx.createLinearGradient(offsetX + virtualKeyboardProps.X +
                        2, offsetY + virtualKeyboardProps.Y + 2, offsetX +
                        virtualKeyboardProps.X + 2, offsetY + virtualKeyboardProps.Y +
                        virtualKeyboardProps.Keys[
                            virtualKeyboardProps.CurrentKeyboardIndex][row][c][2] / 2);
                    g3.addColorStop(0, 'rgba(255,255,255,0.4)');
                    g3.addColorStop(1, 'rgba(255,255,255,0.05)');
                    ctx.fillStyle = g3;
                    ctx.fill();
                }
                offsetX += virtualKeyboardProps.Keys[
                    virtualKeyboardProps.CurrentKeyboardIndex][row][c][1] +
                    virtualKeyboardProps.GapBetweenButtons;
            }
            offsetY += virtualKeyboardProps.Keys[
                virtualKeyboardProps.CurrentKeyboardIndex][row][0][2] +
                virtualKeyboardProps.GapBetweenRows;
        }
        registerClickFunction(windowid, function (canvasid1, windowid1, e) {
            donotredaw = 1;
            var x = e.calcX;
            var y = e.calcY;
            var virtualKeyboardProps = getVirtualKeyboardProps(canvasid1, windowid1);
            for (var i = 0; i < virtualKeyboardProps.KeyExtents.length; i++) {
                if (x > virtualKeyboardProps.KeyExtents[i][0] && x <
                    virtualKeyboardProps.KeyExtents[i][0] +
                    virtualKeyboardProps.KeyExtents[i][2] &&
                    y > virtualKeyboardProps.KeyExtents[i][1] && y <
                    virtualKeyboardProps.KeyExtents[i][1] +
                    virtualKeyboardProps.KeyExtents[i][3]) {
                    if (virtualKeyboardProps.Keys[
                        virtualKeyboardProps.CurrentKeyboardIndex][
                        virtualKeyboardProps.KeyExtents[i][5]][
                        virtualKeyboardProps.KeyExtents[i][6]].length === 4) {
                        virtualKeyboardProps.CurrentKeyboardIndex =
                            virtualKeyboardProps.Keys[
                            virtualKeyboardProps.CurrentKeyboardIndex][
                            virtualKeyboardProps.KeyExtents[i][5]][
                            virtualKeyboardProps.KeyExtents[i][6]][3];
                    } else {
                        if (virtualKeyboardProps.Keys[
                            virtualKeyboardProps.CurrentKeyboardIndex][
                            virtualKeyboardProps.KeyExtents[i][5]][
                            virtualKeyboardProps.KeyExtents[i][6]][0] === 'shiftKey') {
                            virtualKeyboardProps.ShiftKeyPressed =
                                virtualKeyboardProps.ShiftKeyPressed === 1 ? 0 : 1;
                        } else {
                            virtualKeyboardProps.KeyPressFunction(canvasid1, windowid1,
                                virtualKeyboardProps.KeyExtents[i][4]);
                        }
                    }
                    return;
                }
            }
        }, canvasid);
    }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

