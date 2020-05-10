/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Multi Line Label code starts here

var multiLineLabelPropsArray = new Array();

function getMultiLineLabelProps(canvasid, windowid) {
    for (var i = 0; i < multiLineLabelPropsArray.length; i++) {
        if (multiLineLabelPropsArray[i].CanvasID === canvasid &&
            multiLineLabelPropsArray[i].WindowID === windowid) {
            return multiLineLabelPropsArray[i];
        }
    }
}

//<NT> - normal text will use the default font color, height, font string - ex. <NT>some text to be drawn with default font metrics</NT>
//<N><C>color</C><F>12 pt Ariel</F><T>some text to draw using &lt;F&gt; value which is the font string</T></N>

function getMarkupFontString(idx, extents) {
    for (var i = 0; i < extents.length; i++) {
        if (idx >= extents[i][0] && idx <= extents[i][1]) {
            return extents[i][3];
        }
    }
}

function getMarkupFontColor(idx, extents) {
    for (var i = 0; i < extents.length; i++) {
        if (idx >= extents[i][0] && idx <= extents[i][1]) {
            return extents[i][2];
        }
    }
}

function getMarkupLineNumber(idx, extents) {
    for (var i = 0; i < extents.length; i++) {
        if (idx <= extents[i]) {
            return i;
        }
    }
    return extents.length;
}

function MultiLineLabel() { }

MultiLineLabel.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, HasMarkup: null,
    Text: null, TextColor: null,
    TextHeight: null, TextFontString: null, LineSpacingInPixels: null, WordSensitive: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createMultiLineLabel(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Depth, this.HasMarkup,
            this.Text, this.TextColor, this.TextHeight, this.TextFontString,
            this.LineSpacingInPixels, this.WordSensitive, this.TabStopIndex);
    }
};

function createMultiLineLabel(canvasid, controlNameId, x, y, width, depth, hasMarkup,
    text, textColor, textHeight, textFontString,
    lineSpacingInPixels, wordSensitive, tabstopindex) {
    var height = textHeight + lineSpacingInPixels;
    var ctx = getCtx(canvasid);
    ctx.font = textFontString;
    var lineBreakIndexes = new Array();
    var markupText = '';
    var markupTextExtents = new Array();
    if (hasMarkup === 0) {
        if (wordSensitive === 0) {
            var currStrIndex = 0;
            var lastLineBreakIndex = 0;
            while (currStrIndex < text.length) {
                if (text.substr(currStrIndex, 1) === '\n') {
                    lineBreakIndexes.push(currStrIndex);
                    lastLineBreakIndex = currStrIndex;
                    height += textHeight + lineSpacingInPixels;
                } else if (ctx.measureText(text.substr(lastLineBreakIndex,
                    currStrIndex - lastLineBreakIndex + 1)).width > width) {
                    lineBreakIndexes.push(currStrIndex);
                    lastLineBreakIndex = currStrIndex;
                    height += textHeight + lineSpacingInPixels;
                }
                currStrIndex++;
            }
        } else {
            var currStrIndex2 = 0;
            var lastLineBreakIndex2 = 0;
            var lastSpace = -1;
            while (currStrIndex2 < text.length) {
                if (text.substr(currStrIndex2, 1) === '\n') {
                    lineBreakIndexes.push(currStrIndex2);
                    lastLineBreakIndex2 = currStrIndex2;
                } else if (ctx.measureText(text.substr(lastLineBreakIndex2,
                    currStrIndex2 - lastLineBreakIndex2 + 1)).width > width) {
                    if (lastSpace > -1) {
                        lineBreakIndexes.push(lastSpace);
                        lastLineBreakIndex2 = lastSpace;
                    } else {
                        lineBreakIndexes.push(currStrIndex2);
                        lastLineBreakIndex2 = currStrIndex2;
                    }
                }
                height += textHeight + lineSpacingInPixels;
                currStrIndex2++;
                if (text.substr(currStrIndex2, 1) === ' ') {
                    lastSpace = currStrIndex2;
                }
            }
        }
    } else {
        if (window.DOMParser) {
            var parser = new DOMParser();
            xmlDoc = parser.parseFromString('<root>' + text + '</root>', "text/xml");
            for (var i = 0; i < xmlDoc.firstChild.childNodes.length; i++) {
                switch (xmlDoc.firstChild.childNodes[i].nodeName) {
                    case 'NT':
                        var tmp = markupText.length > 0 ? markupText.length - 1 : 0;
                        markupText += xmlDoc.firstChild.childNodes[i].childNodes.length
                            > 0 ? xmlDoc.firstChild.childNodes[i].childNodes[0].nodeValue
                            : xmlDoc.firstChild.childNodes[i].nodeValue;
                        markupTextExtents.push([tmp, markupText.length - 1, textColor,
                            textFontString]);
                        break;
                    case 'N':
                        var colorstr, fontstr, textstr;
                        for (var j = 0; j < xmlDoc.firstChild.childNodes[i].childNodes.length;
                            j++) {
                            switch (xmlDoc.firstChild.childNodes[i].childNodes[j].nodeName) {
                                case 'C':
                                    colorstr =
                                        xmlDoc.firstChild.childNodes[i].childNodes[
                                        j].childNodes.length > 0 ?
                                        xmlDoc.firstChild.childNodes[i].childNodes[
                                            j].childNodes[0].nodeValue :
                                        xmlDoc.firstChild.childNodes[i].childNodes[j].nodeValue;
                                    break;
                                case 'F':
                                    fontstr = xmlDoc.firstChild.childNodes[i].childNodes[
                                        j].childNodes.length > 0 ?
                                        xmlDoc.firstChild.childNodes[i].childNodes[
                                            j].childNodes[0].nodeValue :
                                        xmlDoc.firstChild.childNodes[i].childNodes[j].nodeValue;
                                    break;
                                case 'T':
                                    textstr = xmlDoc.firstChild.childNodes[i].childNodes[
                                        j].childNodes.length > 0 ?
                                        xmlDoc.firstChild.childNodes[i].childNodes[
                                            j].childNodes[0].nodeValue :
                                        xmlDoc.firstChild.childNodes[i].childNodes[j].nodeValue;
                                    break;
                            }
                        }
                        var tmp2 = markupText.length - 1;
                        markupText += textstr;
                        markupTextExtents.push([tmp2, markupText.length - 1,
                            colorstr, fontstr]);
                        break;
                }
            }
            if (wordSensitive === 0) {
                var currStrIndex4 = 0;
                var currLineWidth = 0;
                while (currStrIndex4 < markupText.length) {
                    ctx.font = getMarkupFontString(currStrIndex4, markupTextExtents);
                    var tmpwidth = ctx.measureText(markupText.substr(currStrIndex4, 1)).width;
                    if (markupText.substr(currStrIndex4, 1) === '\n') {
                        lineBreakIndexes.push(currStrIndex4);
                        currLineWidth = 0;
                        height += textHeight + lineSpacingInPixels;
                    } else if (currLineWidth + tmpwidth > width) {
                        lineBreakIndexes.push(currStrIndex4 - 1);
                        currLineWidth = 0;
                        height += textHeight + lineSpacingInPixels;
                    } else {
                        currLineWidth += tmpwidth;
                        currStrIndex4++;
                    }
                }
            } else {
                var currStrIndex3 = 0;
                var currLineWidth2 = 0;
                var lastSpace2 = -1;
                while (currStrIndex3 < markupText.length) {
                    ctx.font = getMarkupFontString(currStrIndex3, markupTextExtents);
                    var tmpwidth2 = ctx.measureText(markupText.substr(currStrIndex3, 1)).width;
                    if (markupText.substr(currStrIndex3, 1) === '\n') {
                        lineBreakIndexes.push(currStrIndex3);
                        currLineWidth2 = 0;
                        height += textHeight + lineSpacingInPixels;
                    } else if (currLineWidth2 + tmpwidth2 > width) {
                        if (lastSpace2 > -1) {
                            lineBreakIndexes.push(lastSpace2);
                            currStrIndex3 = lastSpace2;
                        } else {
                            lineBreakIndexes.push(currStrIndex3 - 1);
                        }
                        currLineWidth2 = 0;
                        height += textHeight + lineSpacingInPixels;
                    } else {
                        currLineWidth2 += tmpwidth2;
                        currStrIndex3++;
                    }
                    if (markupText.substr(currStrIndex3, 1) === ' ') {
                        lastSpace2 = currStrIndex3;
                    }
                }
            }
        }
    }
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'MultiLineLabel');
    multiLineLabelPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, HasMarkup: hasMarkup, Text: text, TextColor: textColor,
        TextHeight: textHeight, TextFontString: textFontString,
        LineSpacingInPixels: lineSpacingInPixels, LineBreakIndexes: lineBreakIndexes,
        MarkupTextExtents: markupTextExtents, MarkupText: markupText
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var multiLineLabelProps = getMultiLineLabelProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        if (multiLineLabelProps.HasMarkup === 0) {
            ctx.font = multiLineLabelProps.TextFontString;
            ctx.fillStyle = multiLineLabelProps.TextColor;
            var lastLineBreakIndex = 0;
            for (var i = 0; i < multiLineLabelProps.LineBreakIndexes.length; i++) {
                ctx.fillText(removeTrailingSpacesAndLineBreaks(
                    multiLineLabelProps.Text.substr(i > 0 ?
                        multiLineLabelProps.LineBreakIndexes[i - 1] : 0,
                        multiLineLabelProps.LineBreakIndexes[i] -
                        (i > 0 ? multiLineLabelProps.LineBreakIndexes[i - 1] : 0))),
                    multiLineLabelProps.X, multiLineLabelProps.Y +
                    multiLineLabelProps.TextHeight +
                    (multiLineLabelProps.TextHeight +
                        multiLineLabelProps.LineSpacingInPixels) * i);
            }
            if (multiLineLabelProps.LineBreakIndexes[
                multiLineLabelProps.LineBreakIndexes.length - 1] + 1 <
                multiLineLabelProps.Text.length) {
                ctx.fillText(removeTrailingSpacesAndLineBreaks(
                    multiLineLabelProps.Text.substr(multiLineLabelProps.LineBreakIndexes[
                        multiLineLabelProps.LineBreakIndexes.length - 1])),
                    multiLineLabelProps.X, multiLineLabelProps.Y + 
                        multiLineLabelProps.TextHeight * (
                            multiLineLabelProps.LineBreakIndexes.length + 1) +
                    multiLineLabelProps.LineSpacingInPixels *
                        multiLineLabelProps.LineBreakIndexes.length);
            }
        } else {
            var currStrIndex = 0;
            var currLineWidth = 0;
            var lastLineNo = 0;
            while (currStrIndex < multiLineLabelProps.MarkupText.length) {
                ctx.font = getMarkupFontString(currStrIndex,
                    multiLineLabelProps.MarkupTextExtents);
                ctx.fillStyle = getMarkupFontColor(currStrIndex,
                    multiLineLabelProps.MarkupTextExtents);
                var lineno = getMarkupLineNumber(currStrIndex,
                    multiLineLabelProps.LineBreakIndexes);
                if (lineno !== lastLineNo) {
                    lastLineNo = lineno;
                    currLineWidth = 0;
                }
                ctx.fillText(multiLineLabelProps.MarkupText.substr(currStrIndex, 1),
                    multiLineLabelProps.X + currLineWidth,
                    multiLineLabelProps.Y + multiLineLabelProps.TextHeight +
                    (multiLineLabelProps.TextHeight +
                        multiLineLabelProps.LineSpacingInPixels) * lineno);
                currLineWidth += ctx.measureText(
                    multiLineLabelProps.MarkupText.substr(currStrIndex, 1)).width;
                currStrIndex++;
            }
        }
    }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

