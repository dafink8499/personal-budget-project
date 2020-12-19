const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const fs = require('fs');
const bodyParser = require('body-parser')

const jwt = require('jsonwebtoken')
const exjwt = require('express-jwt')
const path = require('path')

const mongoose = require("mongoose");
const myBudgetModel = require("./models/myBudget_schema");

let url = 'mongodb://localhost:27017/mybudgetdata';

app.use('/', express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const secretKey = 'My super secret key';
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'fabio',
        password: '123'
    },
    {
        id: 2,
        username: 'dfink7',
        password: '777'
    }
];

/*
'#ffcd56',
'#ff6384',
'#36a2eb',
'#fd6b19',
'#a05d56',
'#d0743c',
'#ff8c00'*/

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    for (let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: 180 });
            res.json({
                success: true,
                err: null,
                token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'Username or Password is incorrect'
            });
        }
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/budget', (req, res) => {
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
            .then(() => {
                //console.log("Connected to the database")
                myBudgetModel.find({})
                            .then((data) => {
                                res.send(data)
                                mongoose.connection.close()
                            })
                            .catch((connectionError) => {
                                console.log(connectionError)
                            })
            })  
            .catch((connectionError) => {
                console.log(connectionError)
            })
});

app.post('/mybudget', (req, res) => {
    let newData = {
        "title": req.body.title,
        "budget": req.body.budget,
        "color": req.body.color
    };

    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
            .then(() => {
                console.log("Connected to the database")
                myBudgetModel.insertMany(newData)
                            .then((data) => {
                                res.send(data)
                                mongoose.connection.close()
                            })
                            .catch((connectionError) => {
                                console.log(connectionError)
                            })
            })  
            .catch((connectionError) => {
                console.log(connectionError)
            })
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});