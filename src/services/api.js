import axios from 'axios';

class Api {
    constructor() {
        this.axios = axios.create({
            baseURL: 'http://localhost:8000'
        })
    }

    async get(...args) {
        return this.axios.get.call(this.axios, ...args)
    }

    async post(...args) {
        return this.axios.post.call(this.axios, ...args)
    }

    async put(...args) {
        return this.axios.put.call(this.axios, ...args)
    }

    async patch(...args) {
        return this.axios.patch.call(this.axios, ...args)
    }

    async delete(url, data) {
        return this.axios.request({
            url,
            method: 'DELETE',
            data
        });
    }
}

export default new Api();