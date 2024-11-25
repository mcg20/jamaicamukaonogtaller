const mongoose = require('mongoose');

const MembersSchema = new mongoose.Schema({
    memId: {
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Admin", "Staff", "Member"]
    },
    date:{
        type: Date,
        default: Date.now
    }   

})

const MembersModel = mongoose.model('members', MembersSchema);

module.exports = MembersModel;