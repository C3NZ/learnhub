const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    description: {
        type: String,
    },
    accountType: {
        type: String,
    },
    createdAt: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    }
});

userSchema.pre('save', function(next) {
    const user = this;
    const now = new Date();

    user.updatedAt = now;

    if (!user.createdAt) {
        user.createdAt = now;
    }

    // check to see if the user has modified the password field, if so
    // encrypt their new password
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, (error, hash) => {
                if (err) return next(err);

                user.password = hash;
                return next();
            });
        });
    } else {
        return next();
    }
});


// Function attached to the user schema to compare passwords entered via
// logging in, comparing the password entered against the encrypted one
// stored within the database
userSchema.methods.comparePassword = function(password, done) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        return done(err, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
