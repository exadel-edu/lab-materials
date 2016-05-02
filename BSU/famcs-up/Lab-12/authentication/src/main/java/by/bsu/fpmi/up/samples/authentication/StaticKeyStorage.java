package by.bsu.fpmi.up.samples.authentication;

import java.util.HashMap;
import java.util.Map;

public class StaticKeyStorage {

    private static final Map<String, String > userIdMap = new HashMap<>();
    static {
        userIdMap.put("u$#1-token", "user1");
        userIdMap.put("u$#2-token", "user2");
        userIdMap.put("u$#3-token", "user3");
    }

    public static String getByUsername(String username) {
        return userIdMap.entrySet().stream()
                .filter(v -> v.getValue().equals(username))
                .map(Map.Entry::getKey)
                .findAny()
                .orElse(null);
    }

    public static String getUserByUid(String uid) {
        return userIdMap.get(uid);
    }
}
