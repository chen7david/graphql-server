module.exports = {
    getMe: (ctx) => {
        const $me = ctx.$me || false
        if(!$me) throw new Error('not authenticated')
        return $me
    }
}