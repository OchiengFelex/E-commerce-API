import sql from "mssql";
import config from "../db/config.js";

//fetching all the bookings
export const getBookings = async (req, res) => {
  try {
    let pool = await sql.connect(config.sql);
    const result = await pool.request().query("SELECT * FROM Bookings");
    res.send(result.recordset);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const getSingleBookings = async (req, res) => {
  try {
    const { id } = req.params;
    let pool = await sql.connect(config.sql);
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("select * from bookings WHERE booking_id=@id");
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
//deleting user by using id
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await sql.connect(config.sql);
    await sql.query(`DELETE FROM bookings WHERE booking_id = ${id} `);
    res.status(200).json({ message: "Deleted booking successfully " });
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};

export const createBookings = async (req, res) => {
  try {
    const { property_name, location, username } = req.body;

    let pool = await sql.connect(config.sql);
    const userExists = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Users WHERE username = @username");

    if (userExists.recordset.length === 0) {
      throw new Error("User with the provided username does not exist.");
    }

    await pool
      .request()
      .input("property_name", sql.VarChar, property_name)
      .input("location", sql.VarChar, location)
      .input("username", sql.VarChar, username)
      .query(
        "INSERT INTO bookings (property_name, location, username) VALUES (@property_name, @location, @username)"
      );

    res.status(200).json("Booking done successfully");
  } catch (error) {
    res.status(500).json(error.message);
  } finally {
    sql.close();
  }
};
