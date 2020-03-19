const express = require("express");
const compression = require("compression");
const mysql = require("mysql");
const bodyparser = require("body-parser");
const server = express();

server.use(express.static("public"));
server.use(bodyparser.urlencoded({extended : false}));
server.use(bodyparser.json());
server.use(compression());

// server.set("twig options", {allowAsync: true});

const database = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "Miguel",
    database : "node"
});

database.connect();


server.post("/articles", (req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;

    database.query('INSERT INTO article (title, content, image) VALUES(?, ?, ?)', [title, content, image], (err, results) => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.redirect("/articles");
            // console.log(results);
        }
    });
});

server.get("/", (req, res) => {
    database.query("SELECT * FROM article, image", (err, results) => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.render("index.twig", {data : results});
        }
    });
});


server.get("/articles", (req, res) => {
    database.query("SELECT id, title, content, image FROM article", (err, article) => {
        if (err)
        {
            throw err;
        }
        else
        {
            database.query("SELECT id, url FROM image", (err, image) => {
                if (err) {
                    throw err;
                }
                else
                {
                    res.render("articles.twig", { article : article, image : image});
                }
            });
        }
    });
});

server.get("/articles/:id", (req, res) => {
    database.query("SELECT article.id AS article_Id, article.title AS article_Title, article.content AS article_Content, article.image AS article_Image FROM article WHERE id=?", req.params.id, (err, results) => {
        if(err)
        {
            throw err;
        }
        else
        {
            res.render("article.twig", {data : results});
        }
    });
});


server.listen(8080);