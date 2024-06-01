import * as bcrypt from 'bcrypt';
import * as CryptoJS from 'crypto-js';

export const hashedPassword = async (password) => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

// Function to encrypt a value using AES encryption
export const encrypt = (value, key) => {
  const encrypted = CryptoJS.AES.encrypt(value, key).toString();
  return encrypted;
};

// Function to decrypt a value using AES decryption
export const decrypt = (encryptedValue, key) => {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, key);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
};
