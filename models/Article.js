const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true
    },

    summary: {
      type: String,
      require: true
    },

    body: {
      type: String,
      require: true
    },

    slug: {
      type: String,
      require: true
    },
    
    // Additional schema information to fit my existing article page layout

    coverImgPath: {
      type: String,
      require: true
    },

    seriesInfo: {
      length: {
        type: String,
        required: true
      },
      genre: {
        type: String,
        require: true
      },
      publisher: {
        type: String,
        require: true
      },
      copyright: {
        type: String,
        require: false
      }
    },

    metadata: {
      author: {
        type: String,
        require: true
      },
      pubDate: {
        type: String,
        require: true
      }
    }
  }
);

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;