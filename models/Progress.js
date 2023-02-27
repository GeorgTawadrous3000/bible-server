const mongoose = require("mongoose")


const ProgressSchema = mongoose.Schema({
    book: {
        type: String,
        required: true,
    },
    doneChapters:{
        type: Object,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    bookNo:{
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    totalNoOfChapters: {
        type: Number,
        required: true
    },
    totalNoOfVerses: {
        type: Number,
        required: true
    },
    readNoOfVerses: {
        type: Number,
        required: true
    },
    mostRecentChapter:{
        type: Number,
        required: true
    }

}, {timestamps: true})

module.exports = mongoose.model("Progress", ProgressSchema)