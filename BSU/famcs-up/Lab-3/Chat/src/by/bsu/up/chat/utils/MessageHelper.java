package by.bsu.up.chat.utils;

import by.bsu.up.chat.InvalidTokenException;
import by.bsu.up.chat.logging.Logger;
import by.bsu.up.chat.logging.impl.Log;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.util.List;

public class MessageHelper {

    public static final String MESSAGE_PART_ALL_MSG = "messages";
    public static final String MESSAGE_PART_SINGLE_MSG = "message";
    public static final String MESSAGE_PART_TOKEN = "token";
    public static final String TOKEN_TEMPLATE = "TN%dEN";
    public static final String TOKEN_FORMAT = "TN[0-9]{2,}EN";

    private static final JSONParser jsonParser = new JSONParser();
    private static final Logger logger = Log.create(MessageHelper.class);

    /**
     * Builds token based on amount of messages, which are
     * already stored on server side or client side.
     * <p>
     *     E.g. Client has 5 messages. It does not want to
     *     retrieve messages it already has. So, client
     *     passes 5 as argument to this method, and this method
     *     will return a token, which says to server: Just give
     *     me all messages, but skip first 5.
     *
     * <p>
     *     On the other hand, server passes amount of messages it has
     *     (size of messages collection). So, client can parse
     *     token and understand how many messages are on server side
     * @param receivedMessagesCount amount of messages to skip.
     * @return generated token
     */
    public static String buildToken(int receivedMessagesCount) {
        Integer stateCode = encodeIndex(receivedMessagesCount);
        return String.format(TOKEN_TEMPLATE, stateCode);
    }

    /**
     * Parses token and extract encoded amount of messages (typically - index)
     * @param token the token to be parsed
     * @return decoded amount messages (index)
     */
    public static int parseToken(String token) {
        if (!token.matches(TOKEN_FORMAT)) {
            throw new InvalidTokenException("Incorrect format of token");
        }
        String encodedIndex = token.substring(2, token.length() - 2);
        try {
            int stateCode = Integer.valueOf(encodedIndex);
            return decodeIndex(stateCode);
        } catch (NumberFormatException e) {
            logger.error("Could not parse token", e);
            throw new InvalidTokenException("Invalid encoded value: " + encodedIndex);
        }
    }

    private static int encodeIndex(int receivedMessagesCount) {
        return receivedMessagesCount * 8 + 11;
    }

    private static int decodeIndex(int stateCode) {
        return (stateCode - 11) / 8;
    }

    @SuppressWarnings("unchecked")      //allows to suppress warning of unchecked parameter type for generics
    public static String buildServerResponseBody(List<String> messages, int lastPosition) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(MESSAGE_PART_ALL_MSG, messages);
        jsonObject.put(MESSAGE_PART_TOKEN, buildToken(lastPosition));
        return jsonObject.toJSONString();
    }

    @SuppressWarnings("unchecked")
    public static String buildSendMessageRequestBody(String message) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put(MESSAGE_PART_SINGLE_MSG, message);
        return jsonObject.toJSONString();
    }

    public static String getClientMessage(InputStream inputStream) throws ParseException {
        return (String) stringToJsonObject(inputStreamToString(inputStream)).get(MESSAGE_PART_SINGLE_MSG);
    }

    public static JSONObject stringToJsonObject(String json) throws ParseException {
        // The same as (JSONObject) jsonParser.parse(json.trim());
        return JSONObject.class.cast(jsonParser.parse(json.trim()));
    }

    public static String inputStreamToString(InputStream in) {
        byte[] buffer = new byte[1024];
        int length = 0;
        try (ByteArrayOutputStream outStream = new ByteArrayOutputStream()) {
            while ((length = in.read(buffer)) != -1) {
                outStream.write(buffer, 0, length);
            }
            return outStream.toString();
        } catch (IOException e) {
            logger.error("An error occurred while reading input stream", e);
            throw new RuntimeException(e);
        }
    }
}
