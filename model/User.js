import mongoose from "mongoose";
import connection from "../lib/connection.js"

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: 'email - обязательные поле',
        unique: 'такой email уже есть',
        validate: [{
            validator: value => {
                return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value);
            },
            message: 'email неккоректный',
        }]
    },
    name: {
        type: String
    }
})

export default connection.model('User', schema)