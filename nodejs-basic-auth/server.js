const path = require('node:path')
const fs = require('node:fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const jwtMiddleware = require('./middleware/jwtMiddleware')
require('dotenv').config()

const PORT = process.env.PORT
const usersFilePathname = path.resolve(__dirname, 'data', 'users.json')

app.use(cors())
app.use(bodyParser.json())

const getDataFromFile = (filename) => {
    try {
        return JSON.parse(fs.readFileSync(filename, 'utf-8'))
    }catch (err) {
        return null
    }
}

const setDataToFile = (filename, data) => {
    return fs.writeFileSync(filename, JSON.stringify(data, null, 2))
}

const checkAvailability = (login) => {
    const users = getDataFromFile(usersFilePathname)

    for(let i = 0; i < users.length; i++) {
        if(login === users[i].login) {
            return false
            
        }
    }
    return true
}

const getUser = (login) => {
    const users = getDataFromFile(usersFilePathname)

    const result = users.some(user => user.login === login)

    if(result) {
        return true
    }

    return false
}

const validateRegister = (req, res, next) => {
    const user = req.body
    const {login, password} = user

    if(!login.trim() || !password.trim()) {
        return res.status(400).json({message: 'please fill all properites'})
    }

    if(login.length < 3) {
        return res.status(400).json({message: 'login must be more than three characters'})
    }

    if(password.length < 6) {
       return res.status(400).json({message: 'password must be more than six characters'})
    }

    if(!checkAvailability(login)) {
        return res.status(400).json({message: 'this login is already taken'})
    }

    next()
}

const validateLogin = async (req, res, next) => {
    const users = getDataFromFile(usersFilePathname)
    const user = req.body
    const {login, password} = user

    if(!login.trim() || !password.trim()) {
        return res.status(400).json({message: 'please fill all properites'})
    }

    if(login.length < 3) {
        return res.status(400).json({message: 'login must be more than three characters'})
    }

    if(password.length < 6) {
       return res.status(400).json({message: 'password must be more than six characters'})
    }

    const newUser = users.find(client => client.login == user.login)

    if(!getUser(login, password)) {
        return res.status(400).json({message: 'Wrong credentials'})
    }

    const checkPass = await bcrypt.compare(password, newUser.password)
        
    if(!checkPass) {
        return res.status(400).json({message: 'Wrong credentials'})
    }

    req.user = {id: newUser.id, login: login}

    next()
}


app.post('/register', validateRegister, async (req, res) => {
    const users = getDataFromFile(usersFilePathname)
    let user = req.body

    const newPassword = await bcrypt.hash(user.password, 10)

    user = {
        ...user,
        password: newPassword,
        id: Date.now()
    }

    users.push(user)
    setDataToFile(usersFilePathname, users)

    res.status(201).json({message: 'registration was successful'})
})

app.post('/login', validateLogin, (req, res) => {
    const user = req.user

    const token = jwt.sign(
        {
            id: user.id,
            login: user.login
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '1h'
        }
    )

    res.status(201).json({token})
})

app.get('/secure', jwtMiddleware, (req, res) => {
    const user = req.user
    const {id, login} = user

    res.status(200).json({id, login})
})

app.listen(PORT, () => {
    console.log('server is runing...')
})