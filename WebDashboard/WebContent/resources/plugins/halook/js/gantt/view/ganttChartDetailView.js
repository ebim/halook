var ganttChartDetailView = wgp.AbstractView.extend({
	initialize : function() {
		this.viewType = wgp.constants.VIEW_TYPE.VIEW;
		this.collection = new GanttChartModelCollection();
		this.attributes = {};

		this.maxId = 0;

		var realTag = $("#" + this.$el.attr("id"));
		if (this.width == null) {
			this.width = realTag.width();
		}
		if (this.height == null) {
			this.height = realTag.height();
		}
	},
	render : function() {
	},
	onAdd : function(element) {
	},
	onChange : function(element) {
	},
	onRemove : function(element) {
	},
});
