//var hdfsViewTestDataSender = function (){

var now = new Date();
var year = now.getYear(); // 年
var month = now.getMonth() + 1; // 月
var day = now.getDate(); // 日
var hour = now.getHours(); // 時
var min = now.getMinutes(); // 分
var sec = now.getSeconds(); // 秒

dataNo = 0;
dataFromServer = {};
setDataFromServer();
function setDataFromServer() {
	dataFromServer = {
		timestamp : year + month + day + "_" + hour + ":" + min + ":" + sec,
		data : [ {
			host : "host1",
			rack : "rack1",
			capacity : 130,
			used : 0
		}, {
			host : "host3",
			rack : "rack1",
			capacity : 72,
			used : 33 + parseInt(Math.random() * 20)
		}, {
			host : "host2",
			rack : "rack1",
			capacity : 74,
			used : 52 + parseInt(Math.random() * 20)
		}, {
			host : "host4",
			rack : "rack1",
			capacity : 120,
			used : 43 + parseInt(Math.random() * 20)
		}, {
			host : "host5",
			rack : "rack1",
			capacity : 60,
			used : 42 + parseInt(Math.random() * 20)
		}, {
			host : "host6",
			rack : "rack1",
			capacity : 142,
			used : 43 + parseInt(Math.random() * 20)
		}, {
			host : "host7",
			rack : "rack1",
			capacity : 78,
			used : 52 + parseInt(Math.random() * 20)
		}, {
			host : "host8",
			rack : "rack1",
			capacity : 53,
			used : 49 + parseInt(Math.random() * 20)
		}, {
			host : "host9",
			rack : "rack2",
			capacity : 122,
			used : 0
		}, {
			host : "host10",
			rack : "rack2",
			capacity : 131,
			used : 49 + parseInt(Math.random() * 20)
		}, {
			host : "host11",
			rack : "rack2",
			capacity : 121,
			used : 46 + parseInt(Math.random() * 20)
		}, {
			host : "host12",
			rack : "rack2",
			capacity : 113,
			used : 48 + parseInt(Math.random() * 20)
		}, {
			host : "host13",
			rack : "rack2",
			capacity : 53,
			used : 38 + parseInt(Math.random() * 20)
		}, {
			host : "host14",
			rack : "rack2",
			capacity : 147,
			used : 53 + parseInt(Math.random() * 20)
		}, {
			host : "host15",
			rack : "rack2",
			capacity : 50,
			used : 49 + parseInt(Math.random() * 20)
		}, {
			host : "host16",
			rack : "rack2",
			capacity : 114,
			used : 31 + parseInt(Math.random() * 20)
		}, {
			host : "host17",
			rack : "rack2",
			capacity : 137,
			used : 58 + parseInt(Math.random() * 20)
		}, {
			host : "host18",
			rack : "rack3",
			capacity : 117,
			used : 39 + parseInt(Math.random() * 20)
		}, {
			host : "host19",
			rack : "rack3",
			capacity : 90,
			used : 59 + parseInt(Math.random() * 20)
		}, {
			host : "host20",
			rack : "rack3",
			capacity : 70,
			used : 55 + parseInt(Math.random() * 20)
		}, {
			host : "host21",
			rack : "rack3",
			capacity : 106,
			used : 57 + parseInt(Math.random() * 20)
		}, {
			host : "host22",
			rack : "rack3",
			capacity : 145,
			used : 49 + parseInt(Math.random() * 20)
		}, {
			host : "host23",
			rack : "rack3",
			capacity : 68,
			used : 44 + parseInt(Math.random() * 20)
		}, {
			host : "host24",
			rack : "rack3",
			capacity : 74,
			used : 36 + parseInt(Math.random() * 20)
		}, {
			host : "host25",
			rack : "rack3",
			capacity : 110,
			used : 42 + parseInt(Math.random() * 20)
		}, {
			host : "host26",
			rack : "rack3",
			capacity : 132,
			used : 46 + parseInt(Math.random() * 20)
		}, {
			host : "host27",
			rack : "rack4",
			capacity : 59,
			used : 30 + parseInt(Math.random() * 20)
		}, {
			host : "host28",
			rack : "rack4",
			capacity : 114,
			used : 30 + parseInt(Math.random() * 20)
		}, {
			host : "host29",
			rack : "rack4",
			capacity : 53,
			used : 44 + parseInt(Math.random() * 20)
		}, {
			host : "host30",
			rack : "rack4",
			capacity : 61,
			used : 48 + parseInt(Math.random() * 20)
		}, {
			host : "host31",
			rack : "rack4",
			capacity : 141,
			used : 49 + parseInt(Math.random() * 20)
		}, {
			host : "host32",
			rack : "rack4",
			capacity : 56,
			used : 48 + parseInt(Math.random() * 20)
		}, {
			host : "host33",
			rack : "rack4",
			capacity : 102,
			used : 49 + parseInt(Math.random() * 20)
		}, {
			host : "host34",
			rack : "rack4",
			capacity : 95,
			used : 39 + parseInt(Math.random() * 20)
		}, {
			host : "host35",
			rack : "rack4",
			capacity : 136,
			used : 46 + parseInt(Math.random() * 20)
		}, {
			host : "host36",
			rack : "rack5",
			capacity : 135,
			used : 48 + parseInt(Math.random() * 20)
		}, ]
	};
}
