const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userschema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: {
    type: String,
    default:'default.jpg'
  },
  role: {
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    reuired: [true, 'Please provide your password'],
    minlenght: 8,
    select: false,
  },
  active:{
    type:Boolean,
    default:true,
    select:false
  }
});

userschema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});


userschema.pre(/^find/, function(next){
  this.find({active:{$ne:false}});
  next();
})

userschema.methods.correctpassword = async function (
  candidatepassword,
  userpassword
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};

const User = mongoose.model('User', userschema);

module.exports = User;
