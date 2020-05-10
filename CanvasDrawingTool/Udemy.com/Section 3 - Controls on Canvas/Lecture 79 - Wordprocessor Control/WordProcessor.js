/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Word processor code starts here
//italic or normal - normal | small-caps - normal | bold | bolder | lighter | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 -  xx-small | x-small | small | medium | large | x-large | xx-large
//number pt | em | ex | % - serif | sans-serif | cursive | fantasy | monospace - highlight - text color

var wordProcessorPropsArray = new Array();

function getWordProcessorProps(canvasid, windowid) {
    for (var i = 0; i < wordProcessorPropsArray.length; i++) {
        if (wordProcessorPropsArray[i].CanvasID === canvasid &&
            wordProcessorPropsArray[i].WindowID === windowid) {
            return wordProcessorPropsArray[i];
        }
    }
}

function getWordProcessorPropsByKeyboardID(canvasid, windowid) {
    for (var i = 0; i < wordProcessorPropsArray.length; i++) {
        if (wordProcessorPropsArray[i].CanvasID === canvasid &&
            wordProcessorPropsArray[i].CustomKeyboardWindowID === windowid) {
            return wordProcessorPropsArray[i];
        }
    }
}

function wordProcessorTouchKeyPress(canvasid, windowid, keyboardChar) {
    var wordProcessorProps = getWordProcessorPropsByKeyboardID(canvasid, windowid);
    var skip = false;
    switch (keyboardChar.toLowerCase()) {
        case 'left':
            //left arrow	 37
            if (wordProcessorProps.CaretPosIndex > -1) {
                wordProcessorProps.CaretPosIndex--;
                wordProcessorProps.SelectedTextStartIndex = -1;
                wordProcessorProps.SelectedTextEndIndex = -1;
                wordProcessorProps.WasSelecting = 0;
                wordProcessorProps.MouseDown = 0;
            }
            skip = true;
            break;
        case 'up':
            //up arrow
            var caretLineNo = 0;
            if (wordProcessorProps.LineBreakIndexes.length > 0) {
                for (var p = 0; p < wordProcessorProps.LineBreakIndexes.length; p++) {
                    if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                        wordProcessorProps.LineBreakIndexes[p - 1]) &&
                        wordProcessorProps.CaretPosIndex <
                        wordProcessorProps.LineBreakIndexes[p]) {
                        caretLineNo = p;
                        break;
                    } else if (wordProcessorProps.CaretPosIndex >
                        wordProcessorProps.LineBreakIndexes[p]) {
                        caretLineNo = p + 1;
                    }
                }
                if (caretLineNo > 0) {
                    wordProcessorProps.CaretPosIndex = (caretLineNo === 1 ? 0 :
                        wordProcessorProps.LineBreakIndexes[caretLineNo - 2]) +
                        (wordProcessorProps.CaretPosIndex -
                            wordProcessorProps.LineBreakIndexes[caretLineNo - 1]);
                }
            }
            skip = true;
            break;
        case 'right':
            //right arrow	 39
            if (wordProcessorProps.CaretPosIndex >=
                wordProcessorProps.UserInputText.length - 1) {
                wordProcessorProps.CaretPosIndex =
                    wordProcessorProps.UserInputText.length - 1;
            } else {
                wordProcessorProps.CaretPosIndex++;
            }
            wordProcessorProps.SelectedTextStartIndex = -1;
            wordProcessorProps.SelectedTextEndIndex = -1;
            wordProcessorProps.MouseDown = 0;
            wordProcessorProps.WasSelecting = 0;
            skip = true;
            break;
        case 'down':
            //down arrow key
            var caretLineNo = 0;
            if (wordProcessorProps.LineBreakIndexes.length > 0) {
                for (var p = 0; p < wordProcessorProps.LineBreakIndexes.length; p++) {
                    if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                        wordProcessorProps.LineBreakIndexes[p - 1]) &&
                        wordProcessorProps.CaretPosIndex <
                        wordProcessorProps.LineBreakIndexes[p]) {
                        caretLineNo = p;
                        break;
                    } else if (wordProcessorProps.CaretPosIndex >
                        wordProcessorProps.LineBreakIndexes[p]) {
                        caretLineNo = p + 1;
                    }
                }
                if (caretLineNo < wordProcessorProps.LineBreakIndexes.length) {
                    wordProcessorProps.CaretPosIndex =
                        wordProcessorProps.LineBreakIndexes[caretLineNo] +
                        (wordProcessorProps.CaretPosIndex - (caretLineNo === 0 ? 0 :
                            wordProcessorProps.LineBreakIndexes[caretLineNo - 1]));
                }
            }
            skip = true;
            break;
        case 'backspacekey':
            //backspace	 8
            if (wordProcessorProps.CaretPosIndex > -1) {
                if (wordProcessorProps.CaretPosIndex === 0) {
                    if (wordProcessorProps.UserInputText.length > 1) {
                        wordProcessorProps.UserInputText =
                            wordProcessorProps.UserInputText.substring(1,
                                wordProcessorProps.UserInputText.length - 1);
                    } else {
                        wordProcessorProps.UserInputText = '';
                    }
                    wordProcessorProps.CaretPosIndex = -1;
                } else if (wordProcessorProps.CaretPosIndex ==
                    wordProcessorProps.UserInputText.length - 1) {
                    wordProcessorProps.UserInputText =
                        wordProcessorProps.UserInputText.substring(0,
                            wordProcessorProps.UserInputText.length - 1);
                    wordProcessorProps.CaretPosIndex--;
                } else if (wordProcessorProps.CaretPosIndex > 0) {
                    wordProcessorProps.UserInputText =
                        wordProcessorProps.UserInputText.substring(0,
                            wordProcessorProps.CaretPosIndex) +
                        wordProcessorProps.UserInputText.substring(
                            wordProcessorProps.CaretPosIndex + 1);
                    wordProcessorProps.CaretPosIndex--;
                }
                wordProcessorProps.SelectedTextStartIndex = -1;
                wordProcessorProps.SelectedTextEndIndex = -1;
                wordProcessorProps.MouseDown = 0;
                wordProcessorProps.WasSelecting = 0;
            }
            skip = true;
            break;
        case 'spacebarkey':
            keyboardChar = ' ';
            break;
        case 'carriagereturnkey':
            keyboardChar = '\n';
            break;
    }
    if (!skip) {
        if (!wordProcessorProps.UserInputText || (wordProcessorProps.UserInputText &&
            wordProcessorProps.UserInputText.length < wordProcessorProps.MaxChars)) {
            var c = keyboardChar;
            var foundPossibleMatch;
            if ((!wordProcessorProps.AllowedCharsRegEx ||
                wordProcessorProps.AllowedCharsRegEx === null ||
                wordProcessorProps.AllowedCharsRegEx.length === 0 ||
                c.match(wordProcessorProps.AllowedCharsRegEx) === c || c === '\n')) {
                if (wordProcessorProps.CaretPosIndex === -1) {
                    wordProcessorProps.UserInputText = c + (
                        wordProcessorProps.UserInputText ?
                            wordProcessorProps.UserInputText : '');
                    wordProcessorProps.CaretPosIndex++;
                } else if (wordProcessorProps.UserInputText &&
                    wordProcessorProps.CaretPosIndex ==
                    wordProcessorProps.UserInputText.length - 1) {
                    wordProcessorProps.UserInputText =
                        wordProcessorProps.UserInputText + c;
                    wordProcessorProps.CaretPosIndex++;
                } else if (wordProcessorProps.UserInputText) {
                    wordProcessorProps.UserInputText =
                        wordProcessorProps.UserInputText.substring(0,
                            wordProcessorProps.CaretPosIndex + 1) + c +
                        wordProcessorProps.UserInputText.substring(
                            wordProcessorProps.CaretPosIndex + 1);
                    wordProcessorProps.CaretPosIndex++;
                }
                wordProcessorProps.SelectedTextStartIndex = -1;
                wordProcessorProps.SelectedTextEndIndex = -1;
                wordProcessorProps.MouseDown = 0;
                wordProcessorProps.WasSelecting = 0;
            }
        }
    }
    wordProcessorProps.LineBreakIndexes = new Array();
    if (wordProcessorProps.UserInputText && wordProcessorProps.UserInputText.length > 0) {
        var ctx = getCtx(canvasid);
        if (wordProcessorProps.WordSensitive === 0) {
            var currStrIndex = 0;
            var lastLineBreakIndex = 0;
            while (currStrIndex < wordProcessorProps.UserInputText.length) {
                if (wordProcessorProps.UserInputText.substr(lastLineBreakIndex,
                    currStrIndex - lastLineBreakIndex + 1) === '\n') {
                    wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                    lastLineBreakIndex = currStrIndex;
                } else if (ctx.measureText(wordProcessorProps.UserInputText.substr(
                    lastLineBreakIndex, currStrIndex - lastLineBreakIndex + 1)).width +
                    wordProcessorProps.Margin > wordProcessorProps.Width - 15) {
                    wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                    lastLineBreakIndex = currStrIndex;
                }
                currStrIndex++;
            }
        } else {
            var currStrIndex = 0;
            var lastLineBreakIndex = 0;
            var lastSpace = -1;
            while (currStrIndex < wordProcessorProps.UserInputText.length) {
                if (wordProcessorProps.UserInputText.substr(currStrIndex, 1) === '\n') {
                    wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                    lastLineBreakIndex = currStrIndex;
                } else if (ctx.measureText(wordProcessorProps.UserInputText.substr(
                    lastLineBreakIndex, currStrIndex - lastLineBreakIndex + 1)).width +
                    wordProcessorProps.Margin > wordProcessorProps.Width - 15) {
                    if (lastSpace > -1) {
                        wordProcessorProps.LineBreakIndexes.push(lastSpace);
                        lastLineBreakIndex = lastSpace;
                    } else {
                        wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                        lastLineBreakIndex = currStrIndex;
                    }
                }
                currStrIndex++;
                if (wordProcessorProps.UserInputText.substr(currStrIndex, 1) === ' ') {
                    lastSpace = currStrIndex;
                }
            }
        }
        var vscrollbarProps = getScrollBarProps(canvasid,
            wordProcessorProps.VScrollBarWindowID);
        vscrollbarProps.MaxItems = wordProcessorProps.LineBreakIndexes.length;
        var caretLineNo = 0;
        if (wordProcessorProps.LineBreakIndexes.length > 0) {
            for (var p = 0; p < wordProcessorProps.LineBreakIndexes.length; p++) {
                if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                    wordProcessorProps.LineBreakIndexes[p - 1]) &&
                    wordProcessorProps.CaretPosIndex <
                    wordProcessorProps.LineBreakIndexes[p]) {
                    caretLineNo = p;
                    break;
                } else if (wordProcessorProps.CaretPosIndex >
                    wordProcessorProps.LineBreakIndexes[p]) {
                    caretLineNo = p + 1;
                }
            }
        }
        if (caretLineNo - vscrollbarProps.SelectedID + 1 >
            (wordProcessorProps.Height - (wordProcessorProps.Margin * 2))
            / (wordProcessorProps.TextHeight +
                wordProcessorProps.LineSpacingInPixels)) {
            vscrollbarProps.SelectedID = caretLineNo -
                Math.floor((wordProcessorProps.Height -
                    (wordProcessorProps.Margin * 2)) /
                    (wordProcessorProps.TextHeight +
                        wordProcessorProps.LineSpacingInPixels)) + 1;
        } else if (caretLineNo < vscrollbarProps.SelectedID) {
            vscrollbarProps.SelectedID = caretLineNo;
        }
    }
}

var wordProcessorBgImages = new Array();

function setWordProcessorBgImage(wordProcessorProps, image) {
    var found = 0;
    for (var i = 0; i < wordProcessorBgImages.length; i++) {
        if (wordProcessorBgImages[i].CanvasID === wordProcessorProps.CanvasID &&
            wordProcessorBgImages[i].WindowID === wordProcessorProps.WindowID) {
            found = 1;
            wordProcessorBgImages[i].Image = image;
        }
    }
    if (found === 0) {
        wordProcessorBgImages.push({
            CanvasID: wordProcessorProps.CanvasID,
            WindowID: wordProcessorProps.WindowID, Image: image
        });
    }
}

function getWordProcessorImage(wordProcessorProps) {
    for (var i = 0; i < wordProcessorBgImages.length; i++) {
        if (wordProcessorBgImages[i].CanvasID === wordProcessorProps.CanvasID &&
            wordProcessorBgImages[i].WindowID === wordProcessorProps.WindowID) {
            return wordProcessorBgImages[i].Image;
        }
    }
}

function WordProcessor() { }

WordProcessor.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, HasMarkup: null,
    Text: null, TextColor: null, TextHeight: null,
    TextFontString: null, LineSpacingInPixels: null, WordSensitive: null,
    WaterMarkText: null, WaterMarkTextColor: null,
    WaterMarkTextHeight: null, WaterMarkTextFontString: null, MaxChars: null,
    HasShadow: null, ShadowColor: null,
    ShadowOffsetX: null, ShadowOffsetY: null, HasRoundedEdges: null, EdgeRadius: null,
    HasBgGradient: null,
    BgGradientStartColor: null, BgGradientEndColor: null, HasBgImage: null,
    BgImageUrl: null, Margin: null,
    HasBorder: null, BorderColor: null, BorderLineWidth: null, ShowCaret: null,
    CaretColor: null,
    AllowedCharsRegEx: null, CustomKeyboardWindowID: null, ControlNameID: null,
    Depth: null,

    Initialize: function () {
        return createWordProcessor(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height,
            this.Depth, this.HasMarkup, this.Text, this.TextColor, this.TextHeight,
            this.TextFontString,
            this.LineSpacingInPixels, this.WordSensitive, this.WaterMarkText,
            this.WaterMarkTextColor,
            this.WaterMarkTextHeight, this.WaterMarkTextFontString, this.MaxChars,
            this.HasShadow, this.ShadowColor,
            this.ShadowOffsetX, this.ShadowOffsetY, this.HasRoundedEdges,
            this.EdgeRadius, this.HasBgGradient,
            this.BgGradientStartColor, this.BgGradientEndColor, this.HasBgImage,
            this.BgImageUrl, this.Margin,
            this.HasBorder, this.BorderColor, this.BorderLineWidth,
            this.AllowedCharsRegEx, this.CaretColor,
            this.CustomKeyboardWindowID);
    }
}

function createWordProcessor(canvasid, controlNameId, x, y, width, height, depth,
    hasMarkup, text, textColor, textHeight, textFontString, lineSpacingInPixels,
    wordSensitive,
    waterMarkText, waterMarkTextColor, waterMarkTextHeight, waterMarkTextFontString,
    maxChars, hasShadow, shadowColor, shadowOffsetX, shadowOffsetY,
    hasRoundedEdges, edgeRadius, hasBgGradient, bgGradientStartColor,
    bgGradientEndColor, hasBgImage, bgImageUrl, margin, hasBorder, borderColor,
    borderLineWidth,
    allowedCharsRegEx, caretColor, customKeyboardWindowID) {
    var windowid;
    if (hasMarkup === 1) {
        windowid = createWindow(canvasid, x, y + 20, width - 15, height - 20, depth,
            null, 'WordProcessor', controlNameId);
    } else {
        windowid = createWindow(canvasid, x, y, width - 15, height, depth, null,
            'WordProcessor', controlNameId);
    }
    vscrollbarwindowid = createScrollBar(canvasid, controlNameId + 'VS', x + width -
        15, y, height, depth, (textHeight + lineSpacingInPixels) * Math.floor(height /
            textHeight), 1, windowid);
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipod') > -1) {
        if (!customKeyboardWindowID) {
            customKeyboardWindowID = createVirtualKeyboard(canvasid, controlNameId +
                'VKB', x, y + height, 360, 180, depth, null, wordProcessorTouchKeyPress,
                5, 5, 1, 12, '12pt Ariel', null);
        }
    }
    wordProcessorPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, HasMarkup: hasMarkup, Text: text, TextColor: textColor,
        TextHeight: textHeight,
        TextFontString: textFontString, LineSpacingInPixels: lineSpacingInPixels,
        WordSensitive: wordSensitive, WaterMarkText: waterMarkText,
        WaterMarkTextColor: waterMarkTextColor,
        WaterMarkTextHeight: waterMarkTextHeight,
        WaterMarkTextFontString: waterMarkTextFontString, MaxChars: maxChars,
        HasShadow: hasShadow, ShadowColor: shadowColor,
        ShadowOffsetX: shadowOffsetX, ShadowOffsetY: shadowOffsetY,
        HasRoundedEdges: hasRoundedEdges, EdgeRadius: edgeRadius,
        HasBgGradient: hasBgGradient,
        BgGradientStartColor: bgGradientStartColor,
        BgGradientEndColor: bgGradientEndColor, HasBgImage: hasBgImage,
        BgImageUrl: bgImageUrl, Margin: margin,
        HasBorder: hasBorder, BorderColor: borderColor,
        BorderLineWidth: borderLineWidth, UserInputText: '',
        VScrollBarWindowID: vscrollbarwindowid, CaretPosIndex: -1,
        ShowCaret: 0, CaretColor: caretColor, LineBreakIndexes: new Array(),
        SelectedTextStartIndex: -1, SelectedTextEndIndex: -1, MouseDown: 0, WasSelecting: 0,
        AllowedCharsRegEx: allowedCharsRegEx, CaretTime: Date.now(),
        CustomKeyboardWindowID: customKeyboardWindowID
    });
    if (hasBgImage === 1) {
        var image = new Image();
        image.src = bgImageUrl;
        image.onload = function () {
            invalidateRect(canvasid, x, y, width, height);
        };
        setWordProcessorBgImage(getWordProcessorProps(canvasid, windowid), image);
    }
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var wordProcessorProps = getWordProcessorProps(canvasid1, windowid1);
        var vscrollbarProps = getScrollBarProps(canvasid1,
            wordProcessorProps.VScrollBarWindowID);
        var ctx = getCtx(canvasid1);
        ctx.save();
        if (wordProcessorProps.HasBgImage === 1) {
            ctx.drawImage(getWordProcessorImage(wordProcessorProps),
                wordProcessorProps.X, wordProcessorProps.Y);
        } else if (wordProcessorProps.HasBgGradient === 1) {
            var g = ctx.createLinearGradient(wordProcessorProps.X,
                wordProcessorProps.Y, wordProcessorProps.X, wordProcessorProps.Y +
                wordProcessorProps.Height);
            g.addColorStop(0, wordProcessorProps.BgGradientStartColor);
            g.addColorStop(1, wordProcessorProps.BgGradientEndColor);
            ctx.fillStyle = g;
        }
        if (wordProcessorProps.HasRoundedEdges === 1) {
            ctx.beginPath();
            ctx.moveTo(wordProcessorProps.X, wordProcessorProps.Y +
                wordProcessorProps.EdgeRadius);
            ctx.arc(wordProcessorProps.EdgeRadius + wordProcessorProps.X,
                wordProcessorProps.Y + wordProcessorProps.EdgeRadius,
                wordProcessorProps.EdgeRadius,
                Math.PI, (Math.PI / 180) * 270, false);
            ctx.lineTo(wordProcessorProps.X + wordProcessorProps.Width - 15 -
                wordProcessorProps.EdgeRadius, wordProcessorProps.Y);
            ctx.arc(wordProcessorProps.X + wordProcessorProps.Width - 15 -
                wordProcessorProps.EdgeRadius, wordProcessorProps.Y +
                wordProcessorProps.EdgeRadius,
                wordProcessorProps.EdgeRadius, (Math.PI / 180) * 270,
                Math.PI * 2, false);
            ctx.lineTo(wordProcessorProps.X + wordProcessorProps.Width - 15,
                wordProcessorProps.Y + wordProcessorProps.Height -
                wordProcessorProps.EdgeRadius);
            ctx.arc(wordProcessorProps.X + wordProcessorProps.Width - 15 -
                wordProcessorProps.EdgeRadius, wordProcessorProps.Y +
                wordProcessorProps.Height - wordProcessorProps.EdgeRadius,
                wordProcessorProps.EdgeRadius, 0, Math.PI / 2, false);
            ctx.lineTo(wordProcessorProps.X + wordProcessorProps.EdgeRadius,
                wordProcessorProps.Y + wordProcessorProps.Height);
            ctx.arc(wordProcessorProps.X + wordProcessorProps.EdgeRadius,
                wordProcessorProps.Y + wordProcessorProps.Height -
                wordProcessorProps.EdgeRadius,
                wordProcessorProps.EdgeRadius, Math.PI / 2, Math.PI, false);
            ctx.closePath();
            ctx.clip();
            if (wordProcessorProps.HasBgImage === 1 &&
                wordProcessorProps.Image.complete === true) {
                ctx.drawImage(wordProcessorProps.Image, wordProcessorProps.X,
                    wordProcessorProps.Y);
            } else if (wordProcessorProps.HasBgGradient === 1) {
                ctx.fill();
            }
            if (wordProcessorProps.HasBorder === 1) {
                ctx.strokeStyle = wordProcessorProps.BorderColor;
                ctx.lineWidth = wordProcessorProps.BorderLineWidth;
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.rect(wordProcessorProps.X, wordProcessorProps.Y,
                wordProcessorProps.Width - 15, wordProcessorProps.Height);
            ctx.clip();
            if (wordProcessorProps.HasBgImage === 1 &&
                wordProcessorProps.Image.complete === true) {
                ctx.drawImage(wordProcessorProps.Image, wordProcessorProps.X,
                    wordProcessorProps.Y);
            } else if (wordProcessorProps.HasBgGradient === 1) {
                ctx.fill();
            }
            if (wordProcessorProps.HasBorder === 1) {
                ctx.strokeStyle = wordProcessorProps.BorderColor;
                ctx.lineWidth = wordProcessorProps.BorderLineWidth;
                ctx.stroke();
            }
        }
        if (wordProcessorProps.HasMarkup === 0) {
            if (wordProcessorProps.UserInputText &&
                wordProcessorProps.UserInputText.length > 0) {
                ctx.font = wordProcessorProps.TextFontString;
                ctx.fillStyle = wordProcessorProps.TextColor;
                var lastLineBreakIndex = 0;
                if (wordProcessorProps.LineBreakIndexes.length === 0 &&
                    wordProcessorProps.UserInputText &&
                    wordProcessorProps.UserInputText.length > 0) {
                    ctx.fillText(removeTrailingSpacesAndLineBreaks(
                        wordProcessorProps.UserInputText), wordProcessorProps.X +
                        wordProcessorProps.Margin,
                        wordProcessorProps.Y + wordProcessorProps.Margin +
                        wordProcessorProps.TextHeight);
                } else {
                    var i;
                    for (i = vscrollbarProps.SelectedID; i <
                        wordProcessorProps.LineBreakIndexes.length && (i -
                        vscrollbarProps.SelectedID) *
                    (wordProcessorProps.TextHeight +
                            wordProcessorProps.LineSpacingInPixels) <
                        wordProcessorProps.Height - (wordProcessorProps.Margin * 2);
                        i++) {
                        ctx.fillText(removeTrailingSpacesAndLineBreaks(
                            wordProcessorProps.UserInputText.substr((i > 0 ?
                                wordProcessorProps.LineBreakIndexes[i - 1] : 0),
                                wordProcessorProps.LineBreakIndexes[i] -
                                (i > 0 ? wordProcessorProps.LineBreakIndexes[i - 1] : 0))),
                            wordProcessorProps.X + wordProcessorProps.Margin,
                            wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) *
                                (i - vscrollbarProps.SelectedID)));
                    }
                    if (wordProcessorProps.LineBreakIndexes[
                        wordProcessorProps.LineBreakIndexes.length - 1] + 1 <
                        wordProcessorProps.UserInputText.length) {
                        ctx.fillText(removeTrailingSpacesAndLineBreaks(
                            wordProcessorProps.UserInputText.substr(
                                wordProcessorProps.LineBreakIndexes[
                                wordProcessorProps.LineBreakIndexes.length - 1])),
                            wordProcessorProps.X + wordProcessorProps.Margin,
                            wordProcessorProps.Y + wordProcessorProps.Margin +
                            ((i - vscrollbarProps.SelectedID + 1) *
                                (wordProcessorProps.TextHeight +
                                    wordProcessorProps.LineSpacingInPixels)) -
                            wordProcessorProps.LineSpacingInPixels);
                    }
                }
            } else {
                ctx.font = wordProcessorProps.WaterMarkTextFontString;
                ctx.fillStyle = wordProcessorProps.WaterMarkTextColor;
                ctx.fillText(wordProcessorProps.WaterMarkText, wordProcessorProps.X +
                    wordProcessorProps.Margin, wordProcessorProps.Y +
                    wordProcessorProps.Margin + wordProcessorProps.WaterMarkTextHeight);
            }
            if (doesWindowHaveFocus(canvasid1, windowid1) === 1) {
                if (wordProcessorProps.ShowCaret === 1) {
                    if (Date.now() - wordProcessorProps.CaretTime > 250) {
                        wordProcessorProps.ShowCaret = 0;
                        wordProcessorProps.CaretTime = Date.now();
                    }
                    ctx.strokeStyle = wordProcessorProps.CaretColor;
                    ctx.beginPath();
                    var caretLineNo = 0;
                    if (wordProcessorProps.LineBreakIndexes.length > 0) {
                        for (var p = 0; p < wordProcessorProps.LineBreakIndexes.length; p++) {
                            if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                                wordProcessorProps.LineBreakIndexes[p - 1]) &&
                                wordProcessorProps.CaretPosIndex <
                                wordProcessorProps.LineBreakIndexes[p]) {
                                caretLineNo = p;
                                break;
                            } else if (wordProcessorProps.CaretPosIndex >
                                wordProcessorProps.LineBreakIndexes[p]) {
                                caretLineNo = p + 1;
                            }
                        }
                    }
                    if (wordProcessorProps.CaretPosIndex === -1) {
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin,
                            wordProcessorProps.Y + wordProcessorProps.Margin + 4);
                        ctx.lineTo(wordProcessorProps.X + wordProcessorProps.Margin + 3,
                            wordProcessorProps.Y + wordProcessorProps.Margin + 4);
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin,
                            wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight - 4);
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin +
                            3, wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight - 4);
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin +
                            2, wordProcessorProps.Y + wordProcessorProps.Margin + 4);
                        ctx.lineTo(wordProcessorProps.X + wordProcessorProps.Margin + 2,
                            wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight - 4);
                    } else if (wordProcessorProps.CaretPosIndex > -1) {
                        var tempstr = removeTrailingSpacesAndLineBreaks(
                            wordProcessorProps.UserInputText &&
                                wordProcessorProps.UserInputText.length - 1 >=
                                wordProcessorProps.CaretPosIndex ?
                                (caretLineNo > 0 ? wordProcessorProps.UserInputText.substring(
                                    wordProcessorProps.LineBreakIndexes[caretLineNo - 1],
                                    wordProcessorProps.CaretPosIndex + 1) :
                                    wordProcessorProps.UserInputText.substring(0,
                                        wordProcessorProps.CaretPosIndex + 1)) : '');
                        ctx.font = wordProcessorProps.TextFontString;
                        var w = ctx.measureText(tempstr).width;
                        caretLineNo -= getScrollBarProps(canvasid1,
                            wordProcessorProps.VScrollBarWindowID).SelectedID;
                        ctx.moveTo(wordProcessorProps.X +
                            wordProcessorProps.Margin + w, wordProcessorProps.Y +
                            wordProcessorProps.Margin +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) * caretLineNo));
                        ctx.lineTo(wordProcessorProps.X + wordProcessorProps.Margin +
                            3 + w, wordProcessorProps.Y + wordProcessorProps.Margin +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) * caretLineNo));
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin +
                            w, wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) *
                                ((caretLineNo === 0 ? 1 : caretLineNo) - 1)));
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin + 3
                            + w, wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) * caretLineNo));
                        ctx.moveTo(wordProcessorProps.X + wordProcessorProps.Margin + 2 +
                            w, wordProcessorProps.Y + wordProcessorProps.Margin +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) * caretLineNo));
                        ctx.lineTo(wordProcessorProps.X + wordProcessorProps.Margin + 2 +
                            w, wordProcessorProps.Y + wordProcessorProps.Margin +
                            wordProcessorProps.TextHeight +
                            ((wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels) * caretLineNo));
                    }
                    ctx.stroke();
                } else {
                    if (Date.now() - wordProcessorProps.CaretTime > 500) {
                        wordProcessorProps.ShowCaret = 1;
                        wordProcessorProps.CaretTime = Date.now();
                    }
                }
            }
        }
        ctx.restore();
    }, canvasid);
    if (!(navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipod') > -1)) {
        registerKeyDownFunction(canvasid, function (canvasid3, windowid3, e) {
            var wordProcessorProps = getWordProcessorProps(canvasid3, windowid3);
            var skip = false;
            switch (e.keyCode) {
                case 37:
                    //left arrow	 37
                    if (wordProcessorProps.CaretPosIndex > -1) {
                        wordProcessorProps.CaretPosIndex--;
                        wordProcessorProps.SelectedTextStartIndex = -1;
                        wordProcessorProps.SelectedTextEndIndex = -1;
                        wordProcessorProps.WasSelecting = 0;
                        wordProcessorProps.MouseDown = 0;
                    }
                    skip = true;
                    break;
                case 38:
                    //up arrow
                    var caretLineNo = 0;
                    if (wordProcessorProps.LineBreakIndexes.length > 0) {
                        for (var p = 0; p < wordProcessorProps.LineBreakIndexes.length; p++) {
                            if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                                wordProcessorProps.LineBreakIndexes[p - 1]) &&
                                wordProcessorProps.CaretPosIndex <
                                wordProcessorProps.LineBreakIndexes[p]) {
                                caretLineNo = p;
                                break;
                            } else if (wordProcessorProps.CaretPosIndex >
                                wordProcessorProps.LineBreakIndexes[p]) {
                                caretLineNo = p + 1;
                            }
                        }
                        if (caretLineNo > 0) {
                            wordProcessorProps.CaretPosIndex = (caretLineNo === 1 ? 0 :
                                wordProcessorProps.LineBreakIndexes[caretLineNo - 2]) +
                                (wordProcessorProps.CaretPosIndex -
                                    wordProcessorProps.LineBreakIndexes[caretLineNo - 1]);
                        }
                    }
                    skip = true;
                    break;
                case 39:
                    //right arrow	 39
                    if (wordProcessorProps.CaretPosIndex >=
                        wordProcessorProps.UserInputText.length - 1) {
                        wordProcessorProps.CaretPosIndex =
                            wordProcessorProps.UserInputText.length - 1;
                    } else {
                        wordProcessorProps.CaretPosIndex++;
                    }
                    wordProcessorProps.SelectedTextStartIndex = -1;
                    wordProcessorProps.SelectedTextEndIndex = -1;
                    wordProcessorProps.MouseDown = 0;
                    wordProcessorProps.WasSelecting = 0;
                    skip = true;
                    break;
                case 40:
                    //down arrow key
                    var caretLineNo = 0;
                    if (wordProcessorProps.LineBreakIndexes.length > 0) {
                        for (var p = 0; p <
                            wordProcessorProps.LineBreakIndexes.length; p++) {
                            if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                                wordProcessorProps.LineBreakIndexes[p - 1]) &&
                                wordProcessorProps.CaretPosIndex <
                                wordProcessorProps.LineBreakIndexes[p]) {
                                caretLineNo = p;
                                break;
                            } else if (wordProcessorProps.CaretPosIndex >
                                wordProcessorProps.LineBreakIndexes[p]) {
                                caretLineNo = p + 1;
                            }
                        }
                        if (caretLineNo < wordProcessorProps.LineBreakIndexes.length) {
                            wordProcessorProps.CaretPosIndex =
                                wordProcessorProps.LineBreakIndexes[caretLineNo] +
                                (wordProcessorProps.CaretPosIndex - (caretLineNo ==
                                    0 ? 0 : wordProcessorProps.LineBreakIndexes[
                                    caretLineNo - 1]));
                        }
                    }
                    skip = true;
                    break;
                case 46:
                    //delete	 46
                    if (wordProcessorProps.CaretPosIndex <
                        wordProcessorProps.UserInputText.length - 1) {
                        if (wordProcessorProps.CaretPosIndex === -1) {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText.substring(1);
                        } else if (wordProcessorProps.CaretPosIndex ==
                            wordProcessorProps.UserInputText.length - 2) {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText.substring(0,
                                    wordProcessorProps.UserInputText.length - 1);
                        } else {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText.substring(0,
                                    wordProcessorProps.CaretPosIndex + 1) +
                                wordProcessorProps.UserInputText.substring(
                                    wordProcessorProps.CaretPosIndex + 2);
                        }
                        wordProcessorProps.SelectedTextStartIndex = -1;
                        wordProcessorProps.SelectedTextEndIndex = -1;
                        wordProcessorProps.MouseDown = 0;
                        wordProcessorProps.WasSelecting = 0;
                    }
                    skip = true;
                    break;
                case 8:
                    //backspace	 8
                    if (wordProcessorProps.CaretPosIndex > -1) {
                        if (wordProcessorProps.CaretPosIndex === 0) {
                            if (wordProcessorProps.UserInputText.length > 1) {
                                wordProcessorProps.UserInputText =
                                    wordProcessorProps.UserInputText.substring(1,
                                        wordProcessorProps.UserInputText.length - 1);
                            } else {
                                wordProcessorProps.UserInputText = '';
                            }
                            wordProcessorProps.CaretPosIndex = -1;
                        } else if (wordProcessorProps.CaretPosIndex ==
                            wordProcessorProps.UserInputText.length - 1) {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText.substring(0,
                                    wordProcessorProps.UserInputText.length - 1);
                            wordProcessorProps.CaretPosIndex--;
                        } else if (wordProcessorProps.CaretPosIndex > 0) {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText.substring(0,
                                    wordProcessorProps.CaretPosIndex) +
                                wordProcessorProps.UserInputText.substring(
                                    wordProcessorProps.CaretPosIndex + 1);
                            wordProcessorProps.CaretPosIndex--;
                        }
                        wordProcessorProps.SelectedTextStartIndex = -1;
                        wordProcessorProps.SelectedTextEndIndex = -1;
                        wordProcessorProps.MouseDown = 0;
                        wordProcessorProps.WasSelecting = 0;
                    }
                    skip = true;
                    break;
            }
            if (!skip) {
                if (e.ctrlKey && String.fromCharCode(e.keyCode).toLowerCase() === 'a') {
                    wordProcessorProps.SelectedTextStartIndex = 0;
                    wordProcessorProps.SelectedTextEndIndex =
                        wordProcessorProps.UserInputText.length - 1;
                } else if (e.ctrlKey && String.fromCharCode(e.keyCode).toLowerCase() ==
                    'c' && window.clipboardData) {
                    if (wordProcessorProps.SelectedTextStartIndex > -1 &&
                        wordProcessorProps.SelectedTextEndIndex > -1 &&
                        wordProcessorProps.UserInputText &&
                        wordProcessorProps.SelectedTextEndIndex <
                        wordProcessorProps.UserInputText.length) {
                        window.clipboardData.setData('Text', (
                            wordProcessorProps.UserInputText &&
                                wordProcessorProps.SelectedTextEndIndex ==
                                wordProcessorProps.UserInputText.length - 1 ?
                                wordProcessorProps.UserInputText.substring(
                                    wordProcessorProps.SelectedTextStartIndex) :
                                wordProcessorProps.UserInputText.substring(
                                    wordProcessorProps.SelectedTextStartIndex,
                                    wordProcessorProps.SelectedTextEndIndex -
                                wordProcessorProps.SelectedTextStartIndex + 1)));
                    }
                } else if (!wordProcessorProps.UserInputText ||
                    (wordProcessorProps.UserInputText &&
                        wordProcessorProps.UserInputText.length <
                        wordProcessorProps.MaxChars)) {
                    var c = getCharFromKeyCode(e);
                    var foundPossibleMatch;
                    if ((!wordProcessorProps.AllowedCharsRegEx ||
                        wordProcessorProps.AllowedCharsRegEx === null ||
                        wordProcessorProps.AllowedCharsRegEx.length === 0 ||
                        c.match(wordProcessorProps.AllowedCharsRegEx) == c ||
                        c == '\n')) {
                        if (wordProcessorProps.CaretPosIndex === -1) {
                            wordProcessorProps.UserInputText = c +
                                (wordProcessorProps.UserInputText ?
                                    wordProcessorProps.UserInputText : '');
                            wordProcessorProps.CaretPosIndex++;
                        } else if (wordProcessorProps.UserInputText &&
                            wordProcessorProps.CaretPosIndex ==
                            wordProcessorProps.UserInputText.length - 1) {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText + c;
                            wordProcessorProps.CaretPosIndex++;
                        } else if (wordProcessorProps.UserInputText) {
                            wordProcessorProps.UserInputText =
                                wordProcessorProps.UserInputText.substring(0,
                                    wordProcessorProps.CaretPosIndex + 1) + c +
                                wordProcessorProps.UserInputText.substring(
                                    wordProcessorProps.CaretPosIndex + 1);
                            wordProcessorProps.CaretPosIndex++;
                        }
                        wordProcessorProps.SelectedTextStartIndex = -1;
                        wordProcessorProps.SelectedTextEndIndex = -1;
                        wordProcessorProps.MouseDown = 0;
                        wordProcessorProps.WasSelecting = 0;
                    }
                }
            }
            wordProcessorProps.LineBreakIndexes = new Array();
            if (wordProcessorProps.UserInputText &&
                wordProcessorProps.UserInputText.length > 0) {
                var ctx = getCtx(canvasid3);
                if (wordProcessorProps.WordSensitive === 0) {
                    var currStrIndex = 0;
                    var lastLineBreakIndex = 0;
                    while (currStrIndex < wordProcessorProps.UserInputText.length) {
                        if (wordProcessorProps.UserInputText.substr(
                            lastLineBreakIndex, currStrIndex -
                            lastLineBreakIndex + 1) === '\n') {
                            wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                            lastLineBreakIndex = currStrIndex;
                        } else if (ctx.measureText(
                            wordProcessorProps.UserInputText.substr(
                                lastLineBreakIndex, currStrIndex -
                                lastLineBreakIndex + 1)).width +
                            wordProcessorProps.Margin > wordProcessorProps.Width - 15) {
                            wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                            lastLineBreakIndex = currStrIndex;
                        }
                        currStrIndex++;
                    }
                } else {
                    var currStrIndex = 0;
                    var lastLineBreakIndex = 0;
                    var lastSpace = -1;
                    while (currStrIndex < wordProcessorProps.UserInputText.length) {
                        if (wordProcessorProps.UserInputText.substr(currStrIndex, 1) ==
                            '\n') {
                            wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                            lastLineBreakIndex = currStrIndex;
                        } else if (ctx.measureText(
                            wordProcessorProps.UserInputText.substr(
                                lastLineBreakIndex, currStrIndex -
                                lastLineBreakIndex + 1)).width +
                            wordProcessorProps.Margin > wordProcessorProps.Width - 15) {
                            if (lastSpace > -1) {
                                wordProcessorProps.LineBreakIndexes.push(lastSpace);
                                lastLineBreakIndex = lastSpace;
                            } else {
                                wordProcessorProps.LineBreakIndexes.push(currStrIndex);
                                lastLineBreakIndex = currStrIndex;
                            }
                        }
                        currStrIndex++;
                        if (wordProcessorProps.UserInputText.substr(currStrIndex, 1) === ' ') {
                            lastSpace = currStrIndex;
                        }
                    }
                }
                var vscrollbarProps = getScrollBarProps(canvasid3,
                    wordProcessorProps.VScrollBarWindowID);
                vscrollbarProps.MaxItems = wordProcessorProps.LineBreakIndexes.length;
                var caretLineNo = 0;
                if (wordProcessorProps.LineBreakIndexes.length > 0) {
                    for (var p = 0; p < wordProcessorProps.LineBreakIndexes.length; p++) {
                        if ((p === 0 ? true : wordProcessorProps.CaretPosIndex >
                            wordProcessorProps.LineBreakIndexes[p - 1]) &&
                            wordProcessorProps.CaretPosIndex <
                            wordProcessorProps.LineBreakIndexes[p]) {
                            caretLineNo = p;
                            break;
                        } else if (wordProcessorProps.CaretPosIndex >
                            wordProcessorProps.LineBreakIndexes[p]) {
                            caretLineNo = p + 1;
                        }
                    }
                }
                if (caretLineNo - vscrollbarProps.SelectedID + 1 >
                    (wordProcessorProps.Height - (wordProcessorProps.Margin * 2))
                    / (wordProcessorProps.TextHeight +
                        wordProcessorProps.LineSpacingInPixels)) {
                    vscrollbarProps.SelectedID = caretLineNo -
                        Math.floor((wordProcessorProps.Height - (
                            wordProcessorProps.Margin * 2)) / (
                                wordProcessorProps.TextHeight +
                                wordProcessorProps.LineSpacingInPixels)) + 1;
                } else if (caretLineNo < vscrollbarProps.SelectedID) {
                    vscrollbarProps.SelectedID = caretLineNo;
                }
            }
        }, windowid);
    }
    registerClickFunction(windowid, function (canvasid1, windowid1, e) {
        var x = e.calcX;
        var y = e.calcY;
        var wordProcessorProps = getWordProcessorProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        var vscrollbarProps = getScrollBarProps(canvasid1,
            wordProcessorProps.VScrollBarWindowID);
        if (wordProcessorProps.UserInputText.length > 0) {
            var caretLineNo = 0;
            if (wordProcessorProps.LineBreakIndexes.length > 0) {
                for (var i = vscrollbarProps.SelectedID; i <
                    wordProcessorProps.LineBreakIndexes.length; i++) {
                    if (wordProcessorProps.Y + wordProcessorProps.Margin +
                        ((wordProcessorProps.TextHeight +
                            wordProcessorProps.LineSpacingInPixels) * (i -
                                vscrollbarProps.SelectedID + 1)) > y) {
                        break;
                    } else {
                        caretLineNo = i + 1;
                    }
                }
            }
            if (caretLineNo === 0) {
                caretLineNo = vscrollbarProps.SelectedID;
            }
            for (var i = (caretLineNo === 0 ? 0 :
                wordProcessorProps.LineBreakIndexes[caretLineNo - 1]); i < (
                    caretLineNo < wordProcessorProps.LineBreakIndexes.length ?
                        wordProcessorProps.LineBreakIndexes[caretLineNo] :
                        wordProcessorProps.UserInputText.length); i++) {
                if (x > wordProcessorProps.X + wordProcessorProps.Margin +
                    ctx.measureText(wordProcessorProps.UserInputText.substr(
                        (caretLineNo === 0 ? 0 :
                            wordProcessorProps.LineBreakIndexes[caretLineNo - 1]), i -
                        (caretLineNo === 0 ? 0 :
                            wordProcessorProps.LineBreakIndexes[caretLineNo - 1]))).width) {
                    wordProcessorProps.CaretPosIndex = i;
                } else {
                    break;
                }
            }
        }
    }, canvasid);
    registerLostFocusFunction(canvasid, windowid, function (canvasid8, windowid8) {
        var wordProcessorProps = getWordProcessorProps(canvasid8, windowid8);
        if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('ipod') > -1) {
            if (doesWindowHaveFocus(canvasid8,
                wordProcessorProps.CustomKeyboardWindowID) === 0 &&
                doingEventForWindowID !== wordProcessorProps.CustomKeyboardWindowID) {
                setHiddenWindowStatus(canvasid8,
                    wordProcessorProps.CustomKeyboardWindowID, 1);
            } else {
                setHiddenWindowStatus(canvasid8,
                    wordProcessorProps.CustomKeyboardWindowID, 0);
            }
        }
    });
    registerGotFocusFunction(canvasid, windowid, function (canvasid1, windowid1) {
        var wordProcessorProps = getWordProcessorProps(canvasid1, windowid1);
        setHiddenWindowStatus(canvasid1, wordProcessorProps.CustomKeyboardWindowID, 0);
    });
    registerAnimatedWindow(canvasid, windowid);
    return windowid;
}

function removeTrailingSpacesAndLineBreaks(str) {
    while (str.length > 0) {
        if (str.substr(0, 1) === '\n' || str.substr(0, 1) === ' ') {
            str = (1 < str.length ? str.substr(1, str.length - 1) : '');
        } else {
            break;
        }
    }
    return str;
}

function getCharFromKeyCode(e) {
    switch (e.keyCode) {
        case 16:
            return '';
        case 190:
            return e.shiftKey || e.shiftLeft ? '>' : '.';
        case 32:
            return ' ';
        case 13:
            return '\n';
        case 9:
            return '    ';
        case 106:
            return '*';
        case 107:
            return '+';
        case 109:
            return '-';
        case 110:
            return e.shiftKey || e.shiftLeft ? '>' : '.';
        case 111:
            return '/';
        case 186:
            return e.shiftKey || e.shiftLeft ? ':' : ';';
        case 187:
            return e.shiftKey || e.shiftLeft ? '+' : '=';
        case 188:
            return e.shiftKey || e.shiftLeft ? '<' : ',';
        case 189:
            return e.shiftKey || e.shiftLeft ? '_' : '-';
        case 191:
            return e.shiftKey || e.shiftLeft ? '?' : '/';
        case 192:
            return e.shiftKey || e.shiftLeft ? '~' : '`';
        case 219:
            return e.shiftKey || e.shiftLeft ? '{' : '[';
        case 220:
            return e.shiftKey || e.shiftLeft ? '|' : '\\';
        case 221:
            return e.shiftKey || e.shiftLeft ? '}' : ']';
        case 48:
            return e.shiftKey || e.shiftLeft ? ')' : '0';
        case 49:
            return e.shiftKey || e.shiftLeft ? '!' : '1';
        case 50:
            return e.shiftKey || e.shiftLeft ? '@' : '2';
        case 51:
            return e.shiftKey || e.shiftLeft ? '#' : '3';
        case 52:
            return e.shiftKey || e.shiftLeft ? '$' : '4';
        case 53:
            return e.shiftKey || e.shiftLeft ? '%' : '5';
        case 54:
            return e.shiftKey || e.shiftLeft ? '^' : '6';
        case 55:
            return e.shiftKey || e.shiftLeft ? '&' : '7';
        case 56:
            return e.shiftKey || e.shiftLeft ? '*' : '8';
        case 57:
            return e.shiftKey || e.shiftLeft ? '(' : '9';
        case 65:
            return e.shiftKey || e.shiftLeft ? 'A' : 'a';
        case 66:
            return e.shiftKey || e.shiftLeft ? 'B' : 'b';
        case 67:
            return e.shiftKey || e.shiftLeft ? 'C' : 'c';
        case 68:
            return e.shiftKey || e.shiftLeft ? 'D' : 'd';
        case 69:
            return e.shiftKey || e.shiftLeft ? 'E' : 'e';
        case 70:
            return e.shiftKey || e.shiftLeft ? 'F' : 'f';
        case 71:
            return e.shiftKey || e.shiftLeft ? 'G' : 'g';
        case 72:
            return e.shiftKey || e.shiftLeft ? 'H' : 'h';
        case 73:
            return e.shiftKey || e.shiftLeft ? 'I' : 'i';
        case 74:
            return e.shiftKey || e.shiftLeft ? 'J' : 'j';
        case 75:
            return e.shiftKey || e.shiftLeft ? 'K' : 'k';
        case 76:
            return e.shiftKey || e.shiftLeft ? 'L' : 'l';
        case 77:
            return e.shiftKey || e.shiftLeft ? 'M' : 'm';
        case 78:
            return e.shiftKey || e.shiftLeft ? 'N' : 'n';
        case 79:
            return e.shiftKey || e.shiftLeft ? 'O' : 'o';
        case 80:
            return e.shiftKey || e.shiftLeft ? 'P' : 'p';
        case 81:
            return e.shiftKey || e.shiftLeft ? 'Q' : 'q';
        case 82:
            return e.shiftKey || e.shiftLeft ? 'R' : 'r';
        case 83:
            return e.shiftKey || e.shiftLeft ? 'S' : 's';
        case 84:
            return e.shiftKey || e.shiftLeft ? 'T' : 't';
        case 85:
            return e.shiftKey || e.shiftLeft ? 'U' : 'u';
        case 86:
            return e.shiftKey || e.shiftLeft ? 'V' : 'v';
        case 87:
            return e.shiftKey || e.shiftLeft ? 'W' : 'w';
        case 88:
            return e.shiftKey || e.shiftLeft ? 'X' : 'x';
        case 89:
            return e.shiftKey || e.shiftLeft ? 'Y' : 'y';
        case 90:
            return e.shiftKey || e.shiftLeft ? 'Z' : 'z';
        case 222:
            return e.shiftKey || e.shiftLeft ? '"' : '\'';
        default:
            return '';
    }
}

