// var db = require('../db/index.js');

var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "townhall"
});

connection.connect();


//var Sequelize = require('sequelize'); //FUCK SEQUELIZE

module.exports = {
  allFriendships: function(req, res) {
    var get = "SELECT * FROM users AS follower JOIN follows ON follower.id = follows.followerId JOIN users AS followed ON follows.userId = followed.id;";
    
    connection.query(get, function(err, results){
      res.send(results);
    })
  },

getFriends: function(req, res){
  var fid = req.params.id;

  var get = "SELECT * FROM users AS follower JOIN follows ON follower.id = follows.followerId JOIN users AS followed ON follows.userId = followed.id WHERE follower.id = ?;";

  connection.query(get, [fid], function(err, results){
    console.log(results);
    res.send(results);
  })
},

addFriendship: function(req, res){
  var follower = req.body.follower;
  var followed = req.body.followed;

  var makeNew = "insert into follows (UserId, followerId) Values (?, ?);";

  connection.query(makeNew, [followed, follower], function(err, result){
    console.log(result);
    res.json(result);
  })
}


};