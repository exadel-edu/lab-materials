package by.bsu.up.chat;

import by.bsu.up.chat.client.Client;
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

    public static final String HELP_COMMAND = "--help";
    public static final String SHORT_HELP_COMMAND = "-h";
    public static final String SERVER_COMMAND = "--server";
    public static final String SHORT_SERVER_COMMAND = "-s";
    public static final String CLIENT_COMMAND = "--client";
    public static final String SHORT_CLIENT_COMMAND = "-c";
    public static final String PARAM_PORT = "-p";
    public static final String PARAM_HOST = "-h";

    public static final int MAX_PORT_VALUE = 1 << 16 - 1;

    public static void main(String[] args) {
        if (args == null || args.length == 0 ||
                args[0].equals(HELP_COMMAND) ||
                args[0].equals(SHORT_HELP_COMMAND)) {
            printHelp();
            return;
        }
        if (args[0].equals(SERVER_COMMAND) || args[0].equals(SHORT_SERVER_COMMAND)) {
            launchServer(args);
            return;
        }
        if (args[0].equals(CLIENT_COMMAND) || args[0].equals(SHORT_CLIENT_COMMAND)) {
            launchClient(args);
        }
    }

    private static void printHelp() {
        System.out.println("-s, --server -p port \t\t - start server on port");
        System.out.println("-c, --client -h host -p port \t\t - start server on port");
        System.out.println("-h, --help \t\t - print help");
    }

    public static void launchServer(String[] args) {
        if (String.join(" ", args).matches("(-s)|(--server) -p [0-9]{1,5}")) {
            logger.info("Invalid command. Please see help");
        }
        Optional<Integer> optPort = getPortFromArgs(args[2]);
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
                    "POST http://%s:%d%s provide body json in format {\"message\" : \"{message}\"}",
                    serverHost, port, Constants.CONTEXT_PATH));

            server.createContext(Constants.CONTEXT_PATH, new ServerHandler());
            server.setExecutor(Executors.newSingleThreadExecutor());
            server.start();
        } catch (IOException e) {
            logger.error("Could not launch server", e);
        }
    }

    public static void launchClient(String[] args) {
        String hostPattern = "(http|ftp|https):\\/\\/[\\w\\-_]+(\\.[\\w\\-_]+)+([\\w\\-\\.,@?^=%&amp;:/~\\+#]*[\\w\\-\\@?^=%&amp;/~\\+#])?";
        String commandRegex = "(-c)|(--client) -l " + hostPattern + "[A-z0-9.] -p [0-9]{1,5}";

        if (String.join(" ", args).matches(commandRegex)) {
            logger.info("Invalid command. Please see help");
        }
        Optional<Integer> optPort = getPortFromArgs(args[4]);
        if (!optPort.isPresent()) {
            return;
        }
        String host = args[2];
        int port = optPort.get();

        logger.info(String.format("Connection to server by address %s:%d", host, port));
        Client client = new Client(host, port);
        client.connect();
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
