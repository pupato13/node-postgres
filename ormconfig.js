module.exports = {
    type: "postgres",
    host: process.env.ORM_HOST,
    port: process.env.DB_PORT,
    database: process.env.ORM_DATABASE,
    username: process.env.ORM_USERNAME,
    password: process.env.ORM_PASSWORD,
    entities: ["dist/infra/postgres/entities/index.js"],
};
