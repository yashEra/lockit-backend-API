// import {validateFields} from "./validate";
const functions = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const express = require("express");
const cors = require("cors");

const bcrypt = require("bcrypt");
// const { user } = require("firebase-functions/v1/auth");

// main app
const app = express();
// app.use(express.json());
app.use(cors({ origin: true }));

// main database reference 
const db = admin.firestore();

// routs 
app.get("/", (req, res) => {
    return res.status(200).send("lockit api working");
});

// app.post("/create-user", (req, res) => {

//     (async () => {
//         try {
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);
//             await db.collection("userDetails").doc(`/${Date.now()}/`).create({
//                 id: Date.now(),
//                 username: req.body.username,
//                 email: req.body.email,
//                 phoneNumber: req.body.phoneNumber,
//                 password: hashedPassword,
//             })

//             return res.status(200).send({ status: true, message: "user added successfully" })

//         } catch (error) {
//             return res.status(500).send({ status: false, message: error })
//         }
//     })();

// });

app.post("/register", async (req, res) => {
    try {
        // Validate input data and get the validated user object
        // const user = validateFields({
        //     username: req.body.username,
        //     email: req.body.email,
        //     phoneNumber: req.body.phoneNumber,
        //     password: req.body.password,
        // });

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        // user.password = hashedPassword;

        // Create user in the database
        await db.collection("userDetails").doc(`/${Date.now()}/`).create({
            id: Date.now(),
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: hashedPassword,
        });

        return res.status(200).send({ status: true, message: "User registered successfully" });
    } catch (error) {
        return res.status(500).send({ status: false, message: error });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Fetch user data from the database based on the provided email
        const userSnapshot = await db.collection("userDetails").where('email', '==', email).get();

        if (userSnapshot.empty) {
            return res.status(401).send({ status: false, message: "Invalid credentials" });
        }

        const user = userSnapshot.docs[0].data();

        // Check if the provided password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).send({ status: false, message: "Invalid credentials" });
        }

        data ={
            id: user.id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber
        }

        // You can generate and return a JWT token for authenticated users if needed
        return res.status(200).send({ status: true, message: "Login successful", user: data });
    } catch (error) {
        return res.status(500).send({ status: false, message: error });
    }
});

app.post("/logout", (req, res) => {
    // Implement your logout logic here (e.g., clearing session data or tokens on the client-side)
    return res.status(200).send({ status: true, message: "Logout successful" });
});

app.put("/user-change-password", async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        // Fetch user data from the database based on the provided email
        const userQuerySnapshot = await db.collection("userDetails").where('email', '==', email).get();

        if (userQuerySnapshot.empty) {
            return res.status(401).send({ status: false, message: "User not found" });
        }

        const userDocument = userQuerySnapshot.docs[0];
        const userId = userDocument.id;
        const userData = userDocument.data();

        // Check if the provided old password matches the hashed password in the database
        const passwordMatch = await bcrypt.compare(oldPassword, userData.password);

        if (!passwordMatch) {
            return res.status(401).send({ status: false, message: "Invalid old password" });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password in the database
        await db.collection("userDetails").doc(userId).update({ password: hashedNewPassword });

        return res.status(200).send({ status: true, message: "Password changed successfully" });
    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
});


app.get("/user/:id", (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection("userDetails").doc(req.params.id);
            let userDetails = await reqDoc.get();
            let response = userDetails?.data();

            let user = {
                id: response?.id,
                username: response?.username,
                email: response?.email,
                phoneNumber: response?.phoneNumber,
            }
            response ? res.status(200).send({ status: true, user: user }) : res.status(404).json({ status: false, message: "user not found" })
        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
})

app.get("/users", (req, res) => {
    (async () => {
        try {
            const query = db.collection("userDetails");
            let response = [];

            await query.get().then((data) => {
                let docs = data.docs;
                docs.map((doc) => {
                    const user = {
                        id: doc?.data()?.id,
                        username: doc?.data()?.username,
                        email: doc?.data()?.email,
                        phoneNumber: doc?.data()?.phoneNumber,
                    }
                    response.push(user);
                });
                return response;
            });


            response ? res.status(200).send({ status: true, data: response }) : res.status(204).send({ status: false, message: "user not found" })
        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
})

app.put("/user/:id", (req, res) => {

    (async () => {
        try {
            const reqDoc = db.collection("userDetails").doc(req.params.id);
            await reqDoc.update({
                username: req.body.username,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
            })

            return res.status(200).send({ status: true, message: "user updated successfully" })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();

});

app.delete("/user/:id", (req, res) => {

    (async () => {
        try {
            const reqDoc = db.collection("userDetails").doc(req.params.id);
            await reqDoc.delete();

            return res.status(200).send({ status: true, message: "user deleted successfully" })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();

});

app.post("/add-device", (req, res) => {

    (async () => {
        try {
            await db.collection("device").doc(`/${req.body.deviceID}/`).create({
                deviceID: req.body.deviceID,
                owner: req.body.owner,
                status: false,
                active: true,
            })

            return res.status(200).send({ status: true, message: "device added successfully" })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();

});

app.post("/lock/:deviceID", async (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection("device").doc(req.params.deviceID);

            // Check if the device is blocked, if yes, don't allow locking
            const deviceData = await reqDoc.get();

            if (!deviceData.data().active) {
                return res.status(400).send({ status: false, message: `DEVICE ${req.params.deviceID} is blocked.` });
            }

            if (deviceData.data().status) {
                return res.status(400).send({ status: false, message: `DEVICE ${req.params.deviceID} is alrady locked.` });
            }

            await reqDoc.update({
                status: true,
            })

            return res.status(200).send({ status: true, message: `DEVICE ${req.params.deviceID} is locked` })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
});

app.post("/unlock/:deviceID", async (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection("device").doc(req.params.deviceID);

            // Check if the device is blocked or already unlocked, if yes, don't allow unlocking
            const deviceData = await reqDoc.get();
            if (!deviceData.data().active ) {
                return res.status(400).send({ status: false, message: `DEVICE ${req.params.deviceID} is blocked. Cannot unlock.` });
            }
            if (!deviceData.data().status) {
                return res.status(400).send({ status: false, message: `DEVICE ${req.params.deviceID} is already unlocked.` });
            }

            await reqDoc.update({
                status: false,
            })

            return res.status(200).send({ status: true, message: `DEVICE ${req.params.deviceID} is unlocked` })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
});

app.post("/block/:deviceID", async (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection("device").doc(req.params.deviceID);
            await reqDoc.update({
                status: false, 
                active: false,
            })

            return res.status(200).send({ status: true, message: `DEVICE ${req.params.deviceID} is blocked` })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
});

app.post("/unblock/:deviceID", async (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection("device").doc(req.params.deviceID);

            // Check if the device is already unblocked, if yes, don't allow unblocking
            const deviceData = await reqDoc.get();
            if (deviceData.data().active) {
                return res.status(400).send({ status: false, message: `DEVICE ${req.params.deviceID} is already unblocked. Cannot unblock.` });
            }

            await reqDoc.update({
                active: true,
            })

            return res.status(200).send({ status: true, message: `DEVICE ${req.params.deviceID} is unblocked` })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
});

app.get("/device/:deviceID", (req, res) => {
    (async () => {
        try {
            const reqDoc = db.collection("device").doc(req.params.deviceID);
            let deviceDetails = await reqDoc.get();
            let response = deviceDetails?.data();

            let device = {
                id: response?.id,
                owner: response?.owner,
                status: response?.status,
                active: response?.active,
            }
            response ? res.status(200).send({ status: true, device: device }) : res.status(404).json({ status: false, message: "device not found" })
        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
})

app.get("/devices/:ownerID", async (req, res) => {
    try {
        const ownerID = req.params.ownerID;

        // Query devices based on the owner's ID
        const devicesQuerySnapshot = await db.collection("device").where('owner', '==', ownerID).get();

        if (devicesQuerySnapshot.empty) {
            return res.status(404).json({ status: false, message: "No devices found for the specified owner" });
        }

        // Map the query results to an array of device objects
        const devices = devicesQuerySnapshot.docs.map(deviceDoc => {
            const deviceData = deviceDoc.data();
            return {
                id: deviceData.id,
                owner: deviceData.owner,
                status: deviceData.status,
                active: deviceData.active,
            };
        });

        return res.status(200).send({ status: true, devices: devices });
    } catch (error) {
        console.error("Error fetching devices:", error);
        return res.status(500).send({ status: false, message: "Internal Server Error" });
    }
});

app.get("/all-devices", (req, res) => {
    (async () => {
        try {
            const query = db.collection("device");
            let response = [];

            await query.get().then((data) => {
                let docs = data.docs;
                docs.map((doc) => {
                    const device = {
                        id: doc?.data()?.id,
                        owner: doc?.data()?.owner,
                        status: doc?.data()?.status,
                        active: doc?.data()?.active,
                    }
                    response.push(device);
                });
                return response;
            });


            response ? res.status(200).send({ status: true, data: response }) : res.status(204).send({ status: false, message: "device not found" })
        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();
})

app.delete("/device/:deviceID", (req, res) => {

    (async () => {
        try {
            const reqDoc = db.collection("device").doc(req.params.deviceID);
            await reqDoc.delete();

            return res.status(200).send({ status: true, message: "device deleted successfully" })

        } catch (error) {
            return res.status(500).send({ status: false, message: error })
        }
    })();

});

// exports the api to the fireabse cloud functions 
exports.app = functions.https.onRequest(app);