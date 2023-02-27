const mongoose = require("mongoose")


const HighlightedVerseSchema = mongoose.Schema({
    book: {
        type: String,
        required: true,
    },
    chapter: {
        type: Number,
        required: true
    },
    verse: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true    
    },
    note: {
        type: String,
        required: false
    },
    likes:{
        type: Number,
        required: false
    },
    verseData: {
        type: String,
        required: true   
    },
    verseTitle:{
        type: String,
        required: true   
    }


}, {timestamps: true})

module.exports = mongoose.model("HighlightedVerse", HighlightedVerseSchema)