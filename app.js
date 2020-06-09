const express = require("express");
const bodyparser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var email = req.body.sponsoremail;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };

  var json_data = JSON.stringify(data);

  const url = "https://us19.api.mailchimp.com/3.0/lists/0396e63e6f";

  const options = {
    method: "POST",
    auth: "phiberous:c4fad968118a5603d76392702a3dc1ce-us19",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      var results = JSON.parse(data);
      if (response.statusCode == 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
      console.log(response.statusCode);
    });
  });

  request.write(json_data);
  request.end();
});

//Start Listening
app.listen(3000, () => {
  console.log("server is running on port 3000");
});

// c4fad968118a5603d76392702a3dc1ce-us19
// 0396e63e6f
