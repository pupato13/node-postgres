import { ConnectionOptions } from "typeorm";

export const config: ConnectionOptions = {
    type: "postgres",
    host: "rosie.db.elephantsql.com",
    port: 5432,
    database: "xhhrqrxq",
    username: "xhhrqrxq",
    password: "vGRVwa-ZmALO6nFkSY7QZVIF8miA3Dc_",
    entities: ["dist/infra/postgres/entities/index.js"],
};
