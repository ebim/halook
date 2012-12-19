


halook.hbase = {};

// parent area view
halook.hbase.parent = {
	id : {
		informationArea		: 'informationArea',
		legendArea			: 'legendArea',
		annotationLegendArea: 'annotationLegendArea',
		dualSliderArea		: 'dualSliderArea',
		graphArea			: 'graphArea'
	},
	css : {
		informationArea : {
			fontSize	: "14px",
			float		: "right",
			width		: "180px",
			height		: "350px",
			border		: "1px #dcdcdc solid",
			margin		: "10px 20px 0px 0px"
		},
		legendArea : {
			height	: "40px",
			margin	: "5px 5px 5px 5px"
		},
		annotationLegendArea : {
				margin	: "0px 0px 0px 0px",
				padding	: "5px 5px 5px 5px"
		},
		dualSliderArea : {
				//width	: "auto",
				margin	: "20px 0px 0px 60px"
		},
		graphArea : {
				float	: "left",
				width	: "650px",
				height	: "400px",
				margin	: "20px 0px 0px 10px"
		}
	}
};

// graph area view
halook.hbase.graph = {
	_dataArray		: [],
	_dataDelimin	: ',',
	attributes : {
		//width		: "650",
		height		: "400",
		xlabel		: "Time",
		ylabel		: "Number of region",
		labels		: ["Time", "Number of region"],
		legend		: "always",
		labelsDiv	: halook.hbase.parent.id.legendArea,
		//labelsDiv	: "legendArea",
		labelsDivWidth			: 100,
		hideOverlayOnMouseOut	: false,
		dateWindow	:	null
	},
	annotation : {
		shortTextClassName		: 'annotationShortText',
		xValueClassNamePrefix	: 'x_'
	},
	eventType : {
		multiple : {
			className		: 'multiple',
			shortText		: '*',
			text			: 'Multiple Events were occured',
			css				: {
				color			: 'white',
				backgroundColor : 'black',
				border			: '0px black solid'			
			}
		},
		MajorCompaction	: {
			className		: 'majorCompaction',
			shortText		: 'M',
			text			: 'Major Compaction was occured',
			css				: {
				color			: 'black',
				backgroundColor : '#0079F2',
				//backgroundColor : 'transparent',
				border			: '0px #0079F2 solid'
			}
		},
		MinorCompaction	: {
			className		: 'minorCompaction',
			shortText		: 'M',
			text			: 'Minor Compaction was occured',
			css				: {
				color			: 'black',
				backgroundColor : '#00E7F2',
				border			: '0px #00E7F2 solid'
			}
		},
		Split : {
			className		: 'split',
			shortText		: 'S',
			text			: 'Split was occured',
			css				: {
				color			: 'black',
				backgroundColor : '#36F200',
				border			: '0px #36F200 solid'
			}
		}
	}
}





var data_list = [];
var time = (new Date()).getTime() - 60 * 60 * 24 * 1000;
var region_number = 2;
var region_server_number = 2;

event_list = ["", 
              "", 
              "", 
              "", 
              "minorCompaction", 
              "minorCompaction", 
              "minorCompaction",
              "majorCompaction", 
              "split",
              "minorCompaction,split"];

for(var i=0; i<60*24; i++){
	time += 60000;
	if (Math.random() > 0.2){
		region_number += Math.floor(Math.random() * 5 );
		region_server_number += Math.floor( Math.random() * 5 );
	}else{
		region_number -= Math.floor(Math.random() * 5 );
		region_server_number -= Math.floor(Math.random() * 5 );
	}
	
	var output = {}
	output.timestamp = time;
	output.data = {
		region_number			: region_number,
		region_server_number 	: region_server_number
	};
	output.event = event_list[Math.floor( Math.random() * 10 )];
	
	halook.hbase.graph._dataArray.push(output);
	
};
