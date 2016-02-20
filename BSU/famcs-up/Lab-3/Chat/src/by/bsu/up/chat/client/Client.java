package by.bsu.up.chat.client;

import by.bsu.up.chat.Constants;
import by.bsu.up.chat.logging.Logger;
import by.bsu.up.chat.logging.impl.Log;
import by.bsu.up.chat.utils.MessageHelper;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.net.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Client {

    public static final long POLLING_PERIOD_MILLIS = 1000L;

    private static final Logger logger = Log.create(Client.class);

    private List<String> localHistory = new ArrayList<String>();

    private String host;
    private int port;

    private boolean connected = false;

    private Thread listenerThread;
    private Thread messageSendingThread;

    public Client(String host, Integer port) {
        this.host = host;
        this.port = port;
    }

    public void connect() {
        URL url = null;
        try {
            url = new URL(Constants.PROTOCOL, host, port, Constants.CONTEXT_PATH);
            url.openConnection();   //try connect to server
            connected = true;
            startListening();
            startMessageSending();
        } catch (MalformedURLException e) {
            logger.error("Could not build URL to server", e);
            throw new RuntimeException(e);
        } catch (IOException e) {
            logger.error(String.format("Could not connect to server on %s", url.toString()), e);
        }

    }

    private HttpURLConnection prepareInputConnection(URL url) throws IOException {
        HttpURLConnection connection = HttpURLConnection.class.cast(url.openConnection());
        connection.setDoInput(true);
        return connection;
    }

    private HttpURLConnection prepareOutputConnection() throws IOException {
        URL url = new URL(Constants.PROTOCOL, host, port, Constants.CONTEXT_PATH);
        HttpURLConnection connection = HttpURLConnection.class.cast(url.openConnection());
        connection.setRequestMethod(Constants.REQUEST_METHOD_POST);
        connection.setDoOutput(true);
        return connection;
    }

    public void disconnect() {

        // Thread#stop method is deprecated. The listeners threads stops when
        // finish it's runnable action.
        connected = false;
    }

    private void startListening() {
        // if listener thread is alive and listening now, no need to recreate. Just reuse it.
        if (listenerThread != null && listenerThread.isAlive()) {
            return;
        }

        Runnable listeningAction = () -> {
            boolean running = true;
            while (connected && running) {
                List<String> list = getMessages();

                localHistory.addAll(list);

                try {
                    Thread.sleep(POLLING_PERIOD_MILLIS);
                } catch (InterruptedException e) {
                    logger.error("The message listening thread was interrupted", e);
                    running = false;
                }
            }
        };
        listenerThread = new Thread(listeningAction);
        listenerThread.start();
    }

    private void startMessageSending() {
        // if listener thread is alive and listening now, no need to recreate. Just reuse it.
        if (messageSendingThread != null && messageSendingThread.isAlive()) {
            return;
        }

        Runnable messageSendingAction = () -> {

            Scanner scanner = new Scanner(System.in);
            while (connected) {
                String message = scanner.nextLine();
                sendMessage(message);
            }
        };
        messageSendingThread = new Thread(messageSendingAction);
        messageSendingThread.start();
    }

    private void checkConnected() {
        if (!connected) {
            RuntimeException notConnectedError = new RuntimeException("No connection to server");
            logger.error("No connection to server", notConnectedError);
            throw notConnectedError;
        }
    }

    public List<String> getMessages() {
        checkConnected();
        List<String> list = new ArrayList<>();
        HttpURLConnection incomeConnection = null;
        try {

            String query = String.format("%s?%s=%s", Constants.CONTEXT_PATH, Constants.REQUEST_PARAM_TOKEN, MessageHelper.buildToken(localHistory.size()));
            URL url = new URL(Constants.PROTOCOL, host, port, query);
            incomeConnection = prepareInputConnection(url);

            String response = MessageHelper.inputStreamToString(incomeConnection.getInputStream());
            JSONObject jsonObject = MessageHelper.stringToJsonObject(response);
            JSONArray jsonArray = (JSONArray) jsonObject.get("messages");
            for (Object o : jsonArray) {
                logger.info(String.format("Message from server: %s", o));
                list.add(o.toString());
            }


            /**
             * Here is an example how for cycle can be replaced with Java 8 Stream API
             */
            // jsonArray.forEach(System.out::println);
            // list = (List<String>) jsonArray.stream().map(Object::toString).collect(Collectors.toList());

        } catch (ParseException e) {
            logger.error("Could not parse message", e);
        } catch (ConnectException e) {
            logger.error("Connection error. Disconnecting...", e);
            disconnect();
        } catch (IOException e) {
            logger.error("IOException occured while reading input message", e);
        } finally {
            if (incomeConnection != null) {
                incomeConnection.disconnect();
            }
        }

        return list;
    }

    public void sendMessage(String message) {
        checkConnected();
        HttpURLConnection outcomeConnection = null;
        try {
            outcomeConnection = prepareOutputConnection();
            byte[] buffer = MessageHelper.buildSendMessageRequestBody(message).getBytes();
            OutputStream outputStream = outcomeConnection.getOutputStream();
            outputStream.write(buffer, 0, buffer.length);
            outputStream.close();
            outcomeConnection.getInputStream(); //to send data to server
        } catch (ConnectException e) {
            logger.error("Connection error. Disconnecting...", e);
            disconnect();
        } catch (IOException e) {
            logger.error("IOException occurred while sending message", e);
        } finally {
            if (outcomeConnection != null) {
                outcomeConnection.disconnect();
            }
        }
    }
}
