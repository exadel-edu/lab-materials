@set XXX=%PATH%
@set PATH=%JAVA_HOME%\bin
start java -cp "./json-simple-1.1.1.jar;" Server 999
start java -cp "./json-simple-1.1.1.jar;" Client localhost 999
start java -cp "./json-simple-1.1.1.jar;" Client localhost 999
@set PATH=%XXX%