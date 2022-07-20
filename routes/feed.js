const express = require('express');
const Feeder = require('../clients/feeder');
const Profiler = require('../clients/porfiler');
const Poster = require('../clients/poster');
const User = require('../clients/user');
const catchAsync = require('../utils/catchAsync');
const router = express.Router();



router.get('/', catchAsync(async (req, res) => {
    const { username = req.cookies.username, page = 1 } = req.body

    const posts = await Feeder.getLatestPosts(username, page);
    console.log(posts)
    const profilesMap = await collectProfiles(posts)

    res.render('feed', {posts, profilesMap})
}))

async function collectProfiles(posts) {
    const set = [];
    const profiles = {};
    for (let post of posts) {
        const username = post.username
        if (!set.includes(username)) {
            const profile = await Profiler.getProfile(username);
            profiles[username] = profile
            set.push(username)
        }
    }

    return profiles
}






module.exports = router