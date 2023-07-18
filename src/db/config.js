import dotenv from "dotenv";
import assert from "assert";

dotenv.config(); //used for validation
//destructure the env
const {
  PORT,
  HOST,
  HOST_URL,
  SQL_SERVER,
  SQL_USER,
  SQL_DB,
  SQL_PWD,
  JWT_SECRET,
} = process.env;

const sqlEncrypt = process.env.SQL_ENCRYPTED === "true";
assert(PORT, "PORT is required");
assert(HOST, "HOST is required"); // used to check for the truth

const config = {
  port: PORT,
  host: HOST,
  url: HOST_URL,
  sql: {
    server: SQL_SERVER,
    user: SQL_USER,
    password: SQL_PWD,
    database: SQL_DB,
    options: {
      encrypt: sqlEncrypt,
      enableArithAbort: true,
    },
  },

  jwt_secret: JWT_SECRET,
};

export default config;
