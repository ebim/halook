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

  (3)取得したJavelinのzipファイルを展開し、javelin.jarを取得してください。
  
  (4)javelin.jarを、endosnipe/halook/HalookJavelin/libにコミット、
　　syncしてください。

  (5)build.ps1 を開き、以下の環境変数を設定してからコミット、
　　syncしてください。
     ・$tags   →タグ名称
     
  (6)Git ShellのPowerShellを開き、build.ps1のあるディレクトリに
　　　移動してください。
  
  (7)以下のコマンドラインを実行します。
    > build.ps1
  
  (8)「すべてのビルドプロセスが完了しました。」と表示されたら完了です。
  　　build\ENdoSnipe\releaseディレクトリにビルド結果のファイルが
　　　出力されています。

　()リポジトリのdownloadsディレクトリ内に、
　　　タグ名称のディレクトリを作成してください。

　(9)(7)で出力されたファイルを、(6)で作成したディレクトリに配置し、
　　　コミット、syncしてください。

以上


