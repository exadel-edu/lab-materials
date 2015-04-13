package org.exadel.todos.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public final class TaskStorage {
	private static final List<Task> INSTANSE = Collections.synchronizedList(new ArrayList<Task>());

	private TaskStorage() {
	}

	public static List<Task> getStorage() {
		return INSTANSE;
	}

	public static void addTask(Task task) {
		INSTANSE.add(task);
	}

	public static void addAll(Task[] tasks) {
		INSTANSE.addAll(Arrays.asList(tasks));
	}

	public static int getSize() {
		return INSTANSE.size();
	}

	public static List<Task> getSubTasksByIndex(int index) {
		return INSTANSE.subList(index, INSTANSE.size());
	}

	public static Task getTaskById(String id) {
		for (Task task : INSTANSE) {
			if (task.getId().equals(id)) {
				return task;
			}
		}
		return null;
	}

}
