             ■■■ halook ビルド手順 ■■■

１．ツールの準備
  (1) JDK
    Java6 がインストールされていることが前提です。
    
  (2) Ant 用ライブラリ
   　Ant のバージョンは 1.7.0 以降が必要です。

２．ビルド
  (1)GitHubから、以下のプロジェクトをcloneしてください。
　　(すでにclone済みの場合は不要です。)
  
     endosnipe/halook

  (2)HalookJavelinのベースとして使用するJavelinの
　　媒体を、GitHubのendosnipe/downloadsから取得してください。

  (3)取得したJavelinのzipファイルを
　　endosnipe/halook/HalookJavelin/libにコミット、syncしてください。

  (4)build.ps1 を開き、以下の環境変数を設定してからコミット、
　　syncしてください。
     ・$tags   →タグ名称(バージョン-ビルド番号)
                 例：5.0.1-001

  (5)endosnipe/halook/build.propertiesを開き、
　　以下の設定を行ってください。
    ・javelin.version→Javelinバージョン
    ・halook.version→Halookバージョン

  (6)Git ShellのPowerShellを開き、build.ps1のあるディレクトリに
　　　移動してください。
  
  (7)以下のコマンドラインを実行します。
    > build.ps1
  
　(8)リポジトリのdownloadsディレクトリ内に、
　　　タグ名称のディレクトリを作成してください。

　(9)(7)で出力されたファイルを、(6)で作成したディレクトリに配置し、
　　　コミット、syncしてください。

３．ローカルビルド(開発時)
  ■HalookJavelinのビルド
  (1)Javelinを修正した場合、修正したJavelinの媒体を、
　　halook/HalookJavelin/libに配置してください。

  (2)halook/HalookJavelinに移動して、以下を実行してください。
　　> ant
　　> ant -f build_merge.xml

  (3)halook/HalookJavelin/distにビルド結果が出力されます。

  ■Webdashboardのビルド
  (1)halook/WebDashboardに移動して、以下を実行してください。
　　> ant

  (2)halook/WebDashboard/targetにビルド結果が出力されます。


以上


