const express = require("express")
const router = express.Router()
const fs = require('fs');
const User = require("../models/User")
const Progress = require("../models/Progress")
const HighlightedVerse = require("../models/HighlightedVerse")
const {checkLoginByUsername} = require('../utils/checkLogin');



router.get("/:book/:chapter/:verse?", (req, res) => {
   
    var conventions = JSON.parse(fs.readFileSync('./bibleJSON/conventions/conventions.json', "utf-8"))

    var book = req.params.book
    
    var chapterNo = Number(req.params.chapter)
    var verseNo = Number(req.params.verse)
    try {
        var bookObj = JSON.parse(fs.readFileSync(`./bibleJSON/`+(Number(book) ? conventions[book]: book) +`.json`, 'utf8'));
    } catch (error) {
        res.status(500).send("not found")
        return
    }
    
    var maxChapterNo = bookObj.noOfChapters
    if(chapterNo > maxChapterNo){
        res.status(500).send("not found")
        return
    }

    var chapterObj = bookObj.chapters[chapterNo - 1]
    if(!verseNo){
        res.status(200).json(chapterObj)
        return
    }

    var maxVersesNo = bookObj.chapters[chapterNo - 1].noOfVerses 
    if(verseNo > maxVersesNo){
        res.status(500).send("not found")
        return
    }

    res.status(200).json(chapterObj.verses[verseNo - 1])
})

router.post("/getUserProgress", async (req, res) => {
    var username = req.body.username
    var email =  req.body.email
    var book = req.body.book
    
    try{
        var user = await checkLoginByUsername(email, username)
        if(!user){
            res.status(500).json("not loged in")
            return 
        }
        if(!book){
            var progress = await Progress.where("username").equals(username)
        }else{
            var progress = await Progress.where("username").equals(username).where("book").equals(book).limit(1)
        }
        res.status(200).json(progress)

    }catch(e){
        res.status(500).json(e)
    }
})

router.post("/setUserProgress", async (req, res) => {
    var reverseConventions = JSON.parse(fs.readFileSync('./bibleJSON/conventions/reverseConventions.json', "utf-8"))
    var book = req.body.book
    var bookObj = JSON.parse(fs.readFileSync(`./bibleJSON/`+(book) +`.json`, 'utf8'));
    var username = req.body.username
    var email = req.body.email
    var chapter = req.body.chapter
    var verse = req.body.verse

    chapter > totalNoOfChapters ? chapter = totalNoOfChapters : console.log("")
    var totalNoOfChapters = bookObj.noOfChapters
    var totalNoOfVerses = 0
    var chapterSpecificProgress = {}
    for (let index = 1; index <= totalNoOfChapters; index++) {
        chapterSpecificProgress[index.toString()] = 0;
        totalNoOfVerses += bookObj["chapters"][index-1]["noOfVerses"]
    }
    //verse > bookObj["chapters"][chapter]["noOfVerses"] ? verse = bookObj["chapters"][chapter]["noOfVerses"] : console.log("")

    try{
        var user = await checkLoginByUsername(email, username)

        if(!user){
            res.status(500).json("not loged in")
            return 
        }

        var savedProgress =  await Progress.where("username").equals(username).where("book").equals(book).limit(1)

        if(savedProgress.length === 0){
            var percentage = Math.floor((verse / totalNoOfVerses)* 100) 
            chapterSpecificProgress[chapter.toString()] = verse
            var progress = new Progress({
                username: username,
                book: book,
                doneChapters: chapterSpecificProgress,
                bookNo: reverseConventions[book],
                percentage: percentage,
                totalNoOfChapters: totalNoOfChapters,
                totalNoOfVerses: totalNoOfVerses,
                readNoOfVerses: verse,
                mostRecentChapter: chapter
            })
            progress = await progress.save()
            res.status(200).json(progress)
        }else{
            chapterSpecificProgress = savedProgress[0].doneChapters
            chapterSpecificProgress[chapter.toString()] = verse
            var readNoOfVerses = 0
            var mostRecentChapter = 0
            for (let index = 1; index <= totalNoOfChapters; index++) {
                readNoOfVerses += chapterSpecificProgress[index.toString()]
                if(chapterSpecificProgress[index.toString()] > 0){
                    mostRecentChapter = index
                }
            }
            
            var percentage = Math.floor((readNoOfVerses / totalNoOfVerses)* 100) 
            await savedProgress[0].update({doneChapters: chapterSpecificProgress, readNoOfVerses: readNoOfVerses, mostRecentChapter: mostRecentChapter, percentage: percentage})
            res.status(200).json(savedProgress[0])
        }
        
    }catch(e){
        res.status(500).json(e)
    }
})

router.post("/highlightVerse", async (req, res) => {
    var book = req.body.book
    var chapter = req.body.chapter
    var verse = req.body.verse
    var username = req.body.username
    var email = req.body.email
    var note = req.body.note
    var verseData = req.body.verseData
    var verseTitle = req.body.verseTitle

    try{
        var user = await checkLoginByUsername(email, username)
        var highlightedVerse = await HighlightedVerse.findOne({username: username, email: email, verse: verse, book: book, chapter: chapter})
        if(highlightedVerse){
            await HighlightedVerse.deleteOne({username: username, email: email, verse: verse, book: book, chapter: chapter})
        }
        if(!user){
            res.status(500).json("not logged in")
            return 
        }

        var highlightVerse = new HighlightedVerse({
            book: book,
            chapter: chapter,
            verse: verse,
            username: username,
            email: email,
            note: note,
            verseData: verseData,
            verseTitle: verseTitle,
            likes: 0
        })
        
        highlightVerse = await highlightVerse.save()
        res.status(200).json(highlightVerse)
    }catch(e){
        res.status(500).json(e.toString())
    }

})

router.post("/removeHighlightVerse", async (req, res) => {
    var book = req.body.book
    var chapter = req.body.chapter
    var verse = req.body.verse
    var username = req.body.username
    var email = req.body.email

    try{
        var user = await checkLoginByUsername(email, username)

        if(!user){
            res.status(500).json("not logged in")
            return 
        }

        await HighlightedVerse.deleteOne({username: username, email: email, verse: verse, book: book, chapter: chapter})
        
        res.status(200).json("highlight deleted successfully")
    }catch(e){
        res.status(500).json(e.toString())
    }

})

router.post("/getHighlightedVerses", async (req, res) => {
    var book = req.body.book
    var chapter = req.body.chapter
    var username = req.body.username
    var email = req.body.email
    var verse = req.body.verse
    var limit  = req.body.limit

    try {
        var user = await checkLoginByUsername(email, username)
        if(!user){
            console.log(user)
            res.status(500).json("not logged in")
            return 
        }

        if(verse){
            var highlightedVerses = await HighlightedVerse.findOne({username: username, email: email, book: book, chapter: chapter, verse: verse})
            res.status(200).json(highlightedVerses)
        }

        if(!verse && book && chapter){
            var highlightedVerses = await HighlightedVerse.find({username: username, email: email, book: book, chapter: chapter})
            res.status(200).json(highlightedVerses)
        }

        if(!chapter && book){
            var highlightedVerses = await HighlightedVerse.find({username: username, email: email, book: book}).limit(limit).sort({date: 'desc'})
            res.status(200).json(highlightedVerses)
        }
        if(!chapter && !book){ 
            var highlightedVerses = await HighlightedVerse.find({username: username, email: email}).limit(limit).sort({date: 'desc'})
            res.status(200).json(highlightedVerses)
        }


    } catch (e) {
        console.log(e)
        res.status(500).json(e.toString())
    }
})

router.post("/addLikeToHighlightedVerse", async (req, res) => {
    var username = req.body.username
    var email = req.body.email
    var id = req.body.id
    
    try {
        var user = await checkLoginByUsername(email, username)
        if(!user){
            console.log(user)
            res.status(500).json("not logged in")
            return 
        }
        var highlight = await HighlightedVerse.findByIdAndUpdate(id, {$inc: {"likes": 1}})
        res.status(200).json(highlight)
    } catch (error) {
        res.status(500).json(error)
    }
})


module.exports = router