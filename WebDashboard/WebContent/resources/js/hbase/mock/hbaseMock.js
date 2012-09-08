var region_num = 5;
function hbaseMock(){
	
	var delta = 2;
	region_num += delta
	var hbaseProperty1 = {
			type			: wgp.constants.CHANGE_TYPE.ADD,
			//time			: "2012-08-28 14:00:00",
			timestamp		: new Date(),
			region_number	: 4,
			amount			: 10,
			event			: "split"
		};
	
	sendData = [ {
		windowId : "contents_area_0",
		//windowId   : halook.hbase.parent.id.graphArea,
		//windowId : "aaaaaaaaaaagraphArea",
		data : [hbaseProperty1]
	} ];
	console.log("------- send data -------");
	console.log(sendData);
	console.log("-------------------------");
	appView.notifyEvent(sendData);
	
};