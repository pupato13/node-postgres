import "./config/module-alias";

import "reflect-metadata";
import { createConnection } from "typeorm";
import { app } from "@/main/config/app";
import { env } from "@/main/config/env";

createConnection()
    .then(() =>
        app.listen(env.port, () =>
            console.log(`Server running at http://localhost:${env.port}`)
        )
    )
    .catch(console.error);
