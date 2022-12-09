//This is the main page where I will be querying the database, Storing and securing hash passwords  and returning information or storing information in the database.

// Important bcrypt
const bcrypt = require("bcrypt");

require("dotenv").config();
const sanitizeHtml = require("sanitize-html");
const escapeHtml = require("escape-html");
const WetherAPIkey = process.env.WetherAPI_KEY;
console.log(WetherAPIkey);

module.exports = function (app, shopData) {
  const { check, validationResult } = require("express-validator");
  const redirectLogin = (req, res, next) => {
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "login"));
    } else {
      if (!req.session.userId) {
        res.redirect("./login");
      } else {
        next();
      }
    }
  };

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // The alert function takes two arguments: msg is a string containing the message to be displayed
  // to the user, and url is the URL that the user should be redirected to after a delay of 5 seconds.
  //  The function creates an alert message using the provided msg and url parameters,
  //  and then returns the resulting message.
  function alert(msg, url) {
    // Create the alert message using the provided parameters.
    let alert =
      "<script>" +
      "alert('" +
      msg +
      "'); " +
      "setTimeout('', 5000); " + // Delay for 5 seconds.
      "window.location.href = '/" +
      url +
      "';</script>"; // Local developerment.

    return alert; // Return the alert message.
  }

  //@@@@@@@@@@@@@------TODO

  app.get("/api", (req, res) => {
    // Select all the books from the database
    let sqlQuery = "SELECT * FROM books";
    if (req.query.keyword) {
      // Sanitize the keyword input
      const keyword_Sanitize = sanitizeHtml(req.query.keyword);
      // Escape any HTML special characters in the keyword input
      const keyword_XSS_provention = escapeHtml(keyword_Sanitize);
      // Select specific books from the database
      sqlQuery =
        "SELECT * FROM books WHERE name LIKE '%" +
        keyword_XSS_provention +
        "%'";
    }
    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.redirect("./"); // Redirect to the home page if there is an error.
      } else {
        // Return results as a JSON object
        res.json(result);
      }
    });
  });

  app.get("/testPage", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query

    if (req.query.keyword) {
      // Sanitize the keyword input
      const keyword_Sanitize = sanitizeHtml(req.query.keyword);
      // Escape any HTML special characters in the keyword input
      const keyword_XSS_provention = escapeHtml(keyword_Sanitize);
      // Select specific books from the database
      sqlquery =
        "SELECT * FROM books WHERE name LIKE '%" +
        keyword_XSS_provention +
        "%'";
    }
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });

      res.render("testPage.ejs", newData);
    });
  });

  app.get("/testPage", redirectLogin, function (req, res) {
    // Handle a GET request to the /testPage route by first redirecting the user to the login page if they are not already logged in, and then validating the request data.
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      // If the request data is not valid, generate an error message and display it to the user using the alert function, and then redirect them back to the /testPage route.
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
      }
      // Add check on all.
      console.log(msg);
      res.send(alert(msg, "testPage"));
    } else {
      // If the request data is valid, query the database for a list of books and then render the testPage.ejs view with the queried data and the shopData object.
      let sqlquery = "SELECT * FROM books"; // Query database to get all the books.
      // Execute sql query.
      db.query(sqlquery, (err, result) => {
        if (err) {
          res.redirect("./");
        }
        // Converting out put from database to an object to be passed to delete user page.
        let newData = Object.assign({}, shopData, { availableBooks: result });
        console.log(newData);
        res.render("testPage.ejs", newData);
      });
    }
  });

  app.get("/list", redirectLogin, function (req, res) {
    const errors = validationResult(req);
    // console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "list"));
      // res.redirect("./register");
    } else {
      let sqlquery = "SELECT * FROM books"; // query database to get all the books
      // execute sql query
      db.query(sqlquery, (err, result) => {
        if (err) {
          res.redirect("./");
        }
        //Converting out put from database to an object to be passed to delete user page
        let newData = Object.assign({}, shopData, { availableBooks: result });
        console.log(newData);
        res.render("list.ejs", newData);
      });
    }
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // Handle our routes

  // GET route for the home page
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the about page
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });

  app.post(
    "/form",
    [
      check("name").isLength({ min: 3 }),
      check("name").isEmail(),
      check("name").isNumeric(),
    ],
    (req, res) => {
      const name = req.body.name;
      const email = req.body.email;
      const age = req.body.age;
    }
  );

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the search page
  app.get("/search", function (req, res) {
    //send the result to the search-result.ejs
    res.render("search.ejs", shopData);
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//

  // GET route from the search page

  app.get(
    "/search-result",
    [
      check("search-box").notEmpty().withMessage("must be a valid search term"),
      check("search-box").isLength({ min: 3 }),
    ],
    function (req, res) {
      //searching in the database
      //res.send("You searched for: " + req.query.keyword);
      const errors = validationResult(req);
      console.log(errors);
      if (!errors.isEmpty()) {
        let msg = "";
        for (var i = 0; i < errors.array().length; i++) {
          msg += errors.array()[i].msg + "\\n";
          // errors[i]
        }
        //add check on all
        console.log(msg);
        res.send(alert(msg, "search"));
        // res.redirect("./register");
      } else {
        let params = [db.escape(req.sanitize(req.body.username))];

        let sqlquery = "SELECT * FROM books WHERE name LIKE values (?)"; // query database to get all the books

        // let sqlCreate =
        //   "insert into users (username,firstname,lastname,email,hashedPassword) values (?,?,?,?,?)";

        // execute sql query
        db.query(sqlquery, params, (err, result) => {
          if (err) {
            // alert("error mysql");
            res.redirect("./");
          }
          //store the result in the shopData
          let newData = Object.assign({}, shopData, {
            availableBooks: result,
          });
          console.log(newData);
          res.render("list.ejs", newData);
        });
      }
    }
  );

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//

  // GET route for the listusers page
  app.get("/listusers", function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "listusers"));
      // res.redirect("./register");
    } else {
      let sqlquery = "SELECT * FROM users";
      // query database to get all the books
      // execute sql query
      db.query(sqlquery, (err, result) => {
        if (err) {
          res.redirect("./");
        }
        //store the result in the shopData
        let newData = Object.assign({}, shopData, { availableBooks: result });
        console.log(newData);
        res.render("listusers.ejs", newData);
      });
    }
  });


  app.get("/weatherApp", function (req, res) {
    res.render("weatherApp.ejs", shopData);
  });

  app.post("/weather", function (req, res) {
   // Import the request library
const request = require("request");

// Define the weather API key
let apiKey = WetherAPIkey;

// Set the default city to London
let city = "london";

// Set up the URL for the weather API request
let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

// Listen for a GET request on the /weatherApp path
app.get("/weatherApp", function (req, res) {
    // When a request is received, render the weatherApp.ejs view
    // with the shopData object
    res.render("weatherApp.ejs", shopData);
});

// Listen for a POST request on the /weather path
app.post("/weather", function (req, res) {
    // Use the request library to make an HTTP request to the OpenWeatherMap API
    request(url, function (err, response, body) {
        // If there is an error, log it to the console
        if (err) {
            console.log("error:", error);
        } else {
            // If there is no error, parse the JSON response body
            var weather = JSON.parse(body);

            // If the weather data is not undefined and the "main" property is not undefined
            if (weather !== undefined && weather.main !== undefined) {
                // Parse the JSON response body
                var weather = JSON.parse(body);

                // Format the weather data into a message
                var wmsg =
                    "It is " +
                    weather.main.temp +
                    " degrees in " +
                    weather.name +
                    "! <br> The humidity now is: " +
                    weather.main.humidity +
                    "! <br> The maximum temperature will be: " +
                    weather.main.temp_max +
                    "! <br> By the minimum temperature will be: " +
                    weather.main.temp_min +
                    "! <br> The pressure will be: " +
                    weather.main.pressure +
                    "! <br> By the wind speed will be: " +
                    weather.wind.speed +
                    "<br> <a href='/'><button type=" +
                    '"button"' +
                    ">Go to Home Page</button></a>" +
                    " " +
                    '<select> <option value="Manchester">Manchester</option> ' +
                    ' <option value="London">London</option> </select>';
          res.send(wmsg);
        } else {
          res.send("No data found");
        }
      }
    });
  });

  // @@@@@@@@@@@@@------TODO
  // -----------------------------------------------//
  // -----------------------------------------------//
  // GET route for the register
  app.get("/register", function (req, res) {
    //send the result to the registered.ejs
    res.render("register.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------

  // Handle a GET request to the /register route by rendering the register.ejs view with the shopData object.
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });

  app.post(
    "/registered",
    // Use the express-validator package to validate the request data.
    [check("email").isEmail().withMessage("You must type a valid email")],
    [
      check("password")
        .isLength({ min: 8 })
        .withMessage("password is not long enough"),
    ],
    [
      check("username")
        .isLength({ min: 6 })
        .withMessage("username is too short"),
    ],
    [
      check("first")
        .isLength({ min: 2 })
        .withMessage("first name is too short"),
    ],
    [check("last").isLength({ min: 2 }).withMessage("last name is too short")],
    function (req, res) {
      // Handle a POST request to the /registered route by first validating the request data.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // If the request data is not valid, generate an error message and display it to the user using the alert function, and then redirect them back to the /register route.
        let msg = "";
        for (var i = 0; i < errors.array().length; i++) {
          msg += errors.array()[i].msg + "\\n";
        }
        // Add check on all.
        console.log(msg);
        res.send(alert(msg, "register"));
      } else {
        // If the request data is valid, hash the password using the bcrypt package and then store the user's information in the database.
        const saltRounds = 10;
        const plainPassword = req.body.password;
        const hashedPassword = "";

        // Print the request data to the console for debugging purposes.
        console.log(req.body.username);
        console.log(req.body.first);
        console.log(req.body.last);
        console.log(req.body.email);
        console.log(req.body.password);

        // Hash the password using bcrypt and add 10 salt rounds.
        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
          if (err) {
            res.redirect("./");
          } else {
            // Create an array of parameters to be used in the SQL query to store the user's information in the database.
            let params = [
              db.escape(req.sanitize(req.body.username)),
              db.escape(req.sanitize(req.body.first)),
              db.escape(req.sanitize(req.body.last)),
              db.escape(req.sanitize(req.body.email)),
              db.escape(req.sanitize(hashedPassword)),
            ];

            // Create a SQL query to store the user's information in the database.
            let sqlCreate =
              "insert into users (username,firstname,lastname,email,hashedPassword) values (?,?,?,?,?)";

            // Execute the SQL query to store the user's information in the database.
            db.query(sqlCreate, params, (err, result) => {
              if (!errors.isEmpty()) {
                let msg = "";
                for (var i = 0; i < errors.array().length; i++) {
                  msg += errors.array()[i].msg + "\\n";
                }
                // Add check on all.
                console.log(msg);
                res.send(alert(msg, "register"));
              } else {
                if (err) {
                  // Alert the user if there was an error with the MySQL query.
                  // alert("error mysql");
                  res.redirect("./");
                }
                // Redirect the user to the /login route.
                res.redirect("./login");
              }
            });
          }
        });
      }
    }
  );

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the login
  app.get("/login", function (req, res) {
    //send the result to the loggedin.ejs
    res.render("logIn.ejs", shopData);
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // POST route from the login
  app.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("./");
      }
      res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
    });
  });

  //@@@@@@@@@@@@@------TODO
  //add access to the login page
  //add a admin log in page
  //-----------------------------------------------//
  //-----------------------------------------------//

  app.get("/tvshows", (req, res) => {
    res.render("tvshows.ejs", shopData);
  });
  app.get("/show-search", (req, res) => {
    // Import the request module
    const request = require("request");

    // Get the query parameter from the request object and sanitize it
    let query = req.sanitize(req.query["tvshow"]);

    // Construct the URL for the API request using the query parameter
    let url = `https://api.tvmaze.com/search/shows?q=${query}`;

    // Send a GET request to the API using the request module
    request(url, (err, response, body) => {
      // If there is an error, log it to the console
      if (err) {
        console.log("error:", error);
      } else {
        // Parse the JSON response from the API
        const data = JSON.parse(body);

        // If there is data in the response, create a new object that contains the show information and render the "tvshows-result.ejs" template with that data
        if (data !== undefined && data[0] !== undefined) {
          let newData = Object.assign({}, shopData, { showsInfo: data });

          res.render("tvshows-result.ejs", newData);
        } else {
          // If there is no data in the response, render the "tvshows.ejs" template
          res.render("tvshows.ejs");
        }
      }
    });
  });

  app.post("/loggedin", function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "logout"));
      // res.redirect("./register");
    } else {
      const bcrypt = require("bcrypt");
      // let sqlCreate =
      //   "insert into users (username,firstname,lastname,email,hashedPassword) values (?)";
      let params1 = [db.escape(req.sanitize(req.body.username))];
      // SQL query for the hash password
      let sql_q =
        "SELECT hashedpassword FROM users WHERE username = values (?)";

      // SQL for the stage 1 sanitisation To check if the username is inside the database
      let params2 = [db.escape(req.sanitize(req.body.password))];
      let sql_sanatise = "SELECT username FROM users WHERE username = (?)";
      let sql_v = [db.escape(req.sanitize(req.body.username))];
      req.session.userId = db.escape(req.sanitize(req.body.username));

      //Stage one sanitization checking if the username is in the database
      db.query(sql_sanatise, sql_v, (err, result) => {
        let matcherrr = false;
        if (err) {
          res.redirect("./");
          console.log("error");
          console.log("proccess finshed: 1.1");
        } else {
          console.log("proccess finshed: 2.1");
          // Checking if the username is inside the database Iterating and using JavaScript
          for (var i = 0; i < result.length; i++) {
            //  if (result[i].username == sql_sanatise) {
            if (result[i].username == sql_v) {
              matcherrr = true;
              console.log("matcherrr" + matcherrr);
            }
          }
          console.log("proccess finshed: 3.1");
        }
        console.log("proccess finshed: 4.1");

        console.log("matcherrr: --------------" + matcherrr);

        //-------------------------------------------------
        //-------------------------------------------------
        // Stage 2 sanitisation
        // if the username is inside the database
        let wrongUsernamebool = false;
        if (matcherrr) {
          // hashedpassword
          db.query(sql_q, sql_v, (err, result) => {
            if (err) {
              res.redirect("./");
            } else {
              // Checking if a Username name is inside the database
              for (var i = 0; i < result.length; i++) {
                if (result[i].username == sql_v) {
                  matcherrr = true;
                  console.log("matcherrr" + matcherrr);
                }
              }
              //Asynchronous function is firing after the result is returned
              console.log("matcherrr-----------" + matcherrr);
              // console.log(result[0].hashedpassword);
              console.log("result: -------------------" + result);
              // Compare the hash password with the plain password
              var hashedPassword = result[0].hashedpassword;
              bcrypt.compare(
                req.sanitize(req.body.password),

                hashedPassword,
                function (err, result) {
                  if (err) {
                    wrongUsernamebool = true;
                    // SQL query error
                    // alert("error mysql");
                    console.log("error");
                    res.redirect("./");
                  } else if (result == true) {
                    // Passwords match
                    // alert("You are logged in");
                    console.log("You are logged in");
                    res.status(200);
                    res.send("You are logged in");
                  } else if (result != true) {
                    // Passwords don't match
                    // alert("You are logged in");
                    console.log("Wrong password");
                    res.send("Wrong password");
                  } else {
                    // Extra try again statement
                    // alert("Password is incorrect");

                    console.log("try again");
                    res.send("try again");
                  }
                }
              );
            }
          });
          //Entered the wrong Username
        } else {
          console.log("wrong username try agian");
          res.status(200);
          res.send("wrong username");
        }
      });
    }
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the logout
  app.get("/deleteusers", function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "deleteusers"));
      // res.redirect("./register");
    } else {
      let params2 = [db.escape(req.sanitize(req.body.password))];
      let sql_sanatise = "SELECT username FROM users WHERE username = (?)";
      db.escape(req.sanitize(req.body.password));
      let sqlquery = "SELECT * FROM = values (?)";
      // query database to get all the books
      // execute sql query
      db.query(sqlquery, params2, (err, result) => {
        if (err) {
          console.log("error");
          res.redirect("./");
        }
        console.log(result);
        //Converting out of put from database to an object to be passed to delete user page
        let newData = Object.assign({}, shopData, { availableBooks: result });
        console.log(newData);
        res.render("deleteusers.ejs", newData);
      });
    }
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // POST route for the logout
  app.post("/deletedauser", function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "deleteusers"));
      // res.redirect("./register");
    } else {
      // const bcrypt = require("bcrypt");

      var mysql = require("mysql");
      // SQL query for the hash password

      let sqlquery = "SELECT * FROM books"; // query database to get all the books
      // execute sql query

      if (req.query.keyword) {
        // Sanitize the keyword input
        const keyword_Sanitize = sanitizeHtml(req.query.keyword);
        // Escape any HTML special characters in the keyword input
        const keyword_XSS_provention = escapeHtml(keyword_Sanitize);
        // Select specific books from the database
        sqlquery =
          "SELECT * FROM books WHERE name LIKE '%" +
          keyword_XSS_provention +
          "%'";
      }

      // let store_user = [req.body.username];
      let store_user = req.body.username;

      db.query(sqlquery, store_user, (err, result) => {
        if (err) {
          console.log(err + "error");
          // alert("error mysql query");
          res.redirect("./");
        } else {
          // if(sqlquery == store_user){
          //     console.log("user found");
          // }
          // console.log(result);
        }
        // Variable used to switch between if statements  to check if the username is inside the database
        var matcherrr = false;

        console.log("result-----------------" + result);
        // Converting the output of the query into useful information to probit the user from deleting the wrong user
        let newData = Object.assign({}, shopData, { availableBooks: result });
        console.log("1----" + newData);
        console.log("2----" + result.length);
        console.log("3----" + newData.length);
        console.log("4----" + shopData);
        //   console.log("5----" + result.availableBooks);

        console.log("4----" + newData[0]);
        // Checking if username is inside a database and setting matcherrr to true
        for (var i = 0; i < result.length; i++) {
          //   console.log("-----------------", result[i].username);
          if (result[i].username == store_user) {
            matcherrr = true;
            console.log("matcherrr" + matcherrr);
          }
        }
        // If the username is inside the database then delete the user can be queried
        if (matcherrr == true && result.length > 0) {
          console.log("user found");
          // SQL query for the hash password
          let delete_user_query = "DELETE FROM users WHERE username = ?;";
          // Query and delete the user
          db.query(delete_user_query, store_user, (err, result) => {
            if (err) {
              console.log("error");
              res.redirect("./");
            } else {
              console.log("user deleted");
              res.redirect("./deleteusers");
            }
          });
        } else {
          // res.send("Username Not Found error");
          //Anything else is caught here and and this means that the the username does not match and you get redirected to the same page
          console.log("Username Not Found error");
          // alert("Username Not Found error");
          res.redirect("./deleteusers");
        }
      });
    }
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the logout

  //@@@@@@@@@@@@@------TODO
  // app.get("/list", function (req, res) {
  //   let sqlquery = "SELECT * FROM books"; // query database to get all the books
  //   // execute sql query
  //   db.query(sqlquery, (err, result) => {
  //     if (err) {
  //       res.redirect("./");
  //     }
  //     //Converting out put from database to an object to be passed to delete user page
  //     let newData = Object.assign({}, shopData, { availableBooks: result });
  //     console.log(newData);
  //     res.render("list.ejs", newData);
  //   });
  // });
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the logout
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // POST route for the logout
  app.post("/bookadded", function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "addbook"));
      // res.redirect("./register");
    } else {
      // saving data in database
      let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
      // execute sql query
      let newrecord = [req.body.name, req.body.price];
      // execute sql query with the new book record
      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
          return console.error(err.message);
        } else
          res.send(
            " This book is added to database, name: " +
              req.body.name +
              " price " +
              req.body.price
          );
      });
    }
  });

  //@@@@@@@@@@@@@------TODO
  //-----------------------------------------------//
  //-----------------------------------------------//
  // GET route for the bargainbooks
  app.get("/bargainbooks", function (req, res) {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      let msg = "";
      for (var i = 0; i < errors.array().length; i++) {
        msg += errors.array()[i].msg + "\\n";
        // errors[i]
      }
      //add check on all
      console.log(msg);
      res.send(alert(msg, "bargainbooks"));
      // res.redirect("./register");
    } else {
      // Bargain books query list all Book star under $20
      let sqlquery = "SELECT * FROM books WHERE price < 20";
      // execute sql query
      db.query(sqlquery, (err, result) => {
        if (err) {
          res.redirect("./");
        }
        //Converting out put from database to an object to be passed to the bargain books page
        let newData = Object.assign({}, shopData, { availableBooks: result });
        console.log(newData);
        res.render("bargains.ejs", newData);
      });
    }
  });
};

//------------------------------------------------
//------------------------------------------------
