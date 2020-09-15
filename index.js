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
    "t2": JSON.parse(fs.readFileSync('./quiz/task2.json').toString()),
    "t3": JSON.parse(fs.readFileSync('./quiz/task3.json').toString())
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
            "score": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "t2": {
            "start": null,
            "end": null,
            "last": 0,
            "score": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        "t3": {
            "start": null,
            "end": null,
            "last": 0,
            "score": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    }

    res.end("done")
})

app.post('/startTimer/:time/:quiz', (req, res) => {
    let quiz = req.params.quiz
    let time = req.params.time
    let sess = req.session

    let quizObj = sess.quizTimeObj
    if (sess.quizTimeObj[quiz].start !== null) {
        res.json({
            "redirectTo": sess.quizTimeObj[quiz].last,
            "startTime": sess.quizTimeObj[quiz].start
        })
    } else {
        quizObj[quiz].start = time
        res.json({
            "redirectTo": sess.quizTimeObj[quiz].last, // should be last item, defaults to 0
            "startTime": time
        })
    }
})

app.get('/isUserRegistered', (req, res) => {//cors(),
    if (req.session.name !== null && req.session.name !== undefined) {
        res.json({
            'reg': true,
            "user": req.session.name
        })
    } else {
        res.json({
            "reg": false,
            "user": req.session.name
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
    req.session.quizTimeObj[req.params.quiz].last = files[req.params.quiz].maxCount
    res.end()
})

app.post('/getQuestion/:quiz/:number/:prevTruth?', jsonParser, (req, res) => {

    let currentQuiz = files[req.params.quiz]

    console.log("In /getQuestions")
    console.log(req.params)
    console.log(req.body)

    if (req.params.prevTruth && req.params.prevTruth === 'true') {
        req.session.quizTimeObj[req.params.quiz].score[req.params.number - 1] = 1
        req.session.quizTimeObj[req.params.quiz].last = req.params.number
    } else if (req.params.prevTruth && req.params.prevTruth === 'false') {
        req.session.quizTimeObj[req.params.quiz].score[req.params.number - 1] = 0
        req.session.quizTimeObj[req.params.quiz].last = req.params.number
    }

    res.json({
        "questions": currentQuiz.questions[req.body.back ? req.params.number - 2 : req.params.number],
        "maxCount": currentQuiz.questionCount,
        "notice": currentQuiz.notice
    })
}
)

app.get('/listOfQuizzes', (req, res) => {
    let items = Object.keys(files).map((key) => {
        return files[key].file
    })
    res.json(Object.keys(files).map((key, index) => {
        return { "key": key, "name": files[key].file }
    }))
})

app.get('/scores', (req, res) => {
    let sessStore = req.sessionStore
    let sessCurr = req.session
    req.sessionStore.list((a, b) => {
        if (a) {
            console.error(a)
        } else {
            let trueVal = []
            b.forEach((cookieID, index) => {
                sessStore.get(cookieID.split('.')[0], (err, sess) => {
                    if (err) {
                        console.log(err)
                    } else {
                        try {
                            trueVal.push({
                                "name": sess.name,
                                "t1": {
                                    score: sess.quizTimeObj["t1"].score.reduce(reduceAdd),
                                    time: (sess.quizTimeObj["t1"].end ? (new Date()).getTime() : sess.quizTimeObj["t1"].end) - sess.quizTimeObj["t1"].start
                                },
                                "t2": {
                                    score: sess.quizTimeObj["t2"].score.reduce(reduceAdd),
                                    time: (sess.quizTimeObj["t2"].end ? (new Date()).getTime() : sess.quizTimeObj["t2"].end) - sess.quizTimeObj["t2"].start
                                },
                                "t3": {
                                    score: sess.quizTimeObj["t3"].score.reduce(reduceAdd),
                                    time: (sess.quizTimeObj["t3"].end ? (new Date()).getTime() : sess.quizTimeObj["t3"].end) - sess.quizTimeObj["t3"].start
                                }
                            })
                        } catch (Error) {
                            console.log(err)
                        }
                    }
                    if ((index + 1) === b.length) {
                        let t1_scores_sorted = trueVal.sort((person_a, person_b) => comparator(person_a, person_b, "t1")).slice(0, Math.max(10, trueVal.length))
                        let t2_scores_sorted = trueVal.sort((person_a, person_b) => comparator(person_a, person_b, "t2")).slice(0, Math.max(10, trueVal.length))
                        let t3_scores_sorted = trueVal.sort((person_a, person_b) => comparator(person_a, person_b, "t3")).slice(0, Math.max(10, trueVal.length))
                        let selfTime = {
                            "name": sessCurr.quizTimeObj.name,
                            "t1": {
                                "time": (sessCurr.quizTimeObj["t1"].end ? (new Date()).getTime() : sessCurr.quizTimeObj["t1"].end) - sessCurr.quizTimeObj["t1"].start,
                                "score": sessCurr.quizTimeObj["t1"].score.reduce(reduceAdd)
                            },
                            "t2": {
                                "time": (sessCurr.quizTimeObj["t2"].end ? (new Date()).getTime() : sessCurr.quizTimeObj["t2"].end) - sessCurr.quizTimeObj["t2"].start,
                                "score": sessCurr.quizTimeObj["t2"].score.reduce(reduceAdd)
                            },
                            "t3": {
                                "time": (sessCurr.quizTimeObj["t3"].end ? (new Date()).getTime() : sessCurr.quizTimeObj["t3"].end) - sessCurr.quizTimeObj["t3"].start,
                                "score": sessCurr.quizTimeObj["t3"].score.reduce(reduceAdd)
                            }
                        }
                        res.json({
                            "t1": t1_scores_sorted,
                            "t2": t2_scores_sorted,
                            "t3": t3_scores_sorted,
                            "self": selfTime

                        })
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



/**
 * HELPER FUNCTIONS
 */

let comparator = (person_a, person_b, field) => {
    if (person_a['field'].score > person_b[field].score) {
        return -1
    } else if (person_a[field].score < person_b[field].score) {
        return +1
    } else {
        if (person_a[field].time < person_b[field].time) {
            return -1
        } else if (person_a[field].time > person_b[field].time) {
            return +1
        } else {
            return 0
        }
    }
}

let reduceAdd = (acc, curr) => {
    return acc + curr
}