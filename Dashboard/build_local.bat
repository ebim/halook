@echo off

rem ---------------------------------------------------------------------------
set VER=5.0.1
set BUILD=002
rem ---------------------------------------------------------------------------

set JAVA_HOME=C:\Program Files\Java\jdk1.6.0_39
set PATH=%JAVA_HOME%\bin;%PATH%
set JAVACMD=%JAVA_HOME%\bin\javaw.exe

echo �r���h���J�n���܂��B
echo ===============================
echo ��JAVA�o�[�W����
java -version
echo ���^�O
echo %TAGS%
echo ===============================

pause

echo Ant�����s���܂��B
ant

echo �r���h���������܂����B
