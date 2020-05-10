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

//Line Graph code starts here

var lineGraphsPropsArray = new Array();

function getLineGraphProps(canvasid, windowid) {
    for (var i = 0; i < lineGraphsPropsArray.length; i++) {
        if (lineGraphsPropsArray[i].CanvasID === canvasid &&
            lineGraphsPropsArray[i].WindowID === windowid) {
            return lineGraphsPropsArray[i];
        }
    }
}

function LineGraph() { }

LineGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    XMaxValue: null, NumMarksX: null, YMaxValue: null, NumMarksY: null, Title: null,
    TitleTextColor: null, TitleTextHeight: null, TitleTextFontString: null,
    AxisLabelsTextColor: null, AxisLabelsTextHeight: null, AxisLabelsTextFontString: null,
    ClickFunction: null, MarginLeft: null, IsLabeledXValues: null, Tag: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createLineGraph(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.Data, this.XMaxValue, this.NumMarksX, this.YMaxValue,
            this.NumMarksY, this.Title,
            this.TitleTextColor, this.TitleTextHeight, this.TitleTextFontString,
            this.AxisLabelsTextColor,
            this.AxisLabelsTextHeight, this.AxisLabelsTextFontString,
            this.ClickFunction, this.MarginLeft,
            this.IsLabeledXValues, this.Tag, this.TabStopIndex);
    }
};

function createLineGraph(canvasid, controlNameId, x, y, width, height, depth,
    data, xmaxvalue, nummarksx, ymaxvalue, nummarksy, title,
    titletextcolor, titletextheight, titletextfontstring, axislabelstextcolor,
    axislabelstextheight, axislabelstextfontstring,
    clickFunction, marginleft, islabeledxvalues, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'LineGraph', controlNameId, null, tabstopindex);
    var hmax = 0;
    for (var j = 0; j < data.length; j++) {
        if (data[j][0].length > hmax)
            hmax = data[j][0].length;
    }
    lineGraphsPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        XMaxValue: xmaxvalue, NumMarksX: nummarksx, YMaxValue: ymaxvalue,
        NumMarksY: nummarksy, Title: title,
        TitleTextColor: titletextcolor, TitleTextHeight: titletextheight,
        TitleTextFontString: titletextfontstring,
        AxisLabelsTextColor: axislabelstextcolor,
        AxisLabelsTextHeight: axislabelstextheight,
        AxisLabelsTextFontString: axislabelstextfontstring,
        H: 2, HMax: hmax, LineXYs: new Array(), ClickFunction: clickFunction,
        AlreadyUnregisteredAnimation: 0, MarginLeft: marginleft,
        IsLabeledXValues: islabeledxvalues, Tag: tag
    });
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {
        var lineGraphProps = getLineGraphProps(canvasid1, windowid1);
        if (lineGraphProps.ClickFunction !== null &&
            lineGraphProps.ClickFunction !== undefined) {
            var linexys = lineGraphProps.LineXYs;
            var clickx = e.calcX;
            var clicky = e.calcY;
            for (var i = 0; i < linexys.length; i++) {
                for (var j = 0; j < linexys[i].length - 1; j++) {
                    if (clickx >= linexys[i][j][0] && clickx <= linexys[i][j + 1][0]) {
                        if (clicky <= linexys[i][j][1] && clicky >=
                            linexys[i][j + 1][1] || clicky >= linexys[i][j][1] &&
                                clicky <= linexys[i][j + 1][1]) {
                            y = (linexys[i][j][1] - linexys[i][j + 1][1]) *
                                (clickx - linexys[i][j][0]) / (linexys[i][j][0] -
                                    linexys[i][j + 1][0]) + linexys[i][j][1];
                            if (y + 4 > clicky && y - 4 < clicky) {
                                lineGraphProps.ClickFunction(canvasid1, windowid1, i);
                            }
                        }
                    }
                }
            }
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var lineGraphProps = getLineGraphProps(canvasid2, windowid2);
        if (lineGraphProps.AlreadyUnregisteredAnimation === 0 && lineGraphProps.H >
            lineGraphProps.HMax) {
            lineGraphProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvasid2, windowid2);
        }
        lineGraphProps.LineXYs = new Array();
        var ctx = getCtx(canvasid2);
        ctx.save();
        ctx.fillStyle = lineGraphProps.TitleTextColor;
        ctx.font = lineGraphProps.TitleTextFontString;
        ctx.fillText(lineGraphProps.Title, lineGraphProps.X + (lineGraphProps.Width -
            ctx.measureText(lineGraphProps.Title).width) / 2,
            lineGraphProps.Y + lineGraphProps.TitleTextHeight + 4);
        ctx.fillStyle = '#A0A0A0';
        ctx.font = lineGraphProps.AxisLabelsTextFontString;
        ctx.beginPath();
        ctx.moveTo(lineGraphProps.X + lineGraphProps.MarginLeft, lineGraphProps.Y +
            lineGraphProps.Height - lineGraphProps.AxisLabelsTextHeight - 8);
        ctx.lineTo(lineGraphProps.X + lineGraphProps.MarginLeft, lineGraphProps.Y +
            lineGraphProps.TitleTextHeight + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineGraphProps.X + lineGraphProps.MarginLeft, lineGraphProps.Y +
            lineGraphProps.Height - lineGraphProps.AxisLabelsTextHeight - 8);
        ctx.lineTo(lineGraphProps.X + lineGraphProps.Width, lineGraphProps.Y +
            lineGraphProps.Height - lineGraphProps.AxisLabelsTextHeight - 8);
        ctx.stroke();
        var alternate = false;
        for (var c = 0; c < lineGraphProps.NumMarksX; c++) {
            if (alternate) {
                ctx.fillStyle = '#C0C0C0';
                alternate = false;
            } else {
                ctx.fillStyle = '#D0D0D0';
                alternate = true;
            }
            ctx.fillRect(lineGraphProps.X + lineGraphProps.MarginLeft + c *
                ((lineGraphProps.Width - lineGraphProps.MarginLeft) /
                    lineGraphProps.NumMarksX),
                lineGraphProps.Y + lineGraphProps.TitleTextHeight + 8,
                (lineGraphProps.Width - lineGraphProps.MarginLeft) /
                    lineGraphProps.NumMarksX,
                lineGraphProps.Height - lineGraphProps.TitleTextHeight -
                lineGraphProps.AxisLabelsTextHeight - 16);
        }
        ctx.fillStyle = lineGraphProps.AxisLabelsTextColor;
        ctx.font = lineGraphProps.AxisLabelsTextFontString;
        ctx.strokeStyle = '#404040';
        for (c = 0; c < lineGraphProps.NumMarksY; c++) {
            var val = lineGraphProps.YMaxValue / lineGraphProps.NumMarksY * c;
            var tw = ctx.measureText(val.toString()).width;
            ctx.fillText(val.toString(), lineGraphProps.X + lineGraphProps.MarginLeft -
                4 - tw, lineGraphProps.Y + lineGraphProps.Height -
                lineGraphProps.AxisLabelsTextHeight - 8 - c * ((lineGraphProps.Height -
                    lineGraphProps.TitleTextHeight - lineGraphProps.AxisLabelsTextHeight -
                    16) / lineGraphProps.NumMarksY));
            ctx.beginPath();
            ctx.moveTo(lineGraphProps.X + lineGraphProps.MarginLeft - 3, lineGraphProps.Y +
                lineGraphProps.Height -
                lineGraphProps.AxisLabelsTextHeight - 8 - c * ((lineGraphProps.Height -
                    lineGraphProps.TitleTextHeight - lineGraphProps.AxisLabelsTextHeight -
                    16) / lineGraphProps.NumMarksY));
            ctx.lineTo(lineGraphProps.X + lineGraphProps.Width, lineGraphProps.Y +
                lineGraphProps.Height -
                lineGraphProps.AxisLabelsTextHeight - 8 - c * ((lineGraphProps.Height -
                    lineGraphProps.TitleTextHeight - lineGraphProps.AxisLabelsTextHeight -
                    16) / lineGraphProps.NumMarksY));
            ctx.stroke();
        }
        var xlabels = new Array();
        if (lineGraphProps.IsLabeledXValues === 1) {
            var maxnumlabels = 0;
            for (var i = 0; i < lineGraphProps.Data.length; i++) {
                if (lineGraphProps.Data[i][0].length > maxnumlabels) {
                    maxnumlabels = lineGraphProps.Data[i][0].length;
                }
            }
            for (i = 0; i < maxnumlabels; i++) {
                for (var j = 0; j < lineGraphProps.Data.length; j++) {
                    if (i < lineGraphProps.Data[j][0].length) {
                        var foundlabel = 0;
                        for (var p = 0; p < xlabels.length; p++) {
                            if (xlabels[p] === lineGraphProps.Data[j][0][i][0]) {
                                foundlabel = 1;
                                break;
                            }
                        }
                        if (foundlabel === 0) {
                            xlabels.push(lineGraphProps.Data[j][0][i][0]);
                        }
                    }
                }
            }
        }
        for (var d = 0; d < lineGraphProps.NumMarksX; d++) {
            var val2;
            var increment;
            if (lineGraphProps.IsLabeledXValues === 1) {
                increment = xlabels.length / lineGraphProps.NumMarksX;
                if (xlabels.length % lineGraphProps.NumMarksX >=
                    lineGraphProps.NumMarksX / 2) {
                    val2 = xlabels[d * Math.ceil(increment)];
                } else {
                    val2 = xlabels[d * Math.floor(increment)];
                }
            } else {
                val2 = lineGraphProps.XMaxValue / lineGraphProps.NumMarksX * d;
            }
            var tw2 = ctx.measureText(val2.toString()).width;
            ctx.fillText(val2.toString(), lineGraphProps.X + lineGraphProps.MarginLeft +
                d * (lineGraphProps.Width - lineGraphProps.MarginLeft)
                    / lineGraphProps.NumMarksX - tw2 / 2, lineGraphProps.Y +
                    lineGraphProps.Height - 4);
            ctx.beginPath();
            ctx.moveTo(lineGraphProps.X + lineGraphProps.MarginLeft + d *
                (lineGraphProps.Width - lineGraphProps.MarginLeft) /
                lineGraphProps.NumMarksX,
                lineGraphProps.Y + lineGraphProps.Height -
                lineGraphProps.AxisLabelsTextHeight - 5);
            ctx.lineTo(lineGraphProps.X + lineGraphProps.MarginLeft + d *
                (lineGraphProps.Width - lineGraphProps.MarginLeft) /
                lineGraphProps.NumMarksX,
                lineGraphProps.Y + lineGraphProps.TitleTextHeight + 8);
            ctx.stroke();
        }
        var i2 = 0;
        while (i2 < data.length) {
            drawline(canvasid, ctx, lineGraphProps, i2, xlabels);
            i2++;
        }
        if (lineGraphProps.H < lineGraphProps.HMax) {
            lineGraphProps.H += 1;
        }
        ctx.restore();
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function findXLabelIndexForValue(xlabels, val) {
    for (var i = 0; i < xlabels.length; i++) {
        if (xlabels[i] === val) {
            return i;
        }
    }
}

function drawline(canvasid, ctx, lineGraphProps, x, xlabels) {
    var redcomp = parseInt(lineGraphProps.Data[x][1].substr(1, 2), 16);
    var greencomp = parseInt(lineGraphProps.Data[x][1].substr(3, 2), 16);
    var bluecomp = parseInt(lineGraphProps.Data[x][1].substr(5, 2), 16);
    ctx.strokeStyle = lineGraphProps.Data[x][1];
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.miterLimit = 0.0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#' + getlowcomp(redcomp).toString(16) +
        getlowcomp(greencomp).toString(16) + getlowcomp(bluecomp).toString(16);
    ctx.beginPath();
    var linexys = new Array();
    var arrLinexys = new Array();
    linexys.push(arrLinexys);
    arrLinexys = linexys.push([lineGraphProps.X + lineGraphProps.MarginLeft +
        (lineGraphProps.IsLabeledXValues === 1 ?
        findXLabelIndexForValue(xlabels, lineGraphProps.Data[x][0][0][0]) *
            (lineGraphProps.Width - lineGraphProps.MarginLeft) / xlabels.length :
            lineGraphProps.Data[x][0][0][0] * (lineGraphProps.Width -
                lineGraphProps.MarginLeft) / lineGraphProps.XMaxValue),
    lineGraphProps.Y + lineGraphProps.Height - lineGraphProps.AxisLabelsTextHeight - 8 -
    lineGraphProps.Data[x][0][0][1] * (lineGraphProps.Height -
        lineGraphProps.TitleTextHeight - lineGraphProps.AxisLabelsTextHeight - 16) /
        lineGraphProps.YMaxValue]);
    ctx.moveTo(lineGraphProps.X + lineGraphProps.MarginLeft +
        (lineGraphProps.IsLabeledXValues === 1 ?
        findXLabelIndexForValue(xlabels, lineGraphProps.Data[x][0][0][0]) *
            (lineGraphProps.Width - lineGraphProps.MarginLeft) / xlabels.length :
        lineGraphProps.Data[x][0][0][0] * (lineGraphProps.Width -
                lineGraphProps.MarginLeft) / lineGraphProps.XMaxValue),
        lineGraphProps.Y + lineGraphProps.Height - lineGraphProps.AxisLabelsTextHeight -
        8 - lineGraphProps.Data[x][0][0][1] *
            (lineGraphProps.Height - lineGraphProps.TitleTextHeight -
                lineGraphProps.AxisLabelsTextHeight - 16) /
            lineGraphProps.YMaxValue);
    for (var i = 1; i < lineGraphProps.H && i < lineGraphProps.Data[x][0].length; i++) {
        arrLinexys = linexys.push([lineGraphProps.X + lineGraphProps.MarginLeft +
            (lineGraphProps.IsLabeledXValues === 1 ?
            findXLabelIndexForValue(xlabels, lineGraphProps.Data[x][0][i][0]) *
                (lineGraphProps.Width - lineGraphProps.MarginLeft) / xlabels.length :
                lineGraphProps.Data[x][0][i][0] * (lineGraphProps.Width -
                    lineGraphProps.MarginLeft) / lineGraphProps.XMaxValue),
            lineGraphProps.Y + lineGraphProps.Height -
            lineGraphProps.AxisLabelsTextHeight - 8 -
            lineGraphProps.Data[x][0][i][1] *
                (lineGraphProps.Height - lineGraphProps.TitleTextHeight -
                    lineGraphProps.AxisLabelsTextHeight - 16) /
                lineGraphProps.YMaxValue]);
        ctx.lineTo(lineGraphProps.X + lineGraphProps.MarginLeft +
            (lineGraphProps.IsLabeledXValues === 1 ? findXLabelIndexForValue(xlabels,
            lineGraphProps.Data[x][0][i][0]) * (lineGraphProps.Width -
                lineGraphProps.MarginLeft) / xlabels.length :
                lineGraphProps.Data[x][0][i][0] * (lineGraphProps.Width -
                    lineGraphProps.MarginLeft) / lineGraphProps.XMaxValue),
            lineGraphProps.Y + lineGraphProps.Height -
            lineGraphProps.AxisLabelsTextHeight - 8 - lineGraphProps.Data[x][0][i][1] *
                (lineGraphProps.Height - lineGraphProps.TitleTextHeight -
                    lineGraphProps.AxisLabelsTextHeight - 16) / lineGraphProps.YMaxValue);
    }
    lineGraphProps.LineXYs.push(linexys);
    ctx.stroke();
}

