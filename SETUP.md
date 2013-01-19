# halook環境構築

## 0. はじめに
本書は、halookを用いてHadoop／HBaseの監視を行うための環境を構築する手順を説明します。

## 1. 提供ファイル
1. HalookJavelin_5.0.0.zip  
	halook用Javelinのみを持つ差分ファイル媒体です。既存のJavelin動作環境に上書きすることでhalook用のJavelinを利用可能にします。

2. HalookJavelinFull_5.0.0.zip  
	Javelinの媒体にHalookJavelinをマージした媒体です。新規環境にまとめてインストールする際に利用します。

3. HalookDashboard.war  
	halook用のUIを提供するDashboardの媒体です。Tomcatにデプロイして使用します。

4. endosnipe-datacollector-5.0.0.zip / endosnipe-datacollector-5.0.0.tar.gz  
	DataCollectorの媒体です。ENdoSnipeの媒体に含まれています。(halookとしてのリリース媒体には含まれません)

## 2. インストール方法
### 2.1. 動作環境
1. HalookJavelin  
	Hadoop／HBaseが動作する環境(Linux)に準じます  
	Java 5以降

2. DataCollector  
	WindowsまたはLinux  
	PostgreSQL 8.4以降  
	Java 5以降

3. HalookDashboard  
	WindowsまたはLinux  
	Tomcat 7.0.29以降  
	Java 6以降

4. halookクライアント(ブラウザ)  
	Firefox 13以降

### 2.2. 事前準備
1.   Java  
	[OracleのWebサイト](http://www.oracle.com/technetwork/java/javase/downloads/index.html)から、Javaをダウンロードしてインストールしてください。
	- Java 6  
	※Java SE Downloadsにある最新版(JDK)を取得してください
	- Java 5  
	※Java SE Downloadsから「Previous Releases」をたどってください

2. PostgreSQL  
	[PostgreSQLユーザ会のWebサイト](http://www.postgresql.jp/)から、PostgreSQLをダウンロードしてインストールしてください。
	
	DataCollectorをインストールする(した)サーバからのアクセスを許可しておいてください。(pg_hba.confの編集と、PostgreSQLサーバの再起動が必要です)
		
	halook／ENdoSnipeが使用するデータベースやテーブルは、DataCollectorが自動的に作成します。  

3. Tomcat  
	[Apache TomcatのWebサイト](http://tomcat.apache.org/download-70.cgi)から、Tomcatをダウンロードしてインストールしてください。
	- Tomcat 7 Downloads
		
	ManagerUIからのデプロイを行う場合は、`${CATALINA_HOME}/conf/tomcat-users.xml` に管理者権限を持つユーザの追加が必要となります。

	```
	<tomcat-users>
		<role rolename="manager-gui"/>
		<role rolename="manager-status"/>
		<user username="admin" password="(パスワード)" roles="manager-gui,manager-status"/>
	</tomcat-users>
	```


### 2.3. HalookJavelin
1. (a) 新規インストールの場合  
	HalookJavelinFull_5.0.0.zip を任意のディレクトリに展開してください。

	※ここでは、/opt/ENdoSnipe の下に展開したものと仮定します

	` JAVELIN_HOME=/opt/ENdoSnipe/Javelin`
	

	(b) 既存動作中のJavelinに上書きする場合  
	HalookJavelin_5.0.0.zip を、任意の一時ディレクトリに展開してください。

	※ここでは、/tmp/halook の下に展開したものと仮定します
	
	その後、展開したファイルのうち、HalookJavelin ディレクトリの中身を既存の Javelin ディレクトリに上書きしてください。

	`JAVELIN_HOME=/opt/ENdoSnipe/Javelin` 


2. 展開後、`${JAVELIN_HOME}/conf/javelin.properties`を編集し、以下の値を環境に合わせて設定してください。

	(以下はデフォルト時の設定値です)

	```
	# JavelinからDataCollectorに接続するため、client としてください
	javelin.connection.mode=client
		
	# 接続先となるDataCollectorが動作するホスト名を記述してください
	javelin.connectHost=localhost
	
	# 接続先となるDataCollectorのポート番号を記述してください
	javelin.connectPort=19000
		
	# 計測値を保存するデータベース名を記述してください
	# Javelin側で設定した名前に従って、DataCollectorがデータベースを作成します
	javelin.databaseName=endosnipedb
		
	# オプション
	# 計測項目名(ID)の接頭辞にする文字列
	javelin.resource.itemName.prefix=/javelin
		
	# オプション
	# 計測項目名(ID)に接頭辞を付与しない項目の前方一致パターンリスト
	#javelin.resource.itemName.noPrefixList=/hdfs,/mapreduce
	```

	
3. NameNode、JobTracker、HMasterへの設定以下の各ファイルを編集して、Javelinの設定をを行ってください。

	```
	[/etc/hadoop/conf/hadoop-env.sh]
	# NameNodeへの設定
	export HADOOP_NAMENODE_OPTS="-javaagent:/opt/ENdoSnipe/Javelin/lib/HalookJavelin.jar ...(以下略)
	
	# JobTrackerへの設定
	export HADOOP_JOBTRACKER_OPTS="-javaagent:/opt/ENdoSnipe/Javelin/lib/HalookJavelin.jar ...(以下略)
	```
	※NameNodeとJobTrackerを同一サーバ内で動作させる場合は、Javelinのインストールディレクトリをそれぞれ分けてください。
		
	```
	[/etc/hbase/conf/hbase-env.sh]
	# HMasterへの設定
	export HBASE_MASTER_OPTS="-javaagent:/opt/ENdoSnipe/Javelin/lib/HalookJavelin.jar ...(以下略)"
	```

	※NameNodeやJobTrackerなどと同一サーバで動作させる場合は、Javelinのインストールディレクトリをそれぞれ分けてください。
  
	
4. 設定後、NameNode、JobTracker、HMasterをそれぞれ再起動すれば、完了となります。

### 2.4. DataCollector
1. 媒体を展開する  
	Windows環境で使用する場合は endosnipe-datacollector-5.0.0.zip を、Linux環境で使用する場合は endosnipe-datacollector-5.0.0.tar.gz を任意のディレクトリに展開してください。  

	※ここでは、Linux環境で /opt/ENdoSnipe の下に展開したものと仮定します
	`COLLECTOR_HOME=/opt/ENdoSnipe/DataCollector`

	
2. `${COLLECTOR_HOME}/conf/collector.properties` を編集し、以下の値を環境に合わせて設定してください。

	(以下はデフォルト時の設定値です)
	```
	# 受信した値を保存するデータベースサーバ名を記述してください
	database.host=localhost
			
	# Javelinからの接続を受け付けるため、server としてください
	connection.mode=server
	
	# Javelinからの接続を待ち受けるホスト名(IPアドレス)を記述してください
	accept.host=localhost
	
	# Javelinからの接続を待ち受けるポート番号を記述してください
	accept.port=19000
	```

3. 設定が完了したら、起動してください

### 2.5. HalookDashboard
1. TomcatのManagerUIを表示して、warファイルをデプロイしてください
	
2. 初回起動後、すぐに終了させ、`${CATALINA_HOME}/webapps/WebDashboard/WEB-INF`ディレクトリ内にある web.xml ファイルを編集してください。

	※変更箇所付近を抜粋
	```
	<servlet>
	  <servlet-name>DashBoardNotifyServlet</servlet-name>
	  <servlet-class>jp.co.acroquest.endosnipe.web.dashboard.servlet.DashBoardNotifyServlet</servlet-class>
	  <init-param>
	  <param-name>collector.property</param-name>
	  <!-- 以下の値を、collector.properties があるディレクトリに設定してください -->
	    <param-value>/path/to/WebDashboard/conf/collector.properties</param-value>
	  </init-param>
	```
    
3. 設定が完了したら、改めてTomcatを起動してください

### 2.6. Webブラウザからのアクセス
1. Webブラウザ(Firefox)から、以下のURLを開いてください。

	`http://(HalookDashboard実行サーバ):8080/HalookDashboard/halook`

## 3. 特記事項
特にありません。


以上
