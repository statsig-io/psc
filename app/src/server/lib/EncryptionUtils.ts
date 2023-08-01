import crypto from "crypto";
import Secrets from "./secrets";

const algorithm = "aes-256-cbc";

export default class EncryptionUtils {
  public static encrypt(input: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, this.getKey(), iv);
    return (
      iv.toString("hex") +
      "::" +
      cipher.update(input, "utf8", "hex") +
      cipher.final("hex")
    );
  }

  public static decrypt(encrypted: string): string | null {
    const [prefix, payload] = encrypted.split("::");
    if (!prefix || !payload) {
      return null;
    }

    const iv = Buffer.from(prefix, "hex");
    const decipher = crypto.createDecipheriv(algorithm, this.getKey(), iv);
    return decipher.update(payload, "hex", "utf8") + decipher.final();
  }

  private static getKey(): Buffer {
    return Buffer.from(
      crypto
        .createHash("sha256")
        .update(Secrets.STATSIG_SERVER_KEY)
        .digest("base64")
        .substring(0, 32)
    );
  }
}