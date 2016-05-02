package by.bsu.fpmi.up.samples.authentication.servlets;

import by.bsu.fpmi.up.samples.authentication.StaticKeyStorage;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet(urlPatterns = "/auth", initParams = {
        @WebInitParam(name = "cookie-live-time", value = "300")
})
public class AuthenticationServlet extends HttpServlet {

    private static final String PARAM_USERNAME = "username";
    public static final String COOKIE_USER_ID = "uid";
    public static final String PARAM_UID = COOKIE_USER_ID;

    private int coockieLifeTime = -1;

    @Override
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        coockieLifeTime = Integer.parseInt(config.getInitParameter("cookie-live-time"));
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter(PARAM_USERNAME);
        if (username == null || username.trim().isEmpty()) {
            resp.sendError(400, "Bad request");
            resp.getOutputStream().println(String.format("paramater %s is required", PARAM_USERNAME));
            return;
        }
        String userId = StaticKeyStorage.getByUsername(username);
        if (userId == null) {
            resp.sendError(400, "Bad request");
            resp.getOutputStream().println("Unsupporeted user: " + username);
            return;
        }

        Cookie userIdCookie = new Cookie(COOKIE_USER_ID, userId);
        userIdCookie.setMaxAge(coockieLifeTime);
        resp.addCookie(userIdCookie);
        resp.sendRedirect("/userinfo.jsp");
    }
}