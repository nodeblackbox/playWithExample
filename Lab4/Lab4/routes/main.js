module.exports = function (app, shopData) {
  const { check, validationResult } = require("express-validator");
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect("./login");
    } else {
      next();
    }
  };

  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  app.get("/search", redirectLogin, function (req, res) {
    res.render("search.ejs", shopData);
  });
  app.get("/search-result", redirectLogin, function (req, res) {
    //searching in the database
    //res.send("You searched for: " + req.query.keyword);

    let sqlquery =
      "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      res.render("list.ejs", newData);
    });
  });

  //register page, which renders register.ejs when you access the page
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });
  //here is the registration process
  app.post(
    "/registered",
    //checks the format of the email
    [check("email").isEmail().normalizeEmail()],
    [
      //checks if the password matches the criteria,
      //which is minimum 8 characters, including one special character,
      //one number and one upper case letter
      check("password")
        .isLength({ min: 8 })
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .matches(/\d/)
        .matches(/[A-Z][a-z]/)
        .trim(),
    ],
    [
      //checks if the username matches the criteria,
      //having a length of 6 characters, containing
      //at least one number and not having any special characters
      check("username")
        .isLength({ min: 6 })
        .matches(/\d/)
        .not()
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .trim(),
    ],
    [
      //checks if the firstname matches the crietria,
      //not having any numbers or special characters
      check("first")
        .not()
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .not()
        .matches(/\d/)
        .trim(),
    ],
    [
      //checks if the lastname matches the crietria,
      //not having any numbers or special characters
      check("last")
        .not()
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .not()
        .matches(/\d/)
        .trim(),
    ],

    function (req, res) {
      //checks if there are any error
      const errors = validationResult(req);

      //redirects users to a blank register page if their
      //details do not match the criteria
      if (!errors.isEmpty()) {
        res.redirect("./register");
      } else {
        const bcrypt = require("bcrypt");
        const saltRounds = 10;
        const plainPassword = req.body.password;

        bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
          // Store hashed password in your database.

          if (err) {
            return console.error(err.message);
          }

          //inserts the usernames, firstname, lastname etc in sql in each corresponding table
          //only the hashed password is saved on the SQL database, so if the database is broken into
          //the passwords cannot be stolen
          let sqlquery =
            "INSERT INTO users (username, firstname, lastname, email, hashedPassword) VALUES (?,?,?,?,?)";
          let usersTable = [
            req.sanitize(req.body.username),
            req.sanitize(req.body.first),
            req.sanitize(req.body.last),
            req.sanitize(req.body.email),
            hashedPassword,
            req.sanitize(req.body.password),
          ];

          db.query(sqlquery, usersTable, (err, result) => {
            if (err) {
              return console.error(err.message);
            } else {
              //displays the user's details after the registration has been done
              let newData = Object.assign({}, shopData, {
                newUser: usersTable,
              });
              //renders registered page if the user register was successful
              res.render("registered.ejs", newData);
            }
          });
        });
      }
    }
  );

  //login page, which renders login.ejs when you access the page
  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });

  //here is the login process, where it checks whether the user details are correct or not
  app.post(
    "/loggedin",
    [
      //checks if the password matches the criteria,
      //having a length of 8 characters, containing
      //at least one number and having at least one special character
      check("password")
        .isLength({ min: 8 })
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .matches(/\d/)
        .matches(/[A-Z][a-z]/)
        .trim(),
    ],
    [
      //checks if the username matches the criteria,
      //having a length of 6 characters, containing
      //at least one number and not having any special characters
      check("username")
        .isLength({ min: 6 })
        .matches(/\d/)
        .not()
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .trim(),
    ],
    function (req, res) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.redirect("./login");
      } else {
        req.session.userId = req.body.username;
        const bcrypt = require("bcrypt");
        const plainPassword = req.body.password;
        //selects the hashed password corresponding to the username
        let sqlQuery =
          "SELECT hashedPassword FROM users WHERE username='" +
          req.body.username +
          "'";

        //Querying the db
        db.query(sqlQuery, (err, result) => {
          if (err) {
            return console.log(err.message);
          }

          //if the user cannot be found in the database, wrong user page is rendered
          if (result[0] == undefined) {
            res.render("wronguser.ejs");
          } else {
            let hashedPassword = result[0].hashedPassword;

            //compares the entered password to the username's password
            bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
              if (err) {
                return console.error(err.message);
              }
              //if the password entered matches the password stored in the database,
              //the login is successful
              if (result === true) {
                res.render("loggedin.ejs");
              } else {
                //if the passwords do not match, the login fails
                res.render("loginfail.ejs");
              }
            });
          }
        });
      }
    }
  );

  app.get("/list", redirectLogin, function (req, res) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });

      res.render("list.ejs", newData);
    });
  });

  //users page, which renders listusers.ejs when you access the page
  app.get("/listusers", redirectLogin, function (req, res) {
    let sqlquery = "SELECT * FROM users"; // query database to get all the users
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      //gets all the user's data
      let newData = Object.assign({}, shopData, { availableUsers: result });

      //renders the page and the data for the user
      res.render("listusers.ejs", newData);
    });
  });

  app.get("/addbook", redirectLogin, function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  app.post("/bookadded", function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("./addbook");
    }

    // saving data in database

    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.sanitize(req.body.name), req.sanitize(req.body.price)];
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) {
        return console.error(err.message);
      } else {
        res.render("bookadded.ejs", newData);
      }
    });
  });

  app.get("/bargainbooks", redirectLogin, function (req, res) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });

      res.render("bargains.ejs", newData);
    });
  });

  //delete users page, which renders deleteuser.ejs when accessed
  app.get("/deleteuser", redirectLogin, function (req, res) {
    res.render("deleteuser.ejs", shopData);
  });

  //here is the function of the delete page
  app.post(
    "/delete",
    [
      //checks if the username matches the criteria,
      //having a length of 6 characters, containing
      //at least one number and not having any special characters
      check("username")
        .isLength({ min: 6 })
        .matches(/\d/)
        .not()
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .trim(),
    ],
    function (req, res) {
      const username = req.body.username;
      //deletes all data from the database corresponding to the username entered
      let sqlQuery = "DELETE FROM users WHERE username='" + username + "'";

      db.query(sqlQuery, (err, result) => {
        if (err) {
          return console.log("Error on the deleteUser path: ", err);
        }
        //if there are no affected rows because the username is not in the database or
        //has already been deleted, user not found page will be displayed
        if (result.affectedRows == 0) {
          res.render("notfound.ejs");
        } else {
          let newData = Object.assign({}, shopData, { deletedUser: username });
          res.render("deleteduser.ejs", newData);
        }
      });
    }
  );

  app.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("./");
      }
      res.render("loggedout.ejs");
    });
  });

  app.get("/weather2", redirectLogin, function (req, res) {
    res.render("weather2.ejs", shopData);
  });

  app.post("/weather", function (req, res) {
    const request = require("request");

    let apiKey = "4eb7781a25b9a4c1f4f8ea0f6c92dc7a";
    let city = req.body.city;
    //when the page is accessed, this url will be displayed
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    request(url, function (err, response, body) {
      if (err) {
        console.log("error:", error);
      } else {
        var weather = JSON.parse(body);
        //if the keyword matches/is not empty, the program will run
        if (weather != undefined && weather.main != undefined) {
          let weatherStats = [
            weather.main.temp,
            weather.name,
            weather.main.temp_max,
            weather.main.temp_min,
            weather.main.humidity,
            weather.main.pressure,
            weather.wind.speed,
          ];
          //assigning the weather to newData
          let newData = Object.assign({}, shopData, { stats: weatherStats });
          //displaying the weather info
          res.render("weatherinfo.ejs", newData);
          //if the keyword does not match the api, No data found will be displayed
        } else {
          res.render("weather2.ejs");
        }
      }
    });
  });

  app.get("/api", (req, res) => {
    //Select all the books from the database
    let sqlQuery = "SELECT * FROM books";
    if (req.query.keyword) {
      //Select specific books from the database
      sqlQuery =
        "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'";
    }
    db.query(sqlQuery, (err, result) => {
      if (err) {
        res.redirect("./");
      } else {
        // Return results as a JSON object
        res.json(result);
      }
    });
  });

  app.get("/tvshows", (req, res) => {
    res.render("tvshows.ejs", shopData);
  });

  //Searching for TV Shows
  app.get("/show-search", (req, res) => {
    const request = require("request");
    //gets the tv show entered on the form
    let query = req.sanitize(req.query["tvshow"]);
    //adds the tv show to the link
    let url = `https://api.tvmaze.com/search/shows?q=${query}`;
    request(url, (err, response, body) => {
      if (err) {
        console.log("error:", error);
      } else {
        const data = JSON.parse(body);
        //if they keyword is found in the list, the data is displayed
        if (data !== undefined && data[0] !== undefined) {
          let newData = Object.assign({}, shopData, { showsInfo: data });
          //if the keyword can't be found, tv_show.ejs will be displayed again
          res.render("tvshows-result.ejs", newData);
        } else {
          //redirects if the keyword is not found
          res.render("tvshows.ejs");
        }
      }
    });
  });
};
