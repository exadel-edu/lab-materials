# Windows

## Compile
* javac -cp "./json-simple-1.1.1.jar;" -Xlint:unchecked Client.java
* javac -cp "./json-simple-1.1.1.jar;" -Xlint:unchecked Server.java

##Run
* start java -cp "./json-simple-1.1.1.jar;" Server 999
* start java -cp "./json-simple-1.1.1.jar;" Client localhost 999
* start java -cp "./json-simple-1.1.1.jar;" Client localhost 999

# Linux or OS X

## Compile
* javac -cp "json-simple-1.1.1.jar:" -Xlint:unchecked Client.java
* javac -cp "json-simple-1.1.1.jar:" -Xlint:unchecked Server.java

## Run
* sudo java -cp "json-simple-1.1.1.jar:" Server 999
* java -cp "json-simple-1.1.1.jar:" Client localhost 999
