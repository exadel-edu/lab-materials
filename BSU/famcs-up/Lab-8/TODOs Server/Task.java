class Task {
	private String id;
	private String description;
	private boolean done;

	public Task(String id, String description, boolean done) {
		this.id = id;
		this.description = description;
		this.done = done;
	}

	public String getId() {
		return this.id;
	}
	public void setId(String value) {
		this.id = value;
	}

	public String getDescription() {
		return this.description;
	}
	public void setDescription(String value) {
		this.description = value;
	}

	public boolean getDone() {
		return this.done;
	}
	public void setDone(boolean value) {
		this.done = value;
	}

	public String toString() {
		return "{\"id\":\"" + this.id + "\",\"description\":\"" + this.description + "\",\"done\":" + this.done + "}";
	}
}