ENS.perfDoctorView = wgp.AbstractView.extend({
	tableColModel : [ {
		name : "date",
		width : 95
	}, {
		name : "description",
		width : 140
	}, {
		name : "level",
		width : 65
	}, {
		name : "className",
		width : 150
	}, {
		name : "methodName",
		width : 100
	}, {
		name : "detail",
		width : 290
	} ],
	tableColNames : [ "時刻", "概要", "重要度", "クラス", "メソッド", "詳細" ],
	initialize : function(argument, treeSettings) {
		this.id = argument.id;
		var dualSliderId = this.id + "_dualSlider";
		// dual slider area (add div and css, and make slider)
		$("#" + this.id).append(
				'<div id="' + dualSliderId + '"></div>');
		$('#' + dualSliderId).css(
				ENS.nodeinfo.parent.css.dualSliderArea);
		$('#' + dualSliderId).css(
				ENS.nodeinfo.parent.css.dualSliderArea);
		this.dualSliderView = new ENS.DualSliderView({
			id : dualSliderId,
			rootView : this
		});
		
		var tableViewData = [ {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		}, {
			date : "2013/04/03 21:22:23",
			description : "概要",
			level : "高",
			className : "jp.co.acroquest.SampleClass",
			methodName : "sampleMethod",
			detail : "詳細"
		} ];
		$("#" + this.id).append('<div id="journalDiv"></div>');
		$("#journalDiv").css({
			"margin-left": 5
		});
		$("#journalDiv").append('<table id="journalTable"></table>');
		$("#journalDiv").append('<div id="journalPager"></table>');
		var dataLength = tableViewData.length;
		var height = "auto";
		if (dataLength > 10) {
			height = 445;
		}
		$("#journalTable").jqGrid({
			datatype : "local",
			data : tableViewData,
			colModel : this.tableColModel,
			colNames : this.tableColNames,
			caption : "Diagnosis of " + treeSettings.id,
			pager : "journalPager",
			rowList : [100, 1000, 10000],
			pgbuttons : false,
			pginput : false,
			height : height
		});
		$("#journalTable").filterToolbar({
			defaultSearch:'cn'
		});

	},
	render : function() {
		
	},
	onAdd : function(element) {
		console.log('call onAdd');
	},
	onChange : function(element) {
		console.log('called changeModel');
	},
	onRemove : function(element) {
		console.log('called removeModel');
	},
	onComplete : function(element) {
		console.log('called completeModel');
	}
});