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

//DatePicker code starts here

var datePickerPropsArray = new Array();

function getDatePickerPropsByTextBoxAreaWindowID(canvasid, windowid) {
    for (var i = 0; i < datePickerPropsArray.length; i++) {
        if (datePickerPropsArray[i].CanvasID === canvasid &&
            datePickerPropsArray[i].TextBoxAreaWindowID === windowid) {
            return datePickerPropsArray[i];
        }
    }
}

function getDatePickerPropsByButtonWindowID(canvasid, windowid) {
    for (var i = 0; i < datePickerPropsArray.length; i++) {
        if (datePickerPropsArray[i].CanvasID === canvasid &&
            datePickerPropsArray[i].ButtonWindowID === windowid) {
            return datePickerPropsArray[i];
        }
    }
}

function getDatePickerPropsByCalendarWindowID(canvasid, windowid) {
    for (var i = 0; i < datePickerPropsArray.length; i++) {
        if (datePickerPropsArray[i].CanvasID === canvasid &&
            datePickerPropsArray[i].CalendarWindowID === windowid) {
            return datePickerPropsArray[i];
        }
    }
}

function DatePicker() { }

DatePicker.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, TextBoxAreaTextColor: null,
    TextBoxAreaTextHeight: null, TextBoxAreaTextFontString: null,
    ControlNameID: null, Depth: null, TabStopIndex: null, VisibleMonth: null, VisibleYear: null,
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
    DayLabelTextColor: null, DayLabelTextHeight: null, Tag: null, DayLabelTextFontString: null,
    CalendarHeight: null,

    Initialize: function () {
        return createDatePicker(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.VisibleMonth, this.VisibleYear, this.SelectedDay, this.DayCellWidth,
            this.DayCellHeight,
            this.HeaderHeight, this.HeaderBackgroundColor, this.BodyBackgroundColor,
            this.TextHeaderColor,
            this.TextHeaderHeight, this.TextHeaderFontString, this.DayDateActiveColor,
            this.DayDateActiveTextHeight,
            this.DayDateActiveTextFontString, this.DayDateInactiveTextColor,
            this.DayDateInactiveTextHeight,
            this.DayDateInactiveTextFontString, this.SelectedDayTextColor,
            this.SelectedDayTextHeight,
            this.SelectedDayTextFontString, this.SelectedDayHighLightColor,
            this.TodayTextColor, this.TodayTextHeight,
            this.TodayTextFontString, this.TodayHighLightColor,
            this.MouseOverHightLightColor, this.OnDayClickFunction,
            this.DayLabelTextColor, this.DayLabelTextHeight,
            this.DayLabelTextFontString, this.TextBoxAreaTextColor,
            this.TextBoxAreaTextHeight, this.TextBoxAreaTextFontString,
            this.CalendarHeight, this.Tag, this.TabStopIndex);
    }
};

function createDatePicker(canvasid, controlNameId, x, y, width, height, depth,
    visibleMonth, visibileYear, selectedDay, dayCellWidth, dayCellHeight, headerHeight,
    headerBackgroundColor, bodyBackgroundColor, textHeaderColor, textHeaderHeight,
    textHeaderFontString,
    dayDateActiveColor, dayDateActiveTextHeight, dayDateActiveTextFontString,
    dayDateInactiveTextColor, dayDateInactiveTextHeight, dayDateInactiveTextFontString,
    selectedDayTextColor, selectedDayTextHeight,
    selectedDayTextFontString, selectedDayHighLightColor, todayTextColor,
    todayTextHeight, todayTextFontString, todayHighLightColor,
    mouseoverHightlightColor, ondayClickFunction, dayLabelTextColor, dayLabelTextHeight,
    dayLabelTextFontString, textboxAreaTextColor,
    textboxAreaTextHeight, textboxAreaTextFontString, calendarHeight, tag,
    tabstopindex) {
    var textboxAreaWindowID = createWindow(canvasid, x, y, width - height, height,
        depth, null, 'DatePickerTextArea', controlNameId + 'DatePickerTextArea');
    var buttonWindowID = createWindow(canvasid, x + width - height, y, height, height,
        depth, null, 'DatePickerButton', controlNameId + 'DatePickerButton');
    var calendarWindowID = createCalendar(canvasid, controlNameId +
        'DatePickerCalendar', x, y + height, width, calendarHeight, depth,
        visibleMonth, visibileYear, selectedDay,
        dayCellWidth, dayCellHeight, headerHeight,
        headerBackgroundColor, bodyBackgroundColor, textHeaderColor, textHeaderHeight,
        textHeaderFontString,
        dayDateActiveColor, dayDateActiveTextHeight, dayDateActiveTextFontString,
        dayDateInactiveTextColor, dayDateInactiveTextHeight, dayDateInactiveTextFontString,
        selectedDayTextColor, selectedDayTextHeight,
        selectedDayTextFontString, selectedDayHighLightColor, todayTextColor,
        todayTextHeight, todayTextFontString, todayHighLightColor,
        mouseoverHightlightColor, function () {
            var datePickerProps = getDatePickerPropsByTextBoxAreaWindowID(canvasid,
                textboxAreaWindowID);
            var calendarProps = getCalendarProps(canvasid, datePickerProps.CalendarWindowID);
            if (ondayClickFunction !== null && ondayClickFunction !== undefined) {
                ondayClickFunction(canvasid, datePickerProps.CalendarWindowID,
                    calendarProps.SelectedDay);
            }
            setHiddenWindowStatus(canvasid, datePickerProps.CalendarWindowID, 1);
            invalidateRect(canvasid, null, x, y, width, height);
        }, dayLabelTextColor, dayLabelTextHeight, dayLabelTextFontString);
    datePickerPropsArray.push({
        CanvasID: canvasid, WindowID: textboxAreaWindowID,
        TextBoxAreaWindowID: textboxAreaWindowID, ButtonWindowID: buttonWindowID,
        CalendarWindowID: calendarWindowID, X: x, Y: y, Width: width,
        Height: height, TextBoxAreaTextColor: textboxAreaTextColor,
        TextBoxAreaTextHeight: textboxAreaTextHeight,
        TextBoxAreaTextFontString: textboxAreaTextFontString, Tag: tag
    });
    registerModalWindow(canvasid, calendarWindowID);
    registerHiddenWindow(canvasid, calendarWindowID, 1);
    registerClickFunction(buttonWindowID, function (canvasid2, windowid2) {
        var datePickerProps = getDatePickerPropsByButtonWindowID(canvasid2, windowid2);
        if (checkIfHiddenWindow(canvasid, datePickerProps.CalendarWindowID) === 1) {
            setHiddenWindowStatus(canvasid, datePickerProps.CalendarWindowID, 0);
        } else {
            setHiddenWindowStatus(canvasid, datePickerProps.CalendarWindowID, 1);
        }
        var dropdowncalprops = getCalendarProps(canvasid2, datePickerProps.CalendarWindowID);
        invalidateRect(canvasid2, null, dropdowncalprops.X, dropdowncalprops.Y,
            dropdowncalprops.Width, dropdowncalprops.Height);
    }, canvasid);
    registerWindowDrawFunction(textboxAreaWindowID, function (canvasid3, windowid3) {
        var datePickerProps = getDatePickerPropsByTextBoxAreaWindowID(canvasid3, windowid3);
        var calendarProps = getCalendarProps(canvasid3, datePickerProps.CalendarWindowID);
        var ctx = getCtx(canvasid3);
        ctx.strokeStyle = '#a3aeb9';
        ctx.beginPath();
        ctx.rect(datePickerProps.X, datePickerProps.Y, datePickerProps.Width -
            datePickerProps.Height, datePickerProps.Height);
        ctx.stroke();
        if (calendarProps.SelectedDay !== null) {
            ctx.fillStyle = datePickerProps.TextBoxAreaTextColor;
            ctx.font = datePickerProps.TextBoxAreaTextFontString;
            var seldaystr = calendarProps.SelectedDay.getDate().toString() +
                '/' + (calendarProps.SelectedDay.getMonth() + 1).toString() +
                '/' + calendarProps.SelectedDay.getFullYear().toString();
            ctx.fillText(seldaystr, datePickerProps.X + 4, datePickerProps.Y +
                datePickerProps.Height -
                (datePickerProps.Height - datePickerProps.TextBoxAreaTextHeight) / 2);
        }
    }, canvasid);
    registerWindowDrawFunction(buttonWindowID, function (canvasid4, windowid4) {
        var datePickerProps = getDatePickerPropsByButtonWindowID(canvasid4, windowid4);
        var ctx = getCtx(canvasid4);
        ctx.lineCap = 'butt';
        ctx.strokeStyle = '#3c7fb1';
        ctx.beginPath();
        ctx.rect(datePickerProps.X + datePickerProps.Width - datePickerProps.Height,
            datePickerProps.Y, datePickerProps.Height, datePickerProps.Height);
        ctx.stroke();
        ctx.fillStyle = '#dcf0fb';
        ctx.beginPath();
        ctx.rect(datePickerProps.X + datePickerProps.Width - datePickerProps.Height +
            1, datePickerProps.Y + 1, datePickerProps.Height / 2 - 2,
            datePickerProps.Height - 2);
        ctx.fill();
        ctx.strokeStyle = '#c0e4f8';
        ctx.moveTo(datePickerProps.X + datePickerProps.Width - datePickerProps.Height
            / 2 + 1, datePickerProps.Y + 1);
        ctx.lineTo(datePickerProps.X + datePickerProps.Width - datePickerProps.Height
            / 2 + 1, datePickerProps.Y + datePickerProps.Height - 1);
        ctx.stroke();
        ctx.fillStyle = '#a7d8f3';
        ctx.beginPath();
        ctx.rect(datePickerProps.X + datePickerProps.Width - datePickerProps.Height
            / 2 + 1, datePickerProps.Y + 1,
            datePickerProps.Height / 2 - 2, datePickerProps.Height - 2);
        ctx.fill();
        var g = ctx.createLinearGradient(datePickerProps.X + datePickerProps.Width -
            datePickerProps.Height / 2 - 1, datePickerProps.Y +
            datePickerProps.Height / 2 - 1,
            datePickerProps.X + datePickerProps.Width - datePickerProps.Height / 2 -
            1, datePickerProps.Y + datePickerProps.Height / 2 + 3);
        g.addColorStop(0, '#0d2a3a');
        g.addColorStop(1, '#4e9ac4');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(datePickerProps.X + datePickerProps.Width -
            datePickerProps.Height / 2 - 4, datePickerProps.Y +
            datePickerProps.Height / 2 - 1);
        ctx.lineTo(datePickerProps.X + datePickerProps.Width -
            datePickerProps.Height / 2 + 3, datePickerProps.Y +
            datePickerProps.Height / 2 - 1);
        ctx.lineTo(datePickerProps.X + datePickerProps.Width -
            datePickerProps.Height / 2 - 1, datePickerProps.Y +
            datePickerProps.Height / 2 + 3);
        ctx.closePath();
        ctx.fill();
    }, canvasid);
    registerModalWindow(canvasid, calendarWindowID);
    registerHiddenWindow(canvasid, calendarWindowID, 1);
    registerLostFocusFunction(canvasid, calendarWindowID, function () {
        datePickerCalendarWindowLostFocus(canvasid, calendarWindowID);
    });
    registerLostFocusFunction(canvasid, textboxAreaWindowID, function () {
        datePickerTextBoxWindowLostFocus(canvasid, textboxAreaWindowID);
    });
    registerLostFocusFunction(canvasid, buttonWindowID, function () {
        datePickerButtonLostFocus(canvasid, buttonWindowID);
    });
    return textboxAreaWindowID;
}

function datePickerCalendarWindowLostFocus(canvasid, windowid) {
    var datePickerProps = getDatePickerPropsByCalendarWindowID(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, datePickerProps.TextBoxAreaWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, datePickerProps.ButtonWindowID) === 0 &&
        doingEventForWindowID !== datePickerProps.CalendarWindowID) {
        setHiddenWindowStatus(canvasid, datePickerProps.CalendarWindowID, 1);
    }
}

function datePickerTextBoxWindowLostFocus(canvasid, windowid) {
    var datePickerProps = getDatePickerPropsByTextBoxAreaWindowID(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, datePickerProps.CalendarWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, datePickerProps.ButtonWindowID) === 0 &&
        doingEventForWindowID !== datePickerProps.CalendarWindowID) {
        setHiddenWindowStatus(canvasid, datePickerProps.CalendarWindowID, 1);
    }
}

function datePickerButtonLostFocus(canvasid, windowid) {
    var datePickerProps = getDatePickerPropsByButtonWindowID(canvasid, windowid);
    if (doesWindowHaveFocus(canvasid, datePickerProps.CalendarWindowID) === 0 &&
        doesWindowHaveFocus(canvasid, datePickerProps.TextBoxAreaWindowID) === 0 &&
        doingEventForWindowID !== datePickerProps.CalendarWindowID) {
        setHiddenWindowStatus(canvasid, datePickerProps.CalendarWindowID, 1);
    }
}

