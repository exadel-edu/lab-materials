package org.exadel.todos.dao;

import java.util.List;
import org.exadel.todos.model.Task;

public interface TaskDao {
	void add(Task task);

	void update(Task task);

	void delete(int id);

	Task selectById(Task task);

	List<Task> selectAll();
}
