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

const BLOCKCHAIN_API_URL = "http://localhost:3002";
const LRS_API_URL = "http://localhost:8088";

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

// Endpoint to check if all users have a public key
app.get("/api/check-voter-keys", async (req, res) => {
  try {
    const users = await knex("users").select("*").where({ role: "voter" });
    const usersWithPublicKey = users.filter((user) => user.publicKey !== "");
    const isFull = usersWithPublicKey.length === users.length;
    console.log(`usersWithPublicKey.length: ${usersWithPublicKey.length}`);
    console.log(`users.length: ${users.length}`);
    console.log(`isFull: ${isFull}`);
    res.json(isFull);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Endpoint to get Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await knex("users").select("*");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Endpoint for Login
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
      res.json({ success: true, message: "Login successful", user: user });
      // TODO: set a cookie with the user email, role
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
});

app.post("/api/store-pubkey", async (req, res) => {
  const { publicKey, userEmailCookie } = req.body;
  try {
    console.log("Finding user: ", userEmailCookie);
    console.log("Public key: ", publicKey);
    const user = await knex("users")
      .where({ userEmail: userEmailCookie })
      .first();
    console.log("User found: ", user);
    if (user) {
      console.log("Attempting to store keys");
      await knex("users")
        .where({ userEmail: userEmailCookie })
        .update({ publicKey: publicKey });
      res.json({
        success: true,
        message: "Keys stored successfully",
        user: user,
      });
      console.log("Keys stored successfully");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send("Server error");
  }
});

// ----------------------------------------------------------------------------
// Endpoint for LRS

/**
 * @param {string} req
 * @param {string} res
 */
app.get("/api/ping", async (req, res) => {
  try {
    const response = await fetch(`${LRS_API_URL}/ping`);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// /generate-keys
const dataGenerateKeys = {
  curveName: "prime256v1",
  format: "PEM",
};

app.get("/api/generate-keys", async (req, res) => {
  try {
    const response = await fetch(`${LRS_API_URL}/generate-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataGenerateKeys),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const keys = await response.json(); // Keys has been received
    console.log(`keys: ${keys.privateKey}`);
    console.log(`keys: ${keys.publicKey}`);
    res.json(keys); // Send keys to the client
    // res.json(keys); // Send keys to the client
    // TODO: Save keys in the database for that user.
  } catch (error) {
    console.error("Error during the request:", error);
  }
});

// /fold-public-keys

// /sign

// ----------------------------------------------------------------------------
// Endpoint for Fabric

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
