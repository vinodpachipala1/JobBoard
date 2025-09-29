import { db } from "../config/database.js";

export const userModel = {
    async createUser(email, firstName, lastName, hashedPassword, role) {
        const result = await db.query(
            `INSERT INTO users (email, first_name, last_name, password, user_type) 
            VALUES($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, user_type`,
            [email, firstName, lastName, hashedPassword, role]
        );
        return result.rows[0];
    },

    async findUserByEmail(email) {
        const result = await db.query(
            `SELECT id, password, user_type, first_name, last_name FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0];
    },

    async findUserById(id) {
        const result = await db.query(
            `SELECT id, email, first_name, last_name, user_type FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0];
    }
};

export default userModel;