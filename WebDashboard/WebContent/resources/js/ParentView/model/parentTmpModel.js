var parentTmpModel = Backbone.Model.extend({
	defaults:{
		SubmitTime:null,
		StartTime:null,
		FinishTime:null,
		JobID:null,
		Status:null,
		Hostname:null,
		TaskAttemptID: null,
		Mapreduce: null,
		SimpleID: null,
		attemptTime: null,
	},
	idAttribute:"TaskAttemptID",
});

var parentTmpModelCollection = Backbone.Collection.extend({
	model : parentTmpModel
});