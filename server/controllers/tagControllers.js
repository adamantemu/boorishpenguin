//var db = require('../db/index.js');

var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "townhall"
});

connection.connect();


module.exports = {
  allTags: function(req, res) {
    var sqlQuery = 'Select * from tags;';
    connection.query(sqlQuery, function(err, results){
      res.json(results);
    }),


    // db.Tag.findAll()
    // .then(function(tags) {
    //   var formmatedTags = tags.map(function(tag) {
    //     return {
    //       id: tag.id,
    //       name: tag.name
    //     };
    //   });

    //   tags = {};
    //   tags.results = formmatedTags;
    //   res.json(tags);
    // });
  },

  getQuestionsForTag: function(req, res){
    var sqlQuery = 'Select '
  }

};
