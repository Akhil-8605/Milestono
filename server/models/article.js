const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  name: { type: String},
  paragraph: { type: String},
  seeMore: { type: String},
  tags: { type: String},
  updatedDate: { type: String},
  imageSrc: { type: String}
});

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
