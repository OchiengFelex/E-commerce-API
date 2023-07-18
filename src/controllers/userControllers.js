import sql from "mssql";
import config from "../db/config.js";

//fetching all the users
export const getUsers = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM Users");
    res.send(result.recordset);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
export const getSingleUsers = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("select * from Users WHERE user_id=@id");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
//deleting user by using id
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query(`DELETE FROM Users WHERE user_id = ${id} `);
    res.status(200).json({ message: "Deleted user successfully " });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const createUsers = async (req, res) => {
  try {
    const { Username, Email, Password } = req.body;
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("Username", sql.VarChar, Username)
      .input("Email", sql.VarChar, Email)
      .input("Password", sql.VarChar, Password)
      .query(
        "INSERT INTO Users (Username, Email, Password) VALUES (@Username, @Email, @Password)"
      );
    res.status(200).json({ message: "Created user successfully " });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
