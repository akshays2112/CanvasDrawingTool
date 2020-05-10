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

//Pie Chart Control code starts here

var pieChartsPropsArray = new Array();

function getPieChartProps(canvasid, windowid) {
    for (var i = 0; i < pieChartsPropsArray.length; i++) {
        if (pieChartsPropsArray[i].CanvasID === canvasid &&
            pieChartsPropsArray[i].WindowID === windowid) {
            return pieChartsPropsArray[i];
        }
    }
}

function PieChart() { }

PieChart.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    Title: null, TitleTextColor: null, TitleTextHeight: null, TitleTextFontString: null,
    LabelTextColor: null, LabelTextHeight: null, LabelTextFontString: null,
    SliceClickFunction: null, Tag: null, ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createPieChart(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.Data, this.Title, this.TitleTextColor,
            this.TitleTextHeight, this.TitleTextFontString,
            this.LabelTextColor, this.LabelTextHeight, this.LabelTextFontString,
            this.SliceClickFunction, this.Tag, this.TabStopIndex);
    }
};

function createPieChart(canvasid, controlNameId, x, y, width, height, depth,
    data, title, titletextcolor, titletextheight, titletextfontstring,
    labeltextcolor, labeltextheight, labeltextfontstring, sliceClickFunction,
    tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'PieChart', controlNameId, null, tabstopindex);
    var totalvalue = 0;
    for (var i = 0; i < data.length; i++) {
        totalvalue += data[i][1];
    }
    pieChartsPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        Title: title, TitleTextColor: titletextcolor,
        TitleTextHeight: titletextheight, TitleTextFontString: titletextfontstring,
        CurrentRadius: 20, TotalValue: totalvalue, LabelTextColor: labeltextcolor,
        LabelTextHeight: labeltextheight,
        LabelTextFontString: labeltextfontstring, AlreadyUnregisteredAnimation: 0,
        DeltaI: -1,
        DeltaX: 0, DeltaY: 0, SliceClickFunction: sliceClickFunction, Tag: tag
    });
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {
        var pieChartProps = getPieChartProps(canvasid1, windowid1);
        var data = pieChartProps.Data;
        var currRadius = (pieChartProps.Height - pieChartProps.TitleTextHeight -
            24 - pieChartProps.LabelTextHeight * 2) / 2;
        var totalvalue = 0;
        for (var i = 0; i < data.length; i++) {
            totalvalue += data[i][1];
        }
        var clickx = e.calcX;
        var clicky = e.calcY;
        var pieoutangle = -1;
        var centerx = pieChartProps.X + (pieChartProps.Width - currRadius * 2)
            / 2 + currRadius;
        var centery = pieChartProps.Y + 16 + pieChartProps.TitleTextHeight +
            pieChartProps.LabelTextHeight + currRadius;
        if (currRadius * currRadius > (clickx - centerx) * (clickx - centerx) +
            (clicky - centery) * (clicky - centery)) {
            if (clickx > centerx && clicky === centery) {
                pieoutangle = 0;
            } else if (clickx > centerx && clicky > centery) {
                pieoutangle = Math.atan((clicky - centery) / (clickx - centerx))
                    * 180 / Math.PI;
            } else if (clickx < centerx && clicky > centery) {
                pieoutangle = 180 - Math.atan((clicky - centery) /
                    (clickx - centerx)) * 180 / Math.PI;
            } else if (clickx < centerx && clicky === centery) {
                pieoutangle = 180;
            } else if (clickx < centerx && clicky < centery) {
                pieoutangle = 180 + Math.atan((clicky - centery) /
                    (clickx - centerx)) * 180 / Math.PI;
            } else if (clickx === centerx && clicky < centery) {
                pieoutangle = 270;
            } else if (clickx > centerx && clicky < centery) {
                pieoutangle = 360 + Math.atan((clicky - centery) /
                    (clickx - centerx)) * 180 / Math.PI;
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
                    deltax = Math.cos(deltaangle * Math.PI / 180) * 40;
                    deltay = Math.sin(deltaangle * Math.PI / 180) * 40;
                } else if (deltaangle === 90) {
                    deltax = 0;
                    deltay = 40;
                } else if (deltaangle > 90 && deltaangle < 180) {
                    deltax = -(Math.cos((180 - deltaangle) * Math.PI / 180) * 40);
                    deltay = Math.sin((180 - deltaangle) * Math.PI / 180) * 40;
                } else if (deltaangle === 180) {
                    deltax = -40;
                    deltay = 0;
                } else if (deltaangle > 180 && deltaangle < 270) {
                    deltax = -(Math.cos((180 - deltaangle) * Math.PI / 180) * 40);
                    deltay = Math.sin((180 - deltaangle) * Math.PI / 180) * 40;
                } else if (deltaangle === 270) {
                    deltax = 0;
                    deltay = -40;
                } else if (deltaangle > 270 && deltaangle < 360) {
                    deltax = Math.cos((360 - deltaangle) * Math.PI / 180) * 40;
                    deltay = -(Math.sin((360 - deltaangle) * Math.PI / 180) * 40);
                }
            }
            if (deltax !== 0 || deltay !== 0) {
                pieChartProps.DeltaX = deltax;
                pieChartProps.DeltaY = deltay;
                pieChartProps.DeltaI = i;
                founddelta = 1;
                if (pieChartProps.SliceClickFunction !== null &&
                    pieChartProps.SliceClickFunction !== undefined) {
                    pieChartProps.SliceClickFunction(canvasid1, windowid1, i);
                }
            }
            if (currangle < 90) {
                lastx = centerx + Math.cos(Math.PI / 180 * currangle) * currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * currangle) * currRadius;
            } else if (currangle === 90) {
                lastx = centerx;
                lasty = centery + currRadius;
            } else if (currangle > 90 && currangle < 180) {
                lastx = centerx - Math.cos(Math.PI / 180 * (180 - currangle)) *
                    currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * (180 - currangle)) *
                    currRadius;
            } else if (currangle === 180) {
                lastx = centerx - currRadius;
                lasty = centery;
            } else if (currangle > 180 && currangle < 270) {
                lastx = centerx + Math.cos(Math.PI / 180 * (currangle - 180)) *
                    currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * (currangle - 180)) *
                    currRadius;
            } else if (currangle === 270) {
                lastx = centerx;
                lasty = centery - currRadius;
            } else if (currangle > 270 && currangle < 360) {
                lastx = centerx - Math.cos(Math.PI / 180 * (360 - currangle)) *
                    currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * (360 - currangle)) *
                    currRadius;
            }
            lastangle = currangle;
        }
        if (founddelta === 0) {
            pieChartProps.DeltaX = 0;
            pieChartProps.DeltaY = 0;
            pieChartProps.DeltaI = -1;
        }
    }, canvasid);
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var pieChartProps = getPieChartProps(canvasid2, windowid2);
        var currRadius = pieChartProps.CurrentRadius;
        if (pieChartProps.AlreadyUnregisteredAnimation === 0 && currRadius >=
            (pieChartProps.Height - pieChartProps.TitleTextHeight - 24 -
                pieChartProps.LabelTextHeight * 2) / 2) {
            pieChartProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvasid2, windowid2);
        }
        var data = pieChartProps.Data;
        var centerx = pieChartProps.X + (pieChartProps.Width - currRadius * 2) /
            2 + currRadius;
        var centery = pieChartProps.Y + 16 + pieChartProps.TitleTextHeight +
            pieChartProps.LabelTextHeight + currRadius;
        var ctx = getCtx(canvasid2);
        ctx.save();
        ctx.fillStyle = pieChartProps.TitleTextColor;
        ctx.font = pieChartProps.TitleTextFontString;
        ctx.fillText(pieChartProps.Title, pieChartProps.X + (pieChartProps.Width -
            ctx.measureText(pieChartProps.Title).width) / 2,
            pieChartProps.Y + 4 + pieChartProps.TitleTextHeight);
        ctx.font = pieChartProps.LabelTextFontString;
        var currangle = 0; //in degrees
        var lastangle = 0;
        for (var i = 0; i < data.length; i++) {
            currangle += data[i][1] * 360 / totalvalue;
            var redcomp = parseInt(data[i][2].substr(1, 2), 16);
            var greencomp = parseInt(data[i][2].substr(3, 2), 16);
            var bluecomp = parseInt(data[i][2].substr(5, 2), 16);
            var gradient = ctx.createRadialGradient(centerx, centery, 0, centerx,
                centery, currRadius);
            gradient.addColorStop(0.0, '#' + gethighcomp(redcomp) +
                gethighcomp(greencomp) + gethighcomp(bluecomp));
            gradient.addColorStop(0.5, data[i][2]);
            gradient.addColorStop(1.0, '#' + getlowcomp(redcomp) +
                getlowcomp(greencomp) + getlowcomp(bluecomp));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(centerx + (pieChartProps.DeltaI === i ? pieChartProps.DeltaX : 0),
                centery + (pieChartProps.DeltaI === i ?
                pieChartProps.DeltaY : 0));
            ctx.arc(centerx + (pieChartProps.DeltaI === i ? pieChartProps.DeltaX : 0),
                centery + (pieChartProps.DeltaI === i ?
                    pieChartProps.DeltaY : 0), currRadius, Math.PI / 180 * lastangle,
                Math.PI / 180 * currangle, false);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = data[i][2];
            if (currangle < 90) {
                lastx = centerx + Math.cos(Math.PI / 180 * currangle) * currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * currangle) * currRadius;
            } else if (currangle === 90) {
                lastx = centerx;
                lasty = centery + currRadius;
            } else if (currangle > 90 && currangle < 180) {
                lastx = centerx - Math.cos(Math.PI / 180 * (180 - currangle)) *
                    currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * (180 - currangle)) *
                    currRadius;
            } else if (currangle === 180) {
                lastx = centerx - currRadius;
                lasty = centery;
            } else if (currangle > 180 && currangle < 270) {
                lastx = centerx + Math.cos(Math.PI / 180 * (currangle - 180)) *
                    currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * (currangle - 180)) *
                    currRadius;
            } else if (currangle === 270) {
                lastx = centerx;
                lasty = centery - currRadius;
            } else if (currangle > 270 && currangle < 360) {
                lastx = centerx - Math.cos(Math.PI / 180 * (360 - currangle)) *
                    currRadius;
                lasty = centery + Math.sin(Math.PI / 180 * (360 - currangle)) *
                    currRadius;
            }
            lastangle = currangle;
        }
        if (currRadius < (pieChartProps.Height - pieChartProps.TitleTextHeight -
            24 - pieChartProps.LabelTextHeight * 2) / 2) {
            pieChartProps.CurrentRadius += 5;
        }
        currangle = 0;
        lastangle = 0;
        ctx.font = pieChartProps.LabelTextFontString;
        for (i = 0; i < data.length; i++) {
            currangle += data[i][1] * 100 * 360 / (totalvalue * 100);
            ctx.fillStyle = data[i][2];
            drawPieChartLabels(ctx, data[i][0], currangle, lastangle, currRadius,
                totalvalue, data[i][1], data[i][2], 0, 0, centerx +
                (pieChartProps.DeltaI === i ? pieChartProps.DeltaX : 0), centery +
                (pieChartProps.DeltaI === i ?
                    pieChartProps.DeltaY : 0), pieChartProps.LabelTextHeight);
            lastangle = currangle;
        }
        for (var o = 0; o < data.length; o++) {
            ctx.fillStyle = data[o][2];
            ctx.fillRect(pieChartProps.X + pieChartProps.Width - 100,
                pieChartProps.Y + pieChartProps.Height
                - 8 - pieChartProps.LabelTextHeight - o * (8 +
                    pieChartProps.LabelTextHeight), 30, pieChartProps.LabelTextHeight);
            ctx.fillStyle = data[o][2];
            ctx.fillText(data[o][0], pieChartProps.X + pieChartProps.Width -
                100 + 35, pieChartProps.Y + pieChartProps.Height
                - 8 - o * (8 + pieChartProps.LabelTextHeight));
        }
        ctx.restore();
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function drawPieChartLabels(ctx, datastr, currangle, lastangle, currRadius,
    totalvalue, value, color, deltax, deltay, centerx, centery, textheight) {
    ctx.fillStyle = color;
    if ((currangle - lastangle) / 2 + lastangle < 90) {
        ctx.fillText(value.toString(), centerx + 5 + deltax + Math.cos(Math.PI / 180 *
            ((currangle - lastangle) / 2 + lastangle)) * currRadius,
            centery + deltay + Math.sin(Math.PI / 180 * ((currangle -
                lastangle) / 2 + lastangle)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle === 90) {
        ctx.fillText(value.toString(), centerx + 5 + deltax + Math.cos(Math.PI / 180 *
            ((currangle - lastangle) / 2 + lastangle)) * currRadius,
            centery + deltay + Math.sin(Math.PI / 180 * ((currangle - lastangle)
                / 2 + lastangle)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle > 90 && (currangle -
        lastangle) / 2 + lastangle < 180) {
        tw = ctx.measureText(value.toString()).width;
        ctx.fillText(value.toString(), centerx + deltax - tw - Math.cos(Math.PI
            / 180 * (180 - ((currangle - lastangle) / 2 + lastangle))) * currRadius,
            centery + textheight + deltay + Math.sin(Math.PI / 180 * (180 -
                ((currangle - lastangle) / 2 + lastangle))) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle === 180) {
        ctx.fillText(value.toString(), centerx + deltax - Math.cos(Math.PI / 180
            * (180 - ((currangle - lastangle) / 2 + lastangle))) * currRadius,
            centery + textheight + deltay + Math.sin(Math.PI / 180 * (180 -
                ((currangle - lastangle) / 2 + lastangle))) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle > 180 && (currangle -
        lastangle) / 2 + lastangle < 270) {
        tw = ctx.measureText(value.toString()).width;
        ctx.fillText(value.toString(), centerx - textheight + deltax - tw -
            Math.cos(Math.PI / 180 * ((currangle - lastangle) / 2 +
                lastangle - 180)) * currRadius,
            centery + deltay - Math.sin(Math.PI / 180 * ((currangle -
                lastangle) / 2 + lastangle - 180)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle === 270) {
        tw = ctx.measureText(value.toString()).width;
        ctx.fillText(value.toString(), centerx - textheight + deltax - tw -
            Math.cos(Math.PI / 180 * ((currangle - lastangle) / 2 +
                lastangle - 180)) * currRadius,
            centery + deltay - Math.sin(Math.PI / 180 * ((currangle -
                lastangle) / 2 + lastangle - 180)) * currRadius);
    } else if ((currangle - lastangle) / 2 + lastangle > 270 && (currangle -
        lastangle) / 2 + lastangle < 360) {
        ctx.fillText(value.toString(), centerx + textheight + deltax +
            Math.cos(Math.PI / 180 * (360 - ((currangle - lastangle) / 2 +
                lastangle))) * currRadius,
            centery + deltay - Math.sin(Math.PI / 180 * (360 - ((currangle -
                lastangle) / 2 + lastangle))) * currRadius);
    }
}

