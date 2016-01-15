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
    });
  },

  // getQuestionsForTag: function(req, res){
  //   var sqlQuery = 'Select '
  // },

  getTagsForPost: function(req, res){
    var sqlQuery = "Select Tags.id, Tags.name FROM user_question_tag JOIN \
                    Tags ON user_question_tag.tag_id = Tags.id \
                    WHERE user_question_tag.post_id = ?;";
    connection.query(sqlQuery, [req.params.id], function(err, results){
      console.log('running getTags for post and sending back: ', results)
      res.json(results);
    })
  },

  makeNewTagForPost: function(req, res){
    var tagName = req.body.tagName;
    var userId = req.body.userId;
    var postId = req.body.postId;
    var taggerType = 'student'; //by default is student, but can be teacher|machine

    //if tag is already in tags table, do normal insert
    // - use solr lookup perhaps to see if close approximations exist

    var checkIfTagExists = "Select Tags.id from Tags Where Tags.name = ? ;";
    connection.query(checkIfTagExists, [tagName], function(err, results){
      console.log('inside checkiftagexists: ', results)
      if (results.length === 0) {
        // insert new tag
        connection.query("insert into tags (name) Values (?);", [tagName], function(err, result){
          console.log('inserted new tag: ', result);
          // insert into table storing user_question_tag combos
          var insertUserQuestionTag = "insert into user_question_tag (user_id, post_id, tag_id, type) Values (?, ?, ?, ?);";
          connection.query(insertUserQuestionTag, [userId, postId, result.insertId, taggerType], 
            function(err, results){
              console.log('inserted new triple for user_question_tag')
              res.json(results);
          });
        })
      } else {
        // tag already exists, use its id to insert into user_question_tag
        var insertUserQuestionTag = "insert into user_question_tag (user_id, post_id, tag_id, type) Values (?, ?, ?, ?);";
        connection.query(insertUserQuestionTag, [userId, postId, results[0].id, taggerType], 
          function(err, results){
            console.log('inserted new triple for user_question_tag')
            res.json(results);
        });
      }
      
    })

    // var 

    // var sqlQuery = "Select Tags.id, Tags.name FROM user_question_tag JOIN \
    //                 Tags ON user_question_tag.tag_id = Tags.id \
    //                 WHERE user_question_tag.post_id = ?;";
    // connection.query(sqlQuery, [req.params.id], function(err, results){
    //   console.log('inserting new tag post combo: ', results)
    //   res.json(results);
    // })
  }

};
