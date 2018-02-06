var mongoose = require('mongoose')

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    name: {type:String},
    email: {type: String}
  },
  {
    timestamps: true
  }
)

UserSchema
.virtual('url')
.get(function () {
  return '/users/' + this._id;
});

module.exports = mongoose.model('User', UserSchema);
