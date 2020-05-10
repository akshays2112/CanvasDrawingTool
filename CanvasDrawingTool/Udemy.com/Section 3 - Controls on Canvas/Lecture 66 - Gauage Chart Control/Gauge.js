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

//Gauge Chart code starts here

var gaugeChartPropsArray = new Array();

function getGaugeChartProps(canvasid, windowid) {
    for (var i = 0; i < gaugeChartPropsArray.length; i++) {
        if (gaugeChartPropsArray[i].CanvasID === canvasid &&
            gaugeChartPropsArray[i].WindowID === windowid) {
            return gaugeChartPropsArray[i];
        }
    }
}

function Gauge() { }

Gauge.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    Title: null, TitleTextColor: null, TitleTextHeight: null, TitleTextFontString: null,
    GaugeRadius: null, GaugeLabelTextColor: null, GaugeLabelTextHeight: null,
    GaugeLabelTextFontString: null, Tag: null, ControlNameID: null, Depth: null,
    TabStopIndex: null,

    Initialize: function () {
        return createGauge(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth, this.Data,
            this.Title, this.TitleTextColor, this.TitleTextHeight,
            this.TitleTextFontString, this.GaugeRadius,
            this.GaugeLabelTextColor, this.GaugeLabelTextHeight,
            this.GaugeLabelTextFontString, this.Tag, this.TabStopIndex);
    }
};

function createGauge(canvasid, controlNameId, x, y, width, height, depth, data,
    title, titletextcolor, titletextheight, titletextfontstring, gaugeradius,
    gaugelabeltextcolor, gaugelabeltextheight, gaugelabeltextfontstring, tag,
    tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'Gauge', controlNameId, null, tabstopindex);
    gaugeChartPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        Title: title, TitleTextColor: titletextcolor,
        TitleTextHeight: titletextheight, TitleTextFontString: titletextfontstring,
        H: 1, CenterX: x + width / 2, CenterY: y + (height - 8 -
            titletextheight) / 2 + (height - 8 - titletextheight -
                gaugeradius * 2) / 2,
        GaugeRadius: gaugeradius, GaugeLabelTextColor: gaugelabeltextcolor,
        GaugeLabelTextHeight: gaugelabeltextheight,
        GaugeLabelTextFontString: gaugelabeltextfontstring,
        AlreadyUnregisteredAnimation: 0, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var gaugeChartProps = getGaugeChartProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        if (gaugeChartProps.AlreadyUnregisteredAnimation === 0 && gaugeChartProps.H > 100) {
            gaugeChartProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvaisd1, windowid1);
        }
        ctx.save();
        ctx.globalAlpha = gaugeChartProps.H / 100;
        ctx.fillStyle = gaugeChartProps.TitleTextColor;
        ctx.font = gaugeChartProps.TitleTextFontString;
        ctx.fillText(gaugeChartProps.Title, gaugeChartProps.X +
            (gaugeChartProps.Width - ctx.measureText(title).width) / 2,
            gaugeChartProps.Y + gaugeChartProps.TitleTextHeight + 4);
        var gradient = ctx.createRadialGradient(gaugeChartProps.CenterX,
            gaugeChartProps.CenterY, 0, gaugeChartProps.CenterX,
            gaugeChartProps.CenterY, gaugeChartProps.GaugeRadius - 5);
        gradient.addColorStop(0.0, '#C0C0C0');
        gradient.addColorStop(0.5, '#A0A0A0');
        gradient.addColorStop(1.0, '#D0D0D0');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(gaugeChartProps.CenterX, gaugeChartProps.CenterY,
            gaugeChartProps.GaugeRadius, 0, 2 * Math.PI, false);
        ctx.arc(gaugeChartProps.CenterX, gaugeChartProps.CenterY,
            gaugeChartProps.GaugeRadius - 5, 0, 2 * Math.PI, true);
        ctx.closePath();
        ctx.fill();
        var gradient2 = ctx.createRadialGradient(gaugeChartProps.CenterX,
            gaugeChartProps.CenterY, 0, gaugeChartProps.CenterX,
            gaugeChartProps.CenterY, gaugeChartProps.GaugeRadius - 5);
        gradient2.addColorStop(0.0, '#0000C0');
        gradient2.addColorStop(0.5, '#0000A0');
        gradient2.addColorStop(1.0, '#0000D0');
        ctx.fillStyle = gradient2;
        ctx.beginPath();
        ctx.arc(gaugeChartProps.CenterX, gaugeChartProps.CenterY,
            gaugeChartProps.GaugeRadius - 5, 0, 2 * Math.PI, false);
        ctx.fill();
        if (gaugeChartProps.H < 60)
            ctx.globalAlpha = 0.0;
        else
            ctx.globalAlpha = (gaugeChartProps.H - 60) / 100;
        var gradient3 = ctx.createRadialGradient(gaugeChartProps.CenterX,
            gaugeChartProps.CenterY, gaugeChartProps.GaugeRadius - 50,
            gaugeChartProps.CenterX, gaugeChartProps.CenterY,
            gaugeChartProps.GaugeRadius - 5);
        gradient3.addColorStop(0.0, '#000000');
        gradient3.addColorStop(1.0, '#FFFFFF');
        ctx.fillStyle = gradient3;
        ctx.beginPath();
        ctx.moveTo(gaugeChartProps.CenterX - Math.sin(Math.PI / 8) *
            (gaugeChartProps.GaugeRadius - 10),
            gaugeChartProps.CenterY + Math.cos(Math.PI / 8) *
                (gaugeChartProps.GaugeRadius - 10));
        ctx.arc(gaugeChartProps.CenterX, gaugeChartProps.CenterY,
            gaugeChartProps.GaugeRadius - 10, Math.PI / 180 * 112.5,
            Math.PI / 180 * 67.5, false);
        ctx.lineTo(gaugeChartProps.CenterX + Math.sin(Math.PI / 8) *
            (gaugeChartProps.GaugeRadius - 50),
            gaugeChartProps.CenterY + Math.cos(Math.PI / 8) *
                (gaugeChartProps.GaugeRadius - 50));
        ctx.arc(gaugeChartProps.CenterX, gaugeChartProps.CenterY,
            gaugeChartProps.GaugeRadius - 50, Math.PI / 180 * 67.5,
            Math.PI / 180 * 112.5, true);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = gaugeChartProps.H / 100;
        ctx.strokeStyle = '#000000';
        for (var i = 0; i < gaugeChartProps.Data[1] / gaugeChartProps.Data[5] + 1; i++) {
            var angle = 315 * i / (gaugeChartProps.Data[1] /
                gaugeChartProps.Data[5]) + 112.5;
            if (angle > 360)
                angle -= 360;
            ctx.beginPath();
            if (angle === 0) {
                ctx.moveTo(gaugeChartProps.CenterX + (gaugeChartProps.GaugeRadius - 45),
                    gaugeChartProps.CenterY);
                ctx.lineTo(gaugeChartProps.CenterX + (gaugeChartProps.GaugeRadius - 25),
                    gaugeChartProps.CenterY);
            } else if (angle > 0 && angle < 90) {
                ctx.moveTo(gaugeChartProps.CenterX + Math.cos(Math.PI / 180 * angle) *
                    (gaugeChartProps.GaugeRadius - 45),
                    gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 45));
                ctx.lineTo(gaugeChartProps.CenterX + Math.cos(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 25),
                    gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 25));
            } else if (angle === 90) {
                ctx.moveTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY +
                    (gaugeChartProps.GaugeRadius - 45));
                ctx.lineTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY +
                    (gaugeChartProps.GaugeRadius - 25));
            } else if (angle > 90 && angle < 180) {
                angle = 180 - angle;
                ctx.moveTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 45),
                    gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 45));
                ctx.lineTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 25),
                    gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 25));
            } else if (angle === 180) {
                ctx.moveTo(gaugeChartProps.CenterX - (gaugeChartProps.GaugeRadius -
                    45), gaugeChartProps.CenterY);
                ctx.lineTo(gaugeChartProps.CenterX - (gaugeChartProps.GaugeRadius -
                    25), gaugeChartProps.CenterY);
            } else if (angle > 180 && angle < 270) {
                angle = angle - 180;
                ctx.moveTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 45),
                    gaugeChartProps.CenterY - Math.sin(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 45));
                ctx.lineTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 25),
                    gaugeChartProps.CenterY - Math.sin(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 25));
            } else if (angle === 270) {
                ctx.moveTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY -
                    (gaugeChartProps.GaugeRadius - 45));
                ctx.lineTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY -
                    (gaugeChartProps.GaugeRadius - 25));
            } else if (angle > 270 && angle < 360) {
                angle = angle - 270;
                ctx.moveTo(gaugeChartProps.CenterX + Math.sin(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 45),
                    gaugeChartProps.CenterY - Math.cos(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 45));
                ctx.lineTo(gaugeChartProps.CenterX + Math.sin(Math.PI / 180 *
                    angle) * (gaugeChartProps.GaugeRadius - 25),
                    gaugeChartProps.CenterY - Math.cos(Math.PI / 180 * angle) *
                        (gaugeChartProps.GaugeRadius - 25));
            }
            ctx.stroke();
        }
        ctx.fillStyle = gaugeChartProps.GaugeLabelTextColor;
        ctx.font = gaugeChartProps.GaugeLabelTextFontString;
        for (i = 0; i < gaugeChartProps.Data[1] / gaugeChartProps.Data[5] +
            1; i++) {
            var angle2 = 315 * i / (gaugeChartProps.Data[1] /
                gaugeChartProps.Data[5]) + 112.5;
            if (angle2 > 360)
                angle2 -= 360;
            var txttodisplay = (i * gaugeChartProps.Data[5]).toString();
            var textwidth = ctx.measureText(txttodisplay).width;
            var textheight = gaugeChartProps.GaugeLabelTextHeight;
            if (angle2 === 0) {
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX +
                    (gaugeChartProps.GaugeRadius - 52) -
                    ctx.measureText(txttodisplay).width, gaugeChartProps.CenterY);
            } else if (angle2 > 0 && angle2 < 90) {
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX - textwidth +
                    Math.cos(Math.PI / 180 * angle2) * (gaugeChartProps.GaugeRadius - 52),
                    gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle2) *
                        (gaugeChartProps.GaugeRadius - 52));
            } else if (angle2 === 90) {
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX - textwidth / 2,
                    gaugeChartProps.CenterY + (gaugeChartProps.GaugeRadius - 52) -
                    textheight);
            } else if (angle2 > 90 && angle2 < 180) {
                angle2 = 180 - angle2;
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX -
                    Math.cos(Math.PI / 180 * angle2) * (gaugeChartProps.GaugeRadius - 52),
                    gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle2) *
                        (gaugeChartProps.GaugeRadius - 52));
            } else if (angle2 === 180) {
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX -
                    (gaugeChartProps.GaugeRadius - 52), gaugeChartProps.CenterY -
                    textheight / 2);
            } else if (angle2 > 180 && angle2 < 270) {
                angle2 = angle2 - 180;
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX -
                    Math.cos(Math.PI / 180 * angle2) * (gaugeChartProps.GaugeRadius - 52),
                    gaugeChartProps.CenterY + textheight - Math.sin(Math.PI /
                        180 * angle2) * (gaugeChartProps.GaugeRadius - 52));
            } else if (angle2 === 270) {
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX - textwidth / 2,
                    gaugeChartProps.CenterY - (gaugeChartProps.GaugeRadius - 52) +
                    textheight);
            } else if (angle2 > 270 && angle2 < 360) {
                angle2 = angle2 - 270;
                ctx.fillText(txttodisplay, gaugeChartProps.CenterX + Math.sin(Math.PI /
                    180 * angle2) * (gaugeChartProps.GaugeRadius - 52 - textwidth),
                    gaugeChartProps.CenterY - Math.cos(Math.PI / 180 * angle2) *
                        (gaugeChartProps.GaugeRadius - 52 - textwidth));
            }
        }
        ctx.strokeStyle = '#000000';
        for (i = 0; i < gaugeChartProps.Data[1] / gaugeChartProps.Data[5] *
            gaugeChartProps.Data[6] + 1; i++) {
            if (i % gaugeChartProps.Data[6] > 0) {
                var angle3 = 315 * i / (gaugeChartProps.Data[1] /
                    gaugeChartProps.Data[5] * gaugeChartProps.Data[6]) + 112.5;
                if (angle3 > 360)
                    angle3 -= 360;
                ctx.beginPath();
                if (angle3 === 0) {
                    ctx.moveTo(gaugeChartProps.CenterX + (gaugeChartProps.GaugeRadius -
                        45), gaugeChartProps.CenterY);
                    ctx.lineTo(gaugeChartProps.CenterX + (gaugeChartProps.GaugeRadius -
                        35), gaugeChartProps.CenterY);
                } else if (angle3 > 0 && angle3 < 90) {
                    ctx.moveTo(gaugeChartProps.CenterX + Math.cos(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 45),
                        gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle3) *
                            (gaugeChartProps.GaugeRadius - 45));
                    ctx.lineTo(gaugeChartProps.CenterX + Math.cos(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 35),
                        gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle3) *
                            (gaugeChartProps.GaugeRadius - 35));
                } else if (angle3 === 90) {
                    ctx.moveTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY +
                        (gaugeChartProps.GaugeRadius - 45));
                    ctx.lineTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY +
                        (gaugeChartProps.GaugeRadius - 35));
                } else if (angle3 > 90 && angle3 < 180) {
                    angle3 = 180 - angle3;
                    ctx.moveTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 45),
                        gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle3) *
                            (gaugeChartProps.GaugeRadius - 45));
                    ctx.lineTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 35),
                        gaugeChartProps.CenterY + Math.sin(Math.PI / 180 * angle3) *
                            (gaugeChartProps.GaugeRadius - 35));
                } else if (angle3 === 180) {
                    ctx.moveTo(gaugeChartProps.CenterX - (gaugeChartProps.GaugeRadius -
                        45), gaugeChartProps.CenterY);
                    ctx.lineTo(gaugeChartProps.CenterX - (gaugeChartProps.GaugeRadius -
                        35), gaugeChartProps.CenterY);
                } else if (angle3 > 180 && angle3 < 270) {
                    angle3 = angle3 - 180;
                    ctx.moveTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 45),
                        gaugeChartProps.CenterY - Math.sin(Math.PI / 180 * angle3) *
                            (gaugeChartProps.GaugeRadius - 45));
                    ctx.lineTo(gaugeChartProps.CenterX - Math.cos(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 35),
                        gaugeChartProps.CenterY - Math.sin(Math.PI / 180 * angle3)
                            * (gaugeChartProps.GaugeRadius - 35));
                } else if (angle3 === 270) {
                    ctx.moveTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY -
                        (gaugeChartProps.GaugeRadius - 45));
                    ctx.lineTo(gaugeChartProps.CenterX, gaugeChartProps.CenterY -
                        (gaugeChartProps.GaugeRadius - 35));
                } else if (angle3 > 270 && angle3 < 360) {
                    angle3 = angle3 - 270;
                    ctx.moveTo(gaugeChartProps.CenterX + Math.sin(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 45),
                        gaugeChartProps.CenterY - Math.cos(Math.PI / 180 * angle3) *
                            (gaugeChartProps.GaugeRadius - 45));
                    ctx.lineTo(gaugeChartProps.CenterX + Math.sin(Math.PI / 180 *
                        angle3) * (gaugeChartProps.GaugeRadius - 35),
                        gaugeChartProps.CenterY - Math.cos(Math.PI / 180 *
                            angle3) * (gaugeChartProps.GaugeRadius - 35));
                }
                ctx.stroke();
            }
        }
        drawarc(ctx, gaugeChartProps.Data[2][2], gaugeChartProps.Data[2][0],
            gaugeChartProps.Data[2][1], gaugeChartProps.Data[1],
            gaugeChartProps.CenterX, gaugeChartProps.CenterY, gaugeChartProps.GaugeRadius);
        drawarc(ctx, gaugeChartProps.Data[3][2], gaugeChartProps.Data[3][0],
            gaugeChartProps.Data[3][1], gaugeChartProps.Data[1],
            gaugeChartProps.CenterX, gaugeChartProps.CenterY, gaugeChartProps.GaugeRadius);
        drawarc(ctx, gaugeChartProps.Data[4][2], gaugeChartProps.Data[4][0],
            gaugeChartProps.Data[4][1], gaugeChartProps.Data[1],
            gaugeChartProps.CenterX, gaugeChartProps.CenterY, gaugeChartProps.GaugeRadius);
        var needleangle = 315 * gaugeChartProps.Data[7] / gaugeChartProps.Data[1] *
            (gaugeChartProps.H / 100) + 112.5;
        if (needleangle > 360)
            needleangle -= 360;
        ctx.translate(gaugeChartProps.CenterX, gaugeChartProps.CenterY);
        ctx.rotate(Math.PI / 180 * needleangle);
        var colorstr = '#60007C';
        var gradient5 = ctx.createLinearGradient(0, 0, gaugeChartProps.GaugeRadius - 80, 0);
        var redcomp = parseInt(colorstr.substr(1, 2), 16);
        var greencomp = parseInt(colorstr.substr(3, 2), 16);
        var bluecomp = parseInt(colorstr.substr(5, 2), 16);
        gradient5.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
            getlowcomp(bluecomp));
        gradient5.addColorStop(0.5, colorstr);
        gradient5.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
            gethighcomp(bluecomp));
        ctx.fillStyle = gradient5;
        ctx.beginPath();
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -10);
        ctx.lineTo(gaugeChartProps.GaugeRadius - 40, 0);
        ctx.closePath();
        ctx.fill();
        var gradient4 = ctx.createRadialGradient(gaugeChartProps.CenterX,
            gaugeChartProps.CenterY, 0, gaugeChartProps.CenterX, gaugeChartProps.CenterY, 10);
        gradient4.addColorStop(0.0, '#C0C0C0');
        gradient4.addColorStop(0.5, '#A0A0A0');
        gradient4.addColorStop(1.0, '#D0D0D0');
        ctx.fillStyle = gradient4;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.restore();
        if (gaugeChartProps.H < 100) {
            gaugeChartProps.H++;
        }
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function drawarc(ctx, colorstr, startval, endval, maxval, centerx, centery, gaugeradius) {
    var gradient4 = ctx.createRadialGradient(centerx, centery, gaugeradius - 100,
        centerx, centery, gaugeradius - 80);
    var redcomp = parseInt(colorstr.substr(1, 2), 16);
    var greencomp = parseInt(colorstr.substr(3, 2), 16);
    var bluecomp = parseInt(colorstr.substr(5, 2), 16);
    gradient4.addColorStop(0.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
        getlowcomp(bluecomp));
    gradient4.addColorStop(0.5, colorstr);
    gradient4.addColorStop(1.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
        gethighcomp(bluecomp));
    ctx.fillStyle = gradient4;
    var minrangeangle = 315 * startval / maxval + 112.5;
    if (minrangeangle > 360)
        minrangeangle -= 360;
    var maxrangeangle = 315 * endval / maxval + 112.5;
    if (maxrangeangle > 360)
        maxrangeangle -= 360;
    ctx.beginPath();
    var angle2 = 0;
    if (minrangeangle === 0) {
        ctx.moveTo(centerx + (gaugeradius - 100), centery);
    } else if (minrangeangle > 0 && minrangeangle < 90) {
        ctx.moveTo(centerx + Math.cos(Math.PI / 180 * minrangeangle) *
            (gaugeradius - 100), centery + Math.sin(Math.PI / 180 * minrangeangle) *
            (gaugeradius - 100));
    } else if (minrangeangle === 90) {
        ctx.moveTo(centerx, centery + (gaugeradius - 100));
    } else if (minrangeangle > 90 && minrangeangle < 180) {
        angle2 = 180 - minrangeangle;
        ctx.moveTo(centerx - Math.cos(Math.PI / 180 * angle2) * (gaugeradius -
            100), centery + Math.sin(Math.PI / 180 * angle2) * (gaugeradius - 100));
    } else if (minrangeangle === 180) {
        ctx.moveTo(centerx - (gaugeradius - 100), centery);
    } else if (minrangeangle > 180 && minrangeangle < 270) {
        angle2 = minrangeangle - 180;
        ctx.moveTo(centerx - Math.cos(Math.PI / 180 * angle2) * (gaugeradius - 100),
            centery - Math.sin(Math.PI / 180 * angle2) * (gaugeradius - 100));
    } else if (minrangeangle === 270) {
        ctx.moveTo(centerx, centery - (gaugeradius - 100));
    } else if (minrangeangle > 270 && minrangeangle < 360) {
        angle2 = minrangeangle - 270;
        ctx.moveTo(centerx + Math.sin(Math.PI / 180 * angle2) * (gaugeradius - 100),
            centery - Math.cos(Math.PI / 180 * angle2) * (gaugeradius - 100));
    }
    ctx.arc(centerx, centery, gaugeradius - 100, Math.PI / 180 * minrangeangle,
        Math.PI / 180 * maxrangeangle, false);
    ctx.arc(centerx, centery, gaugeradius - 80, Math.PI / 180 * maxrangeangle,
        Math.PI / 180 * minrangeangle, true);
    ctx.closePath();
    ctx.fill();
}

