const { default: axios } = require("axios");
const ExpressError = require("../utils/ExpressError");

class Profiler {
    #service_url;

    constructor(service_url) {
        this.#service_url = service_url;
    }

    async getProfile(username) {
        const req_url = this.#service_url + '/profiles/' + username;

        try {
            const res = await axios.get(req_url)
            return res.data.profile;
        } catch(e) {
            if (e.response.status === 404) {
                throw new ExpressError('Profile Not Found', 404)
            } else {
                throw new ExpressError('Server Communication Error', e.response.status)
            }
        }

    }

    async createProfile(data) {
        if (!data.username) {
            throw new ExpressError('Username required to create a profile', 400)
        }
        data.name = data.full_name || ""
        data.birthdate = data.birthdate || "2000-01-01"
        data.profile_picture = data.profile_picture || ""
        data.gender = data.gender || "Male"
        data.bio = data.bio || ""

        const req_url = this.#service_url + '/profiles'

        try {
            const res = await axios.post(req_url, data)
            console.log(res.data)
        } catch(e) {
            throw new ExpressError(e.response.statusText, e.response.status)
        }


    }

    async updateProfile(username, data) {
        const req_url = this.#service_url + '/profiles/' + username

        try {
            const res = await axios.put(req_url, data)
        } catch(e) {
            throw new ExpressError(e.response.statusText, e.response.status)
        }
    }

}

module.exports = new Profiler('http://api.vftg.xyz:8084');