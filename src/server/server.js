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
const BACKEND_API_URL = "http://localhost:3001";
const PORT = 3001;
const FABRIC_API_URL = "http://localhost:8801";
const FABRIC_API_USERNAME = "admin";
const FABRIC_API_PASSWORD = "adminpw";
const LRS_API_URL = "http://localhost:8080";

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

// Endpoint to check if vote is open
app.get("/api/check-vote-start", async (req, res) => {
  try {
    // Count the number of rows in the foldedPublicKeys table
    const result = await knex("foldedPublicKeys").count("* as count");
    const foldedKeysCount = parseInt(result[0].count, 10);

    const voteStart = foldedKeysCount > 0;
    console.log(`foldedKeysCount: ${foldedKeysCount}`);
    console.log(`voteStart: ${voteStart}`);

    res.json(voteStart);
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
    if (user && bcrypt.compareSync(password, user.password)) {
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

// Endpoint to stor
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

// Endpoint to get all public keys
app.get("/api/get-public-keys", async (req, res) => {
  console.log(`"/api/get-public-keys" is called.`);
  try {
    const users = await knex("users").select("*");
    const publicKeys = users
      .filter((user) => user.publicKey !== "")
      .map((user) => user.publicKey);
    console.log(`publicKeys: ${publicKeys}`);
    res.json(publicKeys);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// ----------------------------------------------------------------------------
// Endpoint for LRS

app.get("/api/ping", async (req, res) => {
  try {
    const response = await fetch(`${LRS_API_URL}/ping`);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

app.get("/api/generate-keys", async (req, res) => {
  try {
    const response = await fetch(`${LRS_API_URL}/generate-keys`, {
      method: "POST",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const keys = await response.json();
    console.log(`keys: ${keys.privateKey}`);
    console.log(`keys: ${keys.publicKey}`);
    res.json(keys);
  } catch (error) {
    console.error("Error during the request inside /api/generate-keys:", error);
  }
});

app.get("/api/fold-public-keys", async (req, res) => {
  console.log(`"/api/fold-public-keys" is called.`);
  console.log(`Calling database`);
  const responsePKA = await fetch("http://localhost:3001/api/get-public-keys");
  const publicKeyArray = await responsePKA.json();
  const publicKeyArrayFiltered = publicKeyArray.filter((x) => x !== ""); // HACK find out why it works.

  console.log('1: Retrieving folded public keys from LRS API...\n');
  try {
    const response = await fetch(`${LRS_API_URL}/fold-public-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKeys: publicKeyArrayFiltered
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const keys = await response.json();
    console.log(`${keys.foldedPublicKeys}`);

    console.log('2: Storing keys in database...\n');
    const keyExists = await knex("foldedPublicKeys")
      .where({ foldedPublicKeys: keys.foldedPublicKeys })
      .first();
    console.log(`keyExists type : ${typeof keyExists}`);
    console.log(`keyExists : ${keyExists}\n\n`);

    if (!keyExists) {
      await knex("foldedPublicKeys")
        .insert({
          foldedPublicKeys: keys.foldedPublicKeys,
        })
        .then(() => console.log("Data inserted"))
        .catch((error) => console.log(error));
    }

    // Test that it works.
    const foldedPublicKeysFromDatabase = await knex("foldedPublicKeys")
      .select("*")
      .limit(1);
    console.log(
      `After insert foldedPublicKeysFromDatabase:\n`,
      foldedPublicKeysFromDatabase[0]?.foldedPublicKeys
    );

    console.log('3: Storing keys in blockchain...\n');
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/api/store-folded-public-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: foldedPublicKeysFromDatabase[0]?.foldedPublicKeys,
          }),
        }
      );
      return response.json();
    } catch (error) {
      console.error(
        "Error during the request of storing in blockchain:",
        error
      );
    }

    res.json(keys.foldedPublicKeys);
    console.log("End of server call.");
  } catch (error) {
    console.error("Error during the request of /api/fold-public-keys:", error);
  }
});

// /sign
// ----------------------------------------------------------------------------
// Endpoint for Fabric
app.post("/api/store-folded-public-keys", async (req, res) => {
  const { body } = req;
  const { id: foldedPublicKeys } = body;
  try {
    // Generate an admin token.
    const tokenReq = await fetch(`${FABRIC_API_URL}/user/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer",
      },
      body: JSON.stringify({
        id: FABRIC_API_USERNAME,
        secret: FABRIC_API_PASSWORD,
      }),
    });
    const { token: token } = await tokenReq.json();
    console.log(`token:\n${token}`);
    console.log(`foldedPublicKeys:\n${foldedPublicKeys}\n`);

    // Store the folded public keys in the blockchain.
    const response = await fetch(
      `${FABRIC_API_URL}/invoke/vote-channel/chaincode_public_keys`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "KVContractGo:put",
          args: ["0", foldedPublicKeys],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const keys = await response.json();
    console.log(`${keys}`);
    res.json(keys);
  } catch (error) {
    console.error(
      "Error during the request inside /invoke/vote-channel/chaincode_pu:",
      error
    );
  }
});

// /store-vote
app.post("/api/store-vote", async (req, res) => {
  console.log(`\nBEGIN API call: /api/store-vote\n`);
  const { body } = req;
  try {
    
    // Generate an admin token for blockchain REST API authentication.
    const responseFabricEnroll = await fetch(`${FABRIC_API_URL}/user/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer",
      },
      body: JSON.stringify({
        id: FABRIC_API_USERNAME,
        secret: FABRIC_API_PASSWORD
      }),
    });
    if (!responseFabricEnroll.ok) {
      throw new Error(`HTTP error! Status: ${responseFabricEnroll.status}`);
    }
    const { token: token } = await responseFabricEnroll.json(); 
    console.log(`token:\n${token}\n`);

    // Retrieve the folded public keys from the database.
    const foldedPublicKeys = await knex("foldedPublicKeys")
      .select("*")
      .limit(1);
    console.log(`foldedPublicKeys:\n`, foldedPublicKeys[0]?.foldedPublicKeys);

    // Sign the vote with the folded public keys and user's private key.
    const responseLRS = await fetch(`${LRS_API_URL}/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foldedPublicKeys: foldedPublicKeys[0]?.foldedPublicKeys,
        privateKeyContent: body.privateKey,
        message: body.vote,
      })
    });
    if (!responseLRS.ok) {
      throw new Error(`HTTP error! Status: ${responseLRS.status}`);
    }
    const { signature: ringSignature } = await responseLRS.json();
    console.log(`linkableRingSignature:\n${ringSignature}\n`);

    // Store the signature and vote in the blockchain.
    const blockKey = ringSignature;
    const blockValue = body.vote; // TODO: Convert into JSON with voter's region.
    const responseFabricChaincode = await fetch(
      `${FABRIC_API_URL}/invoke/vote-channel/chaincode_vote`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "KVContractGo:put",
          args: [blockKey, blockValue],
        }),
      }
    );
    if (!responseFabricChaincode.ok) {
      throw new Error(`HTTP error! Status: ${responseFabricChaincode.status}`);
    }
    const { response: response } = await responseFabricChaincode.json();
    console.log(`response:\n${response}\n`);
    
    res.json(response); // Return the response.
    console.log(`\nEND API call: /api/store-vote\n`);
    
  } catch (error) {
    console.error(
      "Error during the request inside /invoke/vote-channel/chaincode_vote:\n",
      error
    );
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
