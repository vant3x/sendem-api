const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const linkSchema = new Schema({
    url: {
        type: String,
        required: true
    }, 
    fileName: {
        type: String,
        required: true
    },
    originalName: {
        type: String,
        required: true
    },
    downloadLimit: {
        type: Number,
        default: 10
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    password: {
        type: String,
        default: null
    },
    folder : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folder',
        default: null,
        required: false
    },
    created_at:{
        type: Date,
        default: Date.now()
    },
    expiredDate: {
        type: Date,
        default: null
    }
});

module.exports = mongoose.model('Link', linkSchema);