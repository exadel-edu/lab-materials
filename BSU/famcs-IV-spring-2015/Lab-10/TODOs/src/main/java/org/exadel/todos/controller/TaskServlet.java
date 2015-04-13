package org.exadel.todos.controller;

import static org.exadel.todos.util.TaskUtil.TASKS;
import static org.exadel.todos.util.TaskUtil.TOKEN;
import static org.exadel.todos.util.TaskUtil.getIndex;
import static org.exadel.todos.util.TaskUtil.getToken;
import static org.exadel.todos.util.TaskUtil.jsonToTask;
import static org.exadel.todos.util.TaskUtil.stringToJson;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.exadel.todos.model.Task;
import org.exadel.todos.model.TaskStorage;
import org.exadel.todos.util.ServletUtil;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;

@WebServlet("/todos")
public class TaskServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static Logger logger = Logger.getLogger(TaskServlet.class.getName());

	@Override
	public void init() throws ServletException {
		addStubData();
	}

	@Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doGet");
		String token = request.getParameter(TOKEN);
		logger.info("Token " + token);

		if (token != null && !"".equals(token)) {
			int index = getIndex(token);
			logger.info("Index " + index);
			String tasks = formResponse(index);
			response.setContentType(ServletUtil.APPLICATION_JSON);
			PrintWriter out = response.getWriter();
			out.print(tasks);
			out.flush();
		} else {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST, "'token' parameter needed");
		}
	}

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doPost");
		String data = ServletUtil.getMessageBody(request);
		logger.info(data);
		try {
			JSONObject json = stringToJson(data);
			Task task = jsonToTask(json);
			TaskStorage.addTask(task);
			response.setStatus(HttpServletResponse.SC_OK);
		} catch (ParseException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@Override
	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("doPut");
		String data = ServletUtil.getMessageBody(request);
		logger.info(data);
		try {
			JSONObject json = stringToJson(data);
			Task task = jsonToTask(json);
			String id = task.getId();
			Task taskToUpdate = TaskStorage.getTaskById(id);
			if (taskToUpdate != null) {
				taskToUpdate.setDescription(task.getDescription());
				taskToUpdate.setDone(task.isDone());
				response.setStatus(HttpServletResponse.SC_OK);
			} else {
				response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Task does not exist");
			}
		} catch (ParseException e) {
			logger.error(e);
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
		}
	}

	@SuppressWarnings("unchecked")
	private String formResponse(int index) {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put(TASKS, TaskStorage.getSubTasksByIndex(index));
		jsonObject.put(TOKEN, getToken(TaskStorage.getSize()));
		return jsonObject.toJSONString();
	}

	private void addStubData() {
		Task[] stubTasks = { 
				new Task("1", "Create markup", true), 
				new Task("2", "Learn JavaScript", true),
				new Task("3", "Learn Java Servlet Technology", false),
				new Task("4", "Write The Chat !", false), };
		TaskStorage.addAll(stubTasks);
	}

}
