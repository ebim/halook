infinispan.TabView = wgp.AbstractView.extend({
	initialize : function(argument, treeSettings) {
		this.viewType = wgp.constants.VIEW_TYPE.TAB;
		this.collection = new TabModelList();
		this.treeSettings = treeSettings;
		this.viewList = {};
		this.divId = this.$el.attr("id");
		this.divTabId = this.$el.attr("id") + "_tab";
		this.maxId = 0;
		this.jobInfo = {
			jobName : argument.jobName,
			jobId : argument.jobId,
			startTime : argument.startTime,
			finishTime : argument.finishTime,
			jobStatus : argument.jobStatus
		};
		this.render();
		this.registerCollectionEvent();
		this.createdFlag = false;

		var instance = this;
		var collection = argument["collection"];
		_.each(collection, function(tabElement, index) {
			var tabModel = new instance.collection.model(tabElement);
			instance.collection.add(tabModel);
		});
	},
	render : function() {
		$("#" + this.divId).append("<ul id='" + this.divTabId + "'></ul>");
	},
	onAdd : function(tabModel) {
		var tabId = tabModel.get("tabId");
		var viewClassName = tabModel.get("viewClassName");
		var tabTitle = tabModel.get("tabTitle");
		var childCollection = tabModel.get("collection");

		if ($("#" + this.divTabId + "_" + tabId).length > 0) {
			alert("Already Exists Tab");
		}

		if (tabId != null) {
			if (tabId > this.maxId) {
				this.maxId = tabId;
			}

		} else {
			tabId = this.maxId;
			tabModel.set("tabId", tabId);
			this.maxId++;
		}

		if (this.createdFlag) {
			$("#" + this.divId).tabs("destroy");
		}

		var newDivTabId = this.divTabId + "_" + tabId;
		$("#" + this.divId).append("<div id=" + newDivTabId + "></div>");

		$("#" + newDivTabId).width("98%");
		$("#" + newDivTabId).height("98%");

		var title = $("<li></li>");
		var href = $("<a href=#" + newDivTabId + ">" + tabTitle + "</a>");
		title.append(href);
		$("#" + this.divTabId).append(title);
		$("#" + this.divId).tabs();
		this.createdFlag = true;

		var childAttribute = {
			id : newDivTabId,
			collection : childCollection,
			jobInfo : this.jobInfo,
			viewId : this.treeSettings.id + tabId
		};
		// 動的に生成するオブジェクトを切り替える必要があるため、やむを得ずeval()を使う
		var view = eval("new " + viewClassName
				+ "(childAttribute, this.treeSettings)");
		this.viewList[view.getRegisterId()] = view;
	},
	onChange : function(tabModel) {
		// blank
	},
	onRemove : function(tabModel) {
		var view = this.viewCollection(tabModel.id);
		$("#" + this.divId).tabs("remove", tabModel.id);
	},
	destroy : function() {
		var appView = ENS.AppView();
		_.each(this.viewList, function(view) {
			appView.removeView(view);
		});
	}
});