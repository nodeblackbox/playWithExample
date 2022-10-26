const bcrypt = require("bcrypt");
module.exports = function (app, shopData) {
  //------------------------------------------------
  //------------------------------------------------
  // Handle our routes
  app.get("/", function (req, res) {
    res.render("index.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/about", function (req, res) {
    res.render("about.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/search", function (req, res) {
    res.render("search.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/search-result", function (req, res) {
    //searching in the database
    //res.send("You searched for: " + req.query.keyword);

    let sqlquery =
      "SELECT * FROM books WHERE name LIKE '%" + req.query.keyword + "%'"; // query database to get all the books

    //------------------------------------------------
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/register", function (req, res) {
    res.render("register.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  app.post("/registered", function (req, res) {
    // const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const plainPassword = req.body.password;
    const hashedPassword = "";

    console.log(req.body.username);
    console.log(req.body.first);
    console.log(req.body.last);
    console.log(req.body.email);
    console.log(req.body.password);

    //-=--=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
    // username       | varchar(50)  | YES  |     | NULL    |                |
    // | firstname      | varchar(50)  | YES  |     | NULL    |                |
    // | lastname       | varchar(50)  | YES  |     | NULL    |                |
    // | email          | varchar(50)  | YES  |     | NULL    |                |
    // username;
    // firstname;
    // lastname;
    // email;

    // ---------------------------------------------------------------------------------
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
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
      db.query(sqlCreate, (err, result) => {
        if (err) {
          res.redirect("./");
        }
        // console.log()
        // result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered! We will send an email to you at ' + req.body.email;
        result +=
          "Your password is: " +
          req.body.password +
          " and your hashed password is: " +
          hashedPassword;
        res.send(result);
      });
    });
    // ----------------------------------------------------------------------------------

    // saving data in database
    // res.send(
    //   " Hello " +
    //     req.body.first +
    //     " " +
    //     req.body.last +
    //     " you are now registered!  We will send an email to you at " +
    //     req.body.email
    // );
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  //   app.post("/loggedin", function (req, res) {
  //     // const bcrypt = require("bcrypt");
  //     // const saltRounds = 10;
  //     // const plainPassword = req.body.password;

  //     //------------------------------------------------------
  //     //------------------------------------------------------
  //     // const bcrypt = require("bcrypt");

  //     // // hashing password.(registration)
  //     // const hashedPassword = bcrypt.hash(req.body.password, 10);
  //     // const user = { name: req.body.username, password: hashedPassword };

  //     // // compare password (login)
  //     // try {
  //     //   if (bcrypt.compare(password, user.password)) {
  //     //     console.log("login successfull");
  //     //   } else {
  //     //     console.log("login failed");
  //     //   }
  //     // } catch (e) {
  //     //   console.log("something went wrong", error);
  //     // }

  //     // re.send(user);
  //     //------------------------------------------------------
  //     //------------------------------------------------------

  //     const plainPassword = req.body.password;
  //     const username = req.body.username;
  //     //Here is the sql code for the db.query to be used for.
  //     let sqlquery = "SELECT * FROM user WHERE username ='" + username + "'";
  //     db.query(sqlquery, (err, result) => {
  //       //let hashedPassword = req.body.hashedPassword
  //       console.log(result);
  //       console.log(sqlquery);
  //       console.log(username);
  //       if (err) {
  //         //Checking out for errors.
  //         console.log("error");
  //         res.redirect("./");
  //       } else {
  //         if (result.length >= 1) {
  //           //Checking for the length of the user's input.
  //           bcrypt.compare(
  //             plainPassword,
  //             result[0].password,
  //             function (err, result) {
  //               //NOw we are comparing the 'password' from the user input with the ones in the database.
  //               if (err) {
  //                 console.log("not working " + plainPassword);
  //                 res.redirect("./");
  //               } else if (result == true) {
  //                 console.log(username + " is logged in successfully");
  //                 //res.send('Hi '+username+" is logged in");
  //                 res.redirect("./");
  //               } else {
  //                 console.log("credentials not correct " + plainPassword);
  //                 //res.send("Username or password incorrect");
  //                 res.redirect("./");
  //               }
  //             }
  //           );
  //         }
  //       }
  //     });
  // [object Object]Your password is: nasa and your hashed password is: $2b$10$lspf316Fy1xn4BkhDDhO4.wLAVkDTN7rhv2NeDjTq78Uu3roikWtS
  app.post("/loggedin", function (req, res) {
    // const bcrypt = require("bcrypt");
    // Here we are the variable that will store the user inputs.
    const plainPassword = req.body.password;
    const username = req.body.username;
    //Here is the sql code for the db.query to be used for.
    let sqlquery =
      "SELECT hashedpassword FROM users WHERE username ='" + username + "'";
    db.query(sqlquery, (err, result) => {
      //let hashedPassword = req.body.hashedPassword
      console.log(result);
      console.log(sqlquery);
      console.log(username);
      if (err) {
        //Checking out for errors.
        console.log("error");
        res.redirect("./");
      } else {
        if (result.length >= 1) {
          //Checking for the length of the user's input.
          bcrypt.compare(
            plainPassword,
            result[0].hashedPassword,
            function (err, result) {
              //NOw we are comparing the 'password' from the user input with the ones in the database.
              if (err) {
                console.log("not working " + plainPassword);
                res.redirect("./");
              } else if (result == true) {
                console.log(username + " is logged in successfully");
                //res.send('Hi '+username+" is logged in");
                res.redirect("./");
              } else {
                console.log("credentials not correct " + plainPassword);
                //res.send("Username or password incorrect");
                res.redirect("./");
              }
            }
          );
        }
      }
    });
  });
  //------------------------------------------------------
  //------------------------------------------------------
  // let sqlquery =
  //   "select hashedpassword from users where username='%" +
  //   req.query.username +
  //   "%';";

  // console.log(sqlquery);

  // console.log("test")

  // // query database to get all the books
  // // let sqlquery =
  // //   "SELECT username from users WHERE username = '%" +
  // //   req.body.username +
  // //   "%'"; // query database to get all the books

  // db.query(sqlquery, (err, result) => {
  //   if (err) {
  //     res.redirect("./");
  //   }
  //   console.log(result);
  //   //   console.log(newData);
  //   res.send(result);
  // });

  //------------------------------------------------

  //  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {

  // hashedPassword = sqlquery.RowDataPacket.hashedPassword;

  // bcrypt.compare(req.body.password, hashedPassword, function (err, result) {
  //   if (err) {
  //     res.redirect("./");
  //     // TODO: Handle error
  //   } else if (result == true) {
  //     res.send("You are logged in!");
  //   } else {
  //     res.send("Wrong password!");
  //     // TODO: Send message
  //   }
  // });
  //------------------------------------------------
  //   });

  //------------------------------------------------
  // execute sql query
  //     db.query(sqlquery, (err, result) => {
  //     if (err) {
  //         res.redirect("./");
  //     }
  //     let newData = Object.assign({}, shopData, { availableBooks: result });
  //     console.log(newData);
  //     res.render("list.ejs", newData);
  //     });
  //     //becrypt.compare
  //   res.send(result);
  // });
  // ----------------------------------------------------------------------------------

  // saving data in database
  // res.send(
  //   " Hello " +
  //     req.body.first +
  //     " " +
  //     req.body.last +
  //     " you are now registered!  We will send an email to you at " +
  //     req.body.email
  // );
  //------------------------------------------------
  //------------------------------------------------
  app.get("/list", function (req, res) {
    let sqlquery = "SELECT * FROM books"; // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });

  //------------------------------------------------
  //------------------------------------------------
  app.get("/addbook", function (req, res) {
    res.render("addbook.ejs", shopData);
  });

  app.post("/bookadded", function (req, res) {
    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?,?)";
    // execute sql query
    let newrecord = [req.body.name, req.body.price];
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

  app.get("/bargainbooks", function (req, res) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("bargains.ejs", newData);
    });
  });
};
