const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));


app.set("view engine", "ejs");
app.set("views", "views");


app.get("/netbank", function(req, res) {
    res.status(200).render('index')
});

app.listen(8080)