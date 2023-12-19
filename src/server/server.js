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
    console.error("Error during the request inside /api/generate-keys:", error);
  }
});

// /fold-public-keys
app.get("/api/fold-public-keys", async (req, res) => {
  console.log(`"/api/fold-public-keys" is called.`);
  console.log(`Calling database`);
  const responsePKA = await fetch("http://localhost:3001/api/get-public-keys");
  const publicKeyArray = await responsePKA.json();
  const publicKeyArrayFiltered = publicKeyArray.filter((x) => x !== ""); // HACK find out why it works.

  // PART ONE: Get the folded public keys from the LRS API.
  try {
    const response = await fetch(`${LRS_API_URL}/fold-public-keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicKeys: publicKeyArrayFiltered,
        hashName: "sha3-256", // no change needed.
        format: "PEM", // no change needed.
        order: "hashes", // no change needed.
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const keys = await response.json();

    console.log(`${keys.foldedPublicKeys}`);
    // res.json(keys.foldedPublicKeys);

    // PART TWO: Store it in the database.
    // Actual implementation.
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

    //TODO: Eventually add function
    // await knex("foldedPublicKeys")
    //   .where({ id: 1 })
    //   .update({ foldedPublicKeys: keys.foldedPublicKeys })
    //   .then(() => console.log("Data updated"))
    //   .catch((error) => console.log(error));

    // Test that it works.
    const foldedPublicKeysFromDatabase = await knex("foldedPublicKeys")
      .select("*")
      .limit(1);
    console.log(
      `After insert foldedPublicKeysFromDatabase:\n`,
      foldedPublicKeysFromDatabase[0]?.foldedPublicKeys
    );

    // TODO PART THREE: Store it in the blockchain (Fabric, a.k.a port 8801).
    console.log("\n\nStarting Part 3\n\n");
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
    // res.json(foldedPublicKeysFromDatabase);
  } catch (error) {
    console.error("Error during the request of /api/fold-public-keys:", error);
  }
});

// /sign
// ----------------------------------------------------------------------------
// Endpoint for Fabric
app.post("/api/store-folded-public-keys", async (req, res) => {
  const { body } = req;
  try {
    /*
curl -fsSL --request POST --url http://localhost:8801/invoke/vote-channel/chaincode_vote --header "Authorization: Bearer ${token}" --header 'Content-Type: application/json' --data "{\"method\": \"KVContractGo:put\", \"args\": [\"${uuid}\", ${message}]}"
curl -fsSL --request POST --url http://localhost:8801/user/enroll --header 'Authorization: Bearer' --data "{\"id\": \"admin\", \"secret\": \"adminpw\"}"
*/

    // Generate an admin token.
    const tokenReq = await fetch(`${FABRIC_API_URL}/user/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer",
      },
      body: JSON.stringify({
        id: "admin",
        secret: "adminpw",
      }),
    });
    const tokenJSON = await tokenReq.json();
    const token = tokenJSON.token;
    console.log(`token: ${token}`);
    console.log(`\n\n`);
    console.log(`req_body:\n${body.id}\n`);
    console.log(`Storing now...\n`);

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
          args: ["0", body.id],
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
  console.log("Starting /api/store-vote");
  const { body } = req;
  try {
    // Generate an admin token.
    const tokenReq = await fetch(`${FABRIC_API_URL}/user/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer",
      },
      body: JSON.stringify({
        id: "admin",
        secret: "adminpw",
      }),
    });
    const tokenJSON = await tokenReq.json();
    const token = tokenJSON.token;

    // Check values passed in.
    const signature = body.signature;
    const vote = body.vote;
    console.log(`Signature:\n${signature}\n`);
    console.log(`Vote:\n${vote}\n`);
    let blockKey = body.signature;
    const blockValue = body.vote;

    // Retrieve the folded public keys from the database.
    const foldedPublicKeysFromDatabase = await knex("foldedPublicKeys")
      .select("*")
      .limit(1);
    console.log(
      `foldedPublicKeysFromDatabase:\n`,
      foldedPublicKeysFromDatabase[0]?.foldedPublicKeys
    );

    const responseLRS = await fetch(`${LRS_API_URL}/sign`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        foldedPublicKeys: foldedPublicKeysFromDatabase[0]?.foldedPublicKeys,
        privateKeyContent: decodeURIComponent(signature),
        message: vote,
        format: "PEM",
      })
    });
    const signatureJSON = await responseLRS.json();
    console.log(`signatureJSON:\n${signatureJSON}\n`);
    // Get "signature field from the JSON response.
    const signatureFromLRS = signatureJSON.signature;
    console.log(`signatureFromLRS:\n${signatureFromLRS}\n`);

    // Store the signature and vote in the blockchain.
    const response = await fetch(
      `${FABRIC_API_URL}/invoke/vote-channel/chaincode_vote`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "KVContractGo:put",
          // args: [blockKey, blockValue],
          args: [signatureFromLRS, blockValue],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseReturn = await response.json();
    console.log(`${responseReturn}`);
    res.json(responseReturn);
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
