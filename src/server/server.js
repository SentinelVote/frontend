const helmet = require("helmet");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
const knex = require("knex")(require("../../knexfile").development);

const app = express();

app.use(helmet());
app.use(express.json());

// CORS Configuration
const whitelist = ["http://localhost:3000"];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

// Endpoint to get users
app.get("/api/users", async (req, res) => {
  try {
    const users = await knex("users").select("*");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Login Endpoint
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Attempt:", email, password);
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  try {
    const user = await knex("users").where({ userEmail: email }).first();
    console.log("User found:", user); // Log found user
    if (user && bcrypt.compareSync(password, user.hashedPassword)) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
