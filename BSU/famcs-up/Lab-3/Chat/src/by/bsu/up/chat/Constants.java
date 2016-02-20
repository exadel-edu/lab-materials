package by.bsu.up.chat;

public interface Constants {
    String PROTOCOL = "http";
    String CONTEXT_PATH = "/chat";

    String REQUEST_METHOD_GET = "GET";
    String REQUEST_METHOD_POST = "POST";

    String REQUEST_HEADER_ACCESS_CONTROL = "Access-Control-Allow-Origin";

    int RESPONSE_CODE_OK = 200;
    int RESPONSE_CODE_BAD_REQUEST = 400;
    int RESPONSE_CODE_METHOD_NOT_ALLOWED = 405;
    int RESPONSE_CODE_INTERNAL_SERVER_ERROR = 500;

    String REQUEST_PARAMS_DELIMITER = "&";
    String REQUEST_PARAM_TOKEN = "token";
}
