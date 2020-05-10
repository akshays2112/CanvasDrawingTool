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

//TreeView code starts here

var treeViewPropsArray = new Array();
var iconImages = new Array();
var nodeCount = 0;
var levelOffset = 0;
var clickExtents = new Array();

var Treeview = function () { };
var TreeviewNode = function () { };
var TreeviewProps = function () { };
var IconImage = function () { };
var ClickExtent = function () { };

Treeview.prototype = {
    CanvasID: null,
    ControlNameID: null,
    X: null,
    Y: null,
    Width: null,
    Height: null,
    Depth: null,
    Nodes: null,
    TextColor: null,
    TextFontString: null,
    TextHeight: null,
    SelectedNode: null,
    SelectedNodeTextColor: null,
    SelectedNodeTextFontString: null,
    SelectedNodeTextHeight: null,
    ExpandedNodeImgURL: null,
    ExpandedNodeImgURLWidth: null,
    ExpandedNodeImgURLHeight: null,
    CollapsedNodeImgURL: null,
    CollapsedNodeImgURLWidth: null,
    CollapsedNodeImgURLHeight: null,
    ClickNodeFunction: null,
    TabStopIndex: null,
    Tag: null,

    Initialize: function () {
        createTreeview(this.CanvasID, this.ControlNameID, this.X, this.Y, this.Width,
            this.Height, this.Depth, this.Nodes,
            this.TextColor, this.TextFontString, this.TextHeight,
            this.SelectedNode, this.SelectedNodeTextColor, this.SelectedNodeTextFontString,
            this.SelectedNodeTextHeight, this.ExpandedNodeImgURL, this.ExpandedNodeImgURLWidth,
            this.ExpandedNodeImgURLHeight, this.CollapsedNodeImgURL,
            this.CollapsedNodeImgURLWidth,
            this.CollapsedNodeImgURLHeight, this.ClickNodeFunction, this.TabStopIndex,
            this.Tag);
    }
};

TreeviewNode.prototype = {
    ParentNode: null,
    IconImgURL: null,
    IconImgWidth: null,
    IconImgHeight: null,
    Expanded: false,
    ChildNodes: null,
    Text: null,
    Tag: null
};

TreeviewProps.prototype = {
    CanvasID: null,
    WindowID: null,
    ControlNameID: null,
    VSWindowID: null,
    HSWindowID: null,
    X: null,
    Y: null,
    Width: null,
    Height: null,
    Depth: null,
    Nodes: null,
    TextColor: null,
    TextFontString: null,
    TextHeight: null,
    SelectedNode: null,
    SelectedNodeTextColor: null,
    SelectedNodeTextFontString: null,
    SelectedNodeTextHeight: null,
    ExpandedNodeImgURL: null,
    CollapsedNodeImgURL: null,
    ClickNodeFunction: null,
    TabStopIndex: null,
    Tag: null
};

IconImage.prototype = {
    CanvasID: null,
    WindowID: null,
    ImgURL: null,
    Img: null,
    ImgLoaded: false
};

ClickExtent.prototype = {
    X: null,
    Y: null,
    Width: null,
    Height: null,
    Node: null,
    Type: null //1 - Node, 2 - Expand Button, 3 - Icon Image
};

function getTreeViewProps(canvasid, windowid) {
    for (var i = 0; i < treeViewPropsArray.length; i++) {
        if (treeViewPropsArray[i].CanvasID === canvasid &&
            treeViewPropsArray[i].WindowID === windowid) {
            return treeViewPropsArray[i];
        }
    }
}

var visibleNodeCount = 0;

function getVisibleNodeCount(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        visibleNodeCount++;
        if (nodes[i].Expanded && nodes[i].ChildNodes) {
            visibleNodeCount += getVisibleNodeCount(nodes[i].ChildNodes);
        }
    }
    return visibleNodeCount;
}

function registerIconImage(canvasID, windowID, imgURL) {
    var foundImgURL = false;
    for (var i = 0; i < iconImages.length; i++) {
        if (iconImages[i].ImgURL === imgURL) {
            foundImgURL = true;
        }
    }
    if (!foundImgURL) {
        var img = new Image();
        img.onload = function () {
            var imgIcon = new IconImage();
            imgIcon.CanvasID = canvasID;
            imgIcon.WindowID = windowID;
            imgIcon.ImgURL = imgURL;
            imgIcon.Img = img;
            imgIcon.ImgLoaded = true;
            iconImages.push(imgIcon);
            var treeViewProps = getTreeViewProps(canvasID, windowID);
            invalidateRect(canvasID, null, treeViewProps.X, treeViewProps.Y,
                treeViewProps.Width, treeViewProps.Height);
        };
        img.src = imgURL;
    }
}

function getIconImage(canvasID, windowID, imgURL) {
    for (var i = 0; i < iconImages.length; i++) {
        if (iconImages[i].CanvasID === canvasID && iconImages[i].WindowID === windowID &&
            iconImages[i].ImgURL === imgURL) {
            return iconImages[i];
        }
    }
    return null;
}

function getImgURLFromNodes(canvasID, windowID, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].IconImgURL) {
            registerIconImage(canvasID, windowID, nodes[i].IconImgURL);
        }
        for (var j = 0; j < nodes[i].ChildNodes.length; j++) {
            getImgURLFromNodes(canvasID, windowID, nodes[i].ChildNodes);
        }
    }
}

function createTreeview(canvasID, controlNameID, x, y, width, height,
    depth, nodes, textColor, textFontString, textHeight, selectedNode,
    selectedNodeTextColor, selectedNodeTextFontString,
    selectedNodeTextHeight, expandedNodeImgURL, expandedNodeImgURLWidth,
    expandedNodeImgURLHeigth, collapsedNodeImgURL, collapsedNodeImgURLWidth,
    collapsedNodeImgURLHeight, clickNodeFunction, tabStopIndex, tag) {
    var windowID = createWindow(canvasID, x, y, width, height, depth, null,
        'TreeView', controlNameID, null, tabStopIndex);
    var shownItemsCount = getVisibleNodeCount(nodes);
    var vsWindowID = createScrollBar(canvasID, controlNameID + 'VS',
        x + width, y, height, depth, shownItemsCount, 1, windowID, null, null, null,
        null, null, null);
    var hsWindowID = createScrollBar(canvasID, controlNameID + 'HS',
        x, y + height, width, depth, shownItemsCount, 0, windowID);
    registerIconImage(canvasID, windowID, expandedNodeImgURL);
    registerIconImage(canvasID, windowID, collapsedNodeImgURL);
    getImgURLFromNodes(canvasID, windowID, nodes);
    var treeviewProps = new TreeviewProps();
    treeviewProps.CanvasID = canvasID;
    treeviewProps.WindowID = windowID;
    treeviewProps.ControlNameID = controlNameID;
    treeviewProps.VSWindowID = vsWindowID;
    treeviewProps.HSWindowID = hsWindowID;
    treeviewProps.X = x;
    treeviewProps.Y = y;
    treeviewProps.Width = width;
    treeviewProps.Height = height;
    treeviewProps.Depth = depth;
    treeviewProps.Nodes = nodes;
    treeviewProps.TextColor = textColor;
    treeviewProps.TextFontString = textFontString;
    treeviewProps.TextHeight = textHeight;
    treeviewProps.SelectedNode = selectedNode;
    treeviewProps.SelectedNodeTextColor = selectedNodeTextColor;
    treeviewProps.SelectedNodeTextFontString = selectedNodeTextFontString;
    treeviewProps.SelectedNodeTextHeight = selectedNodeTextHeight;
    treeviewProps.ExpandedNodeImgURL = expandedNodeImgURL;
    treeviewProps.ExpandedNodeImgURLWidth = expandedNodeImgURLWidth;
    treeviewProps.ExpandedNodeImgURLHeight = expandedNodeImgURLHeigth;
    treeviewProps.CollapsedNodeImgURL = collapsedNodeImgURL;
    treeviewProps.CollapsedNodeImgURLWidth = collapsedNodeImgURLWidth;
    treeviewProps.CollapsedNodeImgURLHeight = collapsedNodeImgURLHeight;
    treeviewProps.ClickNodeFunction = clickNodeFunction;
    treeviewProps.TabStopIndex = tabStopIndex;
    treeviewProps.Tag = tag;
    treeViewPropsArray.push(treeviewProps);
    registerWindowDrawFunction(windowID, drawTreeView, canvasID);
    registerClickFunction(windowID, clickTreeView, canvasID);
}

function drawTreeView(canvasID, windowID) {
    var treeViewProps = getTreeViewProps(canvasID, windowID);
    var ctx = getCtx(canvasID);
    ctx.save();
    ctx.strokeStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.rect(treeViewProps.X, treeViewProps.Y, treeViewProps.Width, treeViewProps.Height);
    ctx.stroke();
    var vsProps = getScrollBarProps(canvasID, treeViewProps.VSWindowID);
    var selectedID = vsProps.SelectedID;
    nodeCount = 0;
    clickExtents = new Array();
    drawNodes(ctx, treeViewProps, selectedID, treeViewProps.Nodes);
}

function drawNodes(ctx, treeViewProps, selectedID, nodes) {
    for (var i = 0; i < nodes.length; i++) {
        nodeCount++;
        if (nodeCount >= selectedID) {
            drawNode(ctx, treeViewProps, nodes[i], selectedID);
        }
        if (nodes[i].Expanded && nodes[i].ChildNodes &&
            nodes[i].ChildNodes.length > 0) {
            drawNodes(ctx, treeViewProps, selectedID, nodes[i].ChildNodes);
        }
    }
}

function getNodeLevel(node) {
    if (node.ParentNode) {
        levelOffset++;
        getNodeLevel(node.ParentNode);
    }
}

function drawNode(ctx, treeViewProps, node, selectedID) {
    levelOffset = 0;
    getNodeLevel(node);
    var xNodeOffset = treeViewProps.X + levelOffset * 50 + 5;
    var yNodeOffset = treeViewProps.Y + (nodeCount - selectedID) *
        (treeViewProps.TextHeight + 5);
    if (yNodeOffset <= treeViewProps.Y + treeViewProps.Height) {
        if (node.Expanded && node.ChildNodes.length > 0 && treeViewProps.ExpandedNodeImgURL) {
            var expandedImg = getIconImage(treeViewProps.CanvasID, treeViewProps.WindowID,
                treeViewProps.ExpandedNodeImgURL);
            if (expandedImg && expandedImg.ImgLoaded) {
                ctx.drawImage(expandedImg.Img, xNodeOffset, yNodeOffset,
                    treeViewProps.ExpandedNodeImgURLWidth,
                    treeViewProps.ExpandedNodeImgURLHeight);
                var ce = new ClickExtent();
                ce.X = xNodeOffset;
                ce.Y = yNodeOffset;
                ce.Width = treeViewProps.ExpandedNodeImgURLWidth;
                ce.Height = treeViewProps.ExpandedNodeImgURLHeight;
                ce.Node = node;
                ce.Type = 2;
                clickExtents.push(ce);
                xNodeOffset += treeViewProps.ExpandedNodeImgURLWidth + 5;
            }
        } else if (node.ChildNodes.length > 0 && treeViewProps.CollapsedNodeImgURL) {
            var collapsedImg = getIconImage(treeViewProps.CanvasID, treeViewProps.WindowID,
                treeViewProps.CollapsedNodeImgURL);
            if (collapsedImg && collapsedImg.ImgLoaded) {
                ctx.drawImage(collapsedImg.Img, xNodeOffset, yNodeOffset,
                    treeViewProps.CollapsedNodeImgURLWidth,
                    treeViewProps.CollapsedNodeImgURLWidth);
                var ce2 = new ClickExtent();
                ce2.X = xNodeOffset;
                ce2.Y = yNodeOffset;
                ce2.Width = treeViewProps.CollapsedNodeImgURLWidth;
                ce2.Height = treeViewProps.CollapsedNodeImgURLWidth;
                ce2.Node = node;
                ce2.Type = 2;
                clickExtents.push(ce2);
                xNodeOffset += treeViewProps.CollapsedNodeImgURLWidth + 5;
            }
        }
        if (node.IconImgURL) {
            var img = getIconImage(treeViewProps.CanvasID, treeViewProps.WindowID,
                node.IconImgURL);
            if (img && img.ImgLoaded) {
                ctx.drawImage(img.Img, xNodeOffset, yNodeOffset, node.IconImgWidth,
                    node.IconImgHeight);
                var ce3 = new ClickExtent();
                ce3.X = xNodeOffset;
                ce3.Y = yNodeOffset;
                ce3.Width = node.IconImgWidth;
                ce3.Height = node.IconImgHeight;
                ce3.Node = node;
                ce3.Type = 3;
                clickExtents.push(ce3);
                xNodeOffset += node.IconImgWidth + 5;
            }
        }
        if (node.Text) {
            ctx.fillStyle = treeViewProps.TextColor;
            ctx.font = treeViewProps.TextFontString;
            ctx.fillText(node.Text, xNodeOffset, yNodeOffset + treeViewProps.TextHeight);
            var ce4 = new ClickExtent();
            ce4.X = xNodeOffset;
            ce4.Y = yNodeOffset;
            ce4.Width = ctx.measureText(node.Text).width;
            ce4.Height = treeViewProps.TextHeight;
            ce4.Node = node;
            ce4.Type = 1;
            clickExtents.push(ce4);
        }
    }
}

function clickTreeView(canvasID, windowID, e) {
    var treeViewProps = getTreeViewProps(canvasID, windowID);
    var x = e.calcX;
    var y = e.calcY;
    for (var i = 0; i < clickExtents.length; i++) {
        if (x >= clickExtents[i].X && x <= clickExtents[i].X + clickExtents[i].Width &&
            y >= clickExtents[i].Y && y <= clickExtents[i].Y + clickExtents[i].Height) {
            if (clickExtents[i].Type === 2) {
                if (clickExtents[i].Node.Expanded) {
                    clickExtents[i].Node.Expanded = false;
                } else {
                    clickExtents[i].Node.Expanded = true;
                }
                invalidateRect(canvasID, null, treeViewProps.X, treeViewProps.Y,
                    treeViewProps.Width, treeViewProps.Height);
            } else if ((clickExtents[i].Type === 1 || clickExtents[i].Type === 3) &&
                typeof (treeViewProps.ClickNodeFunction) === 'function') {
                treeViewProps.ClickNodeFunction(canvasID, windowID, { X: x, Y: y },
                    clickExtents[i].Node, clickExtents[i].Type);
            }
        }
    }
}
