## Запуск

* открыть index.html (в Chrome)
* запустить сервер используя localhost:999
* для подключения к серверу нажмите File->Connect

## Access-Control-Allow-Origin:*

Для работы приложения необходима последняя версия сервера, которая отсылает заголовок Access-Control-Allow-Origin:*

```
import com.sun.net.httpserver.Headers;
...
    private void sendResponse(HttpExchange httpExchange, String response) {
        try {
            byte[] bytes = response.getBytes();
            Headers headers = httpExchange.getResponseHeaders(); // !!!
            headers.add("Access-Control-Allow-Origin","*");      // !!!
            httpExchange.sendResponseHeaders(200, bytes.length);
```

Альтернативный вариант - закрыть браузер Chrome(все окна !)  и перезапустить с параметром --disable-web-security (в командной строке)
