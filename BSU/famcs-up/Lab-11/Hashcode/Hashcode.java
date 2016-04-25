import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

public class Hashcode {
    public static void main(String[] args) {
        try {
            System.out.println(encryptPassword("Password"));
            System.out.println(encryptPassword("pAssw0r6"));
        } catch(NoSuchAlgorithmException e) {
            System.out.println("Algorithm was not found");
        } catch(UnsupportedEncodingException e) {
            System.out.println("Encoding is not supported");
        }
    }

    private static String encryptPassword(String password) throws NoSuchAlgorithmException, UnsupportedEncodingException {
        String sha1 = "";
        MessageDigest crypt = MessageDigest.getInstance("SHA-1");
        crypt.reset();
        crypt.update(password.getBytes("UTF-8"));
        Formatter formatter = new Formatter();
        for (byte b : crypt.digest()) {
            formatter.format("%02x", b);
        }
        sha1 = formatter.toString();
        formatter.close();
        return sha1;
    }
}
