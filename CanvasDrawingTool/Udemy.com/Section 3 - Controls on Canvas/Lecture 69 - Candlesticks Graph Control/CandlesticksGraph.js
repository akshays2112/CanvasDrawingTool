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

//Candlesticks Graph code starts here

var candlesticksGraphPropsArray = new Array();

function getCandlesticksGraphProps(canvasid, windowid) {
    for (var i = 0; i < candlesticksGraphPropsArray.length; i++) {
        if (candlesticksGraphPropsArray[i].CanvasID === canvasid &&
            candlesticksGraphPropsArray[i].WindowID === windowid) {
            return candlesticksGraphPropsArray[i];
        }
    }
}

function CandlesticksGraph() { }

CandlesticksGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    XMarksLabelData: null, XMarksWidth: null, YMaxValue: null, NumMarksY: null, Title: null,
    TitleColor: null, TitleHeight: null, TitleFontString: null, CandleBodyWidth: null,
    CandleBodyColor: null, CandleLineColor: null, MarginLeft: null,
    AxisLabelsColor: null, AxisLabelsHeight: null, AxisLabelsFontString: null, Tag: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createCandlesticksGraph(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height,
            this.Depth, this.Data, this.XMarksLabelData, this.XMarksWidth, this.YMaxValue,
            this.NumMarksY, this.Title,
            this.TitleColor, this.TitleHeight, this.TitleFontString, this.CandleBodyWidth,
            this.CandleBodyColor,
            this.CandleLineColor, this.MarginLeft, this.AxisLabelsColor,
            this.AxisLabelsHeight, this.AxisLabelsFontString,
            this.Tag, this.TabStopIndex);
    }
};

function createCandlesticksGraph(canvasid, controlNameId, x, y, width, height, depth,
    data, xmarkslabeldata, xmarkswidth, ymaxvalue, nummarksy, title,
    titlecolor, titleheight, titlefontstring, candlebodywidth, candelbodycolorstr,
    candellinecolorstr, marginleft,
    axislabelscolor, axislabelsheight, axislabelsfontstring, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'CandlesticksGraph', controlNameId, null, tabstopindex);
    candlesticksGraphPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        XMarksLabelData: xmarkslabeldata, XMarksWidth: xmarkswidth,
        YMaxValue: ymaxvalue, NumMarksY: nummarksy, Title: title,
        TitleColor: titlecolor, TitleHeight: titleheight,
        TitleFontString: titlefontstring, CandleBodyWidth: candlebodywidth,
        CandleBodyColor: candelbodycolorstr, CandleLineColor: candellinecolorstr,
        MarginLeft: marginleft,
        AxisLabelsColor: axislabelscolor, AxisLabelsHeight: axislabelsheight,
        AxisLabelsFontString: axislabelsfontstring, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var tw = null;
        var candlesticksGraphProps = getCandlesticksGraphProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        ctx.save();
        ctx.fillStyle = candlesticksGraphProps.TitleColor;
        ctx.font = candlesticksGraphProps.TitleFontString;
        ctx.fillText(candlesticksGraphProps.Title, candlesticksGraphProps.X +
            (candlesticksGraphProps.Width - ctx.measureText(title).width) / 2,
            candlesticksGraphProps.Y + candlesticksGraphProps.TitleHeight + 4);
        ctx.strokeStyle = '#C0C0C0';
        ctx.beginPath();
        ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft,
            candlesticksGraphProps.Y + candlesticksGraphProps.Height - 8 -
            candlesticksGraphProps.AxisLabelsHeight);
        ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft,
            candlesticksGraphProps.Y + candlesticksGraphProps.TitleHeight + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft,
            candlesticksGraphProps.Y + candlesticksGraphProps.Height - 8 -
            candlesticksGraphProps.AxisLabelsHeight);
        ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.Width,
            candlesticksGraphProps.Y + candlesticksGraphProps.Height - 8 -
            candlesticksGraphProps.AxisLabelsHeight);
        ctx.stroke();
        var alternate = false;
        for (var c = 0; c <= data.length; c++) {
            if (alternate) {
                ctx.fillStyle = '#C0C0C0';
                alternate = false;
            } else {
                ctx.fillStyle = '#D0D0D0';
                alternate = true;
            }
            ctx.fillRect(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                c * candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                candlesticksGraphProps.TitleHeight + 8, candlesticksGraphProps.XMarksWidth,
                candlesticksGraphProps.Height -
                candlesticksGraphProps.TitleHeight -
                candlesticksGraphProps.AxisLabelsHeight - 16);
        }
        ctx.fillStyle = candlesticksGraphProps.AxisLabelsColor;
        ctx.font = candlesticksGraphProps.AxisLabelsFontString;
        ctx.strokeStyle = '#404040';
        for (c = 0; c < candlesticksGraphProps.NumMarksY; c++) {
            var val = candlesticksGraphProps.YMaxValue /
                candlesticksGraphProps.NumMarksY * c;
            tw = ctx.measureText(val.toString()).width;
            ctx.fillText(val.toString(), candlesticksGraphProps.X +
                candlesticksGraphProps.MarginLeft - 10 - tw, candlesticksGraphProps.Y +
                candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                8 - c * ((candlesticksGraphProps.Height -
                    candlesticksGraphProps.TitleHeight -
                    candlesticksGraphProps.AxisLabelsHeight - 16) /
                    candlesticksGraphProps.NumMarksY));
            ctx.beginPath();
            ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft -
                5, candlesticksGraphProps.Y + candlesticksGraphProps.Height -
                candlesticksGraphProps.AxisLabelsHeight - 8 - c *
                    ((candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.NumMarksY));
            ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.Width,
                candlesticksGraphProps.Y + candlesticksGraphProps.Height -
                candlesticksGraphProps.AxisLabelsHeight - 8 - c *
                    ((candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.NumMarksY));
            ctx.stroke();
        }
        for (var d = 0; d < candlesticksGraphProps.Data.length; d++) {
            ctx.beginPath();
            ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                (d + 1) * candlesticksGraphProps.XMarksWidth,
                candlesticksGraphProps.Y + candlesticksGraphProps.Height -
                candlesticksGraphProps.AxisLabelsHeight - 8 + 5);
            ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                (d + 1) * candlesticksGraphProps.XMarksWidth,
                candlesticksGraphProps.Y + candlesticksGraphProps.TitleHeight + 8);
            ctx.stroke();
        }
        for (c = 0; c < candlesticksGraphProps.XMarksLabelData.length; c++) {
            tw = ctx.measureText(
                candlesticksGraphProps.XMarksLabelData[c][1].toString()).width;
            ctx.fillText(candlesticksGraphProps.XMarksLabelData[c][1],
                candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                (candlesticksGraphProps.XMarksLabelData[c][0] + 1) *
                    candlesticksGraphProps.XMarksWidth - tw / 2,
                candlesticksGraphProps.Y + candlesticksGraphProps.Height - 4);
        }
        for (c = 0; c < candlesticksGraphProps.Data.length; c++) {
            var gradient = ctx.createLinearGradient(candlesticksGraphProps.X +
                candlesticksGraphProps.MarginLeft + (c + 1) *
                    candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                candlesticksGraphProps.Height -
                candlesticksGraphProps.AxisLabelsHeight - 8 -
                candlesticksGraphProps.Data[c][0] * (candlesticksGraphProps.Height -
                    candlesticksGraphProps.TitleHeight -
                    candlesticksGraphProps.AxisLabelsHeight -
                    16) / candlesticksGraphProps.YMaxValue, candlesticksGraphProps.X +
                    candlesticksGraphProps.MarginLeft + (c + 1) *
                        candlesticksGraphProps.XMarksWidth,
                    candlesticksGraphProps.Y + candlesticksGraphProps.Height -
                    candlesticksGraphProps.AxisLabelsHeight - 8 -
                    candlesticksGraphProps.Data[c][1] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
            var redcomp = parseInt(candlesticksGraphProps.CandleBodyColor.substr(1, 2), 16);
            var greencomp = parseInt(candlesticksGraphProps.CandleBodyColor.substr(3, 2), 16);
            var bluecomp = parseInt(candlesticksGraphProps.CandleBodyColor.substr(5, 2), 16);
            gradient.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
                getlowcomp(bluecomp));
            gradient.addColorStop(0.5, candlesticksGraphProps.CandleBodyColor);
            gradient.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
                gethighcomp(bluecomp));
            ctx.fillStyle = gradient;
            ctx.strokeStyle = candlesticksGraphProps.CandleLineColor;
            ctx.beginPath();
            if (candlesticksGraphProps.Data[c][0] < candlesticksGraphProps.Data[c][1]) {
                ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth -
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][0] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight -
                        16) / candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth +
                    candlesticksGraphProps.CandleBodyWidth / 2,
                    candlesticksGraphProps.Y + candlesticksGraphProps.Height -
                    candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][0] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight -
                        16) / candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth +
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][1] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth -
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][1] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.closePath();
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth,
                    candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][0] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth,
                    candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][2] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth,
                    candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][1] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][3] *
                        (candlesticksGraphProps.Height - candlesticksGraphProps.TitleHeight -
                            candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.closePath();
                ctx.stroke();
            } else {
                ctx.strokeStyle = candlesticksGraphProps.CandleBodyColor;
                ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth -
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][0] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth +
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][0] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth +
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][1] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth -
                    candlesticksGraphProps.CandleBodyWidth / 2, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][1] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.closePath();
                ctx.stroke();
                ctx.strokeStyle = candlesticksGraphProps.CandleLineColor;
                ctx.beginPath();
                ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][1] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][2] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.closePath();
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][0] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.lineTo(candlesticksGraphProps.X + candlesticksGraphProps.MarginLeft +
                    (c + 1) * candlesticksGraphProps.XMarksWidth, candlesticksGraphProps.Y +
                    candlesticksGraphProps.Height - candlesticksGraphProps.AxisLabelsHeight -
                    8 - candlesticksGraphProps.Data[c][3] * (candlesticksGraphProps.Height -
                        candlesticksGraphProps.TitleHeight -
                        candlesticksGraphProps.AxisLabelsHeight - 16) /
                        candlesticksGraphProps.YMaxValue);
                ctx.closePath();
                ctx.stroke();
            }
        }
        ctx.restore();
    }, canvasid);
}

