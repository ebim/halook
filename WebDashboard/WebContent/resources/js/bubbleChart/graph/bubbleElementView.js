
//グラフ表示用プロパティ
wgp.BubbleChartAttribute = [
        "colors",
        "labels",
        "valueRange",
        "xlabel",
        "ylabel",
        "strokeWidth",
        "legend",
        "labelsDiv",
        "width",
        "height",
        "drawPoints",
		"pointSize",
		"highlightCircleSize",
        "drawPointCallback",
        "drawHighlightPointCallback"
];

var JOB_ID = "job_20120907140000_0001";
var START_DATE = new Date(2012,8,5);// 9/5の0時
var END_DATE = new Date(2012,8,8);// 9/6の0時

// MapSuccess,MapFailed,MapKilled,ReduceSuccess,ReduceFailed,ReduceKilledの順で表示用のフラグ
var MAP_SUCCESS = 0;
var MAP_FAILED = 1;
var MAP_KILLED = 2;
var REDUCE_SUCCESS = 3;
var REDUCE_FAILED = 4;
var REDUCE_KILLED = 5;
var EDGE_RATE = 1;// グラフ両端のダミーデータの占める大きさの割合(%)
var sortFlag = [true,true,true,true,true,true];
var Sort_array = ["Map","Reduce"];// タスクの種類
var Status_array = ["Success","Failed","Killed"];// ステータスの種類
var sortByFinishTime = false;
var divTime = 1000;// 1:millies,1000:second,60000:minutes,3600000:hours
// var taskNumber = 655;// ランダム用タスクの数

BubbleElementView = wgp.DygraphElementView.extend({
	
	initialize:function(argument){
		_.extend(this, Backbone.Events);
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;// ビュータイプ
		this.width = argument["width"];// ウィンドウ幅
		this.height = argument["height"];// ウィンドウの高さ
		this.graphId = 0;// グラフID
		new graphListenerView(this);// グラフのチェックボックスのリスナ用ビュー
		new sortListenerView(this);// ソートのリスナ用ビュー
		var appView = new wgp.AppView();
		appView.addView(this, (argument.treeSettings.id+"%"));
		appView.getTermData([ (argument.treeSettings.id+"%")], START_DATE,END_DATE);
		
		// データの登録(ランダム用)
		// 注意 Start順に渡すこと
		 // var dataArray = [];
		// dataArray = randomData();// ランダムデータ関数
		
		var realTag = $("#" + this.$el.attr("id"));
        if (this.width == null) {
            this.width = realTag.width();
        }
        if (this.height == null) {
            this.height = realTag.height();
        }

        var instance = this;
        this.on("updateGraphOptions", function(){
        	instance.updateGraphOptions();
        });
        this.on("updateData", function(){
        	instance.updateData();
        });
        
		this.collection.comparator = function(model){
			var value = $.parseJSON(model.get("measurementValue"));
			if(!sortByFinishTime){
				var num = value[0]["StartTime"];
				return value[0]["StartTime"];
			}else{
				var num = value[0]["FinishTime"];
				return value[0]["FinishTime"];
			}
		};

	},
	render:function(){
		
		// グラフの生成
		this.entity = new Dygraph(
			document.getElementById(this.$el.attr("id")),
			this.dataArray,this.getAttributes(wgp.BubbleChartAttribute)
		);
		
		// アップデートオプション（形表示用、要修正)
		this.updateGraphOptions();
		
		// 描画のリサイズ
		this.entity.resize(this.width, this.height);
		
	},
	onAdd:function(graphModel){
		/*
		 * console.log("called"); // 配列データを格納する変数 var dataArray = []; var
		 * instance = this; // グラフ表示に必要なデータの取得 _.each(this.collection.models,
		 * function(model,index){ var modelData = model.get("measurementValue");
		 * if(!sortByFinishTime){ var array =
		 * instance._sortingByStartData(modelData); }else{ var array =
		 * instance._sortingByFinishData(modelData); } if(array.length !=
		 * 0)dataArray.push(array); });
		 * 
		 * if(this.entity == null){// 要素があれば描画する this.render(); }else{//
		 * 無ければ配列をアップデート updateOptions({file: dataArray}); } //
		 * アップデートオプション（形表示用、要修正) updateGraphOptions();
		 */
		
		
	},
	getTermData : function() {
		var instance = this;
		// this.dataArray = [];
		this.dataArray = [];
		var max = 0;
		this.collection.sort();
		
		_.each(this.collection.models, function(model){
			var valueString = model.get("measurementValue");
			var value = $.parseJSON(valueString);
			var length = value.length;
			
			for(i = 0 ; i < length ; i++){
				var processedData = instance._processingData(value,i);
				if(processedData != null){
					var tempProcessTime = (new Date(processedData.FinishTime).getTime()-new Date(processedData.StartTime).getTime());
					if(max < tempProcessTime)max = tempProcessTime;
					if(!sortByFinishTime){
						instance.dataArray.push(instance._sortingByStartData(processedData));
					}else{
						instance.dataArray.push(instance._sortingByFinishData(processedData));
					}
				}
			}
		});
		if(this.dataArray.length != 0){
			// 端に置く時間を計算(データ全体のEDGE_RATE%)
			var edgeTime = ((new Date(new Date(this.dataArray[this.dataArray.length-1][0]).getTime()))-new Date(this.dataArray[0][0]))*EDGE_RATE/100;
			// ダミーデータを加える処理
			this.dataArray.unshift([new Date(this.dataArray[0][0]-edgeTime),null,null,null,null,null,null,0]);
			this.dataArray.push([new Date(new Date(this.dataArray[this.dataArray.length-1][0]).getTime()+edgeTime),null,null,null,null,null,null,max/divTime]);
		}
        
		this.render();
	},
	// コレクションの追加処理
	addCollection:function(dataArray){
		if(dataArray != null){
			var instance = this;
			_.each(dataArray, function(data, index){
				var model = new instance.collection.model({dataId: instance.maxId, data:data});
				instance.collection.add(model, wgp.constants.BACKBONE_EVENT.SILENT);
				instance.maxId++;
			});
		}
	},
	
	// データを取得する処理
	getData:function(){
		var data = [];
		var instance = this;
		_.each(this.collection.models, function(model, index){
			var modelData = model.get("measurementValue");
			if(!sortByFinishTime){
				var array = instance._sortingByFinishData(modelData);
			}else{
				var array = instance._sortingByFinishData(modelData);
			}		
			if(array.length != 0)data.push(array);
		});
		return data;
	},
	// IDを登録する処理
	getRegisterId : function(){
		return this.graphId;
	},
	// ソート用にデータを再取得する
	updateData : function(){
		return this.getTermData();
	},
	// データの種類、成功別に分類し、グラフ表示用の配列に加工する関数
	_sortingByStartData : function(modelData){
		var array = [];
		var ProcessTime = (modelData.FinishTime-modelData.StartTime)/divTime;// 秒単位
		if(modelData.Sort == "m"){
			if(modelData.Status == "SUCCESS" && sortFlag[MAP_SUCCESS]){
				array.push(modelData.StartTime,ProcessTime,null,null,null,null,null,null);
			}else if(modelData.Status == "FAILED" && sortFlag[MAP_FAILED]){
				array.push(modelData.StartTime,null,ProcessTime,null,null,null,null,null);
			}else if(modelData.Status == "KILLED" && sortFlag[MAP_KILLED]){
				array.push(modelData.StartTime,null,null,ProcessTime,null,null,null,null);
			}
		}else if(modelData.Sort == "r"){
			if(modelData.Status == "SUCCESS" && sortFlag[REDUCE_SUCCESS]){
				array.push(modelData.StartTime,null,null,null,ProcessTime,null,null,null);
			}else if(modelData.Status == "FAILED" && sortFlag[REDUCE_FAILED]){
				array.push(modelData.StartTime,null,null,null,null,ProcessTime,null,null);
			}else if(modelData.Status == "KILLED" && sortFlag[REDUCE_KILLED]){
				array.push(modelData.StartTime,null,null,null,null,null,ProcessTime,null);
			}
		}else{
			array.push(modelData.StartTime,null,null,null,null,null,null,ProcessTime);
		}

		return array;
	},
	// データの種類、成功別に分類し、グラフ表示用の配列に加工する関数
	_sortingByFinishData : function(modelData){
		var array = [];
		var ProcessTime = (modelData.FinishTime-modelData.StartTime)/divTime;// 秒単位
		if(modelData.Sort == "m"){
			if(modelData.Status == "SUCCESS" && sortFlag[MAP_SUCCESS]){
				array.push(new Date(modelData.FinishTime),ProcessTime,null,null,null,null,null,null);
			}else if(modelData.Status == "FAILED" && sortFlag[MAP_FAILED]){
				array.push(new Date(modelData.FinishTime),null,ProcessTime,null,null,null,null,null);
			}else if(modelData.Status == "KILLED" && sortFlag[MAP_KILLED]){
				array.push(new Date(modelData.FinishTime),null,null,ProcessTime,null,null,null,null);
			}
		}else if(modelData.Sort == "r"){
			if(modelData.Status == "SUCCESS" && sortFlag[REDUCE_SUCCESS]){
				array.push(new Date(modelData.FinishTime),null,null,null,ProcessTime,null,null,null);
			}else if(modelData.Status == "FAILED" && sortFlag[REDUCE_FAILED]){
				array.push(new Date(modelData.FinishTime),null,null,null,null,ProcessTime,null,null);
			}else if(modelData.Status == "KILLED" && sortFlag[REDUCE_KILLED]){
				array.push(new Date(modelData.FinishTime),null,null,null,null,null,ProcessTime,null);
			}
		}else{
			array.push(new Date(modelData.FinishTime),null,null,null,null,null,null,ProcessTime);
		}

		return array;
	},
	// 系列の表示を変更する処理
	updateGraphOptions : function(){
		var instance = this;
		var xlabel;
		if(sortByFinishTime){
			xlabel = "FinishTime [Date]";
		}else{
			xlabel = "StartTime [Date]";
		}

		this.entity.updateOptions({
			xlabel : xlabel,
			visibility: [sortFlag[MAP_SUCCESS], sortFlag[MAP_FAILED], sortFlag[MAP_KILLED], sortFlag[REDUCE_SUCCESS], sortFlag[REDUCE_FAILED], sortFlag[REDUCE_KILLED], true],
			Null:{// 端の点のダミー定義
				pointSize : 0,
				highlightCircleSize : 0
			}
			/*
			 * 形表示用の定義の仕方 ReduceSuccess:{ //pointSize : 7, //drawPoints : false,
			 * drawPointCallback : instance._mouthlessFace,
			 * drawHighlightPointCallback : instance._mouthlessFace },
			 * ReduceFailed:{ drawPointCallback : instance._mouthlessFace,
			 * drawHighlightPointCallback : instance._mouthlessFace },
			 */
		});
	},
	 _processingData : function(value,index){
		 if(JOB_ID == value[index]['JobID']){
			 var Sort = value[index]['TaskAttemptID'].split("_");
			 var processedData = {
					 TaskAttemptID : value[index]['TaskAttemptID'],
					 StartTime : new Date(value[index]['StartTime']),
					 FinishTime : value[index]['FinishTime'],
					 Status : value[index]['Status'],
					 Sort : Sort[3],
					 HostName : value[index]['Hostname']
			 }
			 return processedData;
		}else{
			return null;
		}
	}
	/*
	 * 三角を描く関数 _mouthlessFace : function(g, seriesName, canvasContext, cx, cy,
	 * color, pointSize) { var canvasList = $("canvas"); var canvas =
	 * canvasList[0]; //if ( ! canvas || ! canvas.getContext ) { return false; }
	 * ctx = canvas.getContext("2d"); // 三角形を描く ctx.fillStyle = "#000000";
	 * ctx.beginPath(); ctx.moveTo(250, 10); ctx.lineTo(300, 90);
	 * ctx.lineTo(210, 90); ctx.closePath(); // 三角形を塗りつぶす ctx.fill(); return
	 * ctx; }
	 */

});

// ランダムデータ生成用関数
function randomData(){
	var dataArray = [];
	var SrandTime = 1346160591456;
	var max = 0;
	for(i = 0 ; i < taskNumber ; i++){
		SrandTime += parseInt(Math.random()*10000);
		var data = {
			TaskAttemptID : i,
			StartTime : new Date(SrandTime),
			FinishTime : SrandTime + parseInt(Math.random()*10000000),
			Status : Status_array[randomStatus()],
			Sort : Sort_array[parseInt(Math.random()*2)],
			HostName : null
		};
		var tempProcessTime = (new Date(data.FinishTime).getTime()-new Date(data.StartTime).getTime());
		if(max < tempProcessTime)max = tempProcessTime;
		if(i == 0){
			var nullData =　{
				TaskAttemptID : null,
				StartTime : new Date(SrandTime-30000),
				FinishTime : SrandTime-30000,
				Status : null,
				Sort : null,
				HostName : null,
			}
			dataArray.push(nullData);
		}
		dataArray.push(data);
		if(i == taskNumber-1){
			var nullData =　{
				TaskAttemptID : null,
				StartTime : new Date(SrandTime+30000),
				FinishTime : SrandTime+30000+max,
				Status : null,
				Sort : null,
				HostName : null,
			}
			dataArray.push(nullData);
		}
	}
	return dataArray;
}

function randomStatus(){
	var sr = parseInt(Math.random()*100);
	if(sr == 0){
		return 1;
	}else if(sr <= 5){
		return 2;
	}else{
		return 0;
	}
}

// データ振り分け用のフラグチェック(0:MapSuccess,1:MapFailed,2:MapKilled,3:ReduceSuccess,4:ReduceFailed,5:ReduceKilled)
function flagChange(index){
  	if(sortFlag[index]){
  		sortFlag[index] = false;
  	}else{
  		sortFlag[index] = true;
  	}
}

function sortChange(){
	if(sortByFinishTime){
		sortByFinishTime = false;
	}else{
		sortByFinishTime = true;
	}
}

// フラグが何かを見る
function flagCheck(index){
	if(sortFlag[index]){
		return "checked";
	}else{
		return "";
	}
}

// フィニッシュボタンが何かを見る



var sortListenerView = Backbone.View.extend({
    el: "#leftTop",// 左上のチェックボックス
    initialize : function(parentView){
    	this.parentView = parentView;
    	var instance = this;
    	$("#leftTop").find("#finishButton").click(function(e){
    		instance._check(e);
    		$("#finishButton").attr("value",sortCheck());
    	});
    },
// events: {
// "click input": "_check"
// },
    _check : function(e){
    	sortChange();
    	this.parentView.trigger("updateData");
    }
});

var graphListenerView = Backbone.View.extend({
    el: "#rightTop",// 右上のチェックボックス群
    initialize : function(parentView){
    	this.parentView = parentView;
    	var instance = this;
    	$("#rightTop").find("input").change(function(e){
    		instance._check(e);
    	});
    	
    },
// events: {
// "change input": "_check"
// },
    _check : function(e){
    	var id = $(e.target).attr("id");
    	flagChange(id);
    	this.parentView.trigger("updateGraphOptions");
    }
});

function sortCheck(){
	if(sortByFinishTime){
		return "StartTime";
	}else{
		// $("#leftTop").find("#finishButton").value=
		return "FinishTime";
	}
}

/*
 * var buttonView = Backbone.View.extend({ el : "#leftTop", events:{ "click":
 * "_back" }, _back : function(){ //alert(""); } });
 */