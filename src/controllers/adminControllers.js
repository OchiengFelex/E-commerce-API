import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//fetch all owners
export const getAdmins = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query(" select * from Admins");
    !result.recordset[0]
      ? res.status(404).json({ message: "Admin not found" })
      : res.status(200).json(result.recordset);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const createAdmin = async (req, res) => {
  const { admin_name, admin_password } = req.body;
  const hashedPassword = bcrypt.hashSync(admin_password, 10);

  try {
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("admin_name", sql.VarChar, admin_name)
      .input("admin_password", sql.VarChar, admin_password)
      .query(
        "SELECT * FROM Admins WHERE admin_name = @admin_name OR admin_password = @admin_password"
      );
    const admin = result.recordset[0];
    if (admin) {
      res.status(409).json({ error: "Admin already exist" });
    } else {
      await pool
        .request()
        .input("admin_name", sql.VarChar, admin_name)
        .input("admin_password", sql.VarChar, hashedPassword)
        .query(
          "INSERT INTO Admins (admin_name, admin_password) VALUES (@admin_name, @admin_password)"
        );
      res.status(200).send({ message: "Admin created successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const updateAdmins = async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_name, admin_password } = req.body;
    let pool = await sql.connect(config.sql);
    let request = pool.request();
    //  The input function to define the input parameters
    request
      .input("id", sql.Int, id)
      .input("admin_name", sql.VarChar, admin_name)
      .input("admin_password", sql.VarChar, admin_password);

    await request().query(
      "UPDATE Admins SET admin_name = @admin_name, admin_password = @admin_password WHERE admin_id = @id"
    );
    res.status(200).json({ message: "admin updated successfully" });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

//delete owners

export const deleteAdmins = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query(`DELETE FROM Admins WHERE admin_id = ${id} `);
    res.status(200).json({ message: " deleted admin successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    sql.close();
  }
};

//this is the login function for the admin

export const loginAdmin = async (req, res) => {
  const { admin_name, admin_password } = req.body;

  try {
    let pool = await sql.connect(config.sql);
    let result = await pool
      .request()
      .input("admin_name", sql.VarChar, admin_name)
      .query("SELECT * FROM Admins WHERE admin_name = @admin_name");

    const admin = result.recordset[0];
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
    } else {
      const passwordMatch = bcrypt.compareSync(
        admin_password,
        admin.admin_password
      );
      if (!passwordMatch) {
        res.status(401).json({ error: "Invalid password" });
      } else {
        const token = jwt.sign(
          { id: admin.admin_id, admin_name: admin.admin_name },
          config.jwt_secret,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).json({
          id: admin.admin_id,
          admin_name: admin.admin_name,
          token: token,
        });
      }
    }
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
