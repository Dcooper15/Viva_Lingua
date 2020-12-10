"use strict";
const db = require("./conn");
const bcrypt = require("bcryptjs");


class UsersModel {
    constructor(id, user_name, email, password) {
        this.id = id;
        this.user_name = user_name;
        this.email = email;
        this.password = password;
    }

    async checkPassword(hashedPassword) {
        return bcrypt.compareSync(this.password, hashedPassword);
    }



    async signup() {
        try {
            const response = await db.one(`INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING id;`, [this.user_name, this.email, this.password]);
            console.log("User was created with ID:", response.id);
            return response;
        } catch(error) {
            console.error("ERROR: ", error.message);
            return error.message;
        }
    }

   
    async login() {
        try {
            const response = await db.one(`SELECT id, user_name, email, password FROM users WHERE user_name = $1;`, [this.user_name]);
            const isValid = await this.checkPassword(response.password);
            console.log(response);
            if (!!isValid) {
                const { user_name, id  } = response;
                console.log("This is response: ", response);
                return { isValid, user_name, user_id: id}
            } else {
                return { isValid }
            }
        } catch (error) {
            console.error("ERROR:", error.message);
            return error.message;
        }
    }

    static async profile(id) {
        try {
            const response = await db.one(`SELECT * FROM users WHERE id = ${id}`);
            console.log("PROFILES RESPONSE IS", response);
            return response;
        } catch(error) {
            console.error("ERROR: ", error.message);
            return error.message;
        }
    }
}


module.exports = UsersModel;