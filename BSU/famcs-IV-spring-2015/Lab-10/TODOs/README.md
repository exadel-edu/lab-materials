# TODOs web app

* **front-end**: HTML5, css3, js
* **back-end**: Java Servlet Technology
	
## Requirements

1. [JDK 8](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
2. [Maven 3](http://maven.apache.org/)
4. [Tomcat 8](https://tomcat.apache.org/download-80.cgi)


## How to give it a go?

1. Clone the repositry
        
        git clone git@github.com:ibuziuk/TODOs.git
        
2. Import the project to IDE
        
3. Add Tomcat Server to IDE
        
4. Run the project on Tomcat Server from IDE

5. Open `http://localhost:8080/TODOs/` in browser


## How run the project without IDE?
        
1. Buid the project via maven
        
        mvn clean package
        
2. `TODOs.war` will be created under `target` folder
        
3. Put `TODOs.war` to the Tomcat's `webapps` folder
        
4. Run Tomcat from console (`startup.bat` or `startup.sh` depending on OS)

5. Open `http://localhost:8080/TODOs/` in browser
