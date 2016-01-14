var db = require('../db/index.js');

module.exports = {
  allFriendships: function(req, res) {
    db.Follows.findAll()
    .then(function(relationships){
      console.log(relationships);

      var formattedRelationships = relationships.map(function(rel) {
        return {
          id: rel.id,
          name: rel.name
        };
      });

      rels = {};
      rels.results = formattedRelationships;
      res.json()
    });
  },

getFriends: function(req, res){
  var fid = req.params.id;

  db.Follows.findAll(
    {
      where: {followerId: fid},
      include: [{model: db.User, as: 'follower'}]
    })
  .then(function(relations){

    res.json(relations);
  })
}


};