import sql from "mssql";
import config from "../db/config.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { Password, Email, Username } = req.body;
  const hashedPassword = bcrypt.hashSync(Password, 10);
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("Username", sql.VarChar, Username)
      .input("Email", sql.VarChar, Email)
      .query(
        "SELECT * FROM Users WHERE Username = @Username OR Email = @Email"
      );
    const user = result.recordset[0];
    if (user) {
      res.status(409).json({ error: "Unauthorized, wrong credentials" });
    } else {
      await pool
        .request()
        .input("Email", sql.VarChar, Email)
        .input("Password", sql.VarChar, hashedPassword)
        .input("Username", sql.VarChar, Username)
        .query(
          "INSERT INTO Users (Username, Email, Password) VALUES (@Username, @Email, @Password)"
        );
      res.status(200).send({ message: "User created successfully" });
    }
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

//

export const loginUser = async (req, res) => {
  const { Username, Password } = req.body;
  let pool;
  try {
    pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("Username", sql.VarChar, Username)
      .query("SELECT * FROM Users WHERE username = @Username");
    const user = result.recordset[0];

    if (!user) {
      return res
        .status(401)
        .json({ error: "Wrong credentials user does not exist" });
    }

    if (!Password) {
      return res.status(401).json({ error: "Password is missing" });
    }

    const PasswordMatch = await bcrypt.compare(Password, user.Password);

    if (!PasswordMatch) {
      return res.status(401).json({ error: "Unauthorized , wrong password" });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        Username: user.Username,
        Email: user.Email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1 hour",
      }
    );
    return res.status(200).json({
      Email: user.Email,
      Username: user.Username,
      user_id: user.user_id,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  } finally {
    if (pool) {
      pool.close();
    }
  }
};
