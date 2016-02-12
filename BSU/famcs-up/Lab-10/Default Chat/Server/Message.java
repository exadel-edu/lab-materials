class Message {
	private String id;
	private String text;
	private String user;

	public Message(String id, String text, String user) {
		this.id = id;
		this.text = text;
		this.user = user;
	}

	public String getId() {
		return this.id;
	}
	public void setId(String value) {
		this.id = value;
	}

	public String getText() {
		return this.text;
	}
	public void setText(String value) {
		this.text = value;
	}

	public String getUser() {
		return this.user;
	}
	public void setUser(String value) {
		this.user = value;
	}

	public String toString() {
		return "{\"id\":\"" + this.id + "\",\"text\":\"" + this.text + "\",\"user\":\"" + this.user + "\"}";
	}
}