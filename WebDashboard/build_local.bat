@echo off

rem ---------------------------------------------------------------------------
set VER=5.0.1
set BUILD=002
rem ---------------------------------------------------------------------------

set JAVA_HOME=C:\Program Files\Java\jdk1.6.0_39
set PATH=%JAVA_HOME%\bin;%PATH%
set JAVACMD=%JAVA_HOME%\bin\javaw.exe

echo ビルドを開始します。
echo ===============================
echo ●JAVAバージョン
java -version
echo ●タグ
echo %TAGS%
echo ===============================

pause

echo Antを実行します。
ant

echo ビルドが完了しました。
