package org.exadel.todos.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.exadel.todos.db.ConnectionManager;
import org.exadel.todos.model.Task;

public class TaskDaoImpl implements TaskDao {

	@Override
	public void add(Task task) {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionManager.getConnection();
			preparedStatement = connection.prepareStatement("INSERT INTO tasks (id, description, done) VALUES (?, ?, ?)");
			preparedStatement.setInt(1, task.getId());
			preparedStatement.setString(2, task.getDescription());
			preparedStatement.setBoolean(3, task.isDone());
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}

			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}

	@Override
	public void update(Task task) {
		Connection connection = null;
		PreparedStatement preparedStatement = null;
		try {
			connection = ConnectionManager.getConnection();
			preparedStatement = connection.prepareStatement("Update tasks SET description = ?, done = ? WHERE id = ?");
			preparedStatement.setString(1, task.getDescription());
			preparedStatement.setBoolean(2, task.isDone());
			preparedStatement.setInt(3, task.getId());
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (preparedStatement != null) {
				try {
					preparedStatement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}

			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
	}

	@Override
	public Task selectById(Task task) {
		throw new UnsupportedOperationException();
	}

	@Override
	public List<Task> selectAll() {
		List<Task> tasks = new ArrayList<>();
		Connection connection = null;
		Statement statement = null;
		ResultSet resultSet = null;

		try {
			connection = ConnectionManager.getConnection();
			statement = connection.createStatement();
			resultSet = statement.executeQuery("SELECT * FROM tasks");
			while (resultSet.next()) {
				int id = resultSet.getInt("id");
				String description = resultSet.getString("description");
				boolean done = resultSet.getBoolean("done");
				tasks.add(new Task(id, description, done));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		} finally {
			if (resultSet != null) {
				try {
					resultSet.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (statement != null) {
				try {
					statement.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
			if (connection != null) {
				try {
					connection.close();
				} catch (SQLException e) {
					e.printStackTrace();
				}
			}
		}
		return tasks;
	}

	@Override
	public void delete(int id) {
		throw new UnsupportedOperationException();
	}

}
