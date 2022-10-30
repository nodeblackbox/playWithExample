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
        // alert("error mysql");
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("list.ejs", newData);
    });
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/listusers", function (req, res) {
    let sqlquery = "SELECT * FROM users";
    // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("listusers.ejs", newData);
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

    // ---------------------------------------------------------------------------------
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
          alert("error mysql");
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
  });
  //------------------------------------------------
  //------------------------------------------------
  app.get("/login", function (req, res) {
    res.render("login.ejs", shopData);
  });
  //------------------------------------------------
  //------------------------------------------------
  // app.post("/loggedin", function (req, res) {
  //   const bcrypt = require("bcrypt");
  //   let sql_q = "SELECT hashedpassword FROM users WHERE username = ?";
  //   let sql_sanatise = "SELECT * FROM users WHERE username = ?";
  //   let sql_v = [req.body.username];

  //   let matcherrr = false;

  //   db.query(sql_sanatise, sql_v, (err, result) => {
  //     if (err) {
  //       res.redirect("./");
  //       console.log("proccess finshed: 1");
  //     } else {
  //       console.log("proccess finshed: 2");
  //       for (var i = 0; i < result.length; i++) {
  //         //  if (result[i].username == sql_sanatise) {
  //         if (result[i].username == sql_v) {
  //           matcherrr = true;
  //           console.log("matcherrr" + matcherrr);
  //         }
  //       }
  //       console.log("proccess finshed: 3");
  //     }
  //     console.log("proccess finshed: 4");
  //   });

  //-------------------------------------------------
  //-------------------------------------------------
  //-------------------------------------------------

  app.post("/loggedin", function (req, res) {
    const bcrypt = require("bcrypt");
    let sql_q = "SELECT hashedpassword FROM users WHERE username = ?";
    let sql_sanatise = "SELECT * FROM users WHERE username = ?";
    let sql_v = [req.body.username];

    let matcherrr = false;

    db.query(sql_sanatise, sql_v, (err, result) => {
      if (err) {
        res.redirect("./");
        console.log("proccess finshed: 1");
      } else {
        console.log("proccess finshed: 2");
        for (var i = 0; i < result.length; i++) {
          //  if (result[i].username == sql_sanatise) {
          if (result[i].username == sql_v) {
            matcherrr = true;
            console.log("matcherrr" + matcherrr);
          }
        }
        console.log("proccess finshed: 3");
      }
      console.log("proccess finshed: 4");
    });

    if (matcherrr) {
      // hashedpassword;
      db.query(sql_q, sql_v, (err, result) => {
        if (err) {
          res.redirect("./");
        } else {
          console.log("result: -------------------" + result);
          for (var i = 0; i < result.length; i++) {
            if (result[i].username == sql_v) {
              matcherrr = true;
              console.log("matcherrr" + matcherrr);
            }
          }
          console.log("matcherrr-----------" + matcherrr);
          // console.log(result[0].hashedpassword);
          console.log("result: -------------------" + result);
          var hashedPassword = result[0].hashedpassword;
          bcrypt.compare(
            req.body.password,
            hashedPassword,
            function (err, result) {
              if (err) {
                // alert("error mysql");
                console.log("error");
                res.redirect("./");
              } else if (result == true) {
                // alert("You are logged in");
                res.send("You are logged in");
              } else if (result != true) {
                // alert("You are logged in");
                res.send("Wrong password");
              } else {
                // alert("Password is incorrect");
                res.send("try again");
              }
            }
          );
        }
      });
    }
    res.redirect("./login");
    res.send("try again");
  });

  //------------------------------------------------
  //------------------------------------------------
  app.get("/deleteusers", function (req, res) {
    let sqlquery = "SELECT * FROM users";
    // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
      if (err) {
        res.redirect("./");
      }
      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log(newData);
      res.render("deleteusers.ejs", newData);
    });
  });
  //------------------------------------------------
  //------------------------------------------------
  app.post("/deletedauser", function (req, res) {
    // const bcrypt = require("bcrypt");

    var mysql = require("mysql");
    let sqlquery = "SELECT * FROM users";

    // let store_user = [req.body.username];
    let store_user = req.body.username;

    db.query(sqlquery, store_user, (err, result) => {
      if (err) {
        console.log(err + "error");
        alert("error mysql query");
        res.redirect("./");
      } else {
        // if(sqlquery == store_user){
        //     console.log("user found");
        // }
        // console.log(result);
      }
      var matcherrr = false;

      console.log("result-----------------" + result);

      let newData = Object.assign({}, shopData, { availableBooks: result });
      console.log("1----" + newData);
      console.log("2----" + result.length);
      console.log("3----" + newData.length);
      console.log("4----" + shopData);
      //   console.log("5----" + result.availableBooks);

      console.log("---------------------ttttttttttt " + store_user);

      console.log("4----" + newData[0]);

      for (var i = 0; i < result.length; i++) {
        //   console.log("-----------------", result[i].username);
        if (result[i].username == store_user) {
          matcherrr = true;
          console.log("matcherrr" + matcherrr);
        }
      }
      if (matcherrr == true && result.length > 0) {
        console.log("user found");
        let delete_user_query = "DELETE FROM users WHERE username = ?;";
        db.query(delete_user_query, store_user, (err, result) => {
          if (err) {
            console.log("fucking work");
            res.redirect("./");
          } else {
            console.log("user deleted");
            res.redirect("./deleteusers");
          }
        });
      } else {
        // res.send("Username Not Found error");

        console.log("Username Not Found error");
        alert("Username Not Found error");
        res.redirect("./deleteusers");
      }
      //------------------------------
    });
  });
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
  //------------------------------------------------
  //------------------------------------------------
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
//------------------------------------------------
//------------------------------------------------
