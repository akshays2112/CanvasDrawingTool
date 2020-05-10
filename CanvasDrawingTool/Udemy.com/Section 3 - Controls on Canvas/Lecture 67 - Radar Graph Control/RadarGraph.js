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

//Radar Graph code starts here

var radarGraphPropsArray = new Array();

function getRadarGraphProps(canvasid, windowid) {
    for (var i = 0; i < radarGraphPropsArray.length; i++) {
        if (radarGraphPropsArray[i].CanvasID === canvasid &&
            radarGraphPropsArray[i].WindowID === windowid) {
            return radarGraphPropsArray[i];
        }
    }
}

function RadarGraph() { }

RadarGraph.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, Data: null,
    MaxValue: null, ColorStr: null, NumMarks: null, Title: null, TitleTextColor: null,
    TitleTextHeight: null, TitleTextFontString: null,
    MarkLabelTextColor: null, MarkLabelTextHeight: null, MarkLabelTextFontString: null,
    Tag: null, ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createRadarGraph(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.Data, this.MaxValue, this.ColorStr, this.NumMarks,
            this.Title, this.TitleTextColor,
            this.TitleTextHeight, this.TitleTextFontString, this.MarkLabelTextColor,
            this.MarkLabelTextHeight,
            this.MarkLabelTextFontString, this.Tag, this.TabStopIndex);
    }
};

function createRadarGraph(canvasid, controlNameId, x, y, width, height, depth, data,
    maxvalue, colorstr, nummarks, title, titletextcolor, titletextheight,
    titletextfontstring, marklabeltextcolor, marklabeltextheight, marklabeltextfontstring,
    tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'RadarGraph', controlNameId, null, tabstopindex);
    radarGraphPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, Data: data,
        MaxValue: maxvalue, ColorStr: colorstr, NumMarks: nummarks, Title: title,
        TitleTextColor: titletextcolor,
        TitleTextHeight: titletextheight, TitleTextFontString: titletextfontstring, H: 20,
        MarkLabelTextColor: marklabeltextcolor, MarkLabelTextHeight: marklabeltextheight,
        MarkLabelTextFontString: marklabeltextfontstring,
        AlreadyUnregisteredAnimation: 0, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var radarGraphProps = getRadarGraphProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        if (radarGraphProps.AlreadyUnregisteredAnimation === 0 && radarGraphProps.H >=
            (radarGraphProps.Height - radarGraphProps.TitleTextHeight
            - 8 - radarGraphProps.MarkLabelTextHeight - 8 - 4) / 2) {
            radarGraphProps.AlreadyUnregisteredAnimation = 1;
            unregisterAnimatedWindow(canvasid1, windowid1);
        }
        ctx.save();
        ctx.fillStyle = radarGraphProps.TitleTextColor;
        ctx.font = radarGraphProps.TitleTextFontString;
        ctx.fillText(radarGraphProps.Title, radarGraphProps.X + (radarGraphProps.Width -
            ctx.measureText(radarGraphProps.Title).width) / 2,
            radarGraphProps.Y + radarGraphProps.TitleTextHeight + 4);
        ctx.font = radarGraphProps.MarkLabelTextFontString;
        var angleinc = Math.PI * 360 / (180 * radarGraphProps.Data.length);
        ctx.translate(radarGraphProps.X + radarGraphProps.Width / 2, radarGraphProps.Y +
            radarGraphProps.TitleTextHeight + 8 + (radarGraphProps.Height -
                radarGraphProps.TitleTextHeight - 8 - radarGraphProps.MarkLabelTextHeight -
                8) / 2 + radarGraphProps.MarkLabelTextHeight + 8);
        ctx.rotate(Math.PI * 270 / 180);
        var redcomp = parseInt(radarGraphProps.ColorStr.substr(1, 2), 16);
        var greencomp = parseInt(radarGraphProps.ColorStr.substr(3, 2), 16);
        var bluecomp = parseInt(radarGraphProps.ColorStr.substr(5, 2), 16);
        var gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radarGraphProps.H);
        gradient.addColorStop(0.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
            gethighcomp(bluecomp));
        gradient.addColorStop(0.5, radarGraphProps.ColorStr);
        gradient.addColorStop(1.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
            getlowcomp(bluecomp));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(radarGraphProps.Data[0] * radarGraphProps.H / radarGraphProps.MaxValue, 0);
        for (var i = 1; i < radarGraphProps.Data.length; i++) {
            ctx.rotate(angleinc);
            ctx.lineTo(radarGraphProps.Data[i] * radarGraphProps.H /
                radarGraphProps.MaxValue, 0);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = '#505050';
        ctx.translate(radarGraphProps.X + radarGraphProps.Width / 2, radarGraphProps.Y +
            radarGraphProps.TitleTextHeight + 8 + (radarGraphProps.Height -
                radarGraphProps.TitleTextHeight - 8 - radarGraphProps.MarkLabelTextHeight - 8)
                / 2 + radarGraphProps.MarkLabelTextHeight + 8);
        ctx.rotate(Math.PI * 270 / 180);
        for (i = 0; i < radarGraphProps.Data.length; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(radarGraphProps.H, 0);
            ctx.closePath();
            ctx.stroke();
            var marksinc = radarGraphProps.H / radarGraphProps.NumMarks;
            for (var x = 0; x < radarGraphProps.NumMarks; x++) {
                ctx.beginPath();
                ctx.moveTo((x + 1) * marksinc, 3);
                ctx.lineTo((x + 1) * marksinc, -3);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.rotate(angleinc);
        }
        ctx.restore();
        ctx.fillStyle = radarGraphProps.MarkLabelTextColor;
        ctx.font = radarGraphProps.MarkLabelTextFontString;
        if (radarGraphProps.H === (radarGraphProps.Height - radarGraphProps.TitleTextHeight -
            8 - radarGraphProps.MarkLabelTextHeight - 8 - 4) / 2) {
            ctx.save();
            ctx.translate(radarGraphProps.X + radarGraphProps.Width / 2,
                radarGraphProps.Y + radarGraphProps.TitleTextHeight + 8 +
                (radarGraphProps.Height -
                    radarGraphProps.TitleTextHeight - 8 - radarGraphProps.MarkLabelTextHeight -
                    8) / 2 + radarGraphProps.MarkLabelTextHeight + 8);
            for (i = 0; i < radarGraphProps.NumMarks; i++) {
                var txt = ((i + 1) * radarGraphProps.MaxValue /
                    radarGraphProps.NumMarks).toString();
                ctx.fillText(txt, -(ctx.measureText(txt).width + 5),
                    radarGraphProps.MarkLabelTextHeight / 2 - (i + 1) *
                        ((radarGraphProps.Height -
                    radarGraphProps.TitleTextHeight - 8) / 2 / radarGraphProps.NumMarks));
            }
            ctx.restore();
        }
        if (radarGraphProps.H + 5 <= (radarGraphProps.Height -
            radarGraphProps.TitleTextHeight - 8 - radarGraphProps.MarkLabelTextHeight -
            8 - 4) / 2) {
            radarGraphProps.H += 5;
        } else {
            radarGraphProps.H = (radarGraphProps.Height - radarGraphProps.TitleTextHeight -
                8 - radarGraphProps.MarkLabelTextHeight - 8 - 4) / 2;
        }
    }, canvasid);
    registerAnimatedWindow(canvasid, windowid);
}

