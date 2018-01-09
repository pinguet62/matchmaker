import {Connection, createConnection} from "typeorm";
import {Proposition, SharedLink, User} from "./entities";

let connection: Connection;

export async function connect() {
    connection = await createConnection({
        entities: [User, SharedLink, Proposition],
        type: "mongodb",
        url: process.env.MONGO_URL,
    });
}

export async function disconnect() {
    await connection.close();
}
