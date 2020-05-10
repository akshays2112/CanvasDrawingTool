/*
    Created by Akshay Srinivasan [akshays2112@gmail.com]
    This javascript code is provided as is with no warranty implied.
    Akshay Srinivasan is not liable or responsible for any consequence of 
    using this code in your applications.
    You are free to use it and/or change it for both commercial and non-commercial
    applications as long as you give credit to Akshay Srinivasan the creator 
    of this code.
*/

//\XML Viewer Control starts here
var simpleXMLViewerPropsArray = new Array();

function getSimpleXMLViewerProps(canvasid, windowid) {
    for (var i = 0; i < simpleXMLViewerPropsArray.length; i++) {
        if (simpleXMLViewerPropsArray[i].CanvasID === canvasid &&
            simpleXMLViewerPropsArray[i].WindowID === windowid) {
            return simpleXMLViewerPropsArray[i];
        }
    }
}

function fillSimpleXMLViewerChildNodes(node, childNodes, xmlDoc, hasicons, imgURLNode,
    imgURLValue, imgURLAttribute) {
    for (var i = 0; i < childNodes.length; i++) {
        var nodenew = addChildNodes(node.ChildNodes, node, hasicons === 0 ? null :
            imgURLNode, 1, childNodes[i].nodeName,
            ['Node', childNodes[i]]);
        if (childNodes[i].attributes && childNodes[i].attributes.length > 0) {
            for (var x = 0; x < childNodes[i].attributes.length; x++) {
                var attrnode = addChildNodes(nodenew.ChildNodes, nodenew,
                    imgURLAttribute, 1, childNodes[i].attributes[x].name,
                    ['Attribute', childNodes[i].attributes[x]]);
                addChildNodes(attrnode.ChildNodes, attrnode, imgURLValue, 1,
                    childNodes[i].attributes[x].value,
                    ['AttributeValue', childNodes[i].attributes[x]]);
            }
        }
        if (childNodes[i].childNodes.length > 0) {
            fillSimpleXMLViewerChildNodes(nodenew, childNodes[i].childNodes, xmlDoc,
                hasicons, imgURLNode, imgURLValue, imgURLAttribute);
        } else if (childNodes[i].nodeValue && childNodes[i].nodeValue.length > 0) {
            addChildNodes(nodenew.ChildNodes, nodenew, hasicons === 0 ? null :
                imgURLValue, 1, childNodes[i].nodeValue,
                ['Value', childNodes[i]]);
        }
    }
}

function XMLViewer() { }

XMLViewer.prototype = {
    CanvasID: null, X: null, Y: null, Width: null, Height: null, XML: null,
    TextColor: null, TextFontString: null,
    TextHeight: null, ClickNodeFunction: null, Tag: null, HasIcons: null,
    IconWidth: null, IconHeight: null,
    ImgURLNode: null, ImgURLValue: null, ImgURLAttribute: null,
    ControlNameID: null, Depth: null, TabStopIndex: null,

    Initialize: function () {
        createSimpleXMLViewer(this.CanvasID, this.ControlNameID, this.X, this.Y,
            this.Width, this.Height, this.Depth,
            this.XML, this.TextColor, this.TextFontString, this.TextHeight,
            this.ClickNodeFunction, this.Tag, this.HasIcons,
            this.IconWidth, this.IconHeight, this.ImgURLNode, this.ImgURLValue,
            this.ImgURLAttribute, this.TabStopIndex);
    }
};

function createSimpleXMLViewer(canvasid, controlNameId, x, y, width, height, depth,
    xml, textcolor, textfontstring, textheight,
    clickNodeFunction, tag, hasicons, iconwidth, iconheight, imgURLNode, imgURLValue,
    imgURLAttribute, tabstopindex) {
    var parser = new DOMParser();
    xmlDoc = parser.parseFromString(xml, "text/xml");
    var nodes = new Array();
    for (var i = 0; i < xmlDoc.firstChild.childNodes[0].childNodes.length; i++) {
        var node = addChildNodes(nodes, null, hasicons === 0 ? null : imgURLNode, 1,
            xmlDoc.firstChild.childNodes[0].childNodes[i].nodeName,
            ['Node', xmlDoc.firstChild.childNodes[0].childNodes[i]]);
        if (xmlDoc.firstChild.childNodes[0].childNodes[i].attributes.length > 0) {
            for (var x2 = 0; x2 < xmlDoc.firstChild.childNodes[0].childNodes[
                i].attributes.length; x2++) {
                var attrnode = addChildNodes(node.ChildNodes, node, imgURLAttribute,
                    1, xmlDoc.firstChild.childNodes[0].childNodes[i].attributes[
                        x2].name,
                    ['Attribute', xmlDoc.firstChild.childNodes[0].childNodes[
                        i].attributes[x2]]);
                addChildNodes(attrnode.ChildNodes, attrnode, imgURLValue, 1,
                    xmlDoc.firstChild.childNodes[0].childNodes[i].attributes[x].value,
                    ['AttributeValue', xmlDoc.firstChild.childNodes[0].childNodes[
                        i].attributes[x2]]);
            }
        }
        if (xmlDoc.firstChild.childNodes[0].childNodes[i].childNodes.length > 0) {
            fillSimpleXMLViewerChildNodes(node, xmlDoc.firstChild.childNodes[
                0].childNodes[i].childNodes, xmlDoc, hasicons, imgURLNode,
                imgURLValue, imgURLAttribute);
        } else if (xmlDoc.firstChild.childNodes[0].childNodes[i].nodeValue &&
            xmlDoc.firstChild.childNodes[0].childNodes[i].nodeValue.length > 0) {
            addChildNodes(node.ChildNodes, null, hasicons === 0 ? null : imgURLValue,
                1, xmlDoc.firstChild.childNodes[0].childNodes[i].nodeValue,
                ['Value', xmlDoc.firstChild.childNodes[0].childNodes[i]]);
        }
    }
    var windowid = createTreeView(canvasid, controlNameId, x, y, width, height,
        depth, nodes, textcolor, textfontstring, textheight, clickNodeFunction, tag,
        hasicons, iconwidth, iconheight, null);
    simpleXMLViewerPropsArray.push({
        CanvasID: canvasid, WindowID: windowid, X: x, Y: y, Width: width, Height: height,
        XML: xml, TextColor: textcolor, TextFontString: textfontstring,
        TextHeight: textheight, ClickNodeFunction: clickNodeFunction, Tag: tag,
        HasIcons: hasicons, IconWidth: iconwidth, IconHeight: iconheight,
        ImgURLNode: imgURLNode, ImgURLValue: imgURLValue, ImgURLAttribute:
        imgURLAttribute
    });
    if (tabstopindex !== null && tabstopindex > 0) {
        registerKeyDownFunction(canvasid, function () { }, windowid);
    }
    return windowid;
}

