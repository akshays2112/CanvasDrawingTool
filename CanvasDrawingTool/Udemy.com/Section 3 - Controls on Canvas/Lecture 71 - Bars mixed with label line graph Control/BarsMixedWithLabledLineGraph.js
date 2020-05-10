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

//Bars mixed with labeled line graph

var barsMixedWithLabledLineGraphsPropsArray = new Array();

function getBarsMixedWithLabledLineGraphProps(canvasid, windowid) {
    for (var i = 0; i < barsMixedWithLabledLineGraphsPropsArray.length; i++) {
        if (barsMixedWithLabledLineGraphsPropsArray[i].CanvasID ===
            canvasid && barsMixedWithLabledLineGraphsPropsArray[i].WindowID === windowid) {
            return barsMixedWithLabledLineGraphsPropsArray[i];
        }
    }
}

function BarsMixedWithLabledLineGraph() { }

BarsMixedWithLabledLineGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    MaxValue: null, NumMarksY: null, Title: null, TitleTextColor: null, TitleTextHeight: null,
    TitleTextFontString: null, BarWidth: null, AxisLabelsTextHeight: null,
    AxisLabelsTextFontString: null, AxisLabelsTextColor: null, MarginLeft: null,
    GapBetweenBars: null, BarClickFunction: null,
    HasLegend: null, MarginRight: null, LineClickFunction: null,
    YMaxValue: null, Tag: null, ControlNameID: null, Depth: null, TabStopIndex: null,
    LinesData: null,

    Initialize: function () {
        return createBarsMixedWithLabledLineGraph(this.CanvasID, this.ControlNameID,
            this.X, this.Y, this.Width,
            this.Height, this.Depth, this.Data, this.MaxValue, this.NumMarksY,
            this.Title, this.TitleTextColor,
            this.TitleTextHeight, this.TitleTextFontString, this.BarWidth,
            this.AxisLabelsTextColor,
            this.AxisLabelsTextHeight, this.AxisLabelsTextFontString, this.MarginLeft,
            this.GapBetweenBars,
            this.BarClickFunction, this.HasLegend, this.MarginRight, this.LinesData,
            this.LineClickFunction, this.Tag, this.TabStopIndex);
    }
};

function createBarsMixedWithLabledLineGraph(canvasid, controlNameId, x, y, width,
    height, depth, data, maxvalue, nummarksy, title, titletextcolor,
    titletextheight, titletextfontstring, barwidth, axisLabelsTextColor,
    axisLabelsTextHeight, axisLabelsTextFontString,
    marginleft, gapbetweenbars, barClickFunction, haslegend, marginright, linesData,
    lineClickFunction, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'BarsMixedWithLabeledLineGraph', controlNameId, null, tabstopindex);
    barsMixedWithLabledLineGraphsPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        MaxValue: maxvalue, NumMarksY: nummarksy, Title: title,
        TitleTextColor: titletextcolor, TitleTextHeight: titletextheight,
        TitleTextFontString: titletextfontstring, BarWidth: barwidth,
        BarLabelsWithBoundingBoxes: new Array(),
        H: height - axisLabelsTextHeight - 8 - 20,
        AxisLabelsTextHeight: axisLabelsTextHeight,
        AxisLabelsTextFontString: axisLabelsTextFontString,
        AxisLabelsTextColor: axisLabelsTextColor, MarginLeft: marginleft,
        GapBetweenBars: gapbetweenbars, BarClickFunction: barClickFunction,
        AlreadyUnregisteredAnimation: 0,
        HasLegend: haslegend, MarginRight: marginright, LinesData: linesData,
        LineXYs: new Array(), LineClickFunction: lineClickFunction,
        YMaxValue: maxvalue, Tag: tag
    });
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {
        var barsMixedWithLabledLineGraphProps = getBarsMixedWithLabledLineGraphProps(
            canvasid1, windowid1);
        var clickx = e.calcX;
        var clicky = e.calcY;
        for (var i = 0; i <
            barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes.length; i++) {
            if (clickx >=
                barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes[i].X && clickx
                <= barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes[i].X +
                barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes[i].Width &&
                clicky >= barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes[i].Y &&
                clicky <= barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes[i].Y +
                barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes[i].Height) {
                if (barsMixedWithLabledLineGraphProps.BarClickFunction !== null &&
                    barsMixedWithLabledLineGraphProps.BarClickFunction !== undefined) {
                    barsMixedWithLabledLineGraphProps.BarClickFunction(canvasid1, windowid1, i);
                    return;
                }
            }
        }
        var linexys = barsMixedWithLabledLineGraphProps.LineXYs;
        for (i = 0; i < linexys.length; i++) {
            for (var j = 0; j < linexys[i].length - 1; j++) {
                if (clickx >= linexys[i][j][0] && clickx <= linexys[i][j + 1][0]) {
                    if (clicky <= linexys[i][j][1] && clicky >= linexys[i][j + 1][1] ||
                        clicky >= linexys[i][j][1] && clicky <= linexys[i][j + 1][1]) {
                        y = (linexys[i][j][1] - linexys[i][j + 1][1]) * (clickx -
                            linexys[i][j][0]) / (linexys[i][j][0] - linexys[i][j + 1][0]) +
                            linexys[i][j][1];
                        if (y + 4 > clicky && y - 4 < clicky) {
                            if (barsMixedWithLabledLineGraphProps.LineClickFunction !== null
                                && barsMixedWithLabledLineGraphProps.LineClickFunction
                                !== undefined) {
                                barsMixedWithLabledLineGraphProps.LineClickFunction(
                                    canvasid1, windowid1, i);
                            }
                        }
                    }
                }
            }
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var barsMixedWithLabledLineGraphProps = getBarsMixedWithLabledLineGraphProps(
            canvasid2, windowid2);
        var ctx = getCtx(canvasid2);
        var h = barsMixedWithLabledLineGraphProps.H;
        if (barsMixedWithLabledLineGraphProps.AlreadyUnregisteredAnimation === 0 && h <
            barsMixedWithLabledLineGraphProps.TitleTextHeight + 8) {
            barsMixedWithLabledLineGraphProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvasid2, windowid2);
        }
        barsMixedWithLabledLineGraphProps.LineXYs = new Array();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.fillStyle = barsMixedWithLabledLineGraphProps.TitleTextColor;
        ctx.font = barsMixedWithLabledLineGraphProps.TitleTextFontString;
        ctx.lineWidth = 2;
        ctx.fillText(barsMixedWithLabledLineGraphProps.Title,
            barsMixedWithLabledLineGraphProps.X + (barsMixedWithLabledLineGraphProps.Width -
                ctx.measureText(barsMixedWithLabledLineGraphProps.Title).width) / 2,
            barsMixedWithLabledLineGraphProps.Y +
            barsMixedWithLabledLineGraphProps.TitleTextHeight + 4);
        ctx.lineWidth = 1;
        ctx.fillStyle = barsMixedWithLabledLineGraphProps.AxisLabelsTextColor;
        ctx.font = barsMixedWithLabledLineGraphProps.AxisLabelsTextFontString;
        var yaxisheight = barsMixedWithLabledLineGraphProps.Height -
            barsMixedWithLabledLineGraphProps.TitleTextHeight -
            barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight - 16;
        ctx.beginPath();
        ctx.moveTo(barsMixedWithLabledLineGraphProps.X +
            barsMixedWithLabledLineGraphProps.MarginLeft, barsMixedWithLabledLineGraphProps.Y +
            barsMixedWithLabledLineGraphProps.TitleTextHeight + 8 + yaxisheight);
        ctx.lineTo(barsMixedWithLabledLineGraphProps.X +
            barsMixedWithLabledLineGraphProps.MarginLeft, barsMixedWithLabledLineGraphProps.Y +
            barsMixedWithLabledLineGraphProps.TitleTextHeight + 8);
        ctx.stroke();
        for (var c = 0; c < barsMixedWithLabledLineGraphProps.NumMarksY; c++) {
            var val = barsMixedWithLabledLineGraphProps.MaxValue /
                barsMixedWithLabledLineGraphProps.NumMarksY * c;
            val = Math.round(val * 100) / 100;
            var tw = ctx.measureText(val.toString()).width;
            var yval = yaxisheight / barsMixedWithLabledLineGraphProps.NumMarksY;
            ctx.fillText(val.toString(), barsMixedWithLabledLineGraphProps.X +
                barsMixedWithLabledLineGraphProps.MarginLeft - tw - 5,
                barsMixedWithLabledLineGraphProps.Y +
                barsMixedWithLabledLineGraphProps.TitleTextHeight +
                8 + barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight / 2 +
                yaxisheight - c * yval);
            ctx.beginPath();
            ctx.moveTo(barsMixedWithLabledLineGraphProps.X +
                barsMixedWithLabledLineGraphProps.MarginLeft,
                barsMixedWithLabledLineGraphProps.Y +
                barsMixedWithLabledLineGraphProps.TitleTextHeight + 8 + yaxisheight -
                c * yval);
            ctx.lineTo(barsMixedWithLabledLineGraphProps.X +
                barsMixedWithLabledLineGraphProps.MarginLeft +
                barsMixedWithLabledLineGraphProps.Data.length *
                    (barsMixedWithLabledLineGraphProps.BarWidth +
                        barsMixedWithLabledLineGraphProps.GapBetweenBars) +
                barsMixedWithLabledLineGraphProps.GapBetweenBars,
                barsMixedWithLabledLineGraphProps.Y +
                barsMixedWithLabledLineGraphProps.TitleTextHeight + 8 + yaxisheight -
                c * yval);
            ctx.stroke();
        }
        barsMixedWithLabledLineGraphProps.BarLabelsWithBoundingBoxes = new Array();
        for (var i = 0; i < barsMixedWithLabledLineGraphProps.Data.length; i++) {
            if (barsMixedWithLabledLineGraphProps.HasLegend !== 1) {
                var w = ctx.measureText(barsMixedWithLabledLineGraphProps.Data[i][0]).width;
                ctx.fillStyle = barsMixedWithLabledLineGraphProps.AxisLabelsTextColor;
                ctx.font = barsMixedWithLabledLineGraphProps.AxisLabelsTextFontString;
                if (w < barsMixedWithLabledLineGraphProps.BarWidth) {
                    ctx.fillText(barsMixedWithLabledLineGraphProps.Data[i][0],
                        barsMixedWithLabledLineGraphProps.X +
                        barsMixedWithLabledLineGraphProps.MarginLeft +
                        barsMixedWithLabledLineGraphProps.GapBetweenBars +
                        i * (barsMixedWithLabledLineGraphProps.BarWidth +
                            barsMixedWithLabledLineGraphProps.GapBetweenBars) +
                        (barsMixedWithLabledLineGraphProps.BarWidth - w) / 2,
                        barsMixedWithLabledLineGraphProps.Y +
                        barsMixedWithLabledLineGraphProps.Height - 4);
                } else {
                    ctx.fillText(barsMixedWithLabledLineGraphProps.Data[i][0],
                        barsMixedWithLabledLineGraphProps.X +
                        barsMixedWithLabledLineGraphProps.MarginLeft +
                        barsMixedWithLabledLineGraphProps.GapBetweenBars +
                        i * (barsMixedWithLabledLineGraphProps.BarWidth +
                            barsMixedWithLabledLineGraphProps.GapBetweenBars) -
                        (w - barsMixedWithLabledLineGraphProps.BarWidth) / 2,
                        barsMixedWithLabledLineGraphProps.Y +
                        barsMixedWithLabledLineGraphProps.Height - 4);
                }
            }
            drawrect(canvasid2, windowid2, ctx, barsMixedWithLabledLineGraphProps, i,
                yaxisheight);
        }
        var xlabels = new Array();
        var maxnumlabels = 0;
        for (i = 0; i < barsMixedWithLabledLineGraphProps.LinesData.length; i++) {
            if (barsMixedWithLabledLineGraphProps.LinesData[i][0].length > maxnumlabels) {
                maxnumlabels = barsMixedWithLabledLineGraphProps.LinesData[i][0].length;
            }
        }
        for (i = 0; i < maxnumlabels; i++) {
            for (var j = 0; j < barsMixedWithLabledLineGraphProps.LinesData.length; j++) {
                if (i < barsMixedWithLabledLineGraphProps.LinesData[j][0].length) {
                    var foundlabel = 0;
                    for (var p = 0; p < xlabels.length; p++) {
                        if (xlabels[p] ===
                            barsMixedWithLabledLineGraphProps.LinesData[j][0][i][0]) {
                            foundlabel = 1;
                            break;
                        }
                    }
                    if (foundlabel === 0) {
                        xlabels.push(
                            barsMixedWithLabledLineGraphProps.LinesData[j][0][i][0]);
                    }
                }
            }
        }
        i = 0;
        while (i < barsMixedWithLabledLineGraphProps.LinesData.length) {
            drawlineforbarsmixedwithlinesgraph(ctx, barsMixedWithLabledLineGraphProps,
                i, xlabels);
            i++;
        }
        if (barsMixedWithLabledLineGraphProps.HasLegend === 1) {
            for (var o = 0; o < barsMixedWithLabledLineGraphProps.Data.length; o++) {
                ctx.fillStyle = data[o][2];
                ctx.fillRect(barsMixedWithLabledLineGraphProps.X +
                    barsMixedWithLabledLineGraphProps.Width -
                    barsMixedWithLabledLineGraphProps.MarginRight,
                    barsMixedWithLabledLineGraphProps.Y +
                    barsMixedWithLabledLineGraphProps.Height
                    - 8 - barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight - o *
                        (8 + barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight),
                    30, barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight);
                ctx.fillText(data[o][0], barsMixedWithLabledLineGraphProps.X +
                    barsMixedWithLabledLineGraphProps.Width -
                    barsMixedWithLabledLineGraphProps.MarginRight + 35,
                    barsMixedWithLabledLineGraphProps.Y +
                    barsMixedWithLabledLineGraphProps.Height
                    - 8 - o * (8 +
                        barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight));
            }
        }
        if (h >= barsMixedWithLabledLineGraphProps.TitleTextHeight + 8) {
            barsMixedWithLabledLineGraphProps.H -= 5;
        }
        ctx.restore();
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}


function drawlineforbarsmixedwithlinesgraph(ctx,
    barsMixedWithLabledLineGraphProps, x, xlabels) {
    var redcomp = parseInt(
        barsMixedWithLabledLineGraphProps.LinesData[x][1].substr(1, 2), 16);
    var greencomp = parseInt(
        barsMixedWithLabledLineGraphProps.LinesData[x][1].substr(3, 2), 16);
    var bluecomp = parseInt(
        barsMixedWithLabledLineGraphProps.LinesData[x][1].substr(5, 2), 16);
    ctx.strokeStyle = barsMixedWithLabledLineGraphProps.LinesData[x][1];
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.miterLimit = 0.0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 5;
    ctx.shadowColor = '#' + getlowcomp(redcomp).toString(16) +
        getlowcomp(greencomp).toString(16) + getlowcomp(bluecomp).toString(16);
    ctx.beginPath();
    var linexys2 = new Array();
    linexys2.push([barsMixedWithLabledLineGraphProps.X +
        barsMixedWithLabledLineGraphProps.MarginLeft +
        barsMixedWithLabledLineGraphProps.GapBetweenBars +
        barsMixedWithLabledLineGraphProps.BarWidth / 2 +
        findXLabelIndexForValue(xlabels,
            barsMixedWithLabledLineGraphProps.LinesData[x][0][0][0]) *
        (barsMixedWithLabledLineGraphProps.Width -
            barsMixedWithLabledLineGraphProps.MarginLeft -
            barsMixedWithLabledLineGraphProps.GapBetweenBars -
            barsMixedWithLabledLineGraphProps.BarWidth / 2) / xlabels.length,
    barsMixedWithLabledLineGraphProps.Y + barsMixedWithLabledLineGraphProps.Height -
    barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight -
    8 - barsMixedWithLabledLineGraphProps.LinesData[x][0][0][1] *
    (barsMixedWithLabledLineGraphProps.Height -
        barsMixedWithLabledLineGraphProps.TitleTextHeight -
        barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight - 16) /
    barsMixedWithLabledLineGraphProps.YMaxValue]);
    ctx.moveTo(barsMixedWithLabledLineGraphProps.X +
        barsMixedWithLabledLineGraphProps.MarginLeft +
        barsMixedWithLabledLineGraphProps.GapBetweenBars +
        barsMixedWithLabledLineGraphProps.BarWidth / 2 +
        findXLabelIndexForValue(xlabels,
            barsMixedWithLabledLineGraphProps.LinesData[x][0][0][0]) *
        (barsMixedWithLabledLineGraphProps.Width -
            barsMixedWithLabledLineGraphProps.MarginLeft -
                barsMixedWithLabledLineGraphProps.GapBetweenBars -
                barsMixedWithLabledLineGraphProps.BarWidth / 2) / xlabels.length,
        barsMixedWithLabledLineGraphProps.Y + barsMixedWithLabledLineGraphProps.Height -
        barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight -
        8 - barsMixedWithLabledLineGraphProps.LinesData[x][0][0][1] *
            (barsMixedWithLabledLineGraphProps.Height -
                barsMixedWithLabledLineGraphProps.TitleTextHeight -
                barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight - 16) /
            barsMixedWithLabledLineGraphProps.YMaxValue);
    for (var i = 1; i < barsMixedWithLabledLineGraphProps.H && i <
        barsMixedWithLabledLineGraphProps.LinesData[x][0].length; i++) {
        linexys2.push([barsMixedWithLabledLineGraphProps.X +
            barsMixedWithLabledLineGraphProps.MarginLeft +
            barsMixedWithLabledLineGraphProps.GapBetweenBars +
            barsMixedWithLabledLineGraphProps.BarWidth / 2 +
            findXLabelIndexForValue(xlabels,
                barsMixedWithLabledLineGraphProps.LinesData[x][0][i][0]) *
            (barsMixedWithLabledLineGraphProps.GapBetweenBars +
                barsMixedWithLabledLineGraphProps.BarWidth),
        barsMixedWithLabledLineGraphProps.Y +
        barsMixedWithLabledLineGraphProps.Height -
        barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight -
        8 - barsMixedWithLabledLineGraphProps.LinesData[x][0][i][1] *
        (barsMixedWithLabledLineGraphProps.Height -
            barsMixedWithLabledLineGraphProps.TitleTextHeight -
            barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight - 16)
        / barsMixedWithLabledLineGraphProps.YMaxValue]);
        ctx.lineTo(barsMixedWithLabledLineGraphProps.X +
            barsMixedWithLabledLineGraphProps.MarginLeft +
            barsMixedWithLabledLineGraphProps.GapBetweenBars +
            barsMixedWithLabledLineGraphProps.BarWidth / 2 +
            findXLabelIndexForValue(xlabels,
                barsMixedWithLabledLineGraphProps.LinesData[x][0][i][0]) *
                (barsMixedWithLabledLineGraphProps.GapBetweenBars +
                    barsMixedWithLabledLineGraphProps.BarWidth),
            barsMixedWithLabledLineGraphProps.Y +
            barsMixedWithLabledLineGraphProps.Height -
            barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight -
            8 - barsMixedWithLabledLineGraphProps.LinesData[x][0][i][1] *
                (barsMixedWithLabledLineGraphProps.Height -
                    barsMixedWithLabledLineGraphProps.TitleTextHeight -
                    barsMixedWithLabledLineGraphProps.AxisLabelsTextHeight - 16)
                / barsMixedWithLabledLineGraphProps.YMaxValue);
    }
    barsMixedWithLabledLineGraphProps.LineXYs.push(linexys2);
    ctx.stroke();
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
    var gradient = ctx.createLinearGradient(barGraphProps.X, barGraphProps.Y +
        barGraphProps.TitleTextHeight + 8, barGraphProps.X,
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
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth - 5 +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars), barGraphProps.Y +
        barGraphProps.TitleTextHeight + 8 + hthis);
    ctx.arc(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth - 5 +
        i * (barGraphProps.BarWidth + barGraphProps.GapBetweenBars), barGraphProps.Y +
        barGraphProps.TitleTextHeight + 8 + 5 + hthis, 5, Math.PI / 180 * 270, 0, false);
    ctx.lineTo(barGraphProps.X + barGraphProps.MarginLeft + barGraphProps.GapBetweenBars +
        barGraphProps.BarWidth + i * (barGraphProps.BarWidth + 20),
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

function findXLabelIndexForValue(xlabels, val) {
    for (var i = 0; i < xlabels.length; i++) {
        if (xlabels[i] === val) {
            return i;
        }
    }
}

