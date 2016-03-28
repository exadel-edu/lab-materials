package by.bsu.up.chat.logging.impl;

import by.bsu.up.chat.logging.Logger;

public class Log implements Logger {

    private static final String TEMPLATE = "[%s] %s";

    private String tag;

    private Log(Class<?> cls) {
        tag = String.format(TEMPLATE, cls.getName(), "%s");
    }

    @Override
    public void info(String message) {
        System.out.println(String.format(tag, message));
    }

    @Override
    public void error(String message, Throwable e) {
        System.err.println(String.format(tag, message));
        e.printStackTrace(System.err);
    }

    public static Log create(Class<?> cls) {
        return new Log(cls);
    }
}
