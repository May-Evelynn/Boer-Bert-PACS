const bcrypt = require('bcrypt');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const saltRounds = 2;

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

export async function generateToken(hashedPW) {
    const payload = { password: hashedPW };
    return jwt.sign(payload, process.env.SECRET, { expiresIn: '30d' });
}

export async function verifyToken(token) {
    try {
        const decoded = await jwt.verify(token, process.env.SECRET);
            return { valid: true, payload: decoded };
    } catch (error) {
        console.error('Error verifying token:', error);
        return { valid: false, payload: null };
    }
}