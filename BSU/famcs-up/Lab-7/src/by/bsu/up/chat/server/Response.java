package by.bsu.up.chat.server;

import by.bsu.up.chat.Constants;

public class Response {

    private int statusCode;
    private String body;

    public Response(int statusCode, String body) {
        this.statusCode = statusCode;
        this.body = body;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public static Response badRequest(String body) {
        return new Response(Constants.RESPONSE_CODE_BAD_REQUEST, body);
    }

    public static Response ok() {
        return new Response(Constants.RESPONSE_CODE_OK, "");
    }

    public static Response ok(String body) {
        return new Response(Constants.RESPONSE_CODE_OK, body);
    }

    public static Response withCode(int code) {
        return new Response(code, "");
    }
}
