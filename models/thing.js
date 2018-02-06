var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var ThingSchema = new Schema(
  {
    name: {type:String},
    last_data: {type: Number},
    user: {type: Schema.ObjectId, ref: 'User', required: true}
  },
  {
    timestamps: true
  }
)

ThingSchema
.virtual('url')
.get(function () {
  return '/things/' + this._id;
});

module.exports = mongoose.model('Thing', ThingSchema);
