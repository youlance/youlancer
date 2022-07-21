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

   const isFollowing = await User.isFollowing(res.locals.username, username)

   let posts = await Poster.getPosts(username)

    res.render('profiles', { profile, followees, followers, posts, isFollowing})
}))

router.get('/:username/edit', catchAsync(async (req, res) => {
    const { username } = req.params;

    const profile = await Profiler.getProfile(username)

    res.render('edit', {profile})
}))


router.delete('/follower', catchAsync(async (req ,res) => {
    const {username} = req.cookies;
    const {follower_id, followee_id} = req.body;
    console.log(followee_id)
    console.log(username)
    await User.unfollow(username, followee_id)
    res.redirect(`/profiles/${followee_id}`)
}))


router.post('/follower', catchAsync(async (req, res) => {
    const {username} = req.cookies;
    const {follower_id, followee_id} = req.body;
    console.log(req.body)
    await User.follow(username, followee_id)
    res.redirect(`/profiles/${followee_id}`)
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

router.get('/', (req, res) => {
    const {username} = req.query;
    
    if (!username) {
        return res.redirect(`/profiles/${req.cookies.username}`)
    }

    res.redirect(`/profiles/${username}`)
    
})


module.exports = router;