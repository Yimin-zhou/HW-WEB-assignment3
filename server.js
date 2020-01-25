


const sqlite = require('sqlite3').verbose();
let db = my_database('./phones.db');
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
            console.error(404);
            return res.json(err.message)
        }
        console.log('Table has been loaded');
        return res.json(rows)

    });
});

//post new phones
app.post('/phones', function(req, res, err) {
    if (err) {
      res.status(404).send("That didnt go as planned")
    }
    db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`, [req.body.brand, req.body.model, req.body.os, req.body.image, req.body.screensize]);
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
                    screensize=? WHERE id=?`, [req.body.brand, req.body.model, req.body.os, req.body.image, req.body.screensize, req.body.id], function(err){
    console.log('updated brand')
    if (err){
        res.status(404).send('<h1>that didnt work!</h1>');
    }
      res.set({
        'Content-Type': 'text/html',
        'Status' : 200,
        'Content-Length': '',
        'ETag': '12347'
        })
        console.log(res.status(200).send('<h1>This entry has been edited!</h1>'));
});
});

//delete row
app.delete('/delete', function(req, res) {
    var deletedItem = req.body[0].brand;

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


// Starting server on port 3000:

app.listen(3000);


// function initialising our database

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
            if (result[0].count == 0) {
                db.run(`INSERT INTO phones (brand, model, os, image, screensize) VALUES (?, ?, ?, ?, ?)`, ["Fairphone", "FP3", "Android", "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Fairphone_3_modules_on_display.jpg/320px-Fairphone_3_modules_on_display.jpg", "5.65"]);

                console.log('Inserted dummy phone entry into empty database');
            } else {
                console.log("Database already contains", result[0].count, " item(s) at startup.");
            }
        });
    });
    return db;
  }
