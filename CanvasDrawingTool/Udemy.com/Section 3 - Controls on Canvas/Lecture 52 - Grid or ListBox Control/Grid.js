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

//Code for Listbox starts here

var gridPropsArray = new Array();

//Support function that returns the grid properties for the specified grid which is identified
//by the unique combination of canvasid and windowid
function getGridProps(canvasid, windowid) {
    for (var i = 0; i < gridPropsArray.length; i++) {
        if (gridPropsArray[i].CanvasID === canvasid &&
            gridPropsArray[i].WindowID === windowid) {
            return gridPropsArray[i];
        }
    }
}

//This part is for people who prefer the object dot property notation instead of very long
//function parameters calls.  This notation is also much easier to read.
function Grid() { }

Grid.prototype = {
    CanvasID: null, WindowID: null,
    X: null, Y: null,
    Width: null, Height: null,
    RowData: null, HeaderData: null,
    RowDataTextColor: null,
    RowDataTextFontString: null, HeaderDataTextColor: null,
    HeaderDataTextHeight: null, HeaderDataTextFontString: null,
    CellClickFunction: null, DataRowHeight: null,
    ColumnWidthArray: null, HeaderRowHeight: null,
    HasBorder: null, BorderColor: null,
    BorderLineWidth: null, VScrollBarWindowId: null,
    HScrollBarWindowId: null, HeaderBackgroundStartColor: null,
    HeaderBackgroundEndColor: null, AltRowBgColorStart1: null,
    AltRowBgColorEnd1: null, AltRowBgColorStart2: null,
    AltRowBgColorEnd2: null, Tag: null,
    HasSelectedRow: null, SelectedRowBgColor: null, HasSelectedCell: null,
    SelectedCellBgColor: null, SelectedRow: null, SelectedCell: null,
    HasSorting: null, SortableColumnsArray: null, HasSortImages: null,
    SortImageURLsArray: null, SortImageShowIndex: null, SortedData: null,
    CustomSortFunction: null, HasFilters: null, FilterColumnsArray: null,
    HasFilterImageIcon: null, FilterImageIcon: null, FilteredData: null,
    SortClickExtents: null, HasUIDs: null, UIDs: null,
    ControlNameID: null, DrawHeaderCellFunction: null,
    DrawRowDataCellFunction: null, RowDataTextHeight: null, Depth: null,
    TabStopIndex: null,

    Initialize: function () {
        return createGrid(this.CanvasID, this.ControlNameID, this.X, this.Y, this.Width,
            this.Height, this.Depth, this.RowData, this.HeaderData, this.RowDataTextColor,
            this.RowDataTextHeight, this.RowDataTextFontString, this.HeaderDataTextColor,
            this.HeaderDataTextHeight, this.HeaderDataTextFontString, this.DrawRowDataCellFunction,
            this.DrawHeaderCellFunction, this.CellClickFunction, this.DataRowHeight,
            this.HeaderRowHeight, this.ColumnWidthArray, this.HasBorder, this.BorderColor,
            this.BorderLineWidth, this.HeaderBackgroundStartColor, this.HeaderBackgroundEndColor,
            this.AltRowBgColorStart1, this.AltRowBgColorEnd1, this.AltRowBgColorStart2,
            this.AltRowBgColorEnd2, this.Tag, this.HasSelectedRow, this.SelectedRowBgColor,
            this.HasSelectedCell, this.SelectedCellBgColor, this.HasSorting,
            this.SortableColumnsArray, this.HasSortImages, this.SortImageURLsArray,
            this.SortImageShowIndex, this.CustomSortFunction, this.HasUIDs, this.UIDs,
            this.HasFilters, this.FilterColumnsArray, this.HasFilterImageIcon, this.FilterImageIcon,
            this.TabStopIndex);
    }
};

//sortableColumnsArray format - 0: Column Index; Type of sort - Alphabetical, Numerical, Date,
//      Custom; Direction Ascending Descending, Unsorted
//sortImageURLsArray - the image that will be displayed is the image url index given by sortImageShowIndex
//filterColumnsArray format - 0: Column Index; Type of filter - Unique values, Custom; 
//There will be a remove all filters function and checkboxes per value to filter on
function createGrid(canvasid, controlNameId, x, y, width, height, depth, rowData, headerData,
    rowDataTextColor, rowDataTextHeight, rowDataTextFontString, headerDataTextColor,
    headerDataTextHeight, headerDataTextFontString, drawRowDataCellFunction,
    drawHeaderCellFunction, cellClickFunction, dataRowHeight, headerRowHeight, columnWidthArray,
    hasBorder, borderColor, borderLineWidth, headerbackgroundstartcolor, headerbackgroundendcolor,
    altrowbgcolorstart1, altrowbgcolorend1, altrowbgcolorstart2, altrowbgcolorend2, tag,
    hasSelectedRow, selectedRowBgColor, hasSelectedCell, selectedCellBgColor, hasSorting,
    sortableColumnsArray, hasSortImages, sortImageURLsArray,
    sortImageShowIndex, customSortFunction, hasuids, uids, hasFilters, filterColumnsArray,
    hasFilterImageIcon, filterImageIcon, tabstopindex) {

    //First thing create the window for the control drawing space and store the handle id
    var windowid = createWindow(canvasid, x, y, width, height, depth, null, 'Grid', controlNameId,
        null, tabstopindex);

    //Add up the column widths supplied by the user to find out how much is the width of all 
    //the columns totally
    var effectiveWidth = 0;
    for (var i = 0; i < columnWidthArray.length; i++) {
        effectiveWidth += columnWidthArray[i];
    }

    //Calculate the actual height of all rows.
    var effectiveHeight = headerRowHeight + dataRowHeight * rowData.length;

    var vscrollBarWindowId = null;

    //If the total height of all rows of data is greater than the window control height specified
    //by the user then create a vertical scroll bar control.
    if (effectiveHeight > height) {
        vscrollBarWindowId = createScrollBar(canvasid, controlNameId + 'VS', x + width, y, height,
            depth, rowData.length, 1, windowid);
    }

    var hscrollBarWindowId = null;

    //If the total columns width is greater than the window control width specified by the user then
    //create a horizontal scroll bar control
    if (effectiveWidth > width) {
        hscrollBarWindowId = createScrollBar(canvasid, controlNameId + 'HS', x, y + height, width,
            depth, columnWidthArray.length, 0, windowid);
    }

    //Store all the user given properties and additional generated properties which will be used
    //throughout the grid code
    gridPropsArray.push({
        CanvasID: canvasid, WindowID: windowid,
        X: x, Y: y,
        Width: width, Height: height,
        RowData: rowData, HeaderData: headerData,
        RowDataTextColor: rowDataTextColor,
        RowDataTextFontString: rowDataTextFontString, HeaderDataTextColor: headerDataTextColor,
        HeaderDataTextHeight: headerDataTextHeight,
        HeaderDataTextFontString: headerDataTextFontString,
        CellClickFunction: cellClickFunction, DataRowHeight: dataRowHeight,
        ColumnWidthArray: columnWidthArray, HeaderRowHeight: headerRowHeight,
        HasBorder: hasBorder,
        BorderColor: borderColor, BorderLineWidth: borderLineWidth,
        VScrollBarWindowId: vscrollBarWindowId,
        HScrollBarWindowId: hscrollBarWindowId,
        HeaderBackgroundStartColor: headerbackgroundstartcolor,
        HeaderBackgroundEndColor: headerbackgroundendcolor,
        AltRowBgColorStart1: altrowbgcolorstart1,
        AltRowBgColorEnd1: altrowbgcolorend1, AltRowBgColorStart2: altrowbgcolorstart2,
        AltRowBgColorEnd2: altrowbgcolorend2, Tag: tag, HasSelectedRow: hasSelectedRow,
        SelectedRowBgColor: selectedRowBgColor, HasSelectedCell: hasSelectedCell,
        SelectedCellBgColor: selectedCellBgColor, SelectedRow: -1, SelectedCell: -1,
        HasSorting: hasSorting, SortableColumnsArray: sortableColumnsArray,
        HasSortImages: hasSortImages,
        SortImageURLsArray: sortImageURLsArray, SortImageShowIndex: sortImageShowIndex,
        SortedData: rowData,
        CustomSortFunction: customSortFunction, HasFilters: hasFilters,
        FilterColumnsArray: filterColumnsArray,
        HasFilterImageIcon: hasFilterImageIcon, FilterImageIcon: filterImageIcon,
        FilteredData: rowData,
        SortClickExtents: new Array(), HasUIDs: hasuids, OrigUIDs: uids, SortedUIDs: uids,
        DrawHeaderCellFunction: drawHeaderCellFunction,
        DrawRowDataCellFunction: drawRowDataCellFunction,
        RowDataTextHeight: rowDataTextHeight
    });

    //Grab the gridprops given the canvasid and windowid and sort the grid data if user wants
    if (hasSorting === 1 && checkIfAllUnsorted(getGridProps(canvasid, windowid)) === 0) {
        if (customSortFunction !== null) {
            customSortFunction(getGridProps(canvasid, windowid));
        } else {
            sortGridData(getGridProps(canvasid, windowid));
        }
    }

    //Register the drawing function for the grid
    registerWindowDrawFunction(windowid, drawGrid, canvasid);

    //Register the click function for the grid
    registerClickFunction(windowid, clickGrid, canvasid);

    //If a tabstop value was specified then the grid is editable i.e. you can type
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }

    //Return the window id handle which can be used by user side code to manipulate
    //the grid via the grid properties
    return windowid;
}

//This draws the grid
function drawGrid(canvasid, windowid) {

    //Get the grid properties which holds all the information about how to draw the grid
    var gridProps = getGridProps(canvasid, windowid);

    //Get the vertical scrollbar properties to check which rows to display
    var vscrollBarProps = getScrollBarProps(canvasid, gridProps.VScrollBarWindowId);

    //Get the horizontal scrollbar properties to check which columns to display
    var hscrollBarProps = getScrollBarProps(canvasid, gridProps.HScrollBarWindowId);

    //Get the drawing context for the canvas the grid is on
    var ctx = getCtx(canvasid);

    //Get the starting row value from the vertical scrollbar properties if it exists
    var startRow = 0;
    if (vscrollBarProps !== undefined) {
        startRow = vscrollBarProps.SelectedID;
    }

    //Get the starting column value from the horizontal scrollbar properties if it exists
    var startCol = 0;
    if (hscrollBarProps !== undefined) {
        startCol = hscrollBarProps.SelectedID;
    }

    //Keep track of the total width currently
    var totalWidth = 0;

    //The sort click extents gives the coordinates of the cells
    gridProps.SortClickExtents = new Array();

    //Iterate from the starting column calculated. It will be zero if no horizontal scrollbar
    //offset
    for (var c = startCol; c < gridProps.ColumnWidthArray.length; c++) {

        //If the current total width running is more than the width of the grid controls
        //window no need to draw so break out of loop.
        if (totalWidth >= gridProps.Width) {
            break;
        }

        //Add the current columns width to the total width being tracked
        totalWidth += gridProps.ColumnWidthArray[c];

        //Create a linear gradient color for the header background
        var g = ctx.createLinearGradient(gridProps.X + totalWidth -
            gridProps.ColumnWidthArray[c], gridProps.Y,
            gridProps.X + totalWidth - gridProps.ColumnWidthArray[c],
            gridProps.Y + gridProps.HeaderRowHeight);
        g.addColorStop(0, gridProps.HeaderBackgroundStartColor);
        g.addColorStop(1, gridProps.HeaderBackgroundEndColor);
        ctx.fillStyle = g;

        //Draw the header background
        ctx.beginPath();
        ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c], gridProps.Y,
            totalWidth > gridProps.Width ? gridProps.ColumnWidthArray[c] + gridProps.Width -
                totalWidth : gridProps.ColumnWidthArray[c], gridProps.HeaderRowHeight);
        ctx.fill();
        ctx.save();

        //Create a drawing clipping region for the cell which is a rectangle
        ctx.beginPath();
        ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c], gridProps.Y,
            totalWidth > gridProps.Width ? gridProps.ColumnWidthArray[c] + gridProps.Width -
                totalWidth : gridProps.ColumnWidthArray[c], gridProps.HeaderRowHeight);
        ctx.clip();

        //Setup the font and text color for the header text and draw the text in the cell
        ctx.fillStyle = gridProps.HeaderDataTextColor;
        ctx.font = gridProps.HeaderDataTextFontString;
        ctx.fillText(gridProps.HeaderData[c], gridProps.X + totalWidth -
            gridProps.ColumnWidthArray[c],
            gridProps.Y +
            gridProps.HeaderRowHeight - (gridProps.HeaderRowHeight -
                gridProps.HeaderDataTextHeight) / 2);
        //Remove the clipping region for the current cell
        ctx.restore();

        //Draw the border for the cell if it has one specified by the user
        if (gridProps.HasBorder === 1) {
            ctx.strokeStyle = gridProps.BorderColor;
            ctx.lineWidth = gridProps.BorderLineWidth;
            ctx.beginPath();
            ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c], gridProps.Y,
                gridProps.ColumnWidthArray[c] + gridProps.Width - totalWidth,
                gridProps.HeaderRowHeight);
            ctx.stroke();
        }

        //Draw box of white line around cell and set the sort click extents
        var gcc = getGridSortedColumnIndex(gridProps, c);
        if (gridProps.HasSorting === 1 && gcc > -1) {
            var offsetY = gridProps.Y + (gridProps.HeaderRowHeight - 9) / 2;
            if (gridProps.SortableColumnsArray[gcc][2] === "Ascending") {
                ctx.strokeStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.moveTo(gridProps.X + totalWidth - 6, offsetY + 3);
                ctx.lineTo(gridProps.X + totalWidth - 6, offsetY + 12);
                ctx.lineTo(gridProps.X + totalWidth - 9, offsetY + 9);
                ctx.moveTo(gridProps.X + totalWidth - 2, offsetY + 9);
                ctx.lineTo(gridProps.X + totalWidth - 6, offsetY + 12);
                ctx.stroke();
                gridProps.SortClickExtents.push([c, gridProps.X + totalWidth - 9,
                    offsetY + 3, 7, 9]);
            } else if (gridProps.SortableColumnsArray[gcc][2] === "Descending") {
                ctx.strokeStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.moveTo(gridProps.X + totalWidth - 6, offsetY + 12);
                ctx.lineTo(gridProps.X + totalWidth - 6, offsetY + 3);
                ctx.lineTo(gridProps.X + totalWidth - 9, offsetY + 5);
                ctx.moveTo(gridProps.X + totalWidth - 2, offsetY + 5);
                ctx.lineTo(gridProps.X + totalWidth - 6, offsetY + 3);
                ctx.stroke();
                gridProps.SortClickExtents.push([c, gridProps.X + totalWidth - 9,
                    offsetY + 3, 7, 9]);
            } else if (gridProps.SortableColumnsArray[gcc][2] === "Unsorted") {
                ctx.strokeStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.rect(gridProps.X + totalWidth - 11, offsetY + 3, 9, 9);
                ctx.stroke();
                gridProps.SortClickExtents.push([c, gridProps.X + totalWidth - 11,
                    offsetY + 3, 9, 9]);
            }
        }
    }

    //Start up the alternating row value and draw out the rows
    var altrow = 0;
    for (var r = startRow; r < (gridProps.HasSorting === 1 ? gridProps.SortedData.length :
        gridProps.RowData.length); r++) {

        //If the rows are out of bounds of the viewing area stop drawing.
        if ((r - startRow) * gridProps.DataRowHeight + gridProps.HeaderRowHeight
            >= gridProps.Height) {
            break;
        }

        //This is same as before for column headers
        totalWidth = 0;
        for (c = startCol; c < gridProps.ColumnWidthArray.length; c++) {
            if (totalWidth >= gridProps.Width) {
                break;
            }
            totalWidth += gridProps.ColumnWidthArray[c];
            ctx.save();
            ctx.beginPath();
            ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c], gridProps.Y +
                (r - startRow) * gridProps.DataRowHeight + gridProps.HeaderRowHeight,
                totalWidth > gridProps.Width ? gridProps.ColumnWidthArray[c] + gridProps.Width -
                    totalWidth : gridProps.ColumnWidthArray[c], gridProps.DataRowHeight);
            ctx.clip();
            var g2 = ctx.createLinearGradient(gridProps.X + totalWidth -
                gridProps.ColumnWidthArray[c],
                gridProps.Y + (r - startRow) * gridProps.DataRowHeight +
                gridProps.HeaderRowHeight,
                gridProps.X + totalWidth - gridProps.ColumnWidthArray[c],
                gridProps.Y + (r - startRow) *
                    gridProps.DataRowHeight + gridProps.HeaderRowHeight +
                gridProps.DataRowHeight);
            if (altrow === 0) {
                g2.addColorStop(0, gridProps.AltRowBgColorStart1);
                g2.addColorStop(1, gridProps.AltRowBgColorEnd1);
            } else {
                g2.addColorStop(0, gridProps.AltRowBgColorStart2);
                g2.addColorStop(1, gridProps.AltRowBgColorEnd2);
            }
            ctx.fillStyle = g2;
            ctx.beginPath();
            ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c],
                gridProps.Y + (r - startRow) *
                    gridProps.DataRowHeight + gridProps.HeaderRowHeight,
                totalWidth > gridProps.Width ?
                    gridProps.ColumnWidthArray[c] + gridProps.Width - totalWidth :
                    gridProps.ColumnWidthArray[c], gridProps.DataRowHeight);
            ctx.fill();

            //If the row is selected then draw it differently according to user specifications
            if (gridProps.HasSelectedRow === 1 && gridProps.SelectedRowBgColor &&
                r === gridProps.SelectedRow) {
                ctx.fillStyle = gridProps.SelectedRowBgColor;
                ctx.beginPath();
                ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c],
                    gridProps.Y +
                    (r - startRow) * gridProps.DataRowHeight +
                    gridProps.HeaderRowHeight,
                    totalWidth > gridProps.Width ? gridProps.ColumnWidthArray[c] +
                        gridProps.Width -
                        totalWidth : gridProps.ColumnWidthArray[c],
                    gridProps.DataRowHeight);
                ctx.fill();
            }

            //If the cell is selected then draw it differently according to user specifications
            if (gridProps.HasSelectedCell === 1 && gridProps.SelectedCellBgColor &&
                c === gridProps.SelectedCell) {
                ctx.fillStyle = gridProps.SelectedCellBgColor;
                ctx.beginPath();
                ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c],
                    gridProps.Y +
                    (r - startRow) * gridProps.DataRowHeight - (gridProps.DataRowHeight -
                        gridProps.HeaderDataTextHeight) / 2 + gridProps.HeaderRowHeight +
                    gridProps.DataRowHeight, gridProps.ColumnWidthArray[c],
                    gridProps.DataRowHeight);
                ctx.fill();
            }

            //Choose to draw out either the sorted data value or the original unsorted data value
            ctx.beginPath();
            if ((gridProps.HasSorting === 1 ? gridProps.SortedData : gridProps.RowData)[r][c]) {
                ctx.fillStyle = gridProps.RowDataTextColor;
                ctx.font = gridProps.RowDataTextFontString;
                ctx.fillText((gridProps.HasSorting === 1 ? gridProps.SortedData :
                    gridProps.RowData)[r][c], gridProps.X + totalWidth -
                    gridProps.ColumnWidthArray[c], gridProps.Y + (r - startRow) *
                        gridProps.DataRowHeight
                    - (gridProps.DataRowHeight - gridProps.HeaderDataTextHeight) / 2 +
                    gridProps.HeaderRowHeight + gridProps.DataRowHeight);
            }

            //Remove the cell drawing bounds clipping
            ctx.restore();

            //Draw border around data cell
            if (gridProps.HasBorder === 1) {
                ctx.strokeStyle = gridProps.BorderColor;
                ctx.lineWidth = gridProps.BorderLineWidth;
                ctx.beginPath();
                ctx.rect(gridProps.X + totalWidth - gridProps.ColumnWidthArray[c], gridProps.Y +
                    (r - startRow) * gridProps.DataRowHeight + gridProps.HeaderRowHeight,
                    gridProps.ColumnWidthArray[c] + gridProps.Width - totalWidth,
                    gridProps.DataRowHeight);
                ctx.stroke();
            }
        }

        //Toggle the alternate row so it can be drawn differently
        if (altrow === 1) {
            altrow = 0;
        } else {
            altrow = 1;
        }
    }
}

//This is called whenever the grid control window is clicked
function clickGrid(canvasid, windowid, e) {

    //Get the grid properties as always
    var gridProps = getGridProps(canvasid, windowid);

    //Get the vertical and horizontal scrollbar properties for the offset row and column
    var vscrollBarProps = getScrollBarProps(canvasid, gridProps.VScrollBarWindowId);
    var hscrollBarProps = getScrollBarProps(canvasid, gridProps.HScrollBarWindowId);

    //Calculate the canvas coordinates of the mouse click
    var x = e.calcX;
    var y = e.calcY;

    var startRow = 0;
    if (vscrollBarProps !== undefined) {
        startRow = vscrollBarProps.SelectedID;
    }
    var startCol = 0;
    if (hscrollBarProps !== undefined) {
        startCol = hscrollBarProps.SelectedID;
    }

    //Loop through the rows looking for hit on click
    for (var r = startRow; r < gridProps.RowData.length; r++) {

        //Same as draw only do so much within windows of view of the grid control and not
        //for all the rows and columns
        if ((r - startRow) * gridProps.DataRowHeight + gridProps.HeaderRowHeight
            >= gridProps.Height) {
            break;
        }

        //Loop through the columns looking for hit of the mouse click on cell
        var totalWidth = 0;
        for (var c = startCol; c < gridProps.ColumnWidthArray.length; c++) {
            if (totalWidth >= gridProps.Width) {
                break;
            }
            totalWidth += gridProps.ColumnWidthArray[c];

            //Essentially this if checks if the mouse click is on the cell bounds and if it
            //is then set the selected row and column and call the custom click function
            //if any with the cell and row values passed to it
            if (x > gridProps.X + totalWidth - gridProps.ColumnWidthArray[c] &&
                y > gridProps.Y +
                (r - startRow) * gridProps.DataRowHeight + gridProps.HeaderRowHeight && x <
            gridProps.X + totalWidth - gridProps.ColumnWidthArray[c] +
            (totalWidth > gridProps.Width ?
                    gridProps.ColumnWidthArray[c] + gridProps.Width - totalWidth :
                    gridProps.ColumnWidthArray[c]) && y < gridProps.DataRowHeight +
                    gridProps.Y +
                    (r - startRow) * gridProps.DataRowHeight + gridProps.HeaderRowHeight) {
                gridProps.SelectedRow = r;
                gridProps.SelectedCell = c;
                if (gridProps.CellClickFunction) {
                    gridProps.CellClickFunction(canvasid, windowid, c + 1, r + 1);
                }
                return;
            }
        }
    }

    //Change the sorting if any if the mouse click is in the sort click extents for the column
    var sortingChanged = 0;
    if (gridProps.HasSorting === 1) {
        for (var i = 0; i < gridProps.SortClickExtents.length; i++) {
            if (x > gridProps.SortClickExtents[i][1] && x < gridProps.SortClickExtents[i][1] +
                gridProps.SortClickExtents[i][3] && y > gridProps.SortClickExtents[i][2] &&
                y < gridProps.SortClickExtents[i][2] + gridProps.SortClickExtents[i][4]) {
                for (var j = 0; j < gridProps.SortableColumnsArray.length; j++) {
                    if (gridProps.SortableColumnsArray[j][0] === gridProps.SortClickExtents[i][0]) {
                        if (gridProps.SortableColumnsArray[j][2] === "Unsorted") {
                            gridProps.SortableColumnsArray[j][2] = "Ascending";
                            sortingChanged = 1;
                        } else if (gridProps.SortableColumnsArray[j][2] === "Ascending") {
                            gridProps.SortableColumnsArray[j][2] = "Descending";
                            sortingChanged = 1;
                        } else if (gridProps.SortableColumnsArray[j][2] === "Descending") {
                            gridProps.SortableColumnsArray[j][2] = "Unsorted";
                            sortingChanged = 1;
                        }
                    }
                }
            }
        }
    }

    //Call the custom sorting function if any or do the default sort
    if (sortingChanged === 1) {
        if (gridProps.CustomSortFunction !== null) {
            gridProps.CustomSortFunction(gridProps);
        } else {
            sortGridData(gridProps);
        }
        invalidateRect(gridProps.CanvasID, null, gridProps.X, gridProps.Y,
            gridProps.Width, gridProps.Height);
    }
}

//Returns the column according to an index if it is in the list of sortable columns
function getGridSortedColumnIndex(gridProps, c) {
    if (gridProps.SortableColumnsArray) {
        for (var i = 0; i < gridProps.SortableColumnsArray.length; i++) {
            if (gridProps.SortableColumnsArray[i][0] === c) {
                return i;
            }
        }
    }
    return -1;
}

//Function name is self explanatory
function checkIfAllUnsorted(gridProps) {
    for (var i = 0; i < gridProps.SortableColumnsArray.length; i++) {
        if (gridProps.SortableColumnsArray[i][2] !== "Unsorted") {
            return 0;
        }
    }
    return 1;
}

//Default sort function for grid control
function sortGridData(gridProps) {

    //Check if there is data to sort and that the data is unsorted
    if (gridProps.SortedData && gridProps.SortedData.length > 1 &&
        checkIfAllUnsorted(gridProps) === 0) {
        var sortedRows = new Array();
        var sortedUIDS = new Array();
        sortedRows.push(gridProps.SortedData[0]);
        if (gridProps.HasUIDs === 1) {
            sortedUIDS.push(gridProps.SortedUIDs[0]);
        }

        //Loop through the sorted rows and sort the data
        for (var r = 1; r < gridProps.SortedData.length; r++) {
            var rowOutcomeHighestPlacement = sortedRows.length;
            for (var r3 = 0; r3 < sortedRows.length; r3++) {
                var prevOutcome = 1;
                for (var c = 0; c < gridProps.SortedData[r].length; c++) {
                    var c2 = getGridSortedColumnIndex(gridProps, c);
                    if (c2 > -1) {
                        if (gridProps.SortableColumnsArray[c2][1] === "Alphabetical" &&
                            gridProps.SortableColumnsArray[c2][2] !== "Unsorted") {
                            var localOutcome;
                            if (gridProps.SortableColumnsArray[c2][1] === "Alphabetical") {
                                localOutcome = gridProps.SortedData[r][c] && sortedRows[r3][c] ?
                                    gridProps.SortedData[r][c].localeCompare(sortedRows[r3][c]) :
                                    gridProps.SortedData[r][c] && !sortedRows[r3][c] ? 1 :
                                        !gridProps.SortedData[r][c] &&
                                            !sortedRows[r3][c] ? 0 : -1;
                            } else if (gridProps.SortableColumnsArray[c2][1] === "Numerical" ||
                                gridProps.SortableColumnsArray[c2][1] === "Date") {
                                localOutcome = gridProps.SortedData[r][c] &&
                                    sortedRows[r3][c] ?
                                    Number(gridProps.SortedData[r][c]) >
                                        Number(sortedRows[r3][c]) ? 1 :
                                        Number(gridProps.SortedData[r][c]) <
                                            Number(sortedRows[r3][c]) ? -1 : 0 :
                                    !gridProps.SortedData[r][c] && !sortedRows[r3][c] ? 0 :
                                        gridProps.SortedData[r][c] &&
                                            !sortedRows[r3][c] ? 1 : -1;
                            }
                            if (gridProps.SortableColumnsArray[c2][2] === "Ascending") {
                                if (localOutcome === 1) {
                                    localOutcome = -1;
                                } else if (localOutcome === -1) {
                                    localOutcome = 1;
                                }
                            }
                            if (localOutcome <= prevOutcome) {
                                prevOutcome = localOutcome;
                            }
                        }
                    }
                }
                if (prevOutcome === 1) {
                    rowOutcomeHighestPlacement = r3;
                    break;
                } else {
                    rowOutcomeHighestPlacement = r3 + 1;
                }
            }
            //Move the sorted data to the new position in the array
            sortedRows.splice(rowOutcomeHighestPlacement, 0, gridProps.SortedData[r]);
            if (gridProps.HasUIDs === 1) {
                sortedUIDS.splice(rowOutcomeHighestPlacement, 0, gridProps.SortedUIDs[r]);
            }
        }
        gridProps.SortedData = sortedRows;
        if (gridProps.HasUIDs === 1) {
            gridProps.SortedUIDs = sortedUIDS;
        }
    } else {
        //Toggle reset back to orginal unsorted data
        gridProps.SortedData = gridProps.RowData;
        if (gridProps.HasUIDs === 1) {
            gridProps.SortedUIDs = gridProps.OrigUIDs;
        }
    }
}
