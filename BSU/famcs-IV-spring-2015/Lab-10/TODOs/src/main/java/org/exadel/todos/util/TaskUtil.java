package org.exadel.todos.util;

import org.exadel.todos.model.Task;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

public final class TaskUtil {
	public static final String TOKEN = "token";
	public static final String TASKS = "tasks";
	private static final String TN = "TN";
	private static final String EN = "EN";
	private static final String ID = "id";
	private static final String DESCRIPTION = "description";
	private static final String DONE = "done";

	private TaskUtil() {
	}

	public static String getToken(int index) {
		Integer number = index * 8 + 11;
		return TN + number + EN;
	}

	public static int getIndex(String token) {
		return (Integer.valueOf(token.substring(2, token.length() - 2)) - 11) / 8;
	}

	public static JSONObject stringToJson(String data) throws ParseException {
		JSONParser parser = new JSONParser();
		return (JSONObject) parser.parse(data.trim());
	}

	public static Task jsonToTask(JSONObject json) {
		Object id = json.get(ID);
		Object description = json.get(DESCRIPTION);
		Object done = json.get(DONE);

		if (id != null && description != null && done != null) {
			return new Task((String) id, (String) description, (Boolean) done);
		}
		return null;
	}
}
