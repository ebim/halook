
infinispan.hbase = {};

// parent area view
infinispan.hbase.parent = {
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
infinispan.hbase.graph = {
	_dataArray		: [],
	_dataDelimin	: ',',
	attributes : {
		//width		: "650",
		height		: "400",
		xlabel		: "Time",
		ylabel		: "Number of region",
		labels		: ["Time", "Number of region"],
		legend		: "always",
		labelsDiv	: infinispan.hbase.parent.id.legendArea,
		//labelsDiv	: "legendArea",
		labelsDivWidth			: 100,
		hideOverlayOnMouseOut	: false,
		dateWindow	:	null,
		labelsDivStyles : infinispan.graph.labelsDivStyles,
		axisLabelColor : infinispan.graph.axisLabelColor
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
				backgroundColor : 'red',
				border			: '4px outset red'			
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
				border			: '4px outset #0079F2'
			}
		},
		MinorCompaction	: {
			className		: 'minorCompaction',
			shortText		: 'M',
			text			: 'Minor Compaction was occured',
			css				: {
				color			: 'black',
				backgroundColor : '#00E7F2',
				border			: '4px outset #00E7F2'
			}
		},
		Split : {
			className		: 'split',
			shortText		: 'S',
			text			: 'Split was occured',
			css				: {
				color			: 'black',
				backgroundColor : '#36F200',
				border			: '4px outset #36F200'
			}
		}
	}
};