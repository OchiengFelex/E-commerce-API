import sql from "mssql";
import config from "../db/config.js";

export const getHelp = async (req, res) => {
  try {
    const pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM HelpCenter");
    res.json(result.recordset);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const deleteHelp = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query(`DELETE FROM HelpCenter WHERE  help_id = ${id} `);
    res.status(200).json({ message: "Deleted help successfully " });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const createHelp = async (req, res) => {
  try {
    const { Name, Email, Query } = req.body;
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("Name", sql.VarChar, Name)
      .input("Email", sql.VarChar, Email)
      .input("Query", sql.VarChar, Query)
      .query(
        "INSERT INTO HelpCenter (Name, Email, Query) VALUES (@Name, @Email, @Query)"
      );
    res.status(200).json({ message: "Query Submitted Successfully " });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
