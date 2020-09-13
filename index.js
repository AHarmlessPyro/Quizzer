const env = require('dotenv').config();

const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
const FileStore = require('session-file-store')(session)

const files = {
    "t1": JSON.parse(fs.readFileSync('./quiz/task1.json').toString()),
    "t2": JSON.parse(fs.readFileSync('./quiz/task2.json').toString())
}
const port = process.env.PORT || 3000

const app = express()
app.use(cors())

app.use(express.static(path.join(__dirname, 'build')))

const jsonParser = bodyParser.json();

app.set('trust proxy', 1)

app.use(session({
    store: new FileStore,
    secret: "randomSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 14400000,
        secure: true,
        sameSite: 'none'
    }
}))

app.options(true, cors())

console.log(process.env.SRC_URL)

let allow_origin_header = process.env.SRC_URL

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", allow_origin_header); // update to match the domain you will make the request from //,127.0.0.1,127.0.0.1:3001,127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3000,http://127.0.0.1
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true")
    next();
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

app.post('/registerUser/:username', (req, res) => {//cors(),
    let sess = req.session
    sess.name = req.params.username
    sess.quizTimeObj = {
        "t1": {
            "start": null,
            "end": null,
            "last": 0,
            "score": 0
        },
        "t2": {
            "start": null,
            "end": null,
            "last": 0,
            "score": 0
        },
        "t3": {
            "start": null,
            "end": null,
            "last": 0,
            "score": 0
        }
    }
    sess.t1_score = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
    }

    sess.t2_score = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
    }

    sess.t3_score = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0
    }
    console.log(req.session)
    res.end("done")
})

app.post('/startTimer/:time/:quiz', (req, res) => {
    let quiz = req.params.quiz
    let time = req.params.time
    let sess = req.session

    let quizObj = sess.quizTimeObj
    if (sess.quizTimeObj[quiz].last !== 0) {
        res.json({
            "redirectTo": sess.quizTimeObj[quiz].last,
            "startTime": sess.quizTimeObj[quiz].start
        })
    } else {
        quizObj[quiz].start = time
        res.json({
            "redirectTo": 0,
            "startTime": time
        })
    }
})

app.get('/isUserRegistered', (req, res) => {//cors(),
    if (req.session.name !== null && req.session.name !== undefined) {
        res.json({
            'reg': true
        })
    } else {
        res.json({
            "reg": false
        })
    }
})

app.get('/getTimer', (req, res) => {
    if (req.session.name !== null && req.session.name !== undefined) {
        res.send({
            startTimer: req.session.startTime
        })
    } else {
        res.send({
            startTimer: null
        })
    }
})

app.post('/endTimer/:time/:quiz', jsonParser, (req, res) => {
    req.session.quizTimeObj[req.params.quiz].end = req.params.time
    res.end()
})

app.get('/getQuestion/:quiz/:number/:prevTruth?', (req, res) => {

    let currentQuiz = files[req.params.quiz]

    if (req.params.prevTruth && req.params.prevTruth === 'true') {
        req.session.quizTimeObj[req.params.quiz].score += 1
    }
    req.session.quizTimeObj[req.params.quiz].last = req.params.number

    res.json({
        "questions": currentQuiz.questions[req.params.number],
        "maxCount": currentQuiz.questionCount,
        "notice": currentQuiz.notice
    })
}
)

app.get('/listOfQuizzes', (req, res) => {
    let items = Object.keys(files).map((key) => {
        return files[key].file
    })
    console.log(files)
    res.json(Object.keys(files).map((key, index) => {
        return { "key": key, "name": files[key].file }
    }))
})

app.get('/scores', (req, res) => {
    let sessStore = req.sessionStore;
    req.sessionStore.list((a, b) => {
        if (a) {
            console.error(a)
        } else {
            console.log(b)
            console.log(sessStore)
            let trueVal = []
            b.forEach((cookieID) => {
                let nonExistentSessions = 0
                console.log(cookieID.split('.')[0])
                sessStore.get(cookieID.split('.')[0], (err, sess) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(sess)
                        try {
                            trueVal.push({
                                "name": sess.name,
                                "t1": {
                                    score: sess.quizTimeObj["t1"].score,
                                    time: sess.quizTimeObj["t1"].start - sess.quizTimeObj["t1"].end
                                },
                                "t2": {
                                    score: sess.quizTimeObj["t2"].score,
                                    time: sess.quizTimeObj["t2"].start - sess.quizTimeObj["t2"].end
                                },
                                "t3": {
                                    score: sess.quizTimeObj["t3"].score,
                                    time: sess.quizTimeObj["t3"].start - sess.quizTimeObj["t3"].end
                                }
                            })
                        } catch (Error) {
                            nonExistentSessions++
                        }
                    }

                    if ((trueVal.length + nonExistentSessions) === b.length) {
                        console.log(trueVal)
                        res.json(trueVal)
                    }
                })
            })
        }
    })
})

const server = app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
})