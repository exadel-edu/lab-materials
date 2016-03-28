rmdir -rf bin

mkdir bin

"%JAVA_HOME%/bin/javac" -d bin -sourcepath src -cp libs/json-simple-1.1.1.jar src/by/bsu/up/chat/*.java