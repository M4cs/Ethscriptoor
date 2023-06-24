class Nonce {
    constructor(startNonce, usedNonces) {
        this.nonce = startNonce;
        this.usedTokens = [];
    }

    increment() {
        this.nonce++;
    }

};

module.exports = {
    Nonce
};