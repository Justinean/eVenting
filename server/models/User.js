const bcrypt = require('bcrypt');
const {Schema, model} = require("mongoose");

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: false,
            caseSensitive: false
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Must use a valid email address'],
            caseSensitive: false
        },
        password: {
            type: String,
            required: true,
        },
        id: {
            type: String,
        }
    },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

// Hashes user password.
userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
        if (this.id.length < 4) {
            this.id = this.id.padStart(4, "1");
        }
    }

    next();
});

// Custom method to compare and validate password for logging in.
userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;