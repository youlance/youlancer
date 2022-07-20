const { default: axios } = require("axios");
const ExpressError = require("../utils/ExpressError");


class Auther {
    #auth_url;

    constructor(auth_url) {
        this.#auth_url = auth_url;
    }

    async loginUser(user_pass) {
        const req_url = this.#auth_url + '/login';
        const data = {username: user_pass.username, password: user_pass.password};

        const res = await postHttp(req_url, data)
        if (res.status === 200) {
            return res.data
        } else {
            throw new ExpressError(JSON.stringify(res.data), res.status)
        }
    }

    async verify(username, access_token) {
        const req_url = this.#auth_url + '/auth'

        const res = await postHttp(req_url, {username, access_token})
        if (res.status === 200) {
            return true;
        } else if (res.status === 401) {
            return false;
        } else {
            throw new ExpressError(JSON.stringify(res.data), res.status)
        }
    }
}

module.exports = new Auther('http://api.vftg.xyz:8081')

async function postHttp(url, data) {
    try {
        const res = await axios.post(url, data)
        return res;
    } catch(e) {
        return e.response;
    }
}
