
//

const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');
let html = 'http://localhost:3000/'


// ###############################################################################
// The database should be OK by now. Let's setup the Web server so we can start
// defining routes.
//
// First, create an express application `app`:

var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("."));



// //get from table
let sql = `SELECT * FROM phones`;
app.get('/phones', function(req, res) {
    db.all(sql, [], function(err, rows) {
        if (err) {
            return res.json(err.message)
            // console.error(404);
        }
        console.log('ok, get');
        return res.json(rows)

    });
});

//post new phones
app.post('/phones', function(req, res) {
    let post = {
        "brand": req.body[0].brand,
        "model": req.body[0].model,
        "os": req.body[0].os,
        "image": req.body[0].image,
        "screensize": req.body[0].screensize
    }
    console.log(post)

    db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`, [req.body[0].brand, req.body[0].model, req.body[0].os, req.body[0].image, req.body[0].screensize]);
    console.log('Inserted phone entry into database')
    res.set({
      'Content-Type': 'text/plain',
      'Status' : 200,
      'Content-Length': '',
      'ETag': '12345'
      })
      res.status(200).send('<h1>New phones have been added!</h1>');

});

//update brand
app.put('/update', function(req, res) {
    db.run(` UPDATE phones
      SET brand = ?,model=?, os=?, image=?,
                    screensize=? WHERE id=?`, [req.body[0].brand, req.body[0].model, req.body[0].os, req.body[0].image, req.body[0].screensize, req.body[0].id], function(){
    console.log('updated brand')
      res.set({
        'Content-Type': 'text/html',
        'Status' : 200,
        'Content-Length': '',
        'ETag': '12347'
        })
        res.status(200).send('<h1>This entry has been edited!</h1>');
});
});

//delete row
app.delete('/delete', function(req, res) {
    var deletedItem = req.body[0].brand
    // var exists = isThere(req.body[0].brand)
    db.run(`DELETE FROM phones WHERE brand=?`, [deletedItem], function(err, rows) {
        // if (exists == 0) {
        //     return res.status(404).send(err.message);
        // }
        // console.log(`Row deleted`)
        res.set({
          'Content-Type': 'text/html',
          'Status' : 200,
          'Content-Length': '',
          'ETag': '12346'
          })
          res.status(200).send('<h1>This phone has been deleted!</h1>');
});
});

// function isThere(data){
//     var y = NOT EXISTS (SELECT FROM phones WHERE brand=data)
//     return y
//
// }


// ###############################################################################
// This should start the server, after the routes have been defined, at port 3000:

app.listen(3000);

// ###############################################################################
// Some helper functions called above
function my_database(filename) {
    // Conncect to db by opening filename, create filename if it does not exist:
    var db = new sqlite.Database(filename, (err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Connected to the phones database.');
    });
    // Create our phones table if it does not exist already:
    db.serialize(() => {
        db.run(`
        	CREATE TABLE IF NOT EXISTS phones
        	(id 	INTEGER PRIMARY KEY,
        	brand	CHAR(100) NOT NULL,
        	model 	CHAR(100) NOT NULL,
        	os 	CHAR(10) NOT NULL,
        	image 	CHAR(254) NOT NULL,
        	screensize INTEGER NOT NULL
        	)`);
        db.all(`select count(*) as count from phones`, function(err, result) {
            if (result[0].count == 1) {
                db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`, ["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);
                db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`, ["MyPhone", "22", "Android", "jpg", "5"]);
                console.log('Inserted dummy phone entry into empty database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
  }
