package by.bsu.up.chat;

import by.bsu.up.chat.logging.impl.Log;
import by.bsu.up.chat.server.ServerHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.util.Optional;
import java.util.concurrent.Executors;

public class Launcher {

    private static final Log logger = Log.create(Launcher.class);

    public static final int DEFAULT_SERVER_PORT = 8080;

    public static final String HELP_COMMAND = "--help";
    public static final String SHORT_HELP_COMMAND = "-h";

    public static final String PARAM_PORT = "--port";
    public static final String SHORT_PARAM_PORT = "-p";

    public static final int MAX_PORT_VALUE = 1 << 16 - 1;

    public static void main(String[] args) {
        if (args == null || args.length == 0) {
            logger.info(String.format("Port is not specified. Starting Server on default port %d", DEFAULT_SERVER_PORT));
            launchServer(new String[] {SHORT_PARAM_PORT, String.valueOf(DEFAULT_SERVER_PORT) });
            return;
        }

        if (args[0].equals(HELP_COMMAND) ||
                args[0].equals(SHORT_HELP_COMMAND)) {
            printHelp();
            return;
        }
        if (args[0].equals(PARAM_PORT) || args[0].equals(SHORT_PARAM_PORT)) {
            launchServer(args);
            return;
        }
    }

    private static void printHelp() {
        System.out.println("-p port \t\t - start server on port");
        System.out.println("-h, --help \t\t - print help");
    }

    public static void launchServer(String[] args) {
        if (!String.join(" ", args).matches("(-p|--port) [0-9]{1,5}")) {
            logger.info("Invalid command. Please see help");
            return;
        }
        Optional<Integer> optPort = getPortFromArgs(args[1]);
        if (!optPort.isPresent()) {
            return;
        }

        int port = optPort.get();
        try {
            logger.info("Starting server on localhost...");
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
            logger.info("Server started.");
            String serverHost = InetAddress.getLocalHost().getHostAddress();
            logger.info(String.format("Get list of messages: " +
                    "GET http://%s:%d%s?token={token}", serverHost, port, Constants.CONTEXT_PATH));
            logger.info(String.format("Send message: " +
                    "POST http://%s:%d%s provide body json in format {\"id\" : \"1\", \"author\":\"User1\", \"text\":\"Hello, all!\", \"timestamp\":1459169330000}",
                    serverHost, port, Constants.CONTEXT_PATH));

            server.createContext(Constants.CONTEXT_PATH, new ServerHandler());
            server.setExecutor(Executors.newSingleThreadExecutor());
            server.start();
        } catch (IOException e) {
            logger.error("Could not launch server", e);
        }
    }

    private static Optional<Integer> getPortFromArgs(String portArg) {
        int port;
        try {
            port = Integer.parseInt(portArg);
        } catch (NumberFormatException e) {
            logger.info("Incorrect port specified.");
            return Optional.empty();
        }
        if (port > MAX_PORT_VALUE || port < 0) {
            logger.info(String.format("Invalid port. Please specify value in range [0 - %d]", MAX_PORT_VALUE));
            return Optional.empty();
        }
        return Optional.of(port);
    }
}
