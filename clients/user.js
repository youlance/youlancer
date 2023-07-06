const { default: axios } = require("axios");
const ExpressError = require("../utils/ExpressError");


class User {
    #user_url;

    constructor(user_url) {
        this.#user_url = user_url;
    }

    async getUser(username) {
        const req_url = this.#user_url + '/user/' + username

        return await getHttp(req_url)
    }

    async createUser(data) {
        const req_url = this.#user_url + '/user'

        const res = await postHttp(req_url, data)
        if (res.status !== 200) {
            throw new ExpressError(JSON.stringify(res.data), res.status)
        }
    }

    async getFolloweesCount(username) {
        const req_url = this.#user_url + '/followees/count/' + username

        return await getHttp(req_url)
    }

    async getFollowersCount(username) {
        const req_url = this.#user_url + '/followers/count/' + username

        return await getHttp(req_url)
    }

    async follow(follower_id, followee_id) {
        const req_url = this.#user_url + '/follower';

        const res = await postHttp(req_url, {follower_id, followee_id})
        if (res.status !== 200) {
            throw new ExpressError(JSON.stringify(res.data), res.status)
        }
    }

    async unfollow(follower_id, followee_id) {
        const req_url = this.#user_url + '/follower';

        let res;
        try {
            res = await axios.delete(req_url, {
                data: {
                    followee_id,
                    follower_id
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

    async isFollowing(user_1, user_2) {
        const req_url = this.#user_url + '/followees'

        const follower_id = user_1
        const page_id = 1;
        const page_size = 1000000;

        console.log(follower_id, page_id, page_size)
        const res = await postHttp( req_url, {follower_id, page_id, page_size})
        if (res.status !== 200) {
            throw new ExpressError(JSON.stringify(res.data), res.status)
        }

        console.log(res.data)
        if (res.data.find(obj => obj.followee_id === user_2)) {
            return true;
        } else {
            false
        }

    }
}

module.exports = new User(process.env.NODE_CLIENT_USER)

async function getHttp(url, data) {
    try {
        const res = await axios.get(url)
        return res.data;
    } catch(e) {
        console.log(e)
        if (e.response.status === 404) {
            throw new ExpressError('User Not Found', 404)
        } else {
            throw new ExpressError('Server Communication Error', e.response.status)
        }
    }
}

async function postHttp(url, data) {
    try {
        const res = await axios.post(url, data)
        return res;
    } catch(e) {
        return e.response;
    }
}