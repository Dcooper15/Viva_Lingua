const express = require("express");
const router = express.Router();
const bcrpyt = require("bcryptjs");

const UsersModel = require("../models/usersModel");

router.get("/", (req, res) => {
    res.redirect("/users/signup");
  });
  
  router.get("/login", (req, res) => {
    res.render("template", {
      locals: {
        title: "Login Page",
        is_logged_in: req.session.is_logged_in
      },
      partials: {
        partial: "partial-login",
      },
    });
  });
  
  router.get("/signup", (req, res) => {
    res.render("template", {
      locals: {
        title: "Sign Up Page",
        is_logged_in: req.session.is_logged_in
      },
      partials: {
        partial: "partial-signup",
      },
    });
  });

  // router.get("/profile", (req, res) => {
  //   const profileData = await UsersModel.Profile();
  //   res.render("template", {
  //     locals: {
  //       title: "Hello User",
  //       data: profileData,
  //       is_logged_in: req.session.is_logged_in
  //     },
  //     partials: {
  //       partial: "partial-profile",
  //     },
  //   });
  // });






router.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/users/login");
})


router.post("/signup", (req, res) => {
    const { user_name, email, password} = req.body;
    
    // Salt and Hash our passwords
    const salt = bcrpyt.genSaltSync(10);
    const hash = bcrpyt.hashSync(password, salt);
    const userInstance = new UsersModel(null, user_name, email, hash);

    userInstance.signup().then(response => {
        if (response.id !== undefined) {
            res.redirect('/users/login');
        } else {
            res.redirect('/users/signup');
        }
        console.log("response is: ", response);
        //res.sendStatus(200);
    })
    
    
  })
  
  router.post("/login", (req, res) => {
    const { user_name, email, password } = req.body;
    console.log("req body: ", req.body)
    const userInstance = new UsersModel(null, user_name, email, password);
    userInstance.login().then(response => {
        req.session.is_logged_in = response.isValid;
        if (!!response.isValid) {
            const { user_name, user_id } = response;
            req.session.user_name = user_name;
            req.session.user_id = user_id;
            res.redirect("/")
        } else {
            res.sendStatus(401);
        }
    });
   
});










module.exports = router;