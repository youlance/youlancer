const { default: axios } = require("axios");
const ExpressError = require("../utils/ExpressError");


class Poster {

    constructor(poster_url) {
        this.poster_url = poster_url;
    }

    async get(post_id) {
        const req_url = this.poster_url + '/post/' + post_id

        const res = await getHttp(req_url)

        if (res.status === 200) {
            res.data.url = this.poster_url
            return res.data;
        } else if (res.status === 404) {
            throw new ExpressError('Post Not Found', 404)
        } else {
            throw new ExpressError('Server Communication Error', res.status)
        }
    }

    async delete(post_id) {
        const req_url = this.poster_url + '/posts'


        let res;
        try {
            res = await axios.delete(req_url, {
                data: {
                    id: post_id
                }
            })
        } catch(e) {
            res = e.response
        }


        if (res.status !== 200) {
            throw new ExpressError(JSON.stringify(res.data), res.status)
        }
        return true;
    }

    async getPosts(username) {
        const req_url = this.poster_url + '/posts/' + username


        const res = await getHttp(req_url);

        if (res.status === 200) {
            res.data.posts.url = this.poster_url
            return res.data.posts;
        } else if (res.status === 404) {
            throw new ExpressError('User Not Found', 404)
        } else {
            throw new ExpressError('Server Communication Error', res.status)
        }

    }
}

module.exports = new Poster(process.env.NODE_CLIENT_POST)

async function getHttp(url) {
    try {
        const res = await axios.get(url)
        return res;
    } catch(e) {
        console.log(e)
        return { response: e.response, status: e.response.status }
    }
}