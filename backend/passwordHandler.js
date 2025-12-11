const bcrypt = require('bcrypt');
const fs = require('fs');
const saltRounds = 15;

/**
 * 
 * @param {string} password 
 * @returns {string} hashed password
 */
export async function hashPassword(password) {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

/**
 * 
 * @param {string} password 
 * @param {string} hash 
 * @returns {boolean}
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 *
 * @returns {string} OTP
 */
export function generateOTP() {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
}