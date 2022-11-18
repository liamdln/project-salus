declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: "development" | "production";
        }
    }
    var _mongoClientPromise: Promise<MongoClient>;
    var mongoose: any;
}

export { };