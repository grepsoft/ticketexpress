module.exports = {
    buildDbUri : (host, password) => {
        return `mongodb+srv://${host}:${password}@cluster0.l1uckrs.mongodb.net/?retryWrites=true&w=majority`;
    }
}