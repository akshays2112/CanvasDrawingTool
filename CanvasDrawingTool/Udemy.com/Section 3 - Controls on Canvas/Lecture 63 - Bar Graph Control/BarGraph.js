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

//Bar graph control code starts here

var barGraphsPropsArray = new Array();

function getBarGraphProps(canvasid, windowid) {
    for (var i = 0; i < barGraphsPropsArray.length; i++) {
        if (barGraphsPropsArray[i].CanvasID === canvasid &&
            barGraphsPropsArray[i].WindowID === windowid) {
            return barGraphsPropsArray[i];
        }
    }
}

function BarGraph() { }

BarGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    MaxValue: null, NumMarksY: null, Title: null, TitleTextColor: null,
    TitleTextHeight: null,
    TitleTextFontString: null, BarWidth: null, AxisLabelsTextHeight: null,
    AxisLabelsTextFontString: null, AxisLabelsTextColor: null, MarginLeft: null,
    GapBetweenBars: null, BarClickFunction: null, AlreadyUnregisteredAnimation: null,
    HasLegend: null, MarginRight: null, Tag: null, ControlNameID: null, Depth: null,
    TabStopIndex: null,

    Initialize: function () {
        return createBarGraph(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.Data, this.MaxValue, this.NumMarksY, this.Title,
            this.TitleTextColor,
            this.TitleTextHeight, this.TitleTextFontString, this.BarWidth,
            this.AxisLabelsTextColor,
            this.AxisLabelsTextHeight, this.AxisLabelsTextFontString,
            this.MarginLeft, this.GapBetweenBars,
            this.BarClickFunction, this.HasLegend, this.MarginRight,
            this.Tag, this.TabStopIndex);
    }
};

function createBarGraph(canvasid, controlNameId, x, y, width, height, depth, data,
    maxvalue, nummarksy, title, titletextcolor,
    titletextheigth, titletextfontstring, barwidth, axisLabelsTextColor,
    axisLabelsTextHeight, axisLabelsTextFontString,
    marginleft, gapbetweenbars, barClickFunction, haslegend, marginright,
    tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'BarGraph',
        controlNameId, null, tabstopindex);
    barGraphsPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        MaxValue: maxvalue, NumMarksY: nummarksy, Title: title,
        TitleTextColor: titletextcolor, TitleTextHeight: titletextheigth,
        TitleTextFontString: titletextfontstring, BarWidth: barwidth,
        BarLabelsWithBoundingBoxes: new Array(),
        H: height - axisLabelsTextHeight - 8 - 20,
        AxisLabelsTextHeight: axisLabelsTextHeight,
        AxisLabelsTextFontString: axisLabelsTextFontString,
        AxisLabelsTextColor: axisLabelsTextColor, MarginLeft: marginleft,
        GapBetweenBars: gapbetweenbars, BarClickFunction: barClickFunction,
        AlreadyUnregisteredAnimation: 0,
        HasLegend: haslegend, MarginRight: marginright, Tag: tag
    });
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {
        var barGraphProps = getBarGraphProps(canvasid1, windowid1);
        var clickx = e.calcX;
        var clicky = e.calcY;
        for (var i = 0; i < barGraphProps.BarLabelsWithBoundingBoxes.length; i++) {
            if (clickx >= barGraphProps.BarLabelsWithBoundingBoxes[i].X &&
                clickx <= barGraphProps.BarLabelsWithBoundingBoxes[i].X +
                barGraphProps.BarLabelsWithBoundingBoxes[i].Width &&
                clicky >= barGraphProps.BarLabelsWithBoundingBoxes[i].Y &&
                clicky <= barGraphProps.BarLabelsWithBoundingBoxes[i].Y +
                barGraphProps.BarLabelsWithBoundingBoxes[i].Height) {
                if (barGraphProps.BarClickFunction !== null &&
                    barGraphProps.BarClickFunction !== undefined) {
                    barGraphProps.BarClickFunction(canvasid1, windowid1, i);
                    return;
                }
            }
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var barGraphProps = getBarGraphProps(canvasid2, windowid2);
        var ctx = getCtx(canvasid2);
        var h = barGraphProps.H;
        if (barGraphProps.AlreadyUnregisteredAnimation === 0 && h <
            barGraphProps.TitleTextHeight + 8) {
            barGraphProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvasid2, windowid2);
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.fillStyle = barGraphProps.TitleTextColor;
        ctx.font = barGraphProps.TitleTextFontString;
        ctx.lineWidth = 2;
        ctx.fillText(barGraphProps.Title, barGraphProps.X + (barGraphProps.Width -
            ctx.measureText(barGraphProps.Title).width) / 2,
            barGraphProps.Y + barGraphProps.TitleTextHeight + 4);
        ctx.lineWidth = 1;
        ctx.fillStyle = barGraphProps.AxisLabelsTextColor;
        ctx.font = barGraphProps.AxisLabelsTextFontString;
        var yaxisheight = barGraphProps.Height - barGraphProps.TitleTextHeight -
            barGraphProps.AxisLabelsTextHeight - 16;
        ctx.beginPath();
        ctx.moveTo(barGraphProps.X + barGraphProps.MarginLeft, barGraphProps.Y +
            barGraphProps.TitleTextHeight + 8 + yaxisheight);
        ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft, barGraphProps.Y +
            barGraphProps.TitleTextHeight + 8);
        ctx.stroke();
        for (var c = 0; c < barGraphProps.NumMarksY; c++) {
            var val = barGraphProps.MaxValue / barGraphProps.NumMarksY * c;
            val = Math.round(val * 100) / 100;
            var tw = ctx.measureText(val.toString()).width;
            var yval = yaxisheight / barGraphProps.NumMarksY;
            ctx.fillText(val.toString(), barGraphProps.X + barGraphProps.MarginLeft -
                tw - 5, barGraphProps.Y + barGraphProps.TitleTextHeight +
                8 + barGraphProps.AxisLabelsTextHeight / 2 + yaxisheight - c * yval);
            ctx.beginPath();
            ctx.moveTo(barGraphProps.X + barGraphProps.MarginLeft, barGraphProps.Y +
                barGraphProps.TitleTextHeight + 8 + yaxisheight - c * yval);
            ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft +
                barGraphProps.Data.length * (barGraphProps.BarWidth +
                    barGraphProps.GapBetweenBars) + barGraphProps.GapBetweenBars,
                barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + yaxisheight -
                c * yval);
            ctx.stroke();
        }
        barGraphProps.BarLabelsWithBoundingBoxes = new Array();
        for (var i = 0; i < barGraphProps.Data.length; i++) {
            if (barGraphProps.HasLegend !== 1) {
                var w = ctx.measureText(barGraphProps.Data[i][0]).width;
                ctx.fillStyle = barGraphProps.AxisLabelsTextColor;
                ctx.font = barGraphProps.AxisLabelsTextFontString;
                if (w < barGraphProps.BarWidth) {
                    ctx.fillText(barGraphProps.Data[i][0], barGraphProps.X +
                        barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
                        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) +
                        (barGraphProps.BarWidth - w) / 2, barGraphProps.Y + barGraphProps.Height - 4);
                } else {
                    ctx.fillText(barGraphProps.Data[i][0], barGraphProps.X +
                        barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
                        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) -
                        (w - barGraphProps.BarWidth) / 2, barGraphProps.Y +
                        barGraphProps.Height - 4);
                }
            }
            drawrect(canvasid2, windowid2, ctx, barGraphProps, i, yaxisheight);
        }
        if (barGraphProps.HasLegend === 1) {
            for (var o = 0; o < barGraphProps.Data.length; o++) {
                ctx.fillStyle = data[o][2];
                ctx.fillRect(barGraphProps.X + barGraphProps.Width -
                    barGraphProps.MarginRight, barGraphProps.Y + barGraphProps.Height
                    - 8 - barGraphProps.AxisLabelsTextHeight - o * (8 +
                        barGraphProps.AxisLabelsTextHeight), 30,
                    barGraphProps.AxisLabelsTextHeight);
                ctx.fillText(data[o][0], barGraphProps.X + barGraphProps.Width -
                    barGraphProps.MarginRight + 35, barGraphProps.Y + barGraphProps.Height
                    - 8 - o * (8 + barGraphProps.AxisLabelsTextHeight));
            }
        }
        if (h >= barGraphProps.TitleTextHeight + 8) {
            barGraphProps.H -= 5;
        }
        ctx.restore();
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}


function drawrect(canvasid, windowid, ctx, barGraphProps, i, yaxisheight) {
    var hthis = barGraphProps.H;
    if (barGraphProps.H < barGraphProps.TitleTextHeight + 8 + yaxisheight -
        yaxisheight * barGraphProps.Data[i][1] / barGraphProps.MaxValue) {
        hthis = yaxisheight - yaxisheight * barGraphProps.Data[i][1] /
            barGraphProps.MaxValue;
    }
    barGraphProps.BarLabelsWithBoundingBoxes.push({
        X: barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars),
        Y: barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + hthis,
        Width: barGraphProps.BarWidth, Height: yaxisheight - hthis
    });
    var gradient = ctx.createLinearGradient(barGraphProps.X,
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8, barGraphProps.X,
        barGraphProps.Y + barGraphProps.Height - barGraphProps.AxisLabelsTextHeight - 8);
    var colorstr = barGraphProps.Data[i][2];
    var redcomp = parseInt(colorstr.substr(1, 2), 16);
    var greencomp = parseInt(colorstr.substr(3, 2), 16);
    var bluecomp = parseInt(colorstr.substr(5, 2), 16);
    gradient.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
        getlowcomp(bluecomp));
    gradient.addColorStop(0.5, colorstr);
    gradient.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
        gethighcomp(bluecomp));
    ctx.fillStyle = gradient;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
        getlowcomp(bluecomp);
    ctx.beginPath();
    ctx.moveTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars),
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + 5 + hthis);
    ctx.arc(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) + 5,
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + 5 + hthis, 5, Math.PI,
        Math.PI / 180 * 270, false);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft +
        barGraphProps.GapBetweenBars + barGraphProps.BarWidth - 5 +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars),
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + hthis);
    ctx.arc(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth - 5 +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars), barGraphProps.Y +
        barGraphProps.TitleTextHeight + 8 + 5 + hthis, 5, Math.PI / 180 * 270, 0, false);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft +
        barGraphProps.GapBetweenBars + barGraphProps.BarWidth + i *
            (barGraphProps.BarWidth + 20),
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + yaxisheight);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars),
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + yaxisheight);
    ctx.closePath();
    ctx.fill();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = '#FFFFFF';
    gradient = ctx.createLinearGradient(0, 0, 50, 300);
    gradient.addColorStop(0.0, '#FFFFFF');
    gradient.addColorStop(0.5, '#000000');
    gradient.addColorStop(1.0, '#FFFFFF');
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.moveTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) + 5,
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + 5 + hthis);
    ctx.arc(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) + 10,
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + 10 + hthis, 5, Math.PI,
        Math.PI / 180 * 270, false);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth - 10 +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars), barGraphProps.Y +
        barGraphProps.TitleTextHeight + 8 + hthis + 5);
    ctx.arc(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth - 10 +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars), barGraphProps.Y +
        barGraphProps.TitleTextHeight + 8 + 10 + hthis, 5, Math.PI / 180 * 270, 0, false);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth + i * (barGraphProps.BarWidth + 20) - 5,
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + yaxisheight);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) + 5,
        barGraphProps.Y + barGraphProps.TitleTextHeight + 8 + yaxisheight);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
    var vw = ctx.measureText(barGraphProps.Data[i][1].toString()).width;
    if (vw < barGraphProps.BarWidth) {
        ctx.fillText(barGraphProps.Data[i][1].toString(), barGraphProps.X +
            barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
            i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) +
            (barGraphProps.BarWidth + -vw) / 2,
            barGraphProps.Y + barGraphProps.TitleTextHeight + 8 +
            barGraphProps.AxisLabelsTextHeight + hthis + (yaxisheight - hthis) / 2);
    } else {
        ctx.fillText(barGraphProps.Data[i][1].toString(), barGraphProps.X +
            barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
            i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars) -
            (vw - barGraphProps.BarWidth) / 2,
            barGraphProps.Y + barGraphProps.TitleTextHeight + 8 +
            barGraphProps.AxisLabelsTextHeight + hthis + (yaxisheight - hthis) / 2);
    }
}

