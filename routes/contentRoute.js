'use strict'
const express = require("express");
const router = express.Router();
const fs = require("fs");


const PostsModel = require("../models/contentModel");


router.get("/", (req, res) => {
    console.log("1st req.session: ", req.session);
    res.render("template", {
      locals: {
        title: "CREATE POST",
        is_logged_in: req.session.is_logged_in
      },
      partials: {
        partial: "partial-uploads",
      },
    });
  });




router.get("/content", async function (req, res, next) {
    const postsData = await PostsModel.getAllPosts();
  
    res.render("template", {
      locals: {
        title: "VivaLingua",
        data: postsData,
      },
      partials: {
        partial: "partial-maincontent",
      },
    });
  });




router.get("/languages/:language_id?", async function (req, res) {
  const { language_id } = req.params;
  console.log("THE language is: ", language_id);
  let the_language = language_id;
  if (language_id === undefined) {
    the_language = 1;
  }
  const postsData = await PostsModel.getDynLang(the_language);
  console.log("DYN POSTTTTS DATA: ", postsData)
  res.render("template", {
      locals: {
          title: "Languages",
          data: postsData,
          is_logged_in: req.session.is_logged_in
      },
      partials: {
          partial: "partial-languages"
      }
  });
});




  router.post("/", async function (req, res) {
      const { user_id } = req.session;
    console.log("req session is: ", req.session)
    const { title, description, language, type } = req.body;
    const newId = parseInt(user_id);
    
    const uploadData = await PostsModel.postData(
      newId,
      title,
      description,
      language,
      type,
      req.files.filename.name
    );
  

    res.redirect('/uploads/content');
  });





module.exports = router; 
