import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.List;

public class MessageExchange {

    private JSONParser jsonParser = new JSONParser();

    public String getToken(int index) {
        Integer number = index * 8 + 11;
        return "TN" + number + "EN";
    }

    public int getIndex(String token) {
        return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
    }

    public String getServerResponse(List<String> messages) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("messages", messages);
        jsonObject.put("token", getToken(messages.size()));
        return jsonObject.toJSONString();
    }

    public String getClientSendMessageRequest(String message) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("message", message);
        return jsonObject.toJSONString();
    }

    public String getClientMessage(InputStream inputStream) throws ParseException {
        return (String) getJSONObject(inputStreamToString(inputStream)).get("message");
    }

    public JSONObject getJSONObject(String json) throws ParseException {
        return (JSONObject) jsonParser.parse(json);
    }

    public String inputStreamToString(InputStream in) {
        InputStreamReader is = new InputStreamReader(in);
        StringBuilder sb = new StringBuilder();
        BufferedReader br = new BufferedReader(is);
        String read = null;
        try {
            read = br.readLine();
        } catch (IOException e) {
            e.printStackTrace();
        }

        while (read != null) {
            sb.append(read);
            try {
                read = br.readLine();
            } catch (IOException e) {
                e.printStackTrace();
            }

        }

        return sb.toString();
    }
}
