package org.exadel.todos.model;

public class Task {
	private int id;
	private String description;
	private boolean done;

	public Task(int id, String description, boolean done) {
		this.id = id;
		this.description = description;
		this.done = done;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public boolean isDone() {
		return done;
	}

	public void setDone(boolean done) {
		this.done = done;
	}

	public String toString() {
		return "{\"id\":\"" + this.id + "\",\"description\":\"" + this.description + "\",\"done\":" + this.done + "}";
	}
}
