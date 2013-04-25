wgp.MapElementView = Backbone.View.extend({
	// 本クラスはRaphaelを用いて描画する各マップ要素の基底ビュークラス
	initialize : function(argument) {
		_.bindAll();
		this._paper = argument.paper;
		if (this._paper == null) {
			alert("paper is not exist");
			return;
		}
		this.render(argument.model);
	},
	render : function(model){
		// renderメソッドは各継承先にてオーバーライドする。

		// 基底ビュークラスの共通的な処理
		// モデルをビュー自身に設定する。
		this.model = model;
		return this;
	},
	registerModelEvent : function(){

		// When Model Change
		this.model.on('change', this.change, this);

		// WHen Model Remove
		this.model.on('remove', this.remove, this);
	},
	change : function(){
		// changeメソッドは各継承先にてオーバーライドする。
	},
	remove : function(){
		// removeメソッドは各継承先にてオーバーライドする。
	},
	createPosition : function(x, y, width, height, value){
		return {
			x         : x,
			y         : y,
			width     : width,
			height    : height,
			initValue : value,
			URL       : null,
		};
	}
	
});