var Sequelize = require('sequelize');

// var database = process.env.DATABASE || 'jmuspkeyvjzsvvwp';
// var dbUser = process.env.DBUSER || 'htmaaabw4pe3k9ja';
// var dbPass = process.env.DBPASS;
// var dbHost = process.env.DBHOST || 'jw0ch9vofhcajqg7.cbetxkdyhwsb.us-east-1.rds.amazonaws.com'
var mysql = require('mysql');


var connection = mysql.createConnection({
  user: "root",
  password: "",
  database: "townhall"
});

connection.connect();


var db = new Sequelize('townhall', 'root', '', {
  host: 'localhost'

});

var User = db.define('User', {
  username: Sequelize.STRING,
  name: Sequelize.STRING,
  name_last: Sequelize.STRING,
  name_first: Sequelize.STRING,
  isTeacher: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  email: Sequelize.STRING,
  picture: Sequelize.STRING
}, {
  timestamps: false
});

var Tag = db.define('Tag', {
  name: Sequelize.STRING
}, {
  timestamps: false
});

var Course = db.define('Course', {
  name: Sequelize.STRING
}, {
  timestamps: false
});

var Post = db.define('Post', {
  title: Sequelize.STRING,
  text: Sequelize.STRING,
  isAnAnswer: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  responses: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isAnswered: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isGood: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isClosed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  createdAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.fn('NOW')
  },
  updatedAt: Sequelize.DATE
});

var Like = db.define('Like', {
  }, {
    timestamps: false
});


var Follows = db.define('Follows', {
 }, { timestamps: false
});

Course.belongsToMany(User, {
  through: 'CourseUser'
});
User.belongsToMany(Course, {
  through: 'CourseUser'
});

User.hasMany(Post);
Post.belongsTo(User);
Tag.hasMany(Post);
Post.belongsTo(Tag);
Course.hasMany(Post);
Post.belongsTo(Course);
Post.hasMany(Post, {as: 'Responses', foreignKey: 'QuestionId'});

Post.belongsToMany(User, {as: 'Vote', through: 'Like'});
User.belongsToMany(Post, {through: 'Like'});

//User.belongsToMany(User, {as: 'follower', through: 'Follow'});
//User.hasMany(User, {foreignKey: 'follower', joinTableName: 'userFollow'} );
// User.hasMany(User, {as: 'Follows', joinTableName: 'userFollow'} );


//User.belongsToMany(User, {as: 'followed', through: 'Follows'});
User.belongsToMany(User, {as: 'follower', through: 'Follows'});


User.sync()
.then(function() {
  return Tag.sync();
})
.then(function() {
  return Course.sync();
})
.then(function() {
  return Post.sync();
})
.then(function() {
  return Like.sync();
})
.then(function() {
  return Follows.sync();
});

// create merge table for tags
var createTagJoinTable = "\
  CREATE TABLE IF NOT EXISTS user_question_tag (\
  user_id INT NOT NULL, \
  post_id INT NOT NULL, \
  tag_id INT NOT NULL, \
  type ENUM('student','teacher','machine') NOT NULL, \
  FOREIGN KEY (user_id) REFERENCES Users(id), \
  FOREIGN KEY (post_id) REFERENCES Posts(id), \
  FOREIGN KEY (tag_id) REFERENCES Tags(id) );";
connection.query(createTagJoinTable, function(err, results){
  console.log('created new table! :', results)
});

var createThemeTable = "\
  CREATE TABLE IF NOT EXISTS themes (\
  theme_id INT NOT NULL AUTO_INCREMENT, \
  title varchar(40) NOT NULL, \
  PRIMARY KEY (theme_id) );";
connection.query(createThemeTable, function(err, results){
  console.log('created new theme table! :', results);
});

var createTagThemeJoinTable = "\
  CREATE TABLE IF NOT EXISTS tag_theme (\
  theme_id INT NOT NULL, \
  tag_id INT NOT NULL, \
  FOREIGN KEY (theme_id) REFERENCES Themes(theme_id), \
  FOREIGN KEY (tag_id) REFERENCES Tags(id) );";
connection.query(createTagThemeJoinTable, function(err, results){
  console.log('created new tag_theme table! :', results)
});


exports.User = User;
exports.Course = Course;
exports.Tag = Tag;
exports.Post = Post;
exports.Follows = Follows;
