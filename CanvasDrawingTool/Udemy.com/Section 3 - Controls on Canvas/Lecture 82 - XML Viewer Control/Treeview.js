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

function getTreeViewProps(canvasid, windowid) {
    for (var i = 0; i < treeViewPropsArray.length; i++) {
        if (treeViewPropsArray[i].CanvasID === canvasid &&
            treeViewPropsArray[i].WindowID === windowid) {
            return treeViewPropsArray[i];
        }
    }
}

function findNumberOfExpandedNodesInAll(nodes) {
    var count = 0;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].Expanded === 1)
            count++;
        if (nodes[i].ChildNodes.length > 0) {
            count += findNumberOfExpandedNodesInAll(nodes[i].ChildNodes);
        }
    }
    return count;
}

function findIfImageAlreadyInIconImages(imageurl, iconimages) {
    for (var i = 0; i < iconimages.length; i++) {
        if (iconimages[i].ImageURL === imageurl) {
            return 1;
        }
    }
    return 0;
}

function fillIconImages(nodes, images) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].ImageURL !== null && nodes[i].ImageURL.length > 0 &&
            findIfImageAlreadyInIconImages(nodes[i].ImageURL, images) === 0) {
            var image = new Image();
            image.onload = function () { };
            image.src = nodes[i].ImageURL;
            images.push({ ImageURL: nodes[i].ImageURL, Image: image });
        }
        if (nodes[i].ChildNodes.length > 0) {
            fillIconImages(nodes[i].ChildNodes, images);
        }
    }
    return images;
}

function findNodeIndex(node, childnodes) {
    for (var i = 0; i < childnodes.length; i++) {
        if (node === childnodes[i]) {
            return i;
        } else if (childnodes[i].ChildNodes && childnodes[i].ChildNodes.length > 0) {
            return i + findNodeIndex(node, childnodes[i].ChildNodes);
        }
    }
    return 0;
}

function treeviewVSCustomIncrementFunction(currNode, scrollbarProps, incordec) {
    var nodearray = new Array();
    for (var i = 0; i < currNode.TreeviewNodeInstancesRootNodes.length; i++) {
        nodearray.push(currNode.TreeviewNodeInstancesRootNodes[i]);
        if (currNode.TreeviewNodeInstancesRootNodes[i].ChildNodes.length > 0 &&
            currNode.TreeviewNodeInstancesRootNodes[i].Expanded === 1) {
            fillChildNodes(currNode.TreeviewNodeInstancesRootNodes[i].ChildNodes,
                nodearray);
        }
    }
    for (i = 0; i < nodearray.length; i++) {
        if (getSelectedTag(scrollbarProps.CanvasID, scrollbarProps.WindowID) ===
            nodearray[i]) {
            if (incordec === 1) {
                if (i + 1 < nodearray.length) {
                    setSelectedTag(scrollbarProps.CanvasID, scrollbarProps.WindowID,
                        nodearray[i + 1]);
                }
            } else {
                if (i - 1 >= 0) {
                    setSelectedTag(scrollbarProps.CanvasID, scrollbarProps.WindowID,
                        nodearray[i - 1]);
                }
            }
            break;
        }
    }
    for (i = 0; i < treeViewPropsArray.length; i++) {
        if (getTreeviewNodes(treeViewPropsArray[i]) ===
            currNode.TreeviewNodeInstancesRootNodes) {
            invalidateRect(treeViewPropsArray[i].CanvasID, null,
                treeViewPropsArray[i].X, treeViewPropsArray[i].Y,
                treeViewPropsArray[i].Width, treeViewPropsArray[i].Height);
            setTreeviewSelectedNode(treeViewPropsArray[i],
                getSelectedTag(scrollbarProps.CanvasID, scrollbarProps.WindowID));
            break;
        }
    }
}

function treeviewVSCustomMouseMoveFunction(scrollBarProps, selectedID) {
    var treeviewprops = null;
    for (var i = 0; i < treeViewPropsArray.length; i++) {
        if (scrollBarProps.WindowID === treeViewPropsArray[i].VScrollBarWindowID) {
            treeviewprops = treeViewPropsArray[i];
        }
    }
    if (treeviewprops !== null) {
        var nodearray = new Array();
        var nodes = getTreeviewNodes(treeviewprops);
        for (i = 0; i < nodes.length; i++) {
            nodearray.push(nodes[i]);
            if (nodes[i].ChildNodes.length > 0 && nodes[i].Expanded === 1) {
                fillChildNodes(nodes[i].ChildNodes, nodearray);
            }
        }
        if (selectedID >= 0 && selectedID < nodearray.length) {
            setSelectedTag(scrollBarProps.CanvasID, scrollBarProps.WindowID,
                nodearray[selectedID]);
            setTreeviewSelectedNode(treeviewprops, nodearray[selectedID]);
        }
    }
}

var treeviewNodesArray = new Array();

function setTreeviewNodes(treeviewProps, nodes) {
    var found = 0;
    for (var i = 0; i < treeviewNodesArray.length; i++) {
        if (treeviewNodesArray[i][0] === treeviewProps.CanvasID &&
            treeviewNodesArray[i][1] === treeviewProps.WindowID) {
            found = 1;
            treeviewNodesArray[i][2] = nodes;
        }
    }
    if (found === 0) {
        treeviewNodesArray.push([treeviewProps.CanvasID, treeviewProps.WindowID, nodes]);
    }
}

function getTreeviewNodes(treeviewProps) {
    for (var i = 0; i < treeviewNodesArray.length; i++) {
        if (treeviewNodesArray[i][0] === treeviewProps.CanvasID &&
            treeviewNodesArray[i][1] === treeviewProps.WindowID) {
            return treeviewNodesArray[i][2];
        }
    }
}

var treeviewSelectedNodeArray = new Array();

function setTreeviewSelectedNode(treeviewProps, node) {
    var found = 0;
    for (var i = 0; i < treeviewSelectedNodeArray.length; i++) {
        if (treeviewSelectedNodeArray[i][0] === treeviewProps.CanvasID &&
            treeviewSelectedNodeArray[i][1] === treeviewProps.WindowID) {
            found = 1;
            treeviewSelectedNodeArray[i][2] = node;
        }
    }
    if (found === 0) {
        treeviewSelectedNodeArray.push([treeviewProps.CanvasID,
        treeviewProps.WindowID, node]);
    }
}

function getTreeviewSelectedNode(treeviewProps) {
    for (var i = 0; i < treeviewSelectedNodeArray.length; i++) {
        if (treeviewSelectedNodeArray[i][0] === treeviewProps.CanvasID &&
            treeviewSelectedNodeArray[i][1] === treeviewProps.WindowID) {
            return treeviewSelectedNodeArray[i][2];
        }
    }
}

var treeviewClickLabelExtentsArray = new Array();

function setTreeviewClickLabelExtents(treeviewProps, clickLabelExtents) {
    var found = 0;
    for (var i = 0; i < treeviewClickLabelExtentsArray.length; i++) {
        if (treeviewClickLabelExtentsArray[i][0] === treeviewProps.CanvasID &&
            treeviewClickLabelExtentsArray[i][1] === treeviewProps.WindowID) {
            found = 1;
            treeviewClickLabelExtentsArray[i][2] = clickLabelExtents;
        }
    }
    if (found === 0) {
        treeviewClickLabelExtentsArray.push([treeviewProps.CanvasID,
        treeviewProps.WindowID, clickLabelExtents]);
    }
}

function getTreeviewClickLabelExtents(treeviewProps) {
    for (var i = 0; i < treeviewClickLabelExtentsArray.length; i++) {
        if (treeviewClickLabelExtentsArray[i][0] === treeviewProps.CanvasID &&
            treeviewClickLabelExtentsArray[i][1] === treeviewProps.WindowID) {
            return treeviewClickLabelExtentsArray[i][2];
        }
    }
}

var treeviewClickButtonExtentsArray = new Array();

function setTreeviewClickButtonExtents(treeviewProps, clickButtonExtents) {
    var found = 0;
    for (var i = 0; i < treeviewClickButtonExtentsArray.length; i++) {
        if (treeviewClickButtonExtentsArray[i][0] === treeviewProps.CanvasID &&
            treeviewClickButtonExtentsArray[i][1] === treeviewProps.WindowID) {
            found = 1;
            treeviewClickButtonExtentsArray[i][2] = clickButtonExtents;
        }
    }
    if (found === 0) {
        treeviewClickButtonExtentsArray.push([treeviewProps.CanvasID,
        treeviewProps.WindowID, clickButtonExtents]);
    }
}

function getTreeviewClickButtonExtents(treeviewProps) {
    for (var i = 0; i < treeviewClickButtonExtentsArray.length; i++) {
        if (treeviewClickButtonExtentsArray[i][0] === treeviewProps.CanvasID &&
            treeviewClickButtonExtentsArray[i][1] === treeviewProps.WindowID) {
            return treeviewClickButtonExtentsArray[i][2];
        }
    }
}

function Treeview() { }

Treeview.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null,
    VScrollBarWindowID: null, HScrollBarWindowID: null,
    ClickNodeFunction: null, Tag: null, HasIcons: null, IconWidth: null,
    IconHeight: null, TextColor: null, TextFontString: null, TextHeight: null,
    ControlNameID: null, Depth: null, Nodes: null, SelectedNode: null,
    TabStopIndex: null,

    Initialize: function () {
        return createTreeView(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth, this.Nodes,
            this.TextColor, this.TextFontString, this.TextHeight,
            this.ClickNodeFunction, this.Tag, this.HasIcons, this.IconWidth,
            this.IconHeight, this.SelectedNode, this.TabStopIndex);
    }
};

function createTreeView(canvasid, controlNameId, x, y, width, height, depth, nodes,
    textcolor, textfontstring, textheight, clickNodeFunction, tag, hasicons,
    iconwidth, iconheight, selectednode, tabstopindex) {
    var windowid = createWindow(canvasid, x, y, width, height, depth, null,
        'TreeView', controlNameId, null, tabstopindex);
    var shownitemscount = findNumberOfExpandedNodesInAll(nodes);
    iconImages = hasicons === 1 ? fillIconImages(nodes, new Array()) : new Array();
    var vscrollbarwindowid = createScrollBar(canvasid, controlNameId + 'VS',
        x + width, y, height, depth, shownitemscount, 1, windowid, null, null, null,
        treeviewVSCustomIncrementFunction, selectednode !== null ?
            selectednode : nodes !== null && nodes.length > 0 ? nodes[0] : null,
        treeviewVSCustomMouseMoveFunction);
    var hscrollbarwindowid = createScrollBar(canvasid, controlNameId + 'HS',
        x, y + height, width, depth, shownitemscount, 0, windowid);
    var clickButtonExtents = new Array();
    var clickLabelExtents = new Array();
    treeViewPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width,
        Height: height,
        VScrollBarWindowID: vscrollbarwindowid, HScrollBarWindowID: hscrollbarwindowid,
        ClickNodeFunction: clickNodeFunction, Tag: tag, HasIcons: hasicons,
        IconWidth: iconwidth,
        IconHeight: iconheight, TextColor: textcolor, TextFontString: textfontstring,
        TextHeight: textheight
    });
    setTreeviewSelectedNode(getTreeViewProps(canvasid, windowid),
        selectednode !== null ? selectednode : nodes !== null && nodes.length > 0 ?
            nodes[0] : null);
    setTreeviewNodes(getTreeViewProps(canvasid, windowid), nodes);
    setTreeviewClickLabelExtents(getTreeViewProps(canvasid, windowid),
        clickLabelExtents);
    setTreeviewClickButtonExtents(getTreeViewProps(canvasid, windowid),
        clickButtonExtents);
    registerWindowDrawFunction(windowid, drawTreeView, canvasid);
    registerClickFunction(windowid, clickTreeView, canvasid);
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

function toggleNodeExpandedState(treeViewProps, p) {
    if (p.Expanded === 0) {
        p.Expanded = 1;
    } else {
        p.Expanded = 0;
    }
}

function clickTreeView(canvasid, windowid, e) {
    var treeViewProps = getTreeViewProps(canvasid, windowid);
    var scrollBarProps = getScrollBarProps(canvasid, treeViewProps.VScrollBarWindowID);
    var x = e.calcX;
    var y = e.calcY;
    var clickButtonExtents = getTreeviewClickButtonExtents(treeViewProps);
    for (var i = 0; i < clickButtonExtents.length; i++) {
        if (clickButtonExtents[i].Node && x > clickButtonExtents[i].X &&
            x < clickButtonExtents[i].X + 9 && y > clickButtonExtents[i].Y &&
            y < clickButtonExtents[i].Y + 9) {
            toggleNodeExpandedState(treeViewProps, clickButtonExtents[i].Node);
            scrollBarProps.MaxItems = checkHowManyChildNodesAreExpandedInAll(
                getTreeviewNodes(treeViewProps));
            invalidateRect(canvasid, null, treeViewProps.X, treeViewProps.Y,
                treeViewProps.Width, treeViewProps.Height);
            return;
        }
    }
    if (treeViewProps.ClickNodeFunction !== null) {
        var cletvp = getTreeviewClickLabelExtents(treeViewProps);
        for (i = 0; i < cletvp.length; i++) {
            if (cletvp[i].TreeviewClickLabelExtentsNode && x > cletvp[i].X &&
                x < cletvp[i].X + cletvp[i].Width &&
                y > cletvp[i].Y && y < cletvp[i].Y + cletvp[i].TextHeight) {
                treeViewProps.ClickNodeFunction(canvasid, windowid,
                    cletvp[i].TreeviewClickLabelExtentsNode);
                setTreeviewSelectedNode(treeViewProps,
                    cletvp[i].TreeviewClickLabelExtentsNode);
                invalidateRect(canvasid, null, treeViewProps.X, treeViewProps.Y,
                    treeViewProps.Width, treeViewProps.Height);
                return;
            }
        }
    }
}

function checkIfParentsAreExpanded(treeViewProps, node) {
    if (node.TreeviewNodeInstancesParentNode === null) {
        return 1;
    }
    var currNode = node;
    while (currNode.TreeviewNodeInstancesParentNode !== null) {
        if (currNode.Expanded === 0)
            return 0;
        currNode = currNode.TreeviewNodeInstancesParentNode;
    }
    return 1;
}

function checkIfStringAndConvertToInt(o) {
    if (typeof o === 'string') {
        return parseInt(o);
    }
    return o;
}

function fillChildNodes(childnodes, nodearray) {
    for (var i = 0; i < childnodes.length; i++) {
        nodearray.push(childnodes[i]);
        if (childnodes[i].ChildNodes.length > 0 && childnodes[i].Expanded === 1) {
            fillChildNodes(childnodes[i].ChildNodes, nodearray);
        }
    }
}

function drawTreeView(canvasid, windowid) {
    var treeViewProps = getTreeViewProps(canvasid, windowid);
    var ctx = getCtx(canvasid);
    ctx.save();
    ctx.strokeStyle = '#C0C0C0';
    ctx.beginPath();
    ctx.rect(treeViewProps.X, treeViewProps.Y, treeViewProps.Width, treeViewProps.Height);
    ctx.stroke();
    ctx.beginPath();
    ctx.rect(treeViewProps.X, treeViewProps.Y, treeViewProps.Width, treeViewProps.Height);
    ctx.clip();
    ctx.fillStyle = treeViewProps.TextColor;
    ctx.font = treeViewProps.TextFontString;
    var heightoffset = 0;
    setTreeviewClickLabelExtents(treeViewProps, new Array());
    var nodearray = new Array();
    var nodes = getTreeviewNodes(treeViewProps);
    for (var i = 0; i < nodes.length; i++) {
        nodearray.push(nodes[i]);
        if (nodes[i].ChildNodes.length > 0 && nodes[i].Expanded === 1) {
            fillChildNodes(nodes[i].ChildNodes, nodearray);
        }
    }
    var foundnode = 0;
    for (i = 0; i < nodearray.length && heightoffset < treeViewProps.Height; i++) {
        if (nodearray[i] === getTreeviewSelectedNode(treeViewProps)) {
            foundnode = 1;
        }
        if (foundnode === 1) {
            var y = 4 + treeViewProps.Y + heightoffset;
            var level = findNodeLevel(nodearray[i]);
            drawTreeViewNode(ctx, nodearray[i], 4 + treeViewProps.X, 4 +
                treeViewProps.Y + heightoffset,
                treeViewProps.TextColor, treeViewProps.TextFontString,
                treeViewProps.TextHeight, level,
                treeViewProps.IconWidth, treeViewProps.IconHeight, treeViewProps);
            heightoffset += (treeViewProps.TextHeight > treeViewProps.IconHeight ?
                treeViewProps.TextHeight > 9 ? treeViewProps.TextHeight : 9 :
                treeViewProps.IconHeight > 9 ? treeViewProps.IconHeight : 9) + 8;
        }
    }
    ctx.restore();
}

function findNodeLevel(node) {
    if (node.TreeviewNodeInstancesParentNode === null)
        return 0;
    else
        return 1 + findNodeLevel(node.TreeviewNodeInstancesParentNode);
}

function numberOfChildNodes(node) {
    var count = node.ChildNodes.length;
    if (count > 0) {
        for (var i = 0; i < node.ChildNodes.length; i++) {
            count += numberOfChildNodes(node.ChildNodes[i]);
        }
    }
    return count;
}

function checkHowManyChildNodesAreExpanded(node) {
    var count = node.ChildNodes.length;
    if (count > 0) {
        for (var i = 0; i < node.ChildNodes.length; i++) {
            if (node.ChildNodes[i].Expanded === 1) {
                count++;
                if (node.ChildNodes[i].ChildNodes.length > 0) {
                    count += checkHowManyChildNodesAreExpanded(node.ChildNodes[i]);
                }
            }
        }
    }
    return count;
}

function checkHowManyChildNodesAreExpandedInAll(nodes) {
    var count = 0;
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].Expanded === 1) {
            count++;
            if (nodes[i].ChildNodes.length > 0) {
                count += nodes[i].ChildNodes.length;
                count += checkHowManyChildNodesAreExpandedInAll(nodes[i].ChildNodes);
            }
        }
    }
    return count;
}

function drawTreeViewNode(ctx, node, x, y, textcolor, textfontstring, textHeight,
    level, iconWidth, iconHeight, treeviewProps) {
    x += level * 8 + (level === 0 ? 2 : 10);
    if (node.ChildNodes.length > 0) {
        ctx.strokeStyle = '#3c7fb1';
        ctx.beginPath();
        ctx.rect(x, y, 10, 10);
        var clickButtonExtents = getTreeviewClickButtonExtents(treeviewProps);
        clickButtonExtents.push({ X: x, Y: y, Node: node });
        setTreeviewClickButtonExtents(treeviewProps, clickButtonExtents);
        ctx.stroke();
        ctx.fillStyle = '#dcf0fb';
        ctx.beginPath();
        ctx.rect(x + 1, y + 1, 8, 5);
        ctx.fill();
        ctx.fillStyle = '#a7d8f3';
        ctx.beginPath();
        ctx.rect(x + 1, y + 6, 8, 4);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.moveTo(x + 2, y + 5);
        ctx.lineTo(x + 8, y + 5);
        ctx.stroke();
        if (node.Expanded === 0) {
            ctx.beginPath();
            ctx.moveTo(x + 5, y + 2);
            ctx.lineTo(x + 5, y + 8);
            ctx.stroke();
        }
        var numOfChildNodes = checkHowManyChildNodesAreExpanded(node);
        if (node.ChildNodes.length > 0) {
            if (numOfChildNodes === 0) {
                ctx.strokeStyle = '#000000';
                ctx.beginPath();
                ctx.moveTo(x + 5, y + 2);
                ctx.lineTo(x + 5, y + 8);
                ctx.stroke();
            }
        }
    }
    var xoffset = 0;
    if (node.ImageURL !== null) {
        for (var w = 0; w < iconImages.length; w++) {
            if (node.ImageURL === iconImages[w].ImageURL) {
                ctx.drawImage(iconImages[w].Image, x + 13, y);
                xoffset += iconWidth + 5;
                break;
            }
        }
    }
    ctx.fillStyle = textcolor;
    ctx.font = textfontstring;
    ctx.fillText(node.Label, x + 13 + xoffset, y + textHeight);
    var cletv = getTreeviewClickLabelExtents(treeviewProps);
    cletv.push({
        X: x + 13, Y: y, Width: ctx.measureText(node.Label).width + xoffset,
        TextHeight: textHeight, TreeviewClickLabelExtentsNode: node
    });
}

function insertTreeviewNode(canvasid, windowid, nodeidtoinsertbefore, nodearraydata) {
    var treeviewProps = getTreeViewProps(canvasid, windowid);
    for (var i = 0; i < treeviewProps.Data.length; i++) {
        if (nodeidtoinsertbefore) {
            if (treeviewProps.Data[i][0] === nodeidtoinsertbefore) {
                treeviewProps.Data.splice(i, 0, nodearraydata);
            }
        } else {
            treeviewProps.Data.push(nodearraydata);
        }
    }
}

function addChildNodes(nodes, parentnode, imageurl, expanded, label, customextrainfo) {
    var node = {
        TreeviewNodeInstancesParentNode: parentnode,
        TreeviewNodeInstancesRootNodes: nodes, ImageURL: imageurl,
        Expanded: expanded, ChildNodes: new Array(), Label: label,
        CustomExtraInfo: customextrainfo
    };
    if (parentnode === null) {
        nodes.push(node);
    } else {
        parentnode.ChildNodes.push(node);
    }
    return node;
}

