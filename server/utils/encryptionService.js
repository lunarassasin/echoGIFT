// server/utils/encryptionService.js (Final attempt at robust loading)
const crypto = require('crypto');

const algorithm = process.env.ENCRYPTION_ALGORITHM || 'aes-256-cbc';

// Use a stronger fallback if the variable is missing
const keyString = process.env.ENCRYPTION_KEY;
const ivString = process.env.ENCRYPTION_IV;

// Fallback to exit if the variable is entirely missing, not just empty
if (!keyString || !ivString) {
    console.error("CRITICAL: Missing ENCRYPTION_KEY or ENCRYPTION_IV in environment. Cannot start.");
    process.exit(1);
}

// Convert using 'hex'
const key = Buffer.from(keyString, 'hex'); 
const iv = Buffer.from(ivString, 'hex');

// CRITICAL: Exit if keys are not the correct size
if (key.length !== 32 || iv.length !== 16) {
    console.error(`CRITICAL: Keys fail length check. KEY is ${key.length}, IV is ${iv.length}.`);
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