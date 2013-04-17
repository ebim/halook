var halook = {};

halook.ID = {};
halook.ID.MEASUREMENT_TIME = "measurementTime";
halook.ID.MEASUREMENT_VALUE = "measurementValue";
halook.ID.MEASUREMENT_ITEM_NAME = "measurementItemName";

halook.hbase = {};
halook.hbase.parent = {};
halook.hbase.dualslider = {};
halook.hbase.dualslider.UNIT = 60 * 60 * 1000;

halook.DATE_FORMAT_DETAIL = 'yyyy/MM/dd HH:mm:ss.fff';
halook.DATE_FORMAT_DAY = 'yyyy/MM/dd';
halook.DATE_FORMAT_HOUR = 'yyyy/MM/dd HH:mm';

halook.task = {};
halook.task.SUCCESSED = "SUCCEEDED";
halook.task.FAILED = "FAILED";
halook.task.FAILED_UNCLEAN = "FAILED_UNCLEAN";
halook.task.KILLED = "KILLED";
halook.task.COMMIT_PENDING = "COMMIT_PENDING";
halook.task.RUNNING = "running";

halook.job = {};
halook.job.SUCCESS = "success";
halook.job.FAIL = "fail";
halook.job.KILL = "kill";
halook.job.RUNNING = "running";

halook.HDFS = {};
halook.HDFS.MESURE_TERM = 13000;
halook.HDFS.BLOCK_TRANSFER_SPEED = 2000;
halook.HDFS.BLOCK_ROTATE_SPEED = 1000;

halook.hdfs = {};
halook.hdfs.constants = {};

halook.hdfs.constants.cycle = 5000;

halook.hdfs.constants.bgColor = "#000000";

halook.hdfs.constants.mainCircle = {};
halook.hdfs.constants.mainCircle.radius = 140;
halook.hdfs.constants.mainCircle.innerRate = 0.2;
halook.hdfs.constants.mainCircle.transferLineColor = "#EEEEEE";

halook.hdfs.constants.dataNode = {};
halook.hdfs.constants.dataNode.maxWidth = 60;
halook.hdfs.constants.dataNode.maxLength = 130;
halook.hdfs.constants.dataNode.frameColor = "rgba(255,255,255,0.5)";
halook.hdfs.constants.dataNode.color = {
	good : "#0C80A0",
	full : "#F09B4A",
	dead : "#AE1E2F"
};
halook.hdfs.constants.blockTransfer = {};
halook.hdfs.constants.blockTransfer.width = 4;
halook.hdfs.constants.blockTransfer.colorThreshold = 0.9;

halook.hdfs.constants.rack = {};
halook.hdfs.constants.rack.height = 10;
halook.hdfs.constants.rack.colors = [ "#666666", "#AAAAAA", "#CCCCCC" ];
// //////////////////////////////////////////////////////////
// option end
// //////////////////////////////////////////////////////////
halook.hdfs.constants.dataNode.status = {};
halook.hdfs.constants.dataNode.status.good = 0;
halook.hdfs.constants.dataNode.status.full = 1;
halook.hdfs.constants.dataNode.status.dead = 2;
halook.hdfs.constants.cycleInterval = 2000;
halook.hdfs.constants.hostnameAll = "--all--";

halook.gantt = {};
halook.gantt.WIDTH = 700;
halook.gantt.HEIGHT = 0;
halook.gantt.AXIS_COLOR = "rgb(255,255,255)";

// Dygraph用共通定義。
halook.graph = {};
halook.graph.labelsDivStyles = {
	background: "none repeat scroll 0 0 #000000"
};
halook.graph.axisLabelColor = "#FFFFFF";

halook.constants = {};
halook.constants.STATE = {};
halook.constants.STATE.SUCCESS = "success";
halook.constants.STATE.RUNNING = "running";

halook.constants.STATE.FAIL = "fail";
halook.constants.STATE.FAILED = "fail";
halook.constants.STATE.FAILED_UNCLEAN = "failed_unclean";
halook.constants.STATE.KILLED = "killed";
halook.constants.STATE.MNORMAL = "mnormal";
halook.constants.STATE.MRUNNING = "mrun";
halook.constants.STATE.MFAIL = "mfail";
halook.constants.STATE.MFAILED_UNCLEAN = "mfailed_unclean";
halook.constants.STATE.MKILLED = "mkilled";
halook.constants.STATE.MUNASSIGNED = "munassigned";
halook.constants.STATE.RNORMAL = "rnormal";
halook.constants.STATE.RRUNNING = "rrun";
halook.constants.STATE.RFAIL = "rfail";
halook.constants.STATE.RFAILED_UNCLEAN = "rfailed_unclean";
halook.constants.STATE.RKILLED = "rkilled";
halook.constants.STATE.RUNASSIGNED = "runassigned";
halook.constants.STATE.TASKKILLED = "killed";
halook.constants.STATE.TASKFAIL = "fail";

halook.constants.JOB_STATE = {};
halook.constants.JOB_STATE.NORMAL = "NORMAL";
halook.constants.JOB_STATE.RUNNING = "RUNNING";
halook.constants.JOB_STATE.FAIL = "FAILED";
halook.constants.JOB_STATE.FAILED = "FAILED";
halook.constants.JOB_STATE.FAILED_UNCLEAN = "FAILED_UNCLEAN";
halook.constants.JOB_STATE.KILLED = "KILLED";
halook.constants.JOB_STATE.KILLED_UNCLEAN = "KILLED_UNCLEAN";
halook.constants.JOB_STATE.UNASSIGNED = "UNASSIGNED";
halook.constants.JOB_STATE.SUCCESS = "SUCCESS";

halook.constants.STATE_COLOR = {};
halook.constants.STATE_COLOR[halook.constants.STATE.SUCCESS] = "#00FF00";
halook.constants.STATE_COLOR[halook.constants.STATE.RUNNING] = "#0000FF";
halook.constants.STATE_COLOR[halook.constants.STATE.KILLED] = "#777777";
halook.constants.STATE_COLOR[halook.constants.STATE.FAIL] = "#FF6600";
halook.constants.STATE_COLOR[halook.constants.STATE.FAILED] = "#FF6600";
halook.constants.STATE_COLOR[halook.constants.STATE.MFAILED_UNCLEAN] = "#FF0000";
halook.constants.STATE_COLOR[halook.constants.STATE.MNORMAL] = "#008000";
halook.constants.STATE_COLOR[halook.constants.STATE.MRUNNING] = "#00FF00";
halook.constants.STATE_COLOR[halook.constants.STATE.MFAIL] = "#FF0000";
halook.constants.STATE_COLOR[halook.constants.STATE.MKILLED] = "#777777";
halook.constants.STATE_COLOR[halook.constants.STATE.MUNASSIGNED] = "#696969";
halook.constants.STATE_COLOR[halook.constants.STATE.RNORMAL] = "#0000FF";
halook.constants.STATE_COLOR[halook.constants.STATE.RRUNNING] = "#0000FF";
halook.constants.STATE_COLOR[halook.constants.STATE.RFAIL] = "#C400C4";
halook.constants.STATE_COLOR[halook.constants.STATE.RFAILED_UNCLEAN] = "#C400C4";
halook.constants.STATE_COLOR[halook.constants.STATE.RKILLED] = "#777777";
halook.constants.STATE_COLOR[halook.constants.STATE.RUNASSIGNED] = "#696969";
halook.constants.STATE_COLOR[halook.constants.STATE.TASKEFAIL] = "#FF6600";
halook.constants.STATE_COLOR[halook.constants.STATE.TASKKILLED] = "#777777";
