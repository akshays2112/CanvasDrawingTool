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

//Calendar Control Code Starts Here
var calendarPropsArray = new Array();

function getCalendarProps(canvasid, windowid) {
    for (var i = 0; i < calendarPropsArray.length; i++) {
        if (calendarPropsArray[i].CanvasID === canvasid &&
            calendarPropsArray[i].WindowID === windowid) {
            return calendarPropsArray[i];
        }
    }
}

function drawCalendar(canvasid, windowid) {
    var calendarProps = getCalendarProps(canvasid, windowid);
    var ctx = getCtx(canvasid);
    var visibleMonth = new Date('1 ' + calendarProps.VisibleMonth + ' ' +
        calendarProps.VisibleYear);
    var todaysDate = new Date();
    ctx.fillStyle = calendarProps.HeaderBackgroundColor;
    ctx.beginPath();
    ctx.rect(calendarProps.X, calendarProps.Y, calendarProps.Width,
        calendarProps.HeaderHeight);
    ctx.fill();
    ctx.fillStyle = calendarProps.BodyBackgroundColor;
    ctx.beginPath();
    ctx.rect(calendarProps.X, calendarProps.Y + calendarProps.HeaderHeight,
        calendarProps.Width, calendarProps.Height - calendarProps.HeaderHeight);
    ctx.fill();
    var buttonClickExtents = new Array();
    ctx.fillStyle = '#C0C0C0';
    ctx.font = calendarProps.TextHeaderFontString;
    var maxmonthwidth = ctx.measureText('September').width;
    var maxyearwidth = ctx.measureText('0000').width;
    var headeroffsetx = calendarProps.X + (calendarProps.Width - (68 +
        maxmonthwidth + maxyearwidth)) / 2;
    ctx.beginPath();
    ctx.moveTo(headeroffsetx + 4, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2 + 6);
    ctx.lineTo(headeroffsetx + 15, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2);
    ctx.lineTo(headeroffsetx + 15, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2 + 11);
    ctx.closePath();
    ctx.fill();
    buttonClickExtents.push({
        X: headeroffsetx + 4, Y: calendarProps.Y +
            (calendarProps.HeaderHeight - 11) / 2, Width: 11, Height: 11
    });
    ctx.beginPath();
    ctx.moveTo(headeroffsetx + 23 + maxmonthwidth, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2);
    ctx.lineTo(headeroffsetx + 23 + maxmonthwidth, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2 + 11);
    ctx.lineTo(headeroffsetx + 34 + maxmonthwidth, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2 + 6);
    ctx.closePath();
    ctx.fill();
    buttonClickExtents.push({
        X: headeroffsetx + 23 + maxmonthwidth,
        Y: calendarProps.Y + (calendarProps.HeaderHeight - 11) / 2,
        Width: 11, Height: 11
    });
    ctx.beginPath();
    ctx.moveTo(headeroffsetx + 38 + maxmonthwidth, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2 + 6);
    ctx.lineTo(headeroffsetx + 49 + maxmonthwidth, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2);
    ctx.lineTo(headeroffsetx + 49 + maxmonthwidth, calendarProps.Y +
        (calendarProps.HeaderHeight - 11) / 2 + 11);
    ctx.closePath();
    ctx.fill();
    buttonClickExtents.push({
        X: headeroffsetx + 38 + maxmonthwidth,
        Y: calendarProps.Y + (calendarProps.HeaderHeight - 11) / 2,
        Width: 11, Height: 11
    });
    ctx.beginPath();
    ctx.moveTo(headeroffsetx + 57 + maxmonthwidth + maxyearwidth,
        calendarProps.Y + (calendarProps.HeaderHeight - 11) / 2);
    ctx.lineTo(headeroffsetx + 57 + maxmonthwidth + maxyearwidth,
        calendarProps.Y + (calendarProps.HeaderHeight - 11) / 2 + 11);
    ctx.lineTo(headeroffsetx + 68 + maxmonthwidth + maxyearwidth,
        calendarProps.Y + (calendarProps.HeaderHeight - 11) / 2 + 6);
    ctx.closePath();
    ctx.fill();
    buttonClickExtents.push({
        X: headeroffsetx + 57 + maxmonthwidth + maxyearwidth,
        Y: calendarProps.Y + (calendarProps.HeaderHeight - 11) / 2,
        Width: 11, Height: 11
    });
    calendarProps.ButtonClickExtents = buttonClickExtents;
    ctx.fillStyle = calendarProps.TextHeaderColor;
    ctx.fillText(calendarProps.VisibleMonth, headeroffsetx + 19 +
        (maxmonthwidth - ctx.measureText(calendarProps.VisibleMonth).width) / 2,
        calendarProps.Y + (calendarProps.HeaderHeight -
            calendarProps.TextHeaderHeight) / 2 + calendarProps.TextHeaderHeight);
    ctx.fillText(calendarProps.VisibleYear, headeroffsetx + 53 + maxmonthwidth,
        calendarProps.Y + (calendarProps.HeaderHeight -
        calendarProps.TextHeaderHeight) / 2 + calendarProps.TextHeaderHeight);
    var currday = visibleMonth.getDay() > 0 ? new Date(visibleMonth.getTime() -
        visibleMonth.getDay() * 24 * 60 * 60 * 1000) : visibleMonth;
    var dateClickExtents = new Array();
    var daylabel = null;
    for (var i = 0; i < 7; i++) {
        switch (i) {
            case 0:
                daylabel = 'Sun';
                break;
            case 1:
                daylabel = 'Mon';
                break;
            case 2:
                daylabel = 'Tue';
                break;
            case 3:
                daylabel = 'Wed';
                break;
            case 4:
                daylabel = 'Thu';
                break;
            case 5:
                daylabel = 'Fri';
                break;
            case 6:
                daylabel = 'Sat';
                break;
        }
        ctx.fillStyle = calendarProps.DayLabelTextColor;
        ctx.font = calendarProps.DayLabelTextFontString;
        ctx.fillText(daylabel, calendarProps.X + 4 + i % 7 *
            calendarProps.DayCellWidth +
            (calendarProps.DayCellWidth - ctx.measureText(daylabel).width) / 2,
            calendarProps.Y + calendarProps.HeaderHeight + 4 +
            calendarProps.DayCellHeight - (calendarProps.DayCellHeight -
                calendarProps.DayLabelTextHeight) / 2);
    }
    for (i = 0; i < 42; i++ , currday = new Date(currday.getTime() +
        24 * 60 * 60 * 1000)) {
        dateClickExtents.push({
            X: calendarProps.X + 4 + i % 7 * calendarProps.DayCellWidth,
            Y: calendarProps.Y + calendarProps.HeaderHeight + 4 +
            (Math.floor(i / 7.0) + 1) * calendarProps.DayCellHeight,
            Date: currday
        });
        var mousehover = 0;
        if (calendarProps.MouseHoverDate !== null && currday.getMonth() ===
            calendarProps.MouseHoverDate.getMonth() &&
            currday.getDate() === calendarProps.MouseHoverDate.getDate() &&
            currday.getFullYear() === calendarProps.MouseHoverDate.getFullYear()) {
            mousehover = 1;
            ctx.fillStyle = calendarProps.MouseOverHightLightColor;
            ctx.beginPath();
            ctx.rect(calendarProps.X + 4 + i % 7 * calendarProps.DayCellWidth,
                calendarProps.Y + calendarProps.HeaderHeight + 4 +
                (Math.floor(i / 7.0) + 1) * calendarProps.DayCellHeight,
                calendarProps.DayCellWidth, calendarProps.DayCellHeight);
            ctx.fill();
        }
        if (currday.getMonth() !== visibleMonth.getMonth()) {
            ctx.fillStyle = calendarProps.DayDateInactiveTextColor;
            ctx.font = calendarProps.DayDateInactiveTextFontString;
            ctx.fillText(currday.getDate().toString(), calendarProps.X + 4 +
                i % 7 * calendarProps.DayCellWidth +
                (calendarProps.DayCellWidth - ctx.measureText(
                    currday.getDate().toString()).width) / 2,
                calendarProps.Y + calendarProps.HeaderHeight + 4 +
                (Math.floor(i / 7.0) + 2) * calendarProps.DayCellHeight -
                (calendarProps.DayCellHeight -
                    calendarProps.TodayTextHeight) / 2);
        } else {
            if (calendarProps.SelectedDay !== null && currday.getMonth() ===
                calendarProps.SelectedDay.getMonth() &&
                currday.getDate() === calendarProps.SelectedDay.getDate() &&
                currday.getFullYear() === calendarProps.SelectedDay.getFullYear()) {
                ctx.fillStyle = calendarProps.SelectedDayHighLightColor;
                ctx.beginPath();
                ctx.rect(calendarProps.X + 4 + i % 7 * calendarProps.DayCellWidth,
                    calendarProps.Y + calendarProps.HeaderHeight + 4 +
                    (Math.floor(i / 7.0) + 1) * calendarProps.DayCellHeight,
                    calendarProps.DayCellWidth, calendarProps.DayCellHeight);
                ctx.fill();
                ctx.fillStyle = calendarProps.SelectedDayTextColor;
                ctx.font = calendarProps.SelectedDayTextFontString;
                ctx.fillText(currday.getDate().toString(), calendarProps.X + 4 +
                    i % 7 * calendarProps.DayCellWidth +
                    (calendarProps.DayCellWidth - ctx.measureText(
                        currday.getDate().toString()).width) / 2,
                    calendarProps.Y + calendarProps.HeaderHeight + 4 +
                    (Math.floor(i / 7.0) + 2) * calendarProps.DayCellHeight -
                    (calendarProps.DayCellHeight -
                        calendarProps.SelectedDayTextHeight) / 2);
            } else if (currday.getMonth() === todaysDate.getMonth() &&
                currday.getDate() === todaysDate.getDate() && currday.getFullYear() ===
                todaysDate.getFullYear()) {
                if (mousehover === 0) {
                    ctx.fillStyle = calendarProps.TodayHighLightColor;
                    ctx.beginPath();
                    ctx.rect(calendarProps.X + 4 + i % 7 * calendarProps.DayCellWidth,
                        calendarProps.Y + calendarProps.HeaderHeight + 4 +
                        (Math.floor(i / 7.0) + 1) * calendarProps.DayCellHeight,
                        calendarProps.DayCellWidth, calendarProps.DayCellHeight);
                    ctx.fill();
                }
                ctx.fillStyle = calendarProps.TodayTextColor;
                ctx.font = calendarProps.TodayTextFontString;
                ctx.fillText(currday.getDate().toString(), calendarProps.X + 4 +
                    i % 7 * calendarProps.DayCellWidth +
                    (calendarProps.DayCellWidth - ctx.measureText(
                        currday.getDate().toString()).width) / 2,
                    calendarProps.Y + calendarProps.HeaderHeight + 4 +
                    (Math.floor(i / 7.0) + 2) * calendarProps.DayCellHeight -
                    (calendarProps.DayCellHeight -
                        calendarProps.TodayTextHeight) / 2);
            } else {
                ctx.fillStyle = calendarProps.DayDateActiveColor;
                ctx.font = calendarProps.DayDateActiveTextFontString;
                ctx.fillText(currday.getDate().toString(), calendarProps.X + 4 +
                    i % 7 * calendarProps.DayCellWidth +
                    (calendarProps.DayCellWidth - ctx.measureText(
                        currday.getDate().toString()).width) / 2,
                    calendarProps.Y + calendarProps.HeaderHeight + 4 +
                    (Math.floor(i / 7.0) + 2) * calendarProps.DayCellHeight -
                    (calendarProps.DayCellHeight -
                        calendarProps.DayDateActiveTextHeight) / 2);
            }
        }
    }
    calendarProps.DateClickExtents = dateClickExtents;
}

function Calendar() { }

Calendar.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null,
    VisibleMonth: null, VisibleYear: null,
    SelectedDay: null, DayCellWidth: null, DayCellHeight: null, HeaderHeight: null,
    TextHeaderColor: null, TextHeaderHeight: null, TextHeaderFontString: null,
    DayDateActiveColor: null, DayDateActiveTextHeight: null,
    DayDateActiveTextFontString: null, DayDateInactiveTextColor: null,
    DayDateInactiveTextHeight: null, DayDateInactiveTextFontString: null,
    SelectedDayTextColor: null, SelectedDayTextHeight: null,
    SelectedDayTextFontString: null, SelectedDayHighLightColor: null,
    TodayTextColor: null, TodayTextHeight: null, TodayTextFontString: null,
    TodayHighLightColor: null, OnDayClickFunction: null,
    HeaderBackgroundColor: null, BodyBackgroundColor: null,
    MouseOverHightLightColor: null, MouseHoverDate: null,
    DayLabelTextColor: null, DayLabelTextHeight: null, Tag: null,
    DayLabelTextFontString: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        return createCalendar(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.VisibleMonth, this.VisibleYear, this.SelectedDay, this.DayCellWidth,
            this.DayCellHeight, this.HeaderHeight,
            this.HeaderBackgroundColor, this.BodyBackgroundColor, this.TextHeaderColor,
            this.TextHeaderHeight, this.TextHeaderFontString,
            this.DayDateActiveColor, this.DayDateActiveTextHeight,
            this.DayDateActiveTextFontString,
            this.DayDateInactiveTextColor, this.DayDateInactiveTextHeight,
            this.DayDateInactiveTextFontString, this.SelectedDayTextColor,
            this.SelectedDayTextHeight, this.SelectedDayTextFontString,
            this.SelectedDayHighLightColor, this.TodayTextColor,
            this.TodayTextHeight, this.TodayTextFontString, this.TodayHighLightColor,
            this.MouseOverHightLightColor,
            this.OnDayClickFunction, this.DayLabelTextColor, this.DayLabelTextHeight,
            this.DayLabelTextFontString, this.Tag, this.TabStopIndex);
    }
};

function createCalendar(canvasid, controlNameId, x, y, width, height, depth,
    visibleMonth, visibileYear, selectedDay, dayCellWidth, dayCellHeight, headerHeight,
    headerBackgroundColor, bodyBackgroundColor, textHeaderColor, textHeaderHeight,
    textHeaderFontString,
    dayDateActiveColor, dayDateActiveTextHeight, dayDateActiveTextFontString,
    dayDateInactiveTextColor, dayDateInactiveTextHeight, dayDateInactiveTextFontString,
    selectedDayTextColor, selectedDayTextHeight,
    selectedDayTextFontString, selectedDayHighLightColor, todayTextColor,
    todayTextHeight, todayTextFontString, todayHighLightColor,
    mouseoverHightlightColor, ondayClickFunction, dayLabelTextColor, dayLabelTextHeight,
    dayLabelTextFontString, tag, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'Calendar',
        controlNameId, null, tabstopindex);
    calendarPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height, VisibleMonth: visibleMonth, VisibleYear: visibileYear,
        SelectedDay: new Date(selectedDay), DayCellWidth: dayCellWidth,
        DayCellHeight: dayCellHeight, HeaderHeight: headerHeight,
        TextHeaderColor: textHeaderColor, TextHeaderHeight: textHeaderHeight,
        TextHeaderFontString: textHeaderFontString,
        DayDateActiveColor: dayDateActiveColor,
        DayDateActiveTextHeight: dayDateActiveTextHeight,
        DayDateActiveTextFontString: dayDateActiveTextFontString,
        DayDateInactiveTextColor: dayDateInactiveTextColor,
        DayDateInactiveTextHeight: dayDateInactiveTextHeight,
        DayDateInactiveTextFontString: dayDateInactiveTextFontString,
        SelectedDayTextColor: selectedDayTextColor,
        SelectedDayTextHeight: selectedDayTextHeight,
        SelectedDayTextFontString: selectedDayTextFontString,
        SelectedDayHighLightColor: selectedDayHighLightColor,
        TodayTextColor: todayTextColor, TodayTextHeight: todayTextHeight,
        TodayTextFontString: todayTextFontString,
        TodayHighLightColor: todayHighLightColor, OnDayClickFunction: ondayClickFunction,
        HeaderBackgroundColor: headerBackgroundColor,
        BodyBackgroundColor: bodyBackgroundColor,
        MouseOverHightLightColor: mouseoverHightlightColor,
        MouseHoverDate: null, ButtonClickExtents: null, DateClickExtents: null,
        DayLabelTextColor: dayLabelTextColor,
        DayLabelTextHeight: dayLabelTextHeight, Tag: tag,
        DayLabelTextFontString: dayLabelTextFontString
    });
    registerWindowDrawFunction(windowid, drawCalendar, canvasid);
    registerClickFunction(windowid, calendarClick, canvasid);
    registerMouseOverFunction(windowid, calendarMouseOver, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function getMonthName(x) {
    switch (x) {
        case 0:
            return 'January';
        case 1:
            return 'February';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        case 11:
            return 'December';
    }
}

function calendarClick(canvasid, windowid, e) {
    var calendarProps = getCalendarProps(canvasid, windowid);
    var x = e.calcX;
    var y = e.calcY;
    var visibleMonth = new Date('1 ' + calendarProps.VisibleMonth + ' ' +
        calendarProps.VisibleYear);
    for (var i = 0; i < calendarProps.ButtonClickExtents.length; i++) {
        if (x > calendarProps.ButtonClickExtents[i].X && x <
            calendarProps.ButtonClickExtents[i].X +
            calendarProps.ButtonClickExtents[i].Width &&
            y > calendarProps.ButtonClickExtents[i].Y &&
            y < calendarProps.ButtonClickExtents[i].Y +
            calendarProps.ButtonClickExtents[i].Height) {
            switch (i) {
                case 0:
                    if (visibleMonth.getMonth() === 0) {
                        calendarProps.VisibleMonth = 'December';
                        calendarProps.VisibleYear =
                            (parseInt(calendarProps.VisibleYear, 10) - 1).toString();
                    } else {
                        calendarProps.VisibleMonth =
                            getMonthName(visibleMonth.getMonth() - 1);
                    }
                    return;
                case 1:
                    if (visibleMonth.getMonth() === 11) {
                        calendarProps.VisibleMonth = 'January';
                        calendarProps.VisibleYear =
                            (parseInt(calendarProps.VisibleYear, 10) + 1).toString();
                    } else {
                        calendarProps.VisibleMonth = getMonthName(visibleMonth.getMonth() + 1);
                    }
                    return;
                case 2:
                    calendarProps.VisibleYear =
                        (parseInt(calendarProps.VisibleYear, 10) - 1).toString();
                    return;
                case 3:
                    calendarProps.VisibleYear =
                        (parseInt(calendarProps.VisibleYear, 10) + 1).toString();
                    return;
            }
        }
    }
    for (i = 0; i < calendarProps.DateClickExtents.length; i++) {
        if (x > calendarProps.DateClickExtents[i].X && x <
            calendarProps.DateClickExtents[i].X + calendarProps.DayCellWidth &&
            y > calendarProps.DateClickExtents[i].Y && y <
            calendarProps.DateClickExtents[i].Y + calendarProps.DayCellHeight) {
            calendarProps.SelectedDay = calendarProps.DateClickExtents[i].Date;
            if (calendarProps.OnDayClickFunction !== null &&
                calendarProps.OnDayClickFunction !== undefined) {
                calendarProps.OnDayClickFunction(calendarProps.CanvasID,
                    calendarProps.WindowID, calendarProps.SelectedDay);
            }
            return;
        }
    }
}

function calendarMouseOver(canvasid, windowid, e) {
    var calendarProps = getCalendarProps(canvasid, windowid);
    var x = e.calcX;
    var y = e.calcY;
    for (var i = 0; i < calendarProps.DateClickExtents.length; i++) {
        if (x > calendarProps.DateClickExtents[i].X && x <
            calendarProps.DateClickExtents[i].X + calendarProps.DayCellWidth &&
            y > calendarProps.DateClickExtents[i].Y && y <
            calendarProps.DateClickExtents[i].Y + calendarProps.DayCellHeight) {
            calendarProps.MouseHoverDate = calendarProps.DateClickExtents[i].Date;
            return;
        }
    }
}
