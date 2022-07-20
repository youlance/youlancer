const express = require('express');
const Profiler = require('../clients/porfiler');
const Poster = require('../clients/poster');
const User = require('../clients/user');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')



router.get('/:username/temp', catchAsync(async (req, res) => {
   const { username } = req.params;

   const profile = await Profiler.getProfile(username)

   const followers = (await User.getFollowersCount(username)).count
   const followees = (await User.getFolloweesCount(username)).count

   let posts = await Poster.getPosts(username)

    res.render('profiles_temp', { profile, followees, followers, posts})
}))

router.get('/:username', catchAsync(async (req, res) => {
   const { username } = req.params;

   const profile = await Profiler.getProfile(username)

   const followers = (await User.getFollowersCount(username)).count
   const followees = (await User.getFolloweesCount(username)).count

   let posts = await Poster.getPosts(username)

    res.render('profiles', { profile, followees, followers, posts})
}))

router.get('/:username/edit', catchAsync(async (req, res) => {
    const { username } = req.params;

    const profile = await Profiler.getProfile(username)

    res.render('edit', {profile})
}))

router.post('/follower', catchAsync(async (req, res) => {
    const {username} = req.cookies;
    const {follower, followee} = req.body;
    console.log(req.body)
    await User.follow(follower, followee)
    res.redirect(`/profiles/${username}`)
}))

router.put('/:username', catchAsync(async (req, res) => {
    const auth_username = req.cookies.username;
    const { username } = req.params;

    if (auth_username !== username) {
        res.status(403)
        return res.redirect(`/profile/${username}`)
    }

    Profiler.updateProfile(username, req.body)
    res.redirect(`/profiles/${username}`)
}))


module.exports = router;