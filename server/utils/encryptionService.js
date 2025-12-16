// server/utils/encryptionService.js (New File)
const crypto = require('crypto');

const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';
const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
const iv = Buffer.from(process.env.ENCRYPTION_IV, 'utf8');

// Ensure keys are the correct length
if (key.length !== 32 || iv.length !== 16) {
    console.error("CRITICAL: Encryption keys are the wrong size. Check your .env file.");
    process.exit(1); 
}

/**
 * Encrypts a plaintext string.
 * @param {string} text - The data to encrypt (e.g., shipping address).
 * @returns {string} Encrypted text as a hex string.
 */
const encrypt = (text) => {
    if (!text) return null;
    try {
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    } catch (e) {
        console.error("Encryption failed:", e);
        return null;
    }
};

/**
 * Decrypts a ciphertext string.
 * @param {string} encryptedText - The data to decrypt.
 * @returns {string} Decrypted plaintext string.
 */
const decrypt = (encryptedText) => {
    if (!encryptedText) return null;
    try {
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        // This is crucial: If decryption fails, the address is likely invalid/corrupted
        console.error("Decryption failed:", e);
        return null; 
    }
};

module.exports = { encrypt, decrypt };