ENS.AddSingnalDialogView = wgp.AbstractView.extend({
	/**
	 * @param option
	 *            option is following key value set dialogId : display diaolog's
	 *            id name <br />
	 *            okObject : if push OK button, execute target <br />
	 *            okFunctionName : if push OK button, execute okFunction of
	 *            okObject <br />
	 *            cancelObject : if push Cancel button, execute target <br />
	 *            cancelFunctionName : if push Cancel button, execute
	 *            cancelFunctionName of cancelObject <br />
	 */
	initialize : function(option) {
		var ins = this;
		this.op_ = option;
		this.id = option.dialogId;
		var okName = "okFunctionName";
		var okObj = "okObject";
		var cName = "cancelFunctionName";
		var cObj = "cancelObject";
		$("#" + option.dialogId).dialog({
			buttons : [ {
				text : "OK",
				click : function(event) {
					// 
					$("#" + option.dialogId).dialog("close");
					if (!ins.op_[okObj]) {
						return;
					}
					if (!ins.op_[okObj][ins.op_[okName]]) {
						return;
					}
					ins.op_[okObj][ins.op_[okName]](event, ins.op_);
				}
			}, {
				text : "Cancel",
				click : function() {
					$("#" + option.dialogId).dialog("close");
					if (!ins.op_[cObj]) {
						return;
					}
					if (!ins.op_[cObj][ins.op_[cName]]) {
						return;
					}
					ins.op_[cObj][ins.op_[cName]](event, ins.op_);
				}
			} ],
			modal : true,
			width : 350
		});
	},
	render : function() {
		$("#" + this.id).dialog("open");
	}
});