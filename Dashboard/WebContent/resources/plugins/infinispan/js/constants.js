var infinispan = {};

infinispan.ID = {};
infinispan.ID.MEASUREMENT_TIME = "measurementTime";
infinispan.ID.MEASUREMENT_VALUE = "measurementValue";
infinispan.ID.MEASUREMENT_ITEM_NAME = "measurementItemName";

infinispan.hbase = {};
infinispan.hbase.parent = {};
infinispan.hbase.dualslider = {};
infinispan.hbase.dualslider.UNIT = 60 * 60 * 1000;

infinispan.DATE_FORMAT_DETAIL = 'yyyy/MM/dd HH:mm:ss.fff';
infinispan.DATE_FORMAT_DAY = 'yyyy/MM/dd';
infinispan.DATE_FORMAT_HOUR = 'yyyy/MM/dd HH:mm';

infinispan.task = {};
infinispan.task.SUCCESSED = "SUCCEEDED";
infinispan.task.FAILED = "FAILED";
infinispan.task.FAILED_UNCLEAN = "FAILED_UNCLEAN";
infinispan.task.KILLED = "KILLED";
infinispan.task.COMMIT_PENDING = "COMMIT_PENDING";
infinispan.task.RUNNING = "running";

infinispan.job = {};
infinispan.job.SUCCESS = "success";
infinispan.job.FAIL = "fail";
infinispan.job.KILL = "kill";
infinispan.job.RUNNING = "running";

infinispan.Heap = {};
infinispan.Heap.MESURE_TERM = 13000;
infinispan.Heap.BLOCK_TRANSFER_SPEED = 2000;
infinispan.Heap.BLOCK_ROTATE_SPEED = 1000;

infinispan.heap = {};
infinispan.heap.constants = {};

infinispan.heap.constants.cycle = 5000;

infinispan.heap.constants.bgColor = "#000000";

infinispan.heap.constants.mainCircle = {};
infinispan.heap.constants.mainCircle.radius = 140;
infinispan.heap.constants.mainCircle.innerRate = 0.2;
infinispan.heap.constants.mainCircle.transferLineColor = "#EEEEEE";

infinispan.heap.constants.dataNode = {};
infinispan.heap.constants.dataNode.maxWidth = 60;
infinispan.heap.constants.dataNode.maxLength = 130;
infinispan.heap.constants.dataNode.frameColor = "rgba(255,255,255,0.5)";
infinispan.heap.constants.dataNode.color = {
	good : "#0C80A0",
	full : "#F09B4A",
	dead : "#AE1E2F"
};
infinispan.heap.constants.blockTransfer = {};
infinispan.heap.constants.blockTransfer.width = 4;
infinispan.heap.constants.blockTransfer.colorThreshold = 0.9;

infinispan.heap.constants.rack = {};
infinispan.heap.constants.rack.height = 10;
infinispan.heap.constants.rack.colors = [ "#666666", "#AAAAAA", "#CCCCCC" ];
// //////////////////////////////////////////////////////////
// option end
// //////////////////////////////////////////////////////////
infinispan.heap.constants.dataNode.status = {};
infinispan.heap.constants.dataNode.status.good = 0;
infinispan.heap.constants.dataNode.status.full = 1;
infinispan.heap.constants.dataNode.status.dead = 2;
infinispan.heap.constants.cycleInterval = 2000;
infinispan.heap.constants.hostnameAll = "--all--";

infinispan.gantt = {};
infinispan.gantt.WIDTH = 700;
infinispan.gantt.HEIGHT = 0;
infinispan.gantt.AXIS_COLOR = "rgb(255,255,255)";

// Dygraph用共通定義。
infinispan.graph = {};
infinispan.graph.labelsDivStyles = {
	background: "none repeat scroll 0 0 #000000"
};
infinispan.graph.axisLabelColor = "#FFFFFF";

infinispan.constants = {};
infinispan.constants.STATE = {};
infinispan.constants.STATE.SUCCESS = "success";
infinispan.constants.STATE.RUNNING = "running";

infinispan.constants.STATE.FAIL = "fail";
infinispan.constants.STATE.FAILED = "fail";
infinispan.constants.STATE.FAILED_UNCLEAN = "failed_unclean";
infinispan.constants.STATE.KILLED = "killed";
infinispan.constants.STATE.NORMAL = "normal";
infinispan.constants.STATE.RUNNING = "run";
infinispan.constants.STATE.UNASSIGNED = "unassigned";
infinispan.constants.STATE.TASKKILLED = "killed";
infinispan.constants.STATE.TASKFAIL = "fail";

infinispan.constants.JOB_STATE = {};
infinispan.constants.JOB_STATE.NORMAL = "NORMAL";
infinispan.constants.JOB_STATE.RUNNING = "RUNNING";
infinispan.constants.JOB_STATE.FAIL = "FAILED";
infinispan.constants.JOB_STATE.FAILED = "FAILED";
infinispan.constants.JOB_STATE.FAILED_UNCLEAN = "FAILED_UNCLEAN";
infinispan.constants.JOB_STATE.KILLED = "KILLED";
infinispan.constants.JOB_STATE.KILLED_UNCLEAN = "KILLED_UNCLEAN";
infinispan.constants.JOB_STATE.UNASSIGNED = "UNASSIGNED";
infinispan.constants.JOB_STATE.SUCCESS = "SUCCESS";

infinispan.constants.STATE_COLOR = {};
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.SUCCESS] = "#00FF00";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.RUNNING] = "#0000FF";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.KILLED] = "#777777";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.FAIL] = "#FF6600";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.FAILED] = "#FF6600";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.FAILED_UNCLEAN] = "#FF0000";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.NORMAL] = "#008000";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.RUNNING] = "#00FF00";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.KILLED] = "#777777";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.UNASSIGNED] = "#696969";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.TASKEFAIL] = "#FF6600";
infinispan.constants.STATE_COLOR[infinispan.constants.STATE.TASKKILLED] = "#777777";
