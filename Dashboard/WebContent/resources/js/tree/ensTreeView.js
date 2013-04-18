ENS.treeView = wgp.TreeView.extend({
	setClickEvent : function(targetId){
		var instance = this;
		this.treeCollection = {};
		this.maxId = 0;
		this.targetId = targetId;
		$("#" + this.$el.attr("id")).mousedown(function(event) {
			var whichValue = event.which;
			if (whichValue != 1) {
				return;
			}
			var target = event.target;
			if ("A" == target.tagName) {
				var treeId = $(target).attr("id");
				var treeModel = instance.collection.get(treeId);
				instance.clickModel(treeModel);
			}
		});
	},
	clickModel : function(treeModel) {
		if (this.childView) {
			var tmpAppView = new wgp.AppView();
			tmpAppView.removeView(this.childView);
			this.childView = null;
		}
		$("#" + this.targetId).children().remove();
		var targetContentId = this.targetId + "_content";
		$("#" + this.targetId).append("<div id ='" + targetContentId + "'></div>")

		var dataId = treeModel.get("id");

		var viewSettings = null;
		$.each(wgp.constants.VIEW_SETTINGS, function(index, value) {
			if (dataId.match(index)) {
				viewSettings = value;
				return false;
			}
		});
		if (viewSettings == null) {
			viewSettings = wgp.constants.VIEW_SETTINGS["default"];
			if (viewSettings == null) {
				return;
			}
		}
		var viewClassName = viewSettings.viewClassName;
		$.extend(true, viewSettings, {
			id : targetContentId
		});
		var treeSettings = treeModel.attributes;
		// 動的に生成するオブジェクトを切り替える必要があるため、やむを得ずeval()を使う
		this.childView = eval("new " + viewClassName
				+ "(viewSettings, treeSettings)");
	},
	render : function(renderType, treeModel) {
		if (renderType == wgp.constants.RENDER_TYPE.ADD) {
			var parentTreeId = treeModel.get("parentTreeId");
			var idAttribute = treeModel.idAttribute;
			if (parentTreeId !== null && parentTreeId !== undefined) {
				targetTag = this.getTreeNode(parentTreeId, idAttribute);
			}

			$("#" + this.$el.attr("id")).jstree("create_node",
					$(targetTag), "last",
					this.createTreeData(treeModel));
		} else {
			wgp.TreeView.prototype.render.call(this,
					renderType, treeModel);
		}
	},
	createTreeData : function(treeModel){
		var returnData = wgp.TreeView.prototype.createTreeData.call(this, treeModel);
		var titleData = returnData.data;
		if (titleData.title.indexOf("&#47;") >= 0) {
			titleData.title = titleData.title.split("&#47;").join("/");
		} 
		if (treeModel.get("icon")) {
			returnData.data.icon = treeModel.get("icon");
		}
		return returnData;
	},
	addContextMenu : function(contextOption) {
		// contextOptionの中身
		// "menu_id" : 表示するコンテキストメニュータグのID名,
		// "menu_name" : 表示するメニュー名
		// "showParam" : コンテキストメニュー表示制限, 
		// "executeClass" : メニュー選択時の実行クラス。
		// "children" : 子要素のコンテキストオプション
		var instance = this;
		this.contextCollection = new Backbone.Collection();
		this.addContextCollection_(contextOption);
		// コンテキストメニュー用のタグを生成する。
		var menuId = this.$el.attr("id") + "_contextManu";
		var tmpClickTarget = null;
		var settingOptions = {
			onShow : function(event, target){
				var clickTarget = event.target;
				var tagName = clickTarget.tagName;
				if (tagName != "A") {
					return false;
				}
				var clickTargetId = $(clickTarget).attr("id");
				instance.checkShowContext_(clickTargetId);
				tmpClickTarget = clickTarget;
			},
			onSelect : function(event, target){
				var clickTarget = event.target;
				var id = $(clickTarget).attr("id");
				var targetOption = instance.getContextOption_(id);
				if (targetOption == null) {
					return;
				}
				var executeClass = targetOption.get("executeClass");
				if (executeClass) {
					var executeOption = targetOption.get("executeOption");
					executeOption.treeId = $(tmpClickTarget).attr("id");
					executeOption.displayName = $(tmpClickTarget).text();
					
					// set execute class and function, if push ok button.
					executeOption.okObject = instance;
					executeOption.okFunctionName = "pushOkFunction";
					executeOption.cancelObject = instance;
					executeOption.cancelFunctionName = "pushCancelFunction";
					eval("new " + executeClass
							+ "(executeOption)");
				}
			}
		};
		contextMenuCreator.initializeContextMenu(menuId, contextOption);
		contextMenuCreator.createContextMenu(this.$el.attr("id"), menuId, settingOptions);
	},
	pushOkFunction : function(event, option) {
		// add tree data for signal
		var signalName = $("#signalName").val();
		var targetTreeId = option.treeId;
		// TODO change the setting sinalTreeId.
		var signalTreeId = targetTreeId + "/singalNode-1"
		var treeOption = {
			id : signalTreeId,
			data : signalName,
			parentTreeId : targetTreeId,
			icon : ENS.tree.SIGNAL_ICON
		}
		this.collection.add([treeOption]);
	},
	pushCancelFunction : function(event, option) {
		var a = null;
	},
	checkShowContext_ : function(id){
		$.each(this.contextCollection.models, function(index, value){
			var menuId = value.get("menu_id");
			$("#" + menuId).show();
			var showParam = value.get("showParam");
			if (!showParam) {
				return true;
			}
			var reg = new RegExp(showParam, "i");
			if (!id.match(reg)) {
				$("#" + menuId).hide();
			};
		});
	},
	addContextCollection_ : function(contextOption){
		var instance = this;
		jQuery.each(contextOption, function(index, target){
			instance.contextCollection.push(target);
			var children = target.children;
			if (children != null && children.length != 0){
				instance.addContextCollection_(children);
			}
		});
	},
	getContextOption_ : function(id){
		var optionList = this.contextCollection.where({menu_id : id});
		if (optionList == null) {
			return;
		}
		if (optionList.length == 0) {
			return;
		}
		return optionList[0];
	}
});