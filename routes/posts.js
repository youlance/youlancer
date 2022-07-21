const express = require('express');
const Profiler = require('../clients/porfiler');
const Poster = require('../clients/poster');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

router.get('/new', catchAsync(async (req, res) => {
    const { username } = req.cookies
    const profile = await Profiler.getProfile(username)
    res.render('new', {profile, post_url: Poster.poster_url})
}))

router.get('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;

    const post = await Poster.get(id);
    const profile = await Profiler.getProfile(post.username)

    res.render('post', {post, profile})
}))

router.post('/', catchAsync(async (req, res) => {
    res.send(req.body)
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const {id} = req.params;
    const {username} = req.cookies;

    const post = await Poster.get(id)

    console.log(post.username)
    console.log(username)
    if (post.username !== username) {
        return res.send("Unauthorized Operation").status(403)
    }

    const del = await Poster.delete(id)

    res.redirect(`/profiles/${req.cookies.username}`)
}))


module.exports = router