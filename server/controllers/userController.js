const db = require("../config/db");
const bcrypt = require("bcrypt");

async function register(req, res) {
  const { email, password, phone, firstName, lastName, username } = req.body;

  if (!email || !password || !phone || !firstName || !lastName || !username) {
    return res.status(400).json({ message: "Required field cannot be empty" });
  }

  const saltRounds = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, saltRounds);

  try {
    await db.promise().query("START TRANSACTION");
    await db
      .promise()
      .query("INSERT INTO users (username, email, password) VALUES(?, ?, ?)", [
        username,
        email,
        hashPassword,
      ]);
    const [user, userFields] = await db
      .promise()
      .query("SELECT id FROM users WHERE username = ? AND email = ?", [
        username,
        email,
      ]);
    const userId = user[0].id;
    await db
      .promise()
      .query(
        "INSERT INTO user_profiles (user_id, firstName, lastName) VALUES(?, ?, ?)",
        [userId, firstName, lastName]
      );
    const [userProfile, userProfileFields] = await db
      .promise()
      .query("SELECT id FROM user_profiles WHERE user_id = ?", [userId]);
    const userProfileId = userProfile[0].id;
    await db
      .promise()
      .query("INSERT INTO user_phones (phone, user_profile_id) VALUES(?, ?)", [
        phone,
        userProfileId,
      ]);
    await db.promise().query("COMMIT");
    res.json({
      message: "User successfully registered",
      data: {
        username,
        email,
        phone,
        firstName,
        lastName,
      },
    });
  } catch (err) {
    await db.promise().query("ROLLBACK");
    console.log(err.sqlMessage);
    return res.status(400).json({ message: err.sqlMessage });
  }
}

module.exports = { register };
