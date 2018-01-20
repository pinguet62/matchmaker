import {Connection, createConnection} from "typeorm";
import {Proposition, SharedLink, User} from "./entities";
import {AllSubscriber} from "./subscribers";

let connection: Connection;

export async function connect() {
    connection = await createConnection({
        entities: [User, SharedLink, Proposition],
        subscribers: [AllSubscriber],
        type: "mongodb",
        url: process.env.MONGO_URL,
    });
}

export async function disconnect() {
    await connection.close();
}
