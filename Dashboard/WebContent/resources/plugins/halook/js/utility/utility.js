halook.utility = {
	toRadian : function(angle) {
		return angle * Math.PI / 180;
	}
};

/*******************************************************************************
 * [機能] 日付オブジェクトから文字列に変換します [引数] date 対象の日付オブジェクト format フォーマット [戻値] フォーマット後の文字列
 ******************************************************************************/
halook.comDateFormat = function(date, format) {

	var result = format;

	var f;
	var rep;

	var yobi = new Array('日', '月', '火', '水', '木', '金', '土');

	f = 'yyyy';
	if (result.indexOf(f) > -1) {
		rep = date.getFullYear();
		result = result.replace(/yyyy/, rep);
	}

	f = 'MM';
	if (result.indexOf(f) > -1) {
		rep = halook.comPadZero(date.getMonth() + 1, 2);
		result = result.replace(/MM/, rep);
	}

	f = 'ddd';
	if (result.indexOf(f) > -1) {
		rep = yobi[date.getDay()];
		result = result.replace(/ddd/, rep);
	}

	f = 'dd';
	if (result.indexOf(f) > -1) {
		rep = halook.comPadZero(date.getDate(), 2);
		result = result.replace(/dd/, rep);
	}

	f = 'HH';
	if (result.indexOf(f) > -1) {
		rep = halook.comPadZero(date.getHours(), 2);
		result = result.replace(/HH/, rep);
	}

	f = 'mm';
	if (result.indexOf(f) > -1) {
		rep = halook.comPadZero(date.getMinutes(), 2);
		result = result.replace(/mm/, rep);
	}

	f = 'ss';
	if (result.indexOf(f) > -1) {
		rep = halook.comPadZero(date.getSeconds(), 2);
		result = result.replace(/ss/, rep);
	}

	f = 'fff';
	if (result.indexOf(f) > -1) {
		rep = halook.comPadZero(date.getMilliseconds(), 3);
		result = result.replace(/fff/, rep);
	}

	return result;
};

/*******************************************************************************
 * [機能] ゼロパディングを行います [引数] value 対象の文字列 length 長さ [戻値] 結果文字列
 ******************************************************************************/
halook.comPadZero = function(value, length) {
	return new Array(length - ('' + value).length + 1).join('0') + value;
};