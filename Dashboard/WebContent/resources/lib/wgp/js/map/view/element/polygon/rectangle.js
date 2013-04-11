/*******************************************************************************
 * WGP 1.0B - Web Graphical Platform (https://sourceforge.net/projects/wgp/)
 * 
 * The MIT License (MIT)
 * 
 * Copyright (c) 2012 Acroquest Technology Co.,Ltd.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 ******************************************************************************/
function rectangle(elementProperty, paper) {

	// 設定が取得できない場合は処理を終了する。
	if (!elementProperty) {
		return this;
	}

	// 数値に直す。
	elementProperty.pointX = parseFloat(elementProperty.pointX);
	elementProperty.pointY = parseFloat(elementProperty.pointY);
	elementProperty.width = parseFloat(elementProperty.width);
	elementProperty.height = parseFloat(elementProperty.height);

	var positionArray = this.createPositionArray(elementProperty);
	this.createMapElement(positionArray, paper);
	this.object.attr("fill", "white");
	this.setAttributes(elementProperty);

	// this.object.attr("fill", "0-#fff-#f00:"+ 0 +"-#fff");

	if (elementProperty.color == null) {
		elementProperty.color = "#FFFFFF";
		this.color = elementProperty.color;
	}
	if (!elementProperty.lineType) {
		elementProperty.lineType = "";
		this.lineType = elementProperty.lineType;
	}

	this.object.node.setAttribute(raphaelMapConstants.OBJECT_ID_NAME,
			elementProperty.objectId);
	this.object.node.setAttribute('class',
			raphaelMapConstants.CLASS_MAP_ELEMENT);

	this.objectId = elementProperty.objectId;
	this.objectType_ = raphaelMapConstants.POLYGON_TYPE_NAME;
	this.elementName_ = raphaelMapConstants.RECTANGLE_ELEMENT_NAME;

	this.x = elementProperty.pointX;
	this.y = elementProperty.pointY;
	this.width = elementProperty.width;
	this.height = elementProperty.height;

	return this;
}
rectangle.prototype = new mapElement();

rectangle.prototype.createPositionArray = function(elementProperty) {

	// ポジションのリスト
	var positionArray = [];
	// 左上ポジション
	var firstPosition = new Position(elementProperty.pointX,
			elementProperty.pointY);
	positionArray.push(firstPosition);
	// 右上ポジション
	var secondPosition = new Position(elementProperty.width, 0);
	positionArray.push(secondPosition);
	// 左下ポジション
	var thirdPosition = new Position(0, elementProperty.height);
	positionArray.push(thirdPosition);
	// 右下ポジション
	var forthPosition = new Position(-1 * elementProperty.width, 0);
	positionArray.push(forthPosition);

	return positionArray;
};

rectangle.prototype.createMapElement = function(positionArray, paper) {
	// パス情報
	var path = this.createPathString(positionArray);
	// オブジェクト生成
	this.object = paper.path(path);
	this.object.parentObject_ = this;
};

rectangle.prototype.getProperty = function() {
	var settings = {
		objectId : this.objectId,
		objectType : this.objectType_,
		x : this.x,
		y : this.y,
		width : this.width,
		height : this.height,
		zIndex : this.getZIndex()
	};
	if (this.color) {
		settings["color"] = this.color;
	}
	if (this.lineType) {
		settings["lineType"] = this.lineType;
	}
	return settings;
};