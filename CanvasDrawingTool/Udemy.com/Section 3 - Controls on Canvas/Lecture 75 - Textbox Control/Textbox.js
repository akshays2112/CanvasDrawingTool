/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Textbox code starts here

var textBoxPropsArray = new Array();

function getTextBoxProps(canvasid, windowid) {
    for (var i = 0; i < textBoxPropsArray.length; i++) {
        if (textBoxPropsArray[i].CanvasID === canvasid &&
            textBoxPropsArray[i].WindowID === windowid) {
            return textBoxPropsArray[i];
        }
    }
}

function getTextBoxPropsByDropDownWindowID(canvasid, windowid) {
    for (var i = 0; i < textBoxPropsArray.length; i++) {
        if (textBoxPropsArray[i].CanvasID === canvasid &&
            textBoxPropsArray[i].DropDownWindowID === windowid) {
            return textBoxPropsArray[i];
        }
    }
}

function getTextBoxPropsByKeyboardID(canvasid, windowid) {
    for (var i = 0; i < textBoxPropsArray.length; i++) {
        if (textBoxPropsArray[i].CanvasID === canvasid &&
            textBoxPropsArray[i].CustomKeyboardWindowID === windowid) {
            return textBoxPropsArray[i];
        }
    }
}

function textBoxTouchKeyPress(canvasid, windowid, keyboardChar) {
    var textBoxProps = getTextBoxPropsByKeyboardID(canvasid, windowid);
    switch (keyboardChar.toLowerCase()) {
        case 'left':
            //left arrow	 37
            if (textBoxProps.CaretPosIndex > -1) {
                textBoxProps.CaretPosIndex--;
                textBoxProps.SelectedTextStartIndex = -1;
                textBoxProps.SelectedTextEndIndex = -1;
                textBoxProps.WasSelecting = 0;
                textBoxProps.MouseDown = 0;
            }
            invalidateRect(canvasid, null, textBoxProps.X, textBoxProps.Y,
                textBoxProps.Width, textBoxProps.Height);
            return;
        case 'right':
            //right arrow	 39
            if (textBoxProps.CaretPosIndex > textBoxProps.UserInputText.length - 1) {
                textBoxProps.CaretPosIndex = textBoxProps.UserInputText.length - 1;
            } else {
                textBoxProps.CaretPosIndex++;
            }
            textBoxProps.SelectedTextStartIndex = -1;
            textBoxProps.SelectedTextEndIndex = -1;
            textBoxProps.MouseDown = 0;
            textBoxProps.WasSelecting = 0;
            invalidateRect(canvasid, null, textBoxProps.X, textBoxProps.Y,
                textBoxProps.Width, textBoxProps.Height);
            return;
        case 'backspacekey':
            //backspace	 8
            if (textBoxProps.CaretPosIndex > -1) {
                if (textBoxProps.CaretPosIndex === 0) {
                    if (textBoxProps.UserInputText.length > 1) {
                        textBoxProps.UserInputText =
                            textBoxProps.UserInputText.substring(1,
                                textBoxProps.UserInputText.length - 1);
                    } else {
                        textBoxProps.UserInputText = '';
                    }
                    textBoxProps.CaretPosIndex = -1;
                } else if (textBoxProps.CaretPosIndex ==
                    textBoxProps.UserInputText.length - 1) {
                    textBoxProps.UserInputText = textBoxProps.UserInputText.substring(0,
                        textBoxProps.UserInputText.length - 1);
                    textBoxProps.CaretPosIndex--;
                } else if (textBoxProps.CaretPosIndex > 0) {
                    textBoxProps.UserInputText = textBoxProps.UserInputText.substring(0,
                        textBoxProps.CaretPosIndex) +
                        textBoxProps.UserInputText.substring(
                            textBoxProps.CaretPosIndex + 1);
                    textBoxProps.CaretPosIndex--;
                }
                textBoxProps.SelectedTextStartIndex = -1;
                textBoxProps.SelectedTextEndIndex = -1;
                textBoxProps.MouseDown = 0;
                textBoxProps.WasSelecting = 0;
            }
            if (textBoxProps.ListPossiblesAllChoices !== null) {
                FindTextBoxPossible(textBoxProps, c);
            }
            invalidateRect(canvasid, null, textBoxProps.X, textBoxProps.Y,
                textBoxProps.Width, textBoxProps.Height);
            return;
        case 'spacebarkey':
            keyboardChar = ' ';
            break;
        case 'carriagereturnkey':
            return;
    }
    if (!textBoxProps.UserInputText || (textBoxProps.UserInputText &&
        textBoxProps.UserInputText.length < textBoxProps.MaxChars)) {
        var c = keyboardChar;
        var foundPossibleMatch;
        if (textBoxProps.ListPossiblesAllChoices !== null) {
            foundPossibleMatch = FindTextBoxPossible(textBoxProps, c);
        }
        if ((!textBoxProps.AllowedCharsRegEx || textBoxProps.AllowedCharsRegEx ==
            null || textBoxProps.AllowedCharsRegEx.length === 0 ||
            c.match(textBoxProps.AllowedCharsRegEx) === c) &&
            (!textBoxProps.LimitToListPossibles ||
                (textBoxProps.LimitToListPossibles === 1 && foundPossibleMatch))) {
            if (textBoxProps.CaretPosIndex === -1) {
                textBoxProps.UserInputText = c + (textBoxProps.UserInputText ?
                    textBoxProps.UserInputText : '');
                textBoxProps.CaretPosIndex++;
            } else if (textBoxProps.UserInputText && textBoxProps.CaretPosIndex ==
                textBoxProps.UserInputText.length - 1) {
                textBoxProps.UserInputText = textBoxProps.UserInputText + c;
                textBoxProps.CaretPosIndex++;
            } else if (textBoxProps.UserInputText) {
                textBoxProps.UserInputText = textBoxProps.UserInputText.substring(0,
                    textBoxProps.CaretPosIndex + 1) + c +
                    textBoxProps.UserInputText.substring(textBoxProps.CaretPosIndex + 1);
                textBoxProps.CaretPosIndex++;
            }
            textBoxProps.SelectedTextStartIndex = -1;
            textBoxProps.SelectedTextEndIndex = -1;
            textBoxProps.MouseDown = 0;
            textBoxProps.WasSelecting = 0;
        }
    }
    invalidateRect(canvasid, null, textBoxProps.X, textBoxProps.Y, textBoxProps.Width,
        textBoxProps.Height);
}

var textBoxImages = new Array();

function setTextBoxImage(textBoxProps, image) {
    var found = 0;
    for (var i = 0; i < textBoxImages.length; i++) {
        if (textBoxImages[i].CanvasID === textBoxProps.CanvasID &&
            textBoxImages[i].WindowID === textBoxProps.WindowID) {
            found = 1;
            textBoxImages[i].Image = image;
        }
    }
    if (found === 0) {
        textBoxImages.push({
            CanvasID: textBoxProps.CanvasID, WindowID:
                textBoxProps.WindowID, Image: image
        });
    }
}

function getTextBoxImage(textBoxProps) {
    for (var i = 0; i < textBoxImages.length; i++) {
        if (textBoxImages[i].CanvasID === textBoxProps.CanvasID &&
            textBoxImages[i].WindowID === textBoxProps.WindowID) {
            return textBoxImages[i].Image;
        }
    }
}

function Textbox() { }

Textbox.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, WaterMarkText: null,
    WaterMarkTextColor: null, WaterMarkTextFontString: null, TextColor: null,
    TextHeight: null,
    TextFontString: null, MaxChars: null, AllowedCharsRegEx: null, IsPassword: null,
    PasswordChar: null,
    HasBorder: null, BorderColor: null, BorderLineWidth: null, HasShadow: null,
    ShadowOffsetX: null, ShadowOffsetY: null,
    ShadowBlurValue: null, HasRoundedEdges: null, EdgeRadius: null,
    HasBgGradient: null, BgGradientStartColor: null,
    BgGradientEndColor: null, HasBgImage: null, BgImageUrl: null,
    HasAutoComplete: null, ListPossibles: null,
    DropDownPossiblesListIfThereIsInputText: null, LimitToListPossibles: null,
    ListPossiblesTextHeight: null,
    ListPossiblesTextFontString: null, UserInputText: null, ShadowColor: null,
    ShowCaret: null, CaretColor: null,
    TextSelectionBgColor: null, Tag: null, DropDownWindowID: null,
    ListPossiblesTextColor: null, VScrollBarWindowID: null,
    ListPossiblesAllChoices: null, CustomKeyboardWindowID: null,
    ControlNameID: null, Depth: null, HasFocusInitially: null,
    WaterMarkTextHeight: null, TabStopIndex: null,

    Initialize: function () {
        return createTextBox(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.WaterMarkText, this.WaterMarkTextColor, this.WaterMarkTextHeight,
            this.WaterMarkTextFontString, this.TextColor,
            this.TextHeight, this.TextFontString, this.MaxChars,
            this.AllowedCharsRegEx, this.IsPassword, this.PasswordChar,
            this.HasBorder, this.BorderColor, this.BorderLineWidth, this.HasShadow,
            this.ShadowColor, this.ShadowOffsetX,
            this.ShadowOffsetY, this.ShadowBlurValue, this.HasRoundedEdges,
            this.EdgeRadius, this.HasBgGradient,
            this.BgGradientStartColor, this.BgGradientEndColor, this.HasBgImage,
            this.BgImageUrl, this.HasAutoComplete,
            this.ListPossibles, this.DropDownPossiblesListIfThereIsInputText,
            this.LimitToListPossibles,
            this.ListPossiblesTextColor, this.ListPossiblesTextHeight,
            this.ListPossiblesTextFontString, this.UserInputText,
            this.CaretColor, this.TextSelectionBgColor, this.HasFocusInitially,
            this.Tag, this.CustomKeyboardWindowID, this.TabStopIndex);
    }
}

function createTextBox(canvasid, controlNameId, x, y, width, height, depth,
    waterMarkText, waterMarkTextColor, waterMarkTextHeight, waterMarkTextFontString,
    textColor, textHeight, textFontString, maxChars, allowedCharsRegEx, isPassword,
    passwordChar, hasBorder, borderColor,
    borderLineWidth, hasShadow, shadowColor, shadowOffsetX, shadowOffsetY,
    shadowBlurValue, hasRoundedEdges, edgeRadius,
    hasBgGradient, bgGradientStartColor, bgGradientEndColor, hasBgImage, bgImageUrl,
    hasAutoComplete, listPossibles,
    dropDownPossiblesListIfThereIsInputText, limitToListPossibles,
    listPossiblesTextColor, listPossiblesTextHeight,
    listPossiblesTextFontString, initialText, caretColor, textSelectionBgColor,
    hasFocusInitially, tag, customKeyboardWindowID, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'TextBox', controlNameId, null, tabstopindex);
    var dropdownwindowid, vscrollbarwindowid;
    if (hasAutoComplete === 1) {
        dropdownwindowid = createWindow(canvasid, x, y + height, width, 100,
            depth, null, 'TextBoxDropDown', controlNameId + 'TextBoxDropDown');
        vscrollbarwindowid = createScrollBar(canvasid, controlNameId + 'VS', x +
            width - 15, y + height, 100, depth, listPossibles.length, 1, windowid);
        registerHiddenWindow(canvasid, dropdownwindowid, 1);
        registerModalWindow(canvasid, dropdownwindowid);
        registerHiddenWindow(canvasid, vscrollbarwindowid, 1);
        registerModalWindow(canvasid, vscrollbarwindowid);
        registerWindowDrawFunction(dropdownwindowid, function (canvasid9, windowid9) {
            var textBoxProps = getTextBoxPropsByDropDownWindowID(canvasid9, windowid9);
            var vscrollBarProps = getScrollBarProps(canvasid9,
                textBoxProps.VScrollBarWindowID);
            var ctx = getCtx(canvasid9);
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.rect(textBoxProps.X, textBoxProps.Y + textBoxProps.Height,
                textBoxProps.Width - 15, 100);
            ctx.fill();
            ctx.fillStyle = textBoxProps.ListPossiblesTextColor;
            ctx.font = textBoxProps.ListPossiblesTextFontString;
            for (var i = vscrollBarProps.SelectedID; i <
                textBoxProps.ListPossibles.length &&
                ((textBoxProps.ListPossiblesTextHeight + 6) *
                (i - vscrollBarProps.SelectedID + 1)) < 100; i++) {
                ctx.fillText(textBoxProps.ListPossibles[i], textBoxProps.X + 5,
                    textBoxProps.Y + textBoxProps.Height +
                    ((textBoxProps.ListPossiblesTextHeight + 6) * (i -
                        vscrollBarProps.SelectedID + 1)));
            }
            ctx.strokeStyle = '#b7bfc8';
            ctx.beginPath();
            ctx.rect(textBoxProps.X, textBoxProps.Y + textBoxProps.Height,
                textBoxProps.Width - 15, 100);
            ctx.stroke();
        }, canvasid);
        registerClickFunction(dropdownwindowid, function (canvasid10, windowid10, e) {
            var textBoxProps = getTextBoxPropsByDropDownWindowID(canvasid10, windowid10);
            var vscrollBarProps = getScrollBarProps(canvasid10,
                textBoxProps.VScrollBarWindowID);
            var x = e.calcX;
            var y = e.calcY;
            for (var i = vscrollBarProps.SelectedID; i <
                textBoxProps.ListPossibles.length &&
                ((textBoxProps.ListPossiblesTextHeight + 6) *
                    (i - vscrollBarProps.SelectedID + 1)) < 100; i++) {
                if (x > textBoxProps.X && y > textBoxProps.Y + textBoxProps.Height +
                    ((textBoxProps.ListPossiblesTextHeight + 6) * (i -
                        vscrollBarProps.SelectedID)) &&
                    x < textBoxProps.X + textBoxProps.Width - 15 && y <
                textBoxProps.Y + textBoxProps.Height +
                ((textBoxProps.ListPossiblesTextHeight + 6) *
                        (i - vscrollBarProps.SelectedID + 1))) {
                    if (textBoxProps.ListPossiblesSelectedID !== i) {
                        textBoxProps.ListPossiblesSelectedID = i;
                        textBoxProps.UserInputText = textBoxProps.ListPossibles[i];
                        setHiddenWindowStatus(canvasid, textBoxProps.VScrollBarWindowID, 1);
                        setHiddenWindowStatus(canvasid, textBoxProps.DropDownWindowID, 1);
                    }
                    return;
                }
            }
        }, canvasid);
    }
    if (hasFocusInitially === 1) {
        setFocusToWindowID(canvasid, windowid);
    }
    if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipod') > -1) {
        if (!customKeyboardWindowID) {
            customKeyboardWindowID = createVirtualKeyboard(canvasid, controlNameId +
                'VKB', x, y + height, 360, 180, depth, null, textBoxTouchKeyPress,
                5, 5, 1, 12, '12pt Ariel', null);
            registerModalWindow(canvasid, customKeyboardWindowID);
            registerHiddenWindow(canvasid, customKeyboardWindowID, 0);
        }
    }
    textBoxPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, WaterMarkText: waterMarkText,
        WaterMarkTextColor: waterMarkTextColor,
        WaterMarkTextFontString: waterMarkTextFontString, TextColor: textColor,
        TextHeight: textHeight,
        TextFontString: textFontString, MaxChars: maxChars,
        AllowedCharsRegEx: allowedCharsRegEx, IsPassword: isPassword,
        PasswordChar: passwordChar,
        HasBorder: hasBorder, BorderColor: borderColor, BorderLineWidth: borderLineWidth,
        HasShadow: hasShadow, ShadowOffsetX: shadowOffsetX, ShadowOffsetY: shadowOffsetY,
        ShadowBlurValue: shadowBlurValue, HasRoundedEdges: hasRoundedEdges,
        EdgeRadius: edgeRadius, HasBgGradient: hasBgGradient,
        BgGradientStartColor: bgGradientStartColor,
        BgGradientEndColor: bgGradientEndColor, HasBgImage: hasBgImage,
        BgImageUrl: bgImageUrl, HasAutoComplete: hasAutoComplete,
        ListPossibles: new Array(),
        DropDownPossiblesListIfThereIsInputText: dropDownPossiblesListIfThereIsInputText,
        LimitToListPossibles: limitToListPossibles,
        ListPossiblesTextHeight: listPossiblesTextHeight,
        ListPossiblesTextFontString: listPossiblesTextFontString, CaretPosIndex: -1,
        UserInputText: initialText, ShadowColor: shadowColor, ShowCaret: 0,
        CaretColor: caretColor,
        SelectedTextStartIndex: -1, SelectedTextEndIndex: -1,
        TextSelectionBgColor: textSelectionBgColor, MouseDown: 0, WasSelecting: 0,
        MouseDownTime: 0, Tag: tag,
        DropDownWindowID: dropdownwindowid, ListPossiblesTextColor: listPossiblesTextColor,
        VScrollBarWindowID: vscrollbarwindowid, ListPossiblesSelectedID: -1,
        ListPossiblesAllChoices: listPossibles, CaretTime: Date.now(),
        CustomKeyboardWindowID: customKeyboardWindowID, TabStopIndex: tabstopindex
    });
    if (hasBgImage === 1) {
        var image = new Image(width, height);
        image.src = bgImageUrl;
        image.onload = function () {
            invalidateRect(canvasid, null, x, y, width, height);
        };
        setTextBoxImage(getTextBoxProps(canvasid, windowid), image);
    }
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var textBoxProps = getTextBoxProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        ctx.save();
        if (textBoxProps.HasBgGradient) {
            var g = ctx.createLinearGradient(textBoxProps.X, textBoxProps.Y,
                textBoxProps.X, textBoxProps.Y + textBoxProps.Height);
            g.addColorStop(0.0, textBoxProps.BgGradientStartColor);
            g.addColorStop(1.0, textBoxProps.BgGradientEndColor);
            ctx.fillStyle = g;
        } else {
            ctx.fillStyle = '#FFFFFF';
        }
        if (textBoxProps.HasShadow) {
            ctx.shadowBlur = textBoxProps.ShadowBlurValue;
            ctx.shadowColor = textBoxProps.ShadowColor;
            ctx.shadowOffsetX = textBoxProps.ShadowOffsetX;
            ctx.shadowOffsetY = textBoxProps.ShadowOffsetY;
        }
        if (textBoxProps.HasBgImage === 1) {
            var image = getTextBoxImage(textBoxProps);
            ctx.drawImage(image, 0, 0, image.width, image.height, textBoxProps.X,
                textBoxProps.Y, textBoxProps.Width, textBoxProps.Height);
        } else {
            ctx.beginPath();
            if (textBoxProps.HasRoundedEdges === 1) {
                ctx.moveTo(textBoxProps.X, textBoxProps.Y + textBoxProps.EdgeRadius);
                ctx.arc(textBoxProps.X + textBoxProps.EdgeRadius, textBoxProps.Y +
                    textBoxProps.EdgeRadius, textBoxProps.EdgeRadius, Math.PI,
                    (Math.PI / 180) * 270, false);
                ctx.lineTo(textBoxProps.X + textBoxProps.Width - textBoxProps.EdgeRadius,
                    textBoxProps.Y);
                ctx.arc(textBoxProps.X + textBoxProps.Width - textBoxProps.EdgeRadius,
                    textBoxProps.Y + textBoxProps.EdgeRadius, textBoxProps.EdgeRadius,
                    (Math.PI / 180) * 270, Math.PI * 2, false);
                ctx.lineTo(textBoxProps.X + textBoxProps.Width, textBoxProps.Y +
                    textBoxProps.Height - textBoxProps.EdgeRadius);
                ctx.arc(textBoxProps.X + textBoxProps.Width - textBoxProps.EdgeRadius,
                    textBoxProps.Y + textBoxProps.Height - textBoxProps.EdgeRadius,
                    textBoxProps.EdgeRadius, 0, Math.PI / 2, false);
                ctx.lineTo(textBoxProps.X + textBoxProps.EdgeRadius, textBoxProps.Y +
                    textBoxProps.Height);
                ctx.arc(textBoxProps.X + textBoxProps.EdgeRadius, textBoxProps.Y +
                    textBoxProps.Height - textBoxProps.EdgeRadius,
                    textBoxProps.EdgeRadius, Math.PI / 2, Math.PI, false);
                ctx.closePath();
            } else {
                ctx.rect(textBoxProps.X, textBoxProps.Y, textBoxProps.Width,
                    textBoxProps.Height);
            }
            ctx.fill();
        }
        ctx.restore();
        if (textBoxProps.HasBorder === 1) {
            ctx.strokeStyle = textBoxProps.BorderColor;
            ctx.lineWidth = textBoxProps.BorderLineWidth;
            ctx.beginPath();
            if (textBoxProps.HasRoundedEdges === 1) {
                ctx.moveTo(textBoxProps.X, textBoxProps.Y + textBoxProps.EdgeRadius);
                ctx.arc(textBoxProps.X + textBoxProps.EdgeRadius, textBoxProps.Y +
                    textBoxProps.EdgeRadius, textBoxProps.EdgeRadius, Math.PI,
                    (Math.PI / 180) * 270, false);
                ctx.lineTo(textBoxProps.X + textBoxProps.Width - textBoxProps.EdgeRadius,
                    textBoxProps.Y);
                ctx.arc(textBoxProps.X + textBoxProps.Width - textBoxProps.EdgeRadius,
                    textBoxProps.Y + textBoxProps.EdgeRadius, textBoxProps.EdgeRadius,
                    (Math.PI / 180) * 270, Math.PI * 2, false);
                ctx.lineTo(textBoxProps.X + textBoxProps.Width, textBoxProps.Y +
                    textBoxProps.Height - textBoxProps.EdgeRadius);
                ctx.arc(textBoxProps.X + textBoxProps.Width - textBoxProps.EdgeRadius,
                    textBoxProps.Y + textBoxProps.Height - textBoxProps.EdgeRadius,
                    textBoxProps.EdgeRadius, 0, Math.PI / 2, false);
                ctx.lineTo(textBoxProps.X + textBoxProps.EdgeRadius, textBoxProps.Y +
                    textBoxProps.Height);
                ctx.arc(textBoxProps.X + textBoxProps.EdgeRadius, textBoxProps.Y +
                    textBoxProps.Height - textBoxProps.EdgeRadius, textBoxProps.EdgeRadius,
                    Math.PI / 2, Math.PI, false);
                ctx.closePath();
            } else {
                ctx.rect(textBoxProps.X, textBoxProps.Y, textBoxProps.Width,
                    textBoxProps.Height);
            }
            ctx.stroke();
        }
        if (textBoxProps.UserInputText && textBoxProps.UserInputText.length > 0) {
            ctx.fillStyle = textBoxProps.TextColor;
            ctx.font = textBoxProps.TextFontString;
            if (textBoxProps.IsPassword === 1) {
                var tmpstr = '';
                for (var i = 0; i < textBoxProps.UserInputText.length; i++) {
                    tmpstr += textBoxProps.PasswordChar;
                }
                ctx.fillText(tmpstr, textBoxProps.X + 4, textBoxProps.Y +
                    textBoxProps.Height - ((textBoxProps.Height -
                        textBoxProps.TextHeight) / 2));
            } else {
                if (textBoxProps.SelectedTextStartIndex > -1 &&
                    textBoxProps.SelectedTextEndIndex > -1) {
                    ctx.fillStyle = textBoxProps.TextSelectionBgColor;
                    var tmptxt = (textBoxProps.SelectedTextEndIndex ==
                        textBoxProps.UserInputText.length - 1 ?
                        textBoxProps.UserInputText.substring(
                            textBoxProps.SelectedTextStartIndex) :
                        textBoxProps.UserInputText.substring(
                            textBoxProps.SelectedTextStartIndex,
                            textBoxProps.SelectedTextEndIndex -
                            textBoxProps.SelectedTextStartIndex + 1));
                    var txtwidth = ctx.measureText(tmptxt).width;
                    var xoffset = (textBoxProps.SelectedTextStartIndex === 0 ? 0 :
                        ctx.measureText(textBoxProps.UserInputText.substring(0,
                            textBoxProps.SelectedTextStartIndex + 1)).width);
                    ctx.beginPath();
                    if (xoffset + txtwidth + 8 > textBoxProps.Width) {
                        ctx.rect(textBoxProps.X + xoffset + 4, textBoxProps.Y +
                            ((textBoxProps.Height - textBoxProps.TextHeight) / 2),
                            textBoxProps.Width - xoffset, textBoxProps.TextHeight);
                    } else {
                        ctx.rect(textBoxProps.X + xoffset + 4, textBoxProps.Y +
                            ((textBoxProps.Height - textBoxProps.TextHeight) / 2),
                            txtwidth, textBoxProps.TextHeight);
                    }
                    ctx.fill();
                }
                ctx.fillStyle = textBoxProps.TextColor;
                ctx.fillText(textBoxProps.UserInputText, textBoxProps.X + 4,
                    textBoxProps.Y + textBoxProps.Height - ((textBoxProps.Height -
                        textBoxProps.TextHeight) / 2));
            }
        } else if (textBoxProps.WaterMarkText && textBoxProps.WaterMarkText.length > 0) {
            ctx.fillStyle = textBoxProps.WaterMarkTextColor;
            ctx.font = textBoxProps.WaterMarkTextFontString;
            ctx.fillText(textBoxProps.WaterMarkText, textBoxProps.X + 4,
                textBoxProps.Y + textBoxProps.Height - ((textBoxProps.Height -
                    textBoxProps.TextHeight) / 2));
        }
        if (doesWindowHaveFocus(canvasid1, windowid1) === 1) {
            if (textBoxProps.ShowCaret === 1) {
                if (Date.now() - textBoxProps.CaretTime > 250) {
                    textBoxProps.ShowCaret = 0;
                    textBoxProps.CaretTime = Date.now();
                }
                ctx.strokeStyle = textBoxProps.CaretColor;
                ctx.beginPath();
                if (textBoxProps.CaretPosIndex === -1) {
                    ctx.moveTo(textBoxProps.X, textBoxProps.Y + 4);
                    ctx.lineTo(textBoxProps.X + 3, textBoxProps.Y + 4);
                    ctx.moveTo(textBoxProps.X, textBoxProps.Y + textBoxProps.Height - 4);
                    ctx.moveTo(textBoxProps.X + 3, textBoxProps.Y +
                        textBoxProps.Height - 4);
                    ctx.moveTo(textBoxProps.X + 2, textBoxProps.Y + 4);
                    ctx.lineTo(textBoxProps.X + 2, textBoxProps.Y +
                        textBoxProps.Height - 4);
                } else if (textBoxProps.CaretPosIndex > -1) {
                    var tempstr = (textBoxProps.UserInputText &&
                        textBoxProps.UserInputText.length - 1 >=
                        textBoxProps.CaretPosIndex ?
                        (textBoxProps.IsPassword === 1 ? repeatPasswordChar(
                            textBoxProps.PasswordChar, textBoxProps.UserInputText.length) :
                            textBoxProps.UserInputText.substring(0,
                                textBoxProps.CaretPosIndex + 1)) :
                        '');
                    ctx.font = textBoxProps.TextFontString;
                    var w = ctx.measureText(tempstr).width;
                    ctx.moveTo(textBoxProps.X + w, textBoxProps.Y + 4);
                    ctx.lineTo(textBoxProps.X + 3 + w, textBoxProps.Y + 4);
                    ctx.moveTo(textBoxProps.X + w, textBoxProps.Y + textBoxProps.Height - 4);
                    ctx.moveTo(textBoxProps.X + 3 + w, textBoxProps.Y +
                        textBoxProps.Height - 4);
                    ctx.moveTo(textBoxProps.X + 2 + w, textBoxProps.Y + 4);
                    ctx.lineTo(textBoxProps.X + 2 + w, textBoxProps.Y +
                        textBoxProps.Height - 4);
                }
                ctx.stroke();
            } else {
                if (Date.now() - textBoxProps.CaretTime > 500) {
                    textBoxProps.ShowCaret = 1;
                    textBoxProps.CaretTime = Date.now();
                }
            }
        }
    }, canvasid);
    registerMouseDownFunction(windowid, function (canvasid4, windowid4, e) {
        var textBoxProps = getTextBoxProps(canvasid4, windowid4);
        if (textBoxProps.UserInputText && textBoxProps.UserInputText.length > 0) {
            textBoxProps.MouseDown = 1;
            textBoxProps.MouseDownTime = (new Date()).getTime();
            var x = e.calcX;
            var ctx = getCtx(canvasid4);
            ctx.font = textBoxProps.TextFontString;
            if (x > textBoxProps.X && x < textBoxProps.X + 4) {
                textBoxProps.SelectedTextStartIndex = -1;
            } else if (x > textBoxProps.X + ctx.measureText(
                textBoxProps.UserInputText).width + 4) {
                textBoxProps.SelectedTextStartIndex = textBoxProps.UserInputText.length - 1;
            } else {
                var letterExtents = new Array();
                var lastWidth = 0;
                for (var i = 0; i < textBoxProps.UserInputText.length; i++) {
                    var currWidth = ctx.measureText(
                        textBoxProps.UserInputText.substring(0, i + 1)).width;
                    letterExtents.push({ Width: currWidth - lastWidth });
                    lastWidth = currWidth;
                }
                if (x > textBoxProps.X + 4 && x < textBoxProps.X + letterExtents[0].Width) {
                    textBoxProps.SelectedTextStartIndex = 0;
                } else {
                    var lastWidth = letterExtents[0].Width;
                    for (var i = 1; i < letterExtents.length; i++) {
                        if (x > textBoxProps.X + lastWidth && x < textBoxProps.X +
                            lastWidth + letterExtents[i].Width) {
                            textBoxProps.SelectedTextStartIndex = i;
                            break;
                        }
                        lastWidth += letterExtents[i].Width;
                    }
                }
            }
            if (textBoxProps.SelectedTextStartIndex > textBoxProps.SelectedTextEndIndex) {
                var tmp = textBoxProps.SelectedTextStartIndex;
                textBoxProps.SelectedTextStartIndex = textBoxProps.SelectedTextEndIndex;
                textBoxProps.SelectedTextEndIndex = tmp;
            }
        }
    }, canvasid);
    registerMouseMoveFunction(windowid, function (canvasid5, windowid5, e) {
        var textBoxProps = getTextBoxProps(canvasid5, windowid5);
        if (textBoxProps.MouseDown === 1 && (new Date()).getTime() -
            textBoxProps.MouseDownTime > 500 && textBoxProps.UserInputText &&
            textBoxProps.UserInputText.length > 0) {
            var x = e.calcX;
            var ctx = getCtx(canvasid5);
            ctx.font = textBoxProps.TextFontString;
            if (x > textBoxProps.X && x < textBoxProps.X + 4) {
                textBoxProps.SelectedTextEndIndex = -1;
            } else if (x > textBoxProps.X + ctx.measureText(
                textBoxProps.UserInputText).width + 4) {
                textBoxProps.SelectedTextEndIndex = textBoxProps.UserInputText.length - 1;
            } else {
                var letterExtents = new Array();
                var lastWidth = 0;
                for (var i = 0; i < textBoxProps.UserInputText.length; i++) {
                    var currWidth = ctx.measureText(
                        textBoxProps.UserInputText.substring(0, i + 1)).width;
                    letterExtents.push({ Width: currWidth - lastWidth });
                    lastWidth = currWidth;
                }
                if (x > textBoxProps.X + 4 && x < textBoxProps.X + letterExtents[0].Width) {
                    textBoxProps.SelectedTextEndIndex = 0;
                } else {
                    var lastWidth = letterExtents[0].Width;
                    for (var i = 1; i < letterExtents.length; i++) {
                        if (x > textBoxProps.X + lastWidth && x < textBoxProps.X +
                            lastWidth + letterExtents[i].Width) {
                            textBoxProps.SelectedTextEndIndex = i;
                            break;
                        }
                        lastWidth += letterExtents[i].Width;
                    }
                }
            }
            if (textBoxProps.SelectedTextStartIndex > textBoxProps.SelectedTextEndIndex) {
                var tmp = textBoxProps.SelectedTextStartIndex;
                textBoxProps.SelectedTextStartIndex = textBoxProps.SelectedTextEndIndex;
                textBoxProps.SelectedTextEndIndex = tmp;
            }
        }
    }, canvasid);
    registerMouseUpFunction(windowid, function (canvasid6, windowid6, e) {
        var textBoxProps = getTextBoxProps(canvasid6, windowid6);
        if (textBoxProps.MouseDown === 1) {
            textBoxProps.MouseDown = 0;
            if ((new Date()).getTime() - textBoxProps.MouseDownTime > 500) {
                if (textBoxProps.UserInputText && textBoxProps.UserInputText.length > 0) {
                    textBoxProps.WasSelecting = 1;
                    var x = e.calcX;
                    var ctx = getCtx(canvasid6);
                    ctx.font = textBoxProps.TextFontString;
                    if (x > textBoxProps.X && x < textBoxProps.X + 4) {
                        textBoxProps.SelectedTextEndIndex = -1;
                    } else if (x > textBoxProps.X +
                        ctx.measureText(textBoxProps.UserInputText).width + 4) {
                        textBoxProps.SelectedTextEndIndex =
                            textBoxProps.UserInputText.length - 1;
                    } else {
                        var letterExtents = new Array();
                        var lastWidth = 0;
                        for (var i = 0; i < textBoxProps.UserInputText.length; i++) {
                            var currWidth = ctx.measureText(
                                textBoxProps.UserInputText.substring(0, i + 1)).width;
                            letterExtents.push({ Width: currWidth - lastWidth });
                            lastWidth = currWidth;
                        }
                        if (x > textBoxProps.X + 4 && x < textBoxProps.X +
                            letterExtents[0].Width) {
                            textBoxProps.SelectedTextEndIndex = 0;
                        } else {
                            var lastWidth = letterExtents[0].Width;
                            for (var i = 1; i < letterExtents.length; i++) {
                                if (x > textBoxProps.X + lastWidth && x <
                                    textBoxProps.X + lastWidth + letterExtents[i].Width) {
                                    textBoxProps.SelectedTextEndIndex = i;
                                    break;
                                }
                                lastWidth += letterExtents[i].Width;
                            }
                        }
                    }
                    if (textBoxProps.SelectedTextStartIndex >
                        textBoxProps.SelectedTextEndIndex) {
                        var tmp = textBoxProps.SelectedTextStartIndex;
                        textBoxProps.SelectedTextStartIndex =
                            textBoxProps.SelectedTextEndIndex;
                        textBoxProps.SelectedTextEndIndex = tmp;
                    }
                }
            }
        }
    }, canvasid);
    registerClickFunction(windowid, function (canvasid2, windowid2, e) {
        var textBoxProps = getTextBoxProps(canvasid2, windowid2);
        var x = e.calcX;
        var ctx = getCtx(canvasid2);
        ctx.font = textBoxProps.TextFontString;
        if (x > textBoxProps.X && x < textBoxProps.X + 4) {
            textBoxProps.CaretPosIndex = -1;
        } else if (textBoxProps.UserInputText && x > textBoxProps.X +
            ctx.measureText(textBoxProps.UserInputText).width + 4) {
            textBoxProps.CaretPosIndex = textBoxProps.UserInputText.length - 1;
        } else if (textBoxProps.UserInputText) {
            var letterExtents = new Array();
            var lastWidth = 0;
            for (var i = 0; i < textBoxProps.UserInputText.length; i++) {
                var currWidth = ctx.measureText(
                    textBoxProps.UserInputText.substring(0, i + 1)).width;
                letterExtents.push({ Width: currWidth - lastWidth });
                lastWidth = currWidth;
            }
            if (x > textBoxProps.X + 4 && x < textBoxProps.X + letterExtents[0].Width) {
                textBoxProps.CaretPosIndex = 0;
            } else {
                var lastWidth = letterExtents[0].Width;
                for (var i = 1; i < letterExtents.length; i++) {
                    if (x > textBoxProps.X + lastWidth && x < textBoxProps.X + lastWidth +
                        letterExtents[i].Width) {
                        textBoxProps.CaretPosIndex = i;
                        break;
                    }
                    lastWidth += letterExtents[i].Width;
                }
            }
        }
        if (textBoxProps.WasSelecting === 1) {
            textBoxProps.WasSelecting = 0;
        } else {
            textBoxProps.SelectedTextStartIndex = -1;
            textBoxProps.SelectedTextEndIndex = -1;
        }
    }, canvasid);
    if (!(navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
        navigator.userAgent.toLowerCase().indexOf('ipod') > -1)) {
        registerKeyDownFunction(canvasid, function (canvasid3, windowid3, e) {
            var textBoxProps = getTextBoxProps(canvasid3, windowid3);
            switch (e.keyCode) {
                case 37:
                    //left arrow	 37
                    if (textBoxProps.CaretPosIndex > -1) {
                        textBoxProps.CaretPosIndex--;
                        textBoxProps.SelectedTextStartIndex = -1;
                        textBoxProps.SelectedTextEndIndex = -1;
                        textBoxProps.WasSelecting = 0;
                        textBoxProps.MouseDown = 0;
                    }
                    return;
                case 39:
                    //right arrow	 39
                    if (textBoxProps.CaretPosIndex > textBoxProps.UserInputText.length - 1) {
                        textBoxProps.CaretPosIndex = textBoxProps.UserInputText.length - 1;
                    } else {
                        textBoxProps.CaretPosIndex++;
                    }
                    textBoxProps.SelectedTextStartIndex = -1;
                    textBoxProps.SelectedTextEndIndex = -1;
                    textBoxProps.MouseDown = 0;
                    textBoxProps.WasSelecting = 0;
                    return;
                case 46:
                    //delete	 46
                    if (textBoxProps.CaretPosIndex < textBoxProps.UserInputText.length - 1) {
                        if (textBoxProps.CaretPosIndex === -1) {
                            textBoxProps.UserInputText =
                                textBoxProps.UserInputText.substring(1);
                        } else if (textBoxProps.CaretPosIndex ==
                            textBoxProps.UserInputText.length - 2) {
                            textBoxProps.UserInputText =
                                textBoxProps.UserInputText.substring(0,
                                    textBoxProps.UserInputText.length - 1);
                        } else {
                            textBoxProps.UserInputText =
                                textBoxProps.UserInputText.substring(0,
                                    textBoxProps.CaretPosIndex + 1) +
                                textBoxProps.UserInputText.substring(
                                    textBoxProps.CaretPosIndex + 2);
                        }
                        textBoxProps.SelectedTextStartIndex = -1;
                        textBoxProps.SelectedTextEndIndex = -1;
                        textBoxProps.MouseDown = 0;
                        textBoxProps.WasSelecting = 0;
                    }
                    if (textBoxProps.ListPossiblesAllChoices !== null) {
                        FindTextBoxPossible(textBoxProps, c);
                    }
                    return;
                case 8:
                    //backspace	 8
                    if (textBoxProps.CaretPosIndex > -1) {
                        if (textBoxProps.CaretPosIndex === 0) {
                            if (textBoxProps.UserInputText.length > 1) {
                                textBoxProps.UserInputText =
                                    textBoxProps.UserInputText.substring(1,
                                        textBoxProps.UserInputText.length - 1);
                            } else {
                                textBoxProps.UserInputText = '';
                            }
                            textBoxProps.CaretPosIndex = -1;
                        } else if (textBoxProps.CaretPosIndex ==
                            textBoxProps.UserInputText.length - 1) {
                            textBoxProps.UserInputText =
                                textBoxProps.UserInputText.substring(0,
                                    textBoxProps.UserInputText.length - 1);
                            textBoxProps.CaretPosIndex--;
                        } else if (textBoxProps.CaretPosIndex > 0) {
                            textBoxProps.UserInputText =
                                textBoxProps.UserInputText.substring(0,
                                    textBoxProps.CaretPosIndex) +
                                textBoxProps.UserInputText.substring(
                                    textBoxProps.CaretPosIndex + 1);
                            textBoxProps.CaretPosIndex--;
                        }
                        textBoxProps.SelectedTextStartIndex = -1;
                        textBoxProps.SelectedTextEndIndex = -1;
                        textBoxProps.MouseDown = 0;
                        textBoxProps.WasSelecting = 0;
                    }
                    if (textBoxProps.ListPossiblesAllChoices !== null) {
                        FindTextBoxPossible(textBoxProps, c);
                    }
                    return;
            }
            if (e.ctrlKey && String.fromCharCode(e.keyCode).toLowerCase() === 'a') {
                textBoxProps.SelectedTextStartIndex = 0;
                textBoxProps.SelectedTextEndIndex = textBoxProps.UserInputText.length - 1;
            } else if (e.ctrlKey && String.fromCharCode(e.keyCode).toLowerCase() ==
                'c' && window.clipboardData) {
                if (textBoxProps.SelectedTextStartIndex > -1 &&
                    textBoxProps.SelectedTextEndIndex > -1 &&
                    textBoxProps.UserInputText && textBoxProps.SelectedTextEndIndex <
                    textBoxProps.UserInputText.length) {
                    window.clipboardData.setData('Text', (
                        textBoxProps.UserInputText && textBoxProps.SelectedTextEndIndex
                            === textBoxProps.UserInputText.length - 1 ?
                            textBoxProps.UserInputText.substring(
                                textBoxProps.SelectedTextStartIndex) :
                            textBoxProps.UserInputText.substring(
                                textBoxProps.SelectedTextStartIndex,
                                textBoxProps.SelectedTextEndIndex -
                                textBoxProps.SelectedTextStartIndex + 1)));
                }
            } else if (!textBoxProps.UserInputText || (textBoxProps.UserInputText
                && textBoxProps.UserInputText.length < textBoxProps.MaxChars)) {
                var c = getCharFromKeyCode(e);
                var foundPossibleMatch;
                if (textBoxProps.ListPossiblesAllChoices !== null) {
                    foundPossibleMatch = FindTextBoxPossible(textBoxProps, c);
                }
                if ((!textBoxProps.AllowedCharsRegEx || textBoxProps.AllowedCharsRegEx
                    === null || textBoxProps.AllowedCharsRegEx.length === 0 ||
                    c.match(textBoxProps.AllowedCharsRegEx) === c) &&
                    (!textBoxProps.LimitToListPossibles ||
                        (textBoxProps.LimitToListPossibles === 1 && foundPossibleMatch))) {
                    if (textBoxProps.CaretPosIndex === -1) {
                        textBoxProps.UserInputText = c + (textBoxProps.UserInputText ?
                            textBoxProps.UserInputText : '');
                        textBoxProps.CaretPosIndex++;
                    } else if (textBoxProps.UserInputText && textBoxProps.CaretPosIndex
                        === textBoxProps.UserInputText.length - 1) {
                        textBoxProps.UserInputText = textBoxProps.UserInputText + c;
                        textBoxProps.CaretPosIndex++;
                    } else if (textBoxProps.UserInputText) {
                        textBoxProps.UserInputText =
                            textBoxProps.UserInputText.substring(0,
                                textBoxProps.CaretPosIndex + 1) + c +
                            textBoxProps.UserInputText.substring(
                                textBoxProps.CaretPosIndex + 1);
                        textBoxProps.CaretPosIndex++;
                    }
                    textBoxProps.SelectedTextStartIndex = -1;
                    textBoxProps.SelectedTextEndIndex = -1;
                    textBoxProps.MouseDown = 0;
                    textBoxProps.WasSelecting = 0;
                }
            }
        }, windowid);
    }
    registerLostFocusFunction(canvasid, windowid, function (canvasid8, windowid8) {
        var textBoxProps = getTextBoxProps(canvasid8, windowid8);
        if (navigator.userAgent.toLowerCase().indexOf('android') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('ipad') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('iphone') > -1 ||
            navigator.userAgent.toLowerCase().indexOf('ipod') > -1) {
            if (doesWindowHaveFocus(canvasid8, textBoxProps.CustomKeyboardWindowID)
                === 0 && doingEventForWindowID !== textBoxProps.CustomKeyboardWindowID) {
                setHiddenWindowStatus(canvasid8, textBoxProps.CustomKeyboardWindowID, 1);
            } else {
                setHiddenWindowStatus(canvasid8, textBoxProps.CustomKeyboardWindowID, 0);
            }
        }
        if (doesWindowHaveFocus(canvasid8, textBoxProps.VScrollBarWindowID) === 0 &&
            doesWindowHaveFocus(canvasid8, textBoxProps.DropDownWindowID) === 0 &&
            doingEventForWindowID !== textBoxProps.DropDownWindowID &&
            doingEventForWindowID !== textBoxProps.VScrollBarWindowID) {
            textBoxProps.SelectedTextStartIndex = -1;
            textBoxProps.SelectedTextEndIndex = -1;
            textBoxProps.MouseDown = 0;
            textBoxProps.WasSelecting = 0;
            setHiddenWindowStatus(canvasid8, textBoxProps.DropDownWindowID, 1);
            setHiddenWindowStatus(canvasid8, textBoxProps.VScrollBarWindowID, 1);
        }
    });
    registerGotFocusFunction(canvasid, windowid, function (canvasid1, windowid1) {
        var textBoxProps = getTextBoxProps(canvasid1, windowid1);
        setHiddenWindowStatus(canvasid1, textBoxProps.CustomKeyboardWindowID, 0);
    });
    registerAnimatedWindow(canvasid, windowid);
    return windowid;
}

function repeatPasswordChar(c, x) {
    var str = '';
    for (var i = 0; i < x; i++) {
        str = str + c;
    }
    return str;
}

function FindTextBoxPossible(textBoxProps, c) {
    var str = '';
    if (textBoxProps.CaretPosIndex === -1) {
        str = c + (textBoxProps.UserInputText ? textBoxProps.UserInputText : '');
    } else if (textBoxProps.UserInputText && textBoxProps.CaretPosIndex ==
        textBoxProps.UserInputText.length - 1) {
        str = textBoxProps.UserInputText + c;
    } else if (textBoxProps.UserInputText) {
        str = textBoxProps.UserInputText.substring(0, textBoxProps.CaretPosIndex + 1) +
            c + textBoxProps.UserInputText.substring(textBoxProps.CaretPosIndex + 1);
    }
    textBoxProps.ListPossibles = new Array();
    var found = false;
    for (var i = 0; textBoxProps.ListPossiblesAllChoices && i <
        textBoxProps.ListPossiblesAllChoices.length; i++) {
        if (textBoxProps.ListPossiblesAllChoices[i].indexOf(str) === 0) {
            found = true;
            textBoxProps.ListPossibles.push(textBoxProps.ListPossiblesAllChoices[i]);
        }
    }
    if (found) {
        setHiddenWindowStatus(textBoxProps.CanvasID, textBoxProps.DropDownWindowID, 0);
        setHiddenWindowStatus(textBoxProps.CanvasID, textBoxProps.VScrollBarWindowID, 0);
    } else {
        setHiddenWindowStatus(textBoxProps.CanvasID, textBoxProps.DropDownWindowID, 1);
        setHiddenWindowStatus(textBoxProps.CanvasID, textBoxProps.VScrollBarWindowID, 1);
        textBoxProps.ListPossiblesSelectedID = -1;
    }
    return found;
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

