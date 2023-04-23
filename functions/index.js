const functions = require("firebase-functions");
const express = require('express');
const admin = require('firebase-admin');
const axios = require("axios");
admin.initializeApp();

const db = admin.firestore();

const app = express();

app.get('/mass-email', async (req, res) => {
  try {

    const users = await db.collection("users").where("email", "!=", null).get();
    users.docs.forEach(async doc => {
      const user = { ...doc.data() };
      if (user.email === "v.rudovtsymbalist@gmail.com") {
        console.log('FOUND!')
        await admin.firestore().collection('mail').add({
          to: user.email,
          message: {
            subject: "Test function",
            text: "This is the plaintext section of the email body.",
            html: "This is the <code>HTML</code> section of the email body.",
          },
        })
      }
    })

    res.status(200).send('Mass email sent successfully!');
  } catch (err) {
    console.error(`Failed to send mass email: ${err}`);
    res.status(500).send('Failed to send mass email');
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
