package by.bsu.fpmi.up.samples.authentication.filters;

import by.bsu.fpmi.up.samples.authentication.StaticKeyStorage;
import by.bsu.fpmi.up.samples.authentication.servlets.AuthenticationServlet;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebFilter(value = "/userinfo.jsp")
public class AuthenticationFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        String uidParam = request.getParameter(AuthenticationServlet.PARAM_UID);
        if (uidParam == null && request instanceof HttpServletRequest ) {
            Cookie[] cookies = ((HttpServletRequest) request).getCookies();
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals(AuthenticationServlet.COOKIE_USER_ID)) {
                    uidParam = cookie.getValue();
                }
            }
        }
        boolean auhenticated = checkAuthenticated(uidParam);
        if (auhenticated) {
            chain.doFilter(request, response);
        } else if (response instanceof HttpServletResponse) {
            ((HttpServletResponse) response).sendRedirect("/unauthorized.html");
        } else {
            response.getOutputStream().println("403, Forbidden");
        }

    }

    private boolean checkAuthenticated(String uid) {
        return StaticKeyStorage.getUserByUid(uid) != null;
    }

    @Override
    public void destroy() {

    }
}
