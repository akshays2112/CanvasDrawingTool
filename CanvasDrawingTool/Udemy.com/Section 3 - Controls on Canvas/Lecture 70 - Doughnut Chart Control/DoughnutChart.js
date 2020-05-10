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

//Doughnut Chart Code starts here

var doughnutChartPropsArray = new Array();

function getDoughnutChartProps(canvasid, windowid) {
    for (var i = 0; i < doughnutChartPropsArray.length; i++) {
        if (doughnutChartPropsArray[i].CanvasID === canvasid &&
            doughnutChartPropsArray[i].WindowID === windowid) {
            return doughnutChartPropsArray[i];
        }
    }
}

function DoughnutChart() { }

DoughnutChart.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    Title: null, TitleColor: null, TitleTextHeight: null, TitleFontString: null,
    InnerRadius: null,
    MarginSides: null, LabelColor: null, LabelHeight: null,
    LabelFontString: null, LegendWidth: null, LegendHeight: null, LegendFontString: null,
    SliceClickFunction: null, Tag: null, ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createDoughnutChart(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.Data, this.Title, this.TitleColor, this.TitleTextHeight,
            this.TitleFontString, this.InnerRadius,
            this.MarginSides, this.LabelColor, this.LabelHeight, this.LabelFontString,
            this.LegendWidth,
            this.LegendHeight, this.LegendFontString, this.SliceClickFunction, this.Tag,
            this.TabStopIndex);
    }
};

function createDoughnutChart(canvasid, controlNameId, x, y, width, height, depth,
    data, title, titlecolor, titletextheight, titlefontstring, innerradius, marginsides,
    labelcolor, labelheight, labelfontstring, legendwidth, legendheight,
    legendfontstring, sliceClickFunction, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'DoughnutChart', controlNameId, null, tabstopindex);
    var totalvalue = 0;
    for (var i = 0; i < data.length; i++) {
        totalvalue += data[i][1];
    }
    doughnutChartPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        Title: title, TitleColor: titlecolor, TitleTextHeight: titletextheight,
        TitleFontString: titlefontstring, InnerRadius: innerradius,
        CurrentRadius: innerradius + 20, TotalValue: totalvalue, MarginSides: marginsides,
        LabelColor: labelcolor, LabelHeight: labelheight,
        LabelFontString: labelfontstring, LegendWidth: legendwidth,
        LegendHeight: legendheight, LegendFontString: legendfontstring,
        AnimationCompleted: 0, DeltaI: -1, DeltaX: 0, DeltaY: 0,
        SliceClickFunction: sliceClickFunction, Tag: tag
    });
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {

        var doughnutChartProps = getDoughnutChartProps(canvasid1, windowid1);
        var data = doughnutChartProps.Data;
        var totalvalue = doughnutChartProps.TotalValue;
        var clickx = e.calcX;
        var clicky = e.calcY;
        var pieoutangle = -1;
        var centerx = doughnutChartProps.X + doughnutChartProps.Width / 2 +
            doughnutChartProps.MarginSides;
        var centery = doughnutChartProps.Y + (doughnutChartProps.Height -
            doughnutChartProps.TitleTextHeight - 8 - doughnutChartProps.LabelHeight * 2)
            / 2;
        if (150 * 150 > (clickx - centerx) * (clickx - centerx) + (clicky - centery) *
            (clicky - centery)) {
            if (clickx > centerx && clicky === centery) {
                pieoutangle = 0;
            } else if (clickx > centerx && clicky > centery) {
                pieoutangle = Math.atan((clicky - centery) / (clickx - centerx)) *
                    180 / Math.PI;
            } else if (clickx < centerx && clicky > centery) {
                pieoutangle = 180 - Math.atan((clicky - centery) / (clickx - centerx))
                    * 180 / Math.PI;
            } else if (clickx < centerx && clicky === centery) {
                pieoutangle = 180;
            } else if (clickx < centerx && clicky < centery) {
                pieoutangle = 180 + Math.atan((clicky - centery) / (clickx - centerx))
                    * 180 / Math.PI;
            } else if (clickx === centerx && clicky < centery) {
                pieoutangle = 270;
            } else if (clickx > centerx && clicky < centery) {
                pieoutangle = 360 + Math.atan((clicky - centery) / (clickx - centerx))
                    * 180 / Math.PI;
            }
        }
        var currangle = 0;
        var lastangle = 0;
        var founddelta = 0;
        for (i = 0; i < data.length; i++) {
            currangle += data[i][1] * 360 / totalvalue;
            var deltax = 0;
            var deltay = 0;
            if (pieoutangle >= 0 && lastangle <= pieoutangle && currangle >= pieoutangle) {
                var deltaangle = lastangle + (currangle - lastangle) / 2;
                if (deltaangle === 0) {
                    deltax = 40;
                    deltay = 0;
                } else if (deltaangle > 0 && deltaangle < 90) {
                    deltax = Math.cos(deltaangle * (Math.PI / 180)) * 40;
                    deltay = Math.sin(deltaangle * (Math.PI / 180)) * 40;
                } else if (deltaangle === 90) {
                    deltax = 0;
                    deltay = 40;
                } else if (deltaangle > 90 && deltaangle < 180) {
                    deltax = -(Math.cos((180 - deltaangle) * (Math.PI / 180)) * 40);
                    deltay = Math.sin((180 - deltaangle) * (Math.PI / 180)) * 40;
                } else if (deltaangle === 180) {
                    deltax = -40;
                    deltay = 0;
                } else if (deltaangle > 180 && deltaangle < 270) {
                    deltax = -(Math.cos((180 - deltaangle) * (Math.PI / 180)) * 40);
                    deltay = Math.sin((180 - deltaangle) * (Math.PI / 180)) * 40;
                } else if (deltaangle === 270) {
                    deltax = 0;
                    deltay = -40;
                } else if (deltaangle > 270 && deltaangle < 360) {
                    deltax = Math.cos((360 - deltaangle) * (Math.PI / 180)) * 40;
                    deltay = -(Math.sin((360 - deltaangle) * (Math.PI / 180)) * 40);
                }
            }
            if (deltax !== 0 || deltay !== 0) {
                doughnutChartProps.DeltaX = deltax;
                doughnutChartProps.DeltaY = deltay;
                doughnutChartProps.DeltaI = i;
                founddelta = 1;
                if (doughnutChartProps.SliceClickFunction !== null &&
                    doughnutChartProps.SliceClickFunction !== undefined) {
                    doughnutChartProps.SliceClickFunction(canvasid1, windowid1, i);
                }
            }
            lastangle = currangle;
        }
        if (founddelta === 0) {
            doughnutChartProps.DeltaX = 0;
            doughnutChartProps.DeltaY = 0;
            doughnutChartProps.DeltaI = -1;
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var doughnutChartProps = getDoughnutChartProps(canvasid2, windowid2);
        var ctx = getCtx(canvasid2);
        var totalvalue = doughnutChartProps.TotalValue;
        var data = doughnutChartProps.Data;
        var innerradius = doughnutChartProps.InnerRadius;
        var currRadius = doughnutChartProps.CurrentRadius;
        if (doughnutChartProps.AnimationCompleted === 0 && currRadius >=
            (doughnutChartProps.Width - doughnutChartProps.MarginSides * 2 -
            doughnutChartProps.LegendWidth) / 2) {
            unregisterAnimatedWindow(canvasid2, windowid2);
            doughnutChartProps.AnimationCompleted = 1;
        }
        ctx.save();
        ctx.fillStyle = doughnutChartProps.TitleColor;
        ctx.font = doughnutChartProps.TitleFontString;
        ctx.fillText(doughnutChartProps.Title, doughnutChartProps.X +
            (doughnutChartProps.Width - ctx.measureText(doughnutChartProps.Title).width) / 2,
            doughnutChartProps.Y + doughnutChartProps.TitleTextHeight + 4);
        ctx.font = doughnutChartProps.LabelFontString;
        var centerx = doughnutChartProps.X + doughnutChartProps.Width / 2 +
            doughnutChartProps.MarginSides;
        var centery = doughnutChartProps.Y + (doughnutChartProps.Height -
            doughnutChartProps.TitleTextHeight - 8 - doughnutChartProps.LabelHeight * 2) / 2;
        var currangle = 0; //in degrees
        var lastangle = 0;
        for (var i = 0; i < data.length; i++) {
            currangle += data[i][1] * 100 * 360 / (totalvalue * 100);
            var redcomp = parseInt(data[i][2].substr(1, 2), 16);
            var greencomp = parseInt(data[i][2].substr(3, 2), 16);
            var bluecomp = parseInt(data[i][2].substr(5, 2), 16);
            var gradient = ctx.createRadialGradient(centerx +
                (doughnutChartProps.DeltaI === i ? doughnutChartProps.DeltaX : 0),
                centery + (doughnutChartProps.DeltaI === i ? doughnutChartProps.DeltaY : 0),
                innerradius, centerx +
                (doughnutChartProps.DeltaI === i ? doughnutChartProps.DeltaX : 0), centery +
                (doughnutChartProps.DeltaI === i ?
                    doughnutChartProps.DeltaY : 0), currRadius);
            gradient.addColorStop(0.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
                gethighcomp(bluecomp));
            gradient.addColorStop(0.5, data[i][2]);
            gradient.addColorStop(1.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
                getlowcomp(bluecomp));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerx + (doughnutChartProps.DeltaI === i ?
                doughnutChartProps.DeltaX : 0), centery + (doughnutChartProps.DeltaI === i ?
                    doughnutChartProps.DeltaY : 0), currRadius, Math.PI / 180 * lastangle,
                Math.PI / 180 * currangle, false);
            ctx.arc(centerx + (doughnutChartProps.DeltaI === i ?
                doughnutChartProps.DeltaX : 0), centery + (doughnutChartProps.DeltaI === i ?
                    doughnutChartProps.DeltaY : 0), innerradius, Math.PI / 180 * currangle,
                Math.PI / 180 * lastangle, true);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = data[i][2];
            lastangle = currangle;
        }
        if (doughnutChartProps.AnimationCompleted === 0) {
            doughnutChartProps.CurrentRadius += 5;
        }
        currangle = 0; //in degrees
        lastangle = 0;
        for (i = 0; i < data.length; i++) {
            currangle += data[i][1] * 100 * 360 / (totalvalue * 100);
            ctx.strokeStyle = data[i][2];
            drawPieChartLabels(ctx, data[i][0], currangle, lastangle, currRadius,
                totalvalue, data[i][1], data[i][2], 0, 0,
                centerx + (doughnutChartProps.DeltaI === i ? doughnutChartProps.DeltaX : 0),
                centery + (doughnutChartProps.DeltaI === i ?
                    doughnutChartProps.DeltaY : 0), doughnutChartProps.LabelHeight);
            lastangle = currangle;
        }
        ctx.font = doughnutChartProps.LegendFontString;
        for (var o = 0; o < data.length; o++) {
            ctx.fillStyle = data[o][2];
            ctx.fillRect(doughnutChartProps.X + doughnutChartProps.Width -
                doughnutChartProps.LegendWidth, doughnutChartProps.Y + doughnutChartProps.Height
                - 4 - doughnutChartProps.LegendHeight - o *
                    (doughnutChartProps.LegendHeight + 10), 30,
                doughnutChartProps.LegendHeight);
            ctx.fillStyle = data[o][2];
            ctx.fillText(data[o][0], doughnutChartProps.X + doughnutChartProps.Width -
                doughnutChartProps.LegendWidth + 35, doughnutChartProps.Y +
                doughnutChartProps.Height
                - 4 - o * (doughnutChartProps.LegendHeight + 10));
        }
        ctx.restore();
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function drawPieChartLabels(ctx, datastr, currangle, lastangle, currRadius, totalvalue,
    value, color, deltax, deltay, centerx, centery, textheight) {
    ctx.fillStyle = color;
    if ((currangle - lastangle) / 2 + lastangle < 90) {
        ctx.fillText(value.toString(), centerx + 5 + deltax + Math.cos(Math.PI / 180
            * ((currangle - lastangle) / 2 + lastangle)) * currRadius,
            centery + deltay + Math.sin(Math.PI / 180 * ((currangle - lastangle) /
                2 + lastangle)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle === 90) {
        ctx.fillText(value.toString(), centerx + 5 + deltax + Math.cos(Math.PI / 180 *
            ((currangle - lastangle) / 2 + lastangle)) * currRadius,
            centery + deltay + Math.sin(Math.PI / 180 * ((currangle - lastangle) / 2 +
                lastangle)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle > 90 && (currangle -
        lastangle) / 2 + lastangle < 180) {
        tw = ctx.measureText(value.toString()).width;
        ctx.fillText(value.toString(), centerx + deltax - tw - Math.cos(Math.PI / 180
            * (180 - ((currangle - lastangle) / 2 + lastangle))) * currRadius,
            centery + textheight + deltay + Math.sin(Math.PI / 180 * (180 -
                ((currangle - lastangle) / 2 + lastangle))) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle === 180) {
        ctx.fillText(value.toString(), centerx + deltax - Math.cos(Math.PI / 180 *
            (180 - ((currangle - lastangle) / 2 + lastangle))) * currRadius,
            centery + textheight + deltay + Math.sin(Math.PI / 180 * (180 -
                ((currangle - lastangle) / 2 + lastangle))) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle > 180 && (currangle -
        lastangle) / 2 + lastangle < 270) {
        tw = ctx.measureText(value.toString()).width;
        ctx.fillText(value.toString(), centerx - textheight + deltax - tw -
            Math.cos(Math.PI / 180 * ((currangle - lastangle) / 2 + lastangle - 180))
            * currRadius,
            centery + deltay - Math.sin(Math.PI / 180 * ((currangle - lastangle) / 2
                + lastangle - 180)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle === 270) {
        tw = ctx.measureText(value.toString()).width;
        ctx.fillText(value.toString(), centerx - textheight + deltax - tw -
            Math.cos(Math.PI / 180 * ((currangle - lastangle) / 2 + lastangle
                - 180)) * currRadius,
            centery + deltay - Math.sin(Math.PI / 180 * ((currangle - lastangle)
                / 2 + lastangle - 180)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle > 270 && (currangle -
        lastangle) / 2 + lastangle < 360) {
        ctx.fillText(value.toString(), centerx + textheight + deltax +
            Math.cos(Math.PI / 180 * (360 - ((currangle - lastangle) / 2 +
                lastangle))) * currRadius,
            centery + deltay - Math.sin(Math.PI / 180 * (360 - ((currangle -
                lastangle) / 2 + lastangle))) * currRadius);
    }
}

