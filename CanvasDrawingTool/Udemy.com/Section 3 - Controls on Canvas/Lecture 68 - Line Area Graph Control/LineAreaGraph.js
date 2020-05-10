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

//Line Area Graph code starts here

var lineAreaGraphPropsArray = new Array();

function getLineAreaGraphProps(canvasid, windowid) {
    for (var i = 0; i < lineAreaGraphPropsArray.length; i++) {
        if (lineAreaGraphPropsArray[i].CanvasID === canvasid &&
            lineAreaGraphPropsArray[i].WindowID === windowid) {
            return lineAreaGraphPropsArray[i];
        }
    }
}

function LineAreaGraph() { }

LineAreaGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    XMaxValue: null, YMaxValue: null, NumMarksX: null, NumMarksY: null, Title: null,
    TitleTextColor: null, TitleTextHeight: null, TitleTextFontString: null,
    AxisLabelsColor: null, AxisLabelsHeight: null, AxisLabelsFontString: null,
    MarginLeft: null, IsLabledOnXAxis: null, Tag: null, ControlNameID: null,
    Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createLineAreaGraph(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.Data, this.XMaxValue, this.YMaxValue, this.NumMarksX,
            this.NumMarksY, this.Title,
            this.TitleTextColor, this.TitleTextHeight, this.TitleTextFontString,
            this.AxisLabelsColor,
            this.AxisLabelsHeight, this.AxisLabelsFontString, this.MarginLeft,
            this.IsLabledOnXAxis, this.Tag, this.TabStopIndex);
    }
};

function createLineAreaGraph(canvasid, controlNameId, x, y, width, height, depth,
    data, xmaxvalue, ymaxvalue, nummarksx, nummarksy, title,
    titletextcolor, titletextheight, titletextfontstring, axislabelscolor,
    axislabelsheight, axislabelsfontstring, marginleft,
    islabeledonxaxis, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'LineAreaGraph', controlNameId, null, tabstopindex);
    lineAreaGraphPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        XMaxValue: xmaxvalue, YMaxValue: ymaxvalue, NumMarksX: nummarksx,
        NumMarksY: nummarksy, Title: title,
        TitleTextColor: titletextcolor, TitleTextHeight: titletextheight,
        TitleTextFontString: titletextfontstring,
        AxisLabelsColor: axislabelscolor, AxisLabelsHeight: axislabelsheight,
        AxisLabelsFontString: axislabelsfontstring,
        H: 0, MarginLeft: marginleft, AlreadyUnregisteredAnimation: 0,
        IsLabledOnXAxis: islabeledonxaxis, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var i = 0;
        var tw = null;
        var val;
        var lineAreaGraphProps = getLineAreaGraphProps(canvasid1, windowid1);
        if (lineAreaGraphProps.AlreadyUnregisteredAnimation === 0 &&
            lineAreaGraphProps.H >= lineAreaGraphProps.Data[0].length - 1) {
            lineAreaGraphProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvasid1, windowid1);
        }
        var ctx = getCtx(canvasid1);
        ctx.save();
        ctx.fillStyle = lineAreaGraphProps.TitleTextColor;
        ctx.font = lineAreaGraphProps.TitleTextFontString;
        ctx.fillText(lineAreaGraphProps.Title, lineAreaGraphProps.X +
            (lineAreaGraphProps.Width - ctx.measureText(lineAreaGraphProps.Title).width) / 2,
            lineAreaGraphProps.Y + 4 + lineAreaGraphProps.TitleTextHeight);
        ctx.font = lineAreaGraphProps.AxisLabelsFontString;
        ctx.beginPath();
        ctx.moveTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft,
            lineAreaGraphProps.Y + lineAreaGraphProps.Height -
            lineAreaGraphProps.AxisLabelsHeight - 8);
        ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft,
            lineAreaGraphProps.Y + lineAreaGraphProps.TitleTextHeight + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft,
            lineAreaGraphProps.Y + lineAreaGraphProps.Height -
            lineAreaGraphProps.AxisLabelsHeight - 8);
        ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.Width,
            lineAreaGraphProps.Y + lineAreaGraphProps.Height -
            lineAreaGraphProps.AxisLabelsHeight - 8);
        ctx.stroke();
        var alternate = false;
        for (var c = 0; c < lineAreaGraphProps.NumMarksX; c++) {
            if (alternate) {
                ctx.fillStyle = '#C0C0C0';
                alternate = false;
            } else {
                ctx.fillStyle = '#D0D0D0';
                alternate = true;
            }
            ctx.fillRect(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft + c *
                ((lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft) /
                    lineAreaGraphProps.NumMarksX),
                lineAreaGraphProps.Y + lineAreaGraphProps.TitleTextHeight + 8,
                (lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft) /
                    lineAreaGraphProps.NumMarksX,
                lineAreaGraphProps.Height - lineAreaGraphProps.TitleTextHeight -
                lineAreaGraphProps.AxisLabelsHeight - 16);
        }
        ctx.fillStyle = lineAreaGraphProps.AxisLabelsColor;
        ctx.strokeStyle = '#404040';
        for (c = 0; c < lineAreaGraphProps.NumMarksY; c++) {
            val = lineAreaGraphProps.YMaxValue / lineAreaGraphProps.NumMarksY * c;
            tw = ctx.measureText(val.toString()).width;
            ctx.fillText(val.toString(), lineAreaGraphProps.X +
                lineAreaGraphProps.MarginLeft - tw - 10, lineAreaGraphProps.Y +
                lineAreaGraphProps.Height -
                lineAreaGraphProps.AxisLabelsHeight - 8 - c *
                    ((lineAreaGraphProps.Height - lineAreaGraphProps.TitleTextHeight -
                        lineAreaGraphProps.AxisLabelsHeight -
                    16) / lineAreaGraphProps.NumMarksY));
            ctx.beginPath();
            ctx.moveTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft - 5,
                lineAreaGraphProps.Y + lineAreaGraphProps.Height -
                lineAreaGraphProps.AxisLabelsHeight - 8 - c *
                    ((lineAreaGraphProps.Height - lineAreaGraphProps.TitleTextHeight -
                        lineAreaGraphProps.AxisLabelsHeight -
                    16) / lineAreaGraphProps.NumMarksY));
            ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.Width,
                lineAreaGraphProps.Y + lineAreaGraphProps.Height -
                lineAreaGraphProps.AxisLabelsHeight - 8 - c *
                    ((lineAreaGraphProps.Height - lineAreaGraphProps.TitleTextHeight -
                        lineAreaGraphProps.AxisLabelsHeight -
                    16) / lineAreaGraphProps.NumMarksY));
            ctx.stroke();
        }
        var xlabels = new Array();
        if (lineAreaGraphProps.IsLabledOnXAxis === 1) {
            for (i = 0; i < lineAreaGraphProps.Data[0].length; i++) {
                xlabels.push(lineAreaGraphProps.Data[0][i][0]);
            }
        }
        ctx.fillStyle = lineAreaGraphProps.AxisLabelsColor;
        for (var d = 0; d < lineAreaGraphProps.NumMarksX; d++) {
            if (lineAreaGraphProps.IsLabledOnXAxis === 1) {
                increment = xlabels.length / lineAreaGraphProps.NumMarksX;
                if (xlabels.length % lineAreaGraphProps.NumMarksX >=
                    lineAreaGraphProps.NumMarksX / 2) {
                    val = xlabels[d * Math.ceil(increment)];
                } else {
                    val = xlabels[d * Math.floor(increment)];
                }
            } else {
                val = lineAreaGraphProps.XMaxValue / lineAreaGraphProps.NumMarksX * d;
            }
            tw = ctx.measureText(val.toString()).width;
            ctx.fillText(val.toString(), lineAreaGraphProps.X +
                lineAreaGraphProps.MarginLeft + d * ((lineAreaGraphProps.Width -
                    lineAreaGraphProps.MarginLeft) /
                    lineAreaGraphProps.NumMarksX) - tw / 2, lineAreaGraphProps.Y +
                    lineAreaGraphProps.Height - 4);
            ctx.beginPath();
            ctx.moveTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft + d *
                ((lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft) /
                    lineAreaGraphProps.NumMarksX), lineAreaGraphProps.Y +
                    lineAreaGraphProps.TitleTextHeight + 8 + (lineAreaGraphProps.Height -
                    lineAreaGraphProps.TitleTextHeight -
                    lineAreaGraphProps.AxisLabelsHeight - 16) + 5);
            ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft +
                d * ((lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft) /
                    lineAreaGraphProps.NumMarksX), lineAreaGraphProps.Y +
                    lineAreaGraphProps.TitleTextHeight + 8);
            ctx.stroke();
        }
        for (c = 0; c < lineAreaGraphProps.Data[0][0][1].length; c++) {
            var colorstr = lineAreaGraphProps.Data[1][c];
            var gradient = ctx.createLinearGradient(lineAreaGraphProps.X +
                lineAreaGraphProps.MarginLeft, lineAreaGraphProps.Y +
                lineAreaGraphProps.Height -
                lineAreaGraphProps.AxisLabelsHeight - 8, lineAreaGraphProps.X +
                lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft,
                lineAreaGraphProps.Y + lineAreaGraphProps.Height -
                lineAreaGraphProps.AxisLabelsHeight - 8);
            var redcomp = parseInt(colorstr.substr(1, 2), 16);
            var greencomp = parseInt(colorstr.substr(3, 2), 16);
            var bluecomp = parseInt(colorstr.substr(5, 2), 16);
            gradient.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
                getlowcomp(bluecomp));
            gradient.addColorStop(0.5, colorstr);
            gradient.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
                gethighcomp(bluecomp));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft,
                lineAreaGraphProps.Y + lineAreaGraphProps.Height -
                lineAreaGraphProps.AxisLabelsHeight - 8);
            for (i = 0; i < lineAreaGraphProps.H + 1; i++) {
                ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft +
                    (lineAreaGraphProps.IsLabledOnXAxis === 1 ?
                    findXLabelIndexForValue(xlabels, lineAreaGraphProps.Data[0][i][0]) *
                        (lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft) /
                    xlabels.length : lineAreaGraphProps.Data[0][i][0] *
                        (lineAreaGraphProps.Width -
                                lineAreaGraphProps.MarginLeft) /
                            lineAreaGraphProps.XMaxValue),
                    lineAreaGraphProps.Y + lineAreaGraphProps.Height -
                    lineAreaGraphProps.AxisLabelsHeight - 8 -
                    (lineAreaGraphProps.Data[0][i][1][c] + sumyvalues(
                        lineAreaGraphProps.Data, c, i)) *
                        (lineAreaGraphProps.Height -
                            lineAreaGraphProps.TitleTextHeight -
                            lineAreaGraphProps.AxisLabelsHeight - 16) /
                    lineAreaGraphProps.YMaxValue);
            }
            if (c === 0) {
                ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft +
                    (lineAreaGraphProps.IsLabledOnXAxis === 1 ?
                    findXLabelIndexForValue(xlabels,
                        lineAreaGraphProps.Data[0][lineAreaGraphProps.H][0]) *
                        (lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft)
                    / xlabels.length : lineAreaGraphProps.Data[0][lineAreaGraphProps.H][0] *
                            (lineAreaGraphProps.Width -
                                lineAreaGraphProps.MarginLeft) /
                            lineAreaGraphProps.XMaxValue), lineAreaGraphProps.Y +
                            lineAreaGraphProps.Height -
                                lineAreaGraphProps.AxisLabelsHeight - 8);
            } else {
                for (i = lineAreaGraphProps.H; i >= 0; i--) {
                    ctx.lineTo(lineAreaGraphProps.X + lineAreaGraphProps.MarginLeft +
                        (lineAreaGraphProps.IsLabledOnXAxis === 1 ?
                        findXLabelIndexForValue(xlabels, lineAreaGraphProps.Data[0][i][0]) *
                            (lineAreaGraphProps.Width - lineAreaGraphProps.MarginLeft) /
                        xlabels.length :
                        lineAreaGraphProps.Data[0][i][0] * (lineAreaGraphProps.Width -
                                lineAreaGraphProps.MarginLeft) / lineAreaGraphProps.XMaxValue),
                        lineAreaGraphProps.Y + lineAreaGraphProps.Height -
                        lineAreaGraphProps.AxisLabelsHeight - 8 -
                        (lineAreaGraphProps.Data[0][i][1][c - 1] +
                            sumyvalues(lineAreaGraphProps.Data, c - 1, i)) *
                            (lineAreaGraphProps.Height -
                                lineAreaGraphProps.TitleTextHeight -
                                lineAreaGraphProps.AxisLabelsHeight - 16) /
                        lineAreaGraphProps.YMaxValue);
                }
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
        if (lineAreaGraphProps.H < lineAreaGraphProps.Data[0].length - 1) {
            lineAreaGraphProps.H++;
        }
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
}

function sumyvalues(data, c, i) {
    var total = 0;
    for (var x = 0; x < c; x++) {
        total += data[0][i][1][x];
    }
    return total;
}

