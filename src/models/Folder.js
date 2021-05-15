const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    url: {
        type: String,
        required: false
    }, 
    folderName: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: false,
        default: 'root/'
    },
    subFolders: [
        {
            path: {
                type: String,
                default: 'root/',
                required: false
            },
            subPaths:{
                type: mongoose.Schema.Types.Array,
                required: false
            } ,

        }
    ],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    files: [
        {       
            _id: false,
            file: {
                type: Schema.Types.ObjectId,
                ref: 'Link'
            }
        },
    ],
    password: {
        type: String,
        default: null,
        required: false
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Folder', folderSchema);