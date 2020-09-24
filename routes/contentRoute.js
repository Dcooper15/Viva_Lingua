'use strict'
const express = require("express");
const router = express.Router();


const PostsModel = require("../models/contentModel");


router.get("/", (req, res) => {
    console.log("1st req.session: ", req.session);
    res.render("template", {
      locals: {
        title: "Post a LangSource",
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
 

    res.sendStatus(200);
  });





module.exports = router; 