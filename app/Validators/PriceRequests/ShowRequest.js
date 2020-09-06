'use strict'

class ShowRequest {
    get rules() {
        return {
            first_coin: 'required|string|min:1|max:255|exists:coins,symbol',
            second_coin: 'required|string|min:1|max:255|exists:coins,symbol',
        }
    }

    async authorize() {
        return true
    }
}

module.exports = ShowRequest
