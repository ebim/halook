/*
 WGP  0.1  - Web Graphical Platform
 Copyright (c) 2012, WGP.LICENSES.COM
 Dual licensed under the MIT and GPL licenses
 http://www.opensource.org/licenses/mit-license.php
 http://www.gnu.org/licenses/gpl-2.0.html
 Date: 2012-04-29
*/

infinispan.customTriangle = {};
infinispan.customTriangle.width = 30;
infinispan.customTriangle.height = 15;
infinispan.customTriangle.rate = 1;

infinispan.customtriangle = function (elementProperty, paper, rate){

	// 設定が取得できない場合は処理を終了する。
	if(!elementProperty){
		return this;
	}

	// 数値に直す。
	
    elementProperty.pointX = parseFloat(elementProperty.pointX);
    elementProperty.pointY = parseFloat(elementProperty.pointY);
    elementProperty.width = parseFloat(elementProperty.width);
    elementProperty.height = parseFloat(elementProperty.height);

    infinispan.customTriangle.rate = rate;
//    infinispan.customTriangle.width *= rate;
//    infinispan.customTriangle.height *= rate;
if(infinispan.customTriangle.rate < 0.4)
	infinispan.customTriangle.rate = 0.4;
    
    
    var positionArray = this.createPositionArray(elementProperty);
    this.createMapElement(positionArray, paper);
    this.object.attr("fill","white");
    this.setAttributes(elementProperty);

    if (elementProperty.color == null) {
        elementProperty.color = "#FFFFFF";
    }
    if (!elementProperty.lineType) {
        elementProperty.lineType = "";
    }

    this.object.node.setAttribute(raphaelMapConstants.OBJECT_ID_NAME, elementProperty.objectId);
    this.object.node.setAttribute('class', raphaelMapConstants.CLASS_MAP_ELEMENT);

    this.objectId = elementProperty.objectId;
    this.objectType_ = raphaelMapConstants.POLYGON_TYPE_NAME;
    this.elementName_ = raphaelMapConstants.TRIANGLE_ELEMENT_NAME;

	this.x = elementProperty.pointX;
	this.y = elementProperty.pointY;
	this.width = elementProperty.width;
	this.height = elementProperty.height;

    return this;
};
infinispan.customtriangle.prototype = new mapElement();

infinispan.customtriangle.prototype.createPositionArray = function(elementProperty){

	// ポジションのリスト
	var positionArray = [];

    var firstPosition = new Position(elementProperty.pointX , elementProperty.pointY);
    positionArray.push(firstPosition);

    var secondPosition = new Position(-infinispan.customTriangle.width * infinispan.customTriangle.rate, infinispan.customTriangle.height *infinispan.customTriangle.rate/2);
    positionArray.push(secondPosition);

    var thirdPosition = new Position(0, -infinispan.customTriangle.height*infinispan.customTriangle.rate);
    positionArray.push(thirdPosition);

    return positionArray;
};

infinispan.customtriangle.prototype.createMapElement = function(positionArray, paper){
    // パス情報
    var path = this.createPathString(positionArray);
    // オブジェクト生成
    this.object = paper.path(path);
    this.object.parentObject_ = this;

};