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

//Panel control code starts here

var panelPropsArray = new Array();

function getPanelProps(canvasid, windowid) {
    for (var i = 0; i < panelPropsArray.length; i++) {
        if (panelPropsArray[i].CanvasID === canvasid &&
            panelPropsArray[i].WindowID === windowid) {
            return panelPropsArray[i];
        }
    }
}

function Panel() { }

Panel.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null,
    ExpandedWidth: null, ExpandedHeight: null,
    CollapsedWidth: null, CollapsedHeight: null, IsCollapsable: null,
    HasBorder: null, BorderColor: null,
    HasBackgroundGradient: null, BackgroundStartColor: null, BackgroundEndColor: null,
    HeaderHeight: null, HeaderBackgroundStartColor: null, HeaderBackgroundEndColor: null,
    ExpandCollapseButtonColor: null, IsExpanded: null, ExpandCollapseButtonRadius: null,
    PanelLabel: null, PanelLabelTextColor: null, PanelLabelTextHeight: null,
    PanelLabelTextFontString: null, OriginalWidth: null, OriginalHeight: null, Tag: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createPanel(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.HasBorder, this.BorderColor, this.HasBackgroundGradient,
            this.BackgroundStartColor,
            this.BackgroundEndColor, this.IsCollapsable, this.CollapsedWidth,
            this.CollapsedHeight,
            this.PanelLabel, this.PanelLabelTextColor, this.PanelLabelTextHeight,
            this.PanelLabelTextFontString,
            this.HeaderBackgroundStartColor, this.HeaderBackgroundEndColor,
            this.HeaderHeight,
            this.ExpandCollapseButtonColor, this.IsExpanded,
            this.ExpandCollapseButtonRadius, this.Tag, this.TabStopIndex);
    }
};

function createPanel(canvasid, controlNameId, x, y, width, height, depth, hasBorder,
    borderColor, hasBackgroundGradient, backgroundStartColor, backgroundEndColor,
    iscollapsable, collapsedWidth, collapsedHeight, panellabel, panelLabelTextColor,
    panelLabelTextHeight, panelLabelTextFontString,
    headerBackgroundStartColor, headerBackgroundEndColor, headerheight,
    expandCollapseButtonColor, isexpanded, expandCollapseButtonRadius, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, iscollapsable === 1 ?
        isexpanded === 1 ? width : collapsedWidth : width,
        iscollapsable === 1 ? isexpanded === 1 ? height : headerheight : height,
        depth, null, 'Panel', controlNameId, null, tabstopindex);
    panelPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, ExpandedWidth: width, ExpandedHeight: height,
        CollapsedWidth: collapsedWidth, CollapsedHeight: collapsedHeight,
        IsCollapsable: iscollapsable, HasBorder: hasBorder, BorderColor: borderColor,
        HasBackgroundGradient: hasBackgroundGradient,
        BackgroundStartColor: backgroundStartColor, BackgroundEndColor: backgroundEndColor,
        HeaderHeight: headerheight,
        HeaderBackgroundStartColor: headerBackgroundStartColor,
        HeaderBackgroundEndColor: headerBackgroundEndColor,
        ExpandCollapseButtonColor: expandCollapseButtonColor,
        IsExpanded: isexpanded, ExpandCollapseButtonRadius: expandCollapseButtonRadius,
        PanelLabel: panellabel, PanelLabelTextColor: panelLabelTextColor,
        PanelLabelTextHeight: panelLabelTextHeight,
        PanelLabelTextFontString: panelLabelTextFontString, OriginalWidth: width,
        OriginalHeight: height, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid2, windowid2) {
        var panelProps = getPanelProps(canvasid2, windowid2);
        var ctx = getCtx(canvasid2);
        if (panelProps.IsCollapsable === 1) {
            if (panelProps.IsExpanded === 1) {
                if (panelProps.HasBackgroundGradient === 1) {
                    var g = ctx.createLinearGradient(panelProps.X, panelProps.Y,
                        panelProps.X, panelProps.Y + panelProps.Height);
                    g.addColorStop(0, panelProps.BackgroundStartColor);
                    g.addColorStop(1, panelProps.BackgroundEndColor);
                    ctx.fillStyle = g;
                    ctx.beginPath();
                    ctx.rect(panelProps.X, panelProps.Y, panelProps.Width, panelProps.Height);
                    ctx.fill();
                }
                if (panelProps.HasBorder === 1) {
                    ctx.strokeStyle = panelProps.BorderColor;
                    ctx.beginPath();
                    ctx.rect(panelProps.X, panelProps.Y, panelProps.Width, panelProps.Height);
                    ctx.stroke();
                }
            } else {
                if (panelProps.HasBorder === 1) {
                    ctx.strokeStyle = panelProps.BorderColor;
                    ctx.beginPath();
                    ctx.rect(panelProps.X, panelProps.Y, panelProps.Width,
                        panelProps.HeaderHeight);
                    ctx.stroke();
                }
            }
            var g1 = ctx.createLinearGradient(panelProps.X, panelProps.Y,
                panelProps.X, panelProps.Y + panelProps.HeaderHeight);
            g1.addColorStop(0, panelProps.HeaderBackgroundStartColor);
            g1.addColorStop(1, panelProps.HeaderBackgroundEndColor);
            ctx.fillStyle = g1;
            ctx.beginPath();
            ctx.rect(panelProps.X, panelProps.Y, panelProps.Width, panelProps.HeaderHeight);
            ctx.fill();
            ctx.fillStyle = panelProps.PanelLabelTextColor;
            ctx.font = panelProps.PanelLabelTextFontString;
            ctx.fillText(panelProps.PanelLabel, panelProps.X + (panelProps.Width -
                panelProps.ExpandCollapseButtonRadius -
                ctx.measureText(panelProps.PanelLabel).width) / 2, panelProps.Y +
                panelProps.HeaderHeight -
                (panelProps.HeaderHeight - panelProps.PanelLabelTextHeight) / 2);
            var g2 = ctx.createRadialGradient(panelProps.X + panelProps.Width - 4 -
                panelProps.ExpandCollapseButtonRadius,
                panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                    panelProps.ExpandCollapseButtonRadius * 2) / 2
                - panelProps.ExpandCollapseButtonRadius, 0,
                panelProps.X + panelProps.Width - 4 - panelProps.ExpandCollapseButtonRadius,
                panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                    panelProps.ExpandCollapseButtonRadius * 2) / 2
                - panelProps.ExpandCollapseButtonRadius,
                panelProps.ExpandCollapseButtonRadius);
            var redcomp = parseInt(panelProps.ExpandCollapseButtonColor.substr(1, 2), 16);
            var greencomp = parseInt(panelProps.ExpandCollapseButtonColor.substr(3, 2), 16);
            var bluecomp = parseInt(panelProps.ExpandCollapseButtonColor.substr(5, 2), 16);
            g2.addColorStop(0.0, '#' + gethighcomp(redcomp) + gethighcomp(greencomp) +
                gethighcomp(bluecomp));
            g2.addColorStop(0.9, panelProps.ExpandCollapseButtonColor);
            g2.addColorStop(1.0, '#' + getlowcomp(redcomp) + getlowcomp(greencomp) +
                getlowcomp(bluecomp));
            ctx.fillStyle = g2;
            ctx.beginPath();
            ctx.arc(panelProps.X + panelProps.Width - 4 - panelProps.ExpandCollapseButtonRadius,
                panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                    panelProps.ExpandCollapseButtonRadius * 2) / 2
                - panelProps.ExpandCollapseButtonRadius,
                panelProps.ExpandCollapseButtonRadius, 0, Math.PI * 2, false);
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.beginPath();
            if (panelProps.IsExpanded === 1) {
                ctx.moveTo(panelProps.X + panelProps.Width - 8 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 + 4
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width - 4 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 - 2
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 + 4
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.moveTo(panelProps.X + panelProps.Width - 8 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 + 1
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width - 4 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 - 5
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 + 1
                    - panelProps.ExpandCollapseButtonRadius);
            } else {
                ctx.moveTo(panelProps.X + panelProps.Width - 8 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 - 4
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width - 4 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 + 2
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 - 4
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.moveTo(panelProps.X + panelProps.Width - 8 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 - 1
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width - 4 -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 + 5
                    - panelProps.ExpandCollapseButtonRadius);
                ctx.lineTo(panelProps.X + panelProps.Width -
                    panelProps.ExpandCollapseButtonRadius,
                    panelProps.Y + panelProps.HeaderHeight - (panelProps.HeaderHeight -
                        panelProps.ExpandCollapseButtonRadius * 2) / 2 - 1
                    - panelProps.ExpandCollapseButtonRadius);
            }
            ctx.stroke();
        } else {
            if (panelProps.HasBackgroundGradient === 1) {
                var g3 = ctx.createLinearGradient(panelProps.X, panelProps.Y,
                    panelProps.X, panelProps.Y + panelProps.Height);
                g3.addColorStop(0, panelProps.BackgroundStartColor);
                g3.addColorStop(1, panelProps.BackgroundEndColor);
                ctx.fillStyle = g3;
                ctx.beginPath();
                ctx.rect(panelProps.X, panelProps.Y, panelProps.Width, panelProps.Height);
                ctx.fill();
            }
            if (panelProps.HasBorder === 1) {
                ctx.strokeStyle = panelProps.BorderColor;
                ctx.beginPath();
                ctx.rect(panelProps.X, panelProps.Y, panelProps.Width, panelProps.Height);
                ctx.stroke();
            }
        }
    }, canvasid);
    if (iscollapsable === 1) {
        registerClickFunction(windowid, function (canvasid3, windowid3, e) {
            var panelProps = getPanelProps(canvasid3, windowid3);
            var windowProps = getWindowProps(canvasid3, windowid3);
            if (windowProps) {
                var x = e.calcX;
                var y = e.calcY;
                if (x > panelProps.X + panelProps.Width - 4 -
                    panelProps.ExpandCollapseButtonRadius * 2 &&
                    x < panelProps.X + panelProps.Width - 4 && y > panelProps.Y + +
                    ((panelProps.HeaderHeight - panelProps.ExpandCollapseButtonRadius *
                        2) / 2) &&
                    y < panelProps.Y + panelProps.HeaderHeight -
                    (panelProps.HeaderHeight - panelProps.ExpandCollapseButtonRadius *
                        2) / 2) {
                    if (panelProps.IsExpanded === 1) {
                        panelProps.IsExpanded = 0;
                        panelProps.Width = panelProps.CollapsedWidth;
                        panelProps.Height = panelProps.HeaderHeight +
                            panelProps.CollapsedHeight;
                        windowProps.Width = panelProps.CollapsedWidth;
                        windowProps.Height = panelProps.HeaderHeight +
                            panelProps.CollapsedHeight;
                    } else {
                        panelProps.IsExpanded = 1;
                        panelProps.Width = panelProps.OriginalWidth;
                        panelProps.Height = panelProps.OriginalHeight;
                        windowProps.Width = panelProps.OriginalWidth;
                        windowProps.Height = panelProps.OriginalHeight;
                    }
                }
                invalidateRect(canvasid3, null, panelProps.X, panelProps.Y,
                    panelProps.OriginalWidth, panelProps.OriginalHeight);
            }
        }, canvasid);
    } else {
        registerClickFunction(windowid, function () { }, canvasid);
    }
    registerMouseDownFunction(windowid, function () { }, canvasid);
    registerMouseMoveFunction(windowid, function () { }, canvasid);
    registerMouseUpFunction(windowid, function () { }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

