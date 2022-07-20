const express = require('express')
const ejsMate = require('ejs-mate')
const morgan = require('morgan')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const path = require('path')


const app = express()


const profilesRoute = require('./routes/profiles')
const postsRoute = require('./routes/posts')
const feedRoute = require('./routes/feed')

const { urlencoded } = require('express')
const catchAsync = require('./utils/catchAsync')
const { default: axios } = require('axios')
const ExpressError = require('./utils/ExpressError')
const Auther = require('./clients/auther')
const User = require('./clients/user')
const Porfiler = require('./clients/porfiler')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(morgan('tiny'))
app.use(methodOverride('_method'))
app.use(cookieParser())
app.use(express.static('public'))

app.locals.url = "http://vftg.xyz:3000";

// Auth Middleware
const Authenticate = catchAsync(async (req, res, next) => {
    const {username, access_token} = req.cookies
    if (!username || !access_token) {
        console.log('cookies not available')
        return res.redirect('/login')
    }

    if (await Auther.verify(username, access_token)) {
        res.locals.username = username;
        next()
    } else {
        res.redirect('/login')
    }
})


app.get('/', (req, res) => {
    res.redirect(`/feed`)
})

app.use('/profiles', Authenticate, profilesRoute)
app.use('/posts', Authenticate, postsRoute)
app.use('/feed', Authenticate, feedRoute)

app.get('/temp', Authenticate, (req, res) => {
    res.render('temp')
})

app.get('/logout', (req, res) => {
    res.clearCookie('username')
    res.clearCookie('access_token')
    res.redirect('/login')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', catchAsync(async (req ,res) => {
    const auth = await Auther.loginUser(req.body)

    res.cookie('access_token', auth.access_token)
    res.cookie('username', auth.username)
    res.redirect(`/profiles/${auth.username}`)
}))

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', catchAsync(async (req, res) => {
    await User.createUser(req.body)

    const auth = await Auther.loginUser(req.body)
    res.cookie('access_token', auth.access_token)
    res.cookie('username', auth.username)

    await Porfiler.createProfile(req.body)

    res.redirect(`/profiles/${req.body.username}/edit`)
}))


app.listen(3000, () => {
    console.log('SERVING ON PORT 3000')
})