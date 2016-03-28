package by.bsu.up.chat;

public interface Constants {
    String PROTOCOL = "http";
    String CONTEXT_PATH = "/chat";

    String REQUEST_METHOD_GET = "GET";
    String REQUEST_METHOD_POST = "POST";
    String REQUEST_METHOD_PUT = "PUT";
    String REQUEST_METHOD_DELETE = "DELETE";
    String REQUEST_METHOD_OPTIONS = "OPTIONS";

    String REQUEST_HEADER_ACCESS_CONTROL_ORIGIN = "Access-Control-Allow-Origin";
    String REQUEST_HEADER_ACCESS_CONTROL_METHODS = "Access-Control-Allow-Methods";

    String HEADER_VALUE_ALL_METHODS =String.join(", ",
            REQUEST_METHOD_GET, REQUEST_METHOD_POST, REQUEST_METHOD_PUT, REQUEST_METHOD_DELETE);

    int RESPONSE_CODE_OK = 200;
    int RESPONSE_CODE_NOT_MODIFIED = 200;
    int RESPONSE_CODE_BAD_REQUEST = 400;
    int RESPONSE_CODE_METHOD_NOT_ALLOWED = 405;
    int RESPONSE_CODE_INTERNAL_SERVER_ERROR = 500;
    int RESPONSE_CODE_NOT_IMPLEMENTED = 501;

    String REQUEST_PARAMS_DELIMITER = "&";
    String REQUEST_PARAM_TOKEN = "token";
    String REQUEST_PARAM_MESSAGE_ID = "msgId";

    int MESSAGE_FLUSH_TARIGGER = 3;

    interface Message {
        String FIELD_ID = "id";
        String FIELD_AUTHOR = "author";
        String FIELD_TIMESTAMP = "timestamp";
        String FIELD_TEXT = "text";
    }
}
