const { Schema, model } = require('mongoose');

const recommendation= new Schema({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
  recommendations: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = model('Recommendation', recommendation);
