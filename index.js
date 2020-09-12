const env = require('dotenv').config();

const express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const cors = require('cors')
const path = require('path')
//const FileStore = require('session-file-store')(session)

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
    //store: new FileStore,
    secret: "randomSecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: {
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
    // console.log(req.session)
    // console.log(req.sessionStore.list((callbackVar) => {
    //     console.log(callbackVar)
    // }))
    // let sess_count = 0
    // console.log(FileStore.prototype.list(function session_count(a, len) {
    //     sess_count = len;
    //     console.log("Total active session count is " + sess_count);
    //     console.log("============");
    // })
    // )
    // let data = undefined;
    let data = req.sessionStore.all((a, b) => {
        if (a) {
            console.error(a)
        } else {
            console.log(b)

            let trueVal = Object.keys(b).map((cookieID) => {
                return {
                    "name": b[cookieID].name,
                    "t1": {
                        score: Object.keys(b[cookieID].t1_score).reduce((acc, value) => {
                            return acc + b[cookieID].t1_score[value]
                        }, 0),
                        time: b[cookieID].quizTimeObj["t1"].start - b[cookieID].quizTimeObj["t1"].end
                    },
                    "t2": {
                        score: Object.keys(b[cookieID].t2_score).reduce((acc, value) => {
                            return acc + b[cookieID].t3_score[value]
                        }, 0),
                        time: b[cookieID].quizTimeObj["t2"].start - b[cookieID].quizTimeObj["t2"].end
                    },
                    "t3": {
                        score: Object.keys(b[cookieID].t3_score).reduce((acc, value) => {
                            return acc + b[cookieID].t3_score[value]
                        }, 0),
                        time: b[cookieID].quizTimeObj["t3"].start - b[cookieID].quizTimeObj["t3"].end
                    }
                }
            })
            res.json(trueVal)
        }
    })
    // .map((value) => {
    //     return {
    //         "name": value.name,
    //         "scoreTime": value.quizTimeObj,
    //         "t1": value.t1_score.reduce((acc, value) => {
    //             return acc + value
    //         }, 0),
    //         "t2": value.t2_score.reduce((acc, value) => {
    //             return acc + value
    //         }, 0),
    //         "t3": value.t3_score.reduce((acc, value) => {
    //             return acc + value
    //         }, 0)
    //     }
    // })
})

const server = app.listen(port, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
})