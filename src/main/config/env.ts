export const env = {
    facebookApi: {
        clientId: process.env.FB_CLIENT_ID ?? "3048774682027509",
        clientSecret:
            process.env.FB_CLIENT_SECRET ?? "323730b96c5c16ef95686bb638510b8e",
    },
    port: process.env.PORT ?? 8080,
    jwtSecret: process.env.JWT_SECRET ?? "W22+Mc)uU,3$&-xq",
};
