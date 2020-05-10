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

//Stacked Bar Graph

var stackedBarGraphPropsArray = new Array();

function getstackedBarGraphProps(canvasid, windowid) {
    for (var i = 0; i < stackedBarGraphPropsArray.length; i++) {
        if (stackedBarGraphPropsArray[i].CanvasID === canvasid &&
            stackedBarGraphPropsArray[i].WindowID === windowid) {
            return stackedBarGraphPropsArray[i];
        }
    }
}

function StackedBarGraph() { }

StackedBarGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null,
    Data: null, MaxValue: null, NumMarksY: null, Title: null, TitleColor: null,
    TitleHeight: null,
    TitleFontString: null, BarWidth: null, GapBetweenBarSets: null,
    AxisLabelsColor: null, AxisLabelsHeight: null, AxisLabelsFontString: null,
    BarClickFunction: null, MarginLeft: null, Tag: null, ControlNameID: null,
    Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createStackedBarGraph(this.CanvasID, this.ControlNameID, this.X,
            this.Y, this.Width, this.Height,
            this.Depth, this.Data, this.MaxValue, this.NumMarksY, this.Title,
            this.TitleColor, this.TitleHeight,
            this.TitleFontString, this.BarWidth, this.GapBetweenBarSets,
            this.AxisLabelsColor, this.AxisLabelsHeight,
            this.AxisLabelsFontString, this.BarClickFunction, this.MarginLeft,
            this.Tag, this.TabStopIndex);
    }
};

function createStackedBarGraph(canvasid, controlNameId, x, y, width, height, depth,
    data, maxvalue, nummarksy, title, titlecolor, titleheight,
    titlefontstring, barwidth, gapbetweenbarssets, axislabelscolor,
    axislabelsheight, axislabelsfontstring, barClickFunction, marginleft, tag,
    tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'StackedBarGraph', controlNameId, null, tabstopindex);
    stackedBarGraphPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width, Height: height,
        Data: data, MaxValue: maxvalue, NumMarksY: nummarksy, Title: title,
        TitleColor: titlecolor, TitleHeight: titleheight,
        TitleFontString: titlefontstring, BarWidth: barwidth,
        GapBetweenBarSets: gapbetweenbarssets, H: height - titleheight - 16 -
        axislabelsheight, AxisLabelsColor: axislabelscolor,
        AxisLabelsHeight: axislabelsheight, AxisLabelsFontString: axislabelsfontstring,
        BarLabelsWithBoundingBoxes: new Array(), BarClickFunction: barClickFunction,
        AlreadyUnregisteredAnimation: 0,
        MarginLeft: marginleft, Tag: tag
    });
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {
        var stackedBarGraphProps = getstackedBarGraphProps(canvasid1, windowid1);
        var data = stackedBarGraphProps.Data;
        var totalvalue = 0;
        for (var i = 0; i < data.length; i++) {
            totalvalue += data[i][1];
        }
        var clickx = e.calcX;
        var clicky = e.calcY;
        for (i = 0; i < stackedBarGraphProps.BarLabelsWithBoundingBoxes.length; i++) {
            if (clickx >= stackedBarGraphProps.BarLabelsWithBoundingBoxes[i][1] &&
                clickx <= stackedBarGraphProps.BarLabelsWithBoundingBoxes[i][3] &&
                clicky >= stackedBarGraphProps.BarLabelsWithBoundingBoxes[i][2] &&
                clicky <= stackedBarGraphProps.BarLabelsWithBoundingBoxes[i][4]) {
                if (stackedBarGraphProps.BarClickFunction !== null &&
                    stackedBarGraphProps.BarClickFunction !== undefined) {
                    stackedBarGraphProps.BarClickFunction(canvasid1, windowid1, i);
                }
            }
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var stackedBarGraphProps = getstackedBarGraphProps(canvasid2, windowid2);
        if (stackedBarGraphProps.AlreadyUnregisteredAnimation === 0 &&
            stackedBarGraphProps.H < 100) {
            unregisterAnimatedWindow(canvasid2, windowid2);
            stackedBarGraphProps.AlreadyUnregisteredAnimation = 1;
        }
        var ctx = getCtx(canvasid2);
        ctx.save();
        ctx.fillStyle = stackedBarGraphProps.TitleColor;
        ctx.font = stackedBarGraphProps.TitleFontString;
        ctx.fillText(stackedBarGraphProps.Title, stackedBarGraphProps.X +
            (stackedBarGraphProps.Width - ctx.measureText(
                stackedBarGraphProps.Title).width) / 2,
            stackedBarGraphProps.Y + stackedBarGraphProps.TitleHeight + 4);
        ctx.font = stackedBarGraphProps.AxisLabelsFontString;
        ctx.beginPath();
        ctx.moveTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft,
            stackedBarGraphProps.Y + stackedBarGraphProps.Height -
            stackedBarGraphProps.AxisLabelsHeight - 8);
        ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft,
            stackedBarGraphProps.Y + stackedBarGraphProps.TitleHeight + 8);
        ctx.stroke();
        for (var c = 0; c < stackedBarGraphProps.NumMarksY; c++) {
            var val = stackedBarGraphProps.MaxValue / stackedBarGraphProps.NumMarksY * c;
            val = Math.round(val * 100) / 100;
            var tw = ctx.measureText(val.toString()).width;
            var yval = (stackedBarGraphProps.Height - stackedBarGraphProps.TitleHeight -
                stackedBarGraphProps.AxisLabelsHeight - 16) / stackedBarGraphProps.NumMarksY;
            ctx.fillText(val.toString(), stackedBarGraphProps.X +
                stackedBarGraphProps.MarginLeft - 10 - tw, stackedBarGraphProps.Y +
                stackedBarGraphProps.Height - stackedBarGraphProps.AxisLabelsHeight -
                8 - c * yval);
            ctx.beginPath();
            ctx.moveTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft - 5,
                stackedBarGraphProps.Y + stackedBarGraphProps.Height -
                stackedBarGraphProps.AxisLabelsHeight - 8 - c * yval);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets + stackedBarGraphProps.Data.length *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                stackedBarGraphProps.Height - stackedBarGraphProps.AxisLabelsHeight -
                8 - c * yval);
            ctx.stroke();
        }
        stackedBarGraphProps.BarLabelsWithBoundingBoxes = new Array();
        for (var i = 0; i < stackedBarGraphProps.Data.length; i++) {
            ctx.fillStyle = stackedBarGraphProps.AxisLabelsColor;
            ctx.font = stackedBarGraphProps.AxisLabelsFontString;
            var w = ctx.measureText(stackedBarGraphProps.Data[i][0]).width;
            if (w < stackedBarGraphProps.BarWidth) {
                ctx.fillText(stackedBarGraphProps.Data[i][0], stackedBarGraphProps.X +
                    stackedBarGraphProps.MarginLeft + i * stackedBarGraphProps.BarWidth +
                    (stackedBarGraphProps.BarWidth - w) / 2, stackedBarGraphProps.Y +
                    stackedBarGraphProps.Height - 4);
            } else {
                ctx.fillText(stackedBarGraphProps.Data[i][0], stackedBarGraphProps.X +
                    stackedBarGraphProps.MarginLeft + i * stackedBarGraphProps.BarWidth,
                    stackedBarGraphProps.Y + stackedBarGraphProps.Height -
                    stackedBarGraphProps.AxisLabelsHeight - 3);
            }
            drawmultiplerect(ctx, stackedBarGraphProps, i);
        }
        if (stackedBarGraphProps.AlreadyUnregisteredAnimation === 0 &&
            stackedBarGraphProps.H > 100) {
            stackedBarGraphProps.H -= 5;
        }
        ctx.restore();
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function drawmultiplerect(ctx, stackedBarGraphProps, i) {
    ctx.save();
    var hthis = stackedBarGraphProps.H;
    var total = 0;
    for (var x = 1; x < stackedBarGraphProps.Data.length; x++) {
        total += stackedBarGraphProps.Data[i][x][0];
    }
    var axisheight = stackedBarGraphProps.Height - stackedBarGraphProps.TitleHeight -
        stackedBarGraphProps.AxisLabelsHeight - 16;
    var topy = stackedBarGraphProps.Height - axisheight -
        stackedBarGraphProps.AxisLabelsHeight - 8;
    var bottomy = stackedBarGraphProps.Height - stackedBarGraphProps.AxisLabelsHeight - 8;
    if (stackedBarGraphProps.H < topy + (axisheight - axisheight /
        stackedBarGraphProps.MaxValue * total)) {
        hthis = topy + (axisheight - axisheight / stackedBarGraphProps.MaxValue * total);
    }
    stackedBarGraphProps.BarLabelsWithBoundingBoxes.push([stackedBarGraphProps.Data[i][0],
    stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
        (stackedBarGraphProps.BarWidth - stackedBarGraphProps.GapBetweenBarSets) / 2 +
        i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y + bottomy - hthis,
        stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
        stackedBarGraphProps.GapBetweenBarSets + (stackedBarGraphProps.BarWidth -
            stackedBarGraphProps.GapBetweenBarSets) / 2 + i * stackedBarGraphProps.BarWidth,
        stackedBarGraphProps.Y + bottomy]);
    var shift = 0;
    for (x = 1; x < stackedBarGraphProps.Data[i].length; x++) {
        var colorstr = stackedBarGraphProps.Data[i][x][1];
        var gradient = ctx.createLinearGradient(stackedBarGraphProps.X,
            stackedBarGraphProps.Y, stackedBarGraphProps.X + stackedBarGraphProps.BarWidth,
            stackedBarGraphProps.Y + axisheight);
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
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#' + getlowcomp(redcomp).toString(16) +
            getlowcomp(greencomp).toString(16) + getlowcomp(bluecomp).toString(16);
        hthis = (bottomy - stackedBarGraphProps.H) * stackedBarGraphProps.Data[i][x][0]
            / total;
        if (stackedBarGraphProps.H < topy + (axisheight - axisheight /
            stackedBarGraphProps.MaxValue * total)) {
            hthis = axisheight * stackedBarGraphProps.Data[i][x][0] /
                stackedBarGraphProps.MaxValue;
        }
        ctx.shadowOffsetY = 0;
        if (x < stackedBarGraphProps.Data[i].length - 1) {
            ctx.beginPath();
            ctx.moveTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - (shift + hthis));
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets + (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - (shift + hthis));
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets + (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - shift);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - shift);
            ctx.closePath();
            ctx.fill();
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#FFFFFF';
            gradient = ctx.createLinearGradient(stackedBarGraphProps.X,
                stackedBarGraphProps.Y, stackedBarGraphProps.X + stackedBarGraphProps.BarWidth,
                stackedBarGraphProps.Y + axisheight);
            gradient.addColorStop(0.0, '#FFFFFF');
            gradient.addColorStop(0.5, '#000000');
            gradient.addColorStop(1.0, '#FFFFFF');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.moveTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth + 5, stackedBarGraphProps.Y +
                bottomy - (shift + hthis) + 5);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets - 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                        stackedBarGraphProps.BarWidth,
                stackedBarGraphProps.Y + bottomy - (shift + hthis) + 5);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets - 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                        stackedBarGraphProps.BarWidth,
                stackedBarGraphProps.Y + bottomy - shift - 5);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft + 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - shift - 5);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;
        } else {
            ctx.beginPath();
            ctx.moveTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - (shift + hthis) + 5);
            ctx.arc(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft + 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y + bottomy -
                (shift + hthis) + 5, 5, Math.PI, Math.PI / 180 * 270, false);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.BarWidth - stackedBarGraphProps.GapBetweenBarSets - 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                        stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - (shift + hthis));
            ctx.arc(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets - 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - (shift + hthis) + 5, 5, Math.PI / 180 * 270, 0, false);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets + (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - shift);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - shift);
            ctx.closePath();
            ctx.fill();
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 0;
            ctx.shadowColor = '#FFFFFF';
            gradient = ctx.createLinearGradient(stackedBarGraphProps.X,
                stackedBarGraphProps.Y, stackedBarGraphProps.X +
                stackedBarGraphProps.BarWidth,
                stackedBarGraphProps.Y + axisheight);
            gradient.addColorStop(0.0, '#FFFFFF');
            gradient.addColorStop(0.5, '#000000');
            gradient.addColorStop(1.0, '#FFFFFF');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = 0.1;
            ctx.beginPath();
            ctx.moveTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft + 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y + bottomy -
                (shift + hthis) + 10);
            ctx.arc(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft + 10 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y + bottomy -
                (shift + hthis) + 10, 5, Math.PI, Math.PI / 180 * 270, false);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets - 10 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - (shift + hthis) + 5);
            ctx.arc(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets - 10 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - (shift + hthis) + 10, 5, Math.PI / 180 * 270, 0, false);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                stackedBarGraphProps.GapBetweenBarSets - 5 +
                (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 + i *
                    stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                    bottomy - 5 - shift);
            ctx.lineTo(stackedBarGraphProps.X + stackedBarGraphProps.MarginLeft +
                5 + (stackedBarGraphProps.BarWidth -
                    stackedBarGraphProps.GapBetweenBarSets) / 2 +
                i * stackedBarGraphProps.BarWidth, stackedBarGraphProps.Y +
                bottomy - 5 - shift);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1.0;
        }
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 0;
        ctx.shadowColor = '#FFFFFF';
        shift += hthis;
        ctx.restore();
    }
}

