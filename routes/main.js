//This is the main page where I will be querying the database, Storing and securing hash passwords  and returning information or storing information in the database.

// Important bcrypt
const bcrypt = require("bcrypt");
const { check, validationResult } = require("express-validator");

module.exports = function (app, shopData) {
  const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
      res.redirect("./login");
    } else {
      next();
    }
  };
  app.get("/list", redirectLogin, function (req, res) {
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
  });
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

  //------------------------------------------------
  //------------------------------------------------
  // Handle our routes

  // GET route for the home page
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  // GET route for the about page
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  // GET route for the search page
  app.get("/search", function (req, res) {
    //send the result to the search-result.ejs
    res.render("search.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  // GET route from the search page
  app.get("/search-result", function (req, res) {
    //searching in the database
    //res.send("You searched for: " + req.query.keyword);

    let sqlquery =
      "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        // alert("error mysql");
        res.redirect("./");
      }
      //store the result in the shopData
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });
  //------------------------------------------------
  //------------------------------------------------
  // GET route for the listusers page
  app.get("/listusers", function (req, res) {
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
  });

  //------------------------------------------------
  //------------------------------------------------
  // GET route for the register
  app.get("/register", function (req, res) {
    //send the result to the registered.ejs
    res.render("register.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  app.post("/registered", [check("email").isEmail()], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("./register");
    } else {
      // REST OF YOUR CODE
      const saltRounds = 10;
      const plainPassword = req.body.password;
      const hashedPassword = "";

      console.log(req.body.username);
      console.log(req.body.first);
      console.log(req.body.last);
      console.log(req.body.email);
      console.log(req.body.password);

      // ---------------------------------------------------------------------------------
      // ---------------------------------------------------------------------------------
      // Hashing the password and adding 10 salt rounds
      bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        // Store hash in your password DB.
        // Query all the necessary information to store data into the database
        let sqlCreate =
          "insert into users (username,firstname,lastname,email,hashedPassword) values ('" +
          req.body.username +
          "' , '" +
          req.body.first +
          "' , '" +
          req.body.last +
          "' , '" +
          req.body.email +
          "' , '" +
          hashedPassword +
          "')";
        // execute sql query
        db.query(sqlCreate, (err, result) => {
          if (err) {
            // alert("error mysql");
            res.redirect("./");
          }
          // console.log()
          // result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
          // Sending success message to user
          result +=
            "Your password is: " +
            req.body.password +
            " and your hashed password is: " +
            hashedPassword;
          res.send(result);
        });
      });
    }
  });
  //------------------------------------------------
  //------------------------------------------------

  // app.post("/registered", function (req, res) {
  //   // const bcrypt = require("bcrypt");
  //   const saltRounds = 10;
  //   const plainPassword = req.body.password;
  //   const hashedPassword = "";

  //   console.log(req.body.username);
  //   console.log(req.body.first);
  //   console.log(req.body.last);
  //   console.log(req.body.email);
  //   console.log(req.body.password);

  //   // ---------------------------------------------------------------------------------
  //   // ---------------------------------------------------------------------------------
  //   // Hashing the password and adding 10 salt rounds
  //   bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
  //     // Store hash in your password DB.
  //     // Query all the necessary information to store data into the database
  //     let sqlCreate =
  //       "insert into users (username,firstname,lastname,email,hashedPassword) values ('" +
  //       req.body.username +
  //       "' , '" +
  //       req.body.first +
  //       "' , '" +
  //       req.body.last +
  //       "' , '" +
  //       req.body.email +
  //       "' , '" +
  //       hashedPassword +
  //       "')";
  //     // execute sql query
  //     db.query(sqlCreate, (err, result) => {
  //       if (err) {
  //         // alert("error mysql");
  //         res.redirect("./");
  //       }
  //       // console.log()
  //       // result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
  //       // Sending success message to user
  //       result +=
  //         "Your password is: " +
  //         req.body.password +
  //         " and your hashed password is: " +
  //         hashedPassword;
  //       res.send(result);
  //     });
  //   });
  // });

  //------------------------------------------------
  //------------------------------------------------
  // POST route from the register
  // app.post("/registered", function (req, res) {
  //   // const bcrypt = require("bcrypt");
  //   const saltRounds = 10;
  //   const plainPassword = req.body.password;
  //   const hashedPassword = "";

  //   console.log(req.body.username);
  //   console.log(req.body.first);
  //   console.log(req.body.last);
  //   console.log(req.body.email);
  //   console.log(req.body.password);

  //   // ---------------------------------------------------------------------------------
  //   // ---------------------------------------------------------------------------------
  //   // Hashing the password and adding 10 salt rounds
  //   bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
  //     // Store hash in your password DB.
  //     // Query all the necessary information to store data into the database
  //     let sqlCreate =
  //       "insert into users (username,firstname,lastname,email,hashedPassword) values ('" +
  //       req.body.username +
  //       "' , '" +
  //       req.body.first +
  //       "' , '" +
  //       req.body.last +
  //       "' , '" +
  //       req.body.email +
  //       "' , '" +
  //       hashedPassword +
  //       "')";
  //     // execute sql query
  //     db.query(sqlCreate, (err, result) => {
  //       if (err) {
  //         // alert("error mysql");
  //         res.redirect("./");
  //       }
  //       // console.log()
  //       // result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
  //       // Sending success message to user
  //       result +=
  //         "Your password is: " +
  //         req.body.password +
  //         " and your hashed password is: " +
  //         hashedPassword;
  //       res.send(result);
  //     });
  //   });
  // });
  //------------------------------------------------
  //------------------------------------------------
  // GET route for the login
  app.get("/login", function (req, res) {
    //send the result to the loggedin.ejs
    res.render("logIn.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  // POST route from the login
  app.get("/logout", redirectLogin, (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.redirect("./");
      }
      res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
    });
  });

  app.post("/loggedin", function (req, res) {
    const bcrypt = require("bcrypt");
    // SQL query for the hash password
    let sql_q = "SELECT hashedpassword FROM users WHERE username = ?";
    // SQL for the stage 1 sanitisation To check if the username is inside the database
    let sql_sanatise = "SELECT username FROM users WHERE username = ?";
    let sql_v = [req.body.username];
    req.session.userId = req.body.username;

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

      console.log("matcherrr: ---------awdwadaw-----" + matcherrr);

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
              req.body.password,
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
  });

  //------------------------------------------------
  //------------------------------------------------
  // GET route for the logout
  app.get("/deleteusers", function (req, res) {
    let sqlquery = "SELECT * FROM users";
    // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
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
  });
  //------------------------------------------------
  //------------------------------------------------
  // POST route for the logout
  app.post("/deletedauser", function (req, res) {
    // const bcrypt = require("bcrypt");

    var mysql = require("mysql");
    // SQL query for the hash password
    let sqlquery = "SELECT * FROM users";

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
  });
  //------------------------------------------------
  //------------------------------------------------
  // GET route for the logout

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

  //------------------------------------------------
  //------------------------------------------------
  // GET route for the logout
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  // POST route for the logout
  app.post("/bookadded", function (req, res) {
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
  });
  //------------------------------------------------
  //------------------------------------------------
  // GET route for the bargainbooks
  app.get("/bargainbooks", function (req, res) {
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
  });
};
//------------------------------------------------
//------------------------------------------------
