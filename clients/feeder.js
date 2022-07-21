const { default: axios } = require("axios");
const ExpressError = require("../utils/ExpressError");
const Poster = require("./poster");

class Feeder {
    #feeder_url;

    constructor(feeder_url) {
        this.#feeder_url = feeder_url;
    }

    async getLatestPosts(username, page) {
        try {
            console.log()
            const res = await axios.post(this.#feeder_url, {username, page})
            const posts = res.data.posts;
            posts.url = Poster.poster_url;
            return res.data.posts
        } catch (e) {
            const res = e.response;
            throw new ExpressError(res.data, res.status)
        }
    }

    
    
}

module.exports = new Feeder('http://api.vftg.xyz:5555/feed')