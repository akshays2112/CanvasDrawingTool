/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//Tab Control code starts here

var tabPropsArray = new Array();

function getTabProps(canvasid, windowid) {
    for (var i = 0; i < tabPropsArray.length; i++) {
        if (tabPropsArray[i].CanvasID === canvasid &&
            tabPropsArray[i].WindowID === windowid) {
            return tabPropsArray[i];
        }
    }
}

function TabControl() { }

TabControl.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null,
    TabLabels: null, TabLabelColor: null, TabLabelHeight: null, TabLabelFontString: null,
    PanelWindowIDs: null, SelectedTabID: null, TabLabelGradientStartColor: null,
    TabLabelGradientEndColor: null, GapBetweenTabs: null, SelectedTabBorderColor: null,
    SelectedTabBorderLineWidth: null, Tag: null, ControlNameID: null, Depth: null,
    TabStopIndex: null,
    PanelHasBackgroundGradient: null, PanelHasBorder: null, PanelBackgroundStartColor: null,
    PanelBackgroundEndColor: null, PanelBorderColor: null,

    Initialize: function () {
        return createTabControl(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.TabLabels, this.TabLabelColor, this.TabLabelHeight,
            this.TabLabelFontString,
            this.TabLabelGradientStartColor, this.TabLabelGradientEndColor,
            this.PanelHasBorder, this.PanelBorderColor,
            this.PanelHasBackgroundGradient, this.panelBackgroundStartColor,
            this.panelBackgroundEndColor, this.selectedTabID,
            this.GapBetweenTabs, this.SelectedTabBorderColor,
            this.SelectedTabBorderLineWidth, this.Tag, this.TabStopIndex);
    }
};

function createTabControl(canvasid, controlNameId, x, y, width, height, depth,
    tablabels, tablabelcolor, tablabelheight, tablabelfontstring,
    tablabelgradientstartcolor, tablabelgradientendcolor, panelHasBorder,
    panelBorderColor, panelHasBackgroundGradient,
    panelBackgroundStartColor, panelBackgroundEndColor, selectedTabID, gapbetweentabs,
    selectedtabbordercolor,
    selectedtabborderlinewidth, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'Tab',
        controlNameId, null, tabstopindex);
    var panels = new Array();
    for (var i = 0; i < tablabels.length; i++) {
        var panelwindowid = createPanel(canvasid, controlNameId + 'Panel' +
            i.toString(), x, y + tablabelheight + 8, width, height - tablabelheight -
            8, depth, panelHasBorder, panelBorderColor,
            panelHasBackgroundGradient, panelBackgroundStartColor,
            panelBackgroundEndColor);
        panels.push(panelwindowid);
        registerHiddenWindow(canvasid, panelwindowid, i === selectedTabID ? 0 : 1);
        registerChildWindow(canvasid, panelwindowid, windowid);
    }
    tabPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height,
        TabLabels: tablabels, TabLabelColor: tablabelcolor,
        TabLabelHeight: tablabelheight, TabLabelFontString: tablabelfontstring,
        PanelWindowIDs: panels, SelectedTabID: selectedTabID,
        TabLabelGradientStartColor: tablabelgradientstartcolor,
        TabLabelGradientEndColor: tablabelgradientendcolor, TabLabelHitAreas: new Array(),
        GapBetweenTabs: gapbetweentabs, SelectedTabBorderColor: selectedtabbordercolor,
        SelectedTabBorderLineWidth: selectedtabborderlinewidth, Tag: tag
    });
    registerWindowDrawFunction(windowid, function (canvasid1, windowid1) {
        var tabProps = getTabProps(canvasid1, windowid1);
        var ctx = getCtx(canvasid1);
        ctx.font = tabProps.TabLabelFontString;
        var selectedTabWidth = ctx.measureText(tabProps.TabLabels[
            tabProps.SelectedTabID]).width + 8 + (tabProps.TabLabelHeight + 8) * 2;
        var currWidthOffset = 0;
        var selectedWidthOffset = 0;
        tabProps.TabLabelHitAreas = new Array();
        var currentTabWidth = 0;
        for (var i = 0; i < tabProps.TabLabels.length; i++) {
            if (i === tabProps.SelectedTabID + 1) {
                currWidthOffset += selectedTabWidth;
            }
            if (i === tabProps.SelectedTabID) {
                selectedWidthOffset = currWidthOffset;
            } else {
                currentTabWidth = ctx.measureText(tabProps.TabLabels[i]).width + 8 +
                    ((tabProps.TabLabelHeight + 8) * 2);
                if (i !== tabProps.SelectedTabID && currWidthOffset + currentTabWidth <
                    tabProps.Width) {
                    var tablabelgradient = ctx.createLinearGradient(tabProps.X +
                        currWidthOffset, tabProps.Y, tabProps.X + currWidthOffset +
                        currentTabWidth,
                        tabProps.Y + tabProps.TabLabelHeight + 8);
                    tablabelgradient.addColorStop(0, tabProps.TabLabelGradientStartColor);
                    tablabelgradient.addColorStop(1, tabProps.TabLabelGradientEndColor);
                    ctx.fillStyle = tablabelgradient;
                    ctx.beginPath();
                    ctx.moveTo(tabProps.X + currWidthOffset + ((i + 1) *
                        tabProps.GapBetweenTabs), tabProps.Y + tabProps.TabLabelHeight + 8);
                    ctx.lineTo(tabProps.X + currWidthOffset + ((i + 1) *
                        tabProps.GapBetweenTabs), tabProps.Y + 5);
                    ctx.arc(tabProps.X + currWidthOffset + ((i + 1) *
                        tabProps.GapBetweenTabs) + 5, tabProps.Y + 5, 5, Math.PI,
                        (Math.PI / 180) * 270, false);
                    ctx.lineTo(tabProps.X + currWidthOffset + ((i + 1) *
                        tabProps.GapBetweenTabs) + currentTabWidth - 5, tabProps.Y);
                    ctx.arc(tabProps.X + currWidthOffset + ((i + 1) *
                        tabProps.GapBetweenTabs) + currentTabWidth - 5, tabProps.Y + 5,
                        5, (Math.PI / 180) * 270, Math.PI * 2, false);
                    ctx.lineTo(tabProps.X + currWidthOffset + ((i + 1) *
                        tabProps.GapBetweenTabs) + currentTabWidth, tabProps.Y +
                        tabProps.TabLabelHeight + 8);
                    ctx.closePath();
                    ctx.fill();
                    ctx.fillStyle = tabProps.TabLabelColor;
                    ctx.fillText(tabProps.TabLabels[i], tabProps.X + currWidthOffset +
                        ((i + 1) * tabProps.GapBetweenTabs) + tabProps.TabLabelHeight + 8 + 4,
                        tabProps.Y + tabProps.TabLabelHeight + 4);
                    tabProps.TabLabelHitAreas.push({
                        XStart: tabProps.X + currWidthOffset, XEnd: tabProps.X +
                        currWidthOffset + ((tabProps.TabLabelHeight + 8) * 2) +
                        currentTabWidth + 8, YStart: tabProps.Y, YEnd: tabProps.Y +
                        tabProps.TabLabelHeight + 8, PanelWindowID: tabProps.PanelWindowIDs[i],
                        TabID: i
                    });
                }
                currWidthOffset += currentTabWidth;
            }
        }
        currWidthOffset = selectedWidthOffset;
        var tablabelgradient2 = ctx.createLinearGradient(tabProps.X, tabProps.Y,
            tabProps.X, tabProps.Y + tabProps.TabLabelHeight + 8);
        tablabelgradient2.addColorStop(0, tabProps.TabLabelGradientStartColor);
        tablabelgradient2.addColorStop(1, tabProps.TabLabelGradientEndColor);
        ctx.fillStyle = tablabelgradient2;
        ctx.beginPath();
        ctx.moveTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs), tabProps.Y + tabProps.TabLabelHeight + 8);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs), tabProps.Y + 5);
        ctx.arc(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + 5, tabProps.Y + 5, 5, Math.PI,
            (Math.PI / 180) * 270, false);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + currentTabWidth - 5, tabProps.Y);
        ctx.arc(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + currentTabWidth - 5, tabProps.Y + 5, 5,
            (Math.PI / 180) * 270, Math.PI * 2, false);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + currentTabWidth, tabProps.Y +
            tabProps.TabLabelHeight + 8);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = tabProps.TabLabelColor;
        ctx.fillText(tabProps.TabLabels[tabProps.SelectedTabID], tabProps.X +
            currWidthOffset + ((tabProps.SelectedTabID + 1) * tabProps.GapBetweenTabs) +
            tabProps.TabLabelHeight + 8 + 4,
            tabProps.Y + tabProps.TabLabelHeight + 4);
        ctx.strokeStyle = tabProps.SelectedTabBorderColor;
        ctx.lineWidth = tabProps.SelectedTabBorderLineWidth;
        ctx.beginPath();
        ctx.moveTo(tabProps.X, tabProps.Y + tabProps.TabLabelHeight + 8);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs), tabProps.Y + tabProps.TabLabelHeight + 8);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs), tabProps.Y + 5);
        ctx.arc(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + 5, tabProps.Y + 5, 5, Math.PI, (Math.PI / 180) *
            270, false);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + currentTabWidth - 5, tabProps.Y);
        ctx.arc(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + currentTabWidth - 5, tabProps.Y + 5, 5, (Math.PI / 180) * 270, Math.PI * 2, false);
        ctx.lineTo(tabProps.X + currWidthOffset + ((tabProps.SelectedTabID + 1) *
            tabProps.GapBetweenTabs) + currentTabWidth, tabProps.Y +
            tabProps.TabLabelHeight + 8);
        ctx.lineTo(tabProps.X + tabProps.Width, tabProps.Y + tabProps.TabLabelHeight + 8);
        ctx.lineTo(tabProps.X + tabProps.Width, tabProps.Y + tabProps.Height);
        ctx.stroke();
        ctx.lineWidth = 1;
        tabProps.TabLabelHitAreas.push({
            XStart: tabProps.X + currWidthOffset, XEnd: tabProps.X + currWidthOffset +
            ((tabProps.TabLabelHeight + 8) * 2) +
            currentTabWidth + 8, YStart: tabProps.Y, YEnd: tabProps.Y +
            tabProps.TabLabelHeight + 8, PanelWindowID:
            tabProps.PanelWindowIDs[tabProps.SelectedTabID],
            TabID: tabProps.SelectedTabID
        });
    }, canvasid);
    registerClickFunction(windowid, function (canvasid2, windowid2, e) {
        var tabProps = getTabProps(canvasid2, windowid2);
        var clickx = e.calcX;
        var clicky = e.calcY;
        for (var i = 0; i < tabProps.TabLabelHitAreas.length; i++) {
            if (clickx > tabProps.TabLabelHitAreas[i].XStart && clickx <
                tabProps.TabLabelHitAreas[i].XEnd &&
                clicky > tabProps.TabLabelHitAreas[i].YStart && clicky <
                tabProps.TabLabelHitAreas[i].YEnd) {
                for (var p = 0; p < tabProps.PanelWindowIDs.length; p++) {
                    if (p !== tabProps.TabLabelHitAreas[i].PanelWindowID) {
                        setHiddenWindowStatus(canvasid2, tabProps.PanelWindowIDs[p], 1);
                    }
                }
                setHiddenWindowStatus(canvasid2,
                    tabProps.TabLabelHitAreas[i].PanelWindowID, 0);
                tabProps.SelectedTabID = tabProps.TabLabelHitAreas[i].TabID;
            }
        }
    }, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

