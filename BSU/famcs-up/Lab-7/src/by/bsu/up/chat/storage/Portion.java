package by.bsu.up.chat.storage;

public class Portion {

    private int fromIndex = 0;

    /**
     * -1 means the end index is not defined and does not
     * restrict last message to re turn
     */
    private int toIndex = - 1;

    public Portion() {
    }

    public Portion(int fromIndex) {
        this.fromIndex = fromIndex;
    }

    public Portion(int fromIndex, int toIndex) {
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
    }

    public int getFromIndex() {
        return fromIndex;
    }

    public void setFromIndex(int fromIndex) {
        this.fromIndex = fromIndex;
    }

    public int getToIndex() {
        return toIndex;
    }

    public void setToIndex(int toIndex) {
        this.toIndex = toIndex;
    }
}
