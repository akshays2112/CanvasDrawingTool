/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Voting Control

var votingPropsArray = new Array();
var votingOutlineImageArray = new Array();

function getVotingOutlineImage(canvasid, windowid) {
    for (var i = 0; i < votingOutlineImageArray.length; i++) {
        if (votingOutlineImageArray[i][0] === canvasid &&
            votingOutlineImageArray[i][1] === windowid) {
            return votingOutlineImageArray[i][2];
        }
    }
}

function getVotingProps(canvasid, windowid) {
    for (var i = 0; i < votingPropsArray.length; i++) {
        if (votingPropsArray[i].CanvasID === canvasid &&
            votingPropsArray[i].WindowID === windowid) {
            return votingPropsArray[i];
        }
    }
}

function VotingControl() { }

VotingControl.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, NumStars: null,
    MaxValueOfAllStars: null,
    StarColorRed: null, StarColorGreen: null, StarColorBlue: null, StarColorAlpha: null,
    SpacingInPixelsBetweenStars: null, HasPartialStars: null, Editable: null,
    HasValueLabel: null, LabelXPos: null, LabelYPos: null,
    StarsStartingPosOffsetWhenLabel: null,
    StarsYPosWhenLabel: null, InitialValue: null, OutlineThicknessOfEmptyStar: null,
    StarsOrientation: null, FillOrientation: null, OutLineImgURL: null,
    CustomFillPoint: null, ImgWidth: null, ImgHeight: null, StarSizeInPixels: null,
    HasMouseOverLabel: null,
    StarOutlineBgColorRed: null, StarOutlineBgColorGreen: null,
    StarOutlineBgColorBlue: null,
    StarOutlineBgColorAlpha: null, LabelTextColor: null, LabelTextFontString: null,
    LabelTextHeight: null, CustomClickFunction: null,
    RoundDisplayedValueToNumOfDecimals: null,
    ControlNameID: null, Depth: null, TabStopIndex: null, IsCustomPattern: null,

    Initialize: function () {
        return createVotingControl(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.NumStars, this.MaxValueOfAllStars, this.StarColorRed,
            this.StarColorGreen, this.StarColorBlue,
            this.StarColorAlpha, this.StarSizeInPixels, this.SpacingInPixelsBetweenStars,
            this.HasPartialStars,
            this.Editable, this.HasValueLabel, this.LabelXPos, this.LabelYPos,
            this.LabelTextColor,
            this.LabelTextFontString, this.LabelTextHeight,
            this.StarsStartingPosOffsetWhenLabel,
            this.StarsYPosWhenLabel, this.InitialValue, this.OutlineThicknessOfEmptyStar,
            this.StarsOrientation,
            this.FillOrientation, this.IsCustomPattern, this.OutLineImgURL,
            this.CustomFillPoint,
            this.ImgWidth, this.ImgHeight, this.HasMouseOverLabel,
            this.StarOutlineBgColorRed,
            this.StarOutlineBgColorGreen, this.StarOutlineBgColorBlue,
            this.StarOutlineBgColorAlpha,
            this.CustomClickFunction, this.RoundDisplayedValueToNumOfDecimals,
            this.TabStopIndex);
    }
};

function createVotingControl(canvasid, controlNameId, x, y, width, height, depth,
    numstars, maxvalueofallstars, starcolorred, starcolorgreen, starcolorblue,
    starcoloralpha, starsizeinpixels, spacinginpixelsbetweenstars, haspartialstars,
    editable, hasvaluelabel, labelxpos, labelypos,
    labeltextcolor, labeltextfontstring, labeltextheight, starsstartingposoffsetwhenlabel,
    starsyposwhenlabel, initialvalue,
    outlinethicknessofemptystar, starsorientation, fillorientation, iscustompattern,
    outlineimgurl, customfillpoint,
    imgwidth, imgheight, hasmouseoverlabel, staroutlinebgcolorred,
    staroutlinebgcolorgreen, staroutlinebgcolorblue, staroutlinebgcoloralpha,
    customclickfunction, rounddisplayedvaluetonumofdecimals, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'VotingControl', controlNameId, null, tabstopindex);
    if (iscustompattern === 1) {
        votingOutlineImage = new Image();
        votingOutlineImage.onload = function () {
            invalidateRect(canvasid, null, x, y, width, height);
        };
        votingOutlineImage.src = outlineimgurl;
        votingOutlineImageArray.push([canvasid, windowid, votingOutlineImage]);
    }
    votingPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, NumStars: numstars, MaxValueOfAllStars: maxvalueofallstars,
        StarColorRed: starcolorred, StarColorGreen: starcolorgreen,
        StarColorBlue: starcolorblue, StarColorAlpha: starcoloralpha,
        SpacingInPixelsBetweenStars: spacinginpixelsbetweenstars,
        HasPartialStars: haspartialstars, Editable: editable,
        HasValueLabel: hasvaluelabel, LabelXPos: labelxpos, LabelYPos: labelypos,
        StarsStartingPosOffsetWhenLabel: starsstartingposoffsetwhenlabel,
        StarsYPosWhenLabel: starsyposwhenlabel, InitialValue: initialvalue,
        OutlineThicknessOfEmptyStar: outlinethicknessofemptystar,
        StarsOrientation: starsorientation, FillOrientation: fillorientation,
        IsCustomPattern: iscustompattern, OutLineImgURL: outlineimgurl,
        CustomFillPoint: customfillpoint, ImgWidth: imgwidth, ImgHeight: imgheight,
        StarSizeInPixels: starsizeinpixels, HasMouseOverLabel: hasmouseoverlabel,
        StarOutlineBgColorRed: staroutlinebgcolorred,
        StarOutlineBgColorGreen: staroutlinebgcolorgreen,
        StarOutlineBgColorBlue: staroutlinebgcolorblue,
        StarOutlineBgColorAlpha: staroutlinebgcoloralpha, LabelTextColor: labeltextcolor,
        LabelTextFontString: labeltextfontstring,
        LabelTextHeight: labeltextheight, CustomClickFunction: customclickfunction,
        RoundDisplayedValueToNumOfDecimals: rounddisplayedvaluetonumofdecimals
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var canvas, ctxdest, ctx, partialfillamountinpixels, didapartialstar,
            imgdata, numfullstars;
        var votingProps = getVotingProps(canvasid1, windowid1);
        if (votingProps.IsCustomPattern === 1) {
            ctxdest = getCtx(canvasid1);
            canvas = document.createElement('canvas');
            canvas.width = votingProps.ImgWidth;
            canvas.height = votingProps.ImgHeight;
            ctx = canvas.getContext('2d');
            ctx.drawImage(getVotingOutlineImage(canvasid1, windowid1), 0, 0);
            imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            numfullstars = votingProps.HasPartialStars === 1 ? Math.floor(
                votingProps.InitialValue / (votingProps.MaxValueOfAllStars /
                    votingProps.NumStars)) :
                Math.round(votingProps.InitialValue / (votingProps.MaxValueOfAllStars /
                    votingProps.NumStars));
            if (numfullstars > 0) {
                imgdata = fillImageData(votingProps.CustomFillPoint, imgdata);
                for (var i = 0; i < numfullstars; i++) {
                    ctxdest.putImageData(imgdata, votingProps.X + (
                        votingProps.StarsOrientation === 0 ? (
                            votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) + i *
                                (votingProps.ImgWidth +
                                    votingProps.SpacingInPixelsBetweenStars) : 0),
                        votingProps.Y + (votingProps.StarsOrientation === 1 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            i * (votingProps.ImgHeight +
                                votingProps.SpacingInPixelsBetweenStars) : 0));
                }
            }
            didapartialstar = 0;
            if (votingProps.HasPartialStars === 1) {
                didapartialstar = 1;
                partialfillamountinpixels = Math.round(votingProps.InitialValue /
                    (votingProps.MaxValueOfAllStars / votingProps.NumStars) % 1 *
                    votingProps.ImgWidth);
                if (partialfillamountinpixels > 0) {
                    canvas = document.createElement('canvas');
                    canvas.width = votingProps.ImgWidth;
                    canvas.height = votingProps.ImgHeight;
                    ctx = canvas.getContext('2d');
                    ctx.drawImage(getVotingOutlineImage(canvasid1, windowid1), 0, 0);
                    imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    var findstartingpoint = findStartingFillPointXY(
                        passImageDataAsArray(imgdata), imgdata.width,
                        votingProps.CustomFillPoint, votingProps.FillOrientation,
                        partialfillamountinpixels);
                    for (var j = 0; j < findstartingpoint.length; j++) {
                        var fillpoints = [findstartingpoint[j].X, findstartingpoint[j].Y,
                            0, 0, votingProps.ImgWidth, votingProps.ImgHeight,
                            votingProps.StarOutlineBgColorRed,
                            votingProps.StarOutlineBgColorGreen,
                            votingProps.StarOutlineBgColorBlue,
                            votingProps.StarOutlineBgColorAlpha, votingProps.StarColorRed,
                            votingProps.StarColorGreen, votingProps.StarColorBlue,
                            votingProps.StarColorAlpha, votingProps.FillOrientation,
                            0, partialfillamountinpixels];
                        imgdata = fillImageData(fillpoints, imgdata);
                    }
                    ctxdest.putImageData(imgdata, votingProps.X +
                        (votingProps.StarsOrientation === 0 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            numfullstars * (votingProps.ImgWidth +
                                votingProps.SpacingInPixelsBetweenStars) : 0),
                        votingProps.Y + (votingProps.StarsOrientation === 1 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            numfullstars * (votingProps.ImgHeight +
                                votingProps.SpacingInPixelsBetweenStars) : 0));
                }
            }
            if (numfullstars + didapartialstar < votingProps.NumStars) {
                canvas = document.createElement('canvas');
                canvas.width = votingProps.ImgWidth;
                canvas.height = votingProps.ImgHeight;
                ctx = canvas.getContext('2d');
                ctx.drawImage(getVotingOutlineImage(canvasid1, windowid1), 0, 0);
                imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
                for (i = numfullstars + didapartialstar; i < votingProps.NumStars; i++) {
                    ctxdest.putImageData(imgdata, votingProps.X +
                        (votingProps.StarsOrientation === 0 ? (votingProps.HasValueLabel === 1 ?
                            votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            i * (votingProps.ImgWidth +
                                votingProps.SpacingInPixelsBetweenStars) : 0),
                        votingProps.Y + (votingProps.StarsOrientation === 1 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) + i *
                                (votingProps.ImgHeight +
                                    votingProps.SpacingInPixelsBetweenStars) : 0));
                }
            }
            if (votingProps.HasValueLabel === 1) {
                ctxdest.fillStyle = votingProps.LabelTextColor;
                ctxdest.fillText(votingProps.InitialValue.toFixed(
                    votingProps.RoundDisplayedValueToNumOfDecimals ?
                        votingProps.RoundDisplayedValueToNumOfDecimals :
                        2).toString() + ' out of ' +
                    votingProps.MaxValueOfAllStars.toString(), votingProps.X +
                    votingProps.LabelXPos,
                    votingProps.Y + votingProps.LabelYPos);
            }
        } else {
            ctxdest = getCtx(canvasid1);
            canvas = document.createElement('canvas');
            canvas.width = votingProps.StarSizeInPixels;
            canvas.height = votingProps.StarSizeInPixels;
            ctx = canvas.getContext('2d');
            drawOutlineEmptyStarOnCtx(ctx, votingProps, canvas);
            imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
            numfullstars = votingProps.HasPartialStars === 1 ? Math.floor(
                votingProps.InitialValue / (votingProps.MaxValueOfAllStars /
                    votingProps.NumStars)) :
                Math.round(votingProps.InitialValue / (votingProps.MaxValueOfAllStars /
                    votingProps.NumStars));
            if (numfullstars > 0) {
                var fillpoints2 = [votingProps.StarSizeInPixels / 2,
                    votingProps.StarSizeInPixels / 2, 0, 0, votingProps.StarSizeInPixels,
                    votingProps.StarSizeInPixels,
                    255, 255, 255, 255, votingProps.StarColorRed,
                    votingProps.StarColorGreen, votingProps.StarColorBlue,
                    votingProps.StarColorAlpha];
                imgdata = fillImageData(fillpoints2, imgdata);
                for (i = 0; i < numfullstars; i++) {
                    ctxdest.putImageData(imgdata, votingProps.X +
                        (votingProps.StarsOrientation === 0 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            i * (votingProps.ImgWidth +
                                votingProps.SpacingInPixelsBetweenStars) : 0),
                        votingProps.Y + (votingProps.StarsOrientation === 1 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            i * (votingProps.ImgHeight +
                                votingProps.SpacingInPixelsBetweenStars) : 0));
                }
            }
            didapartialstar = 0;
            if (votingProps.HasPartialStars === 1) {
                didapartialstar = 1;
                partialfillamountinpixels = Math.round(votingProps.InitialValue /
                    (votingProps.MaxValueOfAllStars / votingProps.NumStars) % 1 *
                    votingProps.StarSizeInPixels);
                if (partialfillamountinpixels > 0) {
                    var canvas2 = document.createElement('canvas');
                    canvas2.width = votingProps.StarSizeInPixels;
                    canvas2.height = votingProps.StarSizeInPixels;
                    var ctx2 = canvas2.getContext('2d');
                    drawOutlineEmptyStarOnCtx(ctx2, votingProps, canvas2);
                    var imgdata2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height);
                    var findstartingpoint2 = findStartingFillPointXY(passImageDataAsArray(
                        imgdata2), imgdata2.width, [votingProps.StarSizeInPixels / 2,
                        votingProps.StarSizeInPixels / 2, 0, 0,
                        votingProps.StarSizeInPixels, votingProps.StarSizeInPixels, 255, 255,
                            255, 255, votingProps.StarColorRed, votingProps.StarColorGreen,
                            votingProps.StarColorBlue, votingProps.StarColorAlpha],
                        votingProps.FillOrientation, partialfillamountinpixels);
                    for (j = 0; j < findstartingpoint2.length; j++) {
                        var fillpoints3 = [findstartingpoint2[j].X, findstartingpoint2[j].Y, 0,
                            0, votingProps.StarSizeInPixels, votingProps.StarSizeInPixels,
                            255, 255, 255, 255, votingProps.StarColorRed,
                            votingProps.StarColorGreen, votingProps.StarColorBlue,
                            votingProps.StarColorAlpha,
                        votingProps.FillOrientation, 0, partialfillamountinpixels];
                        imgdata2 = fillImageData(fillpoints3, imgdata2);
                    }
                    ctxdest.putImageData(imgdata2, votingProps.X +
                        (votingProps.StarsOrientation === 0 ? (votingProps.HasValueLabel === 1 ?
                            votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            numfullstars * (votingProps.StarSizeInPixels +
                                votingProps.SpacingInPixelsBetweenStars) : 0),
                        votingProps.Y + (votingProps.StarsOrientation === 1 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            numfullstars * (votingProps.StarSizeInPixels +
                                votingProps.SpacingInPixelsBetweenStars) : 0));
                }
            }
            if (numfullstars + didapartialstar < votingProps.NumStars) {
                var canvas3 = document.createElement('canvas');
                canvas3.width = votingProps.ImgWidth;
                canvas3.height = votingProps.ImgHeight;
                var ctx3 = canvas3.getContext('2d');
                drawOutlineEmptyStarOnCtx(ctx3, votingProps, canvas3);
                imgdata = ctx3.getImageData(0, 0, canvas3.width, canvas3.height);
                for (i = numfullstars + didapartialstar; i < votingProps.NumStars; i++) {
                    ctxdest.putImageData(imgdata, votingProps.X +
                        (votingProps.StarsOrientation === 0 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) + i *
                                (votingProps.StarSizeInPixels +
                                    votingProps.SpacingInPixelsBetweenStars) : 0),
                        votingProps.Y + (votingProps.StarsOrientation === 1 ?
                            (votingProps.HasValueLabel === 1 ?
                                votingProps.StarsStartingPosOffsetWhenLabel : 0) +
                            i * (votingProps.StarSizeInPixels +
                                votingProps.SpacingInPixelsBetweenStars) : 0));
                }
            }
            if (votingProps.HasValueLabel === 1) {
                ctxdest.fillStyle = votingProps.LabelTextColor;
                ctxdest.fillText(votingProps.InitialValue.toFixed(
                    votingProps.RoundDisplayedValueToNumOfDecimals ?
                        votingProps.RoundDisplayedValueToNumOfDecimals :
                        2).toString() + ' out of ' +
                    votingProps.MaxValueOfAllStars.toString(), votingProps.X +
                    votingProps.LabelXPos,
                    votingProps.Y + votingProps.LabelYPos);
            }
        }
    }, canvasid);
    if (editable === 1) {
        registerClickFunction(windowid, function (canvasid, windowid, e) {
            var votingProps = getVotingProps(canvasid, windowid);
            var clickx = e.calcX;
            var clicky = e.calcY;
            for (var i = 0; i < votingProps.NumStars; i++) {
                var starminx = votingProps.X + (votingProps.StarsOrientation === 0 ?
                    (votingProps.HasValueLabel === 1 ?
                        votingProps.StarsStartingPosOffsetWhenLabel : 0) + i *
                            ((votingProps.IsCustomPattern === 1 ? votingProps.ImgWidth :
                            votingProps.StarSizeInPixels) +
                            votingProps.SpacingInPixelsBetweenStars) : 0);
                var starmaxx = starminx + (votingProps.IsCustomPattern === 1 ?
                    votingProps.ImgWidth : votingProps.StarSizeInPixels);
                var starminy = votingProps.Y + (votingProps.StarsOrientation === 1 ?
                    (votingProps.HasValueLabel === 1 ?
                        votingProps.StarsStartingPosOffsetWhenLabel : 0) + i *
                            ((votingProps.IsCustomPattern === 1 ? votingProps.ImgHeight :
                            votingProps.StarSizeInPixels) +
                            votingProps.SpacingInPixelsBetweenStars) : 0);
                var starmaxy = starminy + (votingProps.IsCustomPattern === 1 ?
                    votingProps.ImgHeight : votingProps.StarSizeInPixels);
                if (starminx < clickx && starmaxx > clickx && starminy < clicky &&
                    starmaxy > clicky) {
                    var value = i * (votingProps.MaxValueOfAllStars /
                        votingProps.NumStars) + (votingProps.FillOrientation === 0 ?
                            (clickx - starminx) /
                            (votingProps.IsCustomPattern === 1 ? votingProps.ImgWidth :
                                votingProps.StarSizeInPixels) : (clicky - starminy) /
                            (votingProps.IsCustomPattern === 1 ? votingProps.ImgHeight :
                                votingProps.StarSizeInPixels) *
                        (votingProps.MaxValueOfAllStars / votingProps.NumStars));
                    if (votingProps.CustomClickFunction) {
                        votingProps.CustomClickFunction(canvasid, windowid, votingProps,
                            clickx, clicky, value);
                    } else {
                        votingProps.InitialValue = value;
                    }
                }
            }
        }, canvasid);
    }
}

function passImageDataAsArray(imgdata) {
    var data = new Array();
    for (var i = 0; i < imgdata.width * imgdata.height * 4; i++) {
        data.push(imgdata.data[i]);
    }
    return data;
}

function findStartingFillPointXY(imgdata, width, fillpoints, fillorientation,
    partialfillamountinpixels) {
    var points = new Array();
    var buff = new Array();
    buff.push([fillpoints[0], fillpoints[1]]);
    while (buff.length > 0) {
        var x = buff[buff.length - 1][0];
        var y = buff[buff.length - 1][1];
        buff.pop();
        if (imgdata[y * width * 4 + x * 4] === fillpoints[6] && imgdata[y * width *
            4 + x * 4 + 1] === fillpoints[7] &&
            imgdata[y * width * 4 + x * 4 + 2] === fillpoints[8] && imgdata[y *
                width * 4 + x * 4 + 3] === fillpoints[9]) {
            imgdata[y * width * 4 + x * 4] = fillpoints[10];
            imgdata[y * width * 4 + x * 4 + 1] = fillpoints[11];
            imgdata[y * width * 4 + x * 4 + 2] = fillpoints[12];
            imgdata[y * width * 4 + x * 4 + 3] = fillpoints[13];
            if (fillpoints.length === 17 && fillpoints[14] === 0 ? x - 1 > fillpoints[15] :
                x - 1 > fillpoints[2]) {
                buff.push([x - 1, y]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 0 ? x + 1 < fillpoints[16] :
                x + 1 < fillpoints[4]) {
                buff.push([x + 1, y]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 1 ? y - 1 > fillpoints[15] :
                y - 1 > fillpoints[3]) {
                buff.push([x, y - 1]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 1 ? x - 1 > fillpoints[16] :
                y + 1 < fillpoints[5]) {
                buff.push([x, y + 1]);
            }
            if (fillorientation === 0 ? x <= partialfillamountinpixels : y <=
                partialfillamountinpixels) {
                points.push({ X: x, Y: y });
            }
        }
    }
    return points;
}

function drawOutlineEmptyStarOnCtx(ctx, votingProps, canvas) {
    ctx.fillStyle = '#FFFFFF';
    ctx.rect(0, 0, votingProps.StarSizeInPixels, votingProps.StarSizeInPixels);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = votingProps.OutlineThicknessOfEmptyStar;
    ctx.beginPath();
    var points = [[0, Math.floor(24 * votingProps.StarSizeInPixels / 70)],
        [Math.floor(27 * votingProps.StarSizeInPixels / 70), Math.floor(24 *
            votingProps.StarSizeInPixels / 70)],
        [Math.floor(votingProps.StarSizeInPixels / 2), 0], [Math.floor(43 *
            votingProps.StarSizeInPixels / 70), Math.floor(24 * votingProps.StarSizeInPixels / 70)],
        [votingProps.StarSizeInPixels, Math.floor(24 * votingProps.StarSizeInPixels /
            70)], [Math.floor(49 * votingProps.StarSizeInPixels / 70),
            Math.floor(41 * votingProps.StarSizeInPixels / 70)], [Math.floor(60 *
                votingProps.StarSizeInPixels / 70), votingProps.StarSizeInPixels],
            [Math.floor(votingProps.StarSizeInPixels / 2), Math.floor(50 *
                votingProps.StarSizeInPixels / 70)],
            [Math.floor(15 * votingProps.StarSizeInPixels / 70), Math.floor(
                votingProps.StarSizeInPixels)], [Math.floor(21 *
                    votingProps.StarSizeInPixels / 70),
    Math.floor(41 * votingProps.StarSizeInPixels / 70)]];
    var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.putImageData(drawClosedLoopLines(imgdata, points, votingProps.StarColorRed,
        votingProps.StarColorGreen, votingProps.StarColorBlue, votingProps.StarColorAlpha),
        0, 0);
}

function drawClosedLoopLines(imgdata, points, red, green, blue, alpha) {
    if (points.length > 1) {
        for (var i = 0; i < points.length; i++) {
            imgdata = drawline2(imgdata, points[i][0], points[i][1], i ===
                points.length - 1 ? points[0][0] : points[i + 1][0],
                i === points.length - 1 ? points[0][1] : points[i + 1][1],
                red, green, blue, alpha);
        }
    }
    return imgdata;
}

function drawline2(imgdata, x1, y1, x2, y2, red, green, blue, alpha) {
    var dx = x2 - x1; var sx = 1;
    var dy = y2 - y1; var sy = 1;

    if (dx < 0) {
        sx = -1;
        dx = -dx;
    }
    if (dy < 0) {
        sy = -1;
        dy = -dy;
    }

    dx = dx << 1;
    dy = dy << 1;
    imgdata = setPixel(imgdata, x1, y1, red, green, blue, alpha);
    if (dy < dx) {
        var fraction = dy - (dx >> 1);
        while (x1 !== x2) {
            if (fraction >= 0) {
                y1 += sy;
                fraction -= dx;
            }
            fraction += dy;
            x1 += sx;
            imgdata = setPixel(imgdata, x1, y1, red, green, blue, alpha);
        }
    }
    else {
        var fraction2 = dx - (dy >> 1);
        while (y1 !== y2) {
            if (fraction2 >= 0) {
                x1 += sx;
                fraction2 -= dy;
            }
            fraction2 += dx;
            y1 += sy;
            imgdata = setPixel(imgdata, x1, y1, red, green, blue, alpha);
        }
    }
    return imgdata;
}

function setPixel(imgdata, x, y, red, green, blue, alpha) {
    imgdata.data[y * imgdata.width * 4 + x * 4] = red;
    imgdata.data[y * imgdata.width * 4 + x * 4 + 1] = green;
    imgdata.data[y * imgdata.width * 4 + x * 4 + 2] = blue;
    imgdata.data[y * imgdata.width * 4 + x * 4 + 3] = alpha;
    return imgdata;
}

function findMinValueIndex(array) {
    var index = -1;
    if (array.length > 1) {
        var currmax = array[0];
        index = 0;
        for (var i = 1; i < array.length; i++) {
            if (currmax > array[i]) {
                currmax = array[i];
                index = i;
            }
        }
    }
    return index;
}

function fillImageData(fillpoints, imgdata) {
    var buff = new Array();
    buff.push([fillpoints[0], fillpoints[1]]);
    while (buff.length > 0) {
        var x = buff[buff.length - 1][0];
        var y = buff[buff.length - 1][1];
        buff.pop();
        if (imgdata.data[y * imgdata.width * 4 + x * 4] === fillpoints[6] &&
            imgdata.data[y * imgdata.width * 4 + x * 4 + 1] === fillpoints[7] &&
            imgdata.data[y * imgdata.width * 4 + x * 4 + 2] === fillpoints[8] &&
            imgdata.data[y * imgdata.width * 4 + x * 4 + 3] === fillpoints[9]) {
            imgdata.data[y * imgdata.width * 4 + x * 4] = fillpoints[10];
            imgdata.data[y * imgdata.width * 4 + x * 4 + 1] = fillpoints[11];
            imgdata.data[y * imgdata.width * 4 + x * 4 + 2] = fillpoints[12];
            imgdata.data[y * imgdata.width * 4 + x * 4 + 3] = fillpoints[13];
            if (fillpoints.length === 17 && fillpoints[14] === 0 ? x - 1 > fillpoints[15] :
                x - 1 > fillpoints[2]) {
                buff.push([x - 1, y]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 0 ? x + 1 < fillpoints[16] :
                x + 1 < fillpoints[4]) {
                buff.push([x + 1, y]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 1 ? y - 1 > fillpoints[15] :
                y - 1 > fillpoints[3]) {
                buff.push([x, y - 1]);
            }
            if (fillpoints.length === 17 && fillpoints[14] === 1 ? x - 1 > fillpoints[16] :
                y + 1 < fillpoints[5]) {
                buff.push([x, y + 1]);
            }
        }
    }
    return imgdata;
}

